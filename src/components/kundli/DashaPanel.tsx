import { useState } from "react";
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
    <div className={`rounded-md border p-4 ${active ? "border-primary/60 bg-primary/5" : "border-border"}`}>
      <button className="flex w-full flex-wrap items-center gap-3 text-left" onClick={() => setOpen(!open)}>
        <span className="w-28 font-display text-base font-semibold">
          {p.lord} <span className="font-devanagari text-muted-foreground">{meta.hi}</span>
        </span>
        <span className="text-sm text-muted-foreground">
          {fmt(p.start)} → {fmt(p.end)}
        </span>
        {active && <Badge>Running now</Badge>}
        <span className="ml-auto text-xs text-muted-foreground">
          {open ? "hide antar-dasha" : "show antar-dasha"}
        </span>
      </button>
      {open && p.antar && (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {p.antar.map((a) => {
            const aActive = now >= a.start && now < a.end;
            return (
              <li
                key={a.lord}
                className={`rounded border px-3 py-2 text-xs ${aActive ? "border-primary/60 text-primary" : "border-border text-muted-foreground"}`}
              >
                {p.lord} / {a.lord} · {fmt(a.start)} → {fmt(a.end)}
              </li>
            );
          })}
        </ul>
      )}
      {open && (
        <p className="mt-3 text-sm text-foreground/85">
          {`During ${p.lord} Maha Dasha the life theme is ${meta.signifies.toLowerCase()}. Suggested support: ${meta.day} fast, mantra `}
          <span className="font-devanagari">{meta.beej}</span>
          {`, charity of ${meta.charity.toLowerCase()}.`}
        </p>
      )}
    </div>
  );
}

export function DashaPanel({ k }: { k: Kundli }) {
  const now = new Date();
  return (
    <section className="panel p-5">
      <h3 className="text-lg font-semibold text-primary">Vimshottari Dasha — 120 year cycle</h3>
      <p className="text-xs text-muted-foreground">
        Calculated from the Moon&apos;s nakshatra balance at birth. Antar-dasha (sub-periods) inside each.
      </p>
      <div className="mt-4 space-y-3">
        {k.dashas.map((p) => (
          <Row key={p.lord + p.start.toISOString()} p={p} now={now} />
        ))}
      </div>
    </section>
  );
}
