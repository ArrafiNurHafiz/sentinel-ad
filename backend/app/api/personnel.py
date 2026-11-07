import json
import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/personnel", tags=["Personnel & Access Control"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
PERSONNEL_FILE = os.path.join(DATA_DIR, "personnel.json")
AUDIT_FILE = os.path.join(DATA_DIR, "audit_log.json")

def load_personnel():
    if os.path.exists(PERSONNEL_FILE):
        try:
            with open(PERSONNEL_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_personnel(data):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(PERSONNEL_FILE, "w", encoding="utf-8") as f:
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

class OfficerCreateRequest(BaseModel):
    name: str
    rank: str
    corps: str = "Infanteri"
    role: str = "OFFICER_ROLE"
    walletAddress: str
    unit: str
    authorizations: Optional[List[str]] = None

@router.get("")
async def get_all_personnel():
    """Mengembalikan daftar personel & perwira terotorisasi dari registri riil."""
    return {
        "status": "success",
        "data": load_personnel(),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("")
async def add_officer(req: OfficerCreateRequest):
    """Mendaftarkan perwira baru dengan cryptographic wallet address resmi."""
    personnel = load_personnel()
    new_id = f"OFF-{len(personnel) + 1:03d}"
    
    auths = req.authorizations or ["LOCK_EVIDENCE", "SIGN_EIP712"]
    if req.role == "ADMIN_ROLE" and "ADMIN_ROLE" not in auths:
        auths.insert(0, "ADMIN_ROLE")
        
    officer = {
        "id": new_id,
        "name": req.name,
        "rank": req.rank,
        "corps": req.corps,
        "role": req.role,
        "walletAddress": req.walletAddress,
        "unit": req.unit,
        "status": "ACTIVE",
        "authorizations": auths,
        "issuedAt": datetime.now(timezone.utc).isoformat()
    }
    personnel.append(officer)
    save_personnel(personnel)
    
    # Catat ke audit trail
    append_audit_log({
        "id": f"LOG-{datetime.now().strftime('%Y-%m%d%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "eventType": "KEY_AUTH",
        "actor": req.name,
        "actorAddress": req.walletAddress,
        "resourceHash": req.walletAddress,
        "status": "SUCCESS",
        "description": f"Registrasi perwira baru {req.rank} {req.name} ({req.role}) di unit {req.unit}."
    })
    
    return {
        "status": "success",
        "data": officer,
        "message": "Perwira berhasil didaftarkan ke registri otorisasi militer.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.patch("/{officer_id}/toggle-status")
async def toggle_officer_status(officer_id: str):
    """Mengubah status operasional perwira (ACTIVE / SUSPENDED)."""
    personnel = load_personnel()
    target = None
    for p in personnel:
        if p["id"] == officer_id:
            target = p
            break
            
    if not target:
        raise HTTPException(status_code=404, detail="Perwira tidak ditemukan")
        
    target["status"] = "SUSPENDED" if target["status"] == "ACTIVE" else "ACTIVE"
    save_personnel(personnel)
    
    append_audit_log({
        "id": f"LOG-{datetime.now().strftime('%Y-%m%d%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "eventType": "KEY_AUTH",
        "actor": "Administrator Siber",
        "actorAddress": target["walletAddress"],
        "resourceHash": target["walletAddress"],
        "status": "WARNING" if target["status"] == "SUSPENDED" else "SUCCESS",
        "description": f"Perubahan status perwira {target['name']} menjadi {target['status']}."
    })
    
    return {
        "status": "success",
        "data": target,
        "message": f"Status perwira berhasil diubah menjadi {target['status']}.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
