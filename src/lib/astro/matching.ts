import { NAKSHATRAS, PLANET_META, SIGNS, type PlanetKey } from "./data";
import type { Kundli } from "./kundli";

export type Koot = {
  name: string;
  hi: string;
  max: number;
  score: number;
  detail: string;
};

export type MatchResult = {
  koots: Koot[];
  total: number;
  max: number;
  verdict: string;
  mangal: { boy: boolean; girl: boolean; note: string };
  notes: string[];
};

/* ------------------------------ tables ------------------------------- */

const VARNA = ["Kshatriya", "Vaishya", "Shudra", "Brahmin"]; // by sign % 4 pattern below
const varnaOf = (sign: number) => VARNA[sign % 4];
const VARNA_RANK: Record<string, number> = { Shudra: 1, Vaishya: 2, Kshatriya: 3, Brahmin: 4 };

const VASHYA = [
  "Chatushpad", "Chatushpad", "Manav", "Jalachar", "Vanachar", "Manav",
  "Manav", "Keet", "Manav", "Jalachar", "Manav", "Jalachar",
];
const VASHYA_SCORE: Record<string, Record<string, number>> = {
  Chatushpad: { Chatushpad: 2, Manav: 1, Jalachar: 1, Vanachar: 0, Keet: 1 },
  Manav: { Chatushpad: 0, Manav: 2, Jalachar: 1, Vanachar: 0.5, Keet: 1 },
  Jalachar: { Chatushpad: 1, Manav: 1, Jalachar: 2, Vanachar: 0, Keet: 1 },
  Vanachar: { Chatushpad: 1, Manav: 0, Jalachar: 1, Vanachar: 2, Keet: 1 },
  Keet: { Chatushpad: 1, Manav: 1, Jalachar: 0.5, Vanachar: 1, Keet: 2 },
};

const YONI = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat",
  "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer",
  "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant",
];
const YONI_ENEMY: [string, string][] = [
  ["Horse", "Buffalo"], ["Elephant", "Lion"], ["Sheep", "Monkey"], ["Serpent", "Mongoose"],
  ["Dog", "Deer"], ["Cat", "Rat"], ["Cow", "Tiger"],
];

const GANA_DEV = [0, 4, 6, 7, 12, 14, 16, 21, 26];
const GANA_MAN = [1, 3, 5, 10, 11, 19, 20, 23, 25];
const ganaOf = (n: number) =>
  GANA_DEV.includes(n) ? "Deva" : GANA_MAN.includes(n) ? "Manushya" : "Rakshasa";

const NADI_ADI = [0, 5, 6, 11, 12, 17, 18, 23, 24];
const NADI_MADHYA = [1, 4, 7, 10, 13, 16, 19, 22, 25];
const nadiOf = (n: number) =>
  NADI_ADI.includes(n) ? "Aadi" : NADI_MADHYA.includes(n) ? "Madhya" : "Antya";

/* ------------------------------ helpers ------------------------------ */

function relation(a: PlanetKey, b: PlanetKey): number {
  if (a === b) return 2;
  const m = PLANET_META[a];
  if (m.friends.includes(b)) return 2;
  if (m.enemies.includes(b)) return 0;
  return 1;
}

function yoniScore(a: number, b: number): number {
  const ya = YONI[a];
  const yb = YONI[b];
  if (ya === yb) return 4;
  const enemy = YONI_ENEMY.some(([x, y]) => (x === ya && y === yb) || (x === yb && y === ya));
  if (enemy) return 0;
  return 2;
}

function mangalDosha(k: Kundli): boolean {
  const mars = k.planets.find((p) => p.key === "Mars")!;
  const fromLagna = [1, 2, 4, 7, 8, 12].includes(mars.house);
  const moonSign = k.moonSign;
  const fromMoon = ((mars.sign - moonSign + 12) % 12) + 1;
  return fromLagna || [1, 2, 4, 7, 8, 12].includes(fromMoon);
}

/* ------------------------------- main -------------------------------- */

