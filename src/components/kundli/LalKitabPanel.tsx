import { buildLalKitab, LK_HOUSE_TITLE } from "@/lib/astro/lalkitab";
import { ChartDiagram } from "@/components/kundli/ChartDiagram";
import { SIGNS } from "@/lib/astro/data";
import type { Kundli } from "@/lib/astro/kundli";

export function LalKitabPanel({ k }: { k: Kundli }) {
  const lk = buildLalKitab(k);
  const active = lk.rin.filter((r) => r.present);

  return (
    <div className="grid gap-6">
      <section className="panel p-5">
        <h3 className="font-display text-xl font-semibold text-primary">Lal Kitab Teva</h3>
        <ul className="mt-3 grid gap-2 text-sm">
          {[...lk.summary, ...lk.teva].map((l, i) => (
            <li key={i} className="flex gap-2 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartDiagram
          ascSign={0}
          placements={k.planets.map((p) => ({ key: p.key, sign: p.sign, retro: p.retrograde }))}
          title="Lal Kitab Kundli (pakke ghar)"
          subtitle="Ghar 1 hamesha Mesh — Lal Kitab paddhati"
        />
        <section className="panel p-5">
          <h3 className="text-lg font-semibold text-primary">Ghar-wise grah</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
              const here = lk.planets.filter((p) => p.lkHouse === h);
              return (
                <li key={h} className="rounded-md border border-border px-3 py-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {LK_HOUSE_TITLE(h)}
                  </p>
                  <p className="mt-1">{here.length ? here.map((p) => p.key).join(", ") : "khaali"}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-primary">Grah ka phal aur sthiti</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {lk.planets.map((p) => (
            <div key={p.key} className="rounded-md border border-border p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-display text-base font-semibold">
                  {p.key} — ghar {p.lkHouse} ({SIGNS[p.sign].en})
                </h4>
                <span className="text-xs text-muted-foreground">{p.state}</span>
              </div>
              <p className="mt-2 text-sm">{p.effect}</p>
              <p className="mt-2 text-xs text-muted-foreground">{p.stateWhy}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Vedic bhav {p.vedicHouse} — isliye Vedic aur Lal Kitab phal alag dikh sakte hain.
              </p>
              <ul className="mt-2 grid gap-1 text-sm">
                {p.upay.map((u) => (
                  <li key={u}>• {u}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-primary">Lal Kitab Rin (karmic debts)</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {active.length ? `${active.length} rin sakriya hain — inke upay sabse pehle karein.` : "Koi rin sakriya nahi mila."}
        </p>
        <div className="mt-4 grid gap-3">
          {lk.rin.map((r) => (
            <div
              key={r.name}
              className={`rounded-md border p-4 ${r.present ? "border-primary/50 bg-primary/5" : "border-border"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold">{r.name}</h4>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {r.present ? "Present" : "Nahi"}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/85">{r.reason}</p>
              {r.present && <p className="mt-2 text-sm">Upay: {r.upay}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
