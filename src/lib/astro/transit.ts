import {
  ayanamsa,
  dailyMotion,
  julianDay,
  moonLongitude,
  norm360,
  planetLongitude,
  rahuLongitude,
  sunLongitude,
} from "./ephemeris";
import { SIGNS, type PlanetKey } from "./data";
import type { Kundli } from "./kundli";

export type TransitPlanet = {
  key: PlanetKey;
  sign: number;
  degreeInSign: number;
  retrograde: boolean;
  fromMoon: number; // house 1-12 counted from natal Moon sign
  fromLagna: number;
  effect: "good" | "mixed" | "hard";
  note: string;
};

export type TransitReport = {
  date: Date;
  planets: TransitPlanet[];
  sadeSati: { active: boolean; phase: string; note: string };
  jupiter: { house: number; note: string };
  highlights: string[];
};

const ORDER: PlanetKey[] = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
];

function fn(key: PlanetKey): (jd: number) => number {
  if (key === "Sun") return sunLongitude;
  if (key === "Moon") return moonLongitude;
  if (key === "Rahu") return rahuLongitude;
  if (key === "Ketu") return (jd: number) => norm360(rahuLongitude(jd) + 180);
  return (jd: number) => planetLongitude(key, jd);
}

/** Classical Chandra-gochar auspicious houses from the natal Moon. */
const GOOD_FROM_MOON: Record<PlanetKey, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [3, 6, 10, 11],
};

export function computeTransits(k: Kundli, when: Date = new Date()): TransitReport {
  const jd =
    julianDay(when.getUTCFullYear(), when.getUTCMonth() + 1, when.getUTCDate()) +
    (when.getUTCHours() + when.getUTCMinutes() / 60) / 24;
  const ay = ayanamsa(jd);
  const moonSign = k.moonSign;
  const ascSign = k.ascendant.sign;

  const planets: TransitPlanet[] = ORDER.map((key) => {
    const f = fn(key);
    const lon = norm360(f(jd) - ay);
    const sign = Math.floor(lon / 30);
    const speed = key === "Rahu" || key === "Ketu" ? -0.053 : dailyMotion(f, jd);
    const fromMoon = ((sign - moonSign + 12) % 12) + 1;
    const fromLagna = ((sign - ascSign + 12) % 12) + 1;
    const favourable = GOOD_FROM_MOON[key].includes(fromMoon);
    const effect: TransitPlanet["effect"] = favourable
      ? "good"
      : [6, 8, 12].includes(fromMoon)
        ? "hard"
        : "mixed";
    return {
      key,
      sign,
      degreeInSign: lon - sign * 30,
      retrograde: speed < 0,
      fromMoon,
      fromLagna,
      effect,
      note: `${key} transits ${SIGNS[sign].en}, the ${fromMoon}th from your Moon and ${fromLagna}th from Lagna — ${
        favourable ? "a supportive gochar position" : effect === "hard" ? "a demanding gochar position" : "a mixed gochar position"
      }.`,
    };
  });

  const saturn = planets.find((p) => p.key === "Saturn")!;
  const sadeSatiHouses = [12, 1, 2];
  const active = sadeSatiHouses.includes(saturn.fromMoon);
  const phase =
    saturn.fromMoon === 12
      ? "Rising phase (first dhaiya)"
      : saturn.fromMoon === 1
        ? "Peak phase (second dhaiya)"
        : saturn.fromMoon === 2
          ? "Setting phase (third dhaiya)"
          : saturn.fromMoon === 4 || saturn.fromMoon === 8
            ? "Dhaiya (small panoti)"
            : "Not running";

  const sadeSati = {
    active,
    phase,
    note: active
      ? "Saturn is moving through the Sade Sati zone around your natal Moon. Expect responsibility, slower results and inner restructuring. Recite Hanuman Chalisa, serve elders, donate black sesame on Saturdays."
      : saturn.fromMoon === 4 || saturn.fromMoon === 8
        ? "A Dhaiya (2.5-year small Saturn phase) is running — steady effort and discipline will carry you through."
        : "No Sade Sati or Dhaiya is running right now.",
  };

  const jup = planets.find((p) => p.key === "Jupiter")!;
  const jupiter = {
    house: jup.fromMoon,
    note: [2, 5, 7, 9, 11].includes(jup.fromMoon)
      ? "Guru's transit is favourable — good window for growth, learning, marriage talks and financial expansion."
      : "Guru's transit is not in a classical benefic house from the Moon — consolidate rather than expand for now.",
  };

  const highlights = [
    ...planets
      .filter((p) => p.effect === "good" && ["Jupiter", "Saturn", "Rahu", "Ketu"].includes(p.key))
      .map((p) => `${p.key} is well placed in ${SIGNS[p.sign].en} (${p.fromMoon}th from Moon).`),
    ...planets
      .filter((p) => p.effect === "hard" && ["Jupiter", "Saturn", "Mars", "Rahu", "Ketu"].includes(p.key))
      .map((p) => `${p.key} in ${SIGNS[p.sign].en} (${p.fromMoon}th from Moon) needs caution.`),
  ];

  return { date: when, planets, sadeSati, jupiter, highlights };
}
