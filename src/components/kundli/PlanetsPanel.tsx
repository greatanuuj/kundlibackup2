import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAKSHATRAS, PLANET_META, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli, type PlanetPosition } from "@/lib/astro/kundli";
import { Badge } from "@/components/ui/badge";
import { StrengthIndicator, InfoRow } from "./ReportPrimitives";

function PlanetDetail({ p }: { p: PlanetPosition }) {
  const m = PLANET_META[p.key];
  return (
    <div className="mt-3 grid gap-4 rounded-lg border border-border/50 bg-secondary/15 p-4 sm:grid-cols-2">
      <div className="space-y-1">
        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">Significations</h5>
        <InfoRow label="Signifies" value={m.signifies} />
        <InfoRow label="Body parts" value={m.body} />
        <InfoRow label="Career" value={m.career} />
        <InfoRow label="Nature" value={m.nature} />
        <InfoRow label="Deity" value={m.deity} />
      </div>
      <div className="space-y-1">
        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">Strength & Remedies</h5>
        <InfoRow label="Dignity" value={p.dignity} />
        <InfoRow
          label="Why"
          value={
            `${p.dignity}${
              [1, 4, 7, 10].includes(p.house) ? ", kendra adds power" : [6, 8, 12].includes(p.house) ? ", dusthana reduces ease" : ""
            }${p.retrograde ? ", retrograde intensifies" : ""}${p.combust ? ", combust weakens" : ""}.`
          }
        />
        <InfoRow label="Gemstone" value={m.gem} />
        <InfoRow label="Mantra" value={<span className="font-devanagari">{m.mantra}</span>} />
        <InfoRow label="Beej" value={<span className="font-devanagari">{m.beej}</span>} />
        <InfoRow label="Day / Charity" value={`${m.day} · ${m.charity}`} />
        <InfoRow label="Rudraksha" value={m.rudraksha} />
      </div>
    </div>
  );
}

export function PlanetsPanel({ k }: { k: Kundli }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-border/50 p-5">
        <h3 className="font-display text-xl font-semibold text-primary">Graha Positions & Strength</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Sidereal (Lahiri ayanamsa {formatDegree(k.ayanamsa)}). Tap a planet for full analysis.
        </p>
      </div>
      <div className="divide-y divide-border/40">
        {k.planets.map((p) => {
          const m = PLANET_META[p.key];
          const isOpen = open === p.key;
          return (
            <div key={p.key} className="p-4 sm:px-5">
              <button
                className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-left"
                onClick={() => setOpen(isOpen ? null : p.key)}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                      m.nature === "Benefic"
                        ? "bg-success/15 text-success"
                        : m.nature === "Malefic"
                          ? "bg-saffron/15 text-saffron"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    {m.short}
                  </span>
                  <span className="font-display text-base font-semibold text-foreground">
                    {p.key}
                  </span>
                  <span className="font-devanagari text-sm text-muted-foreground">{m.hi}</span>
                </span>
                <span className="text-sm text-foreground/80">
                  {SIGNS[p.sign].en} {formatDegree(p.degreeInSign)}
                </span>
                <Badge variant="outline">H{p.house}</Badge>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {NAKSHATRAS[p.nakshatra].en} · p{p.pada}
                </span>
                {p.retrograde && <Badge variant="secondary">Retro</Badge>}
                {p.combust && <Badge variant="secondary">Combust</Badge>}
                <span className="ml-auto">
                  <StrengthIndicator value={p.strength} />
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <PlanetDetail p={p} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
