import { Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Kundli } from "@/lib/astro/kundli";
import { Badge } from "@/components/ui/badge";
import { CollapsibleSection } from "./ReportPrimitives";

export function YogaDoshaPanel({ k }: { k: Kundli }) {
  const activeDoshas = k.doshas.filter((d) => d.present);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold" />
          <h3 className="font-display text-xl font-semibold text-primary">Yogas Detected</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Combinations formed in this chart with their meaning.
        </p>
        <ul className="mt-4 space-y-3">
          {k.yogas.length === 0 && (
            <li className="rounded-lg border border-border/50 bg-secondary/15 px-4 py-3 text-sm text-muted-foreground">
              No major classical yoga formed from the primary rules checked.
            </li>
          )}
          {k.yogas.map((y) => (
            <li
              key={y.name}
              className={`rounded-lg border p-4 ${
                y.type === "good"
                  ? "border-success/25 bg-success/5"
                  : "border-saffron/25 bg-saffron/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <h4 className="font-display text-base font-semibold text-foreground">{y.name}</h4>
                <Badge variant={y.type === "good" ? "default" : "secondary"}>
                  {y.type === "good" ? "Supportive" : "Needs care"}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{y.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-display text-xl font-semibold text-primary">Dosha Analysis</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Presence, reason and the classical remedy for each dosha.
        </p>
        {activeDoshas.length > 0 && (
          <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
            <p className="text-xs font-medium text-destructive">
              {activeDoshas.length} dosha{activeDoshas.length > 1 ? "s" : ""} present — remedies available below.
            </p>
          </div>
        )}
        <ul className="mt-4 space-y-3">
          {k.doshas.map((d) => (
            <li
              key={d.name}
              className={`rounded-lg border p-4 ${
                d.present
                  ? "border-destructive/25 bg-destructive/5"
                  : "border-border/50 bg-card"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display text-base font-semibold text-foreground">{d.name}</h4>
                <Badge variant={d.present ? "destructive" : "secondary"}>
                  {d.present ? `${d.severity}` : "Not present"}
                </Badge>
                {!d.present && <ShieldCheck className="h-4 w-4 text-success" />}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{d.reason}</p>
              {d.present && (
                <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
                  <span className="font-medium text-primary">Remedy: </span>
                  {d.remedy}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
