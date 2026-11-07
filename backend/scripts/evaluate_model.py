"""
SENTINEL-AD — End-to-End Holdout Evaluation untuk DeepfakeForensicsCNN.

Menjalankan pipeline forensik PENUH (inferensi CNN + fusion skor + Grad-CAM)
pada set holdout yang belum pernah dilatih, termasuk:
  - Sampel demo ASLI (assets/samples) — input yang benar-benar dipakai di demo.
  - Kasus prosedural tak terlihat pada kedua gaya (photo & flat-vector).
  - Augmentasi ringan (blur, brightness, kontras, recompress).

Hasil disimpan ke backend/data/model_eval.json sehingga angka
"Akurasi Model AI" pada dashboard berasal dari evaluasi nyata (out-of-sample),
bukan angka statis.

Pemakaian:
    PYTHONPATH=. venv/bin/python scripts/evaluate_model.py
"""
import os
import sys
import io
import json
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from PIL import Image
from app.services.forensics import RealForensicsEngine
from app.services.synthetic_data import build_holdout_cases

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(ROOT, "data", "model_eval.json")


def run_evaluation(write_output: bool = True):
    cases = build_holdout_cases()
    if not cases:
        print("[Eval] Tidak ada sampel holdout tersedia.")
        return None

    correct = 0
    details = []
    for name, arr, label_deepfake in cases:
        buf = io.BytesIO()
        Image.fromarray(arr).save(buf, format="JPEG", quality=95)
        payload = buf.getvalue()

        result = RealForensicsEngine.analyze_media(
            file_bytes=payload,
            file_name=name,
            content_type="image/jpeg",
            threat_region="KODAM_JAYA",
        )
        pred = bool(result["is_deepfake"])
        ok = pred == bool(label_deepfake)
        correct += 1 if ok else 0
        details.append({
            "case": name,
            "label_deepfake": bool(label_deepfake),
            "predicted_deepfake": pred,
            "confidence": result["confidence_score"],
            "correct": ok,
        })

    accuracy = round(correct / len(cases), 4)
    report = {
        "accuracy": accuracy,
        "accuracy_percentage": round(accuracy * 100, 1),
        "total_cases": len(cases),
        "correct": correct,
        "evaluated_at": datetime.now(timezone.utc).isoformat(),
        "method": "end-to-end-holdout (CNN + fusion + Grad-CAM, out-of-sample)",
        "details": details,
    }

    if write_output:
        os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
        with open(OUT_PATH, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"[Eval] Holdout end-to-end evaluation: {correct}/{len(cases)} = {accuracy*100:.1f}%")
        print(f"[Eval] Report saved to {OUT_PATH}")
    return report


if __name__ == "__main__":
    run_evaluation()
