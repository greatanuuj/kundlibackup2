import { PLANET_META, SIGNS } from "@/lib/astro/data";
import type { Kundli } from "@/lib/astro/kundli";
import { Badge } from "@/components/ui/badge";

export function RemediesPanel({ k }: { k: Kundli }) {
  const weak = [...k.planets].sort((a, b) => a.strength - b.strength).slice(0, 4);
  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-primary">Priority remedies (weakest grahas first)</h3>
        <p className="text-xs text-muted-foreground">
          Start with the first planet only. Wear a gemstone after consulting a qualified astrologer.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {weak.map((p, i) => {
            const m = PLANET_META[p.key];
            return (
              <article key={p.key} className="rounded-md border border-border p-4">
                <header className="flex flex-wrap items-center gap-2">
                  <Badge variant={i === 0 ? "default" : "outline"}>Priority {i + 1}</Badge>
                  <h4 className="font-display text-base font-semibold">
                    {p.key} <span className="font-devanagari text-muted-foreground">{m.hi}</span>
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {p.strength}% · {SIGNS[p.sign].en} · house {p.house}
                  </span>
                </header>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div>
                    <dt className="inline text-muted-foreground">Mantra: </dt>
                    <dd className="inline font-devanagari">{m.mantra}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Beej mantra: </dt>
                    <dd className="inline font-devanagari">{m.beej}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Gemstone: </dt>
                    <dd className="inline">{m.gem}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Metal: </dt>
                    <dd className="inline">{m.metal}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Fasting day: </dt>
                    <dd className="inline">{m.day}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Daan (charity): </dt>
                    <dd className="inline">{m.charity}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Rudraksha: </dt>
                    <dd className="inline">{m.rudraksha}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Colour therapy: </dt>
                    <dd className="inline">{m.colour}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Upasana devta: </dt>
                    <dd className="inline">{m.deity}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-semibold text-primary">Daily spiritual routine</h3>
        <ul className="mt-3 grid gap-2 text-sm text-foreground/90 sm:grid-cols-2">
          <li>Sunrise: water offering to the Sun with a red flower, Gayatri mantra 11 times.</li>
          <li>Light a ghee lamp at home in the evening; keep the north-east corner clean.</li>
          <li>108 japa of your running Maha Dasha lord&apos;s beej mantra with a rudraksha mala.</li>
          <li>Tuesday / Saturday: Hanuman Chalisa for protection from malefic pressure.</li>
          <li>Feed cows, crows, dogs and ants weekly — classical Lal Kitaab upaay.</li>
          <li>Respect parents and elders; the strongest remedy for Sun, Moon and Pitra dosha.</li>
        </ul>
        <p className="mt-4 rounded-md border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
          Ethical note: astrology here is offered for self-reflection and cultural study. It is not a
          substitute for medical, legal or financial advice. No prediction of death or fear-based
          guidance is given.
        </p>
      </section>
    </div>
  );
}
