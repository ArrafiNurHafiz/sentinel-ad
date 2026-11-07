import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from main import app

client = TestClient(app)

def create_test_image_bytes():
    img = Image.new("RGB", (300, 300), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["tactical_status"] == "OPERATIONAL"

def test_analyze_media_image():
    img_bytes = create_test_image_bytes()
    files = {
        "file": ("test_surveillance_face.jpg", img_bytes, "image/jpeg")
    }
    data = {
        "threat_region": "KODAM_JAYA"
    }
    response = client.post("/api/v1/forensics/analyze", files=files, data=data)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["status"] == "success"
    forensic_data = res_json["data"]
    assert forensic_data["file_name"] == "test_surveillance_face.jpg"
    assert "sha256" in forensic_data
    assert len(forensic_data["sha256"]) == 64
    assert "verdict" in forensic_data
    assert "confidence_score" in forensic_data

def test_archive_to_vault():
    payload = {
        "sha256": "8f3a9e2d41b6c7890123456789abcdef0123456789abcdef0123456789abcdef",
        "file_name": "test_deepfake.mp4",
        "verdict": "DEEPFAKE_DETECTED",
        "confidence_score": 0.974,
        "threat_region": "KODAM_JAYA",
        "officer_address": "0x8F2B1A0413554F8E24D2821A85d05E44b1c676E9",
        "investigator_notes": "Test tactical investigation"
    }
    response = client.post("/api/v1/vault/archive", json=payload)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["status"] == "success"
    assert "ipfs_cid" in res_json["data"]
    assert res_json["data"]["ipfs_cid"].startswith("Qm")

def test_verify_endpoint():
    # Analyze a test image first
    img_bytes = create_test_image_bytes()
    files = {
        "file": ("sample_fake_general.jpg", img_bytes, "image/jpeg")
    }
    res_analyze = client.post("/api/v1/forensics/analyze", files=files, data={"threat_region": "KODAM_JAYA"})
    sha256 = res_analyze.json()["data"]["sha256"]

    # Verify via public endpoint
    response = client.get(f"/api/v1/forensics/verify/{sha256}")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["is_registered"] is True
    assert data["sha256"] == sha256

def test_forensic_dossier():
    # Ingest test image
    img_bytes = create_test_image_bytes()
    files = {"file": ("dossier_test.jpg", img_bytes, "image/jpeg")}
    res_analyze = client.post("/api/v1/forensics/analyze", files=files, data={"threat_region": "KODAM_JAYA"})
    sha256 = res_analyze.json()["data"]["sha256"]

    # Retrieve official military BAP dossier
    res_dossier = client.get(f"/api/v1/forensics/dossier/{sha256}")
    assert res_dossier.status_code == 200
    dossier = res_dossier.json()["data"]
    assert "bap_number" in dossier
    assert "legal_basis" in dossier
    assert "examining_officer" in dossier
    assert dossier["examining_officer"]["name"] == "Arrafi Nur Hafiz"

def test_c2_sectors_aggregation():
    res = client.get("/api/v1/c2/sectors")
    assert res.status_code == 200
    sectors = res.json()["data"]
    assert len(sectors) >= 10
    assert any(s["id"] == "KODAM_JAYA" for s in sectors)

def test_personnel_and_audit():
    res_p = client.get("/api/v1/personnel")
    assert res_p.status_code == 200
    officers = res_p.json()["data"]
    assert isinstance(officers, list)
    assert len(officers) >= 1
    assert any(o["id"] == "OFF-001" for o in officers)

    res_a = client.get("/api/v1/audit")
    assert res_a.status_code == 200
    assert "items" in res_a.json()["data"]
    assert isinstance(res_a.json()["data"]["items"], list)

def test_osint_ssrf_blocked():
    # Attempting to fetch loopback should be rejected with 400
    res = client.post("/api/v1/forensics/analyze-url", json={
        "url": "http://127.0.0.1:8000/health",
        "threat_region": "KODAM_JAYA"
    })
    assert res.status_code == 400
    assert "SSRF" in res.json()["detail"]
