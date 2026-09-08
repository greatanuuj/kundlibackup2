import { Sparkles, AlertTriangle, BookOpen } from "lucide-react";
import { buildLalKitab, LK_HOUSE_TITLE } from "@/lib/astro/lalkitab";
import { ChartDiagram } from "@/components/kundli/ChartDiagram";
import { SIGNS } from "@/lib/astro/data";
import type { Kundli } from "@/lib/astro/kundli";
import { Badge } from "@/components/ui/badge";
import { CollapsibleSection, QuickInsight } from "./ReportPrimitives";

export function LalKitabPanel({ k }: { k: Kundli }) {
  const lk = buildLalKitab(k);
  const active = lk.rin.filter((r) => r.present);

  return (
    <div className="grid gap-5">
      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gold" />
          <h3 className="font-display text-xl font-semibold text-primary">Lal Kitab Teva</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Lal Kitab uses fixed (pakke) ghar — House 1 is always Mesh. Results can differ from Vedic.
        </p>
        <div className="mt-4">
          <QuickInsight>
            {active.length
              ? `${active.length} karmic rin (debt) active — address these first for maximum relief.`
              : "No karmic debts active — your Lal Kitab chart is relatively clear."}
          </QuickInsight>
        </div>
        <ul className="mt-4 grid gap-2 text-sm">
          {[...lk.summary, ...lk.teva].map((l, i) => (
            <li key={i} className="flex gap-2 leading-relaxed text-foreground/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartDiagram
          ascSign={0}
          placements={k.planets.map((p) => ({ key: p.key, sign: p.sign, retro: p.retrograde }))}
          title="Lal Kitab Kundli (pakke ghar)"
          subtitle="Ghar 1 hamesha Mesh — Lal Kitab paddhati"
        />
        <section className="panel p-5">
          <h3 className="font-display text-lg font-semibold text-primary">Ghar-wise Graha</h3>
          <ul className="mt-4 grid gap-2 text-sm">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
              const here = lk.planets.filter((p) => p.lkHouse === h);
              return (
                <li key={h} className="rounded-lg border border-border/50 bg-secondary/15 px-3 py-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {LK_HOUSE_TITLE(h)}
                  </p>
                  <p className="mt-1 font-medium text-foreground/90">
                    {here.length ? here.map((p) => p.key).join(", ") : "khaali"}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="panel p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-primary">Graha ka Phal aur Sthiti</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {lk.planets.map((p) => (
            <div key={p.key} className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-display text-base font-semibold text-primary">
                  {p.key} — Ghar {p.lkHouse}
                </h4>
                <Badge variant="outline" className="text-xs">{p.state}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{SIGNS[p.sign].en} · Vedic bhav {p.vedicHouse}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{p.effect}</p>
              <p className="mt-2 text-xs text-muted-foreground">{p.stateWhy}</p>
              <div className="mt-3 rounded-md border border-gold/20 bg-gold/5 px-3 py-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground">Upay</p>
                <ul className="grid gap-1 text-sm text-foreground/80">
                  {p.upay.map((u, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gold/60">•</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-display text-xl font-semibold text-primary">Lal Kitab Rin (Karmic Debts)</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {active.length ? `${active.length} rin sakriya hain — inke upay sabse pehle karein.` : "Koi rin sakriya nahi mila."}
        </p>
        <div className="mt-4 grid gap-3">
          {lk.rin.map((r) => (
            <div
              key={r.name}
              className={`rounded-lg border p-4 ${r.present ? "border-destructive/25 bg-destructive/5" : "border-border/50 bg-card"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display text-base font-semibold text-foreground">{r.name}</h4>
                <Badge variant={r.present ? "destructive" : "secondary"}>
                  {r.present ? "Present" : "Not present"}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{r.reason}</p>
              {r.present && (
                <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
                  <span className="font-medium text-primary">Upay: </span>
                  {r.upay}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
