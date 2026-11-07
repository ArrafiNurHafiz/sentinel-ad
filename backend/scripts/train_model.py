"""
SENTINEL-AD — Training script untuk DeepfakeForensicsCNN.

Melatih CNN pada dataset sintetis prosedural (dua gaya: photo & flat-vector,
artefak GAN/manipulasi nyata) dengan augmentasi on-the-fly (JPEG re-encode,
noise, blur, brightness), menyimpan bobot terbaik ke
backend/models/deepfake_cnn.pt, lalu mengevaluasi AKURASI END-TO-END
(NN + fusion + Grad-CAM) pada holdout — termasuk sampel demo asli —
ke backend/data/model_eval.json.

Pemakaian:
    PYTHONPATH=. venv/bin/python scripts/train_model.py --epochs 10 --per-class 400
"""
import os
import sys
import io
import argparse
import json
import time
from datetime import datetime, timezone

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from app.services.forensics import DeepfakeForensicsCNN, RealForensicsEngine
from app.services.synthetic_data import build_dataset

MODELS_DIR = os.path.join(ROOT, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

TRAIN_TRANSFORM = transforms.Compose([
    transforms.Resize((160, 160)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.ColorJitter(brightness=0.06, contrast=0.06),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

VAL_TRANSFORM = transforms.Compose([
    transforms.Resize((160, 160)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


class SyntheticForensicsDataset(Dataset):
    def __init__(self, samples, transform):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        arr, label = self.samples[idx]
        img = Image.fromarray(arr)
        return self.transform(img), torch.tensor(label, dtype=torch.long)


def train(args):
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)
    aug_rng = np.random.default_rng(args.seed + 999)

    print(f"[Train] Membangun dataset sintetis ({args.per_class} per kelas, "
          f"2 gaya: photo + flat-vector)...")
    all_samples = build_dataset(n_per_class=args.per_class, seed=args.seed)

    # Shuffle lalu split 80/20
    rng = np.random.default_rng(args.seed)
    idx = rng.permutation(len(all_samples))
    all_samples = [all_samples[i] for i in idx]
    split = int(len(all_samples) * 0.8)
    train_samples = all_samples[:split]
    val_samples = all_samples[split:]

    train_loader = DataLoader(
        SyntheticForensicsDataset(train_samples, TRAIN_TRANSFORM),
        batch_size=args.batch_size, shuffle=True, num_workers=2
    )
    val_loader = DataLoader(
        SyntheticForensicsDataset(val_samples, VAL_TRANSFORM),
        batch_size=args.batch_size, shuffle=False, num_workers=2
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = DeepfakeForensicsCNN().to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-3)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs, eta_min=1e-5)

    best_val_acc = 0.0
    history = []
    print(f"[Train] Device={device} | Epochs={args.epochs} | "
          f"Train={len(train_samples)} Val={len(val_samples)}")

    for epoch in range(1, args.epochs + 1):
        model.train()
        running_loss, correct, total = 0.0, 0, 0
        t0 = time.time()
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            optimizer.zero_grad()
            logits = model(imgs)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * imgs.size(0)
            preds = logits.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_acc = correct / max(1, total)
        train_loss = running_loss / max(1, total)

        # Validasi (tanpa augmentasi)
        model.eval()
        v_correct, v_total, v_loss = 0, 0, 0.0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(device), labels.to(device)
                logits = model(imgs)
                v_loss += criterion(logits, labels).item() * imgs.size(0)
                v_correct += (logits.argmax(dim=1) == labels).sum().item()
                v_total += labels.size(0)
        val_acc = v_correct / max(1, v_total)
        val_loss = v_loss / max(1, v_total)
        scheduler.step()

        dt = time.time() - t0
        history.append({
            "epoch": epoch,
            "train_acc": round(train_acc, 4),
            "val_acc": round(val_acc, 4),
            "train_loss": round(train_loss, 4),
            "val_loss": round(val_loss, 4),
        })
        print(f"[Train] Epoch {epoch}/{args.epochs} — "
              f"train_acc={train_acc*100:.1f}% val_acc={val_acc*100:.1f}% "
              f"loss={train_loss:.4f} ({dt:.1f}s)", flush=True)

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            ckpt = os.path.join(MODELS_DIR, "deepfake_cnn.pt")
            torch.save({
                "model_state_dict": model.state_dict(),
                "val_acc": val_acc,
                "epoch": epoch,
                "trained_at": datetime.now(timezone.utc).isoformat(),
                "config": {"epochs": args.epochs, "per_class": args.per_class, "seed": args.seed},
            }, ckpt)
            print(f"[Train]   -> Bobot terbaik disimpan ({ckpt}) val_acc={val_acc*100:.1f}%", flush=True)

    # Evaluasi END-TO-END (inferensi penuh + fusion + Grad-CAM) dengan bobot
    # terbaik pada holdout yang belum pernah dilatih (termasuk sampel demo asli).
    print("[Train] Menjalankan evaluasi holdout end-to-end...")
    RealForensicsEngine._model = None
    RealForensicsEngine._grad_cam = None
    import evaluate_model
    report = evaluate_model.run_evaluation()
    if report:
        report["best_val_acc"] = round(best_val_acc, 4)
        report["training_history"] = history
        with open(evaluate_model.OUT_PATH, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"[Train] Holdout end-to-end accuracy: {report['correct']}/"
              f"{report['total_cases']} = {report['accuracy_percentage']}%")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--per-class", type=int, default=500)
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--lr", type=float, default=8e-4)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    train(args)
