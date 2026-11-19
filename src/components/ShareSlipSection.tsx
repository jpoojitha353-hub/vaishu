import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  Printer,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { PROJECT_TITLE, TeamDetailsData } from '../data/projectData';
import {
  encodeTeamDetailsParam,
  getCurrentWindowBaseUrl,
  getPublicShareBaseUrl,
} from '../utils/teamShare';

interface ShareSlipSectionProps {
  team: TeamDetailsData;
}

export const ShareSlipSection: React.FC<ShareSlipSectionProps> = ({ team }) => {
  const [linkMode, setLinkMode] = useState<'public' | 'current'>('public');

  const recommendedShareUrl = useMemo(() => {
    const base =
      linkMode === 'public'
        ? getPublicShareBaseUrl()
        : getCurrentWindowBaseUrl();
    const td = encodeTeamDetailsParam(team);
    return td ? `${base}?td=${td}` : base;
  }, [team, linkMode]);

  const [websiteLink, setWebsiteLink] = useState<string>(recommendedShareUrl);
  const [hasCustomInput, setHasCustomInput] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedSlip, setCopiedSlip] = useState<boolean>(false);
  const [sharedFeedback, setSharedFeedback] = useState<boolean>(false);

  // Keep link synchronized with edited team details unless user manually typed a custom URL
  useEffect(() => {
    if (!hasCustomInput) {
      setWebsiteLink(recommendedShareUrl);
    }
  }, [recommendedShareUrl, hasCustomInput]);

  const activeLink = websiteLink.trim() || recommendedShareUrl;

  // Generate real scannable QR code whenever activeLink changes
  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(activeLink, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [activeLink]);

  const formattedNoticeBlock = useMemo(() => {
    return [
      '-----------------------------------------',
      'MINI PROJECT',
      '',
      'TITLE:',
      'AUTOMATIC PLANT WATERING SYSTEM USING',
      'ARDUINO UNO AND SENSORS',
      '',
      'The Mini Project has been published separately',
      'as a web page.',
      '',
      'Website Link:',
      activeLink,
      '',
      'Scan QR Code or click the above link to',
      'view the complete project.',
      '-----------------------------------------',
    ].join('\n');
  }, [activeLink]);

  const whatsappShareUrl = useMemo(() => {
    const message = `MINI PROJECT: ${PROJECT_TITLE}\n\nOpen the complete project website here:\n${activeLink}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [activeLink]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activeLink);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: PROJECT_TITLE,
          text: 'View our Automatic Plant Watering System Mini Project web page:',
          url: activeLink,
        });
        setSharedFeedback(true);
        window.setTimeout(() => setSharedFeedback(false), 2200);
        return;
      } catch {
        // Fall back to clipboard copy if share sheet dismissed or unavailable
      }
    }
    await handleCopyLink();
  };

  const handleCopySlipText = async () => {
    try {
      await navigator.clipboard.writeText(formattedNoticeBlock);
      setCopiedSlip(true);
      window.setTimeout(() => setCopiedSlip(false), 2200);
    } catch {
      setCopiedSlip(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'mini-project-qr-code.png';
    link.click();
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <section
      id="share"
      className="py-16 border-t border-emerald-200/80 bg-gradient-to-br from-emerald-100/80 via-teal-50/90 to-sky-100/85 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-10 no-print">
          <p className="text-xs font-medium text-slate-600 mb-2">
            04. Project Publication · Public Link & Printable QR Notice Slip
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 text-balance">
            Shareable Website Link & QR Code
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Anyone who opens this public link or scans the QR code will view
            this complete mini project website, interactive simulator, field
            photos, and team details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Printable Project Notice Slip */}
          <div className="lg:col-span-7">
            <div className="print-only-slip rounded-xl border-2 border-slate-900 bg-white p-8 md:p-10 shadow-sm">
              <div className="border-b border-dashed border-slate-400 pb-4 mb-6 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold tracking-wider text-slate-900">
                  MINI PROJECT
                </span>
                <span className="font-mono text-xs text-slate-500">
                  WEB PUBLICATION NOTICE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-8 space-y-4">
                  <div>
                    <div className="font-mono text-xs font-semibold text-slate-500 mb-1">
                      TITLE:
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-slate-900 leading-snug">
                      {PROJECT_TITLE}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    The Mini Project has been published separately as a web page.
                  </p>

                  <div>
                    <div className="font-mono text-xs font-semibold text-slate-500 mb-1">
                      Website Link:
                    </div>
                    <a
                      href={activeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs md:text-sm text-sky-700 hover:text-sky-800 underline break-all"
                    >
                      <span>{activeLink}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 no-print" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-600 pt-1">
                    Scan QR Code or click the above link to view the complete
                    project.
                  </p>
                </div>

                {/* Real Scannable QR Code */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center">
                  <div className="p-2.5 bg-white border border-slate-300 rounded-lg">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Scannable QR code linking to the Automatic Plant Watering System mini project webpage"
                        className="w-36 h-36 object-contain"
                      />
                    ) : (
                      <div className="w-36 h-36 bg-slate-100 flex items-center justify-center text-xs text-slate-500">
                        Generating QR
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 mt-2">
                    Scan to Open Project
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-400 pt-4 mt-6 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Arduino Uno R3 · Soil Moisture Sensor · 5V Relay</span>
                <span>3rd Year AIML · A Section</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Share Link & Export Actions */}
          <div className="lg:col-span-5 rounded-xl border border-emerald-200 bg-white p-6 space-y-5 no-print">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Share & Export Project Link
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Copy or share this public link with classmates, faculty guides,
                or embed the QR code in your report.
              </p>
            </div>

            <div className="space-y-3">
              {/* Segmented Link Mode Switch */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setLinkMode('public');
                    setHasCustomInput(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    linkMode === 'public'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Public Share Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkMode('current');
                    setHasCustomInput(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    linkMode === 'current'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Current Page Link
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor="project-url-input"
                  className="text-xs font-medium text-slate-700"
                >
                  Website Link
                </label>
                {hasCustomInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setHasCustomInput(false);
                      setWebsiteLink(recommendedShareUrl);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-sky-700 hover:text-sky-800 font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Link
                  </button>
                )}
              </div>
              <input
                id="project-url-input"
                type="url"
                value={websiteLink}
                onChange={(e) => {
                  setHasCustomInput(true);
                  setWebsiteLink(e.target.value);
                }}
                placeholder="https://your-link.com"
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Note: Publish/share the app from your workspace toolbar before
                opening the Public Share Link on another device, or switch to
                Current Page Link to test immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Link Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Website Link
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                {sharedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Shared
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" /> Share to Others
                  </>
                )}
              </button>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" /> Share
                via WhatsApp
              </a>

              <a
                href={activeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-700" /> Open
                Shared Site
              </a>

              <button
                type="button"
                onClick={handleCopySlipText}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedSlip ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Text Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Report Text
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download QR (PNG)
              </button>

              <button
                type="button"
                onClick={handlePrintSlip}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Notice Slip
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
