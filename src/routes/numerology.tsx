import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumerologyPanel } from "@/components/kundli/NumerologyPanel";
import { numerologyMatch, type NumerologyInput } from "@/lib/astro/numerology";
import { ArrowLeft, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/numerology")({
  head: () => ({
    meta: [
      { title: "Numerology (Ank Jyotish) — Mulank, Bhagyank, Lo Shu & Kua" },
      {
        name: "description",
        content:
          "Poori ank jyotish rapat: Mulank, Bhagyank, naam ank, Lo Shu grid, Kua disha, pinnacles, karmic debt aur personal year — har nateeje ki wajah ke saath.",
      },
      { property: "og:title", content: "Numerology — Ank Jyotish Report with Reasons" },
      {
        property: "og:description",
        content:
          "Sirf janm tarikh aur naam se poori numerology kundli — har ank ka calculation aur uska matlab samjhaya hua.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NumerologyPage,
});

const EMPTY: NumerologyInput = { name: "", gender: "Male", date: "" };

function PersonForm({
  value,
  onChange,
  heading,
}: {
  value: NumerologyInput;
  onChange: (v: NumerologyInput) => void;
  heading: string;
}) {
  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold text-primary">{heading}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>Poora naam</Label>
          <Input
            value={value.name}
            placeholder="Jaise: Anuj Nigam"
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>Janm tarikh</Label>
          <Input
            type="date"
            value={value.date}
            onChange={(e) => onChange({ ...value, date: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>Ling</Label>
          <select
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            value={value.gender}
            onChange={(e) => onChange({ ...value, gender: e.target.value })}
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Numerology ke liye janm ka samay ya sthaan zaroori nahi — sirf tarikh aur naam kaafi hai.
      </p>
    </div>
  );
}

function NumerologyPage() {
  const [a, setA] = useState<NumerologyInput>(EMPTY);
  const [b, setB] = useState<NumerologyInput>(EMPTY);
  const [showA, setShowA] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  const match = useMemo(
    () => (showMatch && a.date && b.date ? numerologyMatch(a, b) : null),
    [showMatch, a, b],
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="text-center">
        <p className="font-devanagari text-sm tracking-[0.3em] text-primary/80">॥ अंक ज्योतिष ॥</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gold-gradient">Numerology Report</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Mulank, Bhagyank, naam ke ank, Lo Shu grid, Kua disha, jeevan ke shikhar-chunauti aur chalu
          personal year — har nateeje ke saath uski poori wajah.
        </p>
        <div className="mt-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Poori Vedic Kundli banayein
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-6">
        <PersonForm value={a} onChange={setA} heading="Aapki jaankari" />
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setShowA(Boolean(a.date));
              setShowMatch(false);
            }}
            disabled={!a.date}
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            Numerology report banayein
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowMatch((s) => !s);
            }}
          >
            <Users className="mr-1.5 h-4 w-4" />
            {showMatch ? "Ank milan band karein" : "Ank milan (do logon ka)"}
          </Button>
        </div>

        {showMatch && (
          <>
            <PersonForm value={b} onChange={setB} heading="Doosre vyakti ki jaankari" />
            {match && (
              <section className="panel p-5 sm:p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-semibold text-primary">Ank Milan</h3>
                  <span className="font-display text-3xl text-gold-gradient">{match.total}%</span>
                </div>
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${match.total >= 75 ? "bg-success" : match.total >= 50 ? "bg-gold" : "bg-destructive"}`}
                    style={{ width: `${match.total}%` }}
                  />
                </div>
                <ul className="mt-4 grid gap-2 text-sm">
                  {match.lines.map((l, i) => (
                    <li key={i} className="flex gap-2 leading-relaxed text-foreground/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {showA && a.date && <NumerologyPanel person={a} />}
      </div>

      <footer className="mt-14 text-center text-xs text-muted-foreground">
        Swa-adhyayan ke liye. Chikitsa, kanooni ya vittiya salah ka vikalp nahi.
      </footer>
    </main>
  );
}
