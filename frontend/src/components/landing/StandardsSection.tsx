"use client";

import { CheckCircle2, Shield, Lock, FileCheck, Award } from "lucide-react";

export function StandardsSection() {
  const STANDARDS = [
    {
      code: "ISO/IEC 27037:2012",
      title: "Pedoman Penanganan Barang Bukti Digital",
      category: "Standar Hukum Forensik",
      desc: "Menjamin pemenuhan empat prinsip mutlak forensik digital: Identifikasi (SHA-256), Pengumpulan (terdesentralisasi), Akuisisi (Grad-CAM), dan Preservasi (Blockchain immutable ledger).",
      points: [
        "Identifikasi unik media menggunakan SHA-256 dan per-frame perceptual hashing",
        "Penjaminan integritas barang bukti tanpa risiko modifikasi diam-diam",
        "Dokumentasi audit trail rantai bukti yang sah di mata peradilan militer",
      ],
    },
    {
      code: "ISO/IEC 27001:2022",
      title: "Sistem Manajemen Keamanan Informasi (SMKI)",
      category: "Keamanan Sistem & Tata Kelola",
      desc: "Menerapkan prinsip Least Privilege, Role-Based Access Control (RBAC), enkripsi data saat diam (at rest) maupun dalam transmisi (in transit).",
      points: [
        "Pemisahan hak akses komando (COMMANDER_ROLE vs OFFICER_ROLE)",
        "Isolasi jaringan komputasi intelijen (Air-Gapped readiness)",
        "Pencatatan log transaksi yang diaudit secara kriptografis",
      ],
    },
    {
      code: "EIP-712 Standard",
      title: "Typed Structured Data Cryptographic Signing",
      category: "Kriptografi & Non-Repudiasi",
      desc: "Memastikan perwira pemeriksa menandatangani data investigasi berstruktur (bukan string biner acak), mencegah manipulasi payload serta serangan phishing tanda tangan.",
      points: [
        "Domain separator mengikat chainId dan alamat smart contract resmi",
        "Tanda tangan mengikat hash media, skor keyakinan, perwira, dan timestamp",
        "Jaminan non-repudiasi mutlak: perwira penandatangan tidak dapat menyangkal",
      ],
    },
    {
      code: "NIST SP 800-86",
      title: "Integrasi Teknik Forensik ke Respons Insiden",
      category: "Prosedur Taktis Insiden",
      desc: "Panduan integrasi teknik forensik digital ke dalam siklus penanganan insiden keamanan siber militer secara cepat, sistematis, dan terukur.",
      points: [
        "Siklus triase cepat mengurangi waktu identifikasi dari 48 jam ke detik",
        "Ekstraksi bukti terstandarisasi untuk kesiapan laporan komando",
        "Penyebaran peringatan insiden taktis langsung ke titik komando Kodam",
      ],
    },
  ];

  return (
    <section id="standar" className="py-24 bg-[#060f0a] border-t border-slate-900 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-mono font-semibold tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>KEPATUHAN &amp; INTEGRITAS HUKUM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Standar Kepatuhan{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Militer &amp; Internasional
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-[62ch] mx-auto">
            Setiap komponen dirancang agar hasil investigasi forensik memiliki legitimasi hukum sah dan dapat dipertanggungjawabkan di peradilan mahkamah militer.
          </p>
        </div>

        {/* 4 Standard Cards Grid with Liquid Glass Refraction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STANDARDS.map((std, idx) => (
            <div
              key={std.code}
              className="rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-7 sm:p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(34,197,94,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-400">
                  {std.code}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {std.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                {std.title}
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                {std.desc}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2.5">
                {std.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
