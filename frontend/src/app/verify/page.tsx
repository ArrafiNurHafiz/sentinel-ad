"use client";

import { useState, useEffect } from "react";
import { Shield, Search, AlertTriangle, CheckCircle, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicVerifyPage() {
  const [hashInput, setHashInput] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  // Check URL query parameters for ?hash=
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryHash = params.get("hash");
      if (queryHash) {
        setHashInput(queryHash);
        executeVerification(queryHash);
      }
    }
  }, []);

  const executeVerification = async (targetHash: string) => {
    if (!targetHash.trim()) return;
    setIsLoading(true);
    setSearched(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    try {
      const res = await fetch(`${backendUrl}/api/v1/forensics/verify/${targetHash.trim()}`);
      if (res.ok) {
        const json = await res.json();
        setResult(json.data);
      } else {
        setResult({
          sha256: targetHash.trim(),
          is_registered: false,
          verdict: "UNVERIFIED_MEDIA",
          official_statement: "Media ini belum tercatat dalam registri resmi investigasi forensik PUSSIBERAD TNI AD.",
          locked_on_blockchain: false,
          tx_hash: null,
          blockchain_explorer_url: null,
          verified_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      setResult({
        sha256: targetHash.trim(),
        is_registered: false,
        verdict: "CONNECTION_ERROR",
        official_statement: "Koneksi ke server registri forensik PUSSIBERAD terputus. Pastikan backend aktif.",
        locked_on_blockchain: false,
        tx_hash: null,
        blockchain_explorer_url: null,
        verified_at: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(hashInput);
  };

  return (
    <div className="min-h-screen bg-[#060A10] bg-tactical-grid flex flex-col font-mono text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#090E17]/90 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/dashboard"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              <span>Command Center</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">PORTAL VERIFIKASI PUBLIK KONTRA-DISINFORMASI</span>
            <span className="sm:hidden">VERIFIKASI PUBLIK</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 my-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-3">
            <Shield className="w-9 h-9" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-slate-100">
            PUSSIBERAD EVIDENCE VERIFIER
          </h1>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Verifikasi keabsahan konten digital dan bantahan resmi TNI AD secara independen melalui Buku Besar Kriptografis Rantai Bukti Digital.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleFormSubmit} className="relative">
          <input
            type="text"
            placeholder="Masukkan Hash SHA-256 media digital..."
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-emerald-500 rounded-xl py-3.5 pl-4 pr-12 text-xs text-emerald-300 placeholder:text-slate-600 focus:outline-none transition shadow-inner font-mono"
          />
          <button
            type="submit"
            disabled={isLoading || !hashInput.trim()}
            className="absolute right-2 top-2 bottom-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Verification Result Card */}
        {searched && result && (
          <div
            className={`rounded-xl p-6 border transition space-y-4 animate-in fade-in duration-200 ${
              result.verdict === "DEEPFAKE_DETECTED"
                ? "bg-red-950/30 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                : "bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  result.verdict === "DEEPFAKE_DETECTED"
                    ? "bg-red-950 border border-red-500 text-red-400"
                    : "bg-emerald-950 border border-emerald-500 text-emerald-400"
                }`}
              >
                {result.verdict === "DEEPFAKE_DETECTED" ? (
                  <AlertTriangle className="w-8 h-8 animate-pulse" />
                ) : (
                  <CheckCircle className="w-8 h-8" />
                )}
              </div>
              <div className="space-y-1">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    result.verdict === "DEEPFAKE_DETECTED"
                      ? "bg-red-950 text-red-300 border border-red-500"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-500"
                  }`}
                >
                  {result.verdict}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-100">
                  {result.official_statement}
                </h2>
                <p className="text-[11px] text-slate-400">
                  Diverifikasi resmi pada: {new Date(result.verified_at).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Evidence Technical Proof */}
            <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Status Konsensus Blockchain:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> IMMUTABLE ON-CHAIN
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">DIGITAL ASSET HASH (SHA-256):</span>
                <span className="text-emerald-400 text-[11px] break-all">{result.sha256}</span>
              </div>

              {result.tx_hash && (
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Audit Explorer Polygon:</span>
                  <a
                    href={result.blockchain_explorer_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>{result.tx_hash.slice(0, 10)}...{result.tx_hash.slice(-6)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-600">
        Dispenad × PUSSIBERAD TNI AD • Dedicated to Truth & Integrity in National Cyberspace
      </footer>
    </div>
  );
}
