import { HOUSES, PLANET_META, SIGNS, type PlanetKey } from "./data";
import type { Kundli, PlanetPosition } from "./kundli";

/* ============================ Lal Kitab engine ===========================
 * Lal Kitab ki apni kundli hoti hai: 12 pakke ghar, ghar 1 hamesha Mesh.
 * Isliye graha ka "Lal Kitab ghar" = uski rashi ka number (Mesh = 1).
 * Neeche har graha ka ghar-wise phal aur uske pakke upay diye gaye hain.
 * ======================================================================= */

export const LK_EFFECT: Record<PlanetKey, string[]> = {
  Sun: [
    "Raja ka darja — swabhiman aur naam, par garmi/krodh aur pita se matbhed.",
    "Kutumb ka sukh dhan se juda; vaani mein tez, aankh aur dant ka dhyan.",
    "Bhai-bandhu se laabh, sarkari kaam banta hai, mehnat rangat laati hai.",
    "Maa-baap ka sukh mixed; ghar mein garmi, chai/agni ka kaam laabh deta hai.",
    "Santaan ke liye shubh, par pet aur pitta ki shikayat, ahankar se nuksaan.",
    "Shatru par vijay, sarkari naukri ka pakka yog, mama-paksh se madad.",
    "Sarkari kaam mein rukavat, patni ki sehat, sajhedari mein hani.",
    "Achanak ghatnayein, aankh/haddi ki taklif, pitri kaarya adhoora.",
    "Bhagya prabal, dharm-karm se izzat, pita ka aashirwad phaldayi.",
    "Rajya-yog — pad, pratishtha, sarkari laabh, pitri sampatti.",
    "Mitron aur bade bhai se laabh, aay achhi, par jhoothe vaade se bachein.",
    "Kharch adhik, aankh kamzor, videsh/ekant ka kaam theek chalta hai.",
  ],
  Moon: [
    "Mann komal aur bhagyashali, maa ka aashirwad, doodh-jal ka daan zaroori.",
    "Dhan mein utaar-chadhav, maa se sampatti, madhur vaani se laabh.",
    "Bhai-behen se prem, chanchal mann, chhoti yatrayein zyada.",
    "Sabse pakka ghar — maa, makan, sukh aur shanti mein badhotri.",
    "Santaan se lagav, kalpana shakti, padhai mein mann lagta hai.",
    "Chandra kamzor — chinta, neend ki kami, jal-sthaan se saavdhani.",
    "Patni bhagyashali par bhavuk, jal-vyapaar se laabh.",
    "Mann par bojh, gupt chinta, ghat/nadi ke paas jokhim.",
    "Teerth-yatra, dharm mein mann, maa ka dharm-sanskar.",
    "Naukri/karya mein janta ka sahyog, doodh-dairy ya jal-vyapaar shubh.",
    "Aay achhi par kharch bhi, mitron se bhavnatmak jud.",
    "Nind, kalpana aur videsh — mann bhatakta hai, dhyan se sudhaar.",
  ],
  Mars: [
    "Mangal badli — himmat bahut, par krodh aur chot ka yog.",
    "Kutumb mein takraar, dhan mehnat se, vaani kathor.",
    "Mangal ka pakka ghar — bhai, himmat aur bhoomi se laabh.",
    "Ghar mein ashanti, maa ki sehat, bhoomi-vivad sambhav.",
    "Santaan mein dhairya, khoon/pitta ki garmi, speculation se bachein.",
    "Shatru-nashak — police, sena, surgery, sports mein safalta.",
    "Vivah mein vilamb/matbhed (manglik zone), sajhedari sambhal kar.",
    "Chot, operation ya achanak ghatna ka yog; rakt vikar ka dhyan.",
    "Bhagya himmat se banta hai, bhai aur pita se sahyog.",
    "Karya mein aakramakta — technical/defence/property line shubh.",
    "Laabh bhai aur mehnat se, badi income sambhav.",
    "Kharch, gupt shatru, videsh mein sangharsh.",
  ],
  Mercury: [
    "Buddhi tez, vyapaar aur lekhan mein safalta; nani-mausi ka sahyog.",
    "Dhan vyapaar se, hisaab-kitaab mein maharat, vaani se kamai.",
    "Behen-bua se sambandh, media/marketing shubh.",
    "Ghar mein padhai-likhai ka mahaul, dastavez ka kaam.",
    "Santaan buddhimaan, ganit aur mantra mein ruchi.",
    "Nas-nadi ki kamzori, mama-paksh se tanav, service mein safalta.",
    "Sajhedari vyapaar se laabh, patni chatur.",
    "Ganit/research/insurance mein ruchi, tvacha ka dhyan.",
    "Uchch shiksha, publishing, videshi bhasha se laabh.",
    "Vyapaar-karya ka pakka ghar — dukan, IT, consultancy.",
    "Aay ke kai srot, network se laabh.",
    "Vichaar ulajhte hain, videsh se juda kaam theek.",
  ],
  Jupiter: [
    "Guru swayam Lagna mein — gyaan, sanskaar, sammaan aur bhagya.",
    "Dhan sanchay, parivaar ka sukh, sona/peeli cheezon se laabh.",
    "Bhai aur dharm se jud, salaah dene ka kaam banta hai.",
    "Bada ghar, shanti aur guru-kripa; kuan/mandir ka daan phaldayi.",
    "Santaan sukh, shiksha aur salaah ka pesha shubh.",
    "Guru kamzor — karz, rog aur adhyapak se matbhed; peepal seva karein.",
    "Vivah shubh, jeevansathi bhagyashali aur dharmik.",
    "Aayu lambi, virasat aur gupt gyaan ka laabh.",
    "Sabse pakka ghar — bhagya, dharm, pita aur guru ka poora aashirwad.",
    "Sammaan wala pesha — shiksha, kanoon, finance, dharm.",
    "Badi aay, prabhavshali log madad karte hain.",
    "Daan-punya, moksha marg, videsh mein sthirta.",
  ],
  Venus: [
    "Sundar, kala-priya, sukh-suvidha ka shauk; safed cheezein shubh.",
    "Dhan aur bhog ka yog, sundar sangrah, meethi vaani.",
    "Kala, media aur mitron se laabh; behen se sneh.",
    "Sundar ghar, vahan sukh, maa se prem.",
    "Prem, rachnatmakta aur manoranjan mein safalta.",
    "Rishton mein utaar-chadhav; gupt rog, sugar/kidney ka dhyan.",
    "Vivah ka pakka ghar — prem vivah ka prabal yog.",
    "Gupt sambandh, sasural se dhan par badnaami ka dhyan.",
    "Vivah ke baad bhagya khulta hai, videsh yatra.",
    "Kala, design, fashion, luxury line mein karya safalta.",
    "Laabh sundarta aur relations se, sukhi mitra-mandal.",
    "Bhog-vilas par kharch, shayan sukh, videsh mein aaram.",
  ],
  Saturn: [
    "Shani Lagna mein — gambhirta, der se safalta, sthayi tarakki.",
    "Dhan mehnat se aur dheere-dheere; parivaar mein zimmedari.",
    "Lagatar prayas se jeet, dhairya sabse bada hathiyar.",
    "Purani sampatti, ghar ki zimmedari, maa ki sehat ka dhyan.",
    "Santaan mein vilamb, gehri buddhi, tapasya se phal.",
    "Shatru par vijay, lohe/tel/majdoori se juda kaam shubh.",
    "Vivah mein vilamb ya umr ka antar, par rishta sthayi.",
    "Deergh aayu, karmic ghatnayein, occult mein ruchi.",
    "Bhagya mehnat se banta hai; pita se doori sambhav.",
    "Karya mein badi safalta par 36 ke baad — kanoon, khanan, shram.",
    "Shani ka pakka ghar — sthir aur badi aay, buzurgon se laabh.",
    "Videsh niwas, ekant, aadhyatm; kharch par niyantran zaroori.",
  ],
  Rahu: [
    "Asadharan mahatvakanksha, bhram aur sar-dard; jau/naariyal daan.",
    "Achanak dhan-laabh ya haani; vaani sambhal kar bolein.",
    "Rahu ka pakka ghar — himmat, videsh sampark, tech mein safalta.",
    "Gharelu ashanti, maa ki sehat, sampatti vivad.",
    "Santaan chinta, speculation mein risk, mantra siddhi mushkil.",
    "Rahu yahan shubh — shatru, rog aur karz par vijay.",
    "Vivah mein anokha yog — inter-caste ya videshi sambandh.",
    "Achanak ghatnayein, gupt bhay, operation ka yog.",
    "Videsh yatra, alag dharm-drishti, pitri dosh ka sanket.",
    "Tez uthaan — tech, media, rajniti, videshi vyapaar.",
    "Bahut achha ghar — badi income aur bada network.",
    "Videsh niwas, kharch, nind ki kami, aadhyatmik khoj.",
  ],
  Ketu: [
    "Vairagya aur sandeh; sar/pair mein chot ka dhyan.",
    "Dhan mein utaar-chadhav, vaani mein sanyam zaroori.",
    "Ketu ka pakka ghar — nidar, gupt shakti, bhai se laabh.",
    "Maa se doori ya aadhyatmik jud; kutte ki seva shubh.",
    "Santaan chinta, mantra-siddhi ka yog, pet ka dhyan.",
    "Rog aur shatru nashak — bahut shubh sthaan.",
    "Vivah mein doori ya vairagya; dhairya se rishta chalta hai.",
    "Tantra, gehri khoj, achanak ghatnaon ka dhyan.",
    "Moksha marg, teerth-yatra, guru-kripa.",
    "Karya mein detachment; research/aadhyatmik kaam shubh.",
    "Laabh achanak milta hai, icchayein kam.",
    "Sabse strong moksha ghar — dhyan, videsh, sanyas bhav.",
  ],
};

