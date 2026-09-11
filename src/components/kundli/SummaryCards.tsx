import { NAKSHATRAS, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli } from "@/lib/astro/kundli";

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="panel p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-primary">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function SummaryCards({ k }: { k: Kundli }) {
  const moon = k.planets[1];
  const dashaLord = k.currentDasha?.maha.lord ?? "—";
  const antar = k.currentDasha?.antar.lord ?? "—";
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        label="Lagna (Ascendant)"
        value={`${SIGNS[k.ascendant.sign].en} · ${SIGNS[k.ascendant.sign].hi}`}
        sub={`${formatDegree(k.ascendant.degreeInSign)} · ${NAKSHATRAS[k.ascendant.nakshatra].en}`}
      />
      <Card
        label="Chandra Rashi (Moon)"
        value={`${SIGNS[k.moonSign].en} · ${SIGNS[k.moonSign].hi}`}
        sub={`Janma Nakshatra: ${NAKSHATRAS[moon.nakshatra].en} pada ${moon.pada}`}
      />
      <Card
        label="Surya Rashi (Sun)"
        value={`${SIGNS[k.sunSign].en} · ${SIGNS[k.sunSign].hi}`}
        sub={`Tithi ${k.panchang.tithi}, ${k.panchang.paksha}`}
      />
      <Card
        label="Running Dasha"
        value={`${dashaLord} / ${antar}`}
        sub={
          k.currentDasha
            ? `until ${k.currentDasha.antar.end.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}`
            : "—"
        }
      />
    </div>
  );
}
