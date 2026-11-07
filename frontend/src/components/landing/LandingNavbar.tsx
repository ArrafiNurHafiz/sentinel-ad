"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  Menu,
  X,
  ArrowRight,
  Radio,
  Cpu,
  Wifi,
} from "lucide-react";

interface LandingNavbarProps {
  activeSection?: string;
}

const NAV_LINKS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Fitur", href: "#fitur" },
  { label: "Arsitektur", href: "#arsitektur" },
  { label: "Standar & Kepatuhan", href: "#standar" },
  { label: "Manfaat", href: "#manfaat" },
  { label: "Kontak", href: "#kontak" },
];

export function LandingNavbar({ activeSection = "beranda" }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState(activeSection);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Main Glassmorphic Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#060e09]/92 backdrop-blur-xl border-b border-emerald-500/25 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "bg-[#060e09]/80 backdrop-blur-md py-4 border-b border-emerald-950/50"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand: Kartika Eka Paksi Emblem + TNI AD | SENTINEL-AD */}
          <Link
            href="#beranda"
            onClick={() => setActive("beranda")}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/images/tni-ad-emblem.png"
                alt="Lambang Kartika Eka Paksi TNI AD"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.45)]"
                priority
              />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm sm:text-base tracking-[0.16em] text-white">
                TNI AD
              </span>
              <span className="text-slate-600 font-light text-base">|</span>
              <span className="font-black italic text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                SENTINEL<span className="text-[#39db7d] not-italic">-AD</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => {
              const linkKey = link.href.replace("#", "");
              const isActive = active === linkKey;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActive(linkKey)}
                  className={`text-xs xl:text-sm font-medium transition-all relative py-1 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-slate-200 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute -bottom-2.5 left-0 right-0 h-[2.5px] bg-[#39db7d] rounded-full shadow-[0_0_10px_#39db7d]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Officer Login Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/verify"
              className="text-xs text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] font-medium"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verifikasi Publik</span>
            </Link>

            <Link
              href="/dashboard"
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-500/60 bg-emerald-950/30 text-white hover:bg-emerald-500 hover:text-slate-950 font-semibold text-xs transition-all duration-200 shadow-[0_0_15px_rgba(57,219,125,0.25)] active:scale-[0.98]"
            >
              <Lock className="w-3.5 h-3.5 text-[#39db7d] group-hover:text-slate-950 transition-colors" />
              <span>Login Sistem</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-xs font-semibold"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Login</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-[#060e09]/98 border-b border-emerald-500/30 px-6 py-5 space-y-3"
            >
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setActive(link.href.replace("#", ""));
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="pt-3 flex flex-col gap-2">
                <Link
                  href="/verify"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-medium"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Portal Verifikasi Publik</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Buka Command Center Dashboard</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
