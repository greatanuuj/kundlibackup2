import { useState } from "react";
import { NAKSHATRAS, PLANET_META, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli, type PlanetPosition } from "@/lib/astro/kundli";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function StrengthBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={value} className="h-2 w-24" />
      <span className="w-9 text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

function PlanetDetail({ p }: { p: PlanetPosition }) {
  const m = PLANET_META[p.key];
  return (
    <div className="mt-3 grid gap-4 rounded-md border border-border bg-secondary/40 p-4 text-sm sm:grid-cols-2">
      <div className="space-y-2">
        <p>
          <span className="text-muted-foreground">Signifies: </span>
          {m.signifies}
        </p>
        <p>
          <span className="text-muted-foreground">Body parts: </span>
          {m.body}
        </p>
        <p>
          <span className="text-muted-foreground">Career leaning: </span>
          {m.career}
        </p>
        <p>
          <span className="text-muted-foreground">Nature: </span>
          {m.nature} · Deity: {m.deity}
        </p>
      </div>
      <div className="space-y-2">
        <p>
          <span className="text-muted-foreground">Why this strength: </span>
          {p.dignity}
          {[1, 4, 7, 10].includes(p.house)
            ? ", kendra placement adds power"
            : [6, 8, 12].includes(p.house)
              ? ", dusthana placement reduces ease of results"
              : ""}
          {p.retrograde ? ", retrograde intensifies inner effect" : ""}
          {p.combust ? ", combust near the Sun weakens outer expression" : ""}.
        </p>
        <p>
          <span className="text-muted-foreground">Gemstone: </span>
          {m.gem}
        </p>
        <p>
          <span className="text-muted-foreground">Mantra: </span>
          <span className="font-devanagari">{m.mantra}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Fast / charity: </span>
          {m.day} · {m.charity} · {m.rudraksha} Rudraksha
        </p>
      </div>
    </div>
  );
}

export function PlanetsPanel({ k }: { k: Kundli }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-border p-5">
        <h3 className="text-lg font-semibold text-primary">Graha Positions & Strength</h3>
        <p className="text-xs text-muted-foreground">
          Sidereal (Lahiri ayanamsa {formatDegree(k.ayanamsa)}). Click a planet for full analysis.
        </p>
      </div>
      <div className="divide-y divide-border">
        {k.planets.map((p) => {
          const m = PLANET_META[p.key];
          const isOpen = open === p.key;
          return (
            <div key={p.key} className="p-4 sm:px-5">
              <button
                className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-left"
                onClick={() => setOpen(isOpen ? null : p.key)}
              >
                <span className="w-32 font-display text-base font-semibold text-foreground">
                  {p.key} <span className="font-devanagari text-muted-foreground">{m.hi}</span>
                </span>
                <span className="w-40 text-sm">
                  {SIGNS[p.sign].en} {formatDegree(p.degreeInSign)}
                </span>
                <Badge variant="outline">House {p.house}</Badge>
                <span className="w-44 text-xs text-muted-foreground">
                  {NAKSHATRAS[p.nakshatra].en} · pada {p.pada}
                </span>
                <span className="w-40 text-xs text-muted-foreground">{p.dignity}</span>
                {p.retrograde && <Badge variant="secondary">Retrograde</Badge>}
                {p.combust && <Badge variant="secondary">Combust</Badge>}
                <span className="ml-auto">
                  <StrengthBar value={p.strength} />
                </span>
              </button>
              {isOpen && <PlanetDetail p={p} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
