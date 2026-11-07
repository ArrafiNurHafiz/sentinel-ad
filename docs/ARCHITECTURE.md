# System Architecture & Technical Specifications — SENTINEL-AD
### Military-Grade Cognitive Warfare Defense & Immutable Evidence Custody System

> **Classification:** Restricted / Production Defense Blueprint  
> **Target Environment:** Pusat Siber Angkatan Darat (PUSSIBERAD) & Satuan Siber Wilayah  
> **Compliance:** ISO/IEC 27037 (Digital Evidence Handling), EIP-712, NIST SP 800-86  
> **Version:** 3.0 (Production Grade)  

---

## 1. High-Level Architectural Topology

```
+---------------------------------------------------------------------------------------------------------+
|                                    TACTICAL C2 OPERATIONS CLIENT                                        |
|                                                                                                         |
|  [ Next.js 14 Web Application / Command Center ]                                                       |
|    ├── 3D Geospatial Threat Monitor (Three.js / WebGL / 15 Kodam Nodes Visualization)                   |
|    ├── Forensic Dual-Pane Inspection Panel (Original Media vs Real Grad-CAM Anomaly Map)                 |
|    ├── Officer Tactical Cryptographic Key (EIP-712 Typed Structured Data Signer via Wagmi/Viem)         |
|    └── Anti-PsyOps Public Verifier Portal (Lightweight Zero-Dependency Verification Interface)          |
+----------------------------------------------------+----------------------------------------------------+
                                                     |
                     +-------------------------------+-------------------------------+
                     |                                                               |
                     | REST API (Multipart Payload / TLS 1.3)                        | JSON-RPC (EVM RPC / TLS)
                     v                                                               v
+------------------------------------------------+       +------------------------------------------------+
|       PRODUCTION AI FORENSICS ENGINE           |       |           BLOCKCHAIN EVIDENCE LEDGER           |
|                                                |       |                                                |
|  [ FastAPI Async Python 3.10+ Service ]        |       |  [ Polygon Amoy / Private EVM (Besu/Quorum) ]  |
|    ├── Media Stream Parser & Frame Demuxer     |       |    ├── TacticalEvidenceRegistry.sol            |
|    │   (OpenCV VideoCapture / Magic Byte Check)|       |    │   - OpenZeppelin AccessControl (RBAC)      |
|    ├── Face Extraction & Normalization         |       |    │   - Append-Only Evidence Storage           |
|    │   (Deep Face RoI / Facial Landmark Crop)  |       |    │   - ReentrancyGuard & Custom Errors        |
|    ├── PyTorch Deepfake Inference Pipeline     |       |    │   - Event: EvidenceLocked                 |
|    │   (Frequency Domain + CNN/ViT Backbone)   |       |    │   - Event: TacticalC2Alert                |
|    ├── Mathematical Grad-CAM Visual Engine     |       +------------------------------------------------+
|    │   (Layer Activation Gradients Overlay)    |
|    └── Cryptographic Engine (SHA-256 / Keccak) |
+-----------------------+------------------------+
                        |
                        | HTTP Multipart / S3 API / Pinata API
                        v
+------------------------------------------------+
|        DECENTRALIZED TACTICAL VAULT            |
|                                                |
|  [ IPFS Cluster / Dedicated Pinata Gateway ]   |
|    ├── Immutable Media Fingerprint Archive     |
|    ├── Cryptographic Forensic Report (JSON)    |
|    └── Content-Addressed Storage (CID Anchors) |
+------------------------------------------------+
```

---

## 2. Deep Dive: Real Explainable AI (XAI) Forensics Pipeline

### 2.1 The Grad-CAM Mathematical Formulation
Untuk memenuhi syarat pembuktian ilmiah di pengadilan militer (*forensic admissibility*), SENTINEL-AD menerapkan **Gradient-weighted Class Activation Mapping (Grad-CAM)**:

1. **Bobot Kepentingan Fitur ($\alpha_k^c$):**
   Dihitung dengan mengambil rata-rata global (*global average pooling*) dari gradien skor kelas $y^c$ (dalam kasus ini kelas *Deepfake*) terhadap feature map aktivasi $A^k$ pada convolutional layer terakhir:
   $$\alpha_k^c = \frac{1}{Z} \sum_{i} \sum_{j} \frac{\partial y^c}{\partial A_{i,j}^k}$$
   di mana $Z$ adalah jumlah piksel pada feature map ($u \times v$).

