# AGENTS.md — SENTINEL-AD Military-Grade Engineering Instructions

These instructions govern all coding, debugging, architectural design, and testing operations in this repository. Follow these directives rigorously.

## 1. Mission & Quality Philosophy
Deliver a **production-grade, real-world deployment-ready** Cognitive Warfare Defense & Immutable Forensics Ledger (**SENTINEL-AD**) for the Pusat Siber Angkatan Darat (PUSSIBERAD).
- **No toy prototypes or superficial mocks:** All core modules must be implemented with production-level rigor.
- The AI pipeline must execute real image/video frame processing, cryptographic hashing, and actual Explainable AI (XAI) Grad-CAM generation.
- The Smart Contract must implement enterprise-grade access control, events, and security safeguards on EVM / Polygon Amoy.
- The Frontend must render a real-time Three.js 3D geospatial threat visualization and handle genuine Web3 wallet signing.

**A task is not complete just because code was written. It must be tested, robust, and running locally without errors.**

## 2. Technical Stack Mandates
- **Backend (AI & Forensics Engine):** Python 3.10+, FastAPI, PyTorch, Torchvision, OpenCV, NumPy, Pillow, Pydantic v2.
  - Implement real feature extraction, bounding box calculations, and mathematical gradient-weighted activation mapping.
  - Clean error handling: validate magic bytes, handle corrupt video containers, enforce size boundaries.
- **Smart Contracts (Military Ledger):** Solidity `^0.8.20`, Hardhat, OpenZeppelin Contracts.
  - Implement Role-Based Access Control (`AccessControl`), append-only storage, custom error codes, and comprehensive events.
  - Gas-efficient, deterministic, fully tested with Chai/Ethers unit test suite.
- **Frontend (Command Center & Verifier):** Next.js 14 (App Router), TypeScript, TailwindCSS, Three.js, Wagmi v2, Viem, Lucide-Icons.
  - Dark tactical military theme (PUSSIBERAD Emerald, Slate, Crimson Alert).
  - Real dual-pane comparison (Original vs Grad-CAM), real QR Code generation, and responsive layouts.

## 3. Mandatory Engineering Rules
1. **Security & Cryptography:**
   - Never commit or log private keys or sensitive credentials.
   - All transactions must be signed client-side by the authorized officer key.
   - Use SHA-256 for media integrity checks and EIP-712 / ECDSA for non-repudiation.
2. **Kedaulatan Data & Air-Gapped Readiness:**
   - The application must be capable of running self-contained in a local network without mandatory dependencies on external commercial cloud AI APIs.
3. **Robustness Over Assumptions:**
   - Validate inputs on both frontend and backend.
   - Implement clean fallback handling for hardware acceleration (CUDA fallback to CPU gracefully).
   - Smart contracts must protect against reentrancy and unauthorized writes.

## 4. End-to-End Golden Verification Path
The full operational loop must execute end-to-end:
1. **Officer Authentication:** Connect Tactical Cryptographic Key (MetaMask / EIP-712).
2. **Media Ingestion:** Upload video or image (`.mp4`, `.mov`, `.jpg`, `.png`).
3. **Real AI Analysis:** Backend processes media, computes SHA-256, detects visual/biological anomalies, and generates the Grad-CAM Heatmap overlay.
4. **Forensic Inspection:** Dual-pane view renders original media alongside the Explainable AI heatmap.
5. **Chain-of-Custody Lock:** Officer approves transaction on Polygon Amoy / EVM, locking media hash, IPFS CID, and metadata into `TacticalEvidenceRegistry`.
6. **Tactical C2 Alert:** The smart contract emits `TacticalC2Alert`, triggering dynamic threat vectors on the 3D Globe towards the affected Kodam.
7. **Public QR Verification:** System renders the verified forensic certificate and public QR code, verifiable by any standard smartphone camera.

## 5. Verification Commands
- **Backend:** `pytest` or running test scripts with real media inputs against `/api/v1/forensics/analyze`.
- **Contracts:** `npx hardhat test` (All tests must pass with 100% green status).
- **Frontend:** `npm run build` (Must build without TypeScript or linting errors).
