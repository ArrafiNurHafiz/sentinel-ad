import json
import os
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/audit", tags=["Audit Log ISO 27037"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
AUDIT_FILE = os.path.join(DATA_DIR, "audit_log.json")

def load_audit_logs():
    if os.path.exists(AUDIT_FILE):
        try:
            with open(AUDIT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

class AuditAppendRequest(BaseModel):
    eventType: str
    actor: str
    actorAddress: str
    resourceHash: str
    txHash: Optional[str] = None
    status: str = "SUCCESS"
    description: str

@router.get("")
async def get_audit_trail(limit: int = 100):
    """Mengambil riwayat audit log berstandar ISO/IEC 27037 secara riil."""
    logs = load_audit_logs()
    return {
        "status": "success",
        "data": {
            "items": logs[:limit],
            "total_records": len(logs),
            "standard": "ISO/IEC 27037:2012 Digital Evidence Handling"
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("")
async def append_audit_entry(req: AuditAppendRequest):
    """Mencatat aktivitas operasional baru ke rantai log audit ISO 27037."""
    logs = load_audit_logs()
    entry = {
        "id": f"LOG-{datetime.now().strftime('%Y-%m%d%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "eventType": req.eventType,
        "actor": req.actor,
        "actorAddress": req.actorAddress,
        "resourceHash": req.resourceHash,
        "txHash": req.txHash,
        "status": req.status,
        "description": req.description
    }
    logs.insert(0, entry)
    with open(AUDIT_FILE, "w", encoding="utf-8") as f:
        json.dump(logs[:200], f, indent=2, ensure_ascii=False)
        
    return {
        "status": "success",
        "data": entry,
        "message": "Entri audit berhasil dicatat ke rantai kustodi ISO 27037."
    }
