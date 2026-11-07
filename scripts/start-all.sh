#!/usr/bin/env bash
# ==============================================================================
# SENTINEL-AD: Tactical Cognitive Warfare Defense & Immutable Evidence Ledger
# Single-Command Launcher for Backend (FastAPI) & Frontend (Next.js)
# ==============================================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "======================================================================"
echo "🛡️  STARTING SENTINEL-AD DEFENSE SYSTEM"
echo "   Working Directory: $ROOT_DIR"
echo "======================================================================"

# 1. Start Backend in background
echo "[1/2] Launching Backend AI Forensics Engine on http://localhost:8000..."
cd "$ROOT_DIR/backend"
PYTHONPATH=. venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "      Backend PID: $BACKEND_PID"

# Trap to kill backend when script terminates
trap "echo -e '\n🛑 Shutting down SENTINEL-AD services...'; kill $BACKEND_PID 2>/dev/null || true; exit 0" INT TERM EXIT

# Wait a second for backend to boot
sleep 2

# 2. Start Frontend
echo "[2/2] Launching Next.js Command Center on http://localhost:3000..."
cd "$ROOT_DIR/frontend"
npm run dev
