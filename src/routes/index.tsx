import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { AccountBar } from "@/components/auth/AccountBar";
import { SavedProfiles } from "@/components/auth/SavedProfiles";
import { saveProfile, type SavedProfile } from "@/lib/savedProfiles";
import { BirthForm } from "@/components/kundli/BirthForm";
import { ChartDiagram } from "@/components/kundli/ChartDiagram";
import { SummaryCards } from "@/components/kundli/SummaryCards";
import { ReportPanel } from "@/components/kundli/ReportPanel";
import { PlanetsPanel } from "@/components/kundli/PlanetsPanel";
import { HousesPanel } from "@/components/kundli/HousesPanel";
import { DashaPanel } from "@/components/kundli/DashaPanel";
import { YogaDoshaPanel } from "@/components/kundli/YogaDoshaPanel";
import { RemediesPanel } from "@/components/kundli/RemediesPanel";
import { DivisionalPanel } from "@/components/kundli/DivisionalPanel";
import { TransitPanel } from "@/components/kundli/TransitPanel";
import { LalKitabPanel } from "@/components/kundli/LalKitabPanel";
import { NumerologyPanel } from "@/components/kundli/NumerologyPanel";
import { PrintView } from "@/components/kundli/PrintView";

import { HouseDetail } from "@/components/kundli/HouseDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { computeKundli, type BirthInput, type Kundli } from "@/lib/astro/kundli";
import { NAKSHATRAS, SIGNS } from "@/lib/astro/data";
import { Printer, RotateCcw, Heart, Hash } from "lucide-react";

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
  const { isSignedIn, user } = useUser();
  const [input, setInput] = useState<BirthInput | null>(null);
  const [house, setHouse] = useState<number | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [profilesRefreshKey, setProfilesRefreshKey] = useState(0);
  const kundli: Kundli | null = useMemo(() => (input ? computeKundli(input) : null), [input]);

  const openSavedProfile = (profile: SavedProfile) => {
    setInput(profile.input);
    setHouse(null);
    setSavedNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="text-center">
        <div className="mb-8 flex justify-end">
          <AccountBar />
        </div>
        <p className="font-devanagari text-sm tracking-[0.3em] text-primary/80">॥ श्री गणेशाय नमः ॥</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gold-gradient">Kundli Analyzer Pro</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Sidereal Vedic birth chart with real astronomical calculations — Lagna, grahas, nakshatras,
          divisional charts, Vimshottari dasha, yogas, doshas and traditional remedies.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            to="/matching"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-secondary/30"
          >
            <Heart className="h-4 w-4" />
            Kundli Milan — 36 guna matching
          </Link>
          <Link
            to="/numerology"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-secondary/30"
          >
            <Hash className="h-4 w-4" />
            Numerology — Ank Jyotish
          </Link>
        </div>
      </header>

      {!kundli && (
        <div className="mt-10">
          <BirthForm onSubmit={setInput} />
          <div className="mt-6">
            <SavedProfiles onOpen={openSavedProfile} refreshKey={profilesRefreshKey} />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "🪐", t: "Authentic Jyotish", d: "Lahiri ayanamsa, whole-sign bhavas, classical dignities and Vimshottari timing." },
              { icon: "📖", t: "Explained, not guessed", d: "Every result shows the logic — placement, lordship and strength behind it." },
              { icon: "📿", t: "Complete remedies", d: "Mantra, gemstone, fasting day, charity, rudraksha and daily sadhana per graha." },
            ].map((f) => (
              <div key={f.t} className="panel p-5">
                <span className="text-2xl">{f.icon}</span>
                <h2 className="mt-2 font-display text-lg font-semibold text-primary">{f.t}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {kundli && (
        <div className="mt-10 space-y-8">
          <div className="panel flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-primary">{kundli.input.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {kundli.input.date} · {kundli.input.time} · {kundli.input.place} ·{" "}
                {kundli.panchang.weekday} ({kundli.panchang.weekdayHi})
              </p>
            </div>
            <div className="flex gap-2">
               {isSignedIn && user && (
                 <Button
                   variant="outline"
                   onClick={() => {
                     saveProfile(user.id, kundli.input);
                     setProfilesRefreshKey((key) => key + 1);
                     setSavedNotice("Kundli aapke account mein save ho gayi.");
                   }}
                 >
                   Save this Kundli
                 </Button>
               )}
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-1.5 h-4 w-4" />
                Print / PDF
              </Button>
              <Button variant="secondary" onClick={() => setInput(null)}>
                <RotateCcw className="mr-1.5 h-4 w-4" />
                New Kundli
              </Button>
            </div>
             {savedNotice && (
               <p className="basis-full text-sm text-emerald-700" role="status">
                 {savedNotice}
               </p>
             )}
          </div>

          <SummaryCards k={kundli} />

          <Tabs defaultValue="report">
            <TabsList className="flex h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="planets">Grahas</TabsTrigger>
              <TabsTrigger value="houses">Bhavas</TabsTrigger>
              <TabsTrigger value="divisional">Divisional</TabsTrigger>
              <TabsTrigger value="dasha">Dasha</TabsTrigger>
              <TabsTrigger value="gochar">Gochar</TabsTrigger>
              <TabsTrigger value="yoga">Yoga &amp; Dosha</TabsTrigger>
              <TabsTrigger value="lalkitab">Lal Kitab</TabsTrigger>
              <TabsTrigger value="numerology">Numerology</TabsTrigger>

              <TabsTrigger value="remedies">Remedies</TabsTrigger>
              <TabsTrigger value="panchang">Panchang</TabsTrigger>
            </TabsList>

            <TabsContent value="report" className="mt-6">
              <ReportPanel k={kundli} />
            </TabsContent>

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
                  subtitle="North Indian style — kisi bhi ghar par click karein, poora vishleshan milega"
                  onHouseClick={(h) => setHouse(h === house ? null : h)}
                  activeHouse={house}
                />
                {house ? (
                  <HouseDetail k={kundli} house={house} />
                ) : (
                  <div className="panel p-5 sm:p-6">
                    <h3 className="font-display text-xl font-semibold text-primary">Chart Summary</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Chart mein kisi bhi ghar par click karein — us ghar ka kaam, uske grah, drishti,
                      dasha aur baaki tables se connection sab detail mein khulega.
                    </p>
                    <div className="mt-4 rounded-lg border border-border/40 bg-secondary/15 p-4">
                      <ul className="grid gap-2 text-sm">
                        <li className="flex justify-between gap-3 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground">Lagna</span>
                          <span className="font-medium text-foreground/90">
                            {SIGNS[kundli.ascendant.sign].en} ({SIGNS[kundli.ascendant.sign].hi}),{" "}
                            {SIGNS[kundli.ascendant.sign].element} sign ruled by{" "}
                            {SIGNS[kundli.ascendant.sign].lord}
                          </span>
                        </li>
                        <li className="flex justify-between gap-3 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground">Janma Nakshatra</span>
                          <span className="font-medium text-foreground/90">
                            {NAKSHATRAS[kundli.planets[1].nakshatra].en} — deity{" "}
                            {NAKSHATRAS[kundli.planets[1].nakshatra].deity}, lord{" "}
                            {NAKSHATRAS[kundli.planets[1].nakshatra].lord}
                          </span>
                        </li>
                        <li className="flex justify-between gap-3 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground">Strongest graha</span>
                          <span className="font-medium text-success">{[...kundli.planets].sort((a, b) => b.strength - a.strength)[0].key}</span>
                        </li>
                        <li className="flex justify-between gap-3 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground">Weakest graha</span>
                          <span className="font-medium text-destructive">{[...kundli.planets].sort((a, b) => a.strength - b.strength)[0].key}</span>
                        </li>
                        <li className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Doshas present</span>
                          <span className="font-medium text-foreground/90">{kundli.doshas.filter((d) => d.present).map((d) => d.name).join(", ") || "none"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
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
            <TabsContent value="gochar" className="mt-6">
              <TransitPanel k={kundli} />
            </TabsContent>
            <TabsContent value="yoga" className="mt-6">
              <YogaDoshaPanel k={kundli} />
            </TabsContent>
            <TabsContent value="lalkitab" className="mt-6">
              <LalKitabPanel k={kundli} />
            </TabsContent>
            <TabsContent value="numerology" className="mt-6">
              <NumerologyPanel
                person={{
                  name: kundli.input.name,
                  gender: kundli.input.gender,
                  date: kundli.input.date,
                }}
                k={kundli}
              />
            </TabsContent>

            <TabsContent value="remedies" className="mt-6">
              <RemediesPanel k={kundli} />
            </TabsContent>
            <TabsContent value="panchang" className="mt-6">
              <section className="panel p-5 sm:p-6">
                <h3 className="font-display text-xl font-semibold text-primary">Birth Panchang</h3>
                <p className="mt-1 text-xs text-muted-foreground">Five limbs of Vedic almanac at the moment of birth.</p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["Vaar (weekday)", `${kundli.panchang.weekday} · ${kundli.panchang.weekdayHi}`],
                    ["Tithi", `${kundli.panchang.tithi} (${kundli.panchang.paksha})`],
                    ["Nakshatra", kundli.panchang.nakshatra],
                    ["Yoga", kundli.panchang.yoga],
                    ["Karana", kundli.panchang.karana],
                    ["Ayanamsa (Lahiri)", `${kundli.ayanamsa.toFixed(4)}°`],
                  ].map(([k2, v]) => (
                    <div key={k2} className="rounded-lg border border-border/50 bg-secondary/15 p-4">
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k2}</dt>
                      <dd className="mt-1 font-display text-lg text-foreground">{v}</dd>
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

      {kundli && <PrintView k={kundli} />}
    </main>
  );
}
