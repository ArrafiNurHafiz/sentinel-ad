"use client";

import { useRef, useState } from "react";
import { 
  Zap, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  FileCheck,
  ShieldAlert,
  ArrowRight,
  MapPin,
  FileUp,
  Cpu,
  Link2,
  Globe,
  Radio,
  ExternalLink,
  Sparkles
} from "lucide-react";

interface QuickAnalysisPanelProps {
  onAnalysisComplete: (data: any) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const REGIONS = [
  { id: "KODAM_JAYA", label: "KODAM JAYA (DKI JAKARTA)" },
  { id: "KODAM_I_BB", label: "KODAM I / BUKIT BARISAN (SUMUT)" },
  { id: "KODAM_II_SWJ", label: "KODAM II / SRIWIJAYA (SUMSEL)" },
  { id: "KODAM_III_SLW", label: "KODAM III / SILIWANGI (JABAR)" },
  { id: "KODAM_IV_DIP", label: "KODAM IV / DIPONEGORO (JATENG)" },
  { id: "KODAM_V_BRW", label: "KODAM V / BRAWIJAYA (JATIM)" },
  { id: "KODAM_VI_MLW", label: "KODAM VI / MULAWARMAN (IKN/KALTIM)" },
  { id: "KODAM_IX_UDY", label: "KODAM IX / UDAYANA (BALI & NUSA)" },
  { id: "KODAM_XIV_HSN", label: "KODAM XIV / HASANUDDIN (SULSEL)" },
  { id: "KODAM_XVII_CEN", label: "KODAM XVII / CENDERAWASIH (PAPUA)" },
];

export function QuickAnalysisPanel({ onAnalysisComplete, selectedRegion, onRegionChange }: QuickAnalysisPanelProps) {
  const [ingestMode, setIngestMode] = useState<"FILE" | "URL">("FILE");
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (!res.ok) throw new Error(`Server mengembalikan HTTP ${res.status}`);

      const resJson = await res.json();
      if (resJson.status === "success") {
        onAnalysisComplete({
          ...resJson.data,
          previewUrl: URL.createObjectURL(targetFile),
        });
      } else {
        throw new Error(resJson.message || "Analisis forensik gagal dieksekusi");
      }
    } catch (err: any) {
      console.error("[Analysis Error]", err);
      setErrorMsg(`Kendala pemrosesan: ${err.message}. Pastikan backend aktif.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeUrlAnalysis = async (targetUrl: string, region: string) => {
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      setErrorMsg("Harap masukkan tautan media daring (URL) yang valid.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    try {
      const res = await fetch(`${backendUrl}/api/v1/forensics/analyze-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl,
          threat_region: region,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server mengembalikan status HTTP ${res.status}`);
      }

      const resJson = await res.json();
      if (resJson.status === "success") {
        onAnalysisComplete({
          ...resJson.data,
          previewUrl: resJson.data.xai_heatmap_base64 || cleanUrl,
        });
      } else {
        throw new Error(resJson.message || "Analisis OSINT URL gagal");
      }
    } catch (err: any) {
      console.error("[OSINT URL Error]", err);
      setErrorMsg(`Kendala Ingesti OSINT: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  type SampleType = "deepfake" | "authentic" | "user_authentic" | "user_deepfake";

  const loadSample = async (type: SampleType) => {
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
      if (!res.ok) throw new Error("sample not found");
      const blob = await res.blob();
      const sampleFile = new File([blob], filename, { type: "image/jpeg" });
      setFile(sampleFile);
      setErrorMsg(null);
      executeAnalysis(sampleFile, selectedRegion);
    } catch (e) {
      setErrorMsg("Sampel uji tidak ditemukan di repositori lokal.");
    }
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#061009]/85 backdrop-blur-md p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Laboratorium Forensik Digital</h2>
            <span className="font-mono text-[10px] text-slate-400">Ekstraksi Fitur Spasial &amp; Grad-CAM</span>
          </div>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold">
          PYTORCH ENGINE ACTIVE
        </span>
      </div>

      {/* Step 1: Sector Selection */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>LANGKAH 1: SASARAN SEKTOR KODAM</span>
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full rounded-lg border border-slate-800 bg-[#030905] px-3 py-2 font-mono text-xs text-slate-200 focus:border-emerald-500/60 focus:outline-none transition cursor-pointer"
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id} className="bg-[#040e08] text-slate-200">
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Ingestion Source (File vs OSINT URL) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-bold">
            <FileUp className="w-3.5 h-3.5" />
            <span>LANGKAH 2: SUMBER EVIDENSI SIBER</span>
          </div>

          <div className="flex items-center p-0.5 rounded-lg border border-slate-800 bg-[#030905] text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setIngestMode("FILE")}
              className={`px-2.5 py-1 rounded-md transition font-bold ${
                ingestMode === "FILE"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Unggah Berkas
            </button>
            <button
              type="button"
              onClick={() => setIngestMode("URL")}
              className={`px-2.5 py-1 rounded-md transition font-bold flex items-center gap-1 ${
                ingestMode === "URL"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>OSINT URL</span>
            </button>
          </div>
        </div>

        {ingestMode === "FILE" ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) {
                const f = e.dataTransfer.files[0];
                setFile(f);
                executeAnalysis(f, selectedRegion);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-xl border border-dashed p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-emerald-400 bg-emerald-950/40"
                : "border-slate-800 hover:border-emerald-500/50 bg-[#030905]/80"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const f = e.target.files[0];
                  setFile(f);
                  executeAnalysis(f, selectedRegion);
                }
              }}
            />

            <div className="flex flex-col items-center justify-center py-2">
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <span className="font-mono text-xs font-bold text-emerald-300">
                    MENGEKSTRAKSI TENSOR GRAD-CAM...
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Analisis spektrum spasial FFT &amp; batas rahang wajah
                  </span>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-1.5">
                  <FileCheck className="w-8 h-8 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-white max-w-[260px] truncate">
                    {file.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Klik untuk ganti berkas
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-slate-300">
                    <UploadCloud className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Tarik berkas media ke sini atau <span className="text-emerald-400 underline">telusuri</span>
                    </p>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                      Mendukung MP4, MOV, JPG, PNG (Maks 100MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* OSINT URL Ingestion Form */
          <div className="rounded-xl border border-slate-800 bg-[#030905]/90 p-4 space-y-3 font-mono">
            <div>
              <label className="text-slate-400 text-[10px] block mb-1.5 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>TAUTAN KONTEN DARING (URL / STREAM MEDSOS / PORTAL BERITA):</span>
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && urlInput.trim() && !isAnalyzing) {
                      e.preventDefault();
                      executeUrlAnalysis(urlInput, selectedRegion);
                    }
                  }}
                  placeholder="https://... (contoh: URL video/citra publik yang dicurigai)"
                  className="w-full rounded-lg border border-slate-800 bg-[#06140b] py-2 pl-9 pr-24 text-xs text-emerald-300 placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isAnalyzing || !urlInput.trim()}
                  onClick={() => executeUrlAnalysis(urlInput, selectedRegion)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-[11px] transition flex items-center gap-1"
                >
                  {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  <span>{isAnalyzing ? "Ingesting..." : "Analisis"}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-slate-500 text-[9px] block mb-1.5 font-bold">
                PRESINTEL OSINT: UJI CEPAT TAUTAN DARING
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => {
                    const testUrl = "https://raw.githubusercontent.com/opencv/opencv/master/samples/data/lena.jpg";
                    setUrlInput(testUrl);
                    executeUrlAnalysis(testUrl, selectedRegion);
                  }}
                  className="px-2.5 py-1 rounded border border-slate-800 bg-[#040e07] hover:border-cyan-500/40 text-[10px] text-slate-300 hover:text-cyan-300 transition"
                >
                  [OSINT Feed 1: Citra Uji Wajah (OpenCV)]
                </button>
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => {
                    const testUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png";
                    setUrlInput(testUrl);
                    executeUrlAnalysis(testUrl, selectedRegion);
                  }}
                  className="px-2.5 py-1 rounded border border-slate-800 bg-[#040e07] hover:border-cyan-500/40 text-[10px] text-slate-300 hover:text-cyan-300 transition"
                >
                  [OSINT Feed 2: Foto Kamera Ponsel]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-950/40 text-[11px] font-mono text-red-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span className="truncate">{errorMsg}</span>
        </div>
      )}

