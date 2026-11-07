"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicVerifyWidget } from "./PublicVerifyWidget";
import {
  MapPin,
  Building,
  Radio,
  Lock,
  ArrowRight,
  Shield,
  Phone,
  Mail,
} from "lucide-react";

export function ContactSection() {
  return (
    <section id="kontak" className="py-24 bg-[#060f0a] border-t border-slate-900 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Verification Widget placed prominently */}
        <div>
          <PublicVerifyWidget />
        </div>

        {/* Command Headquarters & Officer Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Headquarters Info */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#081810]/90 backdrop-blur-xl p-7 sm:p-9 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <Image
                    src="/images/tni-ad-emblem.png"
                    alt="Lambang Kartika Eka Paksi"
                    width={44}
                    height={44}
                    className="object-contain drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]"
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Pusat Siber Angkatan Darat (PUSSIBERAD)
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">
                    MARKAS BESAR TNI ANGKATAN DARAT (MABESAD)
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed mb-6">
                Pusat Siber Angkatan Darat bertugas menyelenggarakan operasi pertahanan siber militer, pemantauan perang kognitif, dan pengamanan sistem informasi strategis guna mendukung tugas pokok TNI Angkatan Darat.
              </p>

              <div className="space-y-3.5 text-xs text-slate-300 font-mono">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Jl. Veteran No. 5, Gambir, Jakarta Pusat, DKI Jakarta 10110, Indonesia
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gedung PUSSIBERAD Mabesad • Komando Daerah Pertahanan Siber</span>
                </div>
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Kanal Komando: SEC-NET MIL-ID // FREKUENSI KODAM TERPADU</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
              <span>KLASIFIKASI: RESTRICTED // DOKTRIN PERTAHANAN SIBER NASIONAL</span>
              <span className="text-emerald-400 font-semibold">TNI ANGKATAN DARAT 2026</span>
            </div>
          </div>

          {/* Officer Portal Gateway */}
          <div className="lg:col-span-5 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0f291a] via-[#0a1c12] to-[#06100a] p-7 sm:p-9 flex flex-col justify-between shadow-[0_20px_50px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>

              <span className="inline-block px-3 py-1 rounded-md bg-emerald-950 border border-emerald-500/40 font-mono text-[10px] font-bold text-emerald-400 mb-2.5">
                AUTHORIZED PERSONNEL ONLY
              </span>

              <h4 className="text-2xl font-black text-white tracking-tight">
                Masuk ke Tactical Command Center
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-slate-300/85 leading-relaxed">
                Akses konsol operasional bagi Perwira Analis Siber dan Komandan Satuan untuk menjalankan analisis deepfake real-time, penandatanganan EIP-712, dan inspeksi 3D Common Operational Picture (COP).
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/dashboard"
                className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:shadow-[0_0_35px_rgba(34,197,94,0.8)] active:scale-[0.98]"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Buka Dasbor Command Center</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
              <p className="mt-3 text-center text-[10px] text-slate-400 font-mono">
                Mendukung Tactical Cryptographic Key (Web3 / EIP-712)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
