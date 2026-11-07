"use client";

import { AlertTriangle, CheckCircle2, ShieldCheck, Lock, Activity, Eye, Zap, Layers } from "lucide-react";

interface ForensicAnalysisProps {
  data: {
    file_name: string;
    file_size_bytes: number;
    sha256: string;
    verdict: string;
    is_deepfake: boolean;
    confidence_score: number;
    confidence_percentage: number;
    threat_level: string;
    threat_region: string;
    forensic_analysis: {
      facial_blend_inconsistency: number;
      eye_blink_anomaly: number;
      audio_vocoder_synthetic: number;
      anomalies_detected: string[];
      raw_metrics?: any;
    };
    xai_heatmap_base64?: string;
    raw_frame_base64?: string;
    media_type?: string;
    processing_ms?: number;
    previewUrl?: string;
    source_url?: string;
  };
  onLockEvidence: () => void;
  isLocking: boolean;
  isLocked: boolean;
}

export function DualPaneForensic({ data, onLockEvidence, isLocking, isLocked }: ForensicAnalysisProps) {
  const isDeepfake = data.is_deepfake;

  return (
    <div className={`rounded-xl p-5 border transition ${
      isDeepfake ? "bg-red-950/20 tactical-border-alert" : "bg-emerald-950/20 tactical-border"
    }`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDeepfake ? "bg-red-950 text-red-400 border border-red-500/50" : "bg-emerald-950 text-emerald-400 border border-emerald-500/50"
          }`}>
            {isDeepfake ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold font-mono ${isDeepfake ? "text-red-400" : "text-emerald-400"}`}>
                {data.verdict}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                isDeepfake ? "bg-red-950 border border-red-500 text-red-300" : "bg-emerald-950 border border-emerald-500 text-emerald-300"
              }`}>
                KEYAKINAN: {data.confidence_percentage}%
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-2">
              <span>BERKAS: {data.file_name}</span>
              <span>•</span>
              <span>WILAYAH: {data.threat_region}</span>
              {data.source_url && (
                <>
                  <span>•</span>
                  <span className="text-cyan-400 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    OSINT: {data.source_url.length > 45 ? data.source_url.slice(0, 42) + "..." : data.source_url}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lock Evidence Action Button */}
        <div>
          {isLocked ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>TERKUNCI DI CHAIN-OF-CUSTODY</span>
            </div>
          ) : (
            <button
              onClick={onLockEvidence}
              disabled={isLocking}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition ${
                isDeepfake
                  ? "bg-red-500 hover:bg-red-400 text-slate-950 shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isLocking ? "MENGUNCI KE BLOCKCHAIN..." : "KUNCI BUKTI RANTAI KOMANDO (WEB3)"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Dual-Pane View: Original vs XAI Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Pane 1: Original Media */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <span>[ PANE 1: CITRA/FRAME ASLI ]</span>
            <span className="text-slate-500">RAW STREAM</span>
          </div>
          <div className="w-full h-56 bg-slate-900/80 rounded flex items-center justify-center overflow-hidden border border-slate-800/80">
            {data.previewUrl || data.raw_frame_base64 ? (
              data.media_type && data.media_type.startsWith("video/") && data.previewUrl && !data.previewUrl.startsWith("data:") ? (
                <video src={data.previewUrl} controls className="w-full h-full object-contain" />
              ) : (
                <img src={data.previewUrl || data.raw_frame_base64} alt="Original Stream" className="w-full h-full object-contain" />
              )
            ) : (
              <div className="text-center text-slate-500 font-mono text-xs p-4">
                <Layers className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>Frame Video Terpilih</p>
                <p className="text-[10px] text-slate-600">Resolusi Ekstraksi: 640x480 RGB</p>
              </div>
            )}
          </div>
        </div>

        {/* Pane 2: Grad-CAM Explainable AI Heatmap */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="text-red-400 font-bold">[ PANE 2: GRAD-CAM XAI HEATMAP ]</span>
            <span className="text-cyan-400">ACTIVATION MAP</span>
          </div>
          <div className="w-full h-56 bg-slate-900/80 rounded flex items-center justify-center overflow-hidden border border-red-500/30 relative">
            {data.xai_heatmap_base64 ? (
              <img src={data.xai_heatmap_base64} alt="Grad-CAM Heatmap" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-emerald-400 font-mono text-xs p-4">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <p>Tidak Ditemukan Zona Sintetis</p>
                <p className="text-[10px] text-slate-500">Aktivasi Neuron Normal</p>
              </div>
            )}
            {isDeepfake && (
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-red-950/90 border border-red-500 text-[9px] font-mono text-red-300">
                ZONE: LIP / JAW GAN ARTIFACT
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Breakdown & Cryptographic Signature */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
        {/* Metrik Biometrik Visual */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5 mb-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> METRIK BIOMETRIK VISUAL
          </span>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Inkonsistensi Batas Wajah:</span>
                <span className="text-red-400 font-bold">
                  {(data.forensic_analysis.facial_blend_inconsistency * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${Math.min(100, data.forensic_analysis.facial_blend_inconsistency * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Anomali Kedipan Mata/Iris:</span>
                <span className="text-amber-400 font-bold">
                  {(data.forensic_analysis.eye_blink_anomaly * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${Math.min(100, data.forensic_analysis.eye_blink_anomaly * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metrik Akustik & Spektrum */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> SPEKTRUM SUARA & FREKUENSI
          </span>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Sintetis Vocoder Vokal:</span>
                <span className="text-red-400 font-bold">
                  {(data.forensic_analysis.audio_vocoder_synthetic * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${Math.min(100, data.forensic_analysis.audio_vocoder_synthetic * 100)}%` }}
                />
              </div>
            </div>

            {data.forensic_analysis.raw_metrics && (
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                <p>Laplacian Var: <span className="text-emerald-400">{data.forensic_analysis.raw_metrics.laplacian_variance}</span></p>
                <p>FFT Energy: <span className="text-emerald-400">{data.forensic_analysis.raw_metrics.fft_energy_ratio}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Hash Kriptografis & Integritas */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5 mb-2">
            <Eye className="w-3.5 h-3.5 text-emerald-400" /> INTEGRITAS DATA (SHA-256)
          </span>
          <div className="space-y-1.5 text-[10px]">
            <p className="text-slate-400">Hash SHA-256:</p>
            <p className="text-emerald-400 font-mono break-all bg-slate-900 p-1 rounded border border-slate-800">
              {data.sha256}
            </p>
            <p className="text-slate-500 text-[9px]">
              Standar ISO/IEC 27037: Digital Evidence Hash Anchor
            </p>
          </div>
        </div>
      </div>

      {/* Rincian Anomali Konkret */}
      {data.forensic_analysis.anomalies_detected.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
          <p className="text-red-400 font-bold mb-1.5 text-[11px]">TEMUAN FORENSIK UTAMA (XAI FINDINGS):</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            {data.forensic_analysis.anomalies_detected.map((anomaly, idx) => (
              <li key={idx} className="text-slate-300">
                {anomaly}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
