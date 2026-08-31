import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildReport } from "@/lib/astro/interpret";
import type { Kundli } from "@/lib/astro/kundli";

export function ReportPanel({ k }: { k: Kundli }) {
  const sections = buildReport(k);
  return (
    <div className="grid gap-6">
      {sections.map((s) => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-baseline gap-2 text-xl">
              {s.title}
              {s.hi ? (
                <span className="text-base font-normal text-muted-foreground">{s.hi}</span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3">
              {s.lines.map((line, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
