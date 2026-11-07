"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Link2, 
  Database, 
  Server, 
  Check, 
  RefreshCw,
  Terminal,
  Save,
  Radio,
  Lock
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function SystemSettingsPage() {
  const [device, setDevice] = useState<string>("cpu");
  const [threshold, setThreshold] = useState<number>(85);
  const [airGappedMode, setAirGappedMode] = useState<boolean>(true);
  const [rpcUrl, setRpcUrl] = useState<string>("https://rpc-amoy.polygon.technology/");
  const [contractAddress, setContractAddress] = useState<string>("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const [ipfsGateway, setIpfsGateway] = useState<string>("https://gateway.pinata.cloud/ipfs/");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/settings`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && json.data) {
          const d = json.data;
          if (d.device) setDevice(d.device);
          if (typeof d.threshold === "number") setThreshold(d.threshold);
          if (typeof d.airGappedMode === "boolean") setAirGappedMode(d.airGappedMode);
          if (d.rpcUrl) setRpcUrl(d.rpcUrl);
          if (d.contractAddress) setContractAddress(d.contractAddress);
          if (d.ipfsGateway) setIpfsGateway(d.ipfsGateway);
          if (d.updatedAt) setLastUpdated(d.updatedAt);
        }
      }
    } catch (e) {
      console.error("[Settings fetch error]", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device,
          threshold,
          airGappedMode,
          rpcUrl,
          contractAddress,
          ipfsGateway,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setSavedSuccess(true);
        if (json.data?.updatedAt) {
          setLastUpdated(json.data.updatedAt);
        }
        setTimeout(() => setSavedSuccess(false), 3500);
      } else {
        alert("Gagal menyimpan konfigurasi ke sistem backend.");
      }
    } catch (err) {
      console.error("[Save settings error]", err);
      alert("Kesalahan koneksi saat menyimpan konfigurasi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#030905] text-slate-100 flex">
      <Sidebar activeSection="Konfigurasi Sistem" />

      <div className="lg:pl-[252px] flex-1 flex flex-col min-h-[100dvh]">
        <Topbar />

        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Settings className="w-4 h-4 text-emerald-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Konfigurasi Sistem &amp; Kedaulatan Siber
                </h1>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                PENGATURAN AIR-GAPPED INTRANET, INFERENSI PYTORCH XAI, DAN LEDGER BLOCKCHAIN
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 rounded bg-[#07170e] border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                STATUS: SISTEM NORMAL TERLINDUNGI
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Mode Operasi & Kedaulatan Data */}
            <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white">Mode Operasi &amp; Kedaulatan Data</h2>
                </div>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 uppercase font-bold">
                  DOKTRIN MANDIRI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setAirGappedMode(true)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    airGappedMode 
                      ? "border-emerald-400 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                      : "border-slate-800 bg-[#030905]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      AIR-GAPPED MILITARY INTRANET (DIREKOMENDASIKAN)
                    </span>
                    <span className={`w-2 h-2 rounded-full ${airGappedMode ? "bg-emerald-400" : "bg-slate-700"}`} />
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Sistem beroperasi 100% mandiri pada jaringan tertutup Mabes TNI / PUSSIBERAD. Tidak ada piksel atau frame video yang bocor ke cloud komersial asing.
                  </p>
                </div>

                <div 
                  onClick={() => setAirGappedMode(false)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    !airGappedMode 
                      ? "border-emerald-400 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                      : "border-slate-800 bg-[#030905]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-300">
                      HYBRID CLOUD TESTNET
                    </span>
                    <span className={`w-2 h-2 rounded-full ${!airGappedMode ? "bg-emerald-400" : "bg-slate-700"}`} />
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Mode pengembangan dan uji coba publik terhubung ke Polygon Amoy Testnet RPC publik dan IPFS Pinata Gateway.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. AI Inference Engine Settings */}
            <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white">Parameter Inferensi AI (PyTorch Core)</h2>
                </div>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 uppercase font-bold">
                  PYTORCH 2.0+
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Akselerasi Perangkat Keras (Hardware Acceleration):</label>
                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none cursor-pointer"
                  >
                    <option value="cpu">CPU (Intel Xeon / AMD EPYC Standalone)</option>
                    <option value="cuda">CUDA GPU (NVIDIA Tensor Core Acceleration)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 block mt-1">Fallback otomatis ke CPU jika kartu grafis tidak terdeteksi.</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Ambang Batas Keyakinan Anomali (Threshold):</span>
                    <strong className="text-emerald-400">{threshold}%</strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer mt-2"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Standar militer PUSSIBERAD: 85% untuk penetapan status Deepfake.</span>
                </div>
              </div>
            </div>

            {/* 3. Blockchain & Smart Contract Settings */}
            <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white">Buku Besar Blockchain (Polygon Amoy Testnet)</h2>
                </div>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 uppercase font-bold">
                  CHAIN ID: 80002
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Endpoint RPC Polygon Amoy:</label>
                  <input
                    type="text"
                    value={rpcUrl}
                    onChange={(e) => setRpcUrl(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Alamat Smart Contract (TacticalEvidenceRegistry):</label>
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-emerald-300 focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. IPFS Vault Settings */}
            <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white">Penyimpanan Terdesentralisasi (IPFS Vault)</h2>
                </div>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 uppercase font-bold">
                  RESILIENT VAULT
                </span>
              </div>

              <div className="font-mono text-xs">
                <label className="block text-slate-400 mb-1">Gateway IPFS Publik / Intranet:</label>
                <input
                  type="text"
                  value={ipfsGateway}
                  onChange={(e) => setIpfsGateway(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 text-white focus:border-emerald-500/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="font-mono text-xs">
                {savedSuccess ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Konfigurasi berhasil disimpan dan disinkronkan ke seluruh modul.
                  </span>
                ) : lastUpdated ? (
                  <span className="text-slate-500 text-[10px]">
                    Terakhir disinkronkan: {new Date(lastUpdated).toLocaleString("id-ID")} WIB
                  </span>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-wider transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "MENYIMPAN KONFIGURASI..." : "SIMPAN KONFIGURASI"}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
