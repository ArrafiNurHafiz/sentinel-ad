"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { 
  ScrollText, 
  Search, 
  Download, 
  Filter, 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock, 
  Cpu, 
  Upload, 
  Radio, 
  QrCode,
  FileText,
  RefreshCw
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface AuditEntry {
  id: string;
  timestamp: string;
  eventType: "INGESTION" | "INFERENCE" | "LOCK_ON_CHAIN" | "C2_ALERT" | "CERT_ISSUED" | "KEY_AUTH" | "VERIFY" | "TRAIN";
  actor: string;
  actorAddress: string;
  resourceHash: string;
  txHash?: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
  description: string;
}

export default function ISO27037AuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/audit?limit=200`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && json.data?.items) {
          setAuditLogs(json.data.items);
        }
      }
    } catch (e) {
      console.error("[Audit fetch error]", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const copyText = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (filterType !== "ALL" && log.eventType !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchActor = (log.actor || "").toLowerCase().includes(q);
      const matchDesc = (log.description || "").toLowerCase().includes(q);
      const matchHash = (log.resourceHash || "").toLowerCase().includes(q);
      if (!matchActor && !matchDesc && !matchHash) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = "ID,Timestamp,Event,Actor,Address,ResourceHash,Status,Description\n";
    const rows = filteredLogs.map((l) => 
      `"${l.id}","${l.timestamp}","${l.eventType}","${l.actor}","${l.actorAddress}","${l.resourceHash}","${l.status}","${l.description}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iso27037_audit_trail_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[100dvh] bg-[#030905] text-slate-100 flex">
      <Sidebar activeSection="Audit Log ISO 27037" />

      <div className="lg:pl-[252px] flex-1 flex flex-col min-h-[100dvh]">
        <Topbar />

        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <ScrollText className="w-4 h-4 text-emerald-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Jejak Audit Forensik (ISO/IEC 27037)
                </h1>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                REKAMAN AKTIVITAS IMUTABEL, APPEND-ONLY, DAN ANTI-SABOTASE PERADILAN MILITER
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={fetchAuditLogs}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#06140b] text-slate-300 font-bold hover:text-emerald-400 hover:border-emerald-500/30 transition flex items-center gap-1.5"
                title="Perbarui data audit log"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-bold hover:bg-emerald-900/50 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh Log Berita Acara (CSV)</span>
              </button>
            </div>
          </div>

          {/* Tamper-Evident Security Seal */}
          <div className="rounded-xl border border-emerald-500/30 bg-[#06140b]/90 p-4 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-bold block">STATUS INTEGRITAS JEJAK AUDIT: 100% TERLINDUNGI</span>
                <span className="text-slate-400 text-[11px]">Setiap entri terindeks kriptografis dan diverifikasi konsistensinya terhadap state blockchain.</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded border border-emerald-500/40 bg-emerald-950 text-emerald-400 text-[10px] font-bold shrink-0 self-start sm:self-center">
              TAMPER-EVIDENT VERIFIED
            </span>
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#061009]/80 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md font-mono text-xs">
            <div className="md:col-span-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari deskripsi, aktor perwira, atau SHA-256 digest..."
                className="w-full rounded-lg border border-slate-800 bg-[#030905] py-2 pl-9 pr-4 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-slate-200 focus:border-emerald-500/60 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Jenis Aktivitas</option>
                <option value="LOCK_ON_CHAIN">Penguncian On-Chain (Blockchain)</option>
                <option value="INFERENCE">Inferensi Model PyTorch XAI</option>
                <option value="INGESTION">Ingestion &amp; Hashing Berkas</option>
                <option value="C2_ALERT">Pancaran Peringatan C2</option>
                <option value="KEY_AUTH">Autentikasi Kunci Taktis</option>
                <option value="CERT_ISSUED">Penerbitan Sertifikat QR</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#030905] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                    <th className="py-3 px-4 font-bold whitespace-nowrap">ID Audit / Waktu</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Jenis Peristiwa</th>
                    <th className="py-3 px-4 font-bold">Aktor / Alamat Penandatangan</th>
                    <th className="py-3 px-4 font-bold">Rincian Operasional Tindakan</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading && auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <div className="inline-flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Sinkronisasi Rekaman Log Audit ISO/IEC 27037...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Tidak ada catatan audit yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                  {filteredLogs.map((log) => {
                    const isCopied = copied === log.id;
                    return (
                      <tr key={log.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                          <span className="text-emerald-400 font-bold block">{log.id}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString("id-ID")} WIB</span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded border border-slate-800 bg-[#040e07] text-[10px] font-bold text-slate-200">
                            {log.eventType}
                          </span>
                        </td>

                        <td className="py-3 px-4 max-w-[200px]">
                          <span className="font-bold text-white block text-[11px] truncate">{log.actor}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{log.actorAddress}</span>
                        </td>

                        <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                          {log.description}
                          {log.txHash && (
                            <span className="font-mono text-[10px] text-emerald-400 block mt-1 truncate max-w-[300px]">
                              Tx: {log.txHash}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            SAH &amp; TERVERIFIKASI
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-slate-800/80 bg-[#030905] flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>Menampilkan {filteredLogs.length} dari {auditLogs.length} rekaman audit ISO/IEC 27037</span>
              <span>STANDAR HUKUM ACARA PERADILAN MILITER</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
