import type { BirthInput } from "@/lib/astro/kundli";

export type SavedProfile = {
  id: string;
  input: BirthInput;
  savedAt: string;
};

function storageKey(userId: string) {
  return `kundli-analyzer:saved-profiles:${userId}`;
}

export function loadSavedProfiles(userId: string): SavedProfile[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const profiles = JSON.parse(raw) as SavedProfile[];
    return Array.isArray(profiles) ? profiles : [];
  } catch {
    return [];
  }
}

export function saveProfile(userId: string, input: BirthInput): SavedProfile[] {
  const existing = loadSavedProfiles(userId);
  const sameProfile = existing.find(
    (profile) =>
      profile.input.name === input.name &&
      profile.input.date === input.date &&
      profile.input.time === input.time &&
      profile.input.place === input.place,
  );
  const next = [
    {
      id: sameProfile?.id ?? crypto.randomUUID(),
      input,
      savedAt: new Date().toISOString(),
    },
    ...existing.filter((profile) => profile.id !== sameProfile?.id),
  ];
  window.localStorage.setItem(storageKey(userId), JSON.stringify(next));
  return next;
}

export function deleteProfile(userId: string, profileId: string): SavedProfile[] {
  const next = loadSavedProfiles(userId).filter((profile) => profile.id !== profileId);
  window.localStorage.setItem(storageKey(userId), JSON.stringify(next));
  return next;
}