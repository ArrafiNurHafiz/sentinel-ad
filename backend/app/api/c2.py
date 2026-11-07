import json
import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/c2", tags=["C2 Tactical Common Operating Picture"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
REGISTRY_FILE = os.path.join(DATA_DIR, "evidence_registry.json")
C2_ALERTS_FILE = os.path.join(DATA_DIR, "c2_alerts.json")
AUDIT_FILE = os.path.join(DATA_DIR, "audit_log.json")

KODAM_DEFINITIONS = [
    {
        "id": "KODAM_JAYA",
        "name": "KODAM JAYA / JAYAKARTA",
        "code": "JAYAKARTA-C2",
        "region": "DKI Jakarta & Sekitarnya",
        "lat": -6.2088,
        "lng": 106.8456,
        "commandStatus": "SIAGA MERAH • C2 DEFENSE GRID AKTIF",
        "countermeasures": "Penerbitan Sertifikat Digital ISO 27037 & Klarifikasi Publik Segera"
    },
    {
        "id": "KODAM_VI_MLW",
        "name": "KODAM VI / MULAWARMAN",
        "code": "MULAWARMAN-IKN",
        "region": "Kalimantan Timur (Kawasan Inti IKN)",
        "lat": -1.2654,
        "lng": 116.8312,
        "commandStatus": "SIAGA MERAH • MONITORING OBVITNAS IKN",
        "countermeasures": "Penetralan Narasi Hoaks via Rantai Bukti Polygon Amoy"
    },
    {
        "id": "KODAM_XVII_CEN",
        "name": "KODAM XVII / CENDERAWASIH",
        "code": "CENDERAWASIH-PAPUA",
        "region": "Papua & Perbatasan Timur",
        "lat": -2.5916,
        "lng": 140.6690,
        "commandStatus": "SIAGA MERAH • SATGASSIBER KARTIKA STANDBY",
        "countermeasures": "Analisis Grad-CAM Membuktikan Inkonsistensi Batas Wajah"
    },
    {
        "id": "KODAM_I_BB",
        "name": "KODAM I / BUKIT BARISAN",
        "code": "BUKITBARISAN-SUMUT",
        "region": "Sumatera Utara & Riau",
        "lat": 3.5952,
        "lng": 98.6722,
        "commandStatus": "SIAGA TINGGI • PATROLI SIBER AKTIF",
        "countermeasures": "Deteksi Frekuensi Spektrum Audio Sintetik Terbukti"
    },
    {
        "id": "KODAM_II_SWJ",
        "name": "KODAM II / SRIWIJAYA",
        "code": "SRIWIJAYA-SUMSEL",
        "region": "Sumatera Selatan & Lampung",
        "lat": -2.9761,
        "lng": 104.7754,
        "commandStatus": "SIAGA KUNING • VALIDASI KRIPTOGRAFIS",
        "countermeasures": "Verifikasi Melalui Kunci Privat EIP-712 Perwira"
    },
    {
        "id": "KODAM_III_SLW",
        "name": "KODAM III / SILIWANGI",
        "code": "SILIWANGI-JABAR",
        "region": "Jawa Barat & Banten",
        "lat": -6.9175,
        "lng": 107.6191,
        "commandStatus": "SIAGA KUNING • PENGAWASAN AKTIF",
        "countermeasures": "Klarifikasi Terindeks di Buku Besar Registri"
    },
    {
        "id": "KODAM_IV_DIP",
        "name": "KODAM IV / DIPONEGORO",
        "code": "DIPONEGORO-JATENG",
        "region": "Jawa Tengah & DIY",
        "lat": -6.9667,
        "lng": 110.4167,
        "commandStatus": "SIAGA NORMAL • MONITORING RUTIN",
        "countermeasures": "Sensus Keaslian Konten Narasi Lokal"
    },
    {
        "id": "KODAM_V_BRW",
        "name": "KODAM V / BRAWIJAYA",
        "code": "BRAWIJAYA-JATIM",
        "region": "Jawa Timur",
        "lat": -7.2575,
        "lng": 112.7521,
        "commandStatus": "SIAGA NORMAL • KONDUSIF",
        "countermeasures": "Penyelarasan Data Informasi Teritorial"
    },
    {
        "id": "KODAM_IX_UDY",
        "name": "KODAM IX / UDAYANA",
        "code": "UDAYANA-BALI-NUSRA",
        "region": "Bali & Nusa Tenggara",
        "lat": -8.6705,
        "lng": 115.2126,
        "commandStatus": "SIAGA NORMAL • KONDUSIF",
        "countermeasures": "Pengawasan Konten Pariwisata & Internasional"
    },
    {
        "id": "KODAM_XII_TPR",
        "name": "KODAM XII / TANJUNGPURA",
        "code": "TANJUNGPURA-KALBAR",
        "region": "Kalimantan Barat & Tengah",
        "lat": -0.0263,
        "lng": 109.3425,
        "commandStatus": "SIAGA KUNING • PERBATASAN",
        "countermeasures": "Patroli Disinformasi Lintas Batas"
    },
    {
        "id": "KODAM_XIII_MDK",
        "name": "KODAM XIII / MERDEKA",
        "code": "MERDEKA-SULUT",
        "region": "Sulawesi Utara & Gorontalo",
        "lat": 1.4748,
        "lng": 124.8421,
        "commandStatus": "SIAGA KUNING • MONITORING PERBATASAN",
        "countermeasures": "Pemantauan Jalur Komunikasi Laut Utara"
    },
    {
        "id": "KODAM_XIV_HSN",
        "name": "KODAM XIV / HASANUDDIN",
        "code": "HASANUDDIN-SULSEL",
        "region": "Sulawesi Selatan, Barat & Tenggara",
        "lat": -5.1477,
        "lng": 119.4327,
        "commandStatus": "SIAGA TINGGI • FILTERING DISINFORMASI",
        "countermeasures": "Penerbitan Fakta Terverifikasi PUSSIBERAD"
    },
    {
        "id": "KODAM_XVI_PTM",
        "name": "KODAM XVI / PATTIMURA",
        "code": "PATTIMURA-MALUKU",
        "region": "Maluku & Maluku Utara",
        "lat": -3.6547,
        "lng": 128.1906,
        "commandStatus": "SIAGA TINGGI • PENGAWASAN AKTIF",
        "countermeasures": "Pelacakan Sumber Injeksi Konten Sintetik"
    }
]

