"use client";

import { Shield, Radio, Target, Award, CheckCircle } from "lucide-react";

export function BenefitsSection() {
  const BENEFITS = [
    {
      title: "Komando Pimpinan & Mabesad",
      role: "Strategic C2 Decision Making",
      desc: "Menjamin pimpinan tertinggi militer mengambil keputusan taktis berlandaskan fakta intelijen autentik tanpa risiko disesatkan oleh fabrikasi audio/video musuh.",
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      highlights: [
        "Kecepatan verifikasi instruksi pimpinan < 1 detik",
        "Peniadaan celah perang asimetris kognitif pihak asing",
        "Legitimasi hukum bukti yang tidak dapat dibantah di persidangan",
      ],
    },
    {
      title: "Satuan Lapangan & 15 Kodam",
      role: "Operational Ground Defense",
      desc: "Melindungi prajurit di daerah perbatasan dan wilayah rawan dari provokasi perintah penarikan palsu atau hasutan visual yang memecah konsentrasi tempur.",
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      highlights: [
        "Peta situasi insiden 3D yang langsung terhubung ke node Kodam",
        "Klarifikasi cepat terhadap rumor atau instruksi palsu di lapangan",
        "Penguatan moril prajurit dan kesinambungan doktrin operasi",
      ],
    },
    {
      title: "Prajurit Siber PUSSIBERAD",
      role: "Cyber Warfare Superiority",
      desc: "Memberikan instrumen forensik bertenaga kecerdasan buatan terlatih dan buku besar terdesentralisasi yang siap dipakai dalam kondisi perang kognitif berskala tinggi.",
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      highlights: [
        "Explainable AI (Grad-CAM) untuk inspeksi forensik visual objektif",
        "Audit trail tanda tangan kriptografis EIP-712 perwira pemeriksa",
        "Operasional penuh mandiri (Air-Gapped & Sovereign Server)",
      ],
    },
    {
      title: "Rakyat Indonesia & Ketahanan Nasional",
      role: "National Cognitive Sovereignty",
      desc: "Menjaga ruang publik dari propaganda sintetis yang dirancang untuk membenturkan TNI AD dengan masyarakat serta memelihara persatuan Negara Kesatuan Republik Indonesia.",
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      highlights: [
        "Portal verifikasi mandiri bebas biaya untuk masyarakat & media",
        "Penangkalan disinformasi viral dalam menit-menit krusial pertama",
        "Perlindungan kepercayaan publik terhadap integritas TNI AD",
      ],
    },
  ];

  return (
    <section id="manfaat" className="py-24 bg-[#07130c] border-t border-slate-900 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-mono font-semibold tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>NILAI STRATEGIS PERTAHANAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Manfaat Nyata bagi{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Kedaulatan NKRI
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-[62ch] mx-auto">
            Dampak langsung SENTINEL-AD terhadap ketangguhan doktrin pertahanan negara, kesiapan operasional satuan tempur, dan proteksi masyarakat.
          </p>
        </div>

        {/* 4 Benefit Cards Grid with Liquid Glass Refraction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFITS.map((b, idx) => (
            <div
              key={b.title}
              className="rounded-3xl border border-white/10 bg-[#091811]/90 backdrop-blur-xl p-7 sm:p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(34,197,94,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] group"
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] group-hover:scale-105 transition-transform">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-400">
                    {b.role}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed mb-5">
                {b.desc}
              </p>

              <div className="space-y-2 pt-4 border-t border-slate-800/80">
                {b.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{h}</span>
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
