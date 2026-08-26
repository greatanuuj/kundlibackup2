import type { Kundli } from "@/lib/astro/kundli";
import { Badge } from "@/components/ui/badge";

export function YogaDoshaPanel({ k }: { k: Kundli }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-primary">Yogas detected</h3>
        <p className="text-xs text-muted-foreground">Combinations formed in this chart with their meaning.</p>
        <ul className="mt-4 space-y-3">
          {k.yogas.length === 0 && (
            <li className="text-sm text-muted-foreground">
              No major classical yoga formed from the primary rules checked.
            </li>
          )}
          {k.yogas.map((y) => (
            <li key={y.name} className="rounded-md border border-border p-4">
              <div className="flex items-center gap-2">
                <h4 className="font-display text-base font-semibold">{y.name}</h4>
                <Badge variant={y.type === "good" ? "default" : "secondary"}>
                  {y.type === "good" ? "Supportive" : "Needs care"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-foreground/85">{y.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-primary">Dosha analysis</h3>
        <p className="text-xs text-muted-foreground">
          Presence, reason and the classical remedy for each dosha.
        </p>
        <ul className="mt-4 space-y-3">
          {k.doshas.map((d) => (
            <li key={d.name} className="rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display text-base font-semibold">{d.name}</h4>
                <Badge variant={d.present ? "destructive" : "secondary"}>
                  {d.present ? `Present · ${d.severity}` : "Not present"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-foreground/85">{d.reason}</p>
              {d.present && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Remedy: </span>
                  {d.remedy}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
