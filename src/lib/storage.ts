import { UserProfile, DrinkingSession } from "@/types";

const PROFILE_KEY = "hangover-timer-profile";
const SESSION_KEY = "hangover-timer-session";

export function saveProfile(profile: UserProfile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function saveSession(session: DrinkingSession) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
}

export function loadSession(): DrinkingSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (!parsed.entries || !parsed.startedAt || !parsed.profile) return null;
    return parsed;
  } catch { return null; }
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}
