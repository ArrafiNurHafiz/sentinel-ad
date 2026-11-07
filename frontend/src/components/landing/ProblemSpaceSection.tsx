"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Play,
  X,
  AlertTriangle,
  FileX,
  Clock,
  ShieldAlert,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

export function ProblemSpaceSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative bg-[#07130c] pt-16 pb-24 border-t border-emerald-950/80 overflow-hidden">
      {/* Background glow & wave transition */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Command Room Video Thumbnail Card with Play Button */}
          <div className="lg:col-span-6">
            <div className="relative group rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a1e13] p-2.5 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]">
              {/* Media Container */}
              <div className="relative aspect-[16/9] w-full rounded-[1.5rem] overflow-hidden bg-slate-950">
                <Image
                  src="/images/problem-space-thumb.png"
                  alt="Ruang Komando Siber PUSSIBERAD - Pemantauan Peta Ancaman Indonesia"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Tactical grid & vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/40" />

                {/* Live Indicator Pill on top-left of video */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-emerald-500/40 backdrop-blur-md text-[10px] font-mono text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>PUSSIBERAD C2 COP • SATELIT LIVE</span>
                </div>

                {/* Central Glowing Play Button */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  aria-label="Tonton Briefing Taktis PUSSIBERAD"
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 border-2 border-emerald-400 flex items-center justify-center text-white backdrop-blur-md shadow-[0_0_35px_rgba(34,197,94,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-inner pl-1">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950" />
                  </div>
                </button>

                {/* Bottom caption */}
                <div className="absolute bottom-3 inset-x-3 px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-emerald-400 font-bold">
                    SIMULASI KODAM JAYA // PERANG KOGNITIF
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">03:45 DETIK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Problem Space Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/50 text-emerald-300 text-xs font-mono font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Problem Space</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.08]">
              Menghadapi Ancaman{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Perang Kognitif
              </span>{" "}
              di Era AI
            </h2>

            {/* Lead paragraph */}
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-[58ch]">
              Deepfake, manipulasi informasi, dan disinformasi kini digunakan sebagai senjata asimetris untuk memecah stabilitas nasional, mengacaukan operasi pasukan militer, dan merusak kepercayaan rakyat terhadap komando pertahanan negara.
            </p>

            {/* 3 Real Operational Threat Pillars */}
            <div className="space-y-3.5 pt-1">
              {/* Item 1 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-red-500/25 bg-red-950/15 hover:border-red-500/50 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="w-9 h-9 rounded-xl bg-red-950/90 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                    1. Rekayasa Visual &amp; Vokal Komandan Lapangan
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Sintesis video dan suara komandan menggunakan model generatif AI mutakhir untuk menerbitkan perintah penarikan pasukan palsu atau provokasi di wilayah operasi rawan.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-amber-500/25 bg-amber-950/15 hover:border-amber-500/50 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="w-9 h-9 rounded-xl bg-amber-950/90 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                  <FileX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                    2. Krisis Rantai Bukti Hukum (Chain-of-Custody Failure)
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Penyimpanan bukti digital pada basis data relasional konvensional rentan dimanipulasi, dihapus secara sepihak, atau disangkal keabsahannya di persidangan militer.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-emerald-500/25 bg-emerald-950/15 hover:border-emerald-500/50 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                    3. Keterlambatan Siklus Triase Investigasi (Response Lag)
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Proses verifikasi manual memakan waktu 6–48 jam. Pada 15 menit pertama, disinformasi deepfake sudah tersebar ke ratusan ribu gawai masyarakat dan prajurit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl rounded-3xl border border-emerald-500/40 bg-[#09150e] overflow-hidden shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  BRIEFING TAKTIS PUSSIBERAD • DOKTRIN PERANG KOGNITIF DI ERA AI
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video player simulation content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                <Image
                  src="/images/problem-space-thumb.png"
                  alt="Simulasi Komando Operasi"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                  <span className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 animate-pulse shadow-[0_0_25px_rgba(34,197,94,0.5)]">
                    <Fingerprint className="w-7 h-7" />
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Pipeline AI Forensik Multimodal SENTINEL-AD Aktif
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mt-2 leading-relaxed">
                    Model konvolusional on-premise memproses keyframe video dan spektrum audio dalam 358 ms, mengekstrak aktivasi Grad-CAM objektif, serta mengunci identitas bukti secara permanen pada blockchain Polygon Amoy.
                  </p>
                  <a
                    href="/dashboard"
                    className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all active:scale-95"
                  >
                    Buka Tactical Command Center →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
