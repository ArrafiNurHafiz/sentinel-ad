# Product Requirements Document (PRD) — SENTINEL-AD
### Military-Grade Cognitive Warfare Defense & Immutable Evidence Custody System

> **Document Status:** Active / Production Engineering Standard  
> **Target Deploy:** Pusat Siber Angkatan Darat (PUSSIBERAD) & Satuan Siber Jajaran TNI AD  
> **Standard Compliance:** ISO/IEC 27037 (Digital Evidence Handling), ISO/IEC 27001, EIP-712, NIST SP 800-86  
> **Version:** 3.0 (Production Architecture & Real-World Defense Grade)  
> **Classification:** Restricted (Doktrin Pertahanan Siber Nasional)  

---

## 1. Executive Summary & Problem Space

### 1.1 The Operational Battlefield (Real-World Threat)
Perang modern telah bertransformasi dari sekadar pertempuran kinetik dan serangan siber teknis (DDoS/Malware) menjadi **Perang Hibrida & Kognitif (*Hybrid & Cognitive Warfare*)**. Pihak lawan, sindikat spionase siber asing, serta aktor non-negara kini memanfaatkan model kecerdasan buatan generatif canggih (*Diffusion Models, NeRF, LivePortrait, ElevenLabs Synthetic Speech*) untuk memproduksi:
1. **Rekayasa Visual/Vokal Komandan Lapangan & Pimpinan TNI AD:** Perintah penarikan pasukan palsu, pernyataan provokasi yang memecah persatuan dengan rakyat, serta rekayasa insiden di wilayah perbatasan atau daerah operasi rawan.
2. **Krisis Rantai Bukti Hukum (*Chain-of-Custody Failure*):** Di ranah hukum militer dan diplomasi internasional, bukti digital yang tersimpan pada server terpusat (*centralized relational database*) sangat rentan terhadap penyangkalan (*repudiation*), intervensi pihak dalam (*insider tampering*), atau serangan siber musuh yang melenyapkan data.
3. **Keterlambatan Penanggulangan (*Response Lag*):** Siklus triase manual memakan waktu 6–48 jam. Pada menit ke-15, disinformasi deepfake sudah tersebar ke ratusan ribu gawai masyarakat dan prajurit, memicu kegagalan misi taktis sebelum klarifikasi resmi diterbitkan.

### 1.2 System Mission
**SENTINEL-AD** adalah sistem pertahanan perang kognitif berskala industri militer yang menyatukan:
- **Multimodal AI Deepfake Forensics:** Inferensi paralel pada artefak visual biologis (Grad-CAM Explainable AI) dan ketidakteraturan spektrum vokal.
- **Immutable Blockchain Evidence Custody:** Penguncian bukti forensik digital berbasis tanda tangan kriptografis perwira (EIP-712) dan smart contract yang tidak dapat diubah (*tamper-proof, append-only*).
- **Tactical C2 Common Operational Picture (COP):** Pemetaan insiden geosirkular 3D secara *real-time* ke seluruh node Komando Daerah Militer (Kodam).
- **Public Counter-PsyOps Verification:** Portal pembuktian keabsahan publik instan berbasis tanda tangan kriptografis untuk mematahkan perang urat syaraf musuh seketika.

---

## 2. Real-World Architectural Standards & Compliance

### 2.1 Standar Hukum Forensik Digital (ISO/IEC 27037 & NIST SP 800-86)
Sistem mematuhi empat pilar utama penanganan barang bukti digital:
1. **Identification:** Algoritma SHA-256 dan per-frame perceptual hashing (pHash) untuk mengunci identitas unik media digital saat pertama kali diunggah.
2. **Collection & Preservation:** Penyimpanan redundan pada sistem terdesentralisasi (IPFS Cluster) dengan penandaan hash permanen yang tidak dapat dimanipulasi oleh siapa pun.
3. **Examination & Analysis:** Penerapan Explainable AI (XAI) yang mengekstrak bukti visual objektif (aktivasi neuron konvolusi pada lapisan terakhir) yang dapat diuji ulang secara independen di laboratorium forensik.
4. **Documentation & Chain-of-Custody:** Pencatatan setiap tindakan investigasi pada buku besar terdistribusi (*distributed ledger*) dengan menyertakan *cryptographic timestamp* dan tanda tangan digital perwira pemeriksa.

