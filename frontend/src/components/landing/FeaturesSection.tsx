"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Link2,
  Monitor,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  Lock,
  Activity,
  Radio,
  FileCheck,
  ExternalLink,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  const [showHeatmap, setShowHeatmap] = useState(true);

  return (
    <section id="fitur" className="py-24 bg-[#060f0a] border-t border-slate-900 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-mono font-semibold tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>BENTO 2.0 • ARSENAL PERTAHANAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Arsitektur Pertahanan Kognitif{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              SENTINEL-AD
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-[62ch] mx-auto">
            Kombinasi teknologi kecerdasan buatan terlatih, sistem kekebalan bukti berbasis smart contract, dan visualisasi pemantauan situasi komando 3D.
          </p>
        </div>

        {/* Bento 2.0 Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1 (7 cols): Multimodal Explainable AI Engine with Live Grad-CAM Interactive View */}
          <div className="lg:col-span-7 group rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-500/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)]">
                    <Brain className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      PILAR 01 • XAI INFERENCE
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      AI Forensik Multimodal (Grad-CAM)
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>358 MS / FRAME</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Mengekstrak bukti visual biologis objektif melalui aktivasi neuron konvolusi layer terakhir (PyTorch) dan dekomposisi frekuensi Fourier (STFT) pada spektrum suara sintetis.
              </p>

              {/* Interactive Dual Comparison Preview */}
              <div className="rounded-2xl border border-slate-800 bg-[#040a06] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Inspeksi Visual Anomali Wajah:
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                    <button
                      onClick={() => setShowHeatmap(false)}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        !showHeatmap
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Media Asli
                    </button>
                    <button
                      onClick={() => setShowHeatmap(true)}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        showHeatmap
                          ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Heatmap Grad-CAM
                    </button>
                  </div>
                </div>

                {/* Visual Frame */}
                <div className="relative aspect-[16/8] sm:aspect-[16/7] rounded-xl overflow-hidden bg-black border border-slate-800">
                  <Image
                    src="/images/hero-soldier-seamless.jpg"
                    alt="Inspeksi Grad-CAM Forensik"
                    fill
                    className="object-cover object-right"
                  />
                  {showHeatmap && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-emerald-500/20 to-transparent mix-blend-color-dodge pointer-events-none" />
                  )}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-2">
                    <span className="text-emerald-400">STATUS:</span>
                    <span>{showHeatmap ? "Grad-CAM Aktivasi Layer Konvolusi Aktif" : "Keyframe Normal 256x256"}</span>
                  </div>
                </div>

                {/* Real Mathematical Metrics Row */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                    <p className="text-[10px] text-slate-500">Varians Laplacian</p>
                    <p className="text-xs font-bold text-emerald-400">542.64</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                    <p className="text-[10px] text-slate-500">FFT Energi Std</p>
                    <p className="text-xs font-bold text-emerald-400">18.78</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                    <p className="text-[10px] text-slate-500">Gradien Mean</p>
                    <p className="text-xs font-bold text-emerald-400">7.99</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Model: CNN Backbone + PyTorch 2.15</span>
              <span className="text-emerald-400 font-bold">Holdout Accuracy: 82,6%</span>
            </div>
          </div>

          {/* Card 2 (5 cols): Cryptographic Chain of Custody & EIP-712 */}
          <div className="lg:col-span-5 group rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-500/40 transition-all duration-300">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)]">
                  <Link2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    PILAR 02 • IMMUTABLE LEDGER
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Evidence Custody (EIP-712)
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Penguncian tanda tangan kriptografis perwira pemeriksa dan penyimpanan append-only berbasis smart contract pada jaringan Polygon Amoy.
              </p>

              {/* Cryptographic Payload Display */}
              <div className="rounded-2xl border border-slate-800 bg-[#040906] p-4 font-mono text-[11px] space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
                  <span className="text-emerald-400 font-bold">EIP-712 TYPED SIGNATURE</span>
                  <span className="text-[10px] text-slate-500">POLYGON AMOY</span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-500">Contract: </span>
                    <span className="text-emerald-300 select-all">0x26C2eB4A...95E818b</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Media Hash: </span>
                    <span className="text-slate-200 select-all">0xb482ff8c...8bd8e2</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Signer Role: </span>
                    <span className="text-emerald-400 font-bold">OFFICER_ROLE</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Vault CID: </span>
                    <span className="text-slate-300 select-all">QmZtmD2qtWbpPyDa...EL8z</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Non-Repudiation Verified</span>
                  </span>
                  <span className="text-slate-500">Gas: 0.0028 MATIC</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <a
                href="https://amoy.polygonscan.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-mono"
              >
                <span>Inspeksi di Polygonscan Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3 (4 cols): Tactical C2 3D Threat Mapping */}
          <div className="lg:col-span-4 group rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-500/40 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] mb-3">
                <Monitor className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                PILAR 03 • C2 COP
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Geospatial Threat Map 3D
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Pemetaan lintasan serangan disinformasi ke 15 Komando Daerah Militer (Kodam) melalui bola bumi 3D interaktif (Three.js) secara real-time.
              </p>

              <div className="mt-4 p-3 rounded-xl bg-[#040906] border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Simpul Utama</span>
                  <span className="text-emerald-400">Status Node</span>
                </div>
                <div className="flex justify-between">
                  <span>Kodam Jaya (Jakarta)</span>
                  <span className="text-red-400 font-bold">1 Insiden</span>
                </div>
                <div className="flex justify-between">
                  <span>Kodam I/BB (Medan)</span>
                  <span className="text-red-400 font-bold">1 Insiden</span>
                </div>
                <div className="flex justify-between">
                  <span>Kodam VI/Mlw (Balikpapan)</span>
                  <span className="text-emerald-400 font-bold">Normal</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Trigger: On-chain Event TacticalC2Alert
              </span>
            </div>
          </div>

          {/* Card 4 (4 cols): Sovereign Air-Gapped Local Compute */}
          <div className="lg:col-span-4 group rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-500/40 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] mb-3">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                PILAR 04 • KEDAULATAN DATA
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Air-Gapped &amp; On-Premise
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Nol ketergantungan API pihak ketiga asing. Seluruh bobot jaringan saraf tiruan dieksekusi secara lokal di server satuan komputasi PUSSIBERAD.
              </p>

              <div className="mt-4 p-3 rounded-xl bg-[#040906] border border-slate-800 font-mono text-[11px] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero Packet Leakage</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CPU / CUDA Graceful Fallback</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Encrypted Offline Vault</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Protokol: Doktrin Siber Mandiri TNI AD
              </span>
            </div>
          </div>

          {/* Card 5 (4 cols): Public Verification Portal */}
          <div className="lg:col-span-4 group rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-500/40 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                PILAR 05 • KONTRA-DISINFORMASI
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Portal Verifikasi Publik
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Akses terbuka bagi masyarakat dan pers untuk membuktikan keaslian video atau rekaman suara pimpinan militer cukup dengan memasukkan hash SHA-256.
              </p>

              <div className="mt-4 p-3 rounded-xl bg-[#040906] border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                <div className="text-slate-500">Mekanisme Pembuktian:</div>
                <div className="text-emerald-400 font-bold">Tanpa Butuh Web3 Wallet</div>
                <div className="text-slate-400">Sertifikat Digital + QR Code Smartphone</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80">
              <Link
                href="/verify"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-mono font-bold"
              >
                <span>Buka Portal Verifikasi Langsung</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
