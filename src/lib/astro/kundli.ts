import {
  ascendantLongitude,
  ayanamsa,
  dailyMotion,
  julianDay,
  midheavenLongitude,
  moonLongitude,
  norm360,
  planetLongitude,
  rahuLongitude,
  sunLongitude,
} from "./ephemeris";
import {
  DASHA_ORDER,
  DASHA_YEARS,
  KARANAS,
  NAKSHATRAS,
  PLANET_META,
  SIGNS,
  TITHIS,
  WEEKDAYS,
  YOGAS_PANCHANG,
  type PlanetKey,
} from "./data";

export type BirthInput = {
  name: string;
  gender: string;
  date: string; // yyyy-mm-dd (local)
  time: string; // HH:mm (local, 24h)
  place: string;
  lat: number;
  lon: number;
  tz: number;
};

export type PlanetPosition = {
  key: PlanetKey;
  longitude: number; // sidereal
  sign: number; // 0-11
  degreeInSign: number;
  nakshatra: number;
  pada: number;
  house: number; // 1-12 whole sign from lagna
  retrograde: boolean;
  speed: number;
  dignity: string;
  combust: boolean;
  strength: number; // 0-100 simplified Shadbala-style score
};

export type DashaPeriod = {
  lord: string;
  start: Date;
  end: Date;
  antar?: DashaPeriod[];
};

export type Kundli = {
  input: BirthInput;
  jd: number;
  ayanamsa: number;
  ascendant: { longitude: number; sign: number; degreeInSign: number; nakshatra: number };
  midheaven: number;
  planets: PlanetPosition[];
  moonSign: number;
  sunSign: number;
  panchang: {
    tithi: string;
    paksha: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    weekday: string;
    weekdayHi: string;
  };
  dashas: DashaPeriod[];
  currentDasha: { maha: DashaPeriod; antar: DashaPeriod } | null;
  yogas: { name: string; detail: string; type: "good" | "caution" }[];
  doshas: {
    name: string;
    present: boolean;
    severity: string;
    reason: string;
    remedy: string;
  }[];
  houseLords: { house: number; sign: number; lord: PlanetKey; lordHouse: number }[];
};

const ORDER: PlanetKey[] = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
];

function siderealFn(key: PlanetKey): (jd: number) => number {
  switch (key) {
    case "Sun":
      return sunLongitude;
    case "Moon":
      return moonLongitude;
    case "Rahu":
      return rahuLongitude;
    case "Ketu":
      return (jd: number) => norm360(rahuLongitude(jd) + 180);
    default:
      return (jd: number) => planetLongitude(key, jd);
  }
}

function dignityOf(key: PlanetKey, sign: number): string {
  const m = PLANET_META[key];
  if (m.exalt === sign) return "Exalted (उच्च)";
  if (m.debil === sign) return "Debilitated (नीच)";
  if (m.mool === sign) return "Mool Trikona";
  if (m.own.includes(sign)) return "Own sign (स्वक्षेत्र)";
  const lord = SIGNS[sign].lord as PlanetKey;
  if (m.friends.includes(lord)) return "Friendly sign";
  if (m.enemies.includes(lord)) return "Enemy sign";
  return "Neutral sign";
}

function strengthOf(p: {
  key: PlanetKey;
  sign: number;
  degreeInSign: number;
  house: number;
  retrograde: boolean;
  combust: boolean;
}): number {
  let score = 50;
  const d = dignityOf(p.key, p.sign);
  if (d.startsWith("Exalted")) score += 25;
  else if (d.startsWith("Mool")) score += 20;
  else if (d.startsWith("Own")) score += 15;
  else if (d.startsWith("Friendly")) score += 8;
  else if (d.startsWith("Enemy")) score -= 12;
  else if (d.startsWith("Debilitated")) score -= 25;

  // Dig bala / house strength (kendra & trikona strong, dusthana weak)
  if ([1, 4, 7, 10].includes(p.house)) score += 8;
  if ([5, 9].includes(p.house)) score += 6;
  if ([6, 8, 12].includes(p.house)) score -= 10;

  // Avastha by degree: infant/old degrees are weaker
  if (p.degreeInSign < 3 || p.degreeInSign > 27) score -= 6;
  if (p.retrograde) score += 4;
  if (p.combust) score -= 12;
  return Math.max(3, Math.min(100, Math.round(score)));
}

