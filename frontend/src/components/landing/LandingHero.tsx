"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Award,
  Brain,
  Link2,
  Monitor,
  Shield,
  Activity,
  Terminal,
} from "lucide-react";

export function LandingHero() {
  return (
    <section
      id="beranda"
      className="relative min-h-[100dvh] pt-28 pb-14 lg:pt-36 lg:pb-20 overflow-hidden bg-[#060f0a] flex flex-col justify-between"
    >
      {/* 1. Full Tactical Cyber Panoramic Background (Flag + Soldier + HUD + PUSSIBERAD HQ) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <Image
          src="/images/hero-panorama-clean.jpg"
          alt="SENTINEL-AD Tactical Cognitive Warfare Defense & Holographic HUD PUSSIBERAD"
          fill
          className="object-cover object-center pointer-events-none"
          priority
        />
        {/* Soft atmospheric gradients for seamless text contrast and section blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060f0a]/90 via-[#060f0a]/50 to-transparent lg:from-[#060f0a]/35 lg:via-transparent lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060f0a] via-[#060f0a]/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#060f0a]/80 via-transparent to-transparent" />
      </div>

      {/* Ambient tactical lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

      {/* Main Asymmetric Hero Content */}
      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 my-auto">
        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl pt-4 pb-6 sm:pb-10">
          {/* Pre-title with green horizontal accent bar */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 mb-3 sm:mb-4"
          >
            <div className="flex items-center">
              <span className="h-[2.5px] w-6 sm:w-8 bg-[#39db7d] shadow-[0_0_8px_#39db7d] rounded-l-full" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#39db7d] shadow-[0_0_8px_#39db7d] -ml-0.5" />
            </div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-white font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              SISTEM PERTAHANAN KOGNITIF TNI AD
            </span>
          </motion.div>

          {/* Title: SENTINEL-AD inside Tactical HUD Reticle Frame */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative inline-block my-2 sm:my-3 select-none"
          >
            {/* Tactical HUD Reticle Corner Brackets */}
            <span className="absolute -top-1.5 -left-1.5 sm:-top-2.5 sm:-left-2.5 w-5 h-5 sm:w-7 sm:h-7 border-t-[2.5px] border-l-[2.5px] border-[#39db7d] rounded-tl-lg sm:rounded-tl-xl shadow-[0_0_12px_rgba(57,219,125,0.7)] pointer-events-none" />
            <span className="absolute -top-1.5 -right-1.5 sm:-top-2.5 sm:-right-2.5 w-5 h-5 sm:w-7 sm:h-7 border-t-[2.5px] border-r-[2.5px] border-[#39db7d] rounded-tr-lg sm:rounded-tr-xl shadow-[0_0_12px_rgba(57,219,125,0.7)] pointer-events-none" />
            <span className="absolute -bottom-1.5 -left-1.5 sm:-bottom-2.5 sm:-left-2.5 w-5 h-5 sm:w-7 sm:h-7 border-b-[2.5px] border-l-[2.5px] border-[#39db7d] rounded-bl-lg sm:rounded-bl-xl shadow-[0_0_12px_rgba(57,219,125,0.7)] pointer-events-none" />
            <span className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2.5 sm:-right-2.5 w-5 h-5 sm:w-7 sm:h-7 border-b-[2.5px] border-r-[2.5px] border-[#39db7d] rounded-br-lg sm:rounded-br-xl shadow-[0_0_12px_rgba(57,219,125,0.7)] pointer-events-none" />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black italic tracking-tight px-3 py-1.5 sm:px-5 sm:py-2 flex items-center leading-none">
              <span className="bg-gradient-to-b from-white via-[#f8fafc] to-[#cbd5e1] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(255,255,255,0.25)]">
                SENTINEL
              </span>
              <span className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(57,219,125,0.65)] ml-1">
                -AD
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg lg:text-xl font-semibold text-white leading-snug tracking-tight mb-3 sm:mb-4"
          >
            Military-Grade Cognitive Warfare Defense &amp; Immutable Evidence Custody System
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-[62ch] mb-6 sm:mb-8 font-normal"
          >
            Sistem terpadu untuk mendeteksi, menganalisis, dan memverifikasi ancaman deepfake serta disinformasi, dengan jaminan keaslian bukti digital yang tidak dapat diubah.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            <a
              href="#fitur"
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#86efac] via-[#4ade80] to-[#22c55e] hover:brightness-105 text-slate-950 font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-[0_0_25px_rgba(74,222,128,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(74,222,128,0.75)] active:scale-[0.98]"
            >
              <span>Jelajahi Fitur</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#arsitektur"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border border-white/20 bg-slate-950/60 hover:bg-slate-900/80 hover:border-emerald-500/50 text-white font-medium text-xs sm:text-sm transition-all duration-200 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] active:scale-[0.98]"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Lihat Arsitektur</span>
            </a>
          </motion.div>

          {/* Badges Row (ISO / NIST / EIP) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-[#08170f]/80 backdrop-blur text-[11px] font-mono text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO/IEC 27037</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-[#08170f]/80 backdrop-blur text-[11px] font-mono text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO/IEC 27001</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-[#08170f]/80 backdrop-blur text-[11px] font-mono text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>EIP-712</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-[#08170f]/80 backdrop-blur text-[11px] font-mono text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>NIST SP 800-86</span>
            </div>
          </motion.div>
        </div>

        {/* 4 Feature Strip Cards (Floating at Bottom of Hero) */}
        <div className="mt-4 lg:mt-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#091a11]/90 backdrop-blur-xl p-4 lg:p-5 transition-all duration-300 hover:border-emerald-400/80 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] group-hover:scale-105 transition-transform">
                  <Brain className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    AI Forensik Multimodal
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Deteksi deepfake visual &amp; vokal dengan Explainable AI (Grad-CAM).
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#091a11]/90 backdrop-blur-xl p-4 lg:p-5 transition-all duration-300 hover:border-emerald-400/80 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] group-hover:scale-105 transition-transform">
                  <Link2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Evidence Custody Immutable
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Penguncian bukti digital berbasis blockchain &amp; tanda tangan kriptografis.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#091a11]/90 backdrop-blur-xl p-4 lg:p-5 transition-all duration-300 hover:border-emerald-400/80 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] group-hover:scale-105 transition-transform">
                  <Monitor className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Tactical C2 &amp; COP
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Peta insiden geosikular 3D secara real-time ke seluruh Kodam.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#091a11]/90 backdrop-blur-xl p-4 lg:p-5 transition-all duration-300 hover:border-emerald-400/80 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Verifikasi Publik
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Portal pembuktian keabsahan untuk melawan disinformasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