### 2.2 Kedaulatan Data & Air-Gapped Deployment
- Sistem dirancang bebas dari ketergantungan API pihak ketiga komersial asing.
- Seluruh model AI dijalankan secara lokal pada infrastruktur server komputasi GPU/CPU satuan (*On-Premise / Containerized*).
- Smart contract kompatibel penuh dengan jaringan **Private EVM Militer** (Hyperledger Besu / Private Quorum) serta dapat dijembatani (*bridged*) ke jaringan publik tersertifikasi (Polygon Enterprise) untuk keperluan verifikasi masyarakat.

---

## 3. Real-World Feature Specifications (Production Level)

### 3.1 AI Forensics Pipeline (Multimodal & Explainable)
Bukan sekadar kalkulasi acak atau mock endpoint, melainkan pipeline berstandar produksi:
1. **Frame Demuxing & Preprocessing:**
   - Ekstraksi frame video dinamis (1 keyframe per interval 0.3-0.5 detik).
   - Normalisasi dimensi (224x224 / 256x256), deteksi wajah otomatis (Face RoI bounding box) menggunakan algoritma deteksi berpresisi tinggi.
2. **Convolutional & Spatial Artifact Analysis:**
   - Evaluasi representasi fitur menggunakan arsitektur deep learning terlatih (MesoNet / EfficientNet-B4 / ResNet backbone) yang dilatih mendeteksi artefak blending GAN, batas kompresi frekuensi tinggi, dan diskontinuitas tekstur kulit.
3. **Explainable AI (Grad-CAM Engine):**
   - Mengambil gradien aktivasi layer konvolusi terakhir terhadap kelas target (Manipulated).
   - Menghasilkan matriks 2D panas (*heatmap*) berwarna merah-ke-biru yang di-overlay di atas wajah subjek asli.
   - Membuktikan secara visual bagian mana yang direkayasa (misal: area mata, rongga mulut, tepi garis rambut).
4. **Spectral Voice Biometrics:**
   - Transformasi Fourier (STFT) pada kanal audio untuk mendeteksi *vocoder phase discontinuity* dan artefak kompresi khas model suara generatif (ElevenLabs/RVC/Bark).

### 3.2 Cryptographic Chain-of-Custody Engine
1. **EIP-712 Typed Structured Data Signing:**
   - Perwira analis menandatangani payload investigasi secara kriptografis menggunakan *Tactical Cryptographic Key* (Hardware Token / Web3 Wallet).
   - Format tanda tangan mengikat data: `mediaHash`, `officerAddress`, `timestamp`, `confidenceScore`, dan `threatRegion`.
2. **Smart Contract `TacticalEvidenceRegistry.sol` (Role-Based Access Control):**
   - Menggunakan standar OpenZeppelin `AccessControl`.
   - Hanya alamat perwira terdaftar (`OFFICER_ROLE`) atau node komando terverifikasi (`COMMANDER_ROLE`) yang memiliki otorisasi untuk mendaftarkan bukti.
   - Fungsi darurat (*Pausable*) untuk perlindungan terhadap anomali jaringan.
3. **Desentralized Storage (IPFS Cluster / Pinata Dedicated Gateway):**
   - Penyimpanan berkas terenkripsi dengan Content Identifier (CID) unik berbasis hash konten.

### 3.3 Command & Control (C2) Tactical Interface
1. **3D Geospatial Threat Map (Three.js):**
   - Menampilkan visualisasi bola bumi interaktif berfokus pada wilayah NKRI.
   - Menandai lokasi 15 Komando Daerah Militer (Kodam Jaya, Kodam I/BB, Kodam III/Slw, Kodam IV/Dip, Kodam V/Brw, Kodam VI/Mlw, Kodam IX/Udy, Kodam XIV/Hsn, Kodam XVII/Cen, dll).
   - Menampilkan lintasan serangan informasi (*threat vectors*) secara real-time berdasarkan event on-chain `TacticalC2Alert`.
