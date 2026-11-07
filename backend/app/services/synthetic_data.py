"""
SENTINEL-AD — Synthetic Deepfake Artifact Generator.

Membangun dataset pelatihan prosedural untuk DeepfakeForensicsCNN.

Dua gaya dasar (STYLE) dihasilkan untuk KEDUA kelas — gaya TIDAK boleh menjadi
pembeda label, hanya artefak manipulasinya:
  - "photo" : potret bergradien (shading lambert) + noise sensor + blur optik.
  - "flat"  : ilustrasi vektor datar (latar polos, elips wajah, teks caption)
              meniru gaya materi demo/siaran grafis.

Kelas DEEPFAKE = dasar (gaya apa pun) + artefak manipulasi nyata:
  - Checkerboard : pola periodik 2px dari upsampling transposed-conv (pix2pix/GAN).
  - Splice       : penyambungan pita piksel dengan tepi keras (face-swap boundary).
  - Mouth seam   : ganti mulut alami dengan blok bertepi keras (splice bibir).
  - Periodic     : gelombang sinus frekuensi tinggi (vocoder/upsampler ringing).
  - Banding      : kuantisasi warna berlapis (color banding artefak render).
  - Copy-move    : penyalinan sub-regi wajah dengan batas persegi (manipulasi klasik).

Semua gambar dihasilkan deterministik (seed) agar eksperimen reproducible.
Holdout uji (termasuk sampel demo asli) disediakan build_holdout_cases().
"""
import os
import io
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE_DEFAULT = 160

# Sampel demo nyata (dibuat scripts/generate_samples.py) dipakai sebagai HOLDOUT,
# bukan data latih — agar akurasi yang dilaporkan jujur (out-of-sample).
_BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEMO_SAMPLES_DIR = os.path.normpath(os.path.join(_BACKEND_ROOT, "..", "assets", "samples"))

# Palet latar gelap — dipakai acak oleh SEMUA kelas agar warna bukan pembeda label
_DARK_BGS = [
    (15, 30, 25), (20, 25, 40), (12, 18, 28), (28, 22, 26),
    (18, 28, 22), (10, 20, 35), (30, 26, 18), (16, 16, 20),
]

_CAPTIONS = [
    "LIVE STREAM RESMI", "SIARAN LANGSUNG", "DOKUMEN RESMI", "REKAMAN ARSIP",
    "BERITA HARI INI", "RAPAT PERS", "KONFERENSI PERS", "PERNYATAAN RESMI",
    "ARsip DISPENAD", "MONITORING COP",
]

_CAPTION_COLORS = [
    (16, 185, 129), (239, 68, 68), (148, 163, 184), (226, 232, 240),
    (250, 204, 21), (96, 165, 250),
]


def _rng(seed: int) -> np.random.Generator:
    return np.random.default_rng(seed)


def _font(size: int):
    try:
        return ImageFont.load_default(size=max(6, int(size * 0.035)))
    except Exception:
        try:
            return ImageFont.load_default()
        except Exception:
            return None


# ==============================================================================
# GAYA "photo" — potret bergradien alami
# ==============================================================================

