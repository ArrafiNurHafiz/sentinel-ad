"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Link2, 
  RefreshCw,
  Eye,
  FileVideo,
  FileImage,
  AudioLines,
  ChevronRight,
  X,
  Lock,
  QrCode,
  Printer
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export interface EvidenceRecord {
  id: number;
  sha256: string;
  file_name: string;
  media_type: string;
  verdict: string;
  is_deepfake: boolean;
  confidence_percentage: number;
  threat_region: string;
  threat_level: string;
  analyzed_at: string;
  locked_on_chain: boolean;
  tx_hash?: string | null;
  ipfs_cid?: string | null;
  officer_address?: string | null;
  processing_ms?: number | null;
  source_url?: string | null;
}

export default function EvidenceLedgerPage() {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/forensics/history?limit=100`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setRecords(json.data.items || []);
        }
      }
    } catch (e) {
      console.warn("[Ledger fetch error]", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Read URL search params for ?filter=locked
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("filter") === "locked") {
        setStatusFilter("LOCKED");
      }
    }
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status filter
      if (statusFilter === "LOCKED" && !r.locked_on_chain) return false;
      if (statusFilter === "DEEPFAKE" && !r.is_deepfake) return false;
      if (statusFilter === "AUTHENTIC" && r.is_deepfake) return false;

      // Region filter
      if (regionFilter !== "ALL" && r.threat_region !== regionFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.file_name.toLowerCase().includes(q);
        const matchHash = r.sha256.toLowerCase().includes(q);
        const matchRegion = (r.threat_region || "").toLowerCase().includes(q);
        if (!matchName && !matchHash && !matchRegion) return false;
      }

      return true;
    });
  }, [records, statusFilter, regionFilter, searchQuery]);

  // Export ledger to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pussiberad_evidence_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const regionsList = Array.from(new Set(records.map((r) => r.threat_region).filter(Boolean)));

  return (
    <div className="min-h-[100dvh] bg-[#030905] text-slate-100 flex">
      <Sidebar activeSection="Buku Besar Evidensi" />

      <div className="lg:pl-[252px] flex-1 flex flex-col min-h-[100dvh]">
        <Topbar />

        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Database className="w-4 h-4 text-emerald-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Buku Besar Evidensi Forensik Digital
                </h1>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                STANDAR ISO/IEC 27037 • RANTAI KUSTODI IMUTABEL POLYGON AMOY (80002)
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchRecords}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#06140b] text-xs font-mono text-slate-300 hover:text-white hover:border-emerald-500/40 transition flex items-center gap-1.5"
                title="Segarkan data registri"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
                <span>Segarkan</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-950/70 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ekspor Audit JSON</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#061009]/80 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SHA-256 digest, nama berkas, atau sektor..."
                className="w-full rounded-lg border border-slate-800 bg-[#030905] py-2 pl-9 pr-4 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 font-mono text-xs text-slate-200 focus:border-emerald-500/60 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Status Kustodi</option>
                <option value="LOCKED">Terkunci di Blockchain (On-Chain)</option>
                <option value="DEEPFAKE">Anomali Deepfake</option>
                <option value="AUTHENTIC">Autentik / Asli</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="md:col-span-3">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 font-mono text-xs text-slate-200 focus:border-emerald-500/60 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Sektor Kodam</option>
                {regionsList.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Evidence Table */}
          <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#040d07] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                    <th className="py-3 px-4 font-bold whitespace-nowrap">ID / Waktu</th>
                    <th className="py-3 px-4 font-bold">Identitas Berkas &amp; Sektor</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">SHA-256 Digest</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Klasifikasi XAI</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Keyakinan</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Status Blockchain</th>
                    <th className="py-3 px-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                        <div className="flex flex-col items-center gap-2">
                          <span className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          <span>Sinkronisasi Rantai Evidensi Forensik...</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading && filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                        Tidak ada rekaman evidensi yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    filteredRecords.map((r, i) => {
                      const isDeepfake = r.is_deepfake;
                      const shortHash = `${r.sha256.slice(0, 8)}...${r.sha256.slice(-6)}`;
                      const isCopied = copiedHash === r.sha256;

                      return (
                        <tr 
                          key={r.sha256 || i} 
                          className="hover:bg-slate-900/40 transition cursor-pointer"
                          onClick={() => setSelectedRecord(r)}
                        >
                          <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                            <span className="text-emerald-400/80 font-bold block">#EV-{String(r.id || i + 1).padStart(4, "0")}</span>
                            <span>{new Date(r.analyzed_at).toLocaleDateString("id-ID")}</span>
                          </td>

                          <td className="py-3 px-4 max-w-[220px]">
                            <span className="font-sans font-bold text-white block truncate text-[12px]">
                              {r.file_name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <span>Sektor: {r.threat_region || "KODAM JAYA"}</span>
                              {r.source_url && (
                                <span className="text-cyan-400 font-mono text-[9px] px-1 bg-cyan-950/70 rounded border border-cyan-800/70">
                                  OSINT
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => copyToClipboard(r.sha256, r.sha256)}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 bg-[#030905] text-[10px] text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition"
                              title="Salin SHA-256 Digest"
                            >
                              <span>{shortHash}</span>
                              {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-slate-500" />}
                            </button>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {isDeepfake ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 border border-red-500/40 text-red-400">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                DEEPFAKE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                AUTENTIK
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap font-bold text-white">
                            {(r.confidence_percentage ?? 0).toFixed(1)}%
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {r.locked_on_chain ? (
                              <a
                                href={`https://amoy.polygonscan.com/tx/${r.tx_hash || ""}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-[10px] font-bold text-emerald-300 hover:bg-emerald-900/50 transition"
                              >
                                <Link2 className="w-2.5 h-2.5 text-emerald-400" />
                                <span>ON-CHAIN</span>
                                <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500">Draf Lokal</span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <Link
                                href={`/dashboard/bap/${r.sha256}`}
                                target="_blank"
                                className="px-2 py-1 rounded border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-[10px] font-bold text-emerald-300 transition flex items-center gap-1"
                                title="Buka Berkas Berita Acara Pemeriksaan (BAP)"
                              >
                                <Printer className="w-2.5 h-2.5" />
                                <span>BAP</span>
                              </Link>

                              <button
                                onClick={() => setSelectedRecord(r)}
                                className="px-2 py-1 rounded border border-slate-800 bg-[#040e07] hover:border-emerald-500/50 text-[11px] text-slate-300 hover:text-emerald-300 transition"
                              >
                                Inspeksi
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination & stats */}
            <div className="px-4 py-3 border-t border-slate-800/80 bg-[#040d07] flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>Menampilkan {filteredRecords.length} dari {records.length} total rekaman evidensi</span>
              <span>STANDAR DIGITAL EVIDENCE ISO/IEC 27037</span>
            </div>
          </div>

          {/* Record Inspection Modal */}
          {selectedRecord && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-2xl rounded-2xl border border-emerald-500/30 bg-[#06140b] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-mono">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-emerald-500/20 pb-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                      INSPEKSI EVIDENSI FORENSIK DIGITAL
                    </span>
                    <h3 className="font-sans text-lg font-black text-white mt-0.5">
                      {selectedRecord.file_name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-800 bg-[#030905]">
                    <span className="text-slate-500 block text-[10px]">HASIL KLASIFIKASI:</span>
                    <span className={`font-bold text-sm mt-0.5 block ${selectedRecord.is_deepfake ? "text-red-400" : "text-emerald-400"}`}>
                      {selectedRecord.verdict} ({selectedRecord.confidence_percentage.toFixed(1)}%)
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800 bg-[#030905]">
                    <span className="text-slate-500 block text-[10px]">SEKTOR KODAM:</span>
                    <span className="font-bold text-sm text-white mt-0.5 block">
                      {selectedRecord.threat_region || "KODAM JAYA"}
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-3 rounded-lg border border-slate-800 bg-[#030905]">
                    <span className="text-slate-500 block text-[10px]">SHA-256 DIGEST:</span>
                    <div className="flex items-center justify-between mt-1 text-slate-200 font-mono text-[11px] break-all">
                      <span>{selectedRecord.sha256}</span>
                      <button
                        onClick={() => copyToClipboard(selectedRecord.sha256, "modal-sha")}
                        className="ml-2 text-emerald-400 hover:text-emerald-300 shrink-0"
                      >
                        {copiedHash === "modal-sha" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {selectedRecord.source_url && (
                    <div className="sm:col-span-2 p-3 rounded-lg border border-cyan-800/40 bg-cyan-950/20">
                      <span className="text-cyan-400 block text-[10px] font-bold">SUMBER INGESTI OSINT (URL):</span>
                      <div className="flex items-center justify-between mt-1 text-cyan-200 font-mono text-[11px] break-all">
                        <span>{selectedRecord.source_url}</span>
                        <a
                          href={selectedRecord.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-cyan-400 hover:text-cyan-300 shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedRecord.tx_hash && (
                    <div className="sm:col-span-2 p-3 rounded-lg border border-slate-800 bg-[#030905]">
                      <span className="text-slate-500 block text-[10px]">TRANSAKSI BLOCKCHAIN (POLYGON AMOY):</span>
                      <div className="flex items-center justify-between mt-1 text-emerald-300 font-mono text-[11px] break-all">
                        <span>{selectedRecord.tx_hash}</span>
                        <a
                          href={`https://amoy.polygonscan.com/tx/${selectedRecord.tx_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-emerald-400 hover:text-emerald-300 shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedRecord.ipfs_cid && (
                    <div className="sm:col-span-2 p-3 rounded-lg border border-slate-800 bg-[#030905]">
                      <span className="text-slate-500 block text-[10px]">IPFS CONTENT IDENTIFIER (CID):</span>
                      <div className="flex items-center justify-between mt-1 text-slate-300 font-mono text-[11px] break-all">
                        <span>{selectedRecord.ipfs_cid}</span>
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${selectedRecord.ipfs_cid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-slate-400 hover:text-white shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification QR Link & BAP Actions */}
                <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-white rounded shrink-0">
                      <QRCodeSVG value={`https://sentinel-ad.mil/verify?hash=${selectedRecord.sha256}`} size={48} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Sertifikat Verifikasi Publik</span>
                      <span className="text-[10px] text-slate-400 block">Dapat dipindai oleh ponsel atau dibuka melalui URL</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/dashboard/bap/${selectedRecord.sha256}`}
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak BAP (PDF)</span>
                    </Link>

                    <Link
                      href={`/verify?hash=${selectedRecord.sha256}`}
                      className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1"
                    >
                      <span>Verifier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
