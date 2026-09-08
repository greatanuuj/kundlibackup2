import { useEffect, useState } from "react";
import { HOUSES, PLANET_META, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli } from "@/lib/astro/kundli";
import { HouseDetail } from "@/components/kundli/HouseDetail";
import { Badge } from "@/components/ui/badge";

export function HousesPanel({ k, focus }: { k: Kundli; focus?: number | null }) {
  const [open, setOpen] = useState<number | null>(focus ?? null);
  useEffect(() => {
    if (focus) setOpen(focus);
  }, [focus]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {k.houseLords.map((h) => (
          <button
            key={h.house}
            type="button"
            onClick={() => setOpen(open === h.house ? null : h.house)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              open === h.house
                ? "border-primary bg-primary/10 text-primary gold-ring"
                : "border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-secondary/30"
            }`}
          >
            {h.house}. {HOUSES[h.house - 1].title}
          </button>
        ))}
      </div>

      {open && <HouseDetail k={k} house={open} />}

      <div className="grid gap-4 lg:grid-cols-2">
        {k.houseLords.map((h) => {
          const info = HOUSES[h.house - 1];
          const occupants = k.planets.filter((p) => p.house === h.house);
          const highlight = open === h.house;
          return (
            <section
              key={h.house}
              className={`panel cursor-pointer p-5 transition ${highlight ? "gold-ring" : "hover:border-primary/30"}`}
              id={`house-${h.house}`}
              onClick={() => setOpen(highlight ? null : h.house)}
            >
              <header className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-primary">
                  House {h.house} — {info.title}
                </h3>
                <span className="font-devanagari text-sm text-muted-foreground">{info.hi}</span>
              </header>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {SIGNS[h.sign].en} · lord {h.lord} sits in house {h.lordHouse}
              </p>
              <p className="mt-3 text-sm text-foreground/90">{info.areas}</p>
              <div className="mt-3 rounded-lg border border-border/40 bg-secondary/15 px-3 py-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Occupants: </span>
                  {occupants.length
                    ? occupants.map((p) => (
                        <Badge key={p.key} variant="outline" className="mr-1.5">
                          {p.key} {formatDegree(p.degreeInSign)} ({p.strength}%)
                        </Badge>
                      ))
                    : "empty — results flow through the house lord"}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {`Because ${h.lord} rules this house and occupies house ${h.lordHouse}, matters of ${info.title.toLowerCase()} get linked with ${HOUSES[h.lordHouse - 1].title.toLowerCase()}. ${PLANET_META[h.lord].signifies.split(",")[0]} colours the outcome.`}
              </p>
              <p className="mt-2 text-xs font-medium text-primary/70">Click for full analysis →</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
