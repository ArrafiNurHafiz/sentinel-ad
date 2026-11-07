import json
import os
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/settings", tags=["System Settings"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
SETTINGS_FILE = os.path.join(DATA_DIR, "system_settings.json")
AUDIT_FILE = os.path.join(DATA_DIR, "audit_log.json")

DEFAULT_SETTINGS = {
    "device": "cpu",
    "threshold": 85,
    "airGappedMode": True,
    "rpcUrl": "https://rpc-amoy.polygon.technology/",
    "contractAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "ipfsGateway": "https://gateway.pinata.cloud/ipfs/",
    "autoAlertThreshold": "HIGH",
    "updatedAt": "2026-11-06T17:23:45Z"
}

def load_settings():
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return DEFAULT_SETTINGS
    return DEFAULT_SETTINGS

def save_settings(data):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

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

class SettingsUpdateRequest(BaseModel):
    device: Optional[str] = "cpu"
    threshold: Optional[int] = 85
    airGappedMode: Optional[bool] = True
    rpcUrl: Optional[str] = "https://rpc-amoy.polygon.technology/"
    contractAddress: Optional[str] = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    ipfsGateway: Optional[str] = "https://gateway.pinata.cloud/ipfs/"
    autoAlertThreshold: Optional[str] = "HIGH"

@router.get("")
async def get_system_settings():
    """Mengambil konfigurasi sistem kedaulatan siber & PyTorch."""
    return {
        "status": "success",
        "data": load_settings(),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("")
async def update_system_settings(req: SettingsUpdateRequest):
    """Memperbarui dan menyimpan konfigurasi operasional ke berkas disk."""
    current = load_settings()
    current.update({
        "device": req.device,
        "threshold": req.threshold,
        "airGappedMode": req.airGappedMode,
        "rpcUrl": req.rpcUrl,
        "contractAddress": req.contractAddress,
        "ipfsGateway": req.ipfsGateway,
        "autoAlertThreshold": req.autoAlertThreshold,
        "updatedAt": datetime.now(timezone.utc).isoformat()
    })
    save_settings(current)
    
    append_audit_log({
        "id": f"LOG-{datetime.now().strftime('%Y-%m%d%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "eventType": "CONFIG_UPDATE",
        "actor": "Admin Perwira Siber",
        "actorAddress": "OPERATOR_CONSOLE",
        "resourceHash": "SYSTEM_CONFIG_V2",
        "status": "SUCCESS",
        "description": f"Pembaruan parameter sistem: AirGapped={req.airGappedMode}, Threshold={req.threshold}%, Device={req.device}."
    })
    
    return {
        "status": "success",
        "data": current,
        "message": "Konfigurasi sistem berhasil diperbarui secara permanen.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
