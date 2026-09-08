import { ChartDiagram } from "./ChartDiagram";
import { divisionalSign, type Kundli } from "@/lib/astro/kundli";

const CHARTS: { d: number; name: string; purpose: string; hi: string }[] = [
  { d: 1, name: "D-1 Rashi", purpose: "The main birth chart — overall life", hi: "राशि" },
  { d: 9, name: "D-9 Navamsa", purpose: "Marriage, dharma, inner strength of planets", hi: "नवमांश" },
  { d: 10, name: "D-10 Dashamsa", purpose: "Career, profession, public standing", hi: "दशमांश" },
  { d: 2, name: "D-2 Hora", purpose: "Wealth and money flow", hi: "होरा" },
  { d: 3, name: "D-3 Drekkana", purpose: "Siblings, courage, initiative", hi: "द्रेक्काण" },
  { d: 4, name: "D-4 Chaturthamsa", purpose: "Property, home, fixed assets", hi: "चतुर्थांश" },
  { d: 7, name: "D-7 Saptamsa", purpose: "Children and progeny", hi: "सप्तांश" },
  { d: 12, name: "D-12 Dwadashamsa", purpose: "Parents and ancestry", hi: "द्वादशांश" },
  { d: 30, name: "D-30 Trimsamsa", purpose: "Difficulties, weaknesses, health", hi: "त्रिंशांश" },
];

export function DivisionalPanel({ k }: { k: Kundli }) {
  return (
    <div className="grid gap-5">
      <div className="panel p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-primary">Varga Kundali (Divisional Charts)</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Each divisional chart magnifies a specific area of life. D-1 is the foundation; the rest zoom in.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
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
    </div>
  );
}
