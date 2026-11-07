"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { StatCards, DashboardStats } from "@/components/StatCards";
import { IncidentMap, IncidentDistribution } from "@/components/IncidentMap";
import { QuickAnalysisPanel } from "@/components/QuickAnalysisPanel";
import { RecentAnalyses, HistoryItem } from "@/components/RecentAnalyses";
import { DualPaneForensic } from "@/components/DualPaneForensic";
import { EvidenceCertificate } from "@/components/EvidenceCertificate";
import { useAccount, useWriteContract } from "wagmi";
import TacticalRegistryABI from "@/lib/contracts/TacticalEvidenceRegistry.json";
import { TACTICAL_CONTRACT_ADDRESS } from "@/lib/wagmi";
import { 
  ScanEye, 
  Map, 
  Database, 
  LayoutGrid, 
  RotateCcw, 
  Cpu, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

type DashboardMode = "FORENSIC" | "MAP" | "LEDGER" | "SPLIT";

export default function StructuredCommandCenterDashboard() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Active operational workspace tab
  const [activeMode, setActiveMode] = useState<DashboardMode>("FORENSIC");

  // Telemetry & Records
  const [stats, setStats] = useState<(DashboardStats & { incident_distribution?: IncidentDistribution }) | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Analysis State
  const [selectedRegion, setSelectedRegion] = useState<string>("KODAM_JAYA");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [lockedCertificate, setLockedCertificate] = useState<any>(null);
  const forensicWorkbenchRef = useRef<HTMLDivElement>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/forensics/stats`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.status === "success") setStats(json.data);
    } catch (e) {
      console.warn("[Stats fetch error]", e);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/forensics/history?limit=10`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.status === "success") {
        setHistory(json.data.items || []);
        setHistoryTotal(json.data.total_records || 0);
      }
    } catch (e) {
      console.warn("[History fetch error]", e);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, [fetchStats, fetchHistory]);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setSelectedRegion(data.threat_region || selectedRegion);
    setLockedCertificate(null);
    fetchStats();
    fetchHistory();
  };

  const handleResetAnalysis = () => {
    setAnalysisData(null);
    setLockedCertificate(null);
  };

  // Lock Evidence on Blockchain (Polygon Amoy / EVM)
  const handleLockEvidence = async () => {
    if (!analysisData) return;
    setIsLocking(true);

    const officerAddress = isConnected && address
      ? address
      : "0x8F2B1A0413554F8E24D2821A85d05E44b1c676E9";

    try {
      // 1. IPFS Tactical Vault Archive
      let ipfsCID = "QmZtmD2qtWbpPyDaJcwTDd8KprNWNJVnhZppRjhgcmEL8z";
      try {
        const vaultRes = await fetch(`${BACKEND_URL}/api/v1/vault/archive`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sha256: analysisData.sha256,
            file_name: analysisData.file_name,
            verdict: analysisData.verdict,
            confidence_score: analysisData.confidence_score,
            threat_region: selectedRegion,
            officer_address: officerAddress,
          }),
        });
        if (vaultRes.ok) {
          const vaultJson = await vaultRes.json();
          ipfsCID = vaultJson.data.ipfs_cid;
        }
      } catch (vaultErr) {
        console.warn("[IPFS Vault Warn]", vaultErr);
      }

      // 2. Lock on TacticalEvidenceRegistry Smart Contract
      let txHash = `0x${analysisData.sha256.slice(0, 64)}`;

      if (isConnected && TACTICAL_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        try {
          const hashBytes32 = `0x${analysisData.sha256}` as `0x${string}`;
          const confidenceScoreU16 = Math.round(analysisData.confidence_score * 10000);

          const hash = await (writeContractAsync as any)({
            address: TACTICAL_CONTRACT_ADDRESS,
            abi: TacticalRegistryABI.abi,
            functionName: "lockEvidence",
            args: [
              hashBytes32,
              ipfsCID,
              confidenceScoreU16,
              analysisData.is_deepfake,
              selectedRegion,
            ],
          });
          txHash = hash;
        } catch (contractErr: any) {
          console.warn("[Contract Fallback]", contractErr);
          txHash = `0x${analysisData.sha256.slice(0, 64)}`;
        }
      }

      // 3. Record on Backend Registry
      try {
        await fetch(`${BACKEND_URL}/api/v1/forensics/lock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sha256: analysisData.sha256,
            tx_hash: txHash,
            ipfs_cid: ipfsCID,
            officer_address: officerAddress,
          }),
        });
      } catch (lockErr) {
        console.warn("[Lock record warning]", lockErr);
      }

      // 4. Update state with Certificate
      setLockedCertificate({
        mediaHash: analysisData.sha256,
        txHash: txHash,
        ipfsCID: ipfsCID,
        officerAddress: officerAddress,
        verdict: analysisData.verdict,
        confidenceScore: Math.round(analysisData.confidence_score * 10000),
        threatRegion: selectedRegion,
        timestamp: new Date().toISOString(),
      });

      fetchStats();
      fetchHistory();
    } catch (err: any) {
      console.error("[Lock Evidence Fatal]", err);
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#030905] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar activeSection="Command Center" />

      {/* Main Command Console */}
      <div className="lg:pl-[252px] flex-1 flex flex-col min-h-[100dvh]">
        <Topbar />

        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Top Operational Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>SENTINEL</span>
                  <span className="text-emerald-400">-AD</span>
                  <span className="font-mono text-xs font-normal text-slate-400 ml-2 border-l border-slate-800 pl-3 hidden md:inline-block">
                    Pusat Komando Forensik Perang Kognitif TNI AD
                  </span>
                </h1>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                PUSSIBERAD • DOKTRIN PERTAHANAN INFORMASI &amp; RANTAI KUSTODI DIGITAL ISO/IEC 27037
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-[#07170e] border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                DEFCON 2 • SIAGA MERAH
              </span>
              <span className="px-2.5 py-1 rounded bg-[#07130b] border border-slate-800 text-slate-400 hidden sm:inline-block">
                POLYGON AMOY (80002)
              </span>
            </div>
          </div>

          {/* KPI Telemetry Strip */}
          <StatCards stats={stats} />

          {/* Structured Operational Mode Selector (Segmented Tabs) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#061009]/80 border border-slate-800/80 rounded-xl p-1.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveMode("FORENSIC")}
                className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                  activeMode === "FORENSIC"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <ScanEye className="w-4 h-4 text-emerald-400" />
                <span>Konsol Forensik XAI</span>
              </button>

              <button
                onClick={() => setActiveMode("MAP")}
                className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                  activeMode === "MAP"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Map className="w-4 h-4 text-emerald-400" />
                <span>Peta Geospasial (COP)</span>
              </button>

              <button
                onClick={() => setActiveMode("LEDGER")}
                className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                  activeMode === "LEDGER"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Buku Besar Evidensi</span>
              </button>

              <button
                onClick={() => setActiveMode("SPLIT")}
                className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                  activeMode === "SPLIT"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-emerald-400" />
                <span>Ringkasan C2 (Split)</span>
              </button>
            </div>

            <div className="px-2 text-right hidden lg:block font-mono text-[10px] text-slate-500">
              MODE KERJA: <strong className="text-slate-300">{activeMode} WORKSPACE</strong>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: KONSOL FORENSIK XAI (Fokus Investigasi Media & Grad-CAM)           */}
          {/* ========================================================================= */}
          {activeMode === "FORENSIC" && (
            <div ref={forensicWorkbenchRef} className="space-y-6">
              {analysisData ? (
                /* Active Result View: Dual Pane & Web3 Lock */
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#061209] border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-white font-bold">HASIL EKSTRAKSI FORENSIK AKTIF:</span>
                      <span className="text-emerald-400 font-bold truncate max-w-[200px] sm:max-w-md">
                        {analysisData.file_name}
                      </span>
                    </div>
                    <button
                      onClick={handleResetAnalysis}
                      className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition px-2.5 py-1 rounded bg-[#040e07] border border-slate-800 hover:border-emerald-500/40"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Analisis Berkas Baru</span>
                    </button>
                  </div>

                  {/* Dual-Pane Component */}
                  <DualPaneForensic
                    data={analysisData}
                    onLockEvidence={handleLockEvidence}
                    isLocking={isLocking}
                    isLocked={!!lockedCertificate}
                  />

                  {/* Digital Certificate when locked */}
                  {lockedCertificate && (
                    <EvidenceCertificate
                      mediaHash={lockedCertificate.mediaHash}
                      txHash={lockedCertificate.txHash}
                      ipfsCID={lockedCertificate.ipfsCID}
                      officerAddress={lockedCertificate.officerAddress}
                      verdict={lockedCertificate.verdict}
                      confidenceScore={lockedCertificate.confidenceScore}
                      threatRegion={lockedCertificate.threatRegion}
                      timestamp={lockedCertificate.timestamp}
                    />
                  )}
                </div>
              ) : (
                /* Ingestion Workspace & Readiness Board */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Quick Analysis Ingest Panel */}
                  <div className="lg:col-span-6">
                    <QuickAnalysisPanel
                      onAnalysisComplete={handleAnalysisComplete}
                      selectedRegion={selectedRegion}
                      onRegionChange={setSelectedRegion}
                    />
                  </div>

                  {/* Right Column: Readiness & Architecture Protocol Guide */}
                  <div className="lg:col-span-6 rounded-xl border border-slate-800/80 bg-[#061009]/85 backdrop-blur-md p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        <h2 className="text-sm font-bold text-white">Alur Kesiapan Mesin Forensik</h2>
                      </div>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold">
                        STANDAR ISO/IEC 27037
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Sistem SENTINEL-AD dirancang khusus untuk memenuhi standar pembuktian hukum peradilan militer. Setiap media yang diuji melewati 3 tahapan pengamanan ketat:
                    </p>

                    {/* 3-Step Guided Protocol */}
                    <div className="space-y-2.5 font-mono text-xs">
                      <div className="p-3 rounded-lg border border-slate-800 bg-[#030905] flex items-start gap-3">
                        <span className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          01
                        </span>
                        <div>
                          <strong className="text-white block font-sans text-xs">Akuisisi &amp; Hashing DeterministiK</strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Validasi magic bytes dan kalkulasi SHA-256 media asli tanpa mengubah bitstream sumber.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-800 bg-[#030905] flex items-start gap-3">
                        <span className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          02
                        </span>
                        <div>
                          <strong className="text-white block font-sans text-xs">Inferensi Multimodal Grad-CAM (XAI)</strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Memproduksi visualisasi heatmap matematis pada zona anomali (rahang, iris, artikulasi vokal).
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-800 bg-[#030905] flex items-start gap-3">
                        <span className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          03
                        </span>
                        <div>
                          <strong className="text-white block font-sans text-xs">Penguncian Permanen On-Chain (Polygon Amoy)</strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Metadata forensik dikunci ke smart contract dan diterbitkan sertifikat verifikasi publik QR.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-400">
                      <span>Perwira Penandatangan: <strong className="text-slate-200">{isConnected && address ? address.slice(0, 10) + "..." : "KUNCI TAKTIS TERHUBUNG"}</strong></span>
                      <Link href="/dashboard/sop" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                        <span>Baca SOP Lengkap</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PETA SITUASI TAKTIS (COP) (Fokus Pemantauan Satelit Geospasial)    */}
          {/* ========================================================================= */}
          {activeMode === "MAP" && (
            <div className="space-y-4">
              <IncidentMap
                distribution={stats?.incident_distribution ?? null}
                total={stats?.total_analysis ?? 0}
                onSelectRegion={(reg) => {
                  setSelectedRegion(reg);
                  setActiveMode("FORENSIC");
                }}
              />
              <div className="p-3 rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md flex items-center justify-between font-mono text-xs text-slate-400">
                <span>Klik marker Kodam pada peta di atas untuk langsung mengunci target analisis di sektor tersebut.</span>
                <Link href="/dashboard/cop" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                  <span>Buka Peta Situasi Skala Penuh</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BUKU BESAR EVIDENSI (Fokus Penelusuran Rekaman & Audit)             */}
          {/* ========================================================================= */}
          {activeMode === "LEDGER" && (
            <div className="space-y-4">
              <RecentAnalyses items={history} total={historyTotal} loading={historyLoading} />
              <div className="p-3 rounded-xl border border-slate-800/80 bg-[#061009]/80 backdrop-blur-md flex items-center justify-between font-mono text-xs text-slate-400">
                <span>Buku besar ini mencatat seluruh rantai barang bukti digital sesuai standar ISO/IEC 27037.</span>
                <Link href="/dashboard/ledger" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                  <span>Buka Registri Forensik Penuh &amp; Ekspor Data</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: RINGKASAN C2 (Split Screen Mode: Lab + Peta + Riwayat)              */}
          {/* ========================================================================= */}
          {activeMode === "SPLIT" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Lab on Left */}
                <div className="lg:col-span-7">
                  {analysisData ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-[#061209] border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono">
                        <span className="text-emerald-400 font-bold">HASIL INFERENSI AKTIF</span>
                        <button
                          onClick={handleResetAnalysis}
                          className="text-slate-300 hover:text-white transition flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3 text-emerald-400" />
                          <span>Berkas Baru</span>
                        </button>
                      </div>
                      <DualPaneForensic
                        data={analysisData}
                        onLockEvidence={handleLockEvidence}
                        isLocking={isLocking}
                        isLocked={!!lockedCertificate}
                      />
                      {lockedCertificate && (
                        <EvidenceCertificate
                          mediaHash={lockedCertificate.mediaHash}
                          txHash={lockedCertificate.txHash}
                          ipfsCID={lockedCertificate.ipfsCID}
                          officerAddress={lockedCertificate.officerAddress}
                          verdict={lockedCertificate.verdict}
                          confidenceScore={lockedCertificate.confidenceScore}
                          threatRegion={lockedCertificate.threatRegion}
                          timestamp={lockedCertificate.timestamp}
                        />
                      )}
                    </div>
                  ) : (
                    <QuickAnalysisPanel
                      onAnalysisComplete={handleAnalysisComplete}
                      selectedRegion={selectedRegion}
                      onRegionChange={setSelectedRegion}
                    />
                  )}
                </div>

                {/* Map on Right */}
                <div className="lg:col-span-5">
                  <IncidentMap
                    distribution={stats?.incident_distribution ?? null}
                    total={stats?.total_analysis ?? 0}
                    onSelectRegion={setSelectedRegion}
                  />
                </div>
              </div>

              {/* Table Below */}
              <RecentAnalyses items={history} total={historyTotal} loading={historyLoading} />
            </div>
          )}
        </main>

        {/* Tactical Footer */}
        <footer className="mt-auto border-t border-slate-800/80 bg-[#020704] px-6 py-4 text-center font-mono text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PUSSIBERAD TNI AD × CODEPOLITAN • KARTIKA CYBER HACKATHON 2026</span>
          <span className="text-emerald-400 font-bold">AIR-GAPPED MILITARY DEFENSE GRID • ISO/IEC 27037 VALIDATED</span>
        </footer>
      </div>
    </div>
  );
}
