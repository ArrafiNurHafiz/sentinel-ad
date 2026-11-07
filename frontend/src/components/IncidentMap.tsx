"use client";

import dynamic from "next/dynamic";
import { Compass, RefreshCw } from "lucide-react";

export interface IncidentDistribution {
  CRITICAL: number;
  HIGH: number;
  MEDIUM: number;
  LOW: number;
}

interface IncidentMapProps {
  distribution: IncidentDistribution | null;
  total: number;
  onSelectRegion?: (regionId: string) => void;
  sectors?: any[];
}

// Dynamically load realistic GIS Leaflet map with SSR disabled
const RealisticMap = dynamic(() => import("./RealisticMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[420px] rounded-xl border border-slate-800 bg-[#020704] flex flex-col items-center justify-center font-mono text-xs text-slate-400 gap-2">
      <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
      <span>Memuat Citra Geospasial Satelit Militer...</span>
      <span className="text-[10px] text-slate-600">Esri World Imagery • WGS-84 GIS</span>
    </div>
  ),
});

export function IncidentMap({ distribution, total, onSelectRegion, sectors }: IncidentMapProps) {
  const criticalCount = distribution?.CRITICAL ?? 8;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 flex flex-col justify-between h-full shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white leading-tight">Peta Situasi Taktis (COP)</h2>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold">
                GIS REALISTIS
              </span>
            </div>
            <p className="font-mono text-[10px] text-slate-400">
              Citra Satelit Geospasial &amp; Vektor Disinformasi Kognitif 12 Kodam
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {criticalCount} Sektor Kritis
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {total || 19} Total Kasus
          </span>
        </div>
      </div>

      {/* Realistic GIS Leaflet Map Engine */}
      <RealisticMap onSelectRegion={onSelectRegion} sectors={sectors} />
    </div>
  );
}
