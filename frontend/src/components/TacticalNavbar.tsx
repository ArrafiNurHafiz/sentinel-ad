"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Shield, Key, AlertTriangle, ExternalLink, Cpu } from "lucide-react";
import Link from "next/link";

interface TacticalNavbarProps {
  threatLevel?: "NORMAL" | "ELEVATED" | "CRITICAL";
}

export function TacticalNavbar({ threatLevel = "ELEVATED" }: TacticalNavbarProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [timeStr, setTimeStr] = useState<string>("");
  const [isAirGappedKey, setIsAirGappedKey] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected");
    if (injectedConnector && typeof window !== "undefined" && (window as any).ethereum) {
      connect({ connector: injectedConnector });
    } else {
      // In air-gapped intranet or when web3 wallet extension is not installed,
      // load default registered officer authorization key (Letkol Inf. Arrafi N.H.)
      setIsAirGappedKey(true);
    }
  };

  const activeAddress = isConnected
    ? address
    : isAirGappedKey
    ? "0x8F2B1A0413554F8E24D2821A85d05E44b1c676E9"
    : null;

  return (
    <header className="border-b border-slate-800 bg-[#090E17]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-widest text-lg text-emerald-400">
                SENTINEL-AD
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                MIL-STD v3.0
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide">
              PUSSIBERAD TNI AD • Cognitive Warfare Defense Command
            </p>
          </div>
        </div>

        {/* Tactical Status Indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI CORE: ONLINE</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-semibold ${
              threatLevel === "CRITICAL"
                ? "bg-red-950/60 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : "bg-amber-950/40 border-amber-500/40 text-amber-400"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>STATUS: {threatLevel === "CRITICAL" ? "DEFCON 2 // HIGH ALERT" : "DEFCON 3 // MONITORING"}</span>
          </div>

          <div className="hidden sm:block text-slate-400 border-l border-slate-800 pl-4">
            {timeStr}
          </div>
        </div>

        {/* Action Controls & Web3 Tactical Key */}
        <div className="flex items-center gap-3">
          <Link
            href="/verify"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition"
          >
            <span>Verifikasi Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {activeAddress ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="hidden sm:inline">KAPTEN SIBER //</span>
                <span>
                  {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
                </span>
              </div>
              <button
                onClick={() => {
                  disconnect();
                  setIsAirGappedKey(false);
                }}
                className="text-xs text-slate-500 hover:text-red-400 p-1.5 transition"
                title="Lepas Kunci Perwira"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
            >
              <Key className="w-3.5 h-3.5" />
              <span>HUBUNGKAN KUNCI OTORISASI</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
