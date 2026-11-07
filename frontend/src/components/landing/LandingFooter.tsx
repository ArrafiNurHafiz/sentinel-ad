"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-900 bg-[#040906] pt-14 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-slate-800/80">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <Image
                src="/images/tni-ad-emblem.png"
                alt="Lambang TNI AD"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-extrabold text-[10px] tracking-[0.2em] text-[#e8c351] font-mono">
                TNI ANGKATAN DARAT
              </p>
              <h4 className="font-black italic text-base text-white tracking-tight">
                SENTINEL<span className="text-emerald-400 not-italic">-AD</span>
              </h4>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-slate-400 font-medium">
            <a href="#beranda" className="hover:text-emerald-400 transition-colors">
              Beranda
            </a>
            <a href="#fitur" className="hover:text-emerald-400 transition-colors">
              Fitur
            </a>
            <a href="#arsitektur" className="hover:text-emerald-400 transition-colors">
              Arsitektur
            </a>
            <a href="#standar" className="hover:text-emerald-400 transition-colors">
              Standar Kepatuhan
            </a>
            <a href="#manfaat" className="hover:text-emerald-400 transition-colors">
              Manfaat
            </a>
            <a href="#kontak" className="hover:text-emerald-400 transition-colors">
              Kontak
            </a>
            <Link href="/verify" className="text-emerald-400 hover:text-emerald-300 font-semibold">
              Portal Verifikasi
            </Link>
            <Link href="/dashboard" className="text-emerald-400 font-bold hover:underline">
              Login Sistem
            </Link>
          </div>

          {/* Back to top with tactile press */}
          <button
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className="w-10 h-10 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-emerald-950/60 hover:border-emerald-500/50 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono text-center sm:text-left">
          <p>
            PUSSIBERAD TNI AD × CODEPOLITAN • Kartika Cyber Hackathon 2026 • Dedicated to National Cyber Sovereignty
          </p>
          <p className="text-emerald-400/80 font-bold">
            MIL-STD v3.0 // AIR-GAPPED READY
          </p>
        </div>
      </div>
    </footer>
  );
}