def load_registry_items():
    if os.path.exists(REGISTRY_FILE):
        try:
            with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    return list(data.values())
                return data
        except Exception:
            return []
    return []

def append_audit_log(entry):
    logs = []
    if os.path.exists(AUDIT_FILE):
        try:
            with open(AUDIT_FILE, "r", encoding="utf-8") as f:
                logs = json.load(f)
        except Exception:
            logs = []
    logs.insert(0, entry)
    with open(AUDIT_FILE, "w", encoding="utf-8") as f:
        json.dump(logs[:200], f, indent=2, ensure_ascii=False)

class C2BroadcastRequest(BaseModel):
    region_id: str
    broadcast_type: str = "TACTICAL_C2_ALERT"
    message: str
    sender_rank: str = "Letkol Inf."
    sender_name: str = "Arrafi Nur Hafiz"

@router.get("/sectors")
async def get_c2_sectors():
    """
    Menghitung sebaran ancaman dan telemetri per Kodam secara riil
    berdasarkan arsip barang bukti aktif di evidence_registry.json.
    """
    items = load_registry_items()
    
    # Kelompokkan insiden berdasarkan threat_region
    region_incidents = {}
    for item in items:
        reg = item.get("threat_region", "KODAM_JAYA")
        if reg not in region_incidents:
            region_incidents[reg] = []
        region_incidents[reg].append(item)
        
    sectors = []
    for kdef in KODAM_DEFINITIONS:
        reg_id = kdef["id"]
        reg_items = region_incidents.get(reg_id, [])
        total_in_reg = len(reg_items)
        deepfakes_in_reg = sum(1 for x in reg_items if x.get("is_deepfake"))
        
        # Tentukan status level secara obyektif
        if deepfakes_in_reg >= 3:
            level = "CRITICAL"
        elif deepfakes_in_reg >= 1:
            level = "HIGH"
        elif total_in_reg > 0:
            level = "MEDIUM"
        else:
            level = "LOW"
            
        last_item = reg_items[-1] if reg_items else None
        last_anomaly = last_item.get("file_name", "Pemantauan Sektor Teritorial Normal") if last_item else "Pemantauan Sektor Teritorial Normal"
        if last_item and last_item.get("is_deepfake"):
            last_anomaly = f"Terdeteksi Anomali: {last_item.get('file_name')} ({last_item.get('verdict')})"
            
        sectors.append({
            "id": reg_id,
            "name": kdef["name"],
            "code": kdef["code"],
            "region": kdef["region"],
            "lat": kdef["lat"],
            "lng": kdef["lng"],
            "level": level,
            "activeIncidents": total_in_reg,
            "deepfakeCount": deepfakes_in_reg,
            "lastAnomaly": last_anomaly,
            "commandStatus": kdef["commandStatus"],
            "countermeasures": kdef["countermeasures"],
            "lastCheckedAt": datetime.now(timezone.utc).isoformat()
        })
        
    return {
        "status": "success",
        "data": sectors,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("/broadcast")
async def broadcast_c2_alert(req: C2BroadcastRequest):
    """
    Memancarkan instruksi C2 Alert militer secara langsung ke jaringan taktis
    dan mencatatnya ke buku audit ISO 27037.
    """
    alert_record = {
        "id": f"C2-{datetime.now().strftime('%Y-%m%d%H%M%S')}",
        "region_id": req.region_id,
        "broadcast_type": req.broadcast_type,
        "message": req.message,
        "sender": f"{req.sender_rank} {req.sender_name}",
        "broadcast_at": datetime.now(timezone.utc).isoformat(),
        "status": "DISPATCHED"
    }
    
    # Simpan ke c2_alerts.json
    alerts = []
    if os.path.exists(C2_ALERTS_FILE):
        try:
            with open(C2_ALERTS_FILE, "r", encoding="utf-8") as f:
                alerts = json.load(f)
        except Exception:
            alerts = []
    alerts.insert(0, alert_record)
    with open(C2_ALERTS_FILE, "w", encoding="utf-8") as f:
        json.dump(alerts[:100], f, indent=2, ensure_ascii=False)
        
    # Catat ke audit trail ISO 27037
    append_audit_log({
        "id": f"LOG-{datetime.now().strftime('%Y-%m%d%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "eventType": "C2_ALERT",
        "actor": f"{req.sender_rank} {req.sender_name}",
        "actorAddress": "C2_DISPATCH_CONSOLE",
        "resourceHash": req.region_id,
        "status": "SUCCESS",
        "description": f"Pancaran peringatan dini C2 ke wilayah {req.region_id}: {req.message}"
    })
    
    return {
        "status": "success",
        "data": alert_record,
        "message": f"Instruksi C2 Alert berhasil dipancarkan ke jajaran Kodam {req.region_id}.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/alerts")
async def get_c2_alerts(limit: int = 10):
    """
    Mengambil riwayat siaran peringatan dini taktis C2 terkini.
    """
    alerts = []
    if os.path.exists(C2_ALERTS_FILE):
        try:
            with open(C2_ALERTS_FILE, "r", encoding="utf-8") as f:
                alerts = json.load(f)
        except Exception:
            alerts = []
    return {
        "status": "success",
        "data": alerts[:limit],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
