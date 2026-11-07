# API Specification — SENTINEL-AD Backend

> **Base URL:** `http://localhost:8000/api/v1`  
> **OpenAPI Doc:** `http://localhost:8000/docs`  
> **Version:** 2.0.0  
> **Protocol:** HTTP/1.1 & HTTP/2 (TLS Recommended)  

---

## 1. Overview

Backend SENTINEL-AD dibangun menggunakan **FastAPI (Python)** dengan fokus pada performa asinkron berkecepatan tinggi, integrasi model inferensi deepfake Explainable AI (XAI), serta penjembatanan ke IPFS Tactical Vault.

---

## 2. Global Response Schema

Semua respons API menggunakan struktur JSON seragam:

```json
{
  "status": "success" | "error",
  "data": { ... } | null,
  "message": "Deskripsi pesan atau error",
  "timestamp": "2026-10-20T14:30:00Z"
}
```

---

## 3. Endpoints

### 3.1 Health & Tactical Readiness Check
Memverifikasi status server backend dan ketersediaan akselerator komputasi (CPU/GPU).

* **Method:** `GET`
* **Path:** `/health`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "service": "SENTINEL-AD AI Forensics Engine",
      "version": "2.0.0",
      "device": "cuda:0" // or "cpu",
      "model_loaded": true,
      "tactical_status": "OPERATIONAL"
    },
    "message": "System ready for cyber threat ingestion",
    "timestamp": "2026-10-20T14:30:00Z"
  }
  ```

---

### 3.2 Deepfake Analysis & XAI Heatmap Extraction
Menerima file media (video atau gambar), melakukan ekstraksi fitur, klasifikasi manipulasi, dan kalkulasi Grad-CAM Explainable AI Heatmap.

* **Method:** `POST`
* **Path:** `/forensics/analyze`
* **Headers:** `Content-Type: multipart/form-data`
* **Request Body:**
  * `file`: File media biner (`.mp4`, `.mov`, `.jpg`, `.jpeg`, `.png`). Maksimal ukuran: 50MB.
  * `threat_region`: *(Opsional, string)* Kode wilayah asal ancaman, contoh: `"KODAM_JAYA"`, `"KODAM_I_BB"`, `"KODAM_IX_UDY"`.
* **Responses:**
  * **200 OK (Deepfake Terdeteksi):**
    ```json
    {
      "status": "success",
      "data": {
        "file_name": "pidato_provokasi_kasad.mp4",
        "file_size_bytes": 14208400,
        "media_type": "video/mp4",
        "sha256": "8f3a9e2d41b6c7890123456789abcdef0123456789abcdef0123456789abcdef",
        "verdict": "DEEPFAKE_DETECTED",
        "is_deepfake": true,
        "confidence_score": 0.974,
        "confidence_percentage": 97.4,
        "threat_level": "CRITICAL",
        "threat_region": "KODAM_JAYA",
        "forensic_analysis": {
          "facial_blend_inconsistency": 0.982,
          "eye_blink_anomaly": 0.945,
          "audio_vocoder_synthetic": 0.920,
          "anomalies_detected": [
            "Inkonsistensi batas garis rahang terdeteksi (GAN blending boundary)",
            "Distorsi mikro pada pola pantulan cahaya kornea mata",
            "Pola artikulasi fonem bibir tidak sinkron dengan gelombang audio"
          ]
        },
        "xai_heatmap_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
        "analyzed_at": "2026-10-20T14:32:15Z"
      },
      "message": "Forensic analysis completed with high-confidence threat indication.",
      "timestamp": "2026-10-20T14:32:15Z"
    }
    ```
  * **200 OK (Media Terverifikasi Asli):**
    ```json
    {
      "status": "success",
      "data": {
        "file_name": "klarifikasi_resmi_tni.mp4",
        "sha256": "4b5d6e...",
        "verdict": "AUTHENTIC_MEDIA",
        "is_deepfake": false,
        "confidence_score": 0.125,
        "confidence_percentage": 12.5,
        "threat_level": "LOW",
        "threat_region": "KODAM_JAYA",
        "forensic_analysis": {
          "anomalies_detected": []
        },
        "xai_heatmap_base64": null,
        "analyzed_at": "2026-10-20T14:32:15Z"
      },
      "message": "Media evaluated as authentic. No synthetic generative artifacts found.",
      "timestamp": "2026-10-20T14:32:15Z"
    }
    ```
  * **400 Bad Request:** Format file tidak didukung atau file kosong.
  * **500 Internal Error:** Kesalahan saat inferensi model atau ekstraksi frame.

---

### 3.3 Archive Evidence to Tactical Vault (IPFS)
Mengunggah payload bukti lengkap (termasuk ringkasan intelijen dan hash) ke IPFS via Pinata untuk mendapatkan Content Identifier (CID) sebelum dikunci ke blockchain.

* **Method:** `POST`
* **Path:** `/vault/archive`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "sha256": "8f3a9e2d41b6c7890123456789abcdef0123456789abcdef0123456789abcdef",
    "file_name": "pidato_provokasi_kasad.mp4",
    "verdict": "DEEPFAKE_DETECTED",
    "confidence_score": 0.974,
    "threat_region": "KODAM_JAYA",
    "officer_address": "0x8F2B1A0413554F8E24D2821A85d05E44b1c676E9",
    "investigator_notes": "Konten ditemukan beredar masif di kanal pesan instan menjelang apel kesiapan."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "ipfs_cid": "QmZtmD2qtWbpPyDaJcwTDd8KprNWNJVnhZppRjhgcmEL8z",
      "vault_url": "https://gateway.pinata.cloud/ipfs/QmZtmD2qtWbpPyDaJcwTDd8KprNWNJVnhZppRjhgcmEL8z",
      "pinned_at": "2026-10-20T14:33:00Z"
    },
    "message": "Forensic evidence securely pinned to decentralized tactical vault.",
    "timestamp": "2026-10-20T14:33:00Z"
  }
  ```

---

### 3.4 Public Evidence Verification Query
Memfasilitasi pemeriksaan status bukti digital untuk masyarakat atau pihak luar tanpa autentikasi militer.

* **Method:** `GET`
* **Path:** `/forensics/verify/{sha256_hash}`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "sha256": "8f3a9e2d41b6c7890123456789abcdef0123456789abcdef0123456789abcdef",
      "is_registered": true,
      "verdict": "DEEPFAKE_DETECTED",
      "official_statement": "KONTEN INI RESMI DINYATAKAN SEBAGAI DEEPFAKE OLEH PUSSIBERAD TNI AD.",
      "locked_on_blockchain": true,
      "tx_hash": "0x5a1f8c...3b",
      "blockchain_explorer_url": "https://amoy.polygonscan.com/tx/0x5a1f8c...3b",
      "verified_at": "2026-10-20T14:35:00Z"
    },
    "timestamp": "2026-10-20T14:35:00Z"
  }
  ```
