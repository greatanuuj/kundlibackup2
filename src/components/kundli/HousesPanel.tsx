import { HOUSES, PLANET_META, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli } from "@/lib/astro/kundli";

export function HousesPanel({ k, focus }: { k: Kundli; focus?: number | null }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {k.houseLords.map((h) => {
        const info = HOUSES[h.house - 1];
        const occupants = k.planets.filter((p) => p.house === h.house);
        const highlight = focus === h.house;
        return (
          <section
            key={h.house}
            className={`panel p-5 ${highlight ? "gold-ring" : ""}`}
            id={`house-${h.house}`}
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
            <p className="mt-3 text-sm">
              <span className="text-muted-foreground">Occupants: </span>
              {occupants.length
                ? occupants
                    .map((p) => `${p.key} ${formatDegree(p.degreeInSign)} (${p.strength}%)`)
                    .join(", ")
                : "empty — results flow mainly through the house lord"}
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              {`Because ${h.lord} rules this house and occupies house ${h.lordHouse}, matters of ${info.title.toLowerCase()} get linked with ${HOUSES[h.lordHouse - 1].title.toLowerCase()}. ${PLANET_META[h.lord].signifies.split(",")[0]} colours the outcome.`}
            </p>
          </section>
        );
      })}
    </div>
  );
}
