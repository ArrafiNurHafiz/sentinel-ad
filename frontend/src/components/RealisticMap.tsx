"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { 
  Layers, 
  Crosshair, 
  Radio, 
  Compass, 
  Eye, 
  MapPin, 
  Zap, 
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

export interface KodamGisMarker {
  id: string;
  name: string;
  regionCode: string;
  lat: number;
  lng: number;
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  details: string;
  incidentsCount: number;
}

export const KODAM_GIS_DATA: KodamGisMarker[] = [
  { id: "M1", name: "KODAM I / BUKIT BARISAN", regionCode: "KODAM_I_BB", lat: 3.5952, lng: 98.6722, level: "CRITICAL", details: "Medan & Sumut • Disinformasi Instruksi Pasukan", incidentsCount: 4 },
  { id: "M2", name: "KODAM II / SRIWIJAYA", regionCode: "KODAM_II_SWJ", lat: -2.9761, lng: 104.7754, level: "HIGH", details: "Palembang • Deteksi Kloning Suara Pejabat", incidentsCount: 2 },
  { id: "M3", name: "KODAM JAYA (C2 HUB)", regionCode: "KODAM_JAYA", lat: -6.2088, lng: 106.8456, level: "CRITICAL", details: "Jakarta C2 HQ • Deepfake Pidato Komando Tinggi", incidentsCount: 8 },
  { id: "M4", name: "KODAM III / SILIWANGI", regionCode: "KODAM_III_SLW", lat: -6.9175, lng: 107.6191, level: "HIGH", details: "Bandung • Rekayasa Dokumen Pergerakan", incidentsCount: 3 },
  { id: "M5", name: "KODAM IV / DIPONEGORO", regionCode: "KODAM_IV_DIP", lat: -6.9667, lng: 110.4167, level: "MEDIUM", details: "Semarang • Disinformasi Akun Medsos", incidentsCount: 1 },
  { id: "M6", name: "KODAM V / BRAWIJAYA", regionCode: "KODAM_V_BRW", lat: -7.2575, lng: 112.7521, level: "MEDIUM", details: "Surabaya • Manipulasi Informasi Maritim", incidentsCount: 2 },
  { id: "M7", name: "KODAM VI / MULAWARMAN", regionCode: "KODAM_VI_MLW", lat: -1.2654, lng: 116.8312, level: "CRITICAL", details: "Balikpapan & IKN • Anomali Siber Obvitnas IKN", incidentsCount: 5 },
  { id: "M8", name: "KODAM XIV / HASANUDDIN", regionCode: "KODAM_XIV_HSN", lat: -5.1477, lng: 119.4327, level: "HIGH", details: "Makassar • Audio Sintetik Instruksi Wilayah", incidentsCount: 3 },
  { id: "M9", name: "KODAM XIII / MERDEKA", regionCode: "KODAM_XIII_MDK", lat: 1.4748, lng: 124.8421, level: "MEDIUM", details: "Manado • Monitoring Perbatasan Utara", incidentsCount: 1 },
  { id: "M10", name: "KODAM IX / UDAYANA", regionCode: "KODAM_IX_UDY", lat: -8.6705, lng: 115.2126, level: "LOW", details: "Denpasar • Sektor Terpantau Kondusif", incidentsCount: 0 },
  { id: "M11", name: "KODAM XVI / PATTIMURA", regionCode: "KODAM_XVI_PTM", lat: -3.6547, lng: 128.1906, level: "HIGH", details: "Ambon • Isu Disinformasi Teritorial", incidentsCount: 2 },
  { id: "M12", name: "KODAM XVII / CENDERAWASIH", regionCode: "KODAM_XVII_CEN", lat: -2.5916, lng: 140.6690, level: "CRITICAL", details: "Jayapura • Video Hoaks Pergerakan Pasukan", incidentsCount: 6 },
];

const LEVEL_COLORS = {
  CRITICAL: { bg: "#ef4444", text: "#fca5a5", border: "#b91c1c" },
  HIGH: { bg: "#f97316", text: "#fdba74", border: "#c2410c" },
  MEDIUM: { bg: "#eab308", text: "#fde047", border: "#a16207" },
  LOW: { bg: "#10b981", text: "#6ee7b7", border: "#047857" },
};