export function matchKundlis(boy: Kundli, girl: Kundli): MatchResult {
  const bMoon = boy.planets[1];
  const gMoon = girl.planets[1];
  const bSign = boy.moonSign;
  const gSign = girl.moonSign;
  const bNak = bMoon.nakshatra;
  const gNak = gMoon.nakshatra;

  // 1. Varna
  const bv = varnaOf(bSign);
  const gv = varnaOf(gSign);
  const varna: Koot = {
    name: "Varna",
    hi: "वर्ण",
    max: 1,
    score: VARNA_RANK[bv] >= VARNA_RANK[gv] ? 1 : 0,
    detail: `Groom ${bv}, bride ${gv} — spiritual compatibility and ego balance.`,
  };

  // 2. Vashya
  const vashyaScore = VASHYA_SCORE[VASHYA[bSign]][VASHYA[gSign]];
  const vashya: Koot = {
    name: "Vashya",
    hi: "वश्य",
    max: 2,
    score: vashyaScore,
    detail: `${VASHYA[bSign]} & ${VASHYA[gSign]} — mutual influence and attraction.`,
  };

  // 3. Tara
  const t1 = ((gNak - bNak + 27) % 27) + 1;
  const t2 = ((bNak - gNak + 27) % 27) + 1;
  const good = (t: number) => ![3, 5, 7].includes(t % 9 === 0 ? 9 : t % 9);
  const taraScore = (good(t1) ? 1.5 : 0) + (good(t2) ? 1.5 : 0);
  const tara: Koot = {
    name: "Tara",
    hi: "तारा",
    max: 3,
    score: taraScore,
    detail: `Birth-star counts ${t1} & ${t2} — health, destiny and longevity of the bond.`,
  };

  // 4. Yoni
  const yoni: Koot = {
    name: "Yoni",
    hi: "योनि",
    max: 4,
    score: yoniScore(bNak, gNak),
    detail: `${YONI[bNak]} & ${YONI[gNak]} — physical and intimate compatibility.`,
  };

  // 5. Graha Maitri
  const bl = SIGNS[bSign].lord as PlanetKey;
  const gl = SIGNS[gSign].lord as PlanetKey;
  const rel = relation(bl, gl) + relation(gl, bl);
  const maitriMap: Record<number, number> = { 4: 5, 3: 4, 2: 3, 1: 1, 0: 0 };
  const maitri: Koot = {
    name: "Graha Maitri",
    hi: "ग्रह मैत्री",
    max: 5,
    score: maitriMap[rel],
    detail: `Moon-sign lords ${bl} & ${gl} — mental friendship and shared values.`,
  };

  // 6. Gana
  const bg = ganaOf(bNak);
  const gg = ganaOf(gNak);
  let ganaScore = 0;
  if (bg === gg) ganaScore = 6;
  else if ((bg === "Deva" && gg === "Manushya") || (bg === "Manushya" && gg === "Deva")) ganaScore = 5;
  else if (bg === "Deva" || gg === "Deva") ganaScore = 1;
  else ganaScore = 0;
  const gana: Koot = {
    name: "Gana",
    hi: "गण",
    max: 6,
    score: ganaScore,
    detail: `${bg} & ${gg} temperament — daily conduct and emotional nature.`,
  };

  // 7. Bhakoot
  const d1 = ((gSign - bSign + 12) % 12) + 1;
  const d2 = ((bSign - gSign + 12) % 12) + 1;
  const bad = [
    [6, 8],
    [9, 5],
    [12, 2],
  ].some(([a, b]) => (d1 === a && d2 === b) || (d1 === b && d2 === a));
  const bhakoot: Koot = {
    name: "Bhakoot",
    hi: "भकूट",
    max: 7,
    score: bad ? 0 : 7,
    detail: bad
      ? `Moon signs form a ${d1}/${d2} axis — classical Bhakoot dosha affecting prosperity.`
      : `Moon signs ${SIGNS[bSign].en} & ${SIGNS[gSign].en} sit in a supportive ${d1}/${d2} axis.`,
  };

  // 8. Nadi
  const bn = nadiOf(bNak);
  const gn = nadiOf(gNak);
  const nadi: Koot = {
    name: "Nadi",
    hi: "नाड़ी",
    max: 8,
    score: bn === gn ? 0 : 8,
    detail:
      bn === gn
        ? `Both in ${bn} nadi — Nadi dosha; classically linked to progeny and health.`
        : `${bn} & ${gn} nadi — healthy constitutional difference.`,
  };

  const koots = [varna, vashya, tara, yoni, maitri, gana, bhakoot, nadi];
  const total = koots.reduce((s, k) => s + k.score, 0);

  let verdict = "";
  if (total >= 28) verdict = "Excellent match — highly recommended.";
  else if (total >= 24) verdict = "Very good match — recommended.";
  else if (total >= 18) verdict = "Acceptable match — workable with awareness and remedies.";
  else if (total >= 12) verdict = "Weak match — proceed only with remedies and counselling.";
  else verdict = "Not recommended by Ashtakoot standards.";

  const boyM = mangalDosha(boy);
  const girlM = mangalDosha(girl);
  const mangal = {
    boy: boyM,
    girl: girlM,
    note:
      boyM && girlM
        ? "Both charts carry Mangal dosha — it cancels mutually, which is considered favourable."
        : boyM || girlM
          ? `Only the ${boyM ? "groom" : "bride"}'s chart carries Mangal dosha — Mangal shanti, Hanuman Chalisa and Tuesday fasting are advised before marriage.`
          : "Neither chart carries Mangal dosha.",
  };

  const notes: string[] = [];
  if (nadi.score === 0)
    notes.push(
      "Nadi dosha is cancelled when both share the same moon sign but different nakshatras, or the same nakshatra with different padas — check with an astrologer.",
    );
  if (bhakoot.score === 0)
    notes.push("Bhakoot dosha is considered cancelled when Graha Maitri scores 5 out of 5.");
  notes.push(
    `Janma nakshatras: ${NAKSHATRAS[bNak].en} (groom) and ${NAKSHATRAS[gNak].en} (bride).`,
  );

  return { koots, total, max: 36, verdict, mangal, notes };
}
