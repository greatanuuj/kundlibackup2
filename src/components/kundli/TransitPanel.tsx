import { useMemo, useState } from "react";
import { computeTransits } from "@/lib/astro/transit";
import { PLANET_META, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli } from "@/lib/astro/kundli";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const toneClass = {
  good: "text-emerald-500",
  mixed: "text-muted-foreground",
  hard: "text-destructive",
} as const;

export function TransitPanel({ k }: { k: Kundli }) {
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const report = useMemo(() => {
    const [y, m, d] = day.split("-").map(Number);
    const when = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 6, 30));
    return computeTransits(k, isNaN(when.getTime()) ? new Date() : when);
  }, [k, day]);

  return (
    <div className="space-y-6">
      <section className="panel flex flex-wrap items-end justify-between gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-primary">Gochar (Transits)</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Live planetary positions judged from your natal Moon (Chandra gochar) and Lagna.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gochar-date">Date</Label>
          <Input
            id="gochar-date"
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-44"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <h4 className="font-display text-lg font-semibold text-primary">Shani — Sade Sati</h4>
          <p className="mt-1 text-sm">
            <span className="text-muted-foreground">Status: </span>
            {report.sadeSati.phase}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{report.sadeSati.note}</p>
        </section>
        <section className="panel p-5">
          <h4 className="font-display text-lg font-semibold text-primary">Guru — Jupiter transit</h4>
          <p className="mt-1 text-sm">
            <span className="text-muted-foreground">House from Moon: </span>
            {report.jupiter.house}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{report.jupiter.note}</p>
        </section>
      </div>

      <section className="panel overflow-x-auto p-5">
        <h4 className="font-display text-lg font-semibold text-primary">Current positions</h4>
        <table className="mt-4 w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="pb-2">Graha</th>
              <th className="pb-2">Sign</th>
              <th className="pb-2">Degree</th>
              <th className="pb-2">From Moon</th>
              <th className="pb-2">From Lagna</th>
              <th className="pb-2">Effect</th>
            </tr>
          </thead>
          <tbody>
            {report.planets.map((p) => (
              <tr key={p.key} className="border-t border-border/60">
                <td className="py-2 font-medium">
                  {p.key} <span className="font-devanagari text-muted-foreground">{PLANET_META[p.key].hi}</span>
                  {p.retrograde && <span className="ml-1 text-xs text-destructive">℞</span>}
                </td>
                <td className="py-2">
                  {SIGNS[p.sign].en} <span className="font-devanagari text-muted-foreground">{SIGNS[p.sign].hi}</span>
                </td>
                <td className="py-2">{formatDegree(p.degreeInSign)}</td>
                <td className="py-2">{p.fromMoon}</td>
                <td className="py-2">{p.fromLagna}</td>
                <td className={`py-2 capitalize ${toneClass[p.effect]}`}>{p.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {report.highlights.length > 0 && (
        <section className="panel p-5">
          <h4 className="font-display text-lg font-semibold text-primary">What matters now</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {report.highlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