interface RealisticMapProps {
  onSelectRegion?: (regionCode: string) => void;
  selectedRegionCode?: string;
  sectors?: any[];
}

export default function RealisticMap({ onSelectRegion, selectedRegionCode, sectors }: RealisticMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const gisData: KodamGisMarker[] = (sectors && sectors.length > 0)
    ? sectors.map((s: any, idx: number) => ({
        id: s.id || `M${idx + 1}`,
        name: s.name,
        regionCode: s.id,
        lat: typeof s.lat === "number" ? s.lat : (KODAM_GIS_DATA[idx]?.lat || -2.5),
        lng: typeof s.lng === "number" ? s.lng : (KODAM_GIS_DATA[idx]?.lng || 118.0),
        level: s.level || "LOW",
        details: s.lastAnomaly || s.region || "",
        incidentsCount: s.activeIncidents ?? 0,
      }))
    : KODAM_GIS_DATA;

  const [mapMode, setMapMode] = useState<"SATELLITE" | "DARK">("SATELLITE");
  const [activeMarker, setActiveMarker] = useState<KodamGisMarker>(gisData[2] || gisData[0]); // Kodam Jaya or first
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number }>({ lat: -2.5, lng: 118.0 });
  const [showVectors, setShowVectors] = useState<boolean>(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent re-initialization

    // Create map centered over Indonesia
    const map = L.map(mapContainerRef.current, {
      center: [-2.2, 118.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Add custom zoom control at top-left
    L.control.zoom({ position: "topleft" }).addTo(map);

    // Initial Base Tile Layer (Esri World Imagery)
    const initialTileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    const tileLayer = L.tileLayer(initialTileUrl, {
      maxZoom: 18,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Mouse coordinates tracker
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      setMouseCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4)),
      });
    });

    // Threat Vectors (Lines connecting affected Kodams to C2 Jakarta Hub)
    const jakartaCoords: [number, number] = [-6.2088, 106.8456];
    const threatKodams = gisData.filter((k) => k.level === "CRITICAL" && k.regionCode !== "KODAM_JAYA");

    threatKodams.forEach((tk) => {
      // Draw curved trajectory via midpoint offset
      const midLat = (jakartaCoords[0] + tk.lat) / 2 + 1.2;
      const midLng = (jakartaCoords[1] + tk.lng) / 2;
      
      const curvePoints: [number, number][] = [
        jakartaCoords,
        [midLat, midLng],
        [tk.lat, tk.lng]
      ];

      L.polyline(curvePoints, {
        color: "#ef4444",
        weight: 2,
        opacity: 0.75,
        dashArray: "6, 8",
        lineCap: "round",
      }).addTo(map);
    });

    // Perimeter defense radar circle around Jakarta C2 Hub
    L.circle(jakartaCoords, {
      radius: 120000, // 120 km
      color: "#10b981",
      fillColor: "#10b981",
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: "4, 4",
    }).addTo(map);

    // Perimeter circle around IKN (Kodam VI Mulawarman)
    L.circle([-1.2654, 116.8312], {
      radius: 90000,
      color: "#ef4444",
      fillColor: "#ef4444",
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: "4, 4",
    }).addTo(map);

    // Render Markers
    gisData.forEach((k) => {
      const cfg = LEVEL_COLORS[k.level];
      const isCritical = k.level === "CRITICAL";

      // Tactical Marker DivIcon
      const iconHtml = `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${isCritical ? `<div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${cfg.bg}; opacity: 0.35;" class="tactical-marker-ring"></div>` : ""}
          <div style="position: absolute; width: 18px; height: 18px; border-radius: 50%; border: 2px solid ${cfg.bg}; background-color: rgba(3, 9, 5, 0.85); box-shadow: 0 0 10px ${cfg.bg};"></div>
          <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${cfg.bg}; z-index: 2;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-tactical-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([k.lat, k.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px;">
          <div style="color: #10b981; font-weight: bold; margin-bottom: 2px;">PUSSIBERAD C2 GRID</div>
          <div style="font-size: 12px; font-weight: bold; color: #fff;">${k.name}</div>
          <div style="color: #94a3b8; font-size: 10px; margin-bottom: 6px;">LAT: ${k.lat.toFixed(2)} | LNG: ${k.lng.toFixed(2)}</div>
          <div style="background-color: rgba(0,0,0,0.4); padding: 4px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 4px;">
            <div style="color: ${cfg.bg}; font-weight: bold;">STATUS: ${k.level}</div>
            <div style="color: #cbd5e1; font-size: 10px;">${k.details}</div>
          </div>
          <div style="font-size: 9px; color: #10b981;">Insiden Terdaftar: <strong>${k.incidentsCount} kasus</strong></div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        setActiveMarker(k);
        if (onSelectRegion) onSelectRegion(k.regionCode);
      });

      markersRef.current[k.regionCode] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onSelectRegion]);

  // Switch Tile Layer (Satellite vs Dark Matter)
  const switchMapMode = (mode: "SATELLITE" | "DARK") => {
    if (!mapInstanceRef.current) return;
    setMapMode(mode);

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = mode === "SATELLITE"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    const newLayer = L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  };

  // Fly to selected Kodam
  const flyToMarker = (k: KodamGisMarker) => {
    if (!mapInstanceRef.current) return;
    setActiveMarker(k);
    mapInstanceRef.current.flyTo([k.lat, k.lng], 7, { duration: 1.2 });
    const m = markersRef.current[k.regionCode];
    if (m) m.openPopup();
    if (onSelectRegion) onSelectRegion(k.regionCode);
  };

  // Reset to full Archipelago view
  const resetArchipelagoView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([-2.2, 118.0], 5, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-800 bg-[#020704]">
      {/* Real GIS Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-12 z-20 flex items-center gap-1.5 bg-[#040e08]/90 border border-emerald-500/30 p-1 rounded-lg backdrop-blur shadow-lg font-mono text-[10px]">
        <button
          onClick={() => switchMapMode("SATELLITE")}
          className={`px-2 py-1 rounded transition flex items-center gap-1 ${
            mapMode === "SATELLITE" 
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>Satelit Realistis</span>
        </button>

        <button
          onClick={() => switchMapMode("DARK")}
          className={`px-2 py-1 rounded transition flex items-center gap-1 ${
            mapMode === "DARK" 
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>C2 Dark Matter</span>
        </button>

        <button
          onClick={resetArchipelagoView}
          className="px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          title="Reset Sudut Pandang Nusantara"
        >
          Nusantara 100%
        </button>
      </div>

      {/* Top-Right HUD Coordinates Tracker */}
      <div className="absolute top-3 right-3 z-20 font-mono text-[9px] text-emerald-400 bg-[#040e08]/90 border border-emerald-500/30 px-2.5 py-1 rounded backdrop-blur shadow-lg flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>LAT: {mouseCoords.lat > 0 ? `+${mouseCoords.lat}` : mouseCoords.lat}°</span>
        <span>LON: {mouseCoords.lng}°</span>
        <span className="text-slate-500 hidden sm:inline">| WGS-84 GIS</span>
      </div>

      {/* Bottom Floating Active Kodam HUD Card */}
      {activeMarker && (
        <div className="absolute left-3 bottom-3 right-3 sm:right-auto sm:max-w-md z-20 rounded-xl border border-emerald-500/30 bg-[#040e08]/95 p-3 backdrop-blur shadow-2xl font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <div className="flex items-center gap-2 truncate">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: LEVEL_COLORS[activeMarker.level].bg }} 
              />
              <span className="font-bold text-white truncate text-[12px]">{activeMarker.name}</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold shrink-0 ${
              activeMarker.level === "CRITICAL" ? "bg-red-950/80 text-red-400 border-red-500/50" : "bg-emerald-950/80 text-emerald-400 border-emerald-500/50"
            }`}>
              {activeMarker.level}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed truncate">
            {activeMarker.details}
          </p>

          <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">
              Koordinat: <strong className="text-slate-200">{activeMarker.lat.toFixed(2)}, {activeMarker.lng.toFixed(2)}</strong>
            </span>
            <button
              onClick={() => flyToMarker(activeMarker)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              Fokus Sektor →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
