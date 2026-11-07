"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Map,
  Database,
  ShieldCheck,
  ScrollText,
  Settings,
  Globe,
  ChevronRight,
  Activity,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  desc?: string;
};

// 5 Menu Operasional Utama (Disederhanakan & Terstruktur)
const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    label: "Command Center",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    desc: "Laboratorium Forensik AI",
  },
  {
    label: "Peta Situasi (COP)",
    href: "/dashboard/cop",
    icon: <Map className="w-4 h-4" />,
    desc: "Sebaran Ancaman Kodam",
  },
  {
    label: "Buku Besar Evidensi",
    href: "/dashboard/ledger",
    icon: <Database className="w-4 h-4" />,
    desc: "Arsip On-Chain Polygon",
  },
  {
    label: "Doktrin SOP & Audit",
    href: "/dashboard/sop",
    icon: <ScrollText className="w-4 h-4" />,
    desc: "Rantai Komando ISO 27037",
  },
  {
    label: "Portal Verifikasi QR",
    href: "/verify",
    icon: <ShieldCheck className="w-4 h-4" />,
    desc: "Verifikasi Publik Mobile",
  },
];

// Pintasan Tambahan Minimalis di Bawah
const UTILITY_NAV_ITEMS: NavItem[] = [
  {
    label: "Konfigurasi Sistem",
    href: "/dashboard/settings",
    icon: <Settings className="w-3.5 h-3.5" />,
  },
  {
    label: "Portal Publik",
    href: "/",
    icon: <Globe className="w-3.5 h-3.5" />,
  },
];

interface SidebarProps {
  activeSection?: string;
}

export function Sidebar({ activeSection = "Command Center" }: SidebarProps) {
  // Normalisasi nama seksi aktif agar cocok dengan menu yang disederhanakan
  const normalizeSection = (sec: string) => {
    if (sec === "Command Center" || sec === "Analisis Forensik AI") return "Command Center";
    if (sec.includes("COP") || sec.includes("Peta") || sec.includes("C2")) return "Peta Situasi (COP)";
    if (sec.includes("Buku Besar") || sec.includes("Ledger") || sec.includes("On-Chain")) return "Buku Besar Evidensi";
    if (sec.includes("Verifikasi") || sec.includes("QR")) return "Portal Verifikasi QR";
    if (sec.includes("SOP") || sec.includes("Komando") || sec.includes("Audit") || sec.includes("Personel")) return "Doktrin SOP & Audit";
    if (sec.includes("Konfigurasi") || sec.includes("Settings")) return "Konfigurasi Sistem";
    if (sec.includes("Portal Publik")) return "Portal Publik";
    return sec;
  };

  const [active, setActive] = useState(normalizeSection(activeSection));

  return (
    <aside className="fixed top-0 left-0 z-40 h-[100dvh] w-[252px] hidden lg:flex flex-col bg-[#040c07]/95 border-r border-emerald-500/20 backdrop-blur-xl shadow-2xl">
      {/* Brand Header */}
      <Link 
        href="/" 
        className="px-5 pt-4 pb-3 border-b border-emerald-500/15 text-center block transition hover:bg-emerald-950/20"
      >
        <div className="mx-auto mb-2 flex items-center justify-center">
          <Image
            src="/images/tni-ad-emblem.png"
            alt="Lambang Kartika Eka Paksi TNI AD"
            width={38}
            height={38}
            className="drop-shadow-[0_0_12px_rgba(234,179,8,0.45)]"
          />
        </div>
        <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-amber-400">
          PUSSIBERAD TNI AD
        </p>
        <h1 className="mt-0.5 text-lg font-black tracking-tight text-white flex items-center justify-center gap-1">
          <span className="text-emerald-400 font-mono text-base font-light">[</span>
          <span>SENTINEL</span>
          <span className="text-emerald-400">-AD</span>
          <span className="text-emerald-400 font-mono text-base font-light">]</span>
        </h1>
        <p className="mt-0.5 text-[10px] font-mono leading-tight text-slate-400">
          C2 Cognitive Defense Ledger
        </p>
      </Link>

      {/* Navigation Menu — Clean, focused, high-contrast */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
        <div>
          <p className="px-2 mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
            MENU OPERASIONAL
          </p>
          <ul className="space-y-1.5">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = active === item.label;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setActive(item.label)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg font-mono transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_14px_rgba(16,185,129,0.2)] font-bold"
                        : "text-slate-300 hover:text-white hover:bg-[#07170e]/80 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`transition-colors shrink-0 ${
                          isActive
                            ? "text-emerald-400"
                            : "text-slate-400 group-hover:text-emerald-400"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <div className="truncate text-left">
                        <span className="text-xs block leading-tight">{item.label}</span>
                        {item.desc && (
                          <span className="text-[10px] text-slate-400 font-sans block leading-tight truncate">
                            {item.desc}
                          </span>
                        )}
                      </div>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pintasan Tambahan */}
        <div className="pt-3 border-t border-slate-800/80">
          <p className="px-2 mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
            SISTEM &amp; PUBLIK
          </p>
          <ul className="space-y-1">
            {UTILITY_NAV_ITEMS.map((item) => {
              const isActive = active === item.label;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setActive(item.label)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#07170e]/60"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-slate-500 group-hover:text-emerald-400 transition-colors">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </span>
                    {isActive && <ChevronRight className="w-3 h-3 text-emerald-400" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Operational Status Pill at bottom */}
      <div className="p-3 border-t border-emerald-500/15 bg-[#030905]">
        <div className="rounded-lg border border-emerald-500/30 bg-[#06140b] p-2.5 flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-wide text-emerald-300">
                SISTEM C2 OPERASIONAL
              </p>
              <p className="font-mono text-[9px] text-slate-400">Air-Gapped Intranet OK</p>
            </div>
          </div>
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
}
