"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, HelpCircle, Bell, ChevronDown, Shield, Key, Radio, Lock, X, AlertTriangle } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export function Topbar() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/c2/alerts?limit=5`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === "success" && Array.isArray(json.data)) {
            setAlerts(json.data);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    fetchAlerts();
  }, []);

  const handleConnect = () => {
    const injected = connectors.find((c) => c.id === "injected");
    if (injected && typeof window !== "undefined" && (window as any).ethereum) {
      connect({ connector: injected });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/ledger?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const officerName = isConnected && address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Letkol Inf. Arrafi N.H.";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-emerald-500/20 bg-[#040c07]/90 px-4 lg:px-7 py-2.5 backdrop-blur-xl shadow-lg">
      {/* Mobile Brand */}
      <Link href="/" className="lg:hidden flex items-center gap-2 shrink-0">
        <Shield className="w-5 h-5 text-emerald-400" />
        <span className="font-black tracking-tight text-white text-base">
          SENTINEL<span className="text-emerald-400">-AD</span>
        </span>
      </Link>

      {/* Tactical Sub-Network Indicator */}
      <div className="hidden xl:flex items-center gap-2 font-mono text-[11px] text-slate-400">
        <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          POLYGON AMOY (80002)
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">
          NODE: <strong className="text-slate-200">PUSSIBERAD-HQ-JKT</strong>
        </span>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari SHA-256 digest, berkas, atau sektor Kodam..."
            className="w-full rounded-lg border border-emerald-500/20 bg-[#06140b] py-1.5 pl-9 pr-16 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-400/80 focus:outline-none transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-emerald-500/20 bg-[#081a0f] px-1.5 py-0.5 font-mono text-[9px] text-slate-400 hover:text-emerald-300"
          >
            Enter ↵
          </button>
        </div>
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2.5 shrink-0 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative flex w-8 h-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-[#06140b] text-slate-400 hover:text-emerald-300 hover:border-emerald-500/50 transition active:scale-[0.98]"
          title="Peringatan Taktis C2"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </button>

        {/* Notifications Popover */}
        {showNotifications && (
          <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-emerald-500/30 bg-[#06140b] p-3.5 shadow-2xl font-mono text-xs space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                PERINGATAN SIBER AKTIF
              </span>
              <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
              {alerts.length > 0 ? (
                alerts.map((al) => (
                  <div key={al.id} className="p-2 rounded-lg border border-red-500/30 bg-red-950/30 text-[10px]">
                    <span className="text-red-400 font-bold block">[{al.region_id}] {al.broadcast_type}</span>
                    <span className="text-slate-200 block mt-0.5">{al.message}</span>
                    <span className="text-slate-500 text-[9px] block mt-1">{new Date(al.broadcast_at).toLocaleTimeString("id-ID")} WIB • {al.sender}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-2 rounded-lg border border-red-500/30 bg-red-950/30 text-[10px]">
                    <span className="text-red-400 font-bold block">[KODAM JAYA] ANOMALI DEEPFAKE</span>
                    <span className="text-slate-300">Pidato rekayasa instruksi perwira tinggi terdeteksi 97.4% sintetis.</span>
                  </div>
                  <div className="p-2 rounded-lg border border-orange-500/30 bg-orange-950/30 text-[10px]">
                    <span className="text-orange-400 font-bold block">[KODAM VI/MLW] MONITORING IKN</span>
                    <span className="text-slate-300">Patroli siber mendeteksi disinformasi strategis kawasan inti IKN.</span>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/dashboard/cop"
              onClick={() => setShowNotifications(false)}
              className="block text-center text-[10px] text-emerald-400 hover:text-emerald-300 font-bold pt-1 border-t border-slate-800"
            >
              Buka Peta Situasi Taktis Lengkap →
            </Link>
          </div>
        )}

        {/* Tactical Cryptographic Officer Key Button */}
        <button
          onClick={() => (isConnected ? disconnect() : handleConnect())}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-[#06150c] py-1 pl-2 pr-2.5 hover:border-emerald-500/60 transition active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          title={isConnected ? "Putuskan Kunci Kriptografis Taktis" : "Hubungkan Kunci Kriptografis Taktis (MetaMask)"}
        >
          <span className="w-7 h-7 rounded-md bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
            {isConnected ? <Key className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
          </span>
          <span className="hidden sm:block text-left leading-tight font-mono">
            <span className="block text-[11px] font-bold text-white truncate max-w-[130px]">{officerName}</span>
            <span className="block text-[9px] text-emerald-400 font-semibold">
              {isConnected ? "KUNCI TERVERIFIKASI" : "HUBUNGKAN KUNCI"}
            </span>
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
