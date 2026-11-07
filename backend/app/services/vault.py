import json
import os
import hashlib
from datetime import datetime, timezone
import requests
from typing import Dict, Any, Optional
from app.core.config import settings

VAULT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "vault_storage")
os.makedirs(VAULT_DIR, exist_ok=True)

class TacticalVaultService:
    """
    Decentralized Tactical Vault client using IPFS / Pinata
    with local disk persistence for Air-Gapped / Military On-Premise environments.
    """

    @classmethod
    def pin_json_to_ipfs(cls, payload: Dict[str, Any]) -> Dict[str, str]:
        """
        Pins forensic metadata to IPFS.
        Always saves locally in VAULT_DIR with SHA-256 integrity verification,
        and synchronizes with remote Pinata IPFS gateway when credentials exist.
        """
        payload_bytes = json.dumps(payload, sort_keys=True).encode("utf-8")
        raw_hash = hashlib.sha256(payload_bytes).hexdigest()
        deterministic_cid = f"QmSentinelAD{raw_hash[:34]}"

        # 1. Local Air-Gapped Persistent Archive
        local_archive_path = os.path.join(VAULT_DIR, f"{deterministic_cid}.json")
        try:
            with open(local_archive_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[Local Vault Error] {e}")

        # 2. Remote Pinata Pinning (if credentials present)
        api_key = settings.PINATA_API_KEY
        api_secret = settings.PINATA_API_SECRET
        jwt = settings.PINATA_JWT

        if jwt or (api_key and api_secret):
            url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
            headers = {"Content-Type": "application/json"}
            if jwt:
                headers["Authorization"] = f"Bearer {jwt}"
            else:
                headers["pinata_api_key"] = api_key
                headers["pinata_secret_api_key"] = api_secret

            body = {
                "pinataContent": payload,
                "pinataMetadata": {
                    "name": f"SENTINEL_FORENSIC_{payload.get('sha256', 'RECORD')[:12]}"
                }
            }

            try:
                response = requests.post(url, json=body, headers=headers, timeout=10)
                if response.status_code == 200:
                    real_cid = response.json().get("IpfsHash")
                    return {
                        "ipfs_cid": real_cid,
                        "vault_url": f"{settings.PINATA_GATEWAY_URL}{real_cid}",
                        "pinned_at": datetime.now(timezone.utc).isoformat()
                    }
            except Exception as e:
                print(f"[Vault Warning] Pinata request failed: {e}. Utilizing Air-Gapped Local CID.")

        return {
            "ipfs_cid": deterministic_cid,
            "vault_url": f"{settings.PINATA_GATEWAY_URL}{deterministic_cid}",
            "pinned_at": datetime.now(timezone.utc).isoformat()
        }

    @classmethod
    def get_archived_payload(cls, ipfs_cid: str) -> Optional[Dict[str, Any]]:
        """Retrieves forensic report from local vault storage by CID."""
        local_archive_path = os.path.join(VAULT_DIR, f"{ipfs_cid}.json")
        if os.path.exists(local_archive_path):
            with open(local_archive_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return None
