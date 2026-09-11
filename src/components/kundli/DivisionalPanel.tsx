import { ChartDiagram } from "./ChartDiagram";
import { divisionalSign, type Kundli } from "@/lib/astro/kundli";

const CHARTS: { d: number; name: string; purpose: string }[] = [
  { d: 1, name: "D-1 Rashi", purpose: "The main birth chart — overall life" },
  { d: 9, name: "D-9 Navamsa", purpose: "Marriage, dharma, inner strength of planets" },
  { d: 10, name: "D-10 Dashamsa", purpose: "Career, profession, public standing" },
  { d: 2, name: "D-2 Hora", purpose: "Wealth and money flow" },
  { d: 3, name: "D-3 Drekkana", purpose: "Siblings, courage, initiative" },
  { d: 4, name: "D-4 Chaturthamsa", purpose: "Property, home, fixed assets" },
  { d: 7, name: "D-7 Saptamsa", purpose: "Children and progeny" },
  { d: 12, name: "D-12 Dwadashamsa", purpose: "Parents and ancestry" },
  { d: 30, name: "D-30 Trimsamsa", purpose: "Difficulties, weaknesses, health" },
];

export function DivisionalPanel({ k }: { k: Kundli }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {CHARTS.map((c) => {
        const ascSign = divisionalSign(k.ascendant.longitude, c.d);
        const placements = k.planets.map((p) => ({
          key: p.key,
          sign: divisionalSign(p.longitude, c.d),
          retro: p.retrograde,
        }));
        return (
          <ChartDiagram
            key={c.d}
            ascSign={ascSign}
            placements={placements}
            title={c.name}
            subtitle={c.purpose}
          />
        );
      })}
    </div>
  );
}