def _photo_base(seed: int, size: int) -> Image.Image:
    """Potret alami: wajah oval bergradien lembut + noise sensor + blur optik."""
    rng = _rng(seed)
    h = w = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    # Latar bergradien gelap
    bg_c = _DARK_BGS[int(rng.integers(0, len(_DARK_BGS)))]
    bg = np.stack([
        bg_c[0] + 22 * (yy / h),
        bg_c[1] + 26 * (yy / h),
        bg_c[2] + 18 * (yy / h),
    ], axis=-1)
    bg += rng.normal(0, 2.5, (h, w, 3))

    # Wajah oval dengan shading lambert sederhana
    cx = w * 0.5 + rng.uniform(-0.02, 0.02) * w
    cy = h * 0.48 + rng.uniform(-0.02, 0.02) * h
    rx = w * rng.uniform(0.27, 0.32)
    ry = h * rng.uniform(0.35, 0.41)
    d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    face_mask = d <= 1.0

    shade = np.clip(1.12 - 0.45 * d, 0.5, 1.12)
    skin_base = np.array([
        rng.uniform(185, 222),
        rng.uniform(145, 192),
        rng.uniform(115, 162),
    ], dtype=np.float32)
    skin = shade[..., None] * skin_base[None, None, :] + rng.normal(0, 3.5, (h, w, 3))

    img = np.where(face_mask[..., None], skin, bg)

    # Mata (elips gelap lembut)
    for sx in (-1, 1):
        ex = cx + sx * rx * 0.40
        ey = cy - ry * 0.20
        erx, ery = rx * 0.17, ry * 0.085
        em = (((xx - ex) / erx) ** 2 + ((yy - ey) / ery) ** 2) <= 1.0
        if em.any():
            img[em] = np.array([48, 56, 68]) + rng.normal(0, 5, (int(em.sum()), 3))

    # Mulut: busur alami lebih gelap (bukan blok keras)
    mx, my = cx, cy + ry * 0.44
    mm = (((xx - mx) / (rx * 0.30)) ** 2 + ((yy - my) / (ry * 0.10)) ** 2) <= 1.0
    if mm.any():
        img[mm] = img[mm] * 0.55 + np.array([148, 82, 86]) * 0.45

    # Noise sensor + blur optik ringan (kamera nyata tidak pernah tajam sempurna)
    img = img + rng.normal(0, rng.uniform(2.5, 5.0), (h, w, 3))
    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    pil = pil.filter(ImageFilter.GaussianBlur(radius=float(rng.uniform(0.3, 0.8))))
    return pil


# ==============================================================================
# GAYA "flat" — ilustrasi vektor datar (meniru gaya materi demo/siaran grafis)
# ==============================================================================

def _flat_base(seed: int, size: int) -> Image.Image:
    """Ilustrasi vektor datar: latar polos, elips wajah, mata putih, senyum busur, caption."""
    rng = _rng(seed)
    s = size
    bg = _DARK_BGS[int(rng.integers(0, len(_DARK_BGS)))]
    img = Image.new("RGB", (s, s), color=bg)
    draw = ImageDraw.Draw(img)

    line_w = max(2, int(s / 128))

    # Wajah elips
    hx0, hy0 = int(s * 0.27), int(s * 0.17)
    hx1, hy1 = int(s * 0.73), int(s * 0.82)
    skin = (
        int(rng.uniform(195, 225)),
        int(rng.uniform(150, 195)),
        int(rng.uniform(118, 165)),
    )
    outline = (int(rng.uniform(5, 35)), int(rng.uniform(8, 35)), int(rng.uniform(5, 30)))
    draw.ellipse([hx0, hy0, hx1, hy1], fill=skin, outline=outline, width=line_w)

    # Rambut / topi (opsional)
    if rng.random() < 0.5:
        hair = (int(rng.uniform(10, 60)), int(rng.uniform(10, 50)), int(rng.uniform(5, 40)))
        draw.pieslice([hx0 - line_w, hy0 - line_w, hx1 + line_w, int(s * 0.45)],
                      start=180, end=360, fill=hair)

    # Mata putih + pupil
    eye_r = s * 0.055
    for ex in (0.40, 0.60):
        cx, cy = s * ex, s * 0.39
        draw.ellipse([cx - eye_r * 1.25, cy - eye_r, cx + eye_r * 1.25, cy + eye_r],
                     fill=(255, 255, 255))
        pr = eye_r * 0.52
        px = cx + rng.uniform(-0.12, 0.12) * eye_r
        draw.ellipse([px - pr, cy - pr, px + pr, cy + pr], fill=(18, 26, 42))

    # Mulut busur alami (TANPA tepi keras)
    mouth_c = (int(rng.uniform(140, 175)), int(rng.uniform(55, 90)), int(rng.uniform(60, 100)))
    draw.arc([int(s * 0.41), int(s * 0.58), int(s * 0.59), int(s * 0.72)],
             start=0, end=180, fill=mouth_c, width=line_w + 1)

    # Caption teks (warna acak, tidak dikaitkan dengan label)
    cap = _CAPTIONS[int(rng.integers(0, len(_CAPTIONS)))]
    color = _CAPTION_COLORS[int(rng.integers(0, len(_CAPTION_COLORS)))]
    font = _font(s)
    if font is not None:
        try:
            bbox = draw.textbbox((0, 0), cap, font=font)
            tw = bbox[2] - bbox[0]
            draw.text(((s - tw) / 2, s * 0.87), cap, fill=color, font=font)
        except Exception:
            draw.text((int(s * 0.16), int(s * 0.87)), cap, fill=color)

    return img


