import { analyzeHouse } from "@/lib/astro/houseAnalysis";
import { SIGNS } from "@/lib/astro/data";
import type { Kundli } from "@/lib/astro/kundli";

export function HouseDetail({ k, house }: { k: Kundli; house: number }) {
  const a = analyzeHouse(k, house);
  return (
    <section className="panel p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-semibold text-primary">
          Bhav {a.house} — {a.title}
        </h3>
        <span className="font-devanagari text-sm text-muted-foreground">{a.hi}</span>
      </header>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
        {SIGNS[a.sign].en} ({SIGNS[a.sign].hi}) · swami {a.lord}
      </p>

      <div className="mt-4 rounded-md border border-border p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{a.grade}</span>
          <span className="text-muted-foreground">{a.score}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${a.score}%` }} />
        </div>
        <p className="mt-3 text-sm text-foreground/90">{a.verdict}</p>
      </div>

      <div className="mt-5 space-y-5">
        {a.sections.map((s) => (
          <div key={s.title}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary/90">{s.title}</h4>
            <ul className="mt-2 grid gap-2">
              {s.lines.map((l, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {a.links.length > 0 && (
        <div className="mt-5 rounded-md border border-dashed border-border p-4">
          <h4 className="text-sm font-semibold text-primary">Interconnections — kyun ho raha hai</h4>
          <ul className="mt-2 grid gap-1.5 text-sm text-foreground/85">
            {a.links.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
