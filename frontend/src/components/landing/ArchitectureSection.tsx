"use client";

import {
  Server,
  Cpu,
  Lock,
  Link2,
  Radio,
  CheckCircle2,
  Monitor,
  HardDrive,
  ShieldAlert,
} from "lucide-react";

export function ArchitectureSection() {
  const TIERS = [
    {
      step: "01",
      title: "Ingesti & Hashing SHA-256",
      desc: "Media masuk diverifikasi magic bytes, dihitung checksum SHA-256 pada detik pertama, dan diekstraksi ke keyframe interval presisi.",
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      tag: "ISO/IEC 27037 Identification",
    },
    {
      step: "02",
      title: "Inferensi PyTorch & XAI",
      desc: "Jaringan saraf tiruan konvolusional membedah tekstur spasial wajah dan spektrum vokal audio, menghasilkan heatmap Grad-CAM objektif.",
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      tag: "Explainable AI (Grad-CAM)",
    },
    {
      step: "03",
      title: "Tanda Tangan EIP-712 Perwira",
      desc: "Perwira pemeriksa menandatangani data investigasi secara kriptografis menggunakan Tactical Cryptographic Key (Web3 / Hardware Token).",
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      tag: "Non-Repudiation Security",
    },
    {
      step: "04",
      title: "Penguncian On-Chain & Vault IPFS",
      desc: "Metadata forensik dan IPFS CID dikunci ke smart contract TacticalEvidenceRegistry (Polygon Amoy / Private EVM) secara permanen.",
      icon: <Link2 className="w-5 h-5 text-emerald-400" />,
      tag: "Immutable Ledger",
    },
    {
      step: "05",
      title: "Diseminasi Taktis C2 ke 15 Kodam",
      desc: "Pemberitahuan taktis on-chain memicu pembaruan vektor ancaman 3D geospatial secara seketika ke jajaran komando di seluruh NKRI.",
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      tag: "Common Operational Picture",
    },
  ];

  return (
    <section id="arsitektur" className="py-24 bg-[#07130c] border-t border-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-mono font-semibold tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>KEDAULATAN DATA &amp; AIR-GAPPED READINESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Arsitektur Pipeline Sistem Pertahanan{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              SENTINEL-AD
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-[64ch] mx-auto">
            Didesain berstandar militer tanpa ketergantungan pada API komersial luar negeri. Semua pemrosesan data sensitif dilakukan di dalam jurisdiksi komputasi mandiri.
          </p>
        </div>

        {/* 5-Step Tactical Pipeline Flow with liquid glass styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
          {TIERS.map((tier, idx) => (
            <div
              key={tier.step}
              className="relative rounded-3xl border border-white/10 bg-[#0a1e14]/90 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
                    TAHAP {tier.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {tier.icon}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  {tier.title}
                </h3>

                <p className="mt-2 text-xs text-slate-300/80 leading-relaxed">
                  {tier.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-emerald-400/90 font-medium">
                  {tier.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specification Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-7 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>AI &amp; Neural Compute Stack</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>PyTorch 2.15+ &amp; Torchvision (CPU / CUDA Graceful Fallback)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>FastAPI Async ASGI Server (Python 3.12, Uvicorn)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>OpenCV &amp; SciPy (Laplacian variance &amp; Fourier STFT)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Model Evaluasi Holdout Mandiri (Holdout Accuracy: 82,6%)</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-7 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-400" />
              <span>Ledger &amp; Cryptography Stack</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Solidity ^0.8.20 (OpenZeppelin AccessControl, Pausable)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Polygon Amoy Testnet &amp; Jaringan Private EVM Militer</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>EIP-712 Typed Structured Data Signature Verification</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>IPFS Cluster Vault (Content Addressed Storage)</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-7 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>Tactical Command Interface</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Next.js 14 App Router, TypeScript, TailwindCSS</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Three.js 3D Geospatial Globe Threat Vector Simulator</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Wagmi v2 &amp; Viem Web3 Tactical Wallet Connection</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Dual-Pane Explainable Heatmap Visualizer &amp; PDF Export</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
