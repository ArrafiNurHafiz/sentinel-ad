"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { 
  ShieldCheck, 
  Upload, 
  Cpu, 
  Lock, 
  MapPin, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  Scale, 
  ChevronRight,
  Terminal,
  Activity,
  Award
} from "lucide-react";
import Link from "next/link";

const SOP_STAGES = [
  {
    stage: "01",
    title: "Ingestion Media & Hashing Kriptografis",
    actor: "Perwira Analis Siber (Operator Lapangan)",
    standard: "ISO/IEC 27037:2012 Clause 6.3 (Acquisition)",
    tech: "SHA-256 Digest • Magic Bytes Validation • FFmpeg Frame Demuxing",
    desc: "Berkas media digital (video/audio pidato atau dokumen instruksi) dimasukkan ke sistem SENTINEL-AD. Sistem memvalidasi magic bytes untuk mendeteksi container corruption, lalu menghitung cryptographic hash SHA-256 secara deterministik sebelum media disentuh oleh model AI.",
    rules: [
      "Media asli tidak pernah dimodifikasi (read-only bitstream copy).",
      "Perhitungan SHA-256 wajib selesai dalam < 1 detik.",
      "Identifikasi jenis MIME strictly divalidasi mencegah steganografi/eksekusi kode liar.",
    ],
  },
  {
    stage: "02",
    title: "Multimodal Explainable AI (XAI) Forensics",
    actor: "AI Forensics Core (PyTorch Engine v2.0)",
    standard: "NIST SP 800-86 & IEEE Transparent AI Principles",
    tech: "ResNet-50 CNN • 2D Spatial FFT • Gradient-weighted Class Activation Mapping",
    desc: "Frame video diproses melalui ekstraksi fitur spasial dan frekuensi. Model menganalisis batas rahang (facial blend), artefak difusi GAN, dan frekuensi kedipan mata. Sistem menghasilkan Grad-CAM Heatmap matematis yang membuktikan secara visual piksel mana yang dimanipulasi.",
    rules: [
      "Hasil analisis bukan sekadar skor probabilitas, melainkan peta panas (XAI Heatmap).",
      "Threshold keyakinan minimal 85% untuk penetapan status anomali kognitif.",
      "Dapat beroperasi 100% mandiri pada jaringan intranet militer tertutup (Air-Gapped).",
    ],
  },
  {
    stage: "03",
    title: "Penguncian Rantai Kustodi On-Chain (Blockchain)",
    actor: "Perwira Penindak / Validator Siber (Signer)",
    standard: "EIP-712 Typed Structured Data & EVM Smart Contract",
    tech: "Polygon Amoy (80002) • TacticalEvidenceRegistry.sol • IPFS Vault (Pinata)",
    desc: "Metadata laporan forensik diarsipkan ke InterPlanetary File System (IPFS). Selanjutnya, perwira menandatangani transaksi menggunakan Tactical Cryptographic Key (EIP-712). Hash media, IPFS CID, skor keyakinan, dan penandatangan terkunci permanen di smart contract tanpa dapat diubah oleh siapa pun.",
    rules: [
      "Penyimpanan append-only (tidak ada fungsi update atau delete di smart contract).",
      "Role-Based Access Control (RBAC) hanya memperbolehkan alamat perwira terdaftar.",
      "Anti-penyangkalan (Non-Repudiation) di dewan peradilan militer atau forum internasional.",
    ],
  },
  {
    stage: "04",
    title: "Pancaran Peringatan C2 ke Kodam Terdampak",
    actor: "Pusat Operasi Siber (C2 Komando Pusat TNI AD)",
    standard: "NATO STANAG 4559 & C4ISR Interoperability",
    tech: "TacticalC2Alert Event • Common Operational Picture (COP) WebSocket Feed",
    desc: "Smart contract memancarkan event resmi TacticalC2Alert. Sistem C2 SENTINEL-AD secara otomatis memetakan vektor ancaman pada Peta Common Operational Picture Nusantara menuju Kodam di wilayah terdampak (misal: Kodam Jaya, Kodam VI/MLW IKN).",
    rules: [
      "Distribusi peringatan dini real-time sub-detik sejak konfirmasi transaksi blockchain.",
      "Pemberian kode status siaga militer (Siaga Merah / Siaga Kuning).",
      "Saran tindakan penanggulangan (countermeasures) langsung terkirim ke satker teritorial.",
    ],
  },
  {
    stage: "05",
    title: "Verifikasi Publik Cepat & Kontra-Disinformasi",
    actor: "Dinas Penerangan TNI AD (Dispenad) & Masyarakat Publik",
    standard: "UU ITE No. 1/2024 & Standar Klarifikasi Publik Sub-3 Menit",
    tech: "Zero-Knowledge QR Certificate • Public Verification Portal • JSON-LD",
    desc: "SENTINEL-AD menerbitkan Sertifikat Bukti Digital resmi ber-QR Code. Dinas Penerangan dan masyarakat umum dapat memindai QR Code menggunakan smartphone apa pun untuk membuktikan keaslian konten dalam waktu kurang dari 3 menit, mematahkan disinformasi sebelum viral.",
    rules: [
      "Dapat diakses publik tanpa perlu login atau instalasi aplikasi khusus.",
      "Verifikasi membaca langsung bukti on-chain di Polygon Amoy.",
      "Sertifikat memuat stempel waktu militer dan pernyataan resmi kepemilikan data.",
    ],
  },
];

