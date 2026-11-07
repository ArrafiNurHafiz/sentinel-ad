import { NextRequest, NextResponse } from "next/server";
import { ServerStore } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function corsResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug || [];
    const searchParams = req.nextUrl.searchParams;

    // 1. /api/v1/health
    if (slug.length === 1 && slug[0] === "health") {
      return corsResponse({
        status: "success",
        data: {
          service: "SENTINEL-AD Defense Engine",
          version: "2.0.0",
          environment: "production",
          tactical_status: "OPERATIONAL",
          device: "Vercel Serverless Edge (PyTorch Neural Core)"
        },
        message: "SENTINEL-AD Defense Engine ready.",
        timestamp: new Date().toISOString()
      });
    }

    // 2. /api/v1/forensics/*
    if (slug[0] === "forensics") {
      const sub = slug[1];

      // GET /api/v1/forensics/stats
      if (sub === "stats") {
        return corsResponse({
          status: "success",
          data: ServerStore.getStats(),
          timestamp: new Date().toISOString()
        });
      }

      // GET /api/v1/forensics/history?limit=10
      if (sub === "history") {
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        return corsResponse({
          status: "success",
          data: ServerStore.getHistory(limit),
          timestamp: new Date().toISOString()
        });
      }

      // GET /api/v1/forensics/verify/[hash]
      if (sub === "verify" && slug[2]) {
        const hash = slug[2];
        const result = ServerStore.verifyMedia(hash);
        return corsResponse({
          status: "success",
          data: result,
          timestamp: new Date().toISOString()
        });
      }

      // GET /api/v1/forensics/dossier/[hash]
      if (sub === "dossier" && slug[2]) {
        const hash = slug[2];
        const dossier = ServerStore.generateDossier(hash);
        if (!dossier) {
          return corsResponse(
            { detail: `Berkas forensik dengan hash ${hash} tidak ditemukan dalam registri.` },
            404
          );
        }
        return corsResponse({
          status: "success",
          data: dossier,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 3. /api/v1/c2/*
    if (slug[0] === "c2") {
      const sub = slug[1];

      // GET /api/v1/c2/sectors
      if (sub === "sectors") {
        return corsResponse({
          status: "success",
          data: ServerStore.getSectors(),
          timestamp: new Date().toISOString()
        });
      }

      // GET /api/v1/c2/alerts
      if (sub === "alerts") {
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        return corsResponse({
          status: "success",
          data: ServerStore.getC2Alerts(limit),
          timestamp: new Date().toISOString()
        });
      }
    }

    // 4. GET /api/v1/personnel
    if (slug.length === 1 && slug[0] === "personnel") {
      return corsResponse({
        status: "success",
        data: ServerStore.getPersonnel(),
        timestamp: new Date().toISOString()
      });
    }

    // 5. GET /api/v1/settings
    if (slug.length === 1 && slug[0] === "settings") {
      return corsResponse({
        status: "success",
        data: ServerStore.getSettings(),
        timestamp: new Date().toISOString()
      });
    }

    // 6. GET /api/v1/audit
    if (slug.length === 1 && slug[0] === "audit") {
      const limit = parseInt(searchParams.get("limit") || "100", 10);
      const logs = ServerStore.getAuditLogs(limit);
      return corsResponse({
        status: "success",
        data: {
          items: logs,
          total_records: ServerStore.getTotalAuditCount(),
          standard: "ISO/IEC 27037:2012 Digital Evidence Handling"
        },
        timestamp: new Date().toISOString()
      });
    }

    // 7. GET /api/v1/vault/ipfs/[cid]
    if (slug[0] === "vault" && slug[1] === "ipfs" && slug[2]) {
      const payload = ServerStore.getVaultPayload(slug[2]);
      if (!payload) {
        return corsResponse({ detail: "Arsip CID tidak ditemukan di tactical vault" }, 404);
      }
      return corsResponse(payload);
    }

    return corsResponse({ detail: `Route not found: /api/v1/${slug.join("/")}` }, 404);
  } catch (err: any) {
    return corsResponse({ detail: err?.message || "Internal server error" }, 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug || [];

    // 1. POST /api/v1/forensics/analyze
    if (slug[0] === "forensics" && slug[1] === "analyze") {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const threatRegion = (formData.get("threat_region") as string) || "KODAM_JAYA";

      if (!file) {
        return corsResponse({ detail: "File media wajib diunggah." }, 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        return corsResponse({ detail: "File yang diunggah berukuran 0 bytes." }, 400);
      }

      const analysisResult = ServerStore.analyzeMediaFile(
        buffer,
        file.name,
        file.type || "image/jpeg",
        threatRegion
      );

      return corsResponse({
        status: "success",
        data: analysisResult,
        message: `Analisis forensik selesai. Status: ${analysisResult.verdict}`,
        timestamp: new Date().toISOString()
      });
    }

    // 2. POST /api/v1/forensics/analyze-url
    if (slug[0] === "forensics" && slug[1] === "analyze-url") {
      const body = await req.json();
      const rawUrl = (body.url || "").trim();
      const threatRegion = body.threat_region || "KODAM_JAYA";

      if (!rawUrl) {
        return corsResponse({ detail: "URL tidak boleh kosong." }, 400);
      }

      let parsed: URL;
      try {
        parsed = new URL(rawUrl);
      } catch {
        return corsResponse({ detail: "Format URL tidak valid." }, 400);
      }

      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return corsResponse({ detail: "Hanya protokol HTTP dan HTTPS yang didukung." }, 400);
      }

      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "0.0.0.0" ||
        hostname === "::1" ||
        hostname === "169.254.169.254"
      ) {
        return corsResponse({ detail: "Akses ke host lokal diblokir (SSRF Prevention)." }, 400);
      }

      try {
        const fetchRes = await fetch(rawUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SentinelAD-Forensics/2.0 OSINT-Fetcher"
          }
        });

        if (!fetchRes.ok) {
          return corsResponse(
            { detail: `Gagal mengunduh media dari URL sumber (HTTP ${fetchRes.status}).` },
            400
          );
        }

        const ab = await fetchRes.arrayBuffer();
        const buf = Buffer.from(ab);

        if (buf.length === 0) {
          return corsResponse({ detail: "Berkas dari URL berukuran 0 bytes." }, 400);
        }

        if (buf.length > 50 * 1024 * 1024) {
          return corsResponse({ detail: "Ukuran berkas melebihi batas 50 MB." }, 400);
        }

        const pathname = parsed.pathname;
        let baseName = pathname.split("/").pop() || "";
        const contentType = fetchRes.headers.get("content-type") || "image/jpeg";

        if (!baseName || !baseName.includes(".")) {
          let ext = ".jpg";
          if (contentType.includes("video")) ext = ".mp4";
          else if (contentType.includes("png")) ext = ".png";
          baseName = `osint_media_${Date.now().toString(16)}${ext}`;
        }

        const analysisResult = ServerStore.analyzeMediaFile(
          buf,
          baseName,
          contentType,
          threatRegion
        );
        analysisResult.source_url = rawUrl;
        ServerStore.saveRecord(analysisResult.sha256, analysisResult);

        ServerStore.appendAuditLog({
          eventType: "INGESTION",
          actor: "OSINT Automated Ingestion Crawler",
          actorAddress: "OSINT_GATEWAY",
          resourceHash: analysisResult.sha256,
          status: "SUCCESS",
          description: `Akuisisi otomatis barang bukti daring dari URL '${rawUrl}'. Format: ${contentType}, Ukuran: ${buf.length} bytes.`
        });

        return corsResponse({
          status: "success",
          data: analysisResult,
          message: `Ingesti & analisis OSINT selesai. Status: ${analysisResult.verdict}`,
          timestamp: new Date().toISOString()
        });
      } catch (err: any) {
        return corsResponse({ detail: `Koneksi ke URL sumber gagal: ${err.message}` }, 400);
      }
    }

    // 3. POST /api/v1/forensics/lock
    if (slug[0] === "forensics" && slug[1] === "lock") {
      const body = await req.json();
      const { sha256, tx_hash, ipfs_cid, officer_address } = body;

      if (!sha256 || !tx_hash || !ipfs_cid || !officer_address) {
        return corsResponse({ detail: "Missing required fields for lock" }, 400);
      }

      const res = ServerStore.lockEvidence({
        sha256,
        tx_hash,
        ipfs_cid,
        officer_address
      });

      return corsResponse({
        status: "success",
        data: res,
        message: "Status penguncian on-chain berhasil dicatat ke registry bukti.",
        timestamp: new Date().toISOString()
      });
    }

    // 4. POST /api/v1/c2/broadcast
    if (slug[0] === "c2" && slug[1] === "broadcast") {
      const body = await req.json();
      const alert = ServerStore.addC2Alert(body);
      return corsResponse({
        status: "success",
        data: alert,
        message: `Instruksi C2 Alert berhasil dipancarkan ke jajaran Kodam ${body.region_id}.`,
        timestamp: new Date().toISOString()
      });
    }

    // 5. POST /api/v1/personnel
    if (slug.length === 1 && slug[0] === "personnel") {
      const body = await req.json();
      const officer = ServerStore.addOfficer(body);
      return corsResponse({
        status: "success",
        data: officer,
        message: "Perwira berhasil didaftarkan ke registri otorisasi militer.",
        timestamp: new Date().toISOString()
      });
    }

    // 6. POST /api/v1/settings
    if (slug.length === 1 && slug[0] === "settings") {
      const body = await req.json();
      const updated = ServerStore.updateSettings(body);
      return corsResponse({
        status: "success",
        data: updated,
        message: "Konfigurasi sistem berhasil diperbarui secara permanen.",
        timestamp: new Date().toISOString()
      });
    }

    // 7. POST /api/v1/audit
    if (slug.length === 1 && slug[0] === "audit") {
      const body = await req.json();
      const entry = ServerStore.appendAuditLog(body);
      return corsResponse({
        status: "success",
        data: entry,
        message: "Entri audit berhasil dicatat ke rantai kustodi ISO 27037."
      });
    }

    // 8. POST /api/v1/vault/archive
    if (slug[0] === "vault" && slug[1] === "archive") {
      const body = await req.json();
      const result = ServerStore.archiveToVault(body);
      return corsResponse({
        status: "success",
        data: result,
        message: "Payload forensik berhasil diarsipkan ke IPFS Tactical Vault.",
        timestamp: new Date().toISOString()
      });
    }

    return corsResponse({ detail: `Route not found: /api/v1/${slug.join("/")}` }, 404);
  } catch (err: any) {
    return corsResponse({ detail: err?.message || "Internal server error" }, 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug || [];

    // PATCH /api/v1/personnel/[id]/toggle-status
    if (slug[0] === "personnel" && slug[2] === "toggle-status") {
      const officerId = slug[1];
      const target = ServerStore.toggleOfficerStatus(officerId);
      return corsResponse({
        status: "success",
        data: target,
        message: `Status perwira berhasil diubah menjadi ${target.status}.`,
        timestamp: new Date().toISOString()
      });
    }

    return corsResponse({ detail: `Route not found: /api/v1/${slug.join("/")}` }, 404);
  } catch (err: any) {
    return corsResponse({ detail: err?.message || "Internal server error" }, 500);
  }
}
