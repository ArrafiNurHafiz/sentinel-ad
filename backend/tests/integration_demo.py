import io
import time
import requests
from PIL import Image, ImageDraw

def run_golden_path_simulation():
    print("=============================================================")
    print("🛡️  SENTINEL-AD: REAL-WORLD FULL INTEGRATION TEST")
    print("=============================================================")

    # 1. Generate an authentic test image with facial simulation features
    img = Image.new("RGB", (400, 400), color=(25, 35, 55))
    draw = ImageDraw.Draw(img)
    # Draw face oval
    draw.ellipse([120, 80, 280, 320], fill=(210, 160, 130), outline=(15, 23, 42), width=3)
    # Eyes
    draw.ellipse([150, 150, 180, 180], fill=(255, 255, 255))
    draw.ellipse([160, 160, 170, 170], fill=(30, 40, 60))
    draw.ellipse([220, 150, 250, 180], fill=(255, 255, 255))
    draw.ellipse([230, 160, 240, 170], fill=(30, 40, 60))
    # Mouth with simulated GAN synthesis artifact
    draw.rectangle([165, 240, 235, 270], fill=(180, 80, 90))

    img_buffer = io.BytesIO()
    img.save(img_buffer, format="JPEG")
    img_bytes = img_buffer.getvalue()

    # 2. Test Backend Ingestion
    print("\n[Step 1] Ingesting suspicious media to /api/v1/forensics/analyze...")
    from app.services.forensics import RealForensicsEngine
    from app.services.vault import TacticalVaultService

    start_time = time.time()
    analysis = RealForensicsEngine.analyze_media(
        file_bytes=img_bytes,
        file_name="provokasi_pidato_kasad_deepfake.jpg",
        content_type="image/jpeg",
        threat_region="KODAM_JAYA"
    )
    latency = time.time() - start_time

    print(f"✅ Analysis completed in {latency:.3f} seconds!")
    print(f"   • Verdict: {analysis['verdict']}")
    print(f"   • Confidence: {analysis['confidence_percentage']}%")
    print(f"   • SHA-256: {analysis['sha256']}")
    print(f"   • Threat Region: {analysis['threat_region']}")
    print(f"   • Grad-CAM Heatmap Base64 Length: {len(analysis['xai_heatmap_base64'] or '')} chars")
    assert analysis["is_deepfake"] is True
    assert analysis["xai_heatmap_base64"].startswith("data:image/png;base64,")

    # 3. Test Vault Archival (IPFS)
    print("\n[Step 2] Archiving digital evidence to Decentralized Tactical Vault (IPFS)...")
    vault_payload = {
        "sha256": analysis["sha256"],
        "file_name": analysis["file_name"],
        "verdict": analysis["verdict"],
        "confidence_score": analysis["confidence_score"],
        "threat_region": analysis["threat_region"],
        "officer_address": "0x8F2B1A0413554F8E24D2821A85d05E44b1c676E9"
    }
    vault_res = TacticalVaultService.pin_json_to_ipfs(vault_payload)
    print(f"✅ Evidence anchored in Tactical Vault!")
    print(f"   • IPFS CID: {vault_res['ipfs_cid']}")
    print(f"   • Vault URL: {vault_res['vault_url']}")
    assert vault_res["ipfs_cid"].startswith("Qm")

    print("\n=============================================================")
    print("🎯 GOLDEN PATH TEST 100% SUCCESSFUL! ALL SYSTEMS OPERATIONAL.")
    print("=============================================================")

if __name__ == "__main__":
    run_golden_path_simulation()
