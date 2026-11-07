# SENTINEL-AD 🛡️
### *Siber Evidensi Nasional & Taktis Intelijen Elektronik — Angkatan Darat*
**Military-Grade Cognitive Warfare Defense & Immutable Evidence Custody System**

[![Status](https://img.shields.io/badge/Status-Production%20Grade%20Engineering-emerald.svg)]()
[![Standard](https://img.shields.io/badge/Standard-ISO%2FIEC%2027037%20Forensics-blue.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-XAI%20%2B%20EVM%20Blockchain%20%2B%20IPFS-8247e5.svg)]()
[![Event](https://img.shields.io/badge/Event-Kartika%20Cyber%20Hackathon%202026-crimson.svg)](https://kartikacyberhackathon.id)
[![Organizer](https://img.shields.io/badge/Organizer-PUSSIBERAD%20%C3%97%20CODEPOLITAN-004d20.svg)](https://codepolitan.com)

---

## 📌 1. Doktrin Pertahanan & Medan Operasi Real-World

Di era **Perang Hibrida & Kognitif (*Hybrid & Cognitive Warfare*)**, musuh negara tidak lagi sekadar menyerang server melalui DDoS atau malware, melainkan membajak persepsi publik dan memecah belah rantai komando militer menggunakan kecerdasan buatan generatif (*Diffusion Models, NeRF, ElevenLabs Voice Cloning*).

### Tiga Titik Kritis yang Diselesaikan SENTINEL-AD:
1. **Bukti Hukum Digital yang Anti-Penyangkalan (*Non-Repudiation*):** Di peradilan militer atau diplomasi internasional, rekaman video di server terpusat rawan dituduh rekayasa, dihapus oleh pihak dalam (*insider threat*), atau disabotase musuh. SENTINEL-AD mengunci rantai bukti (*chain-of-custody*) secara permanen di buku besar terdesentralisasi berstandar **ISO/IEC 27037**.
2. **Explainable AI (Bukan Black-Box):** Dewan juri dan penyidik militer tidak dapat mengambil tindakan hukum hanya berdasarkan persentase probabilitas acak. SENTINEL-AD memproduksi **Grad-CAM Visual Anomaly Heatmap** yang membuktikan piksel mana yang dimanipulasi (area batas rahang GAN, distorsi iris, dan inkonsistensi artikulasi bibir).
3. **Kecepatan Kontra-Disinformasi Sub-Menit:** Mengubah siklus klarifikasi dari 6–48 jam menjadi **kurang dari 3 menit** melalui portal verifikasi publik berbasis QR Code resmi yang langsung dapat diakses masyarakat dan prajurit di lapangan.

---

## 🏛️ 2. Arsitektur Sistem Terintegrasi

```
                              ┌──────────────────────────────────────────────┐
                              │            SENTINEL-AD CLIENT                │
                              │     Next.js 14 + Three.js Holo-Globe         │
                              │       Wagmi v2 Tactical Key Signing          │
                              └───────┬──────────────────────────────┬───────┘
                                      │                              │
                     REST API (Multipart)                            │ JSON-RPC (EIP-712)
                                      ▼                              ▼
             ┌──────────────────────────────────┐        ┌───────────────────────────────┐
             │       AI FORENSICS ENGINE        │        │     POLYGON AMOY TESTNET      │
             │   FastAPI + PyTorch / OpenCV     │        │  TacticalEvidenceRegistry.sol │
             │  - Facial Feature Extractor      │        │  - Lock Evidence Record       │
             │  - Grad-CAM Heatmap Visualizer   │        │  - Emit TacticalC2Alert       │
             │  - Multi-Anomaly Classifier      │        │  - Permanent Chain-of-Custody │
             └────────────────┬─────────────────┘        └───────────────────────────────┘
                              │
                    Pinata SDK API
                              ▼
             ┌──────────────────────────────────┐
             │       IPFS TACTICAL VAULT        │
             │   Resilient Distributed Storage  │
             │   - Forensic JSON Metadata       │
             │   - Source Media Hash Reference  │
             └──────────────────────────────────┘
```

---

## 📂 3. Struktur Repositori Terpadu

```
Kartikacyber/
├── contracts/                  # Smart Contracts Solidity & Hardhat (Polygon Amoy)
│   ├── contracts/
│   │   └── TacticalEvidenceRegistry.sol # Kontrak RBAC berstandar ISO/IEC 27037
│   ├── scripts/deploy.js       # Deployment script otomatis
│   └── test/                   # Test suite unit test lengkap
├── backend/                    # Core AI Forensics Engine (FastAPI)
│   ├── app/
│   │   ├── api/                # Router endpoints (/analyze, /vault, /verify)
│   │   ├── core/               # Konfigurasi & keamanan
│   │   ├── models/             # Schema Pydantic v2
│   │   └── services/           # Real OpenCV/PyTorch Computer Vision & IPFS
│   ├── main.py                 # Application entrypoint
│   └── requirements.txt        # Dependensi Python
├── frontend/                   # Command Center Dashboard & Verifier (Next.js 14)
│   ├── src/                    # Source code UI, 3D Globe, & Web3 hooks
│   └── package.json
├── docs/                       # Dokumentasi Resmi & Spesifikasi Teknis
│   ├── ARCHITECTURE.md         # Spesifikasi arsitektur & matematis Grad-CAM
│   ├── API_SPECIFICATION.md    # Detail endpoint REST API & payload
│   ├── SMART_CONTRACT.md       # Spesifikasi kontrak, ABI, & panduan deploy
│   ├── PRESENTATION_SLIDES.md  # Naskah 10 Slide Pitch Deck Babak Final
│   └── DEMO_SCRIPT.md          # Naskah video demo YouTube (< 10 menit)
├── assets/                     # Panduan thumbnail, screenshot, & media uji
├── PRD.md                      # Product Requirements Document (Versi 3.0 Real-World)
├── AGENTS.md                   # Instruksi rekayasa perangkat lunak militer
├── .env.example                # Template variabel lingkungan
└── README.md
```

---

## ⚡ 4. Panduan Menjalankan Sistem (*Production Quick Start*)

### Prasyarat:
- **Node.js:** v18.17+ atau v20+
- **Python:** v3.10+
- **Web3 Wallet:** MetaMask terhubung ke Polygon Amoy (Chain ID: `80002`)

### 1. Salin Konfigurasi Environment:
```bash
cp .env.example .env
```
Isi variabel RPC Polygon Amoy, Deployer Private Key, dan kredensial Pinata IPFS.

### 2. Uji & Deploy Smart Contract (`contracts/`):
```bash
cd contracts
npm install
npx hardhat test    # Menjalankan unit test lengkap (RBAC, lock, alert)
npx hardhat run scripts/deploy.js --network amoy
```

### 3. Jalankan Engine AI Forensik (`backend/`):
```bash
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Swagger UI interaktif: `http://localhost:8000/docs`

### 4. Jalankan Command Center 3D (`frontend/`):
```bash
cd ../frontend
npm install
npm run dev
```
Akses Command Center: `http://localhost:3000`

---

## 🎯 5. The Real-World Golden Operational Flow

1. **Otorisasi Perwira:** Perwira Analis masuk menggunakan *Tactical Cryptographic Identity* (MetaMask EIP-712).
2. **Ingestion Media Taktis:** Media yang dicurigai (video pidato/perintah pasukan) dimasukkan ke sistem.
3. **Analisis Multimodal Real-Time:** 
   - Backend memproses frame video menggunakan OpenCV & PyTorch.
   - Menghitung anomali frekuensi Laplacian, diskontinuitas gradien spasial, dan fitur wajah.
   - Menghasilkan **Grad-CAM Visual Heatmap** yang menyorot piksel manipulasi secara matematis.
4. **Penguncian Rantai Bukti On-Chain:**
   - Perwira mengklik `[ KUNCI BUKTI RANTAI KOMANDO ]`.
   - Data hash SHA-256, skor keyakinan, IPFS CID, dan tanda tangan perwira terkunci permanen di smart contract `TacticalEvidenceRegistry`.
5. **Siaran Peringatan C2:**
   - Smart contract memancarkan event `TacticalC2Alert`.
   - Bola bumi 3D di Command Center otomatis memancarkan lintasan ancaman merah menuju Kodam wilayah terdampak.
6. **Kontra-Disinformasi Publik:**
   - Sistem menerbitkan Sertifikat Bukti Digital ber-QR Code.
   - Masyarakat dan media memindai QR Code untuk membuktikan keaslian konten dalam waktu kurang dari 3 menit.

---

## 🛡️ Kepatuhan Standar & Kedaulatan Data
- **ISO/IEC 27037:** Standar internasional penanganan dan pemeliharaan barang bukti digital.
- **Air-Gapped Ready:** Dapat dijalankan 100% pada jaringan intranet militer tertutup tanpa ketergantungan API pihak ketiga asing.

*Dikembangkan untuk **Pusat Siber Angkatan Darat (PUSSIBERAD)** — Kartika Cyber Hackathon 2026.*
