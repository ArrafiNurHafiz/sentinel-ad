"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Fingerprint,
  Copy,
  Check,
} from "lucide-react";

export function PublicVerifyWidget() {
  const [hashInput, setHashInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [copied, setCopied] = useState(false);

  // Real hashes recorded in the backend evidence registry
  const SAMPLE_HASHES = [
    {
      label: "Pernyataan Komandan (Sosmed)",
      type: "Deepfake Kritis",
      hash: "b482ff8cbf68a6564ef19937b2fe09c4d207a4a769901953dfee9ef0548bd8e2",
    },
    {
      label: "Instruksi Operasi (WhatsApp)",
      type: "Deepfake Suara",
      hash: "c7104ae5368a41289fe81023bc456def89a1234567890abcdef1234567890abc",
    },
    {
      label: "Foto Perbatasan Terverifikasi",
      type: "Media Asli",
      hash: "a1234567890bcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
  ];

  const handleVerify = async (targetHash: string) => {
    const clean = targetHash.trim().toLowerCase();
    if (!clean) return;

    setIsLoading(true);
    setHasQueried(true);
    setHashInput(clean);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    try {
      const res = await fetch(`${backendUrl}/api/v1/forensics/verify/${clean}`);
      if (res.ok) {
        const json = await res.json();
        setResult(json.data);
      } else {
        setResult({
          sha256: clean,
          is_registered: false,
          verdict: "UNVERIFIED_MEDIA",
          official_statement: "Hash tidak tercatat dalam registri resmi barang bukti forensik PUSSIBERAD.",
          locked_on_blockchain: false,
          verified_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      setResult({
        sha256: clean,
        is_registered: false,
        verdict: "CONNECTION_ERROR",
        official_statement: "Koneksi ke server registri forensik PUSSIBERAD terputus. Pastikan backend aktif.",
        locked_on_blockchain: false,
        verified_at: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#081810]/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="max-w-2xl mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Uji Verifikasi Bukti Digital Publik
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
          Masukkan hash SHA-256 media digital untuk memeriksa apakah berkas telah diinvestigasi oleh PUSSIBERAD TNI AD dan dikunci pada blockchain Polygon Amoy.
        </p>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify(hashInput);
        }}
        className="flex flex-col sm:flex-row gap-3 mb-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            placeholder="Masukkan 64-karakter SHA-256 hash media..."
            className="w-full rounded-xl border border-white/10 bg-[#040906] py-3.5 pl-10 pr-4 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] disabled:opacity-60 active:scale-[0.98]"
        >
          {isLoading ? (
            <span>Memeriksa...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Verifikasi Hash</span>
            </>
          )}
        </button>
      </form>

      {/* Quick sample chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[11px] font-mono text-slate-400">Contoh Kasus Riil:</span>
        {SAMPLE_HASHES.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleVerify(s.hash)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0a1f14] hover:border-emerald-500/50 text-[11px] font-mono text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Query Result Panel */}
      {hasQueried && result && (
        <div
          className={`rounded-2xl border p-5 transition-all ${
            result.verdict === "DEEPFAKE_DETECTED"
              ? "border-red-500/40 bg-red-950/20 shadow-[0_0_25px_rgba(239,68,68,0.15)]"
              : result.is_registered
              ? "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
              : "border-slate-700 bg-slate-900/40"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              {result.verdict === "DEEPFAKE_DETECTED" ? (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              ) : result.is_registered ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-slate-400" />
              )}
              <span
                className={`font-mono text-xs font-bold uppercase tracking-wider ${
                  result.verdict === "DEEPFAKE_DETECTED"
                    ? "text-red-400"
                    : result.is_registered
                    ? "text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {result.verdict}
              </span>
            </div>

            {result.locked_on_blockchain && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>TERKUNCI ON-CHAIN (POLYGON AMOY)</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-3">
            {result.official_statement}
          </p>

          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">SHA-256: </span>
              <span className="text-slate-300 select-all">{result.sha256}</span>
              <button
                type="button"
                onClick={() => copyHash(result.sha256)}
                className="p-1 text-slate-400 hover:text-white"
                title="Salin Hash"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {result.tx_hash && (
              <a
                href={result.blockchain_explorer_url || `https://amoy.polygonscan.com/tx/${result.tx_hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
              >
                <span>Lihat Bukti di Polygonscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Link to full verify page */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Memerlukan verifikasi lanjutan atau unggah file mandiri?
        </span>
        <Link
          href="/verify"
          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline"
        >
          <span>Buka Portal Verifikasi Publik Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
