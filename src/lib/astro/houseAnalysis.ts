import { HOUSES, NAKSHATRAS, PLANET_META, SIGNS, type PlanetKey } from "./data";
import { divisionalSign, formatDegree, type Kundli, type PlanetPosition } from "./kundli";
import { HOUSE_EFFECT, SIGN_TRAITS } from "./interpret";
import { buildLalKitab } from "./lalkitab";

/* ---------------------------- reference tables --------------------------- */

/** Naisargik karaka — har bhav ka prakritik swami. */
export const HOUSE_KARAKA: PlanetKey[][] = [
  ["Sun"],
  ["Jupiter", "Mercury"],
  ["Mars"],
  ["Moon", "Venus"],
  ["Jupiter"],
  ["Mars", "Saturn"],
  ["Venus"],
  ["Saturn"],
  ["Jupiter", "Sun"],
  ["Sun", "Mercury", "Jupiter", "Saturn"],
  ["Jupiter"],
  ["Saturn"],
];

/** Graha drishti — kaun sa graha apne sthaan se kitne ghar aage dekhta hai. */
const ASPECTS: Record<PlanetKey, number[]> = {
  Sun: [7],
  Moon: [7],
  Mars: [4, 7, 8],
  Mercury: [7],
  Jupiter: [5, 7, 9],
  Venus: [7],
  Saturn: [3, 7, 10],
  Rahu: [5, 7, 9],
  Ketu: [5, 7, 9],
};

const HOUSE_GROUP = (h: number) =>
  [1, 4, 7, 10].includes(h)
    ? "Kendra (stambh bhav)"
    : [1, 5, 9].includes(h)
      ? "Trikona (bhagya bhav)"
      : [6, 8, 12].includes(h)
        ? "Dusthana (kasht bhav)"
        : [3, 6, 10, 11].includes(h)
          ? "Upachaya (badhne wala bhav)"
          : "Samanya bhav";

export type HouseSection = { title: string; lines: string[] };

export type HouseAnalysis = {
  house: number;
  title: string;
  hi: string;
  areas: string;
  sign: number;
  lord: PlanetKey;
  score: number;
  grade: string;
  verdict: string;
  sections: HouseSection[];
  links: string[];
};

const grade = (s: number) =>
  s >= 72 ? "Bahut mazboot" : s >= 58 ? "Mazboot" : s >= 45 ? "Madhyam" : s >= 32 ? "Kamzor" : "Bahut kamzor";

