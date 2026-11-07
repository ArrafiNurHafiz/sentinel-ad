"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { IncidentMap } from "@/components/IncidentMap";
import { 
  Compass, 
  Radio, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Send,
  CheckCircle2,
  Activity,
  Zap,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface SectorDetail {
  id: string;
  name: string;
  code: string;
  region: string;
  lat?: number;
  lng?: number;
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  activeIncidents: number;
  deepfakeCount?: number;
  lastAnomaly: string;
  commandStatus: string;
  countermeasures: string;
}

const SECTORS: SectorDetail[] = [
  {
    id: "KODAM_JAYA",
    name: "KODAM JAYA / JAYAKARTA",
    code: "JAYAKARTA-C2",
    region: "DKI Jakarta & Sekitarnya",
    level: "CRITICAL",
    activeIncidents: 8,
    lastAnomaly: "Deepfake Pidato Instruksi Perwira Tinggi TNI",
    commandStatus: "SIAGA MERAH • C2 DEFENSE GRID AKTIF",
    countermeasures: "Sertifikat Digital ISO 27037 Diterbitkan & Sindikasi Media",
  },
  {
    id: "KODAM_VI_MLW",
    name: "KODAM VI / MULAWARMAN",
    code: "MULAWARMAN-IKN",
    region: "Kalimantan Timur (Kawasan Inti IKN)",
    level: "CRITICAL",
    activeIncidents: 5,
    lastAnomaly: "Manipulasi Dokumen Strategis Pemindahan Pasukan IKN",
    commandStatus: "SIAGA MERAH • MONITORING OBVITNAS IKN",
    countermeasures: "Penetralan Narasi Hoaks via Rantai Bukti Polygon Amoy",
  },
  {
    id: "KODAM_XVII_CEN",
    name: "KODAM XVII / CENDERAWASIH",
    code: "CENDERAWASIH-PAPUA",
    region: "Papua & Perbatasan Timur",
    level: "CRITICAL",
    activeIncidents: 6,
    lastAnomaly: "Rekayasa Citra Gerakan Separatis Berbasis Model Difusi",
    commandStatus: "SIAGA MERAH • SATGASSIBER KARTIKA STANDBY",
    countermeasures: "Analisis Grad-CAM Membuktikan Inkonsistensi Batas Wajah",
  },
  {
    id: "KODAM_I_BB",
    name: "KODAM I / BUKIT BARISAN",
    code: "BUKITBARISAN-SUMUT",
    region: "Sumatera Utara & Riau",
    level: "CRITICAL",
    activeIncidents: 4,
    lastAnomaly: "Penyebaran Audio Kloning Instruksi Wilayah",
    commandStatus: "SIAGA TINGGI • PATROLI SIBER AKTIF",
    countermeasures: "Deteksi Frekuensi Spektrum Audio Sintetik Terbukti",
  },
  {
    id: "KODAM_XIV_HSN",
    name: "KODAM XIV / HASANUDDIN",
    code: "HASANUDDIN-SULSEL",
    region: "Sulawesi Selatan & Barat",
    level: "HIGH",
    activeIncidents: 3,
    lastAnomaly: "Kloning Suara Komandan Satuan Teritorial",
    commandStatus: "SIAGA KUNING • VALIDASI KRIPTOGRAFIS",
    countermeasures: "Verifikasi Melalui Kunci Privat EIP-712 Perwira",
  },
  {
    id: "KODAM_III_SLW",
    name: "KODAM III / SILIWANGI",
    code: "SILIWANGI-JABAR",
    region: "Jawa Barat & Banten",
    level: "HIGH",
    activeIncidents: 3,
    lastAnomaly: "Rekayasa Visual Operasi Teritorial",
    commandStatus: "SIAGA KUNING • PENGAWASAN AKTIF",
    countermeasures: "Klarifikasi Terindeks di Buku Besar Registri",
  },
  {
    id: "KODAM_II_SWJ",
    name: "KODAM II / SRIWIJAYA",
    code: "SRIWIJAYA-SUMSEL",
    region: "Sumatera Selatan & Lampung",
    level: "HIGH",
    activeIncidents: 2,
    lastAnomaly: "Bot Disinformasi Menyerang Akun Resmi Kodam",
    commandStatus: "SIAGA KUNING • FILTERING BOT",
    countermeasures: "Pelacakan Sumber Injeksi Konten Sintetik",
  },
  {
    id: "KODAM_XVI_PTM",
    name: "KODAM XVI / PATTIMURA",
    code: "PATTIMURA-MALUKU",
    region: "Maluku & Maluku Utara",
    level: "HIGH",
    activeIncidents: 2,
    lastAnomaly: "Video Provokasi Kerukunan Warga via Deepfake",
    commandStatus: "SIAGA KUNING • SINERGI KODIM",
    countermeasures: "Rilis Bukti Digital ke Kominfo Daerah",
  },
  {
    id: "KODAM_V_BRW",
    name: "KODAM V / BRAWIJAYA",
    code: "BRAWIJAYA-JATIM",
    region: "Jawa Timur",
    level: "MEDIUM",
    activeIncidents: 2,
    lastAnomaly: "Manipulasi Berita Latihan Gabungan Maritim",
    commandStatus: "KONDUSIF TERKENDALI",
    countermeasures: "Verifikasi Otomatis Terkunci",
  },
  {
    id: "KODAM_IV_DIP",
    name: "KODAM IV / DIPONEGORO",
    code: "DIPONEGORO-JATENG",
    region: "Jawa Tengah & DIY",
    level: "MEDIUM",
    activeIncidents: 1,
    lastAnomaly: "Isu Rekayasa Mutasi Perwira di Media Sosial",
    commandStatus: "KONDUSIF TERKENDALI",
    countermeasures: "Publikasi QR Verifier Resmi",
  },
  {
    id: "KODAM_XIII_MDK",
    name: "KODAM XIII / MERDEKA",
    code: "MERDEKA-SULUT",
    region: "Sulawesi Utara & Gorontalo",
    level: "MEDIUM",
    activeIncidents: 1,
    lastAnomaly: "Disinformasi Keamanan Perbatasan Maritim",
    commandStatus: "KONDUSIF TERKENDALI",
    countermeasures: "Pemantauan Sensor Sinyal Radionav",
  },
  {
    id: "KODAM_IX_UDY",
    name: "KODAM IX / UDAYANA",
    code: "UDAYANA-BALI",
    region: "Bali & Nusa Tenggara",
    level: "LOW",
    activeIncidents: 0,
    lastAnomaly: "Nihil Anomali Signifikan Terdeteksi",
    commandStatus: "SIAGA NORMAL HIJAU",
    countermeasures: "Pemantauan Rutin Berkelanjutan",
  },
];

export default function SituationalAwarenessCOPPage() {
  const [sectors, setSectors] = useState<SectorDetail[]>(SECTORS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSector, setSelectedSector] = useState<SectorDetail>(SECTORS[0]);
  const [activeTab, setActiveTab] = useState<"MAP" | "SECTORS" | "ALERTS">("MAP");

  const fetchSectors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/c2/sectors`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && Array.isArray(json.data)) {
          setSectors(json.data);
          setSelectedSector((prev) => json.data.find((s: SectorDetail) => s.id === prev.id) || json.data[0]);
        }
      }
    } catch (e) {
      console.error("[Sectors fetch error]", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const totalIncidents = useMemo(() => sectors.reduce((acc, s) => acc + (s.activeIncidents || 0), 0), [sectors]);
  const criticalCount = useMemo(() => sectors.filter((s) => s.level === "CRITICAL").length, [sectors]);
  const distribution = useMemo(() => ({
    CRITICAL: sectors.filter(s => s.level === "CRITICAL").reduce((a, s) => a + (s.activeIncidents || 0), 0),
    HIGH: sectors.filter(s => s.level === "HIGH").reduce((a, s) => a + (s.activeIncidents || 0), 0),
    MEDIUM: sectors.filter(s => s.level === "MEDIUM").reduce((a, s) => a + (s.activeIncidents || 0), 0),
    LOW: sectors.filter(s => s.level === "LOW").reduce((a, s) => a + (s.activeIncidents || 0), 0),
  }), [sectors]);

  return (
    <div className="min-h-[100dvh] bg-[#030905] text-slate-100 flex">
      <Sidebar activeSection="Peta Situasi Taktis (COP)" />

      <div className="lg:pl-[252px] flex-1 flex flex-col min-h-[100dvh]">
        <Topbar />

        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Compass className="w-4 h-4 text-emerald-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Common Operational Picture (COP)
                </h1>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                SITUASI TAKTIS GEOSPASIAL PERANG KOGNITIF LINTAS KOMANDO DAERAH MILITER (KODAM)
              </p>
            </div>

            {/* Quick stats strip */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <button
                onClick={fetchSectors}
                disabled={loading}
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-[#06140b] text-slate-400 hover:text-emerald-300 hover:border-emerald-500/30 transition flex items-center gap-1.5"
                title="Refresh data sektor"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
                <span className="hidden sm:inline">Sync C2</span>
              </button>

              <div className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/30 text-red-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>{criticalCount} SEKTOR KRITIS</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{sectors.length} KODAM TERKONEKSI</span>
              </div>
            </div>
          </div>

          {/* Top Section: COP Map (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Map Component */}
            <div className="lg:col-span-8">
              <IncidentMap
                distribution={distribution}
                total={totalIncidents}
                sectors={sectors}
                onSelectRegion={(reg) => {
                  const found = sectors.find((s) => s.id === reg);
                  if (found) setSelectedSector(found);
                }}
              />
            </div>

            {/* Right: Selected Kodam Command Briefing */}
            <div className="lg:col-span-4 rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 flex flex-col justify-between shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    BRIEFING TAKTIS SEKTOR
                  </span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                    selectedSector.level === "CRITICAL"
                      ? "bg-red-950/80 text-red-400 border-red-500/50"
                      : "bg-orange-950/80 text-orange-400 border-orange-500/50"
                  }`}>
                    {selectedSector.level}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-sans font-black text-base text-white">
                    {selectedSector.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-400 block mt-0.5">
                    {selectedSector.region} • {selectedSector.code}
                  </span>
                </div>

                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg border border-slate-800 bg-[#030905]">
                    <span className="text-[10px] text-slate-500 block">STATUS KOMANDO:</span>
                    <span className="font-bold text-emerald-300 block mt-0.5">
                      {selectedSector.commandStatus}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800 bg-[#030905]">
                    <span className="text-[10px] text-slate-500 block">ANOMALI TERBARU:</span>
                    <span className="text-slate-200 block mt-0.5 font-sans font-medium text-xs">
                      {selectedSector.lastAnomaly}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800 bg-[#030905]">
                    <span className="text-[10px] text-slate-500 block">LANGKAH PENANGGULANGAN (COUNTERMEASURES):</span>
                    <span className="text-slate-300 block mt-0.5 font-sans text-xs">
                      {selectedSector.countermeasures}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <Link
                  href="/dashboard"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Jalankan Analisis di Sektor Ini</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section: Full 12-Sector Tactical Roster Table */}
          <div className="rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">
                  Matriks Kesiapsiagaan Siber 12 Kodam
                </h2>
                <p className="font-mono text-[10px] text-slate-400">
                  MONITORING WAKTU NYATA PERTAHANAN KOGNITIF &amp; VEKTOR DISINFORMASI
                </p>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">
                SATGASSIBER KARTIKA C2 SYNC: 100%
              </span>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#030905] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                    <th className="py-2.5 px-3 font-bold">Satuan Kodam</th>
                    <th className="py-2.5 px-3 font-bold">Cakupan Wilayah</th>
                    <th className="py-2.5 px-3 font-bold">Tingkat Ancaman</th>
                    <th className="py-2.5 px-3 font-bold">Insiden Terdeteksi</th>
                    <th className="py-2.5 px-3 font-bold">Status Operasi</th>
                    <th className="py-2.5 px-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sectors.map((s) => (
                    <tr 
                      key={s.id} 
                      className={`hover:bg-slate-900/40 transition cursor-pointer ${selectedSector.id === s.id ? "bg-emerald-950/20" : ""}`}
                      onClick={() => setSelectedSector(s)}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap font-sans font-bold text-white text-[12px]">
                        {s.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {s.region}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.level === "CRITICAL"
                            ? "bg-red-950/60 border border-red-500/40 text-red-400"
                            : s.level === "HIGH"
                            ? "bg-orange-950/60 border border-orange-500/40 text-orange-400"
                            : "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400"
                        }`}>
                          {s.level}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-white">
                        {s.activeIncidents} kasus
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-emerald-300 text-[11px]">
                        {s.commandStatus}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSector(s);
                          }}
                          className="px-2.5 py-1 rounded border border-slate-800 bg-[#040e07] hover:border-emerald-500/50 text-[10px] text-slate-300 hover:text-emerald-300 transition"
                        >
                          Pilih Sektor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
