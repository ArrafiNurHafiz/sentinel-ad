"use client";

import { useState } from "react";
import { 
  FileVideo, 
  FileImage, 
  AudioLines, 
  Link2, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check
} from "lucide-react";

export interface HistoryItem {
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

interface RecentAnalysesProps {
  items: HistoryItem[];
  total: number;
  loading: boolean;
}

function formatWaktu(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function RecentAnalyses({ items, total, loading }: RecentAnalysesProps) {
  const [filter, setFilter] = useState<"ALL" | "DEEPFAKE" | "LOCKED">("ALL");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filtered = items.filter((item) => {
    if (filter === "DEEPFAKE") return item.is_deepfake;
    if (filter === "LOCKED") return item.locked_on_chain;
    return true;
  });

  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-bold text-white leading-tight">
            Buku Besar Evidensi Forensik
          </h2>
          <p className="font-mono text-[10px] text-slate-400">
            Daftar Audit Imutabel Berstandar ISO/IEC 27037 ({total} rekaman)
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-2.5 py-1 rounded transition ${filter === "ALL" ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40" : "text-slate-400 hover:text-white"}`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("DEEPFAKE")}
            className={`px-2.5 py-1 rounded transition ${filter === "DEEPFAKE" ? "bg-red-500/20 text-red-300 font-bold border border-red-500/40" : "text-slate-400 hover:text-red-300"}`}
          >
            Deepfake
          </button>
          <button
            onClick={() => setFilter("LOCKED")}
            className={`px-2.5 py-1 rounded transition ${filter === "LOCKED" ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40" : "text-slate-400 hover:text-white"}`}
          >
            On-Chain
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
              <th className="py-2 px-3 font-semibold">Waktu</th>
              <th className="py-2 px-3 font-semibold">Berkas &amp; Sektor</th>
              <th className="py-2 px-3 font-semibold">SHA-256 Digest</th>
              <th className="py-2 px-3 font-semibold">Hasil</th>
              <th className="py-2 px-3 font-semibold">Keyakinan</th>
              <th className="py-2 px-3 font-semibold">Status Bukti</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Memuat data riwayat evidensi...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Tidak ada evidensi yang sesuai filter.
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((item, idx) => {
                const isDeepfake = item.is_deepfake;
                const shortHash = item.sha256 ? `${item.sha256.slice(0, 8)}...${item.sha256.slice(-6)}` : "—";
                const isCopied = copiedHash === item.sha256;

                return (
                  <tr key={item.sha256 || idx} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                      {formatWaktu(item.analyzed_at)}
                    </td>

                    <td className="py-2.5 px-3 max-w-[200px]">
                      <span className="font-sans font-medium text-white block truncate text-[12px]">
                        {item.file_name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="truncate">{item.threat_region || "KODAM JAYA"}</span>
                        {item.source_url && (
                          <span className="text-cyan-400 font-mono text-[9px] px-1 bg-cyan-950/70 rounded border border-cyan-800/70 shrink-0">
                            OSINT
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <button
                        onClick={() => copyHash(item.sha256)}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 bg-[#030905] text-[10px] text-slate-300 hover:text-emerald-400 transition"
                        title="Klik untuk salin hash"
                      >
                        <span>{shortHash}</span>
                        {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-slate-500" />}
                      </button>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
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

                    <td className="py-2.5 px-3 whitespace-nowrap font-bold text-white text-[11px]">
                      {(item.confidence_percentage ?? 0).toFixed(1)}%
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {item.locked_on_chain ? (
                        <a
                          href={`https://amoy.polygonscan.com/tx/${item.tx_hash || ""}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-[10px] font-bold text-emerald-300 hover:bg-emerald-900/50 transition"
                        >
                          <Link2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>TERKUNCI</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500">Belum Terkunci</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
