import { HOUSES, NAKSHATRAS, PLANET_META, SIGNS, type PlanetKey } from "./data";
import type { Kundli, PlanetPosition } from "./kundli";

/* ------------------------- reference descriptions ------------------------ */

export const SIGN_TRAITS: Record<
  string,
  { keyword: string; strength: string; weakness: string; body: string }
> = {
  Aries: {
    keyword: "Pioneer — pehl karne wala, nirbhay",
    strength: "Initiative, courage, quick decisions, leadership",
    weakness: "Impatience, anger, half-finished projects",
    body: "Head, brain, eyes",
  },
  Taurus: {
    keyword: "Builder — sthir, sukh-priya",
    strength: "Patience, endurance, artistic taste, money sense",
    weakness: "Stubbornness, resistance to change, over-indulgence",
    body: "Face, throat, neck",
  },
  Gemini: {
    keyword: "Messenger — chatur, bahu-mukhi",
    strength: "Communication, learning speed, adaptability, wit",
    weakness: "Restlessness, scattered focus, nervousness",
    body: "Shoulders, arms, lungs",
  },
  Cancer: {
    keyword: "Nurturer — bhavuk, sanrakshak",
    strength: "Empathy, memory, family devotion, intuition",
    weakness: "Moodiness, over-attachment, hurt easily",
    body: "Chest, stomach, breasts",
  },
  Leo: {
    keyword: "Sovereign — atma-vishwasi, udaar",
    strength: "Confidence, generosity, authority, loyalty",
    weakness: "Ego, need for praise, dominance",
    body: "Heart, spine, upper back",
  },
  Virgo: {
    keyword: "Analyst — vivekshil, seva-bhavi",
    strength: "Precision, service, analysis, work ethic",
    weakness: "Over-criticism, worry, perfectionism",
    body: "Intestines, digestion, nerves",
  },
  Libra: {
    keyword: "Diplomat — santulit, saundarya-priya",
    strength: "Balance, negotiation, charm, aesthetics",
    weakness: "Indecision, people-pleasing, dependency",
    body: "Kidneys, lower back",
  },
  Scorpio: {
    keyword: "Alchemist — gehra, rahasyamay",
    strength: "Depth, research, willpower, resilience",
    weakness: "Secrecy, suspicion, intensity of emotion",
    body: "Reproductive organs, excretory system",
  },
  Sagittarius: {
    keyword: "Philosopher — dharmik, uchch-vichar",
    strength: "Optimism, ethics, teaching, long vision",
    weakness: "Bluntness, over-promising, restlessness",
    body: "Hips, thighs, liver",
  },
  Capricorn: {
    keyword: "Architect — anushasit, karm-yogi",
    strength: "Discipline, structure, long-term success, reliability",
    weakness: "Coldness, pessimism, workaholism",
    body: "Knees, joints, bones",
  },
  Aquarius: {
    keyword: "Reformer — mauli, samaj-mukhi",
    strength: "Originality, humanitarian vision, networks",
    weakness: "Detachment, rebelliousness, unpredictability",
    body: "Calves, ankles, circulation",
  },
  Pisces: {
    keyword: "Mystic — karunamay, kalpanashil",
    strength: "Compassion, imagination, spirituality, sacrifice",
    weakness: "Escapism, boundary issues, confusion",
    body: "Feet, lymph, immunity",
  },
};

