import { PLANET_META, SIGNS, type PlanetKey } from "@/lib/astro/data";

export type ChartPlacement = { key: PlanetKey; sign: number; retro?: boolean };

/**
 * North-Indian (diamond) chart. House 1 is fixed at the top-centre and the
 * sign number rotates with the ascendant.
 */
const HOUSE_POS: { x: number; y: number }[] = [
  { x: 200, y: 92 }, // 1
  { x: 105, y: 45 }, // 2
  { x: 52, y: 100 }, // 3
  { x: 105, y: 200 }, // 4
  { x: 52, y: 300 }, // 5
  { x: 105, y: 355 }, // 6
  { x: 200, y: 305 }, // 7
  { x: 295, y: 355 }, // 8
  { x: 348, y: 300 }, // 9
  { x: 295, y: 200 }, // 10
  { x: 348, y: 100 }, // 11
  { x: 295, y: 45 }, // 12
];

export function ChartDiagram({
  ascSign,
  placements,
  title,
  subtitle,
  onHouseClick,
  activeHouse,
}: {
  ascSign: number;
  placements: ChartPlacement[];
  title: string;
  subtitle?: string;
  onHouseClick?: (house: number) => void;
  activeHouse?: number | null;
}) {
  const houseOf = (sign: number) => ((sign - ascSign + 12) % 12) + 1;

  return (
    <figure className="panel p-4 sm:p-6">
      <figcaption className="mb-3">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </figcaption>
      <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[420px]" role="img" aria-label={title}>
        <rect x="8" y="8" width="384" height="384" fill="none" stroke="var(--border)" strokeWidth="2" />
        <line x1="8" y1="8" x2="392" y2="392" stroke="var(--border)" strokeWidth="1.5" />
        <line x1="392" y1="8" x2="8" y2="392" stroke="var(--border)" strokeWidth="1.5" />
        <polygon points="200,8 392,200 200,392 8,200" fill="none" stroke="var(--border)" strokeWidth="1.5" />

        {HOUSE_POS.map((pos, i) => {
          const house = i + 1;
          const sign = (ascSign + i) % 12;
          const inHouse = placements.filter((p) => houseOf(p.sign) === house);
          const isActive = activeHouse === house;
          return (
            <g
              key={house}
              onClick={() => onHouseClick?.(house)}
              style={{ cursor: onHouseClick ? "pointer" : "default" }}
            >
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r="46" fill="var(--primary)" opacity="0.12" />
              )}
              <text
                x={pos.x}
                y={pos.y - 26}
                textAnchor="middle"
                fontSize="11"
                fill="var(--muted-foreground)"
              >
                {house} · {SIGNS[sign].en.slice(0, 3)}
              </text>
              {inHouse.map((p, idx) => (
                <text
                  key={p.key}
                  x={pos.x}
                  y={pos.y - 8 + idx * 14}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill={
                    PLANET_META[p.key].nature === "Benefic"
                      ? "var(--success)"
                      : PLANET_META[p.key].nature === "Malefic"
                        ? "var(--saffron)"
                        : "var(--primary)"
                  }
                >
                  {PLANET_META[p.key].short}
                  {p.retro ? "ᴿ" : ""}
                </text>
              ))}
            </g>
          );
        })}
        <text x="200" y="204" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
          लग्न {SIGNS[ascSign].hi}
        </text>
      </svg>
    </figure>
  );
}
