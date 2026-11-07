"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileVideo, FileImage, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";

interface MediaIngestProps {
  onAnalysisComplete: (data: any) => void;
  onRegionChange: (region: string) => void;
  selectedRegion: string;
}

const REGIONS = [
  { id: "KODAM_JAYA", label: "KODAM JAYA (DKI JAKARTA)" },
  { id: "KODAM_I_BB", label: "KODAM I / BUKIT BARISAN (SUMUT)" },
  { id: "KODAM_II_SWJ", label: "KODAM II / SRIWIJAYA (SUMSEL)" },
  { id: "KODAM_III_SLW", label: "KODAM III / SILIWANGI (JABAR)" },
  { id: "KODAM_IV_DIP", label: "KODAM IV / DIPONEGORO (JATENG)" },
  { id: "KODAM_V_BRW", label: "KODAM V / BRAWIJAYA (JATIM)" },
  { id: "KODAM_VI_MLW", label: "KODAM VI / MULAWARMAN (KALTIM)" },
  { id: "KODAM_IX_UDY", label: "KODAM IX / UDAYANA (BALI & NUSA)" },
  { id: "KODAM_XIV_HSN", label: "KODAM XIV / HASANUDDIN (SULSEL)" },
  { id: "KODAM_XVII_CEN", label: "KODAM XVII / CENDERAWASIH (PAPUA)" },
];

export function MediaIngest({ onAnalysisComplete, onRegionChange, selectedRegion }: MediaIngestProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setErrorMsg(null);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const executeAnalysis = async (targetFile: File, region: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", targetFile);
    formData.append("threat_region", region);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    try {
      const res = await fetch(`${backendUrl}/api/v1/forensics/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const resJson = await res.json();
      if (resJson.status === "success") {
        onAnalysisComplete({
          ...resJson.data,
          previewUrl: previewUrl || URL.createObjectURL(targetFile),
        });
      } else {
        throw new Error(resJson.message || "Forensic analysis failed");
      }
    } catch (err: any) {
      console.error("[Analysis Error]", err);
      setErrorMsg(`Analisis backend: ${err.message}. Memastikan server aktif di port 8000.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 1-Click Tactical Sample Testing (Loads Real Sample Media from Server)
  type PresetType = "deepfake" | "authentic" | "user_authentic" | "user_deepfake";

  const loadTacticalSample = async (type: PresetType) => {
    let samplePath = "/samples/sample_authentic_speech.jpg";
    let filename = "sample_authentic_speech.jpg";

    if (type === "deepfake") {
      samplePath = "/samples/sample_deepfake_speech.jpg";
      filename = "sample_deepfake_speech.jpg";
    } else if (type === "user_authentic") {
      samplePath = "/samples/user_sample_authentic.jpg";
      filename = "user_sample_authentic.jpg";
    } else if (type === "user_deepfake") {
      samplePath = "/samples/user_sample_deepfake.jpg";
      filename = "user_sample_deepfake.jpg";
    }

    try {
      const res = await fetch(samplePath);
      if (res.ok) {
        const blob = await res.blob();
        const sampleFile = new File([blob], filename, { type: "image/jpeg" });
        setFile(sampleFile);
        const objUrl = URL.createObjectURL(sampleFile);
        setPreviewUrl(objUrl);
        executeAnalysis(sampleFile, selectedRegion);
      }
    } catch (e) {
      console.warn("Direct sample fetch failed", e);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 tactical-border">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide text-slate-200">
            MEDIA INGESTION & TRIASE FORENSIK
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
          XAI ENGINE v2.0
        </span>
      </div>

      {/* Wilayah Ancaman (Kodam Target) */}
      <div className="mb-4">
        <label className="block text-xs font-mono text-slate-400 mb-1.5">
          ZONA TARGET TEROR/DISINFORMASI (KODAM JURIDIKSI):
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => {
            onRegionChange(e.target.value);
          }}
          className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
          file
            ? "border-emerald-500/50 bg-emerald-950/10"
            : "border-slate-700/60 hover:border-emerald-500/40 bg-slate-950/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center gap-3">
            {file.type.startsWith("video/") ? (
              <FileVideo className="w-8 h-8 text-cyan-400 animate-pulse" />
            ) : (
              <FileImage className="w-8 h-8 text-emerald-400" />
            )}
            <div className="text-left font-mono">
              <p className="text-xs text-slate-200 font-bold truncate max-w-[220px]">
                {file.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "binary"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <UploadCloud className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-xs text-slate-300 font-medium">
              Klik atau tarik file media mencurigakan (.mp4, .mov, .jpg, .png)
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Maksimum 50MB • Otomatis ekstraksi frame & analisis biometrik
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-3 p-2.5 rounded bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      {/* Primary Analyze Action Button */}
      <button
        disabled={!file || isAnalyzing}
        onClick={() => file && executeAnalysis(file, selectedRegion)}
        className={`mt-4 w-full py-2.5 rounded-lg font-bold text-xs font-mono tracking-wider transition flex items-center justify-center gap-2 ${
          !file || isAnalyzing
            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
        }`}
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            <span>MEMPROSES ANALISIS FORENSIK XAI...</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-4 h-4" />
            <span>MULAI INFERENSI FORENSIK MULTIMODAL</span>
          </>
        )}
      </button>

      {/* Quick Tactical Preset Buttons (Ideal for 10-Minute Judge Demo) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <p className="text-[10px] font-mono text-slate-400 mb-2">
          PRESET PENGUJIAN JURI (1-KLIK EVALUASI CEPAT):
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => loadTacticalSample("user_authentic")}
            disabled={isAnalyzing}
            className="px-2.5 py-2 rounded bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono text-left transition flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="truncate">Foto User (Asli)</span>
          </button>
          <button
            onClick={() => loadTacticalSample("user_deepfake")}
            disabled={isAnalyzing}
            className="px-2.5 py-2 rounded bg-red-950/40 hover:bg-red-950/70 border border-red-500/40 text-red-400 text-[11px] font-mono text-left transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-400" />
            <span className="truncate">Foto User (Deepfake)</span>
          </button>
          <button
            onClick={() => loadTacticalSample("authentic")}
            disabled={isAnalyzing}
            className="px-2.5 py-1.5 rounded bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[10px] font-mono text-left transition flex items-center gap-1.5"
          >
            <CheckCircle className="w-3 h-3 shrink-0 text-emerald-400" />
            <span className="truncate">Sample Siaran Asli TNI</span>
          </button>
          <button
            onClick={() => loadTacticalSample("deepfake")}
            disabled={isAnalyzing}
            className="px-2.5 py-1.5 rounded bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[10px] font-mono text-left transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3 h-3 shrink-0 text-red-400" />
            <span className="truncate">Sample Deepfake Pidato</span>
          </button>
        </div>
      </div>
    </div>
  );
}
