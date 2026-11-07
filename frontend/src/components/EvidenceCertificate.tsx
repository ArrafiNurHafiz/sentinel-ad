"use client";

import { QRCodeSVG } from "qrcode.react";
import { Shield, ExternalLink, CheckCircle, Copy, Check, Printer, FileText } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface CertificateProps {
  mediaHash: string;
  txHash: string;
  ipfsCID: string;
  officerAddress: string;
  verdict: string;
  confidenceScore: number;
  threatRegion: string;
  timestamp: string;
}

export function EvidenceCertificate({
  mediaHash,
  txHash,
  ipfsCID,
  officerAddress,
  verdict,
  confidenceScore,
  threatRegion,
  timestamp,
}: CertificateProps) {
  const [copied, setCopied] = useState(false);

  const verificationUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify?hash=${mediaHash}`
    : `https://sentinel-ad.mil/verify?hash=${mediaHash}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-6 tactical-border font-mono relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
        <Shield className="w-64 h-64 text-emerald-400" />
      </div>

      {/* Certificate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-widest text-emerald-400">
              PUSAT SIBER TNI ANGKATAN DARAT (PUSSIBERAD)
            </h3>
            <p className="text-[11px] text-slate-400 tracking-wider">
              DIGITAL FORENSIC EVIDENCE CERTIFICATE // ISO/IEC 27037
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
            IMMUTABLE LEDGER VERIFIED
          </span>
          <p className="text-[10px] text-slate-500 mt-1">ID: #CERT-{mediaHash.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      {/* Certificate Body: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Column: Metadata Details */}
        <div className="md:col-span-2 space-y-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">HASIL KLASIFIKASI FORENSIK:</span>
            <span className="text-red-400 font-bold text-sm tracking-wide">
              {verdict} (KEYAKINAN: {(confidenceScore / 100).toFixed(1)}%)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">SHA-256 DIGITAL EVIDENCE HASH:</span>
            <span className="text-emerald-400 text-[11px] break-all bg-slate-900 px-2 py-1 rounded block border border-slate-800">
              {mediaHash}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">PERWIRA PENANDATANGAN:</span>
              <span className="text-slate-200">
                {officerAddress.slice(0, 8)}...{officerAddress.slice(-6)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">KODAM YURISDIKSI:</span>
              <span className="text-slate-200 font-bold">{threatRegion}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-500 block text-[10px]">POLYGON AMOY TX:</span>
              <a
                href={`https://amoy.polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>{txHash.slice(0, 10)}...{txHash.slice(-6)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">IPFS TACTICAL CID:</span>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsCID}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>{ipfsCID.slice(0, 10)}...</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Scannable Public QR Code */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-center">
          <div className="p-2 bg-white rounded-md shadow-md">
            <QRCodeSVG value={verificationUrl} size={110} level="H" />
          </div>
          <span className="text-[10px] text-slate-300 font-bold mt-2">
            SCAN QR VERIFIKASI PUBLIK
          </span>
          <p className="text-[9px] text-slate-500 mb-2">
            Dispenad Counter-Disinformation Portal
          </p>

          <button
            onClick={copyToClipboard}
            className="w-full py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center gap-1 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "URL Tersalin!" : "Salin Link Verifikasi"}</span>
          </button>
        </div>
      </div>

      {/* Official BAP Dossier Action Strip */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Dokumen berkas perkara sah peradilan militer (ISO/IEC 27037:2012 &amp; KUHAP Militer)</span>
        </div>

        <Link
          href={`/dashboard/bap/${mediaHash}`}
          target="_blank"
          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition active:scale-95 shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Buka &amp; Cetak Berkas BAP (PDF)</span>
        </Link>
      </div>
    </div>
  );
}