export const LK_UPAY: Record<PlanetKey, string[]> = {
  Sun: [
    "Suryoday par tambe ke lote se jal arghya dein aur ॐ सूर्याय नमः bolein.",
    "Pita/buzurgon ki seva karein, unse aashirwad lein — Surya ka sabse pakka upay.",
    "Ravivaar ko gud aur gehu daan karein; ghar mein tamba rakhein.",
  ],
  Moon: [
    "Maa ki seva aur unke pair chhu kar aashirwad — Chandra turant balwaan hota hai.",
    "Chandi ka tukda ya chandi ki chain dharan karein; safed cheezein (doodh, chawal) daan.",
    "Sombar ko jal-sthaan par doodh ya jal arpit karein.",
  ],
  Mars: [
    "Mangalvaar ko mandir mein meethi roti ya gud-chana chadhayein.",
    "Bhai/bahno ki madad karein aur unse rishta theek rakhein.",
    "Rewri/batashe behte jal mein pravaahit karein; Hanuman Chalisa niyamit.",
  ],
  Mercury: [
    "Hari sabzi, moong ya hare kapde daan karein (Budhvaar).",
    "Bua, behen aur beti ka aashirwad lein — Budh ka pakka upay.",
    "Naak chhidwana / hari elaichi jeb mein rakhna Lal Kitab mein prasiddh totka hai.",
  ],
  Jupiter: [
    "Peepal ke ped ko jal dein aur Guruvaar ko chana-dal, haldi daan karein.",
    "Mandir/guru ki seva; maathe par kesar ya haldi ka tilak.",
    "Sone ki koi cheez (angoothi/chain) dharan karein.",
  ],
  Venus: [
    "Patni/bahan-beti ka sammaan aur unhe uphaar — Shukra ka mool upay.",
    "Shukravaar ko safed mithai, chawal, dahi daan karein.",
    "Gaay ko chaara khilayein; sugandh aur safai ka niyam rakhein.",
  ],
  Saturn: [
    "Shanivaar ko sarson ka tel, urad dal, lohe ki cheez daan karein.",
    "Majdoor, safai-karmi aur buzurgon ki madad; kisi ka apmaan na karein.",
    "Kaale kutte ko roti khilayein; Hanuman ji ko tel chadhayein.",
  ],
  Rahu: [
    "Behte paani mein naariyal ya jau pravaahit karein.",
    "Sar dhak kar rakhein, chandi dharan karein; sarson ka tel daan.",
    "Kisi ko dhokha na dein aur jhooth se bachein — Rahu ka asli upay.",
  ],
  Ketu: [
    "Kaale-safed kutte ko roti khilayein; kaan chhidwana bhi Lal Kitab upay hai.",
    "Kambal aur do-rangi cheezein daan karein.",
    "Ganesh ji ki upasana aur Ganesh Atharvashirsha ka paath.",
  ],
};

