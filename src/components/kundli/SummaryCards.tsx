import { Sun, Moon, Star, Clock } from "lucide-react";
import { NAKSHATRAS, SIGNS } from "@/lib/astro/data";
import { formatDegree, type Kundli } from "@/lib/astro/kundli";

function SummaryCard({
  icon,
  label,
  value,
  sub,
  accent = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "primary" | "gold" | "accent";
}) {
  const accentColors = {
    primary: "text-primary bg-primary/8 border-primary/20",
    gold: "text-gold-foreground bg-gold/10 border-gold/30",
    accent: "text-accent bg-accent/8 border-accent/20",
  } as const;
  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${accentColors[accent]}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
          <p className="mt-0.5 font-display text-lg font-semibold text-primary">{value}</p>
          {sub && <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export function SummaryCards({ k }: { k: Kundli }) {
  const moon = k.planets[1];
  const dashaLord = k.currentDasha?.maha.lord ?? "—";
  const antar = k.currentDasha?.antar.lord ?? "—";
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        icon={<Sun className="h-4 w-4" />}
        label="Lagna (Ascendant)"
        value={`${SIGNS[k.ascendant.sign].en} · ${SIGNS[k.ascendant.sign].hi}`}
        sub={`${formatDegree(k.ascendant.degreeInSign)} · ${NAKSHATRAS[k.ascendant.nakshatra].en}`}
        accent="gold"
      />
      <SummaryCard
        icon={<Moon className="h-4 w-4" />}
        label="Chandra Rashi (Moon)"
        value={`${SIGNS[k.moonSign].en} · ${SIGNS[k.moonSign].hi}`}
        sub={`Janma Nakshatra: ${NAKSHATRAS[moon.nakshatra].en} pada ${moon.pada}`}
        accent="primary"
      />
      <SummaryCard
        icon={<Star className="h-4 w-4" />}
        label="Surya Rashi (Sun)"
        value={`${SIGNS[k.sunSign].en} · ${SIGNS[k.sunSign].hi}`}
        sub={`Tithi ${k.panchang.tithi}, ${k.panchang.paksha}`}
        accent="accent"
      />
      <SummaryCard
        icon={<Clock className="h-4 w-4" />}
        label="Running Dasha"
        value={`${dashaLord} / ${antar}`}
        sub={
          k.currentDasha
            ? `until ${k.currentDasha.antar.end.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}`
            : "—"
        }
        accent="primary"
      />
    </div>
  );
}
