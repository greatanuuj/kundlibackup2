import { Sparkles, Gem, Calendar, HandHeart, CircleDot, Palette, Flame } from "lucide-react";
import { PLANET_META, SIGNS } from "@/lib/astro/data";
import type { Kundli } from "@/lib/astro/kundli";
import { Badge } from "@/components/ui/badge";
import { CollapsibleSection, QuickInsight } from "./ReportPrimitives";

function RemedyRow({ icon, label, value, devanagari }: { icon: React.ReactNode; label: string; value: string; devanagari?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="flex items-center gap-1.5 shrink-0 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className={`text-right text-sm font-medium text-foreground/90 ${devanagari ? "font-devanagari" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function RemedyCard({ p, priority }: { p: Kundli["planets"][number]; priority: number }) {
  const m = PLANET_META[p.key];
  return (
    <article className="panel p-5">
      <header className="flex flex-wrap items-center gap-2">
        <Badge variant={priority === 1 ? "default" : "outline"}>Priority {priority}</Badge>
        <h4 className="font-display text-lg font-semibold text-primary">
          {p.key} <span className="font-devanagari text-sm text-muted-foreground">{m.hi}</span>
        </h4>
        <span className="text-xs text-muted-foreground">
          {p.strength}% · {SIGNS[p.sign].en} · House {p.house}
        </span>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">Spiritual Practices</h5>
          <RemedyRow icon={<Flame className="h-3 w-3" />} label="Mantra" value={m.mantra} devanagari />
          <RemedyRow icon={<Sparkles className="h-3 w-3" />} label="Beej" value={m.beej} devanagari />
          <RemedyRow icon={<Calendar className="h-3 w-3" />} label="Day" value={m.day} />
          <RemedyRow icon={<HandHeart className="h-3 w-3" />} label="Daan" value={m.charity} />
        </div>
        <div className="space-y-1">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">Material Remedies</h5>
          <RemedyRow icon={<Gem className="h-3 w-3" />} label="Gemstone" value={`${m.gem} (${m.metal})`} />
          <RemedyRow icon={<CircleDot className="h-3 w-3" />} label="Rudraksha" value={m.rudraksha} />
          <RemedyRow icon={<Palette className="h-3 w-3" />} label="Colour" value={m.colour} />
          <RemedyRow icon={<Sparkles className="h-3 w-3" />} label="Deity" value={m.deity} />
        </div>
      </div>
    </article>
  );
}

export function RemediesPanel({ k }: { k: Kundli }) {
  const weak = [...k.planets].sort((a, b) => a.strength - b.strength).slice(0, 4);
  return (
    <div className="grid gap-5">
      <section className="panel p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold" />
          <h3 className="font-display text-xl font-semibold text-primary">Priority Remedies</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Weakest grahas first. Start with priority 1 only. Wear a gemstone after consulting a qualified astrologer.
        </p>
        <div className="mt-4">
          <QuickInsight>
            {weak[0] && `${weak[0].key} is your weakest planet at ${weak[0].strength}% — begin with its mantra and charity before considering gemstones.`}
          </QuickInsight>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {weak.map((p, i) => (
          <RemedyCard key={p.key} p={p} priority={i + 1} />
        ))}
      </div>

      <section className="panel p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-primary">Daily Spiritual Routine</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🌅", text: "Sunrise: water offering to the Sun with a red flower, Gayatri mantra 11 times." },
            { icon: "🪔", text: "Light a ghee lamp at home in the evening; keep the north-east corner clean." },
            { icon: "📿", text: "108 japa of your running Maha Dasha lord's beej mantra with a rudraksha mala." },
            { icon: "🛡️", text: "Tuesday / Saturday: Hanuman Chalisa for protection from malefic pressure." },
            { icon: "🐄", text: "Feed cows, crows, dogs and ants weekly — classical Lal Kitaab upaay." },
            { icon: "🙏", text: "Respect parents and elders; the strongest remedy for Sun, Moon and Pitra dosha." },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-secondary/20 px-4 py-3 text-sm leading-relaxed text-foreground/85">
              <span className="mr-2">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <CollapsibleSection title="Ethical note">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Astrology here is offered for self-reflection and cultural study. It is not a substitute for
              medical, legal or financial advice. No prediction of death or fear-based guidance is given.
            </p>
          </CollapsibleSection>
        </div>
      </section>
    </div>
  );
}
