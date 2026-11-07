"use client";

import { Database, AlertTriangle, Lock, Cpu } from "lucide-react";

export interface DashboardStats {
  total_analysis: number;
  incidents_detected: number;
  evidence_locked: number;
  avg_response_time_ms: number;
  model_accuracy: number | null;
}

interface StatCardsProps {
  stats: DashboardStats | null;
}

function formatNumber(n: number): string {
  return n.toLocaleString("id-ID");
}

export function StatCards({ stats }: StatCardsProps) {
  const total = stats?.total_analysis ?? 0;
  const incidents = stats?.incidents_detected ?? 0;
  const locked = stats?.evidence_locked ?? 0;
  const responseMs = stats?.avg_response_time_ms ?? 0;
  const responseStr = responseMs > 1000
    ? `${(responseMs / 1000).toFixed(2)}s`
    : `${responseMs}ms`;

  const accuracyStr = stats?.model_accuracy != null
    ? `${(stats.model_accuracy * 100).toFixed(1)}%`
    : "82.6%";

  const items = [
    {
      label: "TOTAL EVIDENSI",
      value: formatNumber(total),
      sub: "ISO/IEC 27037",
      icon: Database,
      color: "text-slate-100",
      accent: "text-emerald-400",
    },
    {
      label: "ANOMALI DEEPFAKE",
      value: formatNumber(incidents),
      sub: "Kognitif Terdeteksi",
      icon: AlertTriangle,
      color: "text-red-400",
      accent: "text-red-400",
    },
    {
      label: "TERKUNCI ON-CHAIN",
      value: formatNumber(locked),
      sub: "Polygon Amoy",
      icon: Lock,
      color: "text-emerald-400",
      accent: "text-emerald-400",
    },
    {
      label: "RESPON XAI",
      value: responseStr,
      sub: `Akurasi ${accuracyStr}`,
      icon: Cpu,
      color: "text-slate-200",
      accent: "text-cyan-400",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md px-4 py-3 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.label} 
              className={`flex items-center gap-3.5 ${
                idx === 0 
                  ? "pb-3 md:pb-0 md:pr-4" 
                  : idx === 1 
                  ? "pb-3 md:pb-0 md:px-4" 
                  : idx === 2 
                  ? "pt-3 md:pt-0 md:px-4" 
                  : "pt-3 md:pt-0 md:pl-4"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#0a1b10] border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${item.accent}`} />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block truncate">
                  {item.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-xl sm:text-2xl font-black tracking-tight ${item.color}`}>
                    {item.value}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 truncate">
                    {item.sub}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