export function computeKundli(input: BirthInput): Kundli {
  const [y, mo, d] = input.date.split("-").map(Number);
  const [hh, mm] = input.time.split(":").map(Number);
  const utHours = hh + mm / 60 - input.tz;
  const jd = julianDay(y, mo, d, 0, 0, 0) + utHours / 24;
  const ay = ayanamsa(jd);

  const ascTropical = ascendantLongitude(jd, input.lat, input.lon);
  const ascSid = norm360(ascTropical - ay);
  const ascSign = Math.floor(ascSid / 30);

  const sunSid = norm360(sunLongitude(jd) - ay);

  const planets: PlanetPosition[] = ORDER.map((key) => {
    const fn = siderealFn(key);
    const trop = fn(jd);
    const lon = norm360(trop - ay);
    const sign = Math.floor(lon / 30);
    const speed = key === "Rahu" || key === "Ketu" ? -0.053 : dailyMotion(fn, jd);
    const degreeInSign = lon - sign * 30;
    const nak = Math.floor(lon / (360 / 27));
    const pada = Math.floor((lon % (360 / 27)) / (360 / 108)) + 1;
    const house = ((sign - ascSign + 12) % 12) + 1;
    let sep = Math.abs(lon - sunSid);
    if (sep > 180) sep = 360 - sep;
    const combustLimit: Partial<Record<PlanetKey, number>> = {
      Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
    };
    const limit = combustLimit[key];
    const combust = !!limit && sep < limit;
    const base = {
      key,
      longitude: lon,
      sign,
      degreeInSign,
      nakshatra: nak,
      pada,
      house,
      retrograde: speed < 0,
      speed,
      combust,
    };
    return {
      ...base,
      dignity: dignityOf(key, sign),
      strength: strengthOf(base),
    };
  });

  const moon = planets[1];
  const sun = planets[0];

  /* ----------------------------- Panchang ---------------------------- */
  const moonTrop = moonLongitude(jd);
  const sunTrop = sunLongitude(jd);
  const elong = norm360(moonTrop - sunTrop);
  const tithiIdx = Math.floor(elong / 12);
  const paksha = tithiIdx < 15 ? "Shukla (waxing)" : "Krishna (waning)";
  const tithiName =
    tithiIdx % 15 === 14
      ? tithiIdx < 15
        ? "Purnima"
        : "Amavasya"
      : TITHIS[tithiIdx % 15];
  const yogaIdx = Math.floor(norm360(moonTrop + sunTrop) / (360 / 27));
  const karanaIdx = Math.floor(elong / 6);
  const weekdayIdx = Math.floor(jd + 1.5 + input.tz / 24) % 7;

  /* --------------------------- Vimshottari --------------------------- */
  const nakSpan = 360 / 27;
  const moonNak = moon.nakshatra;
  const startLordIdx = DASHA_ORDER.indexOf(NAKSHATRAS[moonNak].lord as string);
  const elapsedFrac = (moon.longitude % nakSpan) / nakSpan;
  const birth = new Date(Date.UTC(y, mo - 1, d, 0, 0, 0));
  birth.setUTCMinutes(birth.getUTCMinutes() + hh * 60 + mm);
  const YEAR_MS = 365.2425 * 24 * 3600 * 1000;

  const dashas: DashaPeriod[] = [];
  let cursor = new Date(birth.getTime() - elapsedFrac * DASHA_YEARS[DASHA_ORDER[startLordIdx]] * YEAR_MS);
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startLordIdx + i) % 9];
    const len = DASHA_YEARS[lord] * YEAR_MS;
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + len);
    // antar dashas
    const antar: DashaPeriod[] = [];
    let aCursor = new Date(start);
    const lordIdx = DASHA_ORDER.indexOf(lord);
    for (let j = 0; j < 9; j++) {
      const aLord = DASHA_ORDER[(lordIdx + j) % 9];
      const aLen = (DASHA_YEARS[aLord] / 120) * len;
      antar.push({
        lord: aLord,
        start: new Date(aCursor),
        end: new Date(aCursor.getTime() + aLen),
      });
      aCursor = new Date(aCursor.getTime() + aLen);
    }
    dashas.push({ lord, start, end, antar });
    cursor = end;
  }
  const now = new Date();
  const maha = dashas.find((p) => now >= p.start && now < p.end) ?? null;
  const antarNow = maha?.antar?.find((p) => now >= p.start && now < p.end) ?? null;

  /* ------------------------------ Yogas ------------------------------ */
  const yogas: Kundli["yogas"] = [];
  const byKey = Object.fromEntries(planets.map((p) => [p.key, p])) as Record<PlanetKey, PlanetPosition>;
  const kendra = [1, 4, 7, 10];
  if (kendra.includes(byKey.Moon.house) === false) {
    const diff = Math.abs(byKey.Moon.house - byKey.Jupiter.house);
    if ([3, 6, 9, 0].includes(diff % 12)) {
      /* handled below */
    }
  }
  const jupFromMoon = ((byKey.Jupiter.sign - byKey.Moon.sign + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(jupFromMoon))
    yogas.push({
      name: "Gaja Kesari Yoga",
      detail: "Jupiter sits in a kendra from the Moon — grants intelligence, respect, steady rise and moral strength.",
      type: "good",
    });
  const moonHouseFromSun = ((byKey.Moon.sign - byKey.Sun.sign + 12) % 12) + 1;
  if ([7, 6, 8].includes(moonHouseFromSun))
    yogas.push({
      name: "Sunapha / Anapha family (Chandra yogas)",
      detail: "Moon is well separated from the Sun, giving independent thinking and self-earned wealth.",
      type: "good",
    });
  planets.forEach((p) => {
    if (p.dignity.startsWith("Exalted"))
      yogas.push({
        name: `${p.key} exalted — Uccha Yoga`,
        detail: `${p.key} is at its peak strength in ${SIGNS[p.sign].en}, powerfully supporting ${PLANET_META[p.key].signifies.split(",")[0].toLowerCase()}.`,
        type: "good",
      });
    if (p.dignity.startsWith("Debilitated"))
      yogas.push({
        name: `${p.key} debilitated — needs support`,
        detail: `${p.key} in ${SIGNS[p.sign].en} works with effort; strengthen it through the listed remedies before big decisions.`,
        type: "caution",
      });
  });
  if (byKey.Moon.house === byKey.Mars.house)
    yogas.push({
      name: "Chandra-Mangal Yoga",
      detail: "Moon with Mars — strong drive for earning, business instinct, but keep emotions cool.",
      type: "good",
    });
  const budhaAditya = byKey.Sun.sign === byKey.Mercury.sign;
  if (budhaAditya)
    yogas.push({
      name: "Budha-Aditya Yoga",
      detail: "Sun and Mercury together — sharp intellect, administrative skill, good communication and learning.",
      type: "good",
    });

  /* ------------------------------ Doshas ----------------------------- */
  const marsHouse = byKey.Mars.house;
  const mangalHouses = [1, 2, 4, 7, 8, 12];
  const mangal = mangalHouses.includes(marsHouse);
  const rahuH = byKey.Rahu.house;
  const ketuH = byKey.Ketu.house;
  const between = (h: number, a: number, b: number) => {
    const span = (b - a + 12) % 12;
    const rel = (h - a + 12) % 12;
    return rel > 0 && rel < span;
  };
  const others = planets.filter((p) => p.key !== "Rahu" && p.key !== "Ketu");
  const allOneSide =
    others.every((p) => between(p.house, rahuH, ketuH)) ||
    others.every((p) => between(p.house, ketuH, rahuH));
  const pitra =
    [byKey.Sun, byKey.Saturn, byKey.Rahu].some((p) => p.house === 9) ||
    byKey.Sun.house === 12 ||
    (byKey.Rahu.house === 9 || byKey.Ketu.house === 9);

  const doshas: Kundli["doshas"] = [
    {
      name: "Mangal Dosha (Manglik)",
      present: mangal,
      severity: mangal ? ([7, 8].includes(marsHouse) ? "High" : [1, 4, 12].includes(marsHouse) ? "Medium" : "Low") : "None",
      reason: mangal
        ? `Mars occupies house ${marsHouse} from the ascendant, one of the classical Manglik positions.`
        : `Mars is in house ${marsHouse}, outside the Manglik houses (1,2,4,7,8,12).`,
      remedy:
        "Tuesday fast, Hanuman Chalisa / Sundarkand recitation, ॐ अं अंगारकाय नमः 10,000 times, donate red masoor dal and jaggery, Mangal Shanti puja before marriage.",
    },
    {
      name: "Kaal Sarp Dosha",
      present: allOneSide,
      severity: allOneSide ? "Medium to High" : "None",
      reason: allOneSide
        ? `All seven grahas fall on one side of the Rahu (house ${rahuH}) – Ketu (house ${ketuH}) axis.`
        : "Planets are distributed on both sides of the Rahu–Ketu axis, so the dosha does not form.",
      remedy:
        "Rahu-Ketu Shanti at Trimbakeshwar/Ujjain, Maha Mrityunjaya Jaap, Saturday Rahu charity (urad dal, mustard oil, blanket), flowing coconut in a river, 8-mukhi Rudraksha.",
    },
    {
      name: "Pitra Dosha",
      present: pitra,
      severity: pitra ? "Medium" : "None",
      reason: pitra
        ? "Sun / Saturn / Rahu influence the 9th house of the father and ancestors, or the Sun falls in the 12th."
        : "The 9th house and Sun are free of the classical afflictions indicating ancestral debt.",
      remedy:
        "Pitra Paksha shraddha and tarpan, Gaya/Haridwar pind daan, feed crows and cows, Sunday water offering to the Sun, ॐ पितृ देवाय नमः, help elderly relatives.",
    },
    {
      name: "Shani Dosha (Saturn pressure)",
      present: [1, 4, 7, 8, 10, 12].includes(byKey.Saturn.house) && byKey.Saturn.strength < 55,
      severity: byKey.Saturn.strength < 40 ? "High" : "Low to Medium",
      reason: `Saturn sits in house ${byKey.Saturn.house} with a computed strength of ${byKey.Saturn.strength}%.`,
      remedy:
        "Saturday fast, mustard-oil lamp under a peepal tree, Hanuman Chalisa, donate black sesame and iron, serve labourers and the elderly, ॐ शं शनैश्चराय नमः.",
    },
  ];

  const houseLords = Array.from({ length: 12 }, (_, i) => {
    const sign = (ascSign + i) % 12;
    const lord = SIGNS[sign].lord as PlanetKey;
    const lp = planets.find((p) => p.key === lord)!;
    return { house: i + 1, sign, lord, lordHouse: lp.house };
  });

  return {
    input,
    jd,
    ayanamsa: ay,
    ascendant: {
      longitude: ascSid,
      sign: ascSign,
      degreeInSign: ascSid - ascSign * 30,
      nakshatra: Math.floor(ascSid / nakSpan),
    },
    midheaven: norm360(midheavenLongitude(jd, input.lon) - ay),
    planets,
    moonSign: moon.sign,
    sunSign: sun.sign,
    panchang: {
      tithi: `${tithiName}`,
      paksha,
      nakshatra: `${NAKSHATRAS[moon.nakshatra].en} (pada ${moon.pada})`,
      yoga: YOGAS_PANCHANG[yogaIdx] ?? "—",
      karana: KARANAS[karanaIdx % 7],
      weekday: WEEKDAYS[weekdayIdx].en,
      weekdayHi: WEEKDAYS[weekdayIdx].hi,
    },
    dashas,
    currentDasha: maha && antarNow ? { maha, antar: antarNow } : null,
    yogas,
    doshas,
    houseLords,
  };
}

