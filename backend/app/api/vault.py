from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from app.models.schemas import ArchiveVaultRequest, ArchiveVaultResponse
from app.services.vault import TacticalVaultService

router = APIRouter(prefix="/vault", tags=["Tactical Vault (IPFS)"])

@router.post("/archive", response_model=ArchiveVaultResponse)
async def archive_to_vault(request: ArchiveVaultRequest):
    """
    Mengarsipkan metadata dan laporan bukti forensik ke IPFS Tactical Vault.
    Menyimpan arsip lokal secara permanen dan men-sinkronisasikan ke gateway.
    """
    if not request.sha256 or not request.officer_address:
        raise HTTPException(status_code=400, detail="SHA256 and officer_address are required")

    payload = {
        "sha256": request.sha256,
        "file_name": request.file_name,
        "verdict": request.verdict,
        "confidence_score": request.confidence_score,
        "threat_region": request.threat_region,
        "officer_address": request.officer_address,
        "investigator_notes": request.investigator_notes,
        "archived_by": "SENTINEL-AD Tactical Dispatcher",
        "archived_at": datetime.now(timezone.utc).isoformat()
    }

    result = TacticalVaultService.pin_json_to_ipfs(payload)

    return {
        "status": "success",
        "data": result,
        "message": "Payload forensik berhasil diarsipkan ke IPFS Tactical Vault.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/ipfs/{cid}")
async def get_ipfs_payload(cid: str):
    """
    Mengambil payload forensik terarsip langsung dari local vault storage berbasis CID.
    Mendukung operasional di jaringan tertutup / air-gapped tanpa internet.
    """
    payload = TacticalVaultService.get_archived_payload(cid)
    if not payload:
        raise HTTPException(status_code=404, detail="Arsip CID tidak ditemukan di tactical vault")
    return payload
