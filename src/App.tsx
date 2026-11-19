/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowDownRight, Cpu, QrCode, Users } from 'lucide-react';
import { HERO_SPECS, TeamDetailsData } from './data/projectData';
import { ProjectDocumentationSection } from './components/ProjectDocumentationSection';
import { LiveSystemSimulator } from './components/LiveSystemSimulator';
import { CircuitAndBom } from './components/CircuitAndBom';
import { ShareSlipSection } from './components/ShareSlipSection';
import { TeamDetailsModal } from './components/TeamDetailsModal';
import { loadInitialTeamDetails } from './utils/teamShare';

export default function App() {
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [team, setTeam] = useState<TeamDetailsData>(() =>
    loadInitialTeamDetails()
  );

  // Support direct deep links like ?team=1 or #team
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('team') === '1' || window.location.hash === '#team') {
      setIsTeamModalOpen(true);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      {/* Top Bar: Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 h-16 bg-emerald-950/95 backdrop-blur border-b border-emerald-800/80 text-white no-print">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Wordmark */}
          <a
            href="#overview"
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            HydroUno Project
          </a>

          {/* Zone 2: 4 Concise Single-Line Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-emerald-100"
          >
            <a
              href="#overview"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Overview
            </a>
            <a
              href="#documentation"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Project Report
            </a>
            <a
              href="#simulator"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Live Simulator
            </a>
            <a
              href="#circuit"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Circuit & BOM
            </a>
          </nav>

          {/* Zone 3: 1 Primary CTA Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('share')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-300 rounded-lg hover:bg-emerald-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              Share & QR Slip
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Rich Botanical Emerald-Teal Background */}
        <section
          id="overview"
          className="py-14 md:py-20 bg-gradient-to-br from-emerald-900 via-teal-900 to-sky-900 text-white no-print"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Hero Copy */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-200">
                  <span>Mini Project Publication</span>
                  <span aria-hidden="true">·</span>
                  <span>Embedded Systems</span>
                  <span aria-hidden="true">·</span>
                  <span>Arduino Uno R3</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-white leading-[1.15] text-balance">
                  Automatic Plant Watering System Using Arduino Uno and Sensors
                </h1>

                <p className="text-base text-emerald-50/90 leading-relaxed max-w-xl">
                  An autonomous closed-loop irrigation controller that monitors
                  volumetric soil moisture in real time, switches a submersible DC
                  water pump through an opto-isolated 5V relay using hysteresis
                  thresholds, and reports status on a 16x2 I2C LCD display.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => scrollToSection('simulator')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-400 text-emerald-950 hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Launch Live Simulator
                    <ArrowDownRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTeamModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-white text-slate-900 hover:bg-emerald-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-emerald-700" />
                    Team Details
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('share')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-emerald-300/50 bg-emerald-950/30 text-white hover:bg-emerald-950/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Get QR & Report Link
                  </button>
                </div>
              </div>

              {/* Hero Hardware Prototype Visual */}
              <div className="lg:col-span-6">
                <div className="h-full min-h-[290px] rounded-xl border border-emerald-400/30 bg-emerald-950/40 overflow-hidden shadow-lg">
                  {!heroImgFailed ? (
                    <img
                      src="/src/assets/images/arduino_plant_hero_1795104039235.jpg"
                      alt="Arduino Uno R3 wired to a soil moisture sensor in a potted basil plant, 5V relay module, and water reservoir pump"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[290px] flex flex-col items-center justify-center p-8 text-center bg-emerald-950/50">
                      <Cpu className="w-12 h-12 text-emerald-300 mb-3" />
                      <p className="text-sm font-semibold text-white">
                        Arduino Uno Automatic Irrigation Prototype
                      </p>
                      <p className="text-xs text-emerald-200 mt-1">
                        Soil Sensor · 5V Relay · Submersible Pump · 16x2 LCD
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4-Column Specification Strip */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HERO_SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-emerald-300/25 bg-emerald-950/45 backdrop-blur-xs px-5 py-4"
                >
                  <div className="text-xs text-emerald-200">{spec.label}</div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Report, Working Stages, Advantages & Field Photos */}
        <div className="no-print">
          <ProjectDocumentationSection
            onOpenTeamDetails={() => setIsTeamModalOpen(true)}
          />
        </div>

        {/* Interactive Two-Zone Sandbox Simulator */}
        <div className="no-print">
          <LiveSystemSimulator />
        </div>

        {/* Circuit Connections & Bill of Materials */}
        <div className="no-print">
          <CircuitAndBom />
        </div>

        {/* Published Website Link, Scannable QR Code & Printable Report Notice Slip */}
        <ShareSlipSection team={team} />
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-emerald-800 bg-emerald-950 text-emerald-100 py-8 no-print">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>
            Automatic Plant Watering System Using Arduino Uno and Sensors · Mini
            Project Web Page
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#documentation"
              className="hover:text-white transition-colors"
            >
              Project Report
            </a>
            <a
              href="#simulator"
              className="hover:text-white transition-colors"
            >
              Simulator
            </a>
            <a
              href="#circuit"
              className="hover:text-white transition-colors"
            >
              Wiring & BOM
            </a>
            <button
              type="button"
              onClick={() => setIsTeamModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Team Details
            </button>
            <a
              href="#share"
              className="hover:text-white transition-colors"
            >
              QR & Link
            </a>
          </div>
        </div>
      </footer>

      {/* Team Details Modal */}
      <TeamDetailsModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        team={team}
        onUpdateTeam={setTeam}
      />
    </div>
  );
}