export type LalKitabPlanet = {
  key: PlanetKey;
  lkHouse: number; // 1 = Aries
  vedicHouse: number;
  sign: number;
  effect: string;
  state: "Jagrit (jaagta)" | "Sota hua (sleeping)" | "Andha (blind)" | "Samanya";
  stateWhy: string;
  upay: string[];
};

export type LalKitabRin = {
  name: string;
  present: boolean;
  reason: string;
  upay: string;
};

export type LalKitabReport = {
  planets: LalKitabPlanet[];
  rin: LalKitabRin[];
  teva: string[];
  summary: string[];
};

/** Lal Kitab "pakke ghar" — jahan graha apna poora phal deta hai. */
const PAKKA_GHAR: Record<PlanetKey, number> = {
  Sun: 1, Moon: 4, Mars: 3, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 8, Rahu: 12, Ketu: 6,
};

/** Lal Kitab mein kuch ghar graha ke liye "mandey" (weak) mane jaate hain. */
const MANDA_GHAR: Partial<Record<PlanetKey, number[]>> = {
  Sun: [7, 8, 12],
  Moon: [6, 8, 12],
  Mars: [4, 7, 8, 12],
  Mercury: [6, 8, 12],
  Jupiter: [6, 7, 8, 10],
  Venus: [6, 8, 12],
  Saturn: [1, 4, 5, 12],
  Rahu: [1, 4, 5, 7, 8, 9],
  Ketu: [1, 2, 4, 5, 7],
};