      {/* Step 3: Fast Tactical Samples */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>AKSI CEPAT: UJI SAMPEL INSTAN PUSSIBERAD</span>
          <span className="text-emerald-400 font-bold">1-KLIK INFERENSI</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* User Photo: Authentic */}
          <button
            onClick={() => loadSample("user_authentic")}
            disabled={isAnalyzing}
            className="p-2.5 rounded-lg border border-emerald-500/40 bg-[#06140b]/90 hover:border-emerald-500/70 text-left transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between text-emerald-400 text-xs font-mono font-bold">
              <span>Foto User (Asli)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
            <span className="text-[10px] text-slate-400 font-sans block mt-0.5 truncate">
              Foto portrait IMG_0479 terverifikasi
            </span>
          </button>

          {/* User Photo: Deepfake */}
          <button
            onClick={() => loadSample("user_deepfake")}
            disabled={isAnalyzing}
            className="p-2.5 rounded-lg border border-red-500/40 bg-[#140608]/90 hover:border-red-500/70 text-left transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between text-red-400 text-xs font-mono font-bold">
              <span>Foto User (Deepfake)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
            <span className="text-[10px] text-slate-400 font-sans block mt-0.5 truncate">
              Artefak face-swap &amp; GAN checkerboard
            </span>
          </button>

          {/* Speech: Authentic */}
          <button
            onClick={() => loadSample("authentic")}
            disabled={isAnalyzing}
            className="p-2.5 rounded-lg border border-slate-700/60 bg-[#040e08]/70 hover:border-emerald-500/50 text-left transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between text-emerald-300 text-xs font-mono font-bold">
              <span>Pidato Resmi (Asli)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5 truncate">
              Siaran komando Dispenad autentik
            </span>
          </button>

          {/* Speech: Deepfake */}
          <button
            onClick={() => loadSample("deepfake")}
            disabled={isAnalyzing}
            className="p-2.5 rounded-lg border border-slate-700/60 bg-[#0e0406]/70 hover:border-red-500/50 text-left transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between text-red-300 text-xs font-mono font-bold">
              <span>Pidato AI (Deepfake)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5 truncate">
              Sintesis suara &amp; rekayasa visual
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