2. **Peta Aktivasi Visual ($L_{\text{Grad-CAM}}^c$):**
   Kombinasi linier tertimbang dari peta fitur yang dilewatkan fungsi aktivasi ReLU untuk hanya menangkap fitur yang berkontribusi positif terhadap indikasi manipulasi:
   $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$$

3. **Color Normalization & Spatial Blending:**
   Peta $L^c$ dinormalisasi ke rentang $[0, 255]$, diaplikasikan colormap Jet/Turbo (merah = intensitas tertinggi), lalu di-overlay di atas citra wajah asli dengan faktor transparansi $\alpha = 0.55$. Area merah mengindikasikan zona sintetis konkret: *boundary blending GAN* pada rahang, distorsi tekstur kornea, atau artikulasi fonem bibir yang tidak wajar.

---

## 3. Deep Dive: Tactical Cryptographic Chain-of-Custody

### 3.1 EIP-712 Typed Structured Data Signing
Agar tanda tangan perwira analis tidak dapat disalahgunakan atau dipalsukan (*replay attack*), otorisasi penguncian bukti menggunakan standar **EIP-712**:

```json
{
  "types": {
    "EIP712Domain": [
      {"name": "name", "type": "string"},
      {"name": "version", "type": "string"},
      {"name": "chainId", "type": "uint256"},
      {"name": "verifyingContract", "type": "address"}
    ],
    "EvidenceAuthorization": [
      {"name": "mediaHash", "type": "bytes32"},
      {"name": "ipfsCID", "type": "string"},
      {"name": "confidenceScore", "type": "uint16"},
      {"name": "isDeepfake", "type": "bool"},
      {"name": "threatRegion", "type": "string"},
      {"name": "officerNonce", "type": "uint256"},
      {"name": "timestamp", "type": "uint64"}
    ]
  },
  "primaryType": "EvidenceAuthorization",
  "domain": {
    "name": "SENTINEL-AD Military Registry",
    "version": "3.0",
    "chainId": 80002,
    "verifyingContract": "0x..."
  }
}
```

### 3.2 Role-Based Access Control (RBAC) pada Smart Contract
Kontrak `TacticalEvidenceRegistry.sol` menerapkan kontrol akses militer berjenjang:
- `DEFAULT_ADMIN_ROLE`: Kepala PUSSIBERAD / Komandan Satuan Siber (dapat mendaftarkan atau mencabut hak akses perwira).
- `OFFICER_ROLE`: Perwira Analis Siber tersertifikasi yang berhak mengeksekusi `lockEvidence(...)`.
- `OBSERVER_ROLE`: Unit penerangan / intelijen yang berhak membaca telemetri peringatan.

---

## 4. Threat Modeling & Defense-in-Depth

| Vektor Ancaman (*Threat Vector*) | Tingkat Risiko | Mekanisme Pertahanan SENTINEL-AD |
| :--- | :---: | :--- |
| **Penyusup Dalam (*Insider Threat*)** | Kritis | Buku besar berbasis blockchain bersifat *append-only*. Administrator server database tidak memiliki kemampuan teknis untuk mengedit riwayat transaksi yang telah terkunci konsensus. |
| **Adversarial Perturbation (Serangan AI)** | Tinggi | Penerapan multi-frame aggregation dan analisis frekuensi spasial (Fourier/Wavelet). Model dilatih untuk mendeteksi noise sintetis adversarial berfrekuensi tinggi. |
| **Man-in-the-Middle (MitM) Tampering** | Tinggi | Validasi integritas ganda: SHA-256 diverifikasi ulang di server sebelum pinning IPFS, dan signature EIP-712 dicocokkan dengan kunci publik perwira pengirim. |
| **Blackout / Jaringan Lapangan Terputus** | Sedang | Sistem mendukung node lokal terisolasi (*air-gapped*). Bukti dapat disimpan sementara di buffer lokal terenkripsi AES-256-GCM dan disinkronisasikan otomatis saat koneksi satelit/mesh pulih. |

---

## 5. Deployment Topology: On-Premise & Air-Gapped K3I TNI AD

Untuk operasional riil di markas komando:
1. **Server AI Inferensi:** Server Linux (Ubuntu Server 22.04 LTS / Red Hat Enterprise Linux 9), akselerator NVIDIA Tensor Core (RTX 4090 / A100 / L40S) dengan CUDA 12+.
2. **Private EVM Node:** Node mandiri Hyperledger Besu berbasis konsensus QBFT (Istanbul Byzantine Fault Tolerant) dengan latensi blok < 1 detik.
3. **Storage Node:** Private IPFS Cluster terdistribusi antar Kodam untuk menjamin redundansi data saat terjadi sabotase fisik di satu markas komando.
