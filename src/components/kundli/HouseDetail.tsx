import { Sparkles, AlertTriangle } from "lucide-react";
import { analyzeHouse } from "@/lib/astro/houseAnalysis";
import { SIGNS } from "@/lib/astro/data";
import type { Kundli } from "@/lib/astro/kundli";
import {
  CollapsibleSection,
  QuickInsight,
  StrengthIndicator,
  FindingBadge,
} from "./ReportPrimitives";

export function HouseDetail({ k, house }: { k: Kundli; house: number }) {
  const a = analyzeHouse(k, house);
  const isStrong = a.score >= 58;

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-semibold text-primary">
          Bhav {a.house} — {a.title}
        </h3>
        <span className="font-devanagari text-sm text-muted-foreground">{a.hi}</span>
      </div>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
        {SIGNS[a.sign].en} ({SIGNS[a.sign].hi}) · swami {a.lord}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {isStrong ? (
          <FindingBadge icon={<Sparkles className="h-3 w-3" />} label={a.grade} tone="positive" />
        ) : a.score >= 32 ? (
          <FindingBadge icon={<Sparkles className="h-3 w-3" />} label={a.grade} tone="highlight" />
        ) : (
          <FindingBadge icon={<AlertTriangle className="h-3 w-3" />} label={a.grade} tone="caution" />
        )}
      </div>

      <div className="mt-4 rounded-lg border border-border/50 bg-secondary/20 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">{a.grade}</span>
          <span className="text-muted-foreground">{a.score}%</span>
        </div>
        <div className="mt-2">
          <StrengthIndicator value={a.score} />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">{a.verdict}</p>
      </div>

      <div className="mt-4">
        <QuickInsight>
          {a.sections[0]?.lines[0] ?? `House ${a.house} analysis.`}
        </QuickInsight>
      </div>

      <div className="mt-5 space-y-4">
        {a.sections.map((s, idx) => (
          <div key={s.title}>
            {idx < 2 ? (
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary/80">{s.title}</h4>
                <ul className="grid gap-2">
                  {s.lines.map((l, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <CollapsibleSection title={s.title}>
                <ul className="grid gap-2">
                  {s.lines.map((l, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}
          </div>
        ))}
      </div>

      {a.links.length > 0 && (
        <div className="mt-5 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
          <h4 className="text-sm font-semibold text-primary">Interconnections — kyun ho raha hai</h4>
          <ul className="mt-2 grid gap-1.5 text-sm text-foreground/80">
            {a.links.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary/50">•</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