export function formatDegree(deg: number): string {
  let total = Math.round(deg * 3600);
  const d = Math.floor(total / 3600);
  total -= d * 3600;
  const m = Math.floor(total / 60);
  const s = total - m * 60;
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

/** Divisional chart sign for a longitude (D-9, D-10, D-2, D-12, D-7, D-30 etc.). */
export function divisionalSign(longitude: number, division: number): number {
  const sign = Math.floor(longitude / 30);
  const posInSign = longitude - sign * 30;
  const part = Math.floor((posInSign / 30) * division);
  switch (division) {
    case 1:
      return sign;
    case 9:
      return (sign * 9 + part) % 12;
    case 10:
      return (sign % 2 === 0 ? sign + part : sign + 8 + part) % 12;
    case 2:
      return sign % 2 === 0 ? (part === 0 ? 4 : 3) : part === 0 ? 3 : 4;
    case 12:
      return (sign + part) % 12;
    case 7:
      return (sign % 2 === 0 ? sign + part : sign + 6 + part) % 12;
    case 3:
      return (sign + part * 4) % 12;
    case 4:
      return (sign + part * 3) % 12;
    case 30: {
      const odd = sign % 2 === 0;
      const limits = [5, 10, 18, 25, 30];
      const lords = odd ? [0, 10, 8, 2, 7] : [7, 2, 8, 10, 0];
      for (let i = 0; i < 5; i++) if (posInSign < limits[i]) return lords[i];
      return lords[4];
    }
    default:
      return (sign * division + part) % 12;
  }
}
