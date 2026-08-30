import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BirthForm } from "@/components/kundli/BirthForm";
import { Button } from "@/components/ui/button";
import { computeKundli, type BirthInput } from "@/lib/astro/kundli";
import { matchKundlis } from "@/lib/astro/matching";
import { NAKSHATRAS, SIGNS } from "@/lib/astro/data";

export const Route = createFileRoute("/matching")({
  head: () => ({
    meta: [
      { title: "Kundli Milan — Ashtakoot Guna Matching & Mangal Dosha" },
      {
        name: "description",
        content:
          "Match two birth charts with the classical 36-guna Ashtakoot system: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi plus Mangal dosha check.",
      },
      { property: "og:title", content: "Kundli Milan — 36 Guna Ashtakoot Matching" },
      {
        property: "og:description",
        content: "Free Vedic marriage compatibility with guna scores, doshas and remedies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Matching,
});

function Matching() {
  const [boy, setBoy] = useState<BirthInput | null>(null);
  const [girl, setGirl] = useState<BirthInput | null>(null);

  const result = useMemo(() => {
    if (!boy || !girl) return null;
    return {
      boyK: computeKundli(boy),
      girlK: computeKundli(girl),
      match: matchKundlis(computeKundli(boy), computeKundli(girl)),
    };
  }, [boy, girl]);

  const pct = result ? Math.round((result.match.total / 36) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="text-center">
        <p className="font-devanagari text-sm tracking-[0.3em] text-primary/80">॥ शुभ विवाह ॥</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gold-gradient">Kundli Milan</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Ashtakoot Guna Milan out of 36 points — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana,
          Bhakoot and Nadi, with Mangal dosha assessment.
        </p>
        <div className="mt-4">
          <Link to="/" className="text-sm text-primary underline-offset-4 hover:underline">
            ← Back to birth chart
          </Link>
        </div>
      </header>

      {!result && (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-xl font-semibold text-primary">Groom (वर)</h2>
            <BirthForm onSubmit={setBoy} heading="Groom's Birth Details" />
            {boy && <p className="mt-2 text-sm text-emerald-500">Saved: {boy.name}</p>}
          </div>
          <div>
            <h2 className="mb-3 font-display text-xl font-semibold text-primary">Bride (वधू)</h2>
            <BirthForm onSubmit={setGirl} heading="Bride's Birth Details" />
            {girl && <p className="mt-2 text-sm text-emerald-500">Saved: {girl.name}</p>}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-8">
          <section className="panel p-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Guna</p>
            <p className="mt-2 font-display text-5xl font-bold text-gold-gradient">
              {result.match.total} / 36
            </p>
            <div className="mx-auto mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 text-sm">{result.match.verdict}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                Print / PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setBoy(null);
                  setGirl(null);
                }}
              >
                New Match
              </Button>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Groom", k: result.boyK },
              { label: "Bride", k: result.girlK },
            ].map(({ label, k }) => (
              <div key={label} className="panel p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-xl font-semibold text-primary">{k.input.name}</p>
                <p className="text-sm text-muted-foreground">
                  Moon in {SIGNS[k.moonSign].en} · {NAKSHATRAS[k.planets[1].nakshatra].en} pada{" "}
                  {k.planets[1].pada} · Lagna {SIGNS[k.ascendant.sign].en}
                </p>
              </div>
            ))}
          </div>

          <section className="panel overflow-x-auto p-5">
            <h3 className="font-display text-lg font-semibold text-primary">Ashtakoot breakdown</h3>
            <table className="mt-4 w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="pb-2">Koota</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {result.match.koots.map((koot) => (
                  <tr key={koot.name} className="border-t border-border/60 align-top">
                    <td className="py-2 font-medium">
                      {koot.name}{" "}
                      <span className="font-devanagari text-muted-foreground">{koot.hi}</span>
                    </td>
                    <td className={`py-2 ${koot.score === 0 ? "text-destructive" : koot.score === koot.max ? "text-emerald-500" : ""}`}>
                      {koot.score} / {koot.max}
                    </td>
                    <td className="py-2 text-muted-foreground">{koot.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="panel p-5">
            <h3 className="font-display text-lg font-semibold text-primary">Mangal Dosha (Manglik)</h3>
            <p className="mt-2 text-sm">
              Groom: {result.match.mangal.boy ? "Manglik" : "Not Manglik"} · Bride:{" "}
              {result.match.mangal.girl ? "Manglik" : "Not Manglik"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{result.match.mangal.note}</p>
          </section>

          <section className="panel p-5">
            <h3 className="font-display text-lg font-semibold text-primary">Notes & exceptions</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {result.match.notes.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <footer className="mt-14 text-center text-xs text-muted-foreground">
        Guna Milan is one input among many. Emotional maturity, values and consent matter most.
      </footer>
    </main>
  );
}
