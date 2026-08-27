import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BirthForm } from "@/components/kundli/BirthForm";
import { ChartDiagram } from "@/components/kundli/ChartDiagram";
import { SummaryCards } from "@/components/kundli/SummaryCards";
import { PlanetsPanel } from "@/components/kundli/PlanetsPanel";
import { HousesPanel } from "@/components/kundli/HousesPanel";
import { DashaPanel } from "@/components/kundli/DashaPanel";
import { YogaDoshaPanel } from "@/components/kundli/YogaDoshaPanel";
import { RemediesPanel } from "@/components/kundli/RemediesPanel";
import { DivisionalPanel } from "@/components/kundli/DivisionalPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { computeKundli, type BirthInput, type Kundli } from "@/lib/astro/kundli";
import { HOUSES, NAKSHATRAS, SIGNS } from "@/lib/astro/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kundli Analyzer Pro — Vedic Birth Chart, Dasha & Remedies" },
      {
        name: "description",
        content:
          "Generate a precise Vedic kundli: Lagna, planetary positions, nakshatras, divisional charts, Vimshottari dasha, yogas, doshas and authentic remedies.",
      },
      { property: "og:title", content: "Kundli Analyzer Pro — Vedic Birth Chart & Remedies" },
      {
        property: "og:description",
        content:
          "Sidereal Lahiri kundli with planets, houses, D-9 Navamsa, dashas, doshas and mantra-gemstone remedies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [input, setInput] = useState<BirthInput | null>(null);
  const [house, setHouse] = useState<number | null>(null);
  const kundli: Kundli | null = useMemo(() => (input ? computeKundli(input) : null), [input]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="text-center">
        <p className="font-devanagari text-sm tracking-[0.3em] text-primary/80">॥ श्री गणेशाय नमः ॥</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gold-gradient">Kundli Analyzer Pro</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Sidereal Vedic birth chart with real astronomical calculations — Lagna, grahas, nakshatras,
          divisional charts, Vimshottari dasha, yogas, doshas and traditional remedies.
        </p>
      </header>

      {!kundli && (
        <div className="mt-10">
          <BirthForm onSubmit={setInput} />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { t: "Authentic Jyotish", d: "Lahiri ayanamsa, whole-sign bhavas, classical dignities and Vimshottari timing." },
              { t: "Explained, not guessed", d: "Every result shows the logic — placement, lordship and strength behind it." },
              { t: "Complete remedies", d: "Mantra, gemstone, fasting day, charity, rudraksha and daily sadhana per graha." },
            ].map((f) => (
              <div key={f.t} className="panel p-5">
                <h2 className="font-display text-lg font-semibold text-primary">{f.t}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {kundli && (
        <div className="mt-10 space-y-8">
          <div className="panel flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="font-display text-2xl font-semibold">{kundli.input.name}</h2>
              <p className="text-sm text-muted-foreground">
                {kundli.input.date} · {kundli.input.time} · {kundli.input.place} ·{" "}
                {kundli.panchang.weekday} ({kundli.panchang.weekdayHi})
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                Print / PDF
              </Button>
              <Button variant="secondary" onClick={() => setInput(null)}>
                New Kundli
              </Button>
            </div>
          </div>

          <SummaryCards k={kundli} />

          <Tabs defaultValue="chart">
            <TabsList className="flex h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="planets">Grahas</TabsTrigger>
              <TabsTrigger value="houses">Bhavas</TabsTrigger>
              <TabsTrigger value="divisional">Divisional</TabsTrigger>
              <TabsTrigger value="dasha">Dasha</TabsTrigger>
              <TabsTrigger value="yoga">Yoga &amp; Dosha</TabsTrigger>
              <TabsTrigger value="remedies">Remedies</TabsTrigger>
              <TabsTrigger value="panchang">Panchang</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartDiagram
                  ascSign={kundli.ascendant.sign}
                  placements={kundli.planets.map((p) => ({
                    key: p.key,
                    sign: p.sign,
                    retro: p.retrograde,
                  }))}
                  title="Rashi Chakra (D-1)"
                  subtitle="North Indian style — click a house for its meaning"
                  onHouseClick={(h) => setHouse(h === house ? null : h)}
                  activeHouse={house}
                />
                <div className="panel p-5">
                  <h3 className="text-lg font-semibold text-primary">
                    {house ? `House ${house} — ${HOUSES[house - 1].title}` : "Chart summary"}
                  </h3>
                  {house ? (
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="font-devanagari text-muted-foreground">{HOUSES[house - 1].hi}</p>
                      <p>{HOUSES[house - 1].areas}</p>
                      <p>
                        <span className="text-muted-foreground">Sign: </span>
                        {SIGNS[(kundli.ascendant.sign + house - 1) % 12].en} · lord{" "}
                        {kundli.houseLords[house - 1].lord} in house{" "}
                        {kundli.houseLords[house - 1].lordHouse}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Planets here: </span>
                        {kundli.planets.filter((p) => p.house === house).map((p) => p.key).join(", ") ||
                          "none"}
                      </p>
                    </div>
                  ) : (
                    <ul className="mt-3 space-y-2 text-sm">
                      <li>
                        <span className="text-muted-foreground">Lagna: </span>
                        {SIGNS[kundli.ascendant.sign].en} ({SIGNS[kundli.ascendant.sign].hi}),{" "}
                        {SIGNS[kundli.ascendant.sign].element} sign ruled by{" "}
                        {SIGNS[kundli.ascendant.sign].lord}
                      </li>
                      <li>
                        <span className="text-muted-foreground">Janma Nakshatra: </span>
                        {NAKSHATRAS[kundli.planets[1].nakshatra].en} — deity{" "}
                        {NAKSHATRAS[kundli.planets[1].nakshatra].deity}, lord{" "}
                        {NAKSHATRAS[kundli.planets[1].nakshatra].lord}
                      </li>
                      <li>
                        <span className="text-muted-foreground">Strongest graha: </span>
                        {[...kundli.planets].sort((a, b) => b.strength - a.strength)[0].key}
                      </li>
                      <li>
                        <span className="text-muted-foreground">Weakest graha: </span>
                        {[...kundli.planets].sort((a, b) => a.strength - b.strength)[0].key}
                      </li>
                      <li>
                        <span className="text-muted-foreground">Doshas present: </span>
                        {kundli.doshas.filter((d) => d.present).map((d) => d.name).join(", ") || "none"}
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="planets" className="mt-6">
              <PlanetsPanel k={kundli} />
            </TabsContent>
            <TabsContent value="houses" className="mt-6">
              <HousesPanel k={kundli} focus={house} />
            </TabsContent>
            <TabsContent value="divisional" className="mt-6">
              <DivisionalPanel k={kundli} />
            </TabsContent>
            <TabsContent value="dasha" className="mt-6">
              <DashaPanel k={kundli} />
            </TabsContent>
            <TabsContent value="yoga" className="mt-6">
              <YogaDoshaPanel k={kundli} />
            </TabsContent>
            <TabsContent value="remedies" className="mt-6">
              <RemediesPanel k={kundli} />
            </TabsContent>
            <TabsContent value="panchang" className="mt-6">
              <section className="panel p-5">
                <h3 className="text-lg font-semibold text-primary">Birth Panchang</h3>
                <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Vaar (weekday)", `${kundli.panchang.weekday} · ${kundli.panchang.weekdayHi}`],
                    ["Tithi", `${kundli.panchang.tithi} (${kundli.panchang.paksha})`],
                    ["Nakshatra", kundli.panchang.nakshatra],
                    ["Yoga", kundli.panchang.yoga],
                    ["Karana", kundli.panchang.karana],
                    ["Ayanamsa (Lahiri)", `${kundli.ayanamsa.toFixed(4)}°`],
                  ].map(([k2, v]) => (
                    <div key={k2} className="rounded-md border border-border p-4">
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k2}</dt>
                      <dd className="mt-1 font-display text-lg">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <footer className="mt-14 text-center text-xs text-muted-foreground">
        For self-reflection and study. Not a substitute for medical, legal or financial advice.
      </footer>
    </main>
  );
}
