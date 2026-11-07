"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { ProblemSpaceSection } from "@/components/landing/ProblemSpaceSection";
import { LiveTelemetryStrip } from "@/components/landing/LiveTelemetryStrip";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { StandardsSection } from "@/components/landing/StandardsSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingHomePage() {
  return (
    <div className="min-h-screen bg-[#060f0a] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* 1. Military Header & Navigation */}
      <LandingNavbar />

      {/* 2. Hero Section (Pixel-matched with Reference Graphic) */}
      <LandingHero />

      {/* 3. Problem Space Section (Curved transition & Situation Room Preview) */}
      <ProblemSpaceSection />

      {/* 4. Live Real-Time Telemetry Strip from Backend Forensics Engine */}
      <LiveTelemetryStrip />

      {/* 5. Four Core Defense Pillars */}
      <FeaturesSection />

      {/* 6. Technical Architecture & Air-Gapped Readiness */}
      <ArchitectureSection />

      {/* 7. Military & Legal Compliance Standards */}
      <StandardsSection />

      {/* 8. Strategic Defense Benefits */}
      <BenefitsSection />

      {/* 9. Interactive Verification Widget & Command Headquarters */}
      <ContactSection />

      {/* 10. Official Footer */}
      <LandingFooter />
    </div>
  );
}