export function buildLalKitab(k: Kundli): LalKitabReport {
  const byKey = Object.fromEntries(k.planets.map((p) => [p.key, p])) as Record<PlanetKey, PlanetPosition>;
  const lkHouseOf = (p: PlanetPosition) => p.sign + 1;
  const occupancy = new Map<number, PlanetKey[]>();
  k.planets.forEach((p) => {
    const h = lkHouseOf(p);
    occupancy.set(h, [...(occupancy.get(h) ?? []), p.key]);
  });

  const planets: LalKitabPlanet[] = k.planets.map((p) => {
    const h = lkHouseOf(p);
    const seventh = ((h + 5) % 12) + 1;
    const alone = (occupancy.get(h) ?? []).length === 1;
    const seventhEmpty = (occupancy.get(seventh) ?? []).length === 0;
    const manda = (MANDA_GHAR[p.key] ?? []).includes(h);
    let state: LalKitabPlanet["state"] = "Samanya";
    let why = `Ghar ${h} (${SIGNS[p.sign].en}) mein baitha hai.`;
    if (h === PAKKA_GHAR[p.key]) {
      state = "Jagrit (jaagta)";
      why = `Ye ${p.key} ka pakka ghar (${h}) hai — graha poori taakat se phal deta hai.`;
    } else if (alone && seventhEmpty) {
      state = "Sota hua (sleeping)";
      why = `Ghar ${h} mein akela hai aur saamne wala ghar ${seventh} bhi khaali hai — Lal Kitab mein aisa graha "sota hua" kehlata hai, isliye phal der se ya adhoora milta hai. Jagane ke liye iske upay zaroori hain.`;
    } else if (manda) {
      state = "Andha (blind)";
      why = `Ghar ${h} is graha ke liye mandey ghar mein aata hai — phal ulta ya kamzor milta hai, isliye upay se sudhaar zaroori hai.`;
    }
    return {
      key: p.key,
      lkHouse: h,
      vedicHouse: p.house,
      sign: p.sign,
      effect: LK_EFFECT[p.key][h - 1],
      state,
      stateWhy: why,
      upay: LK_UPAY[p.key],
    };
  });

  const lk = Object.fromEntries(planets.map((p) => [p.key, p])) as Record<PlanetKey, LalKitabPlanet>;
  const inH = (key: PlanetKey, houses: number[]) => houses.includes(lk[key].lkHouse);

  const rin: LalKitabRin[] = [
    {
      name: "Pitra Rin (पितृ ऋण)",
      present: inH("Rahu", [9, 10]) || inH("Sun", [12]) || inH("Jupiter", [6, 8, 12]),
      reason:
        `Rahu ghar ${lk.Rahu.lkHouse}, Surya ghar ${lk.Sun.lkHouse}, Guru ghar ${lk.Jupiter.lkHouse} — pitra rin tab banta hai jab Rahu 9/10 mein ho, Surya 12 mein ho ya Guru 6/8/12 mein ho.`,
      upay: "Pita/purvajon ki seva, Amavasya ko pitro ke naam daan, behte jal mein naariyal, mandir mein sona ya peeli cheez daan.",
    },
    {
      name: "Matra Rin (मातृ ऋण)",
      present: inH("Moon", [6, 8, 12]) || inH("Ketu", [4]),
      reason: `Chandra ghar ${lk.Moon.lkHouse} aur Ketu ghar ${lk.Ketu.lkHouse} — Chandra 6/8/12 ya Ketu 4 mein ho to maa ka rin mana jaata hai.`,
      upay: "Maa ki seva, doodh/chawal daan, chandi dharan, jal-sthaan par doodh arpan.",
    },
    {
      name: "Bhratra Rin (भ्रातृ ऋण)",
      present: inH("Mars", [4, 7, 12]) || inH("Ketu", [3]),
      reason: `Mangal ghar ${lk.Mars.lkHouse} aur Ketu ghar ${lk.Ketu.lkHouse} — bhai-bandhu ke rin ka sanket.`,
      upay: "Bhai-behno ki madad, Mangalvaar ko gud-chana daan, meethi roti kutte ko.",
    },
    {
      name: "Stri Rin (स्त्री / पत्नी ऋण)",
      present: inH("Venus", [6, 8, 12]) || inH("Mercury", [7]),
      reason: `Shukra ghar ${lk.Venus.lkHouse} aur Budh ghar ${lk.Mercury.lkHouse} — mahilaon ka apmaan ya rin darshata hai.`,
      upay: "Patni/bahan/beti ka sammaan aur uphaar, safed mithai daan, gaay ko chaara.",
    },
    {
      name: "Kanya Rin (कन्या / अजन्मे ऋण)",
      present: inH("Mercury", [6, 8, 12]) || inH("Jupiter", [5]),
      reason: `Budh ghar ${lk.Mercury.lkHouse} aur Guru ghar ${lk.Jupiter.lkHouse} — kanyaon/santaan se juda rin.`,
      upay: "Kanya-pujan, bua-behen-beti ki madad, hari sabzi aur elaichi daan.",
    },
    {
      name: "Sarva Rin (सर्व ऋण — samuhik)",
      present: inH("Saturn", [1, 5]) || inH("Rahu", [1, 5]),
      reason: `Shani ghar ${lk.Saturn.lkHouse} aur Rahu ghar ${lk.Rahu.lkHouse} — poore parivaar ke karm ka bhaar.`,
      upay: "Shanivaar tel-daan, majdooron ki madad, kisi ko dhokha na dena, niyamit dharm-karm.",
    },
  ];

  const jagrit = planets.filter((p) => p.state === "Jagrit (jaagta)");
  const soye = planets.filter((p) => p.state === "Sota hua (sleeping)");
  const andhe = planets.filter((p) => p.state === "Andha (blind)");

  const summary = [
    `Lal Kitab kundli mein ghar hamesha pakke hote hain — ghar 1 Mesh, ghar 2 Vrishabh... isliye aapke grah ke Lal Kitab ghar Vedic bhav se alag ho sakte hain. Udaharan: Surya Vedic bhav ${byKey.Sun.house} mein hai par Lal Kitab ghar ${lk.Sun.lkHouse} mein.`,
    jagrit.length
      ? `Jaagte hue grah: ${jagrit.map((p) => `${p.key} (ghar ${p.lkHouse})`).join(", ")} — inka phal seedha aur jaldi milta hai.`
      : "Koi graha apne pakke ghar mein nahi hai, isliye phal upay aur mehnat se hi khulta hai.",
    soye.length
      ? `Soye hue grah: ${soye.map((p) => `${p.key} (ghar ${p.lkHouse})`).join(", ")} — ye akele hain aur inke saamne wala ghar khaali hai, isliye inke upay sabse pehle karein.`
      : "Koi graha soya hua nahi hai — sabhi grahon ko kisi na kisi taraf se sahyog mil raha hai.",
    andhe.length
      ? `Mandey ghar ke grah: ${andhe.map((p) => `${p.key} (ghar ${p.lkHouse})`).join(", ")} — inka phal ulta ho sakta hai, upay se santulan banayein.`
      : "Koi graha apne mandey ghar mein nahi hai — ye achha sanket hai.",
    `Chal rahi ${k.currentDasha ? `${k.currentDasha.maha.lord} mahadasha` : "dasha"} ke hisaab se sabse pehle ${
      k.currentDasha ? k.currentDasha.maha.lord : jagrit[0]?.key ?? "Sun"
    } ke Lal Kitab upay karein — jo graha samay chala raha hai, uska upay sabse tez phal deta hai.`,
  ];

  const teva = [
    `Kundli ka Lal Kitab "teva": Lagna ${SIGNS[k.ascendant.sign].en}, par Lal Kitab ghar 1 hamesha Mesh — isliye ${
      planets.find((p) => p.lkHouse === 1)?.key ?? "koi graha nahi"
    } aapka ghar-1 ka malik-anubhav deta hai.`,
    `Ghar 10 (${SIGNS[9].en}) mein ${(occupancy.get(10) ?? []).join(", ") || "koi graha nahi"} — karm aur pita ka kshetra.`,
    `Ghar 7 (${SIGNS[6].en}) mein ${(occupancy.get(7) ?? []).join(", ") || "koi graha nahi"} — vivah aur sajhedari ka kshetra.`,
    `Ghar 4 (${SIGNS[3].en}) mein ${(occupancy.get(4) ?? []).join(", ") || "koi graha nahi"} — maa, makan aur sukh ka kshetra.`,
  ];

  return { planets, rin, teva, summary };
}

export const LK_HOUSE_TITLE = (h: number) =>
  `${h}. ${SIGNS[h - 1].en} — ${HOUSES[h - 1].title} (${PLANET_META[SIGNS[h - 1].lord as PlanetKey].hi} ka ghar)`;
