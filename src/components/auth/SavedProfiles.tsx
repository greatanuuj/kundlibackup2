import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import {
  deleteProfile,
  loadSavedProfiles,
  type SavedProfile,
} from "@/lib/savedProfiles";

export function SavedProfiles({
  onOpen,
  refreshKey,
}: {
  onOpen: (profile: SavedProfile) => void;
  refreshKey?: number;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);

  useEffect(() => {
    if (isSignedIn && user) setProfiles(loadSavedProfiles(user.id));
    else setProfiles([]);
  }, [isSignedIn, user, refreshKey]);

  if (!isLoaded || !isSignedIn || !user) return null;

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">Meri Saved Kundli</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Apni details ek baar save karein — agli baar sirf Open dabayein.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          {profiles.length} saved
        </span>
      </div>

      {profiles.length === 0 ? (
        <p className="mt-5 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          Abhi koi Kundli saved nahi hai. Details bhar kar chart generate karein, phir “Save this
          Kundli” dabayein.
        </p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{profile.input.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile.input.date} · {profile.input.time} · {profile.input.place}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" onClick={() => onOpen(profile)}>
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setProfiles(deleteProfile(user.id, profile.id))}
                  aria-label={`Delete ${profile.input.name}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}