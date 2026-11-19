import { DEFAULT_TEAM_DETAILS, TeamDetailsData } from '../data/projectData';

export const TEAM_STORAGE_KEY = 'hydrouno_team_details_v4';

export function encodeTeamDetailsParam(team: TeamDetailsData): string {
  try {
    if (JSON.stringify(team) === JSON.stringify(DEFAULT_TEAM_DETAILS)) {
      return '';
    }
    const json = JSON.stringify(team);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

export function decodeTeamDetailsParam(encoded: string): TeamDetailsData | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const base64 = padded + '='.repeat(padLen);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as TeamDetailsData;
    if (parsed && Array.isArray(parsed.members) && parsed.collegeName) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function loadInitialTeamDetails(): TeamDetailsData {
  if (typeof window === 'undefined') return DEFAULT_TEAM_DETAILS;

  try {
    const params = new URLSearchParams(window.location.search);
    const td = params.get('td');
    if (td) {
      const decoded = decodeTeamDetailsParam(td);
      if (decoded) return decoded;
    }
  } catch {
    // Ignore URL parse error
  }

  try {
    const saved = window.localStorage.getItem(TEAM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as TeamDetailsData;
    }
  } catch {
    // Ignore localStorage error
  }

  return DEFAULT_TEAM_DETAILS;
}

export function getPublicShareBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://your-link.com';
  const rawOrigin = window.location.origin.replace('://ais-dev-', '://ais-pre-');
  const cleanPath = window.location.pathname.replace(/\/$/, '');
  return `${rawOrigin}${cleanPath}`;
}

export function getCurrentWindowBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://your-link.com';
  const cleanPath = window.location.pathname.replace(/\/$/, '');
  return `${window.location.origin}${cleanPath}`;
}
