import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Pause,
  Play,
  Power,
  RotateCcw,
  Thermometer,
} from 'lucide-react';

interface DataPoint {
  tick: number;
  moisture: number;
  pumpOn: boolean;
}

const MAX_HISTORY = 45;

export const LiveSystemSimulator: React.FC = () => {
  const [moisture, setMoisture] = useState<number>(48);
  const [dryThreshold, setDryThreshold] = useState<number>(35);
  const [targetThreshold, setTargetThreshold] = useState<number>(68);
  const [ambientTemp, setAmbientTemp] = useState<number>(27);
  const [tankLevel, setTankLevel] = useState<number>(84);

  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(true);
  const [manualOverride, setManualOverride] = useState<boolean>(false);
  const [pumpActive, setPumpActive] = useState<boolean>(false);
  const [history, setHistory] = useState<DataPoint[]>(() =>
    Array.from({ length: 24 }, (_, idx) => ({
      tick: idx,
      moisture: 48,
      pumpOn: false,
    }))
  );

  const tickRef = useRef<number>(24);

  // Derived Arduino 10-bit ADC value (Dry ~620, Wet ~270)
  const rawAdc = useMemo(() => {
    const mapped = Math.round(620 - (moisture / 100) * (620 - 270));
    return Math.min(1023, Math.max(0, mapped));
  }, [moisture]);

  // Simulation physics loop
  useEffect(() => {
    if (!isAutoRunning) return;

    const timer = window.setInterval(() => {
      setMoisture((prevMoisture) => {
        // Evaporation scales with ambient temperature
        const evapRate = 0.35 + ((ambientTemp - 15) / 27) * 0.75;

        setTankLevel((prevTank) => {
          const hasWater = prevTank > 2;
          let nextPump = pumpActive;

          if (manualOverride) {
            nextPump = hasWater;
          } else {
            if (!pumpActive && prevMoisture < dryThreshold && hasWater) {
              nextPump = true;
            } else if (pumpActive && (prevMoisture >= targetThreshold || !hasWater)) {
              nextPump = false;
            }
          }

          if (nextPump !== pumpActive) {
            setPumpActive(nextPump);
          }

          if (nextPump && hasWater) {
            return Math.max(0, Number((prevTank - 0.85).toFixed(1)));
          }
          return prevTank;
        });

        const shouldPump =
          (manualOverride || pumpActive) && tankLevel > 2;

        const nextMoisture = shouldPump
          ? Math.min(100, Number((prevMoisture + 2.4).toFixed(1)))
          : Math.max(5, Number((prevMoisture - evapRate).toFixed(1)));

        tickRef.current += 1;
        setHistory((prevHist) => [
          ...prevHist.slice(-(MAX_HISTORY - 1)),
          {
            tick: tickRef.current,
            moisture: nextMoisture,
            pumpOn: shouldPump,
          },
        ]);

        return nextMoisture;
      });
    }, 350);

    return () => window.clearInterval(timer);
  }, [isAutoRunning, ambientTemp, dryThreshold, targetThreshold, manualOverride, pumpActive, tankLevel]);

  // Ensure manual override immediately responds when auto-loop is paused
  const handleManualToggle = () => {
    const nextOverride = !manualOverride;
    setManualOverride(nextOverride);
    if (nextOverride && tankLevel > 2) {
      setPumpActive(true);
    } else if (!nextOverride && moisture >= dryThreshold) {
      setPumpActive(false);
    }
  };

  const handleMoistureSlider = (val: number) => {
    setMoisture(val);
    if (!manualOverride) {
      if (val < dryThreshold && tankLevel > 2) {
        setPumpActive(true);
      } else if (val >= targetThreshold) {
        setPumpActive(false);
      }
    }
  };

  const handleDryThreshold = (val: number) => {
    const clamped = Math.min(val, targetThreshold - 5);
    setDryThreshold(clamped);
  };

  const handleTargetThreshold = (val: number) => {
    const clamped = Math.max(val, dryThreshold + 5);
    setTargetThreshold(clamped);
  };

  const handleRefillTank = () => {
    setTankLevel(100);
  };

  const handleReset = () => {
    setMoisture(48);
    setDryThreshold(35);
    setTargetThreshold(68);
    setAmbientTemp(27);
    setTankLevel(84);
    setManualOverride(false);
    setPumpActive(false);
    setIsAutoRunning(true);
    tickRef.current = 24;
    setHistory(
      Array.from({ length: 24 }, (_, idx) => ({
        tick: idx,
        moisture: 48,
        pumpOn: false,
      }))
    );
  };

  // Explicit multi-coded system state (never color alone)
  const systemState = useMemo(() => {
    if (tankLevel <= 2) {
      return {
        label: 'Tank Empty — Pump Cutoff Safety',
        tone: 'text-red-700 bg-red-50 border-red-200',
        lcdLine2: 'ALERT: NO WATER ',
        icon: <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />,
      };
    }
    if (pumpActive) {
      return {
        label: manualOverride
          ? 'Manual Override — Pump Irrigating'
          : 'Dry Soil Detected — Pump Active',
        tone: 'text-sky-800 bg-sky-50 border-sky-200',
        lcdLine2: 'Pump: ON (Water)',
        icon: <Droplets className="w-4 h-4 shrink-0 text-sky-600" />,
      };
    }
    if (moisture < dryThreshold) {
      return {
        label: 'Moisture Below Threshold — Ready',
        tone: 'text-amber-800 bg-amber-50 border-amber-200',
        lcdLine2: 'Status: LOW SOIL',
        icon: <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />,
      };
    }
    return {
      label: 'Optimal Soil Moisture — Standby',
      tone: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      lcdLine2: 'Pump: OFF (Idle)',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />,
    };
  }, [tankLevel, pumpActive, manualOverride, moisture, dryThreshold]);

  // SVG Chart polyline points
  const chartGeometry = useMemo(() => {
    const w = 560;
    const h = 132;
    const padX = 28;
    const padY = 12;
    const plotW = w - padX * 2;
    const plotH = h - padY * 2;

    const points = history
      .map((pt, idx) => {
        const x = padX + (idx / Math.max(1, history.length - 1)) * plotW;
        const y = padY + (1 - pt.moisture / 100) * plotH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const dryY = padY + (1 - dryThreshold / 100) * plotH;
    const targetY = padY + (1 - targetThreshold / 100) * plotH;

    return { w, h, padX, padY, plotW, plotH, points, dryY, targetY };
  }, [history, dryThreshold, targetThreshold]);

  // Dynamic visual soil & leaf color
  const soilFill =
    moisture < 30 ? '#A16207' : moisture < 55 ? '#78350F' : '#451A03';
  const leafFill =
    moisture < 25 ? '#84CC16' : moisture < 45 ? '#22C55E' : '#15803D';

  return (
    <section
      id="simulator"
      className="py-16 border-t border-sky-200/80 bg-gradient-to-b from-sky-50/90 via-cyan-50/80 to-sky-100/70 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              02. Interactive Hardware Sandbox · Closed-Loop Hysteresis Control
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 text-balance">
              Live System Simulator
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoRunning((r) => !r)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isAutoRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Cycle
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume Cycle
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Two-Zone Sandbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT ZONE (65% -> 8 cols): Interactive Hardware Stage & Waveform */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs font-medium text-slate-600">
                  Hardware Bench Diagram · Real-Time Signal Flow
                </span>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-medium ${systemState.tone}`}
                >
                  {systemState.icon}
                  <span className="whitespace-nowrap">{systemState.label}</span>
                </div>
              </div>

              {/* Interactive SVG Bench Schematic */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox="0 0 760 320"
                  className="w-full h-auto min-w-[600px] select-none"
                  role="img"
                  aria-label="Interactive Arduino Uno automatic plant watering circuit diagram"
                >
                  <defs>
                    <pattern
                      id="bench-grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="0.7"
                      />
                    </pattern>
                  </defs>
                  <rect width="760" height="320" rx="8" fill="#FFFFFF" />
                  <rect width="760" height="320" rx="8" fill="url(#bench-grid)" />

                  {/* Wiring Traces */}
                  {/* Sensor AO -> Arduino A0 */}
                  <path
                    d="M 188 158 L 220 158 L 220 198 L 265 198"
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  {/* Arduino D7 -> Relay IN */}
                  <path
                    d="M 415 154 L 460 154 L 460 132 L 495 132"
                    fill="none"
                    stroke={pumpActive ? '#0284C7' : '#94A3B8'}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  {/* Relay NO -> Submersible Pump */}
                  <path
                    d="M 592 132 L 642 132 L 642 200"
                    fill="none"
                    stroke={pumpActive ? '#EF4444' : '#CBD5E1'}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />

                  {/* Water Silicone Tube from Pump (x:655,y:190) arching to Pot (x:148,y:135) */}
                  <path
                    d="M 655 192 C 655 46, 152 46, 152 136"
                    fill="none"
                    stroke="#BAE6FD"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 655 192 C 655 46, 152 46, 152 136"
                    fill="none"
                    stroke={pumpActive ? '#0EA5E9' : '#E0F2FE'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={pumpActive ? '10 10' : 'none'}
                  >
                    {pumpActive && (
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="40"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    )}
                  </path>

                  {/* Active Water Droplets Falling Into Pot */}
                  {pumpActive && (
                    <g fill="#0284C7">
                      <circle cx="152" cy="146" r="3">
                        <animate
                          attributeName="cy"
                          values="138;166"
                          dur="0.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          dur="0.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="146" cy="152" r="2.5">
                        <animate
                          attributeName="cy"
                          values="140;168"
                          dur="0.65s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          dur="0.65s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  )}

                  {/* 1. POTTED PLANT & SOIL PROBE */}
                  <g transform="translate(55, 75)">
                    {/* Plant Stem & Leaves */}
                    <path
                      d="M 60 95 L 60 40"
                      stroke="#15803D"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 60 66 C 40 60, 32 45, 48 38 C 58 45, 60 56, 60 66 Z"
                      fill={leafFill}
                    />
                    <path
                      d="M 60 58 C 82 52, 92 36, 74 28 C 63 36, 60 48, 60 58 Z"
                      fill={leafFill}
                    />
                    <path
                      d="M 60 42 C 50 22, 62 12, 70 24 C 72 34, 65 40, 60 42 Z"
                      fill={leafFill}
                    />
                    {/* Pot Rim & Body */}
                    <polygon
                      points="18,95 102,95 92,195 28,195"
                      fill="#C2410C"
                    />
                    <rect
                      x="12"
                      y="86"
                      width="96"
                      height="14"
                      rx="3"
                      fill="#EA580C"
                    />
                    {/* Soil Surface */}
                    <ellipse cx="60" cy="95" rx="40" ry="6" fill={soilFill} />

                    {/* Capacitive Soil Moisture Probe inserted in pot */}
                    <rect
                      x="105"
                      y="68"
                      width="28"
                      height="52"
                      rx="3"
                      fill="#DC2626"
                      stroke="#991B1B"
                      strokeWidth="1.2"
                    />
                    <rect x="111" y="74" width="16" height="8" rx="1" fill="#1E293B" />
                    <text
                      x="119"
                      y="108"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      SOIL
                    </text>
                    <text
                      x="60"
                      y="214"
                      textAnchor="middle"
                      fill="#334155"
                      fontSize="11"
                      fontWeight="600"
                    >
                      Plant & Probe (A0)
                    </text>
                  </g>

                  {/* 2. ARDUINO UNO R3 BOARD */}
                  <g transform="translate(265, 118)">
                    <rect
                      x="0"
                      y="0"
                      width="150"
                      height="104"
                      rx="6"
                      fill="#0E7490"
                      stroke="#155E75"
                      strokeWidth="1.5"
                    />
                    {/* USB Port */}
                    <rect x="-8" y="18" width="18" height="24" rx="2" fill="#CBD5E1" />
                    {/* Barrel Jack */}
                    <rect x="-6" y="68" width="20" height="18" rx="2" fill="#1E293B" />
                    {/* ATmega328P Chip */}
                    <rect x="44" y="54" width="76" height="22" rx="2" fill="#1E293B" />
                    <text
                      x="82"
                      y="68"
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      ATmega328P
                    </text>
                    {/* Header Pin Labels */}
                    <rect x="28" y="6" width="108" height="10" rx="2" fill="#0F172A" />
                    <rect x="28" y="88" width="108" height="10" rx="2" fill="#0F172A" />

                    {/* Board Label */}
                    <text
                      x="76"
                      y="36"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="700"
                    >
                      ARDUINO UNO R3
                    </text>

                    {/* Live Pin Telemetry Readout */}
                    <text
                      x="18"
                      y="82"
                      fill="#FEF08A"
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      A0:{rawAdc}
                    </text>
                    <text
                      x="92"
                      y="30"
                      fill={pumpActive ? '#7DD3FC' : '#CBD5E1'}
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      D7:{pumpActive ? 'LOW' : 'HIGH'}
                    </text>

                    {/* D13 Built-in LED */}
                    <circle
                      cx="126"
                      cy="38"
                      r="4"
                      fill={pumpActive ? '#F59E0B' : '#334155'}
                    />
                    <text
                      x="75"
                      y="124"
                      textAnchor="middle"
                      fill="#334155"
                      fontSize="11"
                      fontWeight="600"
                    >
                      Controller Logic
                    </text>
                  </g>

                  {/* 3. 16x2 I2C LCD LIVE SCREEN */}
                  <g transform="translate(265, 250)">
                    <rect
                      x="0"
                      y="0"
                      width="150"
                      height="52"
                      rx="5"
                      fill="#166534"
                      stroke="#14532D"
                      strokeWidth="1.5"
                    />
                    <rect x="8" y="7" width="134" height="38" rx="3" fill="#BEF264" />
                    <text
                      x="14"
                      y="22"
                      fill="#1A2E05"
                      fontSize="10.5"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {`Moisture: ${Math.round(moisture)}%`}
                    </text>
                    <text
                      x="14"
                      y="37"
                      fill="#1A2E05"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {systemState.lcdLine2}
                    </text>
                  </g>

                  {/* 4. 5V RELAY MODULE */}
                  <g transform="translate(495, 98)">
                    <rect
                      x="0"
                      y="0"
                      width="98"
                      height="68"
                      rx="5"
                      fill="#1E293B"
                      stroke="#0F172A"
                      strokeWidth="1.5"
                    />
                    {/* Blue Relay Cube */}
                    <rect x="26" y="10" width="54" height="40" rx="3" fill="#0284C7" />
                    <text
                      x="53"
                      y="33"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      5V RELAY
                    </text>
                    {/* Switching LED */}
                    <circle
                      cx="14"
                      cy="20"
                      r="4"
                      fill={pumpActive ? '#22C55E' : '#475569'}
                    />
                    <text
                      x="49"
                      y="86"
                      textAnchor="middle"
                      fill="#334155"
                      fontSize="11"
                      fontWeight="600"
                    >
                      Isolation Relay
                    </text>
                  </g>

                  {/* 5. WATER RESERVOIR TANK & SUBMERSIBLE PUMP */}
                  <g transform="translate(612, 130)">
                    {/* Glass Reservoir */}
                    <rect
                      x="0"
                      y="0"
                      width="92"
                      height="136"
                      rx="6"
                      fill="#F1F5F9"
                      stroke="#64748B"
                      strokeWidth="2"
                    />
                    {/* Dynamic Water Fill Level */}
                    <rect
                      x="3"
                      y={133 - (tankLevel / 100) * 126}
                      width="86"
                      height={(tankLevel / 100) * 126}
                      rx="3"
                      fill="#7DD3FC"
                      opacity="0.75"
                    />
                    {/* Submersible Pump Body */}
                    <rect
                      x="24"
                      y="86"
                      width="40"
                      height="36"
                      rx="4"
                      fill={pumpActive ? '#0F172A' : '#334155'}
                    />
                    <text
                      x="44"
                      y="107"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      PUMP
                    </text>
                    <text
                      x="46"
                      y="156"
                      textAnchor="middle"
                      fill="#334155"
                      fontSize="11"
                      fontWeight="600"
                    >
                      Tank ({Math.round(tankLevel)}%)
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Live Soil Moisture vs Hysteresis Thresholds Plot */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <span className="text-xs font-medium text-slate-700">
                  Soil Moisture Telemetry & Hysteresis Band
                </span>
                <div className="flex items-center gap-4 text-xs text-slate-600 font-mono tabular-nums">
                  <span>Dry Trigger: {dryThreshold}%</span>
                  <span>Target Stop: {targetThreshold}%</span>
                </div>
              </div>
              <svg
                viewBox={`0 0 ${chartGeometry.w} ${chartGeometry.h}`}
                className="w-full h-32"
                role="img"
                aria-label="Soil moisture percentage over time graph"
              >
                {/* Horizontal grid lines */}
                {[0, 50, 100].map((val) => {
                  const y =
                    chartGeometry.padY +
                    (1 - val / 100) * chartGeometry.plotH;
                  return (
                    <g key={val}>
                      <line
                        x1={chartGeometry.padX}
                        x2={chartGeometry.w - chartGeometry.padX}
                        y1={y}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeWidth="1"
                      />
                      <text
                        x={4}
                        y={y + 4}
                        fill="#64748B"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Target Stop Threshold Line */}
                <line
                  x1={chartGeometry.padX}
                  x2={chartGeometry.w - chartGeometry.padX}
                  y1={chartGeometry.targetY}
                  y2={chartGeometry.targetY}
                  stroke="#059669"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                {/* Dry Trigger Threshold Line */}
                <line
                  x1={chartGeometry.padX}
                  x2={chartGeometry.w - chartGeometry.padX}
                  y1={chartGeometry.dryY}
                  y2={chartGeometry.dryY}
                  stroke="#D97706"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Moisture Curve */}
                <polyline
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartGeometry.points}
                />
              </svg>
            </div>
          </div>

          {/* RIGHT ZONE (35% -> 4 cols): Parameter Control Deck */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Parameter Controls
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Adjust soil moisture, hysteresis bounds, or temperature to observe
                how the Arduino Uno controls the relay.
              </p>
            </div>

            {/* Live Numeric Readout Strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Soil Moisture</div>
                <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                  {Math.round(moisture)}%
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Pin A0 Raw ADC</div>
                <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                  {rawAdc}
                </div>
              </div>
            </div>

            {/* Sliders with Explicit Labels + Units */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="slider-moisture">Soil Moisture Level</label>
                  <span className="font-mono tabular-nums text-slate-900">
                    {Math.round(moisture)}%
                  </span>
                </div>
                <input
                  id="slider-moisture"
                  type="range"
                  min={5}
                  max={100}
                  value={Math.round(moisture)}
                  onChange={(e) => handleMoistureSlider(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="slider-dry">Dry Trigger Threshold</label>
                  <span className="font-mono tabular-nums text-amber-700">
                    {dryThreshold}%
                  </span>
                </div>
                <input
                  id="slider-dry"
                  type="range"
                  min={15}
                  max={60}
                  value={dryThreshold}
                  onChange={(e) => handleDryThreshold(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="slider-target">Target Stop Threshold</label>
                  <span className="font-mono tabular-nums text-emerald-700">
                    {targetThreshold}%
                  </span>
                </div>
                <input
                  id="slider-target"
                  type="range"
                  min={40}
                  max={95}
                  value={targetThreshold}
                  onChange={(e) => handleTargetThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label
                    htmlFor="slider-temp"
                    className="inline-flex items-center gap-1"
                  >
                    <Thermometer className="w-3.5 h-3.5 text-slate-500" />
                    Ambient Temperature
                  </label>
                  <span className="font-mono tabular-nums text-slate-900">
                    {ambientTemp}°C
                  </span>
                </div>
                <input
                  id="slider-temp"
                  type="range"
                  min={15}
                  max={42}
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(Number(e.target.value))}
                  className="w-full accent-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Actuator & Reservoir Actions */}
            <div className="pt-2 border-t border-slate-200 space-y-2.5">
              <button
                type="button"
                onClick={handleManualToggle}
                disabled={tankLevel <= 2}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  manualOverride
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {manualOverride
                  ? 'Stop Manual Pump Override'
                  : 'Manual Pump Override'}
              </button>

              <button
                type="button"
                onClick={handleRefillTank}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                Refill Water Reservoir ({Math.round(tankLevel)}%)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
