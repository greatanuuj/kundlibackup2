import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** A collapsible detail section with a toggle button. */
export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  variant = "default",
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "subtle";
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between gap-2 text-left text-sm font-semibold transition-colors",
          variant === "default" ? "text-primary" : "text-foreground/80",
        )}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

/** Quick insight callout — short summary shown before detailed analysis. */
export function QuickInsight({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">Quick Insight</p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{children}</p>
    </div>
  );
}

/** Finding badge — for important highlights (strong career, attention area, etc.) */
export function FindingBadge({
  icon,
  label,
  tone = "neutral",
}: {
  icon: ReactNode;
  label: string;
  tone?: "positive" | "caution" | "neutral" | "highlight";
}) {
  const tones = {
    positive: "border-success/30 bg-success/8 text-success",
    caution: "border-destructive/30 bg-destructive/8 text-destructive",
    neutral: "border-border bg-secondary/50 text-foreground/70",
    highlight: "border-gold/40 bg-gold/10 text-gold-foreground",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
      )}
    >
      {icon}
      {label}
    </span>
  );
}

/** Labeled info row for key-value display in cards. */
export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="shrink-0 text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground/90">{value}</span>
    </div>
  );
}

/** Strength indicator with colored bar. */
export function StrengthIndicator({ value, label }: { value: number; label?: string }) {
  const color = value >= 65 ? "bg-success" : value >= 45 ? "bg-gold" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 text-xs font-medium text-muted-foreground">{value}%</span>
    </div>
  );
}

/** Section heading with optional Hindi subtitle. */
export function SectionHeading({
  title,
  subtitle,
  hi,
}: {
  title: string;
  subtitle?: string;
  hi?: string;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-primary">{title}</h3>
      {hi && <span className="ml-2 font-devanagari text-sm text-muted-foreground">{hi}</span>}
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
