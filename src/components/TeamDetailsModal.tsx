import React, { useEffect, useState } from 'react';
import {
  Check,
  Edit3,
  Mail,
  MapPin,
  RotateCcw,
  User,
  Users,
  X,
} from 'lucide-react';
import {
  DEFAULT_TEAM_DETAILS,
  FIELD_PHOTOS,
  PROJECT_TITLE,
  TEAM_PHOTO_OPTIONS,
  TeamDetailsData,
} from '../data/projectData';
import { TEAM_STORAGE_KEY } from '../utils/teamShare';

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamDetailsData;
  onUpdateTeam: (nextTeam: TeamDetailsData) => void;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  isOpen,
  onClose,
  team,
  onUpdateTeam,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<TeamDetailsData>(team);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDraft(team);
  }, [team]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartEdit = () => {
    setDraft(team);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeam(draft);
    try {
      window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage quota issues
    }
    setIsEditing(false);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetDefault = () => {
    onUpdateTeam(DEFAULT_TEAM_DETAILS);
    setDraft(DEFAULT_TEAM_DETAILS);
    try {
      window.localStorage.removeItem(TEAM_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setIsEditing(false);
  };

  const updateMemberField = (
    idx: number,
    field: 'tag' | 'name' | 'rollNo' | 'classSection' | 'role' | 'photo',
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      members: prev.members.map((m, i) =>
        i === idx ? { ...m, [field]: value } : m
      ),
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-emerald-200 bg-white shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-emerald-200 flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-emerald-300 shrink-0" />
            <div>
              <h2
                id="team-modal-title"
                className="text-lg font-semibold text-white"
              >
                Mini Project Team Details
              </h2>
              <p className="text-xs text-emerald-100">
                {team.collegeName} · {team.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-300/40 bg-emerald-950/40 text-white hover:bg-emerald-950/70 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Details
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close team details"
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-emerald-50/40">
          {savedNotice && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600" />
              Team details saved and synced with your shareable link.
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    College / Institution Name
                  </label>
                  <input
                    type="text"
                    value={draft.collegeName}
                    onChange={(e) =>
                      setDraft({ ...draft, collegeName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department / Year / Section
                  </label>
                  <input
                    type="text"
                    value={draft.department}
                    onChange={(e) =>
                      setDraft({ ...draft, department: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Faculty Guide / Supervisor
                  </label>
                  <input
                    type="text"
                    value={draft.guideName}
                    onChange={(e) =>
                      setDraft({ ...draft, guideName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={draft.contactEmail}
                    onChange={(e) =>
                      setDraft({ ...draft, contactEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-800">
                  Team Members (One by One)
                </div>
                <div className="space-y-3">
                  {draft.members.map((member, idx) => (
                    <div
                      key={member.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                    >
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          updateMemberField(idx, 'name', e.target.value)
                        }
                        placeholder="Student Full Name"
                        className="w-full px-2.5 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={member.rollNo}
                        onChange={(e) =>
                          updateMemberField(idx, 'rollNo', e.target.value)
                        }
                        placeholder="Roll Number"
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={member.classSection}
                        onChange={(e) =>
                          updateMemberField(idx, 'classSection', e.target.value)
                        }
                        placeholder="Year, Branch & Section"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                      <select
                        value={member.photo}
                        onChange={(e) =>
                          updateMemberField(idx, 'photo', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      >
                        {TEAM_PHOTO_OPTIONS.map((opt) => (
                          <option key={opt.src} value={opt.src}>
                            Photo: {opt.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) =>
                          updateMemberField(idx, 'role', e.target.value)
                        }
                        placeholder="Project Contribution"
                        className="sm:col-span-2 w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer"
                  >
                    Save Team Details
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <>
              {/* One-by-One Team Members Roster with Individual Photos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Team Members (One by One)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {team.members.length} Members
                  </span>
                </div>

                <div className="space-y-4">
                  {team.members.map((member) => {
                    const photoBroken = failedPhotos[member.id];
                    return (
                      <div
                        key={member.id}
                        className="rounded-xl border border-emerald-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                      >
                        {/* Member Portrait Photo */}
                        <div className="w-28 h-32 sm:w-32 sm:h-36 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0">
                          {!photoBroken && member.photo ? (
                            <img
                              src={member.photo}
                              alt={`${member.name} portrait`}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setFailedPhotos((prev) => ({
                                  ...prev,
                                  [member.id]: true,
                                }))
                              }
                              className={`w-full h-full object-cover ${member.photoPosition ?? 'object-top'}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <User className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Member Details */}
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                            <span>{member.tag}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">
                              Roll No: {member.rollNo}
                            </span>
                          </div>
                          <h4 className="font-display text-lg font-bold text-slate-900">
                            {member.name}
                          </h4>
                          <div className="text-sm font-medium text-slate-700">
                            {member.classSection}
                          </div>
                          <p className="text-xs text-slate-600 pt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group Photo & Institution Info */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-5 rounded-lg border border-slate-200 overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src={FIELD_PHOTOS[1].src}
                    alt="Mini project student team holding nursery plants"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="md:col-span-7 space-y-2.5">
                  <div className="text-xs font-mono text-slate-500">
                    INSTITUTION & PROJECT INFO
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {PROJECT_TITLE}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="font-medium text-slate-800">
                      {team.collegeName}
                    </div>
                    <div>{team.department}</div>
                    <div>Academic Year: {team.academicYear}</div>
                    <div>Guided by: {team.guideName}</div>
                  </div>
                  <div className="pt-1 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{team.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`mailto:${team.contactEmail}`}
                        className="text-sky-700 hover:underline break-all"
                      >
                        {team.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