2. **Dual-Pane Forensic Workspace:**
   - Tampilan visual berdampingan antara Media Asli dan Heatmap XAI.
   - Panel metadata forensik: Hash SHA-256, resolusi, framerate, rincian skor anomali, status blok, dan tx hash.
3. **Digital Evidence Certificate Generation:**
   - Menghasilkan sertifikat resmi forensik bertaraf militer (PDF/PNG ber-watermark kriptografis) yang memuat ringkasan bukti, signature perwira, dan QR Code publik.

### 3.4 Public Verification Portal (Counter-PsyOps)
- URL publik ringan (*low-bandwidth accessible*) yang dapat dibuka melalui smartphone prajurit atau masyarakat luas: `/verify/{sha256}`.
- Cukup memindai QR Code untuk mencocokkan hash video dengan blockchain:
  - Jika video terdaftar palsu: Muncul stempel merah tegas: **"RESMI DIVERIFIKASI PUSSIBERAD: KONTEN ADALAH REKAYASA/DEEPFAKE"**.
  - Jika video resmi terbitan TNI: Muncul stempel hijau terverifikasi: **"DOKUMEN RESMI TERVERIFIKASI TNI AD"**.

---

## 4. Non-Functional & Enterprise Production Requirements

### 4.1 Performance & Latency SLA
- **Inferensi AI:** < 8 detik untuk video berdurasi hingga 30 detik pada CPU modern, < 2.5 detik pada GPU NVIDIA T4/RTX.
- **Interaksi Blockchain:** < 3 detik untuk finalisasi blok di Polygon Amoy / < 1 detik pada Private EVM Besu.
- **API Throughput:** Mampu melayani hingga 200 permintaan konkuren dengan utilisasi worker Uvicorn asinkron.

### 4.2 Security & Threat Mitigation
- **Private Key Security:** Private key perwira disimpan secara aman di sisi klien (Hardware Security Module / Browser Secure Enclave); server backend tidak pernah menyimpan atau mentransmisikan private key perwira.
- **Input Sanitization:** Pemeriksaan ketat tipe MIME dan verifikasi magic byte berkas biner untuk mencegah eksploitasi Remote Code Execution (RCE) lewat file media berbahaya.
- **API Hardening:** Rate limiting berbasis IP/Token, enkripsi TLS 1.3, dan CORS terbatas pada domain komando terdaftar.

---

## 5. Production API Specifications

| Method | Endpoint | Fungsi | Payload Utama |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Pemeriksaan kesehatan layanan, status model PyTorch, dan node blockchain | - |
| `POST` | `/api/v1/forensics/analyze` | Pemrosesan inferensi deepfake multimodal & ekstraksi Grad-CAM Heatmap | `file: Multipart`, `threat_region: string` |
| `POST` | `/api/v1/vault/archive` | Pengarsipan paket bukti forensik ke IPFS | `JSON Payload (SHA256, Officer, Metadata)` |
| `GET` | `/api/v1/forensics/verify/{hash}` | Endpoint publik pemindaian QR Code kontra-disinformasi | `sha256_hash: string (Path param)` |

---

## 6. Real-World Roadmap & Deployment Timeline

1. **Tahap 1: Core Engine & Smart Contract Hardening (Minggu 1):**  
   Penyempurnaan arsitektur smart contract berstandar OpenZeppelin, pipeline inferensi PyTorch lokal dengan ekstraksi Grad-CAM riil, dan penyiapan monorepo terpadu.
2. **Tahap 2: Command Center 3D & EIP-712 Signing (Minggu 2):**  
   Pembangunan UI Dashboard militer 3D (Next.js 14 + Three.js), visualisasi data geo-intelijen, dan integrasi penandatanganan transaksi forensik on-chain.
3. **Tahap 3: Tactical Integration & Public Verification (Minggu 3):**  
   Pengujian end-to-end seluruh alur operasional: deteksi -> bukti terkunci -> siaran peringatan C2 -> verifikasi publik instan via smartphone.
4. **Tahap 4: Hardening, Dokumentasi & Kesiapan Uji Satuan (Minggu 4):**  
   Pengujian beban (*stress test*), pembungkusan container Docker untuk deployment *on-premise*, finalisasi rekaman video, dan pengajuan resmi ke Dewan Juri PUSSIBERAD.
