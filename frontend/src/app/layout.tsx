import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "SENTINEL-AD — Military Cognitive Defense & Forensics Ledger",
  description:
    "Tactical Deepfake Forensics & Immutable Digital Chain-of-Custody for PUSSIBERAD TNI AD.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#060A10] text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