/** Poora bhav vishleshan — placement, drishti, dasha, vargottama, yoga, Lal Kitab sab jodta hai. */
export function analyzeHouse(k: Kundli, house: number): HouseAnalysis {
  const info = HOUSES[house - 1];
  const hl = k.houseLords[house - 1];
  const sign = hl.sign;
  const lord = hl.lord;
  const lordP = k.planets.find((p) => p.key === lord)!;
  const occupants = k.planets.filter((p) => p.house === house);
  const trait = SIGN_TRAITS[SIGNS[sign].en];
  const karakas = HOUSE_KARAKA[house - 1];
  const lk = buildLalKitab(k);

  /* -------------------------- aspects on the house ------------------------ */
  const aspecting = k.planets
    .filter((p) => ASPECTS[p.key].some((a) => ((p.house + a - 2) % 12) + 1 === house))
    .map((p) => {
      const a = ASPECTS[p.key].find((x) => ((p.house + x - 2) % 12) + 1 === house)!;
      return { p, a };
    });

  /* ------------------------ other houses linked here ---------------------- */
  const lordsSittingHere = k.houseLords.filter((h) => {
    const lp = k.planets.find((p) => p.key === h.lord)!;
    return lp.house === house;
  });

  /* ------------------------------- scoring -------------------------------- */
  let score = 45;
  score += Math.round((lordP.strength - 50) * 0.35);
  occupants.forEach((p) => {
    const ben = PLANET_META[p.key].nature;
    score += ben === "Benefic" ? 7 : ben === "Malefic" ? -5 : 2;
    score += Math.round((p.strength - 50) * 0.15);
  });
  aspecting.forEach(({ p }) => {
    score += PLANET_META[p.key].nature === "Benefic" ? 4 : PLANET_META[p.key].nature === "Malefic" ? -3 : 1;
  });
  if ([6, 8, 12].includes(lordP.house)) score -= 8;
  if ([1, 4, 5, 7, 9, 10].includes(lordP.house)) score += 6;
  if (lordP.dignity.startsWith("Exalted")) score += 8;
  if (lordP.dignity.startsWith("Debilitated")) score -= 8;
  karakas.forEach((kk) => {
    const kp = k.planets.find((p) => p.key === kk)!;
    score += Math.round((kp.strength - 50) * 0.08);
  });
  score = Math.max(5, Math.min(97, Math.round(score)));

  /* ------------------------------- sections ------------------------------- */
  const sections: HouseSection[] = [];
  const links: string[] = [];

  sections.push({
    title: "Ye bhav kya dekhta hai",
    lines: [
      `${info.hi} · ${info.title} — ${info.areas}.`,
      `Ye ${HOUSE_GROUP(house)} hai, isliye iska asar ${
        HOUSE_GROUP(house).startsWith("Kendra")
          ? "zindagi ke dhaanche par seedha padta hai"
          : HOUSE_GROUP(house).startsWith("Trikona")
            ? "bhagya aur punya par padta hai"
            : HOUSE_GROUP(house).startsWith("Dusthana")
              ? "sangharsh, rog aur badlav ke roop mein aata hai (mehnat se sudhrta hai)"
              : "umr ke saath badhta jaata hai"
      }.`,
      `Rashi ${SIGNS[sign].en} (${SIGNS[sign].hi}) — ${SIGNS[sign].element} tatva, ${SIGNS[sign].nature} swabhav. ${trait.keyword}. Isliye is kshetra mein aap ${trait.strength.toLowerCase()} dikhate hain, aur ${trait.weakness.toLowerCase()} se bachna padta hai.`,
      `Naisargik karak: ${karakas.join(", ")} — ${karakas
        .map((kk) => {
          const kp = k.planets.find((p) => p.key === kk)!;
          return `${kk} bhav ${kp.house} mein ${kp.strength}% bal ke saath`;
        })
        .join("; ")}. Karak kamzor ho to bhav achha hote hue bhi phal dheere milta hai.`,
    ],
  });

  const occLines = occupants.length
    ? occupants.map((p) => {
        const nk = NAKSHATRAS[p.nakshatra];
        const own = k.houseLords.filter((h) => h.lord === p.key).map((h) => h.house);
        return `${p.key} (${PLANET_META[p.key].hi}) ${formatDegree(p.degreeInSign)} ${SIGNS[p.sign].en}, ${p.dignity}, bal ${p.strength}%${
          p.retrograde ? ", vakri" : ""
        }${p.combust ? ", asta (combust)" : ""} — ${HOUSE_EFFECT[p.key][house - 1]} Nakshatra ${nk.en} (swami ${nk.lord}) is phal ka rang tay karta hai.${
          own.length ? ` Kyunki ye graha bhav ${own.join(" aur ")} ka bhi swami hai, isliye ${own.join("/")} ke natije yahin aa kar jud jaate hain.` : ""
        }`;
      })
    : [
        `Is bhav mein koi graha nahi hai. Ye buri baat nahi — khaali bhav ka phal poori tarah uske swami ${lord} (bhav ${lordP.house}) aur us par padne wali drishti se tay hota hai.`,
      ];
  sections.push({ title: `Is ghar mein baithe grah (${occupants.length})`, lines: occLines });

  sections.push({
    title: "Bhav swami ka jaal (sabse important kadi)",
    lines: [
      `${house}th bhav ka swami ${lord} bhav ${lordP.house} (${SIGNS[lordP.sign].en}) mein hai, ${lordP.dignity}, bal ${lordP.strength}%${lordP.retrograde ? ", vakri" : ""}${lordP.combust ? ", Surya ke saath asta" : ""}.`,
      `Iska matlab: ${info.title} ke maamle ${HOUSES[lordP.house - 1].title} se jud jaate hain — yaani ${info.areas.split(",")[0].toLowerCase()} ka phal aapko ${HOUSES[lordP.house - 1].areas.split(",")[0].toLowerCase()} ke raste milega.`,
      lordP.strength >= 60
        ? `Swami mazboot hai, isliye is bhav ke natije apne aap banate hain.`
        : `Swami ka bal kam (${lordP.strength}%) hai — isi wajah se is kshetra mein mehnat zyada aur natija dheere aata hai. ${lord} ke upay seedha isi ghar ko sudharte hain.`,
      `${lord} ki drishti ${ASPECTS[lord].map((a) => ((lordP.house + a - 2) % 12) + 1).join(", ")} bhav par bhi hai, isliye ye bhav un kshetron ko bhi chalata hai.`,
    ],
  });
  links.push(
    `Bhav ${house} → bhav ${lordP.house}: swami ${lord} wahan baitha hai, isliye ${info.title} aur ${HOUSES[lordP.house - 1].title} ek dusre se bandhe hain.`,
  );

  sections.push({
    title: "Drishti (kaun is ghar ko dekh raha hai)",
    lines: aspecting.length
      ? aspecting.map(
          ({ p, a }) =>
            `${p.key} bhav ${p.house} se ${a}vin drishti daal raha hai — ${PLANET_META[p.key].nature === "Benefic" ? "shubh drishti, ye bhav ko sambhalta aur badhata hai" : PLANET_META[p.key].nature === "Malefic" ? "krur drishti, dabav ya deri deta hai par anushasan bhi laata hai" : "mishrit drishti"}. ${p.key} ka bal ${p.strength}% hai, isliye asar ${p.strength >= 60 ? "saaf dikhega" : "halka rahega"}.`,
        )
      : ["Kisi graha ki seedhi drishti nahi hai — bhav ka phal sirf swami aur rashi ke swabhav se chalega."],
  });

  sections.push({
    title: "Dusre bhav is ghar se kaise jude hain",
    lines: [
      lordsSittingHere.length
        ? `Bhav ${lordsSittingHere.map((h) => h.house).join(", ")} ke swami (${lordsSittingHere.map((h) => h.lord).join(", ")}) yahin baithe hain — isliye un kshetron ka phal is ghar se hokar guzarta hai.`
        : "Kisi aur bhav ka swami yahan nahi baitha, isliye ye ghar kaafi hadd tak swatantra hai.",
      `Ye bhav apne 7th (bhav ${((house + 5) % 12) + 1}) ko dekhta hai — dono ka santulan zaroori hai.`,
      `Chandra rashi se ye bhav ${((sign - k.planets[1].sign + 12) % 12) + 1}th padta hai, isliye mann par iska asar ${[1, 4, 7, 10].includes(((sign - k.planets[1].sign + 12) % 12) + 1) ? "seedha" : "paroksh"} hota hai.`,
      `Navamsa (D-9) mein is bhav ka swami ${lord} ${SIGNS[divisionalSign(lordP.longitude, 9)].en} mein jaata hai${
        divisionalSign(lordP.longitude, 9) === lordP.sign ? " — vargottama, yaani phal double mazboot" : " — isliye asli phal shaadi/paripakvta ke baad khulta hai"
      }.`,
    ],
  });
  lordsSittingHere.forEach((h) => {
    if (h.house !== house)
      links.push(`Bhav ${h.house} → bhav ${house}: uska swami ${h.lord} is ghar mein baitha hai.`);
  });

  /* ------------------------------ dasha link ------------------------------ */
  const dashaLines: string[] = [];
  if (k.currentDasha) {
    const { maha, antar } = k.currentDasha;
    [maha.lord, antar.lord].forEach((l, i) => {
      const pl = k.planets.find((p) => p.key === (l as PlanetKey));
      if (!pl) return;
      const rules = k.houseLords.filter((h) => h.lord === pl.key).map((h) => h.house);
      const touches =
        pl.house === house ||
        rules.includes(house) ||
        ASPECTS[pl.key].some((a) => ((pl.house + a - 2) % 12) + 1 === house);
      dashaLines.push(
        `${i === 0 ? "Mahadasha" : "Antardasha"} ${l}: ${
          touches
            ? `is bhav se seedha juda hai (${pl.house === house ? "yahin baitha hai" : rules.includes(house) ? "isi bhav ka swami hai" : "is bhav ko dekhta hai"}) — isliye abhi ${info.title.toLowerCase()} ke maamle active hain aur ghatnayein isi kshetra mein ho rahi hain.`
            : `is bhav se seedha juda nahi hai, isliye filhal ye kshetra background mein hai; iska samay ${lord} ya occupant grahon ki dasha mein aayega.`
        }`,
      );
    });
  }
  const upcoming = k.dashas.find((d) => d.lord === (lord as string) && d.end > new Date());
  if (upcoming)
    dashaLines.push(
      `${lord} ki mahadasha ${upcoming.start.getFullYear()}–${upcoming.end.getFullYear()} — is daur mein ${info.title.toLowerCase()} sabse zyada zor pakdega, kyunki swami khud samay chala raha hoga.`,
    );
  sections.push({ title: "Samay (Dasha) se connection", lines: dashaLines.length ? dashaLines : ["Dasha data uplabdh nahi."] });

  /* --------------------------- yoga / dosha link -------------------------- */
  const related = new Set<PlanetKey>([lord, ...occupants.map((p) => p.key), ...aspecting.map((a) => a.p.key)]);
  const yogaLines = k.yogas
    .filter((y) => [...related].some((r) => y.name.includes(r) || y.detail.includes(r)))
    .map((y) => `${y.name} — ${y.detail} Is bhav se juda hai kyunki isme ${[...related].filter((r) => y.name.includes(r) || y.detail.includes(r)).join(", ")} shaamil hai.`);
  const doshaLines = k.doshas
    .filter((d) => d.present)
    .map((d) => `${d.name}: ${d.reason} ${d.name.startsWith("Mangal") && [1, 2, 4, 7, 8, 12].includes(house) ? "Ye bhav Manglik zone mein aata hai, isliye yahan iska asar seedha padta hai." : "Iska paroksh asar is bhav par bhi rehta hai."}`);
  sections.push({
    title: "Yoga / Dosha jo is ghar ko chhoote hain",
    lines: [...yogaLines, ...doshaLines].length ? [...yogaLines, ...doshaLines] : ["Is bhav par koi vishesh yoga ya dosha lagu nahi hota."],
  });

  /* ------------------------------ Lal Kitab ------------------------------- */
  const lkHere = lk.planets.filter((p) => p.lkHouse === house);
  sections.push({
    title: "Lal Kitab nazariya",
    lines: [
      lkHere.length
        ? lkHere
            .map((p) => `${p.key} Lal Kitab ghar ${p.lkHouse} mein — ${p.effect} Sthiti: ${p.state}. ${p.stateWhy}`)
            .join(" ")
        : `Lal Kitab ke pakke ghar ${house} (${SIGNS[house - 1].en}) mein koi graha nahi — ghar khaali hone se iska phal ${SIGNS[house - 1].lord} ki halat par nirbhar karta hai.`,
      ...lkHere.slice(0, 1).flatMap((p) => p.upay.slice(0, 2).map((u) => `Upay: ${u}`)),
    ],
  });

  /* ------------------------------- remedies ------------------------------- */
  const weak = [lordP, ...occupants].filter((p) => p.strength < 55);
  sections.push({
    title: "Is ghar ko mazboot karne ke upay",
    lines: weak.length
      ? weak.map(
          (p) =>
            `${p.key} (bal ${p.strength}%) — ${PLANET_META[p.key].mantra} ka jaap ${PLANET_META[p.key].day} ko, ${PLANET_META[p.key].charity} ka daan, ${PLANET_META[p.key].rudraksha}. Ye seedha bhav ${house} ko uthata hai kyunki ${p.key} ${p.key === lord ? "iska swami hai" : "isme baitha hai"}.`,
        )
      : [`Is bhav ke sabhi grah theek bal mein hain — sirf ${lord} ke din (${PLANET_META[lord].day}) niyam banaye rakhein.`],
  });

  const verdict = `${info.title} ka bhav ${grade(score)} (${score}%) hai — mukhya wajah: swami ${lord} bhav ${lordP.house} mein ${lordP.strength}% bal ke saath, ${occupants.length ? `${occupants.map((p) => p.key).join(", ")} yahan baithe hain` : "koi graha yahan nahi"}, aur ${aspecting.length ? `${aspecting.map((a) => a.p.key).join(", ")} ki drishti` : "koi drishti nahi"}.`;

  return {
    house,
    title: info.title,
    hi: info.hi,
    areas: info.areas,
    sign,
    lord,
    score,
    grade: grade(score),
    verdict,
    sections,
    links,
  };
}

export function analyzeAllHouses(k: Kundli): HouseAnalysis[] {
  return Array.from({ length: 12 }, (_, i) => analyzeHouse(k, i + 1));
}

export type { PlanetPosition };
