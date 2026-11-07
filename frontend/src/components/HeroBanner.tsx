"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShieldCheck, Activity, Terminal, Radio, Cpu, Lock } from "lucide-react";

const STANDARDS = [
  { label: "ISO/IEC 27037", desc: "Digital Evidence" },
  { label: "ISO/IEC 27001", desc: "ISMS Security" },
  { label: "EIP-712", desc: "Typed Signatures" },
  { label: "NIST SP 800-86", desc: "Forensics Guide" },
];

export function HeroBanner() {
  const [timeStr, setTimeStr] = useState<string>("--:--:-- WIB");
  const [utcStr, setUtcStr] = useState<string>("--:--:-- ZULU");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      // WIB = UTC+7
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      setTimeStr(`${hours}:${minutes}:${seconds} WIB`);

      const utcHours = pad(now.getUTCHours());
      const utcMinutes = pad(now.getUTCMinutes());
      const utcSeconds = pad(now.getUTCSeconds());
      setUtcStr(`${utcHours}:${utcMinutes}:${utcSeconds}Z`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-[#050e08]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Tactical Scanlines & Grid Texture */}
      <div className="absolute inset-0 bg-tactical-grid opacity-35 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      {/* Decorative Military HUD Framing Corners */}
      <div className="absolute top-2 left-2 text-emerald-500/40 font-mono text-[9px] pointer-events-none">
        ┌ C2-HUD.SYS
      </div>
      <div className="absolute top-2 right-2 text-emerald-500/40 font-mono text-[9px] pointer-events-none">
        PUSSIBERAD ┐
      </div>
      <div className="absolute bottom-2 left-2 text-emerald-500/30 font-mono text-[9px] pointer-events-none">
        └ MIL-STD-27037
      </div>
      <div className="absolute bottom-2 right-2 text-emerald-500/30 font-mono text-[9px] pointer-events-none">
        NODE-01 ┘
      </div>

      {/* Right Background Artwork (Blended seamless HUD) */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-[60%] lg:w-[48%] h-full pointer-events-none">
        <Image
          src="/images/hero-soldier-seamless.jpg"
          alt="Pusat Siber TNI AD C2 Operator"
          fill
          className="object-cover object-left opacity-25 sm:opacity-60 lg:opacity-85 mix-blend-luminosity"
          priority
        />
        {/* Soft edge gradient fades */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050e08] via-[#050e08]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050e08] via-transparent to-transparent" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Mission & Identity */}
        <div className="max-w-xl">
          {/* Status Indicator Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/60 font-mono text-[10px] font-bold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              SIAGA I • OPERASIONAL C2
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 bg-[#07130b] font-mono text-[10px] text-slate-300">
              <Radio className="w-3 h-3 text-emerald-400" />
              PUSSIBERAD DEFENSE GRID
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-800 bg-[#07130b] font-mono text-[10px] text-slate-400">
              <Terminal className="w-3 h-3 text-emerald-400/80" />
              AIR-GAPPED READY
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="font-mono text-emerald-400/90 font-light text-xl sm:text-3xl">[</span>
            <span>SENTINEL</span>
            <span className="text-emerald-400">-AD</span>
            <span className="font-mono text-emerald-400/90 font-light text-xl sm:text-3xl">]</span>
            <span className="text-xs sm:text-sm font-mono font-medium text-slate-400 ml-2 tracking-normal uppercase border-l border-emerald-500/30 pl-3 hidden md:inline-block">
              Siber Evidensi Nasional & Taktis Intelijen Elektronik
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-[58ch]">
            Pusat Komando Pertahanan Perang Kognitif &amp; Rantai Kustodi Bukti Digital Imutabel. 
            Mendeteksi anomali deepfake audio-visual berbasis <span className="text-emerald-300 font-medium">Explainable AI (Grad-CAM)</span> dan 
            mengunci evidensi hukum di buku besar terdesentralisasi <span className="text-emerald-300 font-medium">Polygon Amoy</span> berstandar ISO/IEC 27037.
          </p>

          {/* Compliance Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {STANDARDS.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-500/20 bg-[#07150c]/80 backdrop-blur font-mono text-[10px] text-slate-200 transition hover:border-emerald-500/50"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="font-bold text-emerald-300">{s.label}</span>
                <span className="text-slate-500 hidden sm:inline">• {s.desc}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Live HUD Telemetry Card */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col gap-2.5">
          <div className="rounded-xl border border-emerald-500/20 bg-[#061209]/90 p-4 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] w-full sm:w-80">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2 mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400" />
                TELEMETRI C2 REAL-TIME
              </span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">
                NORMAL SEC-OPS
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">WAKTU OPERASI:</span>
                <span className="text-white font-bold">{timeStr}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">ZULU CLOCK (UTC):</span>
                <span className="text-slate-200">{utcStr}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">CHAIN RECORD:</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  POLYGON AMOY (80002)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">XAI INFERENCE:</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  PYTORCH CNN + GRAD-CAM
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between">
              <span className="font-mono text-[9px] text-slate-500">DEWAN OPERASIONAL:</span>
              <span className="font-mono text-[10px] font-bold text-emerald-400">SATGASSIBER KARTIKA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