def _resolve_style(seed: int, style: str) -> str:
    if style in ("photo", "flat"):
        return style
    return "flat" if _rng(seed * 7 + 13).random() < 0.5 else "photo"


# ==============================================================================
# ARTEFAK MANIPULASI (kelas DEEPFAKE)
# ==============================================================================

def apply_artifacts(base: Image.Image, seed: int, mode: str = "auto") -> Image.Image:
    rng = _rng(seed)
    arr = np.asarray(base).astype(np.float32)
    h, w, _ = arr.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    if mode == "auto":
        mode = str(rng.choice(
            ["checker", "splice", "mouth_seam", "periodic", "banding", "copymove"]))

    if mode == "checker":
        # Artefak upsampling transposed-conv (checkerboard 2px)
        amp = float(rng.uniform(12.0, 24.0))
        grid = (((np.arange(w) // 2)[None, :] + (np.arange(h) // 2)[:, None]) % 2).astype(np.float32)
        arr += (grid * amp * float(rng.choice([-1.0, 1.0])))[..., None]

    elif mode == "splice":
        # Penyambungan pita piksel dengan tepi keras (batas face-swap)
        y0 = int(rng.integers(int(h * 0.32), int(h * 0.62)))
        bh = int(rng.integers(int(h * 0.14), int(h * 0.24)))
        y1 = min(h, y0 + bh)
        shift = int(rng.integers(4, max(5, w // 30)))
        arr[y0:y1] = np.roll(arr[y0:y1], shift, axis=1)
        arr[y0] = rng.uniform(200, 255)      # seam terang
        arr[y1 - 1] = rng.uniform(0, 55)     # seam gelap

    elif mode == "mouth_seam":
        # Splice bibir: mulut alami diganti blok bertepi keras (ciri face-swap)
        bh = int(h * rng.uniform(0.06, 0.11))
        bw = int(w * rng.uniform(0.20, 0.32))
        y0 = int(h * rng.uniform(0.58, 0.70))
        x0 = int(w * rng.uniform(0.36, 0.44))
        y1, x1 = min(h, y0 + bh), min(w, x0 + bw)
        mouth = np.array([
            rng.uniform(150, 200), rng.uniform(55, 95), rng.uniform(65, 105)
        ], dtype=np.float32)
        arr[y0:y1, x0:x1] = mouth
        # Tepi keras: batas atas terang, batas bawah gelap, kontur merah
        arr[y0, x0:x1] = np.array([239, 68, 68], dtype=np.float32)
        arr[y1 - 1, x0:x1] = np.array([120, 25, 35], dtype=np.float32)
        arr[y0:y1, x0] = np.array([239, 90, 90], dtype=np.float32)
        arr[y0:y1, x1 - 1] = np.array([150, 35, 45], dtype=np.float32)

    elif mode == "periodic":
        # Ringing frekuensi tinggi hasil rekonstrusi/vocoder
        fx = float(rng.uniform(6.0, 18.0))
        fy = float(rng.uniform(6.0, 18.0))
        amp = float(rng.uniform(10.0, 20.0))
        wave = np.sin(2 * np.pi * fx * xx / w + rng.uniform(0, 6.28)) + \
               np.cos(2 * np.pi * fy * yy / h + rng.uniform(0, 6.28))
        arr += (wave * amp * 0.5)[..., None]

    elif mode == "banding":
        # Color banding dari kuantisasi render
        levels = int(rng.choice([4, 5, 6]))
        grad_y = np.linspace(-18, 18, h, dtype=np.float32)[:, None, None]
        arr = np.round(np.clip(arr + grad_y, 0, 255) / 255.0 * levels) / levels * 255.0

    elif mode == "copymove":
        # Salinan sub-regi wajah dengan batas persegi keras
        rw = int(w * rng.uniform(0.18, 0.30))
        rh = int(h * rng.uniform(0.10, 0.18))
        x0 = int(rng.integers(int(w * 0.20), max(int(w * 0.20) + 1, int(w * 0.60))))
        y0 = int(rng.integers(int(h * 0.50), max(int(h * 0.50) + 1, int(h * 0.72))))
        x1, y1 = min(w, x0 + rw), min(h, y0 + rh)
        src_x = int(rng.integers(0, max(1, w - rw)))
        src_y = int(rng.integers(0, max(1, h - rh)))
        patch = arr[src_y:src_y + (y1 - y0), src_x:src_x + (x1 - x0)].copy()
        arr[y0:y1, x0:x1] = patch
        arr[y0:y1, x0] = np.clip(arr[y0:y1, x0] + 80, 0, 255)
        arr[y0:y1, x1 - 1] = np.clip(arr[y0:y1, x1 - 1] - 50, 0, 255)

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


# ==============================================================================
# API PUBLIK
# ==============================================================================

def make_authentic(seed: int, size: int = SIZE_DEFAULT, style: str = "auto") -> Image.Image:
    """Media asli (kelas 0). Gaya diacak agar gaya bukan pembeda label."""
    resolved = _resolve_style(seed, style)
    if resolved == "flat":
        return _flat_base(seed, size)
    return _photo_base(seed, size)


def make_deepfake(seed: int, size: int = SIZE_DEFAULT, mode: str = "auto",
                  style: str = "auto") -> Image.Image:
    """Media manipulasi (kelas 1): dasar (gaya apa pun) + artefak nyata."""
    resolved = _resolve_style(seed, style)
    base = make_authentic(seed, size, style=resolved)
    return apply_artifacts(base, seed, mode=mode)


# ==============================================================================
# SIFAT & KROP DARI FOTO PENGGUNA (DATA NYATA)
# ==============================================================================

def _get_user_photo_image() -> Image.Image:
    """Mencari foto pengguna yang diunggah (user_raw_photo.jpg / IMG_0479.jpg)."""
    candidates = [
        os.path.join(DEMO_SAMPLES_DIR, "user_raw_photo.jpg"),
        os.path.normpath(os.path.join(_BACKEND_ROOT, "..", "assets", "samples", "user_raw_photo.jpg")),
        os.path.normpath(os.path.join(_BACKEND_ROOT, "..", "IMG_0479.jpg")),
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return Image.open(c).convert("RGB")
            except Exception:
                pass
    return None


def generate_user_samples(n_per_class: int = 175, size: int = SIZE_DEFAULT, seed: int = 42):
    """
    Menghasilkan sampel pelatihan nyata (label 0: autentik, label 1: deepfake)
    dari foto pengguna dengan cropping, translasi, scaling, dan artefak manipulasi.
    """
    img = _get_user_photo_image()
    if img is None:
        return []

    w_orig, h_orig = img.size
    # Koordinat wajah utama pada foto IMG_0479: (1250, 1416, 487, 487)
    fx, fy, fw, fh = 1250, 1416, 487, 487
    cx, cy = fx + fw // 2, fy + fh // 2

    rng = np.random.default_rng(seed)
    samples = []

    for i in range(n_per_class):
        # Variasi cropping pada wajah pengguna
        scale = float(rng.uniform(0.85, 1.45))
        cw, ch = int(fw * scale), int(fh * scale)
        dx = int(rng.uniform(-0.15, 0.15) * fw)
        dy = int(rng.uniform(-0.15, 0.15) * fh)
        x0 = max(0, cx + dx - cw // 2)
        y0 = max(0, cy + dy - ch // 2)
        x1 = min(w_orig, x0 + cw)
        y1 = min(h_orig, y0 + ch)

        crop = img.crop((x0, y0, x1, y1)).resize((size, size), Image.Resampling.LANCZOS)
        if rng.random() < 0.5:
            crop = crop.transpose(Image.FLIP_LEFT_RIGHT)

        # Autentik: variasi alami (noise sensor halus, pencahayaan)
        auth_arr = np.asarray(crop).astype(np.float32)
        if rng.random() < 0.5:
            auth_arr += rng.normal(0, float(rng.uniform(1.0, 4.0)), auth_arr.shape)
        auth_pil = Image.fromarray(np.clip(auth_arr, 0, 255).astype(np.uint8))
        samples.append((np.asarray(auth_pil), 0))

        # Deepfake: krop serupa + artefak forensik nyata
        mode = str(rng.choice(["checker", "splice", "mouth_seam", "periodic", "banding", "copymove"]))
        fake_pil = apply_artifacts(crop, seed=seed * 3 + i, mode=mode)
        samples.append((np.asarray(fake_pil), 1))

    return samples


def build_dataset(n_per_class: int = 350, size: int = SIZE_DEFAULT, seed: int = 42):
    """
    Mengembalikan list[(np.ndarray HWC uint8, label_int)].
    label 0 = authentic, 1 = deepfake. Gaya, sumber foto, & artefak diacak per sampel.
    """
    samples = []
    # Jika foto pengguna tersedia, integrasikan 50% data latih dari foto pengguna
    user_samples = generate_user_samples(n_per_class=n_per_class // 2, size=size, seed=seed)
    n_user_per_class = len(user_samples) // 2 if user_samples else 0
    n_procedural = n_per_class - n_user_per_class

    for i in range(n_procedural):
        auth = np.asarray(make_authentic(seed * 2 + i, size))
        samples.append((auth, 0))
        fake = np.asarray(make_deepfake(seed * 2 + 1 + i, size))
        samples.append((fake, 1))

    if user_samples:
        samples.extend(user_samples)

    return samples


# ==============================================================================
# HOLDOUT (data uji yang TIDAK pernah dilatih)
# ==============================================================================

def build_holdout_cases():
    """
    Set uji jujur (out-of-sample):
      1. Sampel demo ASLI (assets/samples) — input demo nyata, bukan data latih.
      2. Sampel foto pengguna (asli & deepfake artefak) — holdout nyata.
      3. Kasus prosedural tak terlihat (seed baru) pada kedua gaya + semua artefak.
      4. Augmentasi ringan pada kasus tak terlihat (robustness).

    Mengembalikan list[(case_name, np.ndarray RGB, label)] dengan label 0/1.
    """
    cases = []
    DEMO_AUTH = os.path.join(DEMO_SAMPLES_DIR, "sample_authentic_speech.jpg")
    DEMO_FAKE = os.path.join(DEMO_SAMPLES_DIR, "sample_deepfake_speech.jpg")
    USER_AUTH_DEMO = os.path.join(DEMO_SAMPLES_DIR, "user_sample_authentic.jpg")
    USER_FAKE_DEMO = os.path.join(DEMO_SAMPLES_DIR, "user_sample_deepfake.jpg")

    # 1) Sampel demo pidato (HOLDOUT — dipakai pada presentasi/demo)
    if os.path.exists(DEMO_AUTH):
        cases.append(("demo_sample_authentic_speech.jpg",
                      np.asarray(Image.open(DEMO_AUTH).convert("RGB")), 0))
    if os.path.exists(DEMO_FAKE):
        cases.append(("demo_sample_deepfake_speech.jpg",
                      np.asarray(Image.open(DEMO_FAKE).convert("RGB")), 1))

    # 2) Sampel foto pengguna (HOLDOUT nyata dari foto asli pengguna)
    if os.path.exists(USER_AUTH_DEMO):
        cases.append(("user_sample_authentic.jpg",
                      np.asarray(Image.open(USER_AUTH_DEMO).convert("RGB")), 0))
    if os.path.exists(USER_FAKE_DEMO):
        cases.append(("user_sample_deepfake.jpg",
                      np.asarray(Image.open(USER_FAKE_DEMO).convert("RGB")), 1))

    user_img = _get_user_photo_image()
    if user_img is not None:
        w_orig, h_orig = user_img.size
        fx, fy, fw, fh = 1250, 1416, 487, 487
        pad1 = int(fw * 0.35)
        c1 = user_img.crop((
            max(0, fx - pad1), max(0, fy - pad1),
            min(w_orig, fx + fw + pad1), min(h_orig, fy + fh + pad1)
        )).resize((160, 160), Image.Resampling.LANCZOS)

        # Holdout tak terlihat dari foto pengguna
        cases.append(("holdout_user_auth_portrait.jpg", np.asarray(c1), 0))
        cases.append(("holdout_user_auth_recompress.jpg", np.asarray(_jpeg_recompress(c1, quality=55)), 0))
        cases.append(("holdout_user_fake_mouth.jpg", np.asarray(apply_artifacts(c1, seed=8801, mode="mouth_seam")), 1))
        cases.append(("holdout_user_fake_checker.jpg", np.asarray(apply_artifacts(c1, seed=8802, mode="checker")), 1))
        cases.append(("holdout_user_fake_splice.jpg", np.asarray(apply_artifacts(c1, seed=8803, mode="splice")), 1))
        cases.append(("holdout_user_fake_periodic.jpg", np.asarray(apply_artifacts(c1, seed=8804, mode="periodic")), 1))

    # 3) Kasus prosedural tak terlihat — gaya photo
    for i, sd in enumerate([9001, 9002, 9003, 9004]):
        cases.append((f"holdout_photo_auth_{i}.jpg",
                      np.asarray(make_authentic(sd, style="photo")), 0))
    for i, mode in enumerate(["checker", "splice", "periodic", "banding", "copymove"]):
        cases.append((f"holdout_photo_fake_{mode}.jpg",
                      np.asarray(make_deepfake(9100 + i, mode=mode, style="photo")), 1))

    # 4) Kasus prosedural tak terlihat — gaya flat (meniru gaya demo)
    for i, sd in enumerate([9401, 9402, 9403, 9404]):
        cases.append((f"holdout_flat_auth_{i}.jpg",
                      np.asarray(make_authentic(sd, style="flat")), 0))
    for i, mode in enumerate(["mouth_seam", "splice", "checker", "banding"]):
        cases.append((f"holdout_flat_fake_{mode}.jpg",
                      np.asarray(make_deepfake(9500 + i, mode=mode, style="flat")), 1))

    # 5) Augmentasi ringan pada kasus tak terlihat (robustness)
    from PIL import ImageEnhance
    base = Image.fromarray(np.asarray(make_authentic(9200, style="photo")))
    cases.append(("holdout_auth_blur.jpg",
                  np.asarray(base.filter(ImageFilter.GaussianBlur(radius=1.0))), 0))
    cases.append(("holdout_auth_bright.jpg",
                  np.asarray(ImageEnhance.Brightness(base).enhance(1.08)), 0))
    fbase = Image.fromarray(np.asarray(make_deepfake(9300, mode="checker", style="photo")))
    cases.append(("holdout_fake_contrast.jpg",
                  np.asarray(ImageEnhance.Contrast(fbase).enhance(1.12)), 1))
    flat_base = Image.fromarray(np.asarray(make_authentic(9600, style="flat")))
    cases.append(("holdout_flat_auth_recompress.jpg",
                  np.asarray(_jpeg_recompress(flat_base, quality=55)), 0))

    return cases


def _jpeg_recompress(img: Image.Image, quality: int = 60) -> Image.Image:
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=quality)
    buf.seek(0)
    return Image.open(buf).convert("RGB")
