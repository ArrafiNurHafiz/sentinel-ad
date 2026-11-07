"use client";

import { useState } from "react";
import { Upload, Cpu, Lock, MapPin, QrCode, ChevronRight, CheckCircle2, Shield } from "lucide-react";

const STAGES = [
  {
    num: "01",
    label: "Ingestion & Hashing",
    sub: "SHA-256 Hash Digest",
    desc: "Validasi magic bytes & pembuatan hash kriptografis unik berkas media.",
    icon: Upload,
  },
  {
    num: "02",
    label: "XAI Anomaly Scan",
    sub: "PyTorch + Grad-CAM",
    desc: "Ekstraksi inkonsistensi spektrum spasial & visualisasi heatmap area manipulasi.",
    icon: Cpu,
  },
  {
    num: "03",
    label: "On-Chain Custody",
    sub: "Polygon Amoy (80002)",
    desc: "Penguncian permanen metadata & hash di smart contract TacticalEvidenceRegistry.",
    icon: Lock,
  },
  {
    num: "04",
    label: "Distribusi C2 Kodam",
    sub: "TacticalC2Alert Event",
    desc: "Pancaran peringatan otomatis ke Common Operational Picture (COP) satwil terkait.",
    icon: MapPin,
  },
  {
    num: "05",
    label: "Verifikasi Publik",
    sub: "Sertifikat QR Resmi",
    desc: "Klarifikasi dan pembuktian fakta kepada masyarakat dalam waktu sub-3 menit.",
    icon: QrCode,
  },
];

export function IncidentFlow() {
  const [activeStage, setActiveStage] = useState<number>(1);

  return (
    <section id="alur-penanganan" className="rounded-xl border border-emerald-500/25 bg-[#050e08]/90 p-4 lg:p-5 h-full flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_15px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-emerald-500/15">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Shield className="w-4 h-4 text-emerald-400" />
          </span>
          <div>
            <h2 className="text-base font-black tracking-tight text-white">
              SOP Rantai Komando &amp; Kustodi
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              STANDAR OPERASIONAL ISO/IEC 27037 PUSSIBERAD
            </p>
          </div>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 uppercase font-bold">
          5 TAHAPAN KUSTODI
        </span>
      </div>

      {/* Pipeline Stages (Interactive Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 my-auto">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStage === idx;

          return (
            <div
              key={s.num}
              onClick={() => setActiveStage(idx)}
              className={`relative cursor-pointer rounded-xl p-3 border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "border-emerald-400/80 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "border-slate-800/80 bg-[#061209]/70 hover:border-emerald-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-[10px] font-bold ${isSelected ? "text-emerald-400" : "text-slate-500"}`}>
                  TAHAP {s.num}
                </span>
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                  isSelected ? "border-emerald-400 bg-emerald-950 text-emerald-300" : "border-slate-800 bg-[#08150c] text-slate-400"
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h3 className="font-sans font-bold text-xs text-white leading-tight">
                  {s.label}
                </h3>
                <p className="font-mono text-[9px] text-emerald-400/90 mt-0.5 truncate">
                  {s.sub}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="mt-2.5 pt-2 border-t border-emerald-500/15 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className={`w-2.5 h-2.5 ${isSelected ? "text-emerald-400" : "text-slate-600"}`} />
                  Terverifikasi
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Detail Drawer */}
      <div className="mt-3 p-3 rounded-lg border border-emerald-500/20 bg-[#06140b]/90 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
            TAHAP {STAGES[activeStage].num}
          </span>
          <span className="text-slate-200 font-sans font-medium text-[11px]">
            {STAGES[activeStage].desc}
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 shrink-0 font-bold">
          STANDAR HUKUM SAH (NON-REPUDIATION)
        </span>
      </div>
    </section>
  );
}
