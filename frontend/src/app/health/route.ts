import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: {
      service: "SENTINEL-AD Defense Engine",
      version: "2.0.0",
      environment: "production",
      tactical_status: "OPERATIONAL",
      device: "Vercel Serverless Edge (PyTorch Neural Core)",
      air_gapped_readiness: true
    },
    message: "SENTINEL-AD Defense Engine ready.",
    timestamp: new Date().toISOString()
  });
}
