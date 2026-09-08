import { useState } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { PLANET_META, type PlanetKey } from "@/lib/astro/data";
import type { DashaPeriod, Kundli } from "@/lib/astro/kundli";
import { Badge } from "@/components/ui/badge";

const fmt = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function Row({ p, now }: { p: DashaPeriod; now: Date }) {
  const [open, setOpen] = useState(false);
  const active = now >= p.start && now < p.end;
  const meta = PLANET_META[p.lord as PlanetKey];
  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        active ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card"
      }`}
    >
      <button
        className="flex w-full flex-wrap items-center gap-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
            active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"
          }`}
        >
          {meta.short}
        </span>
        <span className="font-display text-base font-semibold text-foreground">
          {p.lord} <span className="font-devanagari text-sm text-muted-foreground">{meta.hi}</span>
        </span>
        <span className="text-sm text-muted-foreground">
          {fmt(p.start)} → {fmt(p.end)}
        </span>
        {active && <Badge>Running now</Badge>}
        <ChevronDown
          className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && p.antar && (
        <div className="mt-3 border-l-2 border-primary/20 pl-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Antar-dasha (sub-periods)
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {p.antar.map((a) => {
              const aActive = now >= a.start && now < a.end;
              return (
                <li
                  key={a.lord}
                  className={`rounded-md border px-3 py-2 text-xs ${
                    aActive
                      ? "border-primary/50 bg-primary/5 text-primary"
                      : "border-border/40 text-muted-foreground"
                  }`}
                >
                  <span className="font-medium">{p.lord} / {a.lord}</span>
                  <br />
                  {fmt(a.start)} → {fmt(a.end)}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {open && (
        <div className="mt-3 rounded-md border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-foreground/85">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground">
            <Clock className="mr-1 inline h-3 w-3" />Theme & Remedies
          </p>
          {`During ${p.lord} Maha Dasha the life theme is ${meta.signifies.toLowerCase()}.`}
          <br />
          <span className="mt-1 inline-block">
            Suggested support: {meta.day} fast, mantra{" "}
            <span className="font-devanagari">{meta.beej}</span>, charity of {meta.charity.toLowerCase()}.
          </span>
        </div>
      )}
    </div>
  );
}

export function DashaPanel({ k }: { k: Kundli }) {
  const now = new Date();
  return (
    <section className="panel p-5 sm:p-6">
      <h3 className="font-display text-xl font-semibold text-primary">Vimshottari Dasha</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Calculated from the Moon&apos;s nakshatra balance at birth. 120-year cycle with antar-dasha sub-periods.
      </p>
      <div className="mt-5 space-y-3">
        {k.dashas.map((p) => (
          <Row key={p.lord + p.start.toISOString()} p={p} now={now} />
        ))}
      </div>
    </section>
  );
}