export const HOUSE_EFFECT: Record<PlanetKey, string[]> = {
  Sun: [
    "Strong personality aur self-respect; leadership natural aata hai, par ego par control zaroori.",
    "Family aur dhan ke saath pita ka jud; speech authoritative, eye/dant ka dhyan rakhein.",
    "Sahas aur self-effort se tarakki; younger siblings se matbhed sambhav.",
    "Ghar/property mein position, par maa ki sehat aur gharelu shanti par dhyan dena hoga.",
    "Buddhi teekshan, creative authority; santaan ke maamle mein dhairya chahiye.",
    "Enemies par vijay, competition mein safalta — sarkari/legal maamlon mein jeet.",
    "Partnership mein independence chahiye; jeevansathi swabhimani, business mein saavdhani.",
    "Gehri khoj-vritti, occult mein ruchi; achanak badlav se guzarna padta hai.",
    "Bhagyavaan, dharm aur pita ka sahyog; higher education aur videsh yog.",
    "Career ka strong yog — authority, sarkari kaam, naam aur pratishtha.",
    "Achhi income aur influential network; bade bhai-behen se laabh.",
    "Kharch adhik, videsh/ekant mein kaam; aadhyatm ki taraf jhukav.",
  ],
  Moon: [
    "Sanvedansheel mann, aakarshak vyaktitva; mood badalte rehte hain.",
    "Parivaar se lagav, madhur vaani, dhan mein utaar-chadhav.",
    "Sahas bhavnaon se chalta hai; behen se nikatta.",
    "Maa aur ghar se gehra jud; property aur vahan sukh.",
    "Rachnatmak buddhi, santaan se prem, romance mein bhavukta.",
    "Chinta se sehat par asar; pet/mann ki bimariyon ka dhyan.",
    "Jeevansathi caring; public dealing mein safalta.",
    "Bhavnatmak utaar-chadhav, gupt gyaan mein ruchi.",
    "Dharmik yatra, guru-kripa, videsh se laabh.",
    "Public-facing career — teaching, care, hospitality, media.",
    "Bade social circle, mahilaon se laabh, achhi income.",
    "Ekant priya, videsh niwas, neend/kalpana ki duniya.",
  ],
  Mars: [
    "Urja se bhara, athletic; krodh aur chot se bachav zaroori.",
    "Kathor vaani, dhan kamane mein aakramakta — bachat par dhyan.",
    "Bahut himmat, technical/mechanical skill; bhai se takraar.",
    "Property ke maamle, gharelu tanav; maa ki sehat.",
    "Teekshan buddhi, speculation mein risk; santaan mein dhairya.",
    "Shatru-nashak — competition, army, surgery, sports mein safalta.",
    "Mangal dosha zone — vivah mein dhairya aur samay ka dhyan.",
    "Accident/surgery ka yog; gehri research shakti.",
    "Dharm ke liye ladne wala; pita se matbhed.",
    "Career mein aggression — engineering, defence, real estate, surgery.",
    "Laabh mehnat se; bahadur mitra-mandal.",
    "Chhipa hua krodh, kharch, videsh mein kaam.",
  ],
  Mercury: [
    "Teej dimaag, achhi vaani, yuva dikhna; padhai mein safalta.",
    "Vyapaar se dhan, accounting/finance skill, prabhavi speech.",
    "Lekhan, media, marketing mein safalta; sahas buddhi se.",
    "Ghar mein padhai ka mahaul, property documents ka kaam.",
    "Tez buddhi, mantra-vidya, bacchon se buddhik jud.",
    "Analytical service kaam; nervous system ka dhyan.",
    "Business partnership mein safalta; jeevansathi buddhimaan.",
    "Research, insurance, occult mathematics mein ruchi.",
    "Uchch shiksha, publishing, videshi bhasha.",
    "Career: business, IT, consulting, communication.",
    "Networking se income; multiple sources of earning.",
    "Vichaaron mein ulajhan; videsh se juda kaam.",
  ],
  Jupiter: [
    "Gyaani, sanskaari, sammanit vyaktitva; weight par dhyan.",
    "Dhan-sanchay ka yog, parivaar ka sukh, meethi vaani.",
    "Sahas mein dharm; guru-tulya bhai.",
    "Bade ghar ka sukh, maa se aashirvaad, shanti.",
    "Santaan sukh, uchch buddhi, teaching/advisory pratibha.",
    "Rog nivaran shakti; par debt se bachein.",
    "Uttam jeevansathi aur bhagyashali vivah.",
    "Deergh aayu, gupt gyaan, virasat ka laabh.",
    "Sabse shubh sthaan — bhagya, guru kripa, dharm, videsh yatra.",
    "Career mein sammaan — shiksha, law, finance, advisory.",
    "Badi income, prabhavshali guru aur mitra.",
    "Daan-punya, moksha marg, videsh mein sthirta.",
  ],
  Venus: [
    "Aakarshak, kala-priya vyaktitva; sukh-suvidha ka shauk.",
    "Dhan aur bhog ka yog, madhur vaani, sundar sangrah.",
    "Kala/media mein safalta, mitrata se laabh.",
    "Sundar ghar, vahan sukh, maa se prem.",
    "Romance, creativity, entertainment mein ruchi.",
    "Rishton mein utaar-chadhav; kidney/sugar ka dhyan.",
    "Vivah ka mukhya sthaan — prem vivah ka prabal yog.",
    "Gupt rishte, sasural se dhan.",
    "Bhagyashali vivah ke baad tarakki, videsh yatra.",
    "Career: art, design, fashion, luxury, entertainment.",
    "Laabh kala aur relations se; sundar mitra-mandal.",
    "Bhog-vilas par kharch, videsh mein sukh, shayan sukh.",
  ],
  Saturn: [
    "Gambhir, parishrami; safalta der se par sthayi.",
    "Dhan dheere-dheere par mehnat se; sanchay ki aadat.",
    "Lagatar prayas se safalta, dheeraj se jeet.",
    "Ghar/maa ke prati zimmedari, property purani.",
    "Santaan mein vilamb, gehri buddhi.",
    "Shatru par vijay, sevaon mein safalta, sehat mein anushasan.",
    "Vivah mein vilamb ya umr ka antar; sthayi rishta.",
    "Deergh aayu, occult/research, sudden karmic ghatnayein.",
    "Bhagya mehnat se banta hai; pita se doori.",
    "Career mein badi safalta par vilamb se — leadership, labour, law, mining.",
    "Sthir aur badi income, especially 36 ke baad.",
    "Videsh niwas, ekant, aadhyatm aur kharch.",
  ],
  Rahu: [
    "Asadharan vyaktitva, mahatvakanksha; bhram se bachein.",
    "Achanak dhan-laabh ya haani; vaani sambhal kar.",
    "Bahut sahas, videsh sampark, tech mein safalta.",
    "Gharelu ashanti, property vivad ka dhyan.",
    "Speculation se laabh/haani, santaan mein chinta.",
    "Shatru aur rog par vijay — Rahu yahan shubh.",
    "Vivah mein anokha yog, inter-caste/videshi sambandh.",
    "Rahasya, occult, achanak parivartan.",
    "Videsh yatra aur alag dharm-drishti.",
    "Career mein tez uthaan — tech, media, politics, foreign trade.",
    "Bahut achha laabh sthaan — badi income aur network.",
    "Videsh niwas, kharch, aadhyatmik anveshan.",
  ],
  Ketu: [
    "Aadhyatmik jhukav, vairagya, self-doubt se bachein.",
    "Vaani mein sanyam, dhan mein utaar-chadhav.",
    "Nidar, gehra manobal, gupt shakti.",
    "Maa se doori ya aadhyatmik jud.",
    "Santaan chinta, mantra siddhi ka yog.",
    "Rog aur shatru nashak — bahut shubh sthaan.",
    "Vivah mein vairagya/doori, dhairya zaroori.",
    "Occult, tantra, gehri khoj; achanak ghatnaon ka dhyan.",
    "Moksha marg, teerth yatra, guru kripa.",
    "Career mein detachment; research/spiritual kaam.",
    "Laabh achanak; icchaon mein kami.",
    "Sabse strong moksha sthaan — dhyan, videsh, sanyas bhav.",
  ],
};

