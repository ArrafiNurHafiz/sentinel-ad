#!/usr/bin/env bash
# ==============================================================================
# SENTINEL-AD: Tactical Production & Air-Gapped Deployment
# Pusat Siber TNI Angkatan Darat (PUSSIBERAD)
# ==============================================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "======================================================================"
echo "🛡️  PUSSIBERAD SENTINEL-AD // PRODUCTION CONTAINER STACK DEPLOYMENT"
echo "======================================================================"

# 1. Verify Docker and Docker Compose availability
if ! command -v docker &> /dev/null; then
    echo "❌ Kesalahan: Docker CLI tidak terdeteksi pada sistem."
    echo "   Harap pasang docker engine terlebih dahulu."
    exit 1
fi

# 2. Ensure data directories exist with write permissions
mkdir -p "$ROOT_DIR/backend/data" "$ROOT_DIR/backend/uploads"
chmod -R 775 "$ROOT_DIR/backend/data" "$ROOT_DIR/backend/uploads"

echo "📦 Memulai kompilasi dan orkestrasi container..."
docker compose build --parallel
docker compose up -d

echo "======================================================================"
echo "✅ DEPLOYMENT BERHASIL DIEKSEKUSI"
echo "   - Unified Gateway (Nginx) : http://localhost (Port 80)"
echo "   - Frontend Command Center : http://localhost:3000"
echo "   - Backend Forensics API   : http://localhost:8000"
echo "   - Dokumentasi Swagger     : http://localhost/docs"
echo "   - Healthcheck Endpoint    : http://localhost/health"
echo "======================================================================"
docker compose ps