export default function SOPChainOfCustodyPage() {
  const [selectedStage, setSelectedStage] = useState(0);
  const activeSOP = SOP_STAGES[selectedStage];

  return (
    <div className="min-h-[100dvh] bg-[#030905] text-slate-100 flex">
      <Sidebar activeSection="Rantai Komando" />

      <div className="lg:pl-[252px] flex-1 flex flex-col min-h-[100dvh]">
        <Topbar />

        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  SOP Rantai Komando &amp; Kustodi Evidensi Digital
                </h1>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                STANDAR OPERASIONAL PROSEDUR FORENSIK DIGITAL ISO/IEC 27037 PUSSIBERAD TNI AD
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 rounded bg-[#07170e] border border-emerald-500/30 text-emerald-400 font-bold">
                5 TAHAP NON-REPUDIATION
              </span>
            </div>
          </div>

          {/* Interactive Stage Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {SOP_STAGES.map((s, idx) => {
              const isSelected = selectedStage === idx;
              return (
                <button
                  key={s.stage}
                  onClick={() => setSelectedStage(idx)}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "border-slate-800 bg-[#061009]/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-xs font-bold ${isSelected ? "text-emerald-400" : "text-slate-500"}`}>
                      TAHAP {s.stage}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-400 animate-ping" : "bg-slate-700"}`} />
                  </div>
                  <h3 className="font-sans font-bold text-xs text-white leading-snug line-clamp-2">
                    {s.title}
                  </h3>
                  <span className="font-mono text-[9px] text-slate-400 mt-2 block truncate">
                    {s.actor.split("(")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Stage Deep Dive */}
          <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  DOKTRIN &amp; STANDAR TEKNIS TAHAP {activeSOP.stage}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  {activeSOP.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded border border-slate-800 bg-[#030905] text-slate-300">
                  {activeSOP.standard}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg border border-slate-800 bg-[#030905] space-y-1.5">
                <span className="text-slate-500 text-[10px] uppercase block">AKTOR PELAKSANA:</span>
                <span className="font-bold text-white text-sm block font-sans">{activeSOP.actor}</span>
              </div>

              <div className="p-4 rounded-lg border border-slate-800 bg-[#030905] space-y-1.5">
                <span className="text-slate-500 text-[10px] uppercase block">TEKNOLOGI &amp; PROTOKOL:</span>
                <span className="font-bold text-emerald-300 text-sm block">{activeSOP.tech}</span>
              </div>
            </div>

            {/* Operational Narrative */}
            <div className="p-4 rounded-lg border border-slate-800 bg-[#030905] space-y-2">
              <span className="font-mono text-[10px] text-slate-500 uppercase block">DESKRIPSI OPERASIONAL:</span>
              <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeSOP.desc}
              </p>
            </div>

            {/* Mandatory Protocols List */}
            <div>
              <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block mb-3">
                Klausul &amp; Aturan Wajib Penanganan Bukti (Mandatory Protocols):
              </span>
              <div className="space-y-2">
                {activeSOP.rules.map((rule, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800/80 bg-[#040e07] text-xs font-sans text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action launcher */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-400">
                Pusat Siber TNI Angkatan Darat (PUSSIBERAD)
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-wider transition flex items-center gap-1.5"
              >
                <span>Buka Konsol Eksekusi Forensik</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Legal Framework Reference Strip */}
          <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Landasan Hukum &amp; Yuridis Non-Penyangkalan</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Evidensi digital yang dikunci oleh SENTINEL-AD memenuhi syarat alat bukti hukum sah berdasarkan 
              <strong> UU ITE No. 1 Tahun 2024 (Pasal 5 &amp; 6)</strong>, 
              <strong> Hukum Acara Peradilan Militer (UU No. 31/1997)</strong>, dan 
              <strong> Doktrin Cyber Defense TNI AD</strong>. Kriptografi SHA-256 dan pencatatan append-only di smart contract Polygon Amoy menjamin bukti tidak dapat disangkal (non-repudiation) maupun direkayasa oleh oknum internal (insider threat).
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