const AREA_HOUSES: { title: string; hi: string; houses: number[]; note: string }[] = [
  { title: "Career & Livelihood", hi: "कर्म", houses: [10, 6, 2], note: "profession, service and earning capacity" },
  { title: "Wealth & Finance", hi: "धन", houses: [2, 11, 9], note: "savings, income flow and fortune" },
  { title: "Marriage & Relationships", hi: "कलत्र", houses: [7, 5, 12], note: "spouse, romance and intimacy" },
  { title: "Education & Intellect", hi: "विद्या", houses: [4, 5, 9], note: "learning, memory and higher study" },
  { title: "Health & Vitality", hi: "आरोग्य", houses: [1, 6, 8], note: "body strength, illness and recovery" },
  { title: "Family & Home", hi: "गृह", houses: [4, 2, 3], note: "mother, property and domestic peace" },
];

/* ------------------------------ the reader ------------------------------- */

export type ReportSection = { title: string; hi?: string; lines: string[] };

const gradeOf = (score: number) =>
  score >= 70 ? "Strong" : score >= 50 ? "Moderate" : score >= 35 ? "Weak" : "Very weak";

function signOf(i: number) {
  return `${SIGNS[i].en} (${SIGNS[i].hi})`;
}

export function buildReport(k: Kundli): ReportSection[] {
  const p = (key: PlanetKey) => k.planets.find((x) => x.key === key)!;
  const asc = SIGNS[k.ascendant.sign];
  const ascTrait = SIGN_TRAITS[asc.en];
  const moon = p("Moon");
  const sun = p("Sun");
  const moonTrait = SIGN_TRAITS[SIGNS[moon.sign].en];
  const nak = NAKSHATRAS[k.ascendant.nakshatra];
  const moonNak = NAKSHATRAS[moon.nakshatra];

  const sorted = [...k.planets].sort((a, b) => b.strength - a.strength);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const sections: ReportSection[] = [];

  sections.push({
    title: "Personality — Lagna Reading",
    hi: "व्यक्तित्व",
    lines: [
      `Aapka Lagna ${signOf(k.ascendant.sign)} hai — ${ascTrait.keyword}. Lagna ka swami ${asc.lord} hai jo ${p(asc.lord as PlanetKey).house} bhava mein ${signOf(p(asc.lord as PlanetKey).sign)} mein baitha hai, isliye aapki zindagi ka focus ${HOUSES[p(asc.lord as PlanetKey).house - 1].title.toLowerCase()} par rehta hai.`,
      `Mazbooti: ${ascTrait.strength}.`,
      `Sudhaar ka kshetra: ${ascTrait.weakness}.`,
      `Lagna nakshatra ${nak.en} (${nak.hi}), swami ${nak.lord}, devta ${nak.deity} — yeh aapke swabhav ki base tone deta hai.`,
      `Sharirik sanvedansheel ang: ${ascTrait.body}.`,
    ],
  });

  sections.push({
    title: "Mind & Emotions — Chandra Rashi",
    hi: "मन",
    lines: [
      `Chandra ${signOf(moon.sign)} mein, ${moon.house} bhava mein — aapka mann ${moonTrait.keyword.split("—")[1]?.trim() ?? moonTrait.keyword} hai.`,
      `Janma nakshatra ${moonNak.en} (${moonNak.hi}) pada ${moon.pada}, swami ${moonNak.lord}, devta ${moonNak.deity}. Yahi Vimshottari dasha ka aadhar hai.`,
      `Bhavnatmak taakat: ${moonTrait.strength}. Dhyan dein: ${moonTrait.weakness}.`,
      `Surya ${signOf(sun.sign)} mein ${sun.house} bhava mein — aapki aatma aur pita ka kshetra ${HOUSES[sun.house - 1].title} hai.`,
    ],
  });

  sections.push({
    title: "Planet by Planet",
    hi: "ग्रह फल",
    lines: k.planets.map(
      (pl: PlanetPosition) =>
        `${pl.key} — ${signOf(pl.sign)}, ${pl.house} bhava, ${pl.dignity}${pl.retrograde ? ", vakri" : ""}${pl.combust ? ", ast (combust)" : ""} · bal ${Math.round(pl.strength)}/100 (${gradeOf(pl.strength)}). ${HOUSE_EFFECT[pl.key][pl.house - 1]}`,
    ),
  });

  sections.push({
    title: "Life Areas",
    hi: "जीवन क्षेत्र",
    lines: AREA_HOUSES.map((area) => {
      const details = area.houses.map((h) => {
        const hl = k.houseLords.find((x) => x.house === h)!;
        const lordPos = p(hl.lord);
        const occupants = k.planets.filter((x) => x.house === h).map((x) => x.key);
        return `${h}th (${SIGNS[hl.sign].en}) ka swami ${hl.lord} → ${lordPos.house}th, bal ${Math.round(lordPos.strength)}${occupants.length ? `; yahan ${occupants.join(", ")}` : "; koi graha nahi"}`;
      });
      const avg =
        area.houses.reduce((s, h) => {
          const hl = k.houseLords.find((x) => x.house === h)!;
          return s + p(hl.lord).strength;
        }, 0) / area.houses.length;
      return `${area.title} (${area.hi}) — overall ${gradeOf(avg)} (${Math.round(avg)}/100), yaani ${area.note} mein ${avg >= 60 ? "achha support hai" : avg >= 45 ? "mehnat se result milega" : "vishesh upay aur dhairya chahiye"}. ${details.join(" · ")}.`;
    }),
  });

  const balance = { Fire: 0, Earth: 0, Air: 0, Water: 0 } as Record<string, number>;
  k.planets.forEach((pl) => {
    balance[SIGNS[pl.sign].element] += 1;
  });

  sections.push({
    title: "Strength Summary",
    hi: "बल सार",
    lines: [
      `Sabse balwaan graha: ${strongest.key} (${Math.round(strongest.strength)}/100) — ${signOf(strongest.sign)}, ${strongest.house} bhava. Yeh aapki sabse badi shakti hai, iske dasha-antar mein sabse achhe result milte hain.`,
      `Sabse kamzor graha: ${weakest.key} (${Math.round(weakest.strength)}/100) — iske liye upay karna chahiye (${PLANET_META[weakest.key].mantra ?? "mantra jap"}).`,
      `Tatva santulan — Agni ${balance['Fire']}, Prithvi ${balance['Earth']}, Vayu ${balance['Air']}, Jal ${balance['Water']}. ${
        Math.max(...Object.values(balance)) >= 4
          ? "Ek tatva ki adhikta hai, isliye swabhav mein wahi rang haavi rahega."
          : "Tatva kaafi santulit hain — swabhav mein lachilapan rahega."
      }`,
      k.yogas.length
        ? `Kundli mein ${k.yogas.length} vishesh yog mile: ${k.yogas.map((y) => y.name).join(", ")}.`
        : "Koi bada classical yog nahi bana, isliye safalta apni mehnat aur dasha par nirbhar rahegi.",
    ],
  });

  if (k.currentDasha) {
    const { maha, antar } = k.currentDasha;
    const mp = p(maha.lord as PlanetKey);
    const ap = p(antar.lord as PlanetKey);
    sections.push({
      title: "Current Period — Dasha Reading",
      hi: "वर्तमान दशा",
      lines: [
        `Abhi ${maha.lord} Mahadasha chal rahi hai (${maha.start.toLocaleDateString("en-IN")} se ${maha.end.toLocaleDateString("en-IN")} tak), uske andar ${antar.lord} Antardasha (${antar.start.toLocaleDateString("en-IN")} – ${antar.end.toLocaleDateString("en-IN")}).`,
        `${maha.lord} aapki kundli mein ${mp.house} bhava mein ${signOf(mp.sign)} mein hai, ${mp.dignity}, bal ${Math.round(mp.strength)}/100 — isliye is poore daur ka mool vishay ${HOUSES[mp.house - 1].title} rahega. ${HOUSE_EFFECT[mp.key][mp.house - 1]}`,
        `${antar.lord} ${ap.house} bhava mein hai (bal ${Math.round(ap.strength)}/100) — is sub-period mein ${HOUSES[ap.house - 1].title.toLowerCase()} ke maamle saamne aayenge. ${HOUSE_EFFECT[ap.key][ap.house - 1]}`,
        mp.strength >= 55 && ap.strength >= 55
          ? "Dono grah theek-thaak balwaan hain — yeh samay aage badhne ke liye anukool hai."
          : "In grahon ka bal kam hai — is daur mein dhairya rakhein, upay karein aur bade risk se bachein.",
      ],
    });
  }

  const active = k.doshas.filter((d) => d.present);
  sections.push({
    title: "Cautions & Doshas",
    hi: "सावधानी",
    lines: active.length
      ? active.map((d) => `${d.name} — ${d.severity}. ${d.reason} Upay: ${d.remedy}`)
      : ["Koi mukhya dosha (Mangal, Kaal Sarp, Pitra) nahi mila — yeh kundli ke liye achhi baat hai."],
  });

  return sections;
}
