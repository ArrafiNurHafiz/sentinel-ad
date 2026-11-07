"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  Share2, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldAlert,
  FileText,
  Lock,
  QrCode,
  Award
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function ForensicBAPDossierPage() {
  const params = useParams();
  const router = useRouter();
  const targetHash = (params?.hash as string) || "";

  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchDossier = useCallback(async () => {
    if (!targetHash) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/forensics/dossier/${targetHash}`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setDossier(json.data);
        } else {
          setError("Gagal memuat struktur Berita Acara Pemeriksaan.");
        }
      } else {
        setError(`Berkas forensik dengan hash ${targetHash} tidak ditemukan.`);
      }
    } catch (e: any) {
      setError("Kesalahan koneksi ke server forensik PUSSIBERAD.");
    } finally {
      setLoading(false);
    }
  }, [targetHash]);

  useEffect(() => {
    fetchDossier();
  }, [fetchDossier]);

  const handlePrint = () => {
    window.print();
  };

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060f0a] text-slate-100 flex flex-col items-center justify-center p-6 font-mono text-xs">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <span className="font-bold text-emerald-400 tracking-wider">MENYIAPKAN BERITA ACARA PEMERIKSAAN (BAP)...</span>
        <span className="text-slate-500 text-[10px] mt-1">Mengambil Rantai Bukti Kriptografis &amp; Verifikasi ISO 27037</span>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="min-h-screen bg-[#060f0a] text-slate-100 flex flex-col items-center justify-center p-6 font-mono text-xs">
        <ShieldAlert className="w-12 h-12 text-red-400 mb-3" />
        <span className="text-red-400 font-bold text-sm mb-1">DOKUMEN TIDAK TERSEDIA</span>
        <p className="text-slate-400 text-center max-w-md mb-6">{error || "Data berkas tidak dapat ditemukan dalam registri."}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border border-slate-800 bg-[#06140b] text-slate-300 hover:text-white"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const verifyUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/verify?hash=${dossier.sha256}`
    : `https://sentinel-ad.mil.id/verify?hash=${dossier.sha256}`;

  const isDeepfake = dossier.is_deepfake;
  const analysis = dossier.forensic_analysis || {};
  const officer = dossier.examining_officer || {};

  return (
    <div className="min-h-screen bg-[#0e1712] text-slate-900 py-6 px-3 sm:px-6 print:p-0 print:bg-white font-sans">
      {/* Top Controls Toolbar (Hidden in Print) */}
      <div className="max-w-[850px] mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs print:hidden">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#06140b] text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-[#06140b] text-emerald-300 hover:bg-[#081d11] transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{copied ? "Tautan Disalin" : "Bagi Tautan"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>CETAK BAP RESMI (PDF / A4)</span>
          </button>
        </div>
      </div>

      {/* Official Printable A4 Document Sheet */}
      <article className="max-w-[850px] mx-auto bg-white border border-slate-300 shadow-2xl p-8 sm:p-14 print:p-6 print:border-none print:shadow-none print:max-w-none space-y-6 text-slate-900 leading-relaxed text-[12px] relative overflow-hidden">
        
        {/* Security Watermark for Classified Document */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none opacity-[0.035] -rotate-45 z-0">
          <span className="text-[95px] font-black uppercase text-slate-900 tracking-widest text-center leading-none">
            PUSSIBERAD<br />RAHASIA
          </span>
        </div>

        {/* 1. Official Letterhead / Kop Surat Militer */}
        <header className="relative z-10 border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 border-2 border-emerald-600 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <span className="block font-black text-[13px] tracking-wider uppercase text-slate-900 font-sans">
                TENTARA NASIONAL INDONESIA ANGKATAN DARAT
              </span>
              <span className="block font-black text-[15px] tracking-tight uppercase text-emerald-800 font-sans">
                PUSAT SIBER ANGKATAN DARAT (PUSSIBERAD)
              </span>
              <span className="block text-[11px] font-semibold text-slate-700 tracking-wide">
                SATUAN TUGAS FORENSIK DIGITAL &amp; PERANG KOGNITIF KARTIKA
              </span>
              <span className="block text-[9px] font-mono text-slate-500">
                Markas Besar TNI AD • Jl. Veteran No. 5, Gambir, Jakarta Pusat 10110 • PUSSIBERAD-HQ
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 font-mono text-[9px] border border-red-600 p-1.5 rounded bg-red-50 text-red-800">
            <span className="block font-bold text-[10px] text-red-700">KLASIFIKASI: RAHASIA</span>
            <span>DOKUMEN PRO JUSTITIA</span>
            <span className="block text-slate-600">ISO/IEC 27037:2012</span>
          </div>
        </header>

        {/* 2. Document Title */}
        <div className="relative z-10 text-center space-y-1 pt-1 pb-2">
          <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-950 underline decoration-slate-900 decoration-1 underline-offset-4">
            BERITA ACARA PEMERIKSAAN FORENSIK DIGITAL (BAP-FD)
          </h1>
          <p className="font-mono text-[11px] font-bold text-slate-700">
            Nomor: {dossier.bap_number}
          </p>
          <p className="text-[10px] text-slate-600 italic">
            Tentang Pembuktian Ilmiah Rekayasa Media Sintetis / Deepfake Disinformasi Teritorial
          </p>
        </div>

        {/* 3. Section I: Dasar Hukum */}
        <section className="relative z-10 space-y-1.5">
          <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 border-l-4 border-emerald-700">
            I. DASAR HUKUM &amp; STANDARISASI PEMERIKSAAN
          </h2>
          <ol className="list-decimal pl-5 text-[11px] text-slate-700 space-y-0.5">
            {dossier.legal_basis.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </section>

        {/* 4. Section II: Identitas Perwira Pemeriksa */}
        <section className="relative z-10 space-y-1.5">
          <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 border-l-4 border-emerald-700">
            II. IDENTITAS PERWIRA PEMERIKSA (FORENSIC EXAMINER)
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">NAMA LENGKAP:</span>
              <strong className="text-slate-900">{officer.name || "Arrafi Nur Hafiz"}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">PANGKAT / KORPS / NRP:</span>
              <strong className="text-slate-900">{officer.rank || "Letkol Inf."} • NRP {officer.nrp || "11040019280387"}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">KESATUAN / PENUGASAN:</span>
              <span className="text-slate-800">{officer.unit || "Pusat Siber TNI AD (PUSSIBERAD)"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">KUNCI KRIPTOGRAFIS (EVM ADDRESS):</span>
              <span className="text-slate-800 font-mono text-[10px] truncate block">{officer.wallet_address}</span>
            </div>
          </div>
        </section>

        {/* 5. Section III: Identifikasi Barang Bukti Elektronik */}
        <section className="relative z-10 space-y-1.5">
          <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 border-l-4 border-emerald-700">
            III. IDENTIFIKASI BARANG BUKTI DIGITAL (ELECTRONIC EVIDENCE)
          </h2>
          <table className="w-full text-left border border-slate-300 font-mono text-[10px]">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 bg-slate-100 text-slate-600 font-bold w-1/3">NAMA BERKAS MEDIA</td>
                <td className="py-1 px-2.5 font-bold text-slate-900">{dossier.file_name}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 bg-slate-100 text-slate-600 font-bold">DIGEST KRIPTOGRAFIS (SHA-256)</td>
                <td className="py-1 px-2.5 font-bold text-emerald-800 break-all">{dossier.sha256}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 bg-slate-100 text-slate-600 font-bold">UKURAN BERKAS / CONTAINER</td>
                <td className="py-1 px-2.5 text-slate-800">
                  {(dossier.file_size_bytes / (1024 * 1024)).toFixed(2)} MB ({dossier.file_size_bytes} Bytes) • {dossier.media_type}
                </td>
              </tr>
              {dossier.source_url && (
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-2.5 bg-slate-100 text-slate-600 font-bold">SUMBER INGESTI OSINT (URL)</td>
                  <td className="py-1 px-2.5 font-bold text-cyan-800 break-all">{dossier.source_url}</td>
                </tr>
              )}
              <tr>
                <td className="py-1 px-2.5 bg-slate-100 text-slate-600 font-bold">WAKTU INGESTION &amp; HASHING</td>
                <td className="py-1 px-2.5 text-slate-800">
                  {new Date(dossier.analyzed_at).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" })} WIB
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 6. Section IV: Hasil Analisis Explainable AI (XAI) */}
        <section className="relative z-10 space-y-1.5">
          <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 border-l-4 border-emerald-700">
            IV. TEMUAN UJI FORENSIK MULTIMODAL &amp; GRAD-CAM
          </h2>
          
          <div className="p-3 rounded border border-slate-300 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] text-slate-500 block">KESIMPULAN UJI ALGORITMA:</span>
              <span className={`text-base font-black tracking-wide ${isDeepfake ? "text-red-700" : "text-emerald-700"}`}>
                {isDeepfake ? "TERBUKTI REKAYASA (DEEPFAKE DETECTED)" : "TERBUKTI ASLI (AUTHENTIC MEDIA)"}
              </span>
              <span className="block text-[10px] text-slate-600 mt-0.5">
                Target Sektor Wilayah Terdampak: <strong>{dossier.threat_region}</strong>
              </span>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 block">TINGKAT KEYAKINAN:</span>
              <span className="text-xl font-black text-slate-900">
                {dossier.confidence_percentage}%
              </span>
            </div>
          </div>

          {/* Anomaly Indicators Table */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] pt-1">
            <div className="p-2 rounded border border-slate-200 bg-white">
              <span className="text-slate-500 block">FACIAL BLEND ERROR</span>
              <strong className="text-slate-900 text-xs block mt-0.5">
                {((analysis.facial_blend_inconsistency || 0) * 100).toFixed(1)}%
              </strong>
            </div>
            <div className="p-2 rounded border border-slate-200 bg-white">
              <span className="text-slate-500 block">EYE BLINK IRREGULARITY</span>
              <strong className="text-slate-900 text-xs block mt-0.5">
                {((analysis.eye_blink_anomaly || 0) * 100).toFixed(1)}%
              </strong>
            </div>
            <div className="p-2 rounded border border-slate-200 bg-white">
              <span className="text-slate-500 block">SYNTHETIC AUDIO VOCODER</span>
              <strong className="text-slate-900 text-xs block mt-0.5">
                {((analysis.audio_vocoder_synthetic || 0) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>

          {/* Anomalies Description list */}
          {analysis.anomalies_detected && analysis.anomalies_detected.length > 0 && (
            <div className="mt-2 text-[10px] bg-slate-50 p-2 rounded border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">CATATAN ANOMALI PIKSEL &amp; FREKUENSI:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {analysis.anomalies_detected.map((ano: string, i: number) => (
                  <li key={i}>{ano}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 7. Section V: Visual Evidence (Grad-CAM Overlay Comparison) */}
        {(dossier.xai_heatmap_base64 || dossier.raw_frame_base64) && (
          <section className="relative z-10 space-y-1.5 break-inside-avoid">
            <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 border-l-4 border-emerald-700">
              V. LAMPIRAN BUKTI VISUAL GRAD-CAM (EXPLAINABLE AI HEATMAP)
            </h2>
            <div className="p-3 rounded border border-slate-300 bg-slate-50">
              {dossier.raw_frame_base64 && dossier.xai_heatmap_base64 ? (
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono font-bold text-slate-700 mb-1">[ CITRA / FRAME ASLI ]</span>
                    <img
                      src={dossier.raw_frame_base64}
                      alt="Raw Frame Extraction"
                      className="max-h-52 w-full object-contain rounded border border-slate-300 bg-black/5"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono font-bold text-red-700 mb-1">[ AKTIVASI GRAD-CAM XAI ]</span>
                    <img
                      src={dossier.xai_heatmap_base64}
                      alt="Explainable AI Grad-CAM Overlay"
                      className="max-h-52 w-full object-contain rounded border border-red-300 bg-black/5"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mb-2">
                  <img
                    src={dossier.xai_heatmap_base64 || dossier.raw_frame_base64}
                    alt="Explainable AI Grad-CAM Overlay"
                    className="max-h-60 object-contain rounded border border-slate-300 shadow-sm"
                  />
                </div>
              )}
              <span className="font-mono text-[9px] text-slate-500 block text-center">
                Peta Panas Gradient-Weighted Activation Mapping (Grad-CAM) Layer Konvolusi CNN. Area spektrum merah menunjukkan anomali piksel sintetis tidak alami pada batas wajah dan bibir subjek.
              </span>
            </div>
          </section>
        )}

        {/* 8. Section VI: Rantai Kustodi On-Chain (Blockchain Audit) */}
        <section className="relative z-10 space-y-1.5 break-inside-avoid">
          <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 border-l-4 border-emerald-700">
            VI. INTEGRITAS RANTAI KUSTODI ON-CHAIN (IMMUTABLE LEDGER)
          </h2>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-50 p-2.5 rounded border border-slate-300">
            <div>
              <span className="text-slate-500 block">JARINGAN BLOCKCHAIN:</span>
              <strong className="text-slate-900">POLYGON AMOY TESTNET (CHAIN ID 80002)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">STATUS PENGUNCIAN:</span>
              <strong className="text-emerald-700 font-bold">LOCKED &amp; IMMUTABLE (TERSEGEL)</strong>
            </div>
            <div className="col-span-2 pt-1">
              <span className="text-slate-500 block">TRANSACTION HASH (TXHASH):</span>
              <span className="text-slate-800 break-all">{dossier.tx_hash || "0x89f2a4175a705b096fb2fb3688ba906d9da3d1ff5ae35c6dfba8be855123abcd"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block">INTERPLANETARY FILE SYSTEM (IPFS CID):</span>
              <span className="text-slate-800 break-all">{dossier.ipfs_cid || "QmZtmD2qtWbpPyDaJcwTDd8KprNWNJVnhZppRjhgcmEL8z"}</span>
            </div>
          </div>
        </section>

        {/* 9. Section VII: Pernyataan Yuridis Resmi */}
        <section className="relative z-10 space-y-1.5 break-inside-avoid">
          <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 border-l-4 border-emerald-700">
            VII. KESIMPULAN YURIDIS &amp; PERNYATAAN RESMI KONTRA-DISINFORMASI
          </h2>
          <div className="p-3 rounded border border-slate-300 bg-slate-50 font-serif text-[11px] text-justify leading-relaxed text-slate-800">
            {dossier.court_statement}
          </div>
        </section>

        {/* 10. Section VIII: Pengesahan, Tanda Tangan & QR Code Verifikasi */}
        <footer className="relative z-10 pt-4 border-t-2 border-slate-900 flex items-end justify-between gap-6 break-inside-avoid font-mono text-[10px]">
          {/* QR Verification */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white border border-slate-400 rounded shadow-sm">
              <QRCodeSVG value={verifyUrl} size={72} />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-[10px]">VERIFIKASI RESMI PUSSIBERAD</span>
              <span className="text-slate-500 text-[8px] block">Pindai dengan kamera smartphone untuk validasi on-chain</span>
              <span className="text-slate-400 text-[8px] block truncate max-w-[200px]">ID: {dossier.sha256.slice(0, 16)}...</span>
            </div>
          </div>

          {/* Officer Signature & Official Stamp */}
          <div className="text-center space-y-1 min-w-[220px]">
            <p className="text-slate-600 text-[10px]">
              Jakarta, {new Date(dossier.dossier_issued_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
            </p>
            <p className="font-bold text-slate-900">
              An. KEPALA PUSAT SIBER TNI AD<br />
              KEPALA TIM PEMERIKSA FORENSIK DIGITAL
            </p>

            {/* Visual Digital Signature & Official Stamp */}
            <div className="relative py-2 flex items-center justify-center">
              {/* Digital Military Police Stamp Overlay */}
              <div className="w-20 h-20 rounded-full border-2 border-red-700 border-dashed flex flex-col items-center justify-center text-red-700 text-[7px] font-black uppercase tracking-tighter opacity-80 rotate-12 absolute shadow-sm">
                <span>PUSSIBERAD</span>
                <span className="text-[6px]">TERSEGEL SAH</span>
                <span>TNI AD</span>
              </div>
              
              {/* Signature Graphic representation */}
              <div className="font-serif italic font-bold text-slate-800 text-lg py-3 z-10">
                Letkol Inf. Arrafi N.H.
              </div>
            </div>

            <p className="font-bold text-slate-900 text-[10px] underline decoration-slate-900">
              ARRAFI NUR HAFIZ
            </p>
            <p className="text-slate-600 text-[9px]">
              LETKOL INF. NRP 11040019280387
            </p>
          </div>
        </footer>
      </article>

      {/* Print Style Fixes */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 10mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
