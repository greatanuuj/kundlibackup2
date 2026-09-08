import { useMemo } from "react";
import {
  buildNumerology,
  LOSHU_LAYOUT,
  NUM_PLANET,
  type Explained,
  type NumerologyInput,
  type NumerologyReport,
} from "@/lib/astro/numerology";
import type { Kundli } from "@/lib/astro/kundli";
import { CollapsibleSection, QuickInsight, InfoRow } from "./ReportPrimitives";

function Card({ e }: { e: Explained }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-display text-base font-semibold text-primary">{e.label}</h4>
        <span className="font-display text-2xl text-gold-gradient">{e.value}</span>
      </div>
      {e.planet && (
        <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
          Swami graha — {e.planet}
        </p>
      )}
      <p className="mt-3 text-sm leading-relaxed">
        <span className="font-medium text-primary/90">Kaise nikla: </span>
        {e.reason}
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        <span className="font-medium text-primary/90">Matlab: </span>
        {e.meaning}
      </p>
      {e.strengths && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-success">Shakti</p>
            <ul className="mt-1 space-y-1 text-sm">
              {e.strengths.map((s) => (
                <li key={s} className="flex gap-1.5"><span className="text-success">+</span> {s}</li>
              ))}
            </ul>
          </div>
          {e.weaknesses && (
            <div>
              <p className="text-xs uppercase tracking-widest text-destructive">Chunauti</p>
              <ul className="mt-1 space-y-1 text-sm">
                {e.weaknesses.map((s) => (
                  <li key={s} className="flex gap-1.5"><span className="text-destructive">−</span> {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {e.advice && (
        <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
          <span className="font-medium text-primary">Upay: </span>
          {e.advice}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  hi,
  children,
}: {
  title: string;
  subtitle?: string;
  hi?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-semibold text-primary">{title}</h3>
        {hi && <span className="font-devanagari text-sm text-muted-foreground">{hi}</span>}
      </div>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function kundliLinks(r: NumerologyReport, k: Kundli): string[] {
  const out: string[] = [];
  const nameToKey: Record<string, string> = {
    Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury",
    Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu",
  };
  const find = (planet: string) =>
    k.planets.find((p) => (p.key as string) === nameToKey[planet]);

  const pairs: [string, number][] = [
    ["Mulank", Number(r.mulank.value)],
    ["Bhagyank", Number(r.bhagyank.value) > 9 ? Number(String(r.bhagyank.value)[0]) * 0 + 2 : Number(r.bhagyank.value)],
  ];
  for (const [label, num] of pairs) {
    const planetName = NUM_PLANET[num]?.en;
    const p = planetName ? find(planetName) : undefined;
    if (!p) continue;
    const strong = p.strength >= 60;
    out.push(
      `${label} ${num} ka swami ${planetName} hai, aur aapki kundli me ${planetName} ${p.house}${
        p.house === 1 ? "st" : p.house === 2 ? "nd" : p.house === 3 ? "rd" : "th"
      } bhav me ${p.dignity} avastha me hai (bal ${Math.round(p.strength)}/100)${
        p.retrograde ? ", vakri" : ""
      }. ${
        strong
          ? `Iska matlab numerology ka ${label} vaada aur kundli dono ek hi baat keh rahe hain — yeh urja aapke jeevan me sach me kaam karti hai, isliye ${planetName} ke upay ka phal jaldi milega.`
          : `Yahan takraav hai: ank aapko ${planetName} ki shakti deta hai par kundli me yeh graha kamzor/dabaav me hai. Isliye pratibha to hai par prakat hone me rukavat aati hai — ${planetName} ke upay (mantra, daan, din) numerology se zyada zaroori ho jaate hain.`
      }`,
    );
  }

  out.push(
    `Kua ${r.kua.value} ki shubh dishaayein ${r.kua.good.join(", ")} hain. Kundli ke 10th bhav (karm) aur ` +
      `Lagna se milakar dekhein: study/office ka rukh shubh disha me rakhne se dasha ke phal jaldi khulte hain, ` +
      `kyunki vastu urja aur graha dasha ek hi mann par kaam karte hain.`,
  );

  if (k.currentDasha) {
    const mahaName = k.currentDasha.maha.lord;
    const mahaNum = Object.entries(NUM_PLANET).find(([, v]) => v.en === mahaName)?.[0];
    out.push(
      `Abhi ${mahaName} ki mahadasha chal rahi hai${
        mahaNum ? `, jiska ank ${mahaNum} hai` : ""
      }. Aapka Personal Year ${r.personal.year.value} (${r.personal.year.planet}) hai. ${
        mahaNum && (Number(mahaNum) === Number(r.personal.year.value))
          ? "Dono ek hi urja par hain — isliye is saal ke event bahut prabhavshali honge."
          : "Dono alag urja de rahe hain: mahadasha lambi disha deti hai aur personal year saal ka mood — jab dono milte hain tabhi bada badlaav aata hai."
      }`,
    );
  }

  if (r.loShu.missing.length) {
    const missPlanets = r.loShu.missing.map((n) => NUM_PLANET[n].en);
    const weakInChart = missPlanets.filter((pn) => {
      const p = find(pn);
      return p && p.strength < 50;
    });
    out.push(
      `Lo Shu me gayab ank ${r.loShu.missing.join(", ")} = ${missPlanets.join(", ")}. ` +
        (weakInChart.length
          ? `Inme se ${weakInChart.join(", ")} kundli me bhi kamzor hai — matlab do alag paddhatiyaan ek hi kami bata rahi hain. Yahi aapka sabse pehla upay hona chahiye.`
          : `Achhi baat yeh hai ki ye graha kundli me theek-thaak bal me hain, isliye Lo Shu ki kami itni nahi khalegi — sirf aadat me sudhaar chahiye.`),
    );
  }

  const strongest = [...k.planets].sort((a, b) => b.strength - a.strength)[0];
  const sNum = Object.entries(NUM_PLANET).find(([, v]) => v.en === (strongest.key as string))?.[0];
  if (sNum) {
    out.push(
      `Kundli ka sabse balshali graha ${strongest.key} hai, jiska ank ${sNum} hai. ` +
        `Isliye ${sNum} ko apne shubh ankon me shaamil karein (mobile, gaadi, ghar number, launch date) — ` +
        `jo graha pehle se strong hai uska ank turant support deta hai.`,
    );
  }
  return out;
}

export function NumerologyPanel({
  person,
  k,
}: {
  person: NumerologyInput;
  k?: Kundli;
}) {
  const r = useMemo(() => buildNumerology(person), [person]);
  const links = useMemo(() => (k ? kundliLinks(r, k) : []), [r, k]);
  const counts = new Map(r.loShu.cells.map((c) => [c.n, c]));

  return (
    <div className="grid gap-5">
      <Section title="Aapke Mool Ank" hi="अंक" subtitle="Har ank ke saath uski calculation aur matlab.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card e={r.mulank} />
          <Card e={r.bhagyank} />
          <Card e={r.kudrat} />
          <Card e={r.maturity} />
        </div>
      </Section>

      <Section title="Naam ke Ank" subtitle="Chaldean (dhwani aadharit, bhartiya paddhati) aur Pythagorean (paschimi) dono.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card e={r.namank} />
          <Card e={r.pythagorean} />
          <Card e={r.soulUrge} />
          <Card e={r.personality} />
          <Card e={r.balance} />
          <div className="rounded-lg border border-dashed border-primary/40 p-4">
            <h4 className="font-display text-base font-semibold text-primary">Naam Sudhaar (Name Correction)</h4>
            <p className="mt-2 text-sm leading-relaxed">{r.nameSuggestions.note}</p>
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Shubh Namank targets: </span>
              {r.nameSuggestions.targets.join(", ")}
            </p>
          </div>
        </div>
      </Section>

      <Section title="Lo Shu Grid" hi="लो शू चौक" subtitle="Janm tithi ke ank 3×3 jaadu-chowk me. Jo ank hai wo shakti, jo nahi wo seekhne ka paath.">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="grid w-fit grid-cols-3 gap-1">
            {LOSHU_LAYOUT.map((n) => {
              const c = counts.get(n)!;
              return (
                <div
                  key={n}
                  className={`flex h-24 w-24 flex-col items-center justify-center rounded-lg border text-center ${
                    c.count ? "border-primary/60 bg-primary/10" : "border-dashed border-border opacity-60"
                  }`}
                >
                  <span className="font-display text-xl">
                    {c.count ? String(n).repeat(c.count) : "—"}
                  </span>
                  <span className="mt-1 px-1 text-[10px] leading-tight text-muted-foreground">
                    {n} · {NUM_PLANET[n].en}
                  </span>
                </div>
              );
            })}
          </div>
          <ul className="grid gap-2 text-sm">
            {r.loShu.cells.map((c) => (
              <li key={c.n} className="rounded-lg border border-border/50 bg-secondary/15 px-3 py-2">
                <span className="font-medium text-primary">
                  {c.n} — {c.meaning} ({c.count}x)
                </span>
                <p className="mt-1 leading-relaxed text-foreground/80">{c.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {r.loShu.planes.map((p) => (
            <div
              key={p.name}
              className={`rounded-lg border p-3 text-sm ${
                p.complete ? "border-success/40 bg-success/5" : "border-border/50 bg-card"
              }`}
            >
              <p className="font-medium text-primary">
                {p.name} — {p.complete ? "poora" : "adhoora"}
              </p>
              <p className="mt-1 leading-relaxed text-foreground/80">{p.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Kua Ank aur Disha (Vastu)" hi="कुआ अंक">
        <Card e={r.kua} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <p className="text-xs uppercase tracking-widest text-success">Shubh disha</p>
            <p className="mt-1 font-display text-lg text-foreground">{r.kua.good.join(" · ")}</p>
            <p className="mt-1 text-muted-foreground">
              Kaam karte waqt munh, aur sote waqt sir isi taraf.
            </p>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-xs uppercase tracking-widest text-destructive">Ashubh disha</p>
            <p className="mt-1 font-display text-lg text-foreground">{r.kua.bad.join(" · ")}</p>
            <p className="mt-1 text-muted-foreground">
              Inme lambe samay tak baithne se thakaan aur matbhed badhta hai.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Shubh Rang, Din, Ratna aur Ank">
        <p className="text-sm leading-relaxed text-foreground/85">{r.luck.reason}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Shubh rang", r.luck.colors.join(", ")],
            ["Shubh din", r.luck.days.join(", ")],
            ["Ratna", r.luck.gem],
            ["Dhatu", r.luck.metal],
            ["Isht dev", r.luck.deity],
            ["Disha", r.luck.direction],
            ["Shubh ank", r.luck.luckyNumbers.join(", ")],
            ["Shubh tarikhein", r.luck.luckyDates.join(", ")],
            ["Mantra", r.luck.mantra],
          ].map(([a, b]) => (
            <div key={a} className="rounded-lg border border-border/50 bg-secondary/15 p-3">
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">{a}</dt>
              <dd className="mt-1 text-sm">{b}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Ank-maitri (Compatibility)" subtitle="Kis ank ke log aapke saath chalte hain aur kyun.">
        <p className="text-sm leading-relaxed text-foreground/85">{r.compatibility.reason}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Mitra ank", r.compatibility.friendly, "border-success/40 bg-success/5"],
            ["Sam ank", r.compatibility.neutral, "border-border/50 bg-card"],
            ["Shatru ank", r.compatibility.enemy, "border-destructive/40 bg-destructive/5"],
          ].map(([label, nums, cls]) => (
            <div key={label as string} className={`rounded-lg border p-3 ${cls}`}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-lg text-foreground">
                {(nums as number[]).join(", ") || "—"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{r.compatibility.partnerNote}</p>
      </Section>

      <Section title="Jeevan ke Chakra, Shikhar aur Chunautiyaan" subtitle="Umar ke hisaab se kaun sa daur kya lekar aayega.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h4 className="font-display text-base font-semibold text-primary">Pinnacles (Shikhar)</h4>
            <ul className="mt-2 grid gap-2 text-sm">
              {r.pinnacles.map((p) => (
                <li key={p.n} className="rounded-lg border border-border/50 bg-secondary/15 px-3 py-2">
                  <p className="font-medium text-primary">
                    Shikhar {p.n} — ank {p.number} · umar {p.from}–{p.to === 99 ? "aage" : p.to}
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground/80">{p.meaning}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.reason}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-base font-semibold text-primary">Challenges (Chunauti)</h4>
            <ul className="mt-2 grid gap-2 text-sm">
              {r.challenges.map((c) => (
                <li key={c.n} className="rounded-lg border border-border/50 bg-secondary/15 px-3 py-2">
                  <p className="font-medium text-primary">
                    Chunauti {c.n} — ank {c.number}
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground/80">{c.meaning}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          {r.cycles.map((c) => (
            <div key={c.name} className="rounded-lg border border-border/50 bg-card p-3">
              <p className="font-medium text-primary">
                {c.name} — ank {c.number}
              </p>
              <p className="text-xs text-muted-foreground">
                umar {c.from}–{c.to === 99 ? "aage" : c.to}
              </p>
              <p className="mt-1 leading-relaxed text-foreground/80">{c.meaning}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      {r.karmicDebts.length > 0 && (
        <Section title="Karmic Debt (Rin Ank)" subtitle="13, 14, 16 aur 19 — inka alag artha hai.">
          <ul className="grid gap-3 text-sm">
            {r.karmicDebts.map((kd) => (
              <li key={kd.title} className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="font-display text-base font-semibold text-primary">{kd.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">Source: {kd.source}</p>
                <p className="mt-2 leading-relaxed text-foreground/85">{kd.reason}</p>
                <p className="mt-2">
                  <span className="font-medium text-primary">Upay: </span>
                  {kd.remedy}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={`Chalu Bhavishya — Personal Year ${r.personal.forecastYear}`} subtitle="Personal year janmdin se janmdin tak chalta hai, 1 January se nahi.">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card e={r.personal.year} />
          <Card e={r.personal.month} />
          <Card e={r.personal.day} />
        </div>
      </Section>

      <Section title="Sab kuch Aapas me Kaise Juda Hai" subtitle="Har nateeje ki wajah — kaun sa ank kis ko kaat raha hai aur kaun madad kar raha hai.">
        <div className="mt-2">
          <QuickInsight>
            {links[0] ?? "Numerology aur kundli dono milkar aapki urja ka poora chitra banate hain."}
          </QuickInsight>
        </div>
        <div className="mt-4">
          <CollapsibleSection title="Saari connections detail mein">
            <ul className="grid gap-2 text-sm">
              {[...r.relations, ...links].map((l, i) => (
                <li key={i} className="flex gap-2 leading-relaxed text-foreground/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        </div>
      </Section>
    </div>
  );
}
