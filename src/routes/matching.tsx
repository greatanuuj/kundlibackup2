import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BirthForm } from "@/components/kundli/BirthForm";
import { Button } from "@/components/ui/button";
import { computeKundli, type BirthInput } from "@/lib/astro/kundli";
import { matchKundlis } from "@/lib/astro/matching";
import { NAKSHATRAS, SIGNS } from "@/lib/astro/data";
import { Heart, Printer, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const scoreColor = pct >= 75 ? "bg-success" : pct >= 50 ? "bg-gold" : "bg-destructive";

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
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to birth chart
          </Link>
        </div>
      </header>

      {!result && (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold text-primary">Groom (वर)</h2>
            </div>
            <BirthForm onSubmit={setBoy} heading="Groom's Birth Details" />
            {boy && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                Saved: {boy.name}
              </p>
            )}
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-semibold text-primary">Bride (वधू)</h2>
            </div>
            <BirthForm onSubmit={setGirl} heading="Bride's Birth Details" />
            {girl && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                Saved: {girl.name}
              </p>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <section className="panel p-6 text-center sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Guna Score</p>
            <p className="mt-2 font-display text-6xl font-bold text-gold-gradient">
              {result.match.total} / 36
            </p>
            <div className="mx-auto mt-5 h-3 w-full max-w-md overflow-hidden rounded-full bg-secondary">
              <div className={`h-full rounded-full transition-all duration-500 ${scoreColor}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-4 text-base font-medium text-foreground/90">{result.match.verdict}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-1.5 h-4 w-4" />
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
              { label: "Groom", k: result.boyK, icon: "👨" },
              { label: "Bride", k: result.girlK, icon: "👩" },
            ].map(({ label, k, icon }) => (
              <div key={label} className="panel p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {icon} {label}
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-primary">{k.input.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Moon in {SIGNS[k.moonSign].en} · {NAKSHATRAS[k.planets[1].nakshatra].en} pada{" "}
                  {k.planets[1].pada} · Lagna {SIGNS[k.ascendant.sign].en}
                </p>
              </div>
            ))}
          </div>

          <section className="panel overflow-hidden">
            <div className="border-b border-border/50 p-5">
              <h3 className="font-display text-xl font-semibold text-primary">Ashtakoot Breakdown</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                8 koota categories, each scored individually. Maximum 36 points.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                    <th className="px-5 pb-2 pt-2">Koota</th>
                    <th className="px-5 pb-2 pt-2">Score</th>
                    <th className="px-5 pb-2 pt-2">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {result.match.koots.map((koot) => (
                    <tr key={koot.name} className="border-t border-border/40 align-top">
                      <td className="px-5 py-3 font-medium">
                        {koot.name}{" "}
                        <span className="font-devanagari text-muted-foreground">{koot.hi}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          koot.score === 0 ? "border-destructive/30 bg-destructive/8 text-destructive"
                          : koot.score === koot.max ? "border-success/30 bg-success/8 text-success"
                          : "border-border bg-secondary/50 text-muted-foreground"
                        }`}>
                          {koot.score} / {koot.max}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{koot.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-saffron" />
              <h3 className="font-display text-xl font-semibold text-primary">Mangal Dosha (Manglik)</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className={`rounded-lg border p-4 ${result.match.mangal.boy ? "border-saffron/40 bg-saffron/5" : "border-success/30 bg-success/5"}`}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Groom</p>
                <p className="mt-1 font-display text-lg font-semibold">
                  <Badge variant={result.match.mangal.boy ? "secondary" : "outline"} className={result.match.mangal.boy ? "border-saffron/40 text-saffron" : "border-success/40 text-success"}>
                    {result.match.mangal.boy ? "Manglik" : "Not Manglik"}
                  </Badge>
                </p>
              </div>
              <div className={`rounded-lg border p-4 ${result.match.mangal.girl ? "border-saffron/40 bg-saffron/5" : "border-success/30 bg-success/5"}`}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Bride</p>
                <p className="mt-1 font-display text-lg font-semibold">
                  <Badge variant={result.match.mangal.girl ? "secondary" : "outline"} className={result.match.mangal.girl ? "border-saffron/40 text-saffron" : "border-success/40 text-success"}>
                    {result.match.mangal.girl ? "Manglik" : "Not Manglik"}
                  </Badge>
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{result.match.mangal.note}</p>
          </section>

          <section className="panel p-5 sm:p-6">
            <h3 className="font-display text-xl font-semibold text-primary">Notes & Exceptions</h3>
            <ul className="mt-4 grid gap-2 text-sm text-foreground/80">
              {result.match.notes.map((n, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span>{n}</span>
                </li>
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
