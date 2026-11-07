"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { 
  Users, 
  Key, 
  ShieldCheck, 
  Lock, 
  UserPlus, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert,
  ChevronRight,
  X,
  Award,
  RefreshCw,
  Power
} from "lucide-react";
import { useAccount } from "wagmi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface Officer {
  id: string;
  name: string;
  rank: string;
  corps: string;
  role: "ADMIN_ROLE" | "OFFICER_ROLE";
  walletAddress: string;
  unit: string;
  status: "ACTIVE" | "OFFLINE" | "SUSPENDED";
  authorizations: string[];
  issuedAt: string;
}

export default function PersonnelAccessControlPage() {
  const { address, isConnected } = useAccount();
  const [officersList, setOfficersList] = useState<Officer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newName, setNewName] = useState("");
  const [newRank, setNewRank] = useState("Letda Chb.");
  const [newCorps, setNewCorps] = useState("Perhubungan");
  const [newRole, setNewRole] = useState<"OFFICER_ROLE" | "ADMIN_ROLE">("OFFICER_ROLE");
  const [newAddress, setNewAddress] = useState("");
  const [newUnit, setNewUnit] = useState("Satgassiber PUSSIBERAD");

  const fetchPersonnel = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/personnel`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && Array.isArray(json.data)) {
          setOfficersList(json.data);
        }
      }
    } catch (err) {
      console.error("[Personnel fetch error]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/personnel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          rank: newRank.trim(),
          corps: newCorps.trim(),
          role: newRole,
          walletAddress: newAddress.trim(),
          unit: newUnit.trim(),
        }),
      });

      if (res.ok) {
        await fetchPersonnel();
        setShowAddModal(false);
        setNewName("");
        setNewAddress("");
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.detail || "Gagal mendaftarkan perwira ke registri.");
      }
    } catch (err) {
      console.error("[Add officer error]", err);
      alert("Terjadi kesalahan koneksi saat mendaftarkan perwira.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (officerId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/personnel/${officerId}/toggle-status`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchPersonnel();
      }
    } catch (err) {
      console.error("[Toggle status error]", err);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#030905] text-slate-100 flex">
      <Sidebar activeSection="Personel & Otorisasi" />

      <div className="lg:pl-[252px] flex-1 flex flex-col min-h-[100dvh]">
        <Topbar />

        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Key className="w-4 h-4 text-emerald-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Otorisasi Personel &amp; Kunci Taktis (RBAC)
                </h1>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                TATA KELOLA HAK AKSES TERTINGGI SMART CONTRACT TACTICAL EVIDENCE REGISTRY
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 font-bold transition flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daftarkan Kunci Perwira Baru</span>
              </button>
            </div>
          </div>

          {/* Active Key Status Card */}
          <div className="rounded-xl border border-emerald-500/25 bg-[#061209]/85 backdrop-blur-md p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  STATUS SESI PERWIRA AKTIF
                </span>
                <span className="font-bold text-white text-sm sm:text-base">
                  {isConnected && address ? `Terhubung: ${address}` : "Letkol Inf. Arrafi Nur Hafiz (Kunci Komandan Satgassiber)"}
                </span>
                <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                  Peran Smart Contract: <strong className="text-emerald-300">ADMIN_ROLE • DEPLOYMENT AUTHORITY</strong>
                </span>
              </div>
            </div>

            <span className="font-mono text-xs px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-400 font-bold flex items-center gap-1.5 self-start sm:self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              OTORISASI SAH NON-REPUDIATION
            </span>
          </div>

          {/* Authorized Officers Table */}
          <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">
                  Daftar Perwira Pemegang Kunci Taktis On-Chain
                </h2>
                <p className="font-mono text-[10px] text-slate-400">
                  AKUN DENGAN HAK MENANDATANGANI DAN MENGUNCI EVIDENSI FORENSIK
                </p>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                Total Perwira Terdaftar: <strong className="text-white">{officersList.length} Personel</strong>
              </span>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#030905] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                    <th className="py-3 px-4 font-bold">Identitas / Pangkat</th>
                    <th className="py-3 px-4 font-bold">Kesatuan &amp; Penugasan</th>
                    <th className="py-3 px-4 font-bold">Peran Smart Contract</th>
                    <th className="py-3 px-4 font-bold">Kunci Publik (Address)</th>
                    <th className="py-3 px-4 font-bold">Status Otorisasi</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading && officersList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <div className="inline-flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Sinkronisasi Data Personel dari Registri PUSSIBERAD...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && officersList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Belum ada perwira terdaftar di registri RBAC.
                      </td>
                    </tr>
                  )}
                  {officersList.map((off) => {
                    const shortAddr = `${off.walletAddress.slice(0, 6)}...${off.walletAddress.slice(-4)}`;
                    const isCopied = copiedAddress === off.walletAddress;

                    return (
                      <tr key={off.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-sans font-bold text-white text-[12px] block">
                            {off.rank} {off.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            ID: {off.id} • Korps {off.corps}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-300 text-[11px]">
                          {off.unit}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            off.role === "ADMIN_ROLE"
                              ? "bg-amber-950/60 border border-amber-500/50 text-amber-300"
                              : "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                          }`}>
                            <Award className="w-3 h-3" />
                            {off.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <button
                            onClick={() => copyToClipboard(off.walletAddress)}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 bg-[#030905] text-[10px] text-slate-300 hover:text-emerald-400 transition"
                            title="Salin Kunci Publik Perwira"
                          >
                            <span>{shortAddr}</span>
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                          </button>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${
                            off.status === "ACTIVE" 
                              ? "text-emerald-400" 
                              : "text-red-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              off.status === "ACTIVE" ? "bg-emerald-400 animate-pulse" : "bg-red-500"
                            }`} />
                            {off.status === "ACTIVE" ? "AKTIF TERDAFTAR" : "DIBEKUKAN (SUSPENDED)"}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(off.id)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-bold transition ${
                                off.status === "ACTIVE"
                                  ? "border-red-500/40 bg-red-950/30 text-red-300 hover:bg-red-900/50"
                                  : "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50"
                              }`}
                              title={off.status === "ACTIVE" ? "Bekukan Otorisasi Perwira" : "Aktifkan Otorisasi Perwira"}
                            >
                              <Power className="w-2.5 h-2.5" />
                              <span>{off.status === "ACTIVE" ? "Bekukan" : "Aktifkan"}</span>
                            </button>

                            <a
                              href={`https://amoy.polygonscan.com/address/${off.walletAddress}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-800 bg-[#040e07] hover:border-emerald-500/50 text-[10px] text-slate-300 hover:text-emerald-300 transition"
                            >
                              <span>Explorer</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Officer Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
              <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-[#06140b] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <h3 className="font-sans text-base font-black text-white">
                    Pendaftaran Kunci Taktis Perwira
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddOfficer} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Nama Lengkap Perwira:</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Pangkat:</label>
                    <input
                      type="text"
                      required
                      value={newRank}
                      onChange={(e) => setNewRank(e.target.value)}
                      placeholder="Contoh: Kapten Inf."
                      className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Korps:</label>
                    <input
                      type="text"
                      required
                      value={newCorps}
                      onChange={(e) => setNewCorps(e.target.value)}
                      placeholder="Contoh: Perhubungan / Infanteri / Zeni"
                      className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Peran Smart Contract:</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none"
                    >
                      <option value="OFFICER_ROLE">OFFICER_ROLE (Hak Kunci Evidensi &amp; EIP-712)</option>
                      <option value="ADMIN_ROLE">ADMIN_ROLE (Otoritas Penuh &amp; C2 Broadcaster)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Kunci Publik (Address MetaMask/EVM):</label>
                    <input
                      type="text"
                      required
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Kesatuan Teritorial:</label>
                    <input
                      type="text"
                      required
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="Contoh: Satgassiber Kodam Jaya"
                      className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold tracking-wider transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                      <span>{isSubmitting ? "MENDAFTARKAN KE REGISTRI..." : "TERBITKAN OTORISASI PERWIRA"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
