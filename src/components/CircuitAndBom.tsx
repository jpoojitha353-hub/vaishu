import React, { useState } from 'react';
import { Cpu, Download } from 'lucide-react';
import { BOM_ITEMS, HARDWARE_MODULES } from '../data/projectData';

export const CircuitAndBom: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(HARDWARE_MODULES[0].id);
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  const selectedModule =
    HARDWARE_MODULES.find((m) => m.id === selectedId) ?? HARDWARE_MODULES[0];

  const handleDownloadCsv = () => {
    const header = 'Component,Specification,Quantity,Purpose,Approx Cost (USD)';
    const rows = BOM_ITEMS.map(
      (item) =>
        `"${item.item}","${item.specification}",${item.qty},"${item.purpose}","${item.approxCostUsd}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'arduino-plant-watering-bom.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="circuit"
      className="py-16 border-t border-teal-200/80 bg-gradient-to-b from-teal-50/85 via-emerald-50/75 to-teal-100/70 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-slate-500 mb-2">
            03. Hardware Architecture · Pinout Mapping & Components
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 text-balance">
            Circuit Connections & Bill of Materials
          </h2>
        </div>

        {/* Component Explorer Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Hardware Flatlay Visual */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col">
            <div className="relative flex-1 min-h-[280px] bg-slate-100">
              {!imgFailed ? (
                <img
                  src="/src/assets/images/arduino_components_flatlay_1795104039716.jpg"
                  alt="Arduino Uno R3, capacitive soil moisture sensor, 5V relay module, mini submersible pump, and 16x2 LCD flat-lay"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-100">
                  <Cpu className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-700">
                    Arduino Uno & Sensor Hardware Kit
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ATmega328P · Capacitive Probe · 5V Relay · DC Pump · I2C LCD
                  </p>
                </div>
              )}
            </div>
            <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600">
              <span>Core Hardware Kit Layout</span>
              <span className="font-mono tabular-nums">5V DC Logic</span>
            </div>
          </div>

          {/* Right: Interactive Module Pinout Inspector */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Segmented Module Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg">
                {HARDWARE_MODULES.map((mod) => {
                  const active = mod.id === selectedModule.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setSelectedId(mod.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mod.name.replace(' Module', '').replace(' Mini', '')}
                    </button>
                  );
                })}
              </div>

              {/* Selected Module Details */}
              <div>
                <div className="text-xs text-slate-500 font-mono">
                  {selectedModule.model}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">
                  {selectedModule.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  {selectedModule.role}
                </p>
              </div>

              {/* Pinout Wiring Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-medium">Module Pin</th>
                      <th className="py-2.5 px-3 font-medium">Connects To</th>
                      <th className="py-2.5 px-3 font-medium">Signal Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedModule.pins.map((pin) => (
                      <tr key={`${pin.from}-${pin.to}`}>
                        <td className="py-2 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                          {pin.from}
                        </td>
                        <td className="py-2 px-3 font-mono text-sky-700 whitespace-nowrap">
                          {pin.to}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {pin.signal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-slate-500 pt-4 mt-4 border-t border-slate-100">
              Engineering Note: {selectedModule.notes}
            </p>
          </div>
        </div>

        {/* Bill of Materials Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Bill of Materials (BOM)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete component checklist for reproducing the prototype (~$26.20 total)
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6 font-medium">Component</th>
                  <th className="py-3 px-6 font-medium">Specification</th>
                  <th className="py-3 px-4 font-medium text-right">Qty</th>
                  <th className="py-3 px-6 font-medium">System Purpose</th>
                  <th className="py-3 px-6 font-medium text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {BOM_ITEMS.map((item) => (
                  <tr key={item.item} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      {item.item}
                    </td>
                    <td className="py-3.5 px-6 text-xs font-mono text-slate-600">
                      {item.specification}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                      {item.qty}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 text-xs">
                      {item.purpose}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono tabular-nums text-slate-900">
                      {item.approxCostUsd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
