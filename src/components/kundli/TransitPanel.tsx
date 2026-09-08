import { useMemo, useState } from "react";
import { computeTransits } from "@/lib/astro/transit";
import { PLANET_META, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli } from "@/lib/astro/kundli";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QuickInsight, InfoRow } from "./ReportPrimitives";

const toneClass = {
  good: "text-success",
  mixed: "text-muted-foreground",
  hard: "text-destructive",
} as const;

const toneBadge = {
  good: "border-success/30 bg-success/8 text-success",
  mixed: "border-border bg-secondary/50 text-muted-foreground",
  hard: "border-destructive/30 bg-destructive/8 text-destructive",
} as const;

export function TransitPanel({ k }: { k: Kundli }) {
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const report = useMemo(() => {
    const [y, m, d] = day.split("-").map(Number);
    const when = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 6, 30));
    return computeTransits(k, isNaN(when.getTime()) ? new Date() : when);
  }, [k, day]);

  return (
    <div className="grid gap-5">
      <section className="panel flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-primary">Gochar (Transits)</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Live planetary positions judged from your natal Moon (Chandra gochar) and Lagna.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gochar-date" className="text-xs uppercase tracking-wider">Date</Label>
          <Input
            id="gochar-date"
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-44"
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel p-5 sm:p-6">
          <h4 className="font-display text-lg font-semibold text-primary">Shani — Sade Sati</h4>
          <div className="mt-3">
            <Badge variant="outline" className={report.sadeSati.phase === "Not active" ? "border-success/30 bg-success/8 text-success" : "border-saffron/30 bg-saffron/8 text-saffron"}>
              {report.sadeSati.phase}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{report.sadeSati.note}</p>
        </section>
        <section className="panel p-5 sm:p-6">
          <h4 className="font-display text-lg font-semibold text-primary">Guru — Jupiter Transit</h4>
          <div className="mt-3">
            <InfoRow label="House from Moon" value={report.jupiter.house} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{report.jupiter.note}</p>
        </section>
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-border/50 p-5">
          <h4 className="font-display text-lg font-semibold text-primary">Current Positions</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-5 pb-2">Graha</th>
                <th className="px-5 pb-2">Sign</th>
                <th className="px-5 pb-2">Degree</th>
                <th className="px-5 pb-2">From Moon</th>
                <th className="px-5 pb-2">From Lagna</th>
                <th className="px-5 pb-2">Effect</th>
              </tr>
            </thead>
            <tbody>
              {report.planets.map((p) => (
                <tr key={p.key} className="border-t border-border/40">
                  <td className="px-5 py-3 font-medium">
                    <span className="flex items-center gap-2">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                        PLANET_META[p.key].nature === "Benefic" ? "bg-success/15 text-success"
                        : PLANET_META[p.key].nature === "Malefic" ? "bg-saffron/15 text-saffron"
                        : "bg-primary/10 text-primary"
                      }`}>
                        {PLANET_META[p.key].short}
                      </span>
                      {p.key}
                      {p.retrograde && <span className="text-xs text-destructive">℞</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3">{SIGNS[p.sign].en} <span className="font-devanagari text-muted-foreground">{SIGNS[p.sign].hi}</span></td>
                  <td className="px-5 py-3">{formatDegree(p.degreeInSign)}</td>
                  <td className="px-5 py-3">{p.fromMoon}</td>
                  <td className="px-5 py-3">{p.fromLagna}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneBadge[p.effect]}`}>
                      {p.effect}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {report.highlights.length > 0 && (
        <section className="panel p-5 sm:p-6">
          <h4 className="font-display text-lg font-semibold text-primary">What Matters Now</h4>
          <div className="mt-4">
            <QuickInsight>
              {report.highlights[0]}
            </QuickInsight>
          </div>
          {report.highlights.length > 1 && (
            <ul className="mt-4 grid gap-2 text-sm text-foreground/80">
              {report.highlights.slice(1).map((h, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
