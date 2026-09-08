import { useState } from "react";
import { Sparkles, AlertTriangle, Lightbulb, Heart, Coins } from "lucide-react";
import { buildReport, type ReportSection } from "@/lib/astro/interpret";
import type { Kundli } from "@/lib/astro/kundli";
import { CollapsibleSection, QuickInsight, FindingBadge } from "./ReportPrimitives";

function generateInsight(section: ReportSection, k: Kundli): string {
  const title = section.title.toLowerCase();
  if (title.includes("personality")) {
    const strongest = [...k.planets].sort((a, b) => b.strength - a.strength)[0];
    return `Your Lagna shapes a personality driven by ${strongest.key} (your strongest planet at ${strongest.strength}%), creating a distinct blend of leadership and inner depth.`;
  }
  if (title.includes("mind")) {
    const moon = k.planets[1];
    return `Your Moon in ${moon.house === 1 ? "the 1st house makes emotions front-and-center" : `house ${moon.house} gives a private emotional world`} — mood and memory colour every decision.`;
  }
  if (title.includes("planet")) {
    const exalted = k.planets.filter((p) => p.dignity.startsWith("Exalted"));
    const debil = k.planets.filter((p) => p.dignity.startsWith("Debilitated"));
    if (exalted.length) return `${exalted.map((p) => p.key).join(", ")} ${exalted.length > 1 ? "are" : "is"} exalted — your greatest planetary allies. ${debil.length ? `Watch ${debil.map((p) => p.key).join(", ")} which ${debil.length > 1 ? "need" : "needs"} strengthening.` : ""}`;
    return `Your chart has ${k.yogas.length} yogas and ${k.doshas.filter((d) => d.present).length} doshas — each planet plays a specific role in your life story.`;
  }
  if (title.includes("life area")) {
    return `Career, wealth, relationships and health each connect to specific houses — your chart reveals where natural support exists and where effort is needed.`;
  }
  if (title.includes("strength")) {
    const strongest = [...k.planets].sort((a, b) => b.strength - a.strength)[0];
    const weakest = [...k.planets].sort((a, b) => a.strength - b.strength)[0];
    return `${strongest.key} is your powerhouse (${strongest.strength}%), while ${weakest.key} needs the most attention (${weakest.strength}%). Balance is key.`;
  }
  if (title.includes("current") || title.includes("dasha")) {
    if (k.currentDasha) {
      const m = k.currentDasha.maha.lord;
      return `You are in ${m}'s Mahadasha — this period activates themes of ${k.currentDasha.maha.lord}'s house placement and significations.`;
    }
    return `Your dasha timeline reveals which planetary energies are active right now.`;
  }
  if (title.includes("caution") || title.includes("dosha")) {
    const active = k.doshas.filter((d) => d.present);
    return active.length
      ? `${active.map((d) => d.name).join(", ")} ${active.length > 1 ? "are" : "is"} present — remedies are available and effective.`
      : `No major doshas found — your chart is relatively clear of classical afflictions.`;
  }
  return section.lines[0]?.slice(0, 140) + (section.lines[0] && section.lines[0].length > 140 ? "…" : "") || "";
}

function findBadges(section: ReportSection, k: Kundli) {
  const badges: { icon: React.ReactNode; label: string; tone: "positive" | "caution" | "highlight" }[] = [];
  const title = section.title.toLowerCase();

  if (title.includes("personality")) {
    const strongest = [...k.planets].sort((a, b) => b.strength - a.strength)[0];
    if (strongest.strength >= 65)
      badges.push({ icon: <Sparkles className="h-3 w-3" />, label: `Strong ${strongest.key}`, tone: "highlight" });
  }
  if (title.includes("life area")) {
    badges.push({ icon: <Coins className="h-3 w-3" />, label: "Wealth & Career", tone: "positive" });
    badges.push({ icon: <Heart className="h-3 w-3" />, label: "Relationships", tone: "positive" });
  }
  if (title.includes("caution") || title.includes("dosha")) {
    const active = k.doshas.filter((d) => d.present);
    if (active.length)
      badges.push({ icon: <AlertTriangle className="h-3 w-3" />, label: `${active.length} Dosha${active.length > 1 ? "s" : ""}`, tone: "caution" });
    else
      badges.push({ icon: <Sparkles className="h-3 w-3" />, label: "Clear Chart", tone: "positive" });
  }
  if (title.includes("current") || title.includes("dasha")) {
    badges.push({ icon: <Lightbulb className="h-3 w-3" />, label: "Active Period", tone: "highlight" });
  }
  return badges;
}

function SectionCard({ section, k }: { section: ReportSection; k: Kundli }) {
  const [showDetail, setShowDetail] = useState(false);
  const insight = generateInsight(section, k);
  const badges = findBadges(section, k);

  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-semibold text-primary">{section.title}</h3>
        {section.hi && (
          <span className="font-devanagari text-sm text-muted-foreground">{section.hi}</span>
        )}
      </div>

      {badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.map((b, i) => (
            <FindingBadge key={i} icon={b.icon} label={b.label} tone={b.tone} />
          ))}
        </div>
      )}

      <div className="mt-4">
        <QuickInsight>{insight}</QuickInsight>
      </div>

      <div className="mt-4">
        <CollapsibleSection title="Detailed Analysis" defaultOpen={false}>
          <div className="grid gap-3">
            {section.lines.map((line, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/50 bg-secondary/20 px-4 py-3 text-sm leading-relaxed text-foreground/85"
              >
                {line}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

export function ReportPanel({ k }: { k: Kundli }) {
  const sections = buildReport(k);
  return (
    <div className="grid gap-5">
      {sections.map((s) => (
        <SectionCard key={s.title} section={s} k={k} />
      ))}
    </div>
  );
}
