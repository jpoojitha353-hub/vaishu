import React, { useState } from 'react';
import { CheckCircle2, Sprout, Users } from 'lucide-react';
import {
  ADVANTAGES_LIST,
  APPLICATIONS_LIST,
  CORE_COMPONENTS_SUMMARY,
  FIELD_PHOTOS,
  HARDWARE_USED_DETAILS,
  PROJECT_ABSTRACT,
  PROJECT_INTRODUCTION,
  PROJECT_WORKING_TEXT,
  WORKING_STAGES,
} from '../data/projectData';

interface ProjectDocumentationSectionProps {
  onOpenTeamDetails: () => void;
}

export const ProjectDocumentationSection: React.FC<
  ProjectDocumentationSectionProps
> = ({ onOpenTeamDetails }) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section
      id="documentation"
      className="py-16 border-t border-emerald-200/80 bg-gradient-to-b from-emerald-50/90 via-teal-50/75 to-emerald-50/90 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-14">
        {/* Abstract & Introduction */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-slate-500">
            01. Mini Project Report · Abstract & Introduction
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 text-balance">
            Project Report & System Documentation
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-2.5">
              <h3 className="text-base font-semibold text-slate-900">
                Abstract
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {PROJECT_ABSTRACT}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-2.5">
              <h3 className="text-base font-semibold text-slate-900">
                Introduction
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {PROJECT_INTRODUCTION}
              </p>
            </div>
          </div>
        </div>

        {/* Hardware Used */}
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Hardware Used
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sensing, processing, isolation, and fluid actuation components
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HARDWARE_USED_DETAILS.map((hw) => (
              <div
                key={hw.name}
                className="rounded-xl border border-slate-200 bg-white p-6 space-y-2"
              >
                <h4 className="text-base font-semibold text-slate-900">
                  {hw.name}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {hw.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Work Flow Chart & Working Principle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Work Flow Chart Diagram */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Work Flow Chart
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Closed-loop decision sequence executed by the Arduino Uno
              </p>
            </div>

            <svg
              viewBox="0 0 440 370"
              className="w-full h-auto"
              role="img"
              aria-label="Work flow chart for automatic plant watering system"
            >
              <defs>
                <marker
                  id="flow-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#475569" />
                </marker>
              </defs>

              {/* Start */}
              <rect
                x="145"
                y="10"
                width="150"
                height="34"
                rx="17"
                fill="#0F172A"
              />
              <text
                x="220"
                y="31"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="600"
              >
                START / POWER ON
              </text>
              <line
                x1="220"
                y1="44"
                x2="220"
                y2="64"
                stroke="#475569"
                strokeWidth="1.5"
                markerEnd="url(#flow-arrow)"
              />

              {/* Read Moisture Sensor */}
              <rect
                x="110"
                y="68"
                width="220"
                height="40"
                rx="6"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <text
                x="220"
                y="86"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="11"
                fontWeight="600"
              >
                Read Soil Moisture Sensor (Pin A0)
              </text>
              <text
                x="220"
                y="100"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
              >
                Convert analog voltage to moisture %
              </text>
              <line
                x1="220"
                y1="108"
                x2="220"
                y2="128"
                stroke="#475569"
                strokeWidth="1.5"
                markerEnd="url(#flow-arrow)"
              />

              {/* Decision Diamond */}
              <polygon
                points="220,132 325,174 220,216 115,174"
                fill="#FEF3C7"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              <text
                x="220"
                y="171"
                textAnchor="middle"
                fill="#78350F"
                fontSize="11"
                fontWeight="600"
              >
                Is Soil Dry?
              </text>
              <text
                x="220"
                y="185"
                textAnchor="middle"
                fill="#92400E"
                fontSize="9.5"
              >
                (Moisture &lt; Threshold)
              </text>

              {/* Left Branch: YES */}
              <line
                x1="115"
                y1="174"
                x2="78"
                y2="174"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1="78"
                y1="174"
                x2="78"
                y2="232"
                stroke="#475569"
                strokeWidth="1.5"
                markerEnd="url(#flow-arrow)"
              />
              <text
                x="94"
                y="167"
                textAnchor="middle"
                fill="#0284C7"
                fontSize="10"
                fontWeight="700"
              >
                YES
              </text>

              <rect
                x="14"
                y="236"
                width="165"
                height="48"
                rx="6"
                fill="#E0F2FE"
                stroke="#0284C7"
                strokeWidth="1.5"
              />
              <text
                x="96"
                y="256"
                textAnchor="middle"
                fill="#0C4A6E"
                fontSize="10.5"
                fontWeight="600"
              >
                Energize Relay (D7)
              </text>
              <text
                x="96"
                y="272"
                textAnchor="middle"
                fill="#0369A1"
                fontSize="9.5"
              >
                DC Pump ON · Water Plant
              </text>

              {/* Right Branch: NO */}
              <line
                x1="325"
                y1="174"
                x2="362"
                y2="174"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1="362"
                y1="174"
                x2="362"
                y2="232"
                stroke="#475569"
                strokeWidth="1.5"
                markerEnd="url(#flow-arrow)"
              />
              <text
                x="346"
                y="167"
                textAnchor="middle"
                fill="#059669"
                fontSize="10"
                fontWeight="700"
              >
                NO
              </text>

              <rect
                x="261"
                y="236"
                width="165"
                height="48"
                rx="6"
                fill="#ECFDF5"
                stroke="#059669"
                strokeWidth="1.5"
              />
              <text
                x="343"
                y="256"
                textAnchor="middle"
                fill="#064E3B"
                fontSize="10.5"
                fontWeight="600"
              >
                Keep Relay OFF
              </text>
              <text
                x="343"
                y="272"
                textAnchor="middle"
                fill="#047857"
                fontSize="9.5"
              >
                Pump Idle · Moisture Optimal
              </text>

              {/* Rejoin Loop */}
              <line
                x1="96"
                y1="284"
                x2="96"
                y2="314"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1="343"
                y1="284"
                x2="343"
                y2="314"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1="96"
                y1="314"
                x2="343"
                y2="314"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1="220"
                y1="314"
                x2="220"
                y2="332"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <rect
                x="115"
                y="332"
                width="210"
                height="28"
                rx="14"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <text
                x="220"
                y="350"
                textAnchor="middle"
                fill="#334155"
                fontSize="10"
                fontWeight="600"
              >
                Update LCD & Repeat Monitoring Loop
              </text>
            </svg>
          </div>

          {/* Working & Core Components */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2.5">
              <h3 className="text-base font-semibold text-slate-900">
                Working Principle
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {PROJECT_WORKING_TEXT}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3.5">
              <h3 className="text-base font-semibold text-slate-900">
                Core Components Summary
              </h3>
              <ul className="space-y-2.5">
                {CORE_COMPONENTS_SUMMARY.map((comp) => (
                  <li
                    key={comp.title}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-slate-900">
                        {comp.title}:
                      </strong>{' '}
                      {comp.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4-Stage Working Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Step-by-Step Control Sequence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WORKING_STAGES.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <h4 className="text-sm font-semibold text-slate-900">
                  {item.step}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages & Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              Key System Advantages
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {ADVANTAGES_LIST.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold leading-5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              Practical Applications
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {APPLICATIONS_LIST.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-sky-600 font-bold leading-5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Field Work & Plant Care Photos */}
        <div id="gallery" className="space-y-6 pt-2 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">
                Field Activity & Botanical Validation
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                Team Field Photos & Nursery Sapling Trials
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenTeamDetails}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              Team Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {FIELD_PHOTOS.map((photo) => {
              const isFailed = failedImages[photo.src];
              return (
                <figure
                  key={photo.src}
                  className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                    {!isFailed ? (
                      <img
                        src={photo.src}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [photo.src]: true,
                          }))
                        }
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                        <Sprout className="w-10 h-10 text-emerald-600 mb-2" />
                        <p className="text-sm font-medium text-slate-800">
                          {photo.title}
                        </p>
                      </div>
                    )}
                  </div>
                  <figcaption className="p-5 bg-white border-t border-slate-200 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <div className="text-xs text-slate-500">{photo.meta}</div>
                      <h4 className="text-base font-semibold text-slate-900 mt-1">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                        {photo.caption}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
