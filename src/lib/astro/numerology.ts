/**
 * Complete numerology engine — Vedic (Ank Jyotish) + Chaldean + Pythagorean +
 * Lo Shu grid, Kua, pinnacles, challenges, karmic debts, cycles and forecasts.
 *
 * Design rule for this file: EVERY computed result carries a `reason` string
 * that explains, step by step, how the number came and why it means what it
 * means — so a user can learn, not just read a verdict.
 */

export type Explained = {
  label: string;
  value: number | string;
  planet?: string;
  reason: string; // how it was calculated
  meaning: string; // what it means
  strengths?: string[];
  weaknesses?: string[];
  advice?: string;
};

export type NumerologyInput = {
  name: string;
  gender: string;
  date: string; // yyyy-mm-dd
};

/* ------------------------------------------------------------------ */
/* Core reference data                                                  */
/* ------------------------------------------------------------------ */

export const NUM_PLANET: Record<number, { en: string; hi: string; sanskrit: string }> = {
  1: { en: "Sun", hi: "सूर्य", sanskrit: "Surya" },
  2: { en: "Moon", hi: "चंद्र", sanskrit: "Chandra" },
  3: { en: "Jupiter", hi: "गुरु", sanskrit: "Brihaspati" },
  4: { en: "Rahu", hi: "राहु", sanskrit: "Rahu" },
  5: { en: "Mercury", hi: "बुध", sanskrit: "Budha" },
  6: { en: "Venus", hi: "शुक्र", sanskrit: "Shukra" },
  7: { en: "Ketu", hi: "केतु", sanskrit: "Ketu" },
  8: { en: "Saturn", hi: "शनि", sanskrit: "Shani" },
  9: { en: "Mars", hi: "मंगल", sanskrit: "Mangal" },
};

export const NUM_TRAITS: Record<
  number,
  { title: string; core: string; strengths: string[]; weaknesses: string[]; advice: string }
> = {
  1: {
    title: "Netrutva (Leadership)",
    core:
      "Sun ka ank. Aap apne aap ko command position me dekhte hain — pehal karna, akela decision lena aur naam kamana aapki basic wiring hai.",
    strengths: ["Self-starter", "Saaf niyat aur authority", "Original ideas", "Kabhi haar nahi maanne wali will"],
    weaknesses: ["Ego aur ziddipan", "Criticism bardasht nahi", "Doosron ko delegate nahi karte", "Akelapan"],
    advice:
      "Sun ka phal tabhi milta hai jab ego seva me badle. Roz subah surya ko jal dein aur ek kaam jaan-boojh kar kisi aur ko sonpein.",
  },
  2: {
    title: "Sanvedansheelta (Sensitivity)",
    core:
      "Moon ka ank. Mann, kalpana aur rishte aapke jeevan ka centre hain. Aap logon ko jodte hain, ladte nahi.",
    strengths: ["Gehri intuition", "Diplomacy", "Sahyog aur teamwork", "Kala aur sangeet ka bodh"],
    weaknesses: ["Mood swings", "Nirnay lene me deri", "Doosron par nirbharta", "Chhoti baat dil pe le lena"],
    advice: "Chandra ko sthir karein — Somvaar vrat, chandi dharan, aur raat ko jaldi sona.",
  },
  3: {
    title: "Gyaan aur Vistaar (Wisdom & Expansion)",
    core:
      "Jupiter ka ank. Sikhna, sikhana, salah dena aur bolna — yahi aapki shakti hai. Log aapse guidance maangte hain.",
    strengths: ["Gyaan aur guru-bhav", "Ashavaad", "Vaani ki shakti", "Anushasan aur dharm"],
    weaknesses: ["Over-confidence", "Zyada bolna", "Kaam bikharna", "Doosron ka bojh utha lena"],
    advice: "Guru ko balshali karein — Guruvar peela vastra, haldi daan, aur kisi ko nishulk sikhaana.",
  },
  4: {
    title: "Rachna aur Vidroh (Structure & Rebellion)",
    core:
      "Rahu ka ank. Aap system bhi banate hain aur system se ladte bhi hain. Unconventional raaste aapko hi milte hain.",
    strengths: ["Mehnati aur bharosemand", "Practical dimaag", "Technology aur research", "Sankat me shant"],
    weaknesses: ["Andar ka bechaini", "Shaq karna", "Achanak nuksaan", "Rules todne ki aadat"],
    advice: "Rahu ke liye — Shanivaar/Budhvaar daan, saaf-safai, aur kisi bhi kaam me shortcut se bachna.",
  },
  5: {
    title: "Sanchaar aur Gati (Communication & Motion)",
    core:
      "Mercury ka ank. Buddhi, vyapaar, bhasha aur yatra — aap tez hain aur tezi se seekhte hain.",
    strengths: ["Tez buddhi", "Vyapaar-kushalta", "Adaptability", "Networking"],
    weaknesses: ["Ek jagah tik na paana", "Nervous energy", "Zyada soch", "Chalaki ka aarop"],
    advice: "Budh ko shuddh karein — hara rang, Budhvaar hari sabzi ka daan, aur jhooth se poora parhez.",
  },
  6: {
    title: "Prem aur Saundarya (Love & Beauty)",
    core:
      "Venus ka ank. Ghar, kala, sundarta, luxury aur rishte — aapki duniya inhi ke around ghoomti hai.",
    strengths: ["Aakarshan", "Kala aur ruchi", "Parivaar ke prati samarpan", "Bhog aur sukh"],
    weaknesses: ["Aaraam-talabi", "Zyada kharch", "Rishton me uljhan", "Faisle me bhavuk ho jaana"],
    advice: "Shukra ke liye — Shukravar safed/mishri daan, saaf-suthra shringar, aur bhog me sanyam.",
  },
  7: {
    title: "Rahasya aur Vairagya (Mystery & Detachment)",
    core:
      "Ketu ka ank. Aap gehrai me jaate hain — adhyatm, research, ya koi bhi vishay jiska tal na ho.",
    strengths: ["Gehri soch", "Adhyatmik jhukav", "Anusandhan", "Akelepan me shakti"],
    weaknesses: ["Duniya se katav", "Sanshay", "Rishton me doori", "Achanak badlaav"],
    advice: "Ketu ke liye — kutte ko roti, do-rangi kambal daan, aur roz 10 minute maun/dhyan.",
  },
  8: {
    title: "Karm aur Nyaay (Karma & Justice)",
    core:
      "Saturn ka ank. Der se par pakka. Sangharsh aapko ghisai deta hai aur phir sthayi safalta.",
    strengths: ["Adbhut sahansheelta", "Anushasan", "Nyaypriyata", "Badi zimmedari uthane ki kshamta"],
    weaknesses: ["Deri aur rukavat", "Nirasha", "Kathorta", "Akela sangharsh"],
    advice: "Shani ke liye — Shanivaar tel/kala til daan, mazdooron ka samman, aur kabhi kisi ka haq na dabana.",
  },
  9: {
    title: "Shakti aur Sangharsh (Energy & Courage)",
    core:
      "Mars ka ank. Himmat, urja aur ladne ka jazba. Aap rukte nahi, sirf disha badalte hain.",
    strengths: ["Nidarta", "Netritva field me", "Tezi se action", "Raksha karne ka swabhav"],
    weaknesses: ["Krodh", "Jaldbaazi", "Chot/durghatna", "Vivaad"],
    advice: "Mangal ke liye — Mangalvar Hanuman Chalisa, masoor daal daan, aur krodh par 10 second ka rule.",
  },
  11: {
    title: "Master 11 — Prakash Stambh",
    core: "2 ka master roop. Intuition itni tez ki log aapko guru maante hain, par nerves bhi utne hi sensitive.",
    strengths: ["Adbhut intuition", "Prerna dene ki shakti", "Adhyatmik samajh"],
    weaknesses: ["Ati-sanvedansheelta", "Anxiety", "Apni shakti par shak"],
    advice: "Rozana dhyan aur neend ka anushasan — 11 bina shant mann ke sirf tension banta hai.",
  },
  22: {
    title: "Master 22 — Master Builder",
    core: "4 ka master roop. Bade paimane par kuch banane ki kshamta — sansthan, company, mission.",
    strengths: ["Vision + practicality", "Bada sochna", "Sangathan kshamta"],
    weaknesses: ["Bojh mehsoos karna", "Perfectionism", "Burnout"],
    advice: "Vision ko chhote milestones me todein — 22 tabhi kaam karta hai jab plan likha hua ho.",
  },
  33: {
    title: "Master 33 — Master Teacher",
    core: "6 ka master roop. Nishkaam seva aur sikhaane ka ank — parivaar se bada daayra.",
    strengths: ["Karuna", "Sikhane ki kala", "Healing"],
    weaknesses: ["Apne aap ko bhool jaana", "Zyada zimmedari"],
    advice: "Doosron se pehle apni sehat — 33 ki seva tabhi tikti hai jab aap khud bhare ho.",
  },
};

/** Friendship matrix used in Indian ank-jyotish (based on graha maitri). */
const FRIENDS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 5, 7],
  3: [1, 2, 3, 6, 9],
  4: [4, 5, 6, 7, 8],
  5: [1, 4, 5, 6, 8],
  6: [3, 4, 5, 6, 8],
  7: [2, 4, 6, 7, 8],
  8: [4, 5, 6, 7, 8],
  9: [1, 2, 3, 9],
};
const ENEMIES: Record<number, number[]> = {
  1: [4, 6, 7, 8],
  2: [4, 6, 8, 9],
  3: [4, 5, 7, 8],
  4: [1, 2, 3, 9],
  5: [2, 9],
  6: [1, 2, 7, 9],
  7: [1, 3, 5, 9],
  8: [1, 2, 3, 9],
  9: [4, 5, 6, 7, 8],
};

export const NUM_LUCK: Record<
  number,
  { colors: string[]; days: string[]; gem: string; metal: string; deity: string; mantra: string; direction: string }
> = {
  1: { colors: ["Golden", "Orange", "Maroon"], days: ["Sunday", "Monday"], gem: "Ruby (Manik)", metal: "Gold/Copper", deity: "Surya", mantra: "ॐ घृणिः सूर्याय नमः", direction: "East" },
  2: { colors: ["White", "Cream", "Silver"], days: ["Monday", "Friday"], gem: "Pearl (Moti)", metal: "Silver", deity: "Chandra / Parvati", mantra: "ॐ सों सोमाय नमः", direction: "North-West" },
  3: { colors: ["Yellow", "Golden"], days: ["Thursday", "Tuesday"], gem: "Yellow Sapphire (Pukhraj)", metal: "Gold", deity: "Brihaspati / Vishnu", mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः", direction: "North-East" },
  4: { colors: ["Grey", "Electric Blue", "Khaki"], days: ["Sunday", "Saturday"], gem: "Hessonite (Gomed)", metal: "Ashtadhatu", deity: "Durga / Rahu", mantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः", direction: "South-West" },
  5: { colors: ["Green", "Light Grey"], days: ["Wednesday", "Friday"], gem: "Emerald (Panna)", metal: "Bronze", deity: "Vishnu / Budha", mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः", direction: "North" },
  6: { colors: ["White", "Pink", "Sky Blue"], days: ["Friday", "Wednesday"], gem: "Diamond / Opal", metal: "Silver/Platinum", deity: "Lakshmi / Shukra", mantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः", direction: "South-East" },
  7: { colors: ["Smoke Grey", "Sea Green", "Off-white"], days: ["Monday", "Sunday"], gem: "Cat's Eye (Lehsunia)", metal: "Silver", deity: "Ganesha / Ketu", mantra: "ॐ स्रां स्रीं स्रौं सः केतवे नमः", direction: "North-West" },
  8: { colors: ["Dark Blue", "Black", "Purple"], days: ["Saturday", "Friday"], gem: "Blue Sapphire (Neelam)", metal: "Iron/Steel", deity: "Shani / Hanuman", mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः", direction: "West" },
  9: { colors: ["Red", "Rust", "Crimson"], days: ["Tuesday", "Thursday"], gem: "Red Coral (Moonga)", metal: "Copper", deity: "Hanuman / Mangal", mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः", direction: "South" },
};

/* ------------------------------------------------------------------ */
/* Math helpers                                                         */
/* ------------------------------------------------------------------ */

export function digits(n: number): number[] {
  return String(Math.abs(n)).split("").map(Number);
}

/** Reduce to 1-9, keeping master numbers 11/22/33 when asked. */
export function reduce(n: number, keepMaster = false): number {
  let v = n;
  while (v > 9) {
    if (keepMaster && (v === 11 || v === 22 || v === 33)) return v;
    v = digits(v).reduce((a, b) => a + b, 0);
  }
  return v;
}

/** Full reduction chain, e.g. 29 → 11 → 2, as a readable string. */
export function reduceChain(n: number, keepMaster = false): string {
  const steps: string[] = [String(n)];
  let v = n;
  while (v > 9) {
    if (keepMaster && (v === 11 || v === 22 || v === 33)) break;
    const d = digits(v);
    v = d.reduce((a, b) => a + b, 0);
    steps.push(`${d.join("+")} = ${v}`);
  }
  return steps.join(" → ");
}

/* ------------------------------------------------------------------ */
/* Name numerology tables                                               */
/* ------------------------------------------------------------------ */

const CHALDEAN: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const PYTHAGOREAN: Record<string, number> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((ch, i) => {
  PYTHAGOREAN[ch] = (i % 9) + 1;
});

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function letters(name: string): string[] {
  return name.toUpperCase().replace(/[^A-Z]/g, "").split("");
}

function sumLetters(name: string, table: Record<string, number>, filter?: (c: string) => boolean) {
  const ls = letters(name).filter((c) => (filter ? filter(c) : true));
  const parts = ls.map((c) => `${c}=${table[c] ?? 0}`);
  const total = ls.reduce((a, c) => a + (table[c] ?? 0), 0);
  return { total, parts, count: ls.length };
}

/* ------------------------------------------------------------------ */
/* Lo Shu grid                                                          */
/* ------------------------------------------------------------------ */

export const LOSHU_LAYOUT = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export const LOSHU_MEANING: Record<number, { name: string; has: string; missing: string }> = {
  1: { name: "Vaani / Self-expression", has: "Apni baat kehna aata hai, career me pehchaan banti hai.", missing: "Bhavnaayein andar dab jaati hain, apna paksh rakhna mushkil." },
  2: { name: "Sahaj-gyaan / Intuition", has: "Logon ko padhne ki kshamta aur sahyog ka bhav.", missing: "Doosron ki niyat samajhne me galti, sensitivity kam." },
  3: { name: "Buddhi / Memory", has: "Padhai, yaaddasht aur tark achha.", missing: "Ekagrata aur planning me kami, cheezein bhool jaate hain." },
  4: { name: "Vyavastha / Discipline", has: "Sehat, sangathan aur practical kaam me majboot.", missing: "Aalas aur disorganisation, sehat par dhyan kam." },
  5: { name: "Santulan / Balance", has: "Grid ka centre — sehat, prem aur nirnay me sthirta.", missing: "Dishaheenta, rishton me utaar-chadhav, decisions latakte hain." },
  6: { name: "Rachnatmakta / Creativity", has: "Kala, ghar aur sundarta ka gehra bodh.", missing: "Creative confidence kam, ghar-parivar me udaseenta." },
  7: { name: "Tyag / Sacrifice-Spirit", has: "Anubhav se seekhna, adhyatmik gehrai.", missing: "Anubhav baar-baar dohrana padta hai, faith kam." },
  8: { name: "Vyavahaar / Practicality", has: "Paisa, planning aur duniyadari me samajh.", missing: "Money management aur order banaye rakhna mushkil." },
  9: { name: "Mahatvakansha / Ambition", has: "Lakshya, urja aur manaviyata prabal.", missing: "Lagbhag sabhi 1900 ke baad walon me hota hai — vishesh dosh nahi." },
};

const PLANES: { key: string; name: string; cells: number[]; meaning: string }[] = [
  { key: "mental", name: "Mansik Tal (4-9-2)", cells: [4, 9, 2], meaning: "Sochne, yojana banane aur tark ki shakti." },
  { key: "emotional", name: "Bhavnatmak Tal (3-5-7)", cells: [3, 5, 7], meaning: "Bhavnaayein, kala aur sanvedansheelta." },
  { key: "practical", name: "Vyavaharik Tal (8-1-6)", cells: [8, 1, 6], meaning: "Kaam ko zameen par utarne ki kshamta." },
  { key: "thought", name: "Vichar Stambh (4-3-8)", cells: [4, 3, 8], meaning: "Yojana banane ki shakti." },
  { key: "will", name: "Ichha Stambh (9-5-1)", cells: [9, 5, 1], meaning: "Sankalp shakti aur determination." },
  { key: "action", name: "Karm Stambh (2-7-6)", cells: [2, 7, 6], meaning: "Kaam poora karne ki kshamta." },
  { key: "golden", name: "Swarn Rekha (4-5-6)", cells: [4, 5, 6], meaning: "Bhagya aur samriddhi ki rekha." },
  { key: "silver", name: "Rajat Rekha (2-5-8)", cells: [2, 5, 8], meaning: "Sanvedansheelta aur vyavaharikta ka mel." },
];

/* ------------------------------------------------------------------ */
/* Kua (Feng Shui / Vastu number)                                       */
/* ------------------------------------------------------------------ */

const KUA_DIR: Record<number, { good: string[]; bad: string[]; group: string }> = {
  1: { good: ["SE", "E", "S", "N"], bad: ["W", "NE", "NW", "SW"], group: "East group" },
  2: { good: ["NE", "W", "NW", "SW"], bad: ["E", "SE", "S", "N"], group: "West group" },
  3: { good: ["S", "N", "SE", "E"], bad: ["SW", "NW", "NE", "W"], group: "East group" },
  4: { good: ["N", "S", "E", "SE"], bad: ["NW", "SW", "W", "NE"], group: "East group" },
  6: { good: ["W", "NE", "SW", "NW"], bad: ["SE", "E", "N", "S"], group: "West group" },
  7: { good: ["NW", "SW", "NE", "W"], bad: ["N", "S", "SE", "E"], group: "West group" },
  8: { good: ["SW", "NW", "W", "NE"], bad: ["S", "N", "E", "SE"], group: "West group" },
  9: { good: ["E", "SE", "N", "S"], bad: ["NE", "W", "SW", "NW"], group: "East group" },
};

/* ------------------------------------------------------------------ */
/* Karmic debts / lessons                                               */
/* ------------------------------------------------------------------ */

const KARMIC_DEBT: Record<number, { title: string; reason: string; remedy: string }> = {
  13: {
    title: "13/4 — Aalas ka karmic rin",
    reason: "Pichle karmon me shortcut aur kaam se bachne ki aadat rahi; is janm me har safalta mehnat maangti hai.",
    remedy: "Rozana ek fixed routine, kabhi kaam adhoora na chhodein. Shani/Rahu ke upay labhkari.",
  },
  14: {
    title: "14/5 — Swatantrata ka durupyog",
    reason: "Aazadi ka galat istemaal — bhog, vyasan ya vaada-khilafi. Is janm me sanyam hi mukti hai.",
    remedy: "Vyasan se poora parhez, ek samay par ek hi kaam, aur vachan nibhaana.",
  },
  16: {
    title: "16/7 — Ahankaar ka patan",
    reason: "Prem ya vishwas ka ghaat; jeevan me achanak girawat aakar ahankaar todti hai — phir naya nirmaan hota hai.",
    remedy: "Vinamrata, dhyan aur satya. Har girawat ke baad turant naya aadhaar banayein.",
  },
  19: {
    title: "19/1 — Shakti ka durupyog",
    reason: "Adhikar ka galat prayog; is janm me akele khade hokar doosron ki madad karni padegi.",
    remedy: "Netritva ko seva banayein, madad maangna seekhein, ego chhodein.",
  },
};

/* ------------------------------------------------------------------ */
/* Main builder                                                         */
/* ------------------------------------------------------------------ */

export type LoShuCell = { n: number; count: number; meaning: string; note: string };

export type NumerologyReport = {
  input: NumerologyInput;
  dob: { d: number; m: number; y: number };
  mulank: Explained;
  bhagyank: Explained;
  kudrat: Explained; // birth-day (as-is) number
  namank: Explained; // Chaldean name number
  pythagorean: Explained;
  soulUrge: Explained;
  personality: Explained;
  maturity: Explained;
  balance: Explained;
  kua: Explained & { good: string[]; bad: string[] };
  loShu: {
    cells: LoShuCell[];
    missing: number[];
    repeated: { n: number; count: number; note: string }[];
    planes: { name: string; complete: boolean; meaning: string; note: string }[];
  };
  compatibility: {
    friendly: number[];
    neutral: number[];
    enemy: number[];
    reason: string;
    partnerNote: string;
  };
  luck: {
    colors: string[];
    days: string[];
    gem: string;
    metal: string;
    deity: string;
    mantra: string;
    direction: string;
    luckyNumbers: number[];
    luckyDates: number[];
    reason: string;
  };
  karmicDebts: { title: string; reason: string; remedy: string; source: string }[];
  pinnacles: { n: number; number: number; from: number; to: number; reason: string; meaning: string }[];
  challenges: { n: number; number: number; reason: string; meaning: string }[];
  cycles: { name: string; number: number; from: number; to: number; reason: string; meaning: string }[];
  personal: {
    year: Explained;
    month: Explained;
    day: Explained;
    forecastYear: number;
  };
  relations: string[]; // mulank–bhagyank–namank interlinks
  nameSuggestions: { note: string; targets: number[] };
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PINNACLE_MEANING: Record<number, string> = {
  1: "Khud ko sthapit karne ka daur — pehal, naya kaam, apni pehchaan.",
  2: "Sath, sahyog aur rishton ka daur — dheere par sthir vikas.",
  3: "Abhivyakti, padhai, creativity aur samajik vistaar ka daur.",
  4: "Mehnat, dhaancha aur jimmedari ka daur — neev rakhi jaati hai.",
  5: "Badlaav, yatra, naye avsar aur azadi ka daur.",
  6: "Parivaar, prem, ghar aur seva ka daur.",
  7: "Antarmukhi daur — adhyayan, adhyatm aur atma-manthan.",
  8: "Arth, satta aur uplabdhi ka daur — karm ka phal milta hai.",
  9: "Poornata aur tyag ka daur — purane adhyay band hote hain.",
  11: "Prerna aur adhyatmik netritva ka uchch daur.",
  22: "Bade nirmaan ka daur — sansthan/mission khada hota hai.",
};

const CHALLENGE_MEANING: Record<number, string> = {
  0: "Sabse bada challenge — koi ek fixed kamzori nahi, sab kuch khud chunna padta hai. Apni marzi ka istemal sanyam se karein.",
  1: "Apni pehchan aur atma-vishwas ka sangharsh — doosron ke dabav me apni raay dabti hai.",
  2: "Ati-sanvedansheelta — chhoti baat chubhti hai, na kehna nahi aata.",
  3: "Abhivyakti ka dar — bhavnaayein andar rehti hain ya bikhri rehti hain.",
  4: "Anushasan aur mehnat se bachne ki pravritti — order banana seekhna hai.",
  5: "Azadi ka asantulan — ya to bandhan ya bilkul bikhraav.",
  6: "Zimmedari ka bojh aur adarshvaad — rishton me apeksha zyada.",
  7: "Vishwas ki kami aur akelapan — logon par bharosa karna sikhna hai.",
  8: "Paisa aur satta ka asantulan — kabhi kami, kabhi ati-mahatva.",
};

const PERSONAL_YEAR: Record<number, string> = {
  1: "Naye beej ka saal — jo aaj shuru karenge wo 9 saal chalega. Naukri badalna, business shuru karna, nayi pehchaan.",
  2: "Dheeraj ka saal — partnership, rishte, samjhauta. Zabardasti aage badhane ki koshish nuksaan degi.",
  3: "Vistaar aur abhivyakti ka saal — padhai, creativity, samajik jeevan, santaan sukh.",
  4: "Mehnat ka saal — neev, dastavez, ghar/property, sehat par dhyan. Result dikhega dheere.",
  5: "Badlaav ka saal — yatra, sthaan-parivartan, naye avsar. Sthir cheezein hil sakti hain.",
  6: "Parivaar ka saal — vivah, ghar, jimmedari, prem aur seva.",
  7: "Antarmukhi saal — adhyayan, chintan, sehat aur adhyatm. Bade financial risk se bachein.",
  8: "Phal ka saal — arth, pad, pratishtha; par karm ka hisaab bhi hota hai. Nyay-sangat rahein.",
  9: "Samapan ka saal — purana chhodna, daan, safai. Naya bada kaam agle saal ke liye rakhein.",
};

export function buildNumerology(input: NumerologyInput, today = new Date()): NumerologyReport {
  const [ys, ms, ds] = input.date.split("-").map(Number);
  const y = ys || 2000, m = ms || 1, d = ds || 1;

  /* ---- Mulank (Driver / Psychic number) ---- */
  const mulankN = reduce(d);
  const mulank: Explained = {
    label: "Mulank (Driver / Radical Number)",
    value: mulankN,
    planet: NUM_PLANET[mulankN].en,
    reason:
      `Janm tarikh ka din = ${d}. Sirf din ke ankon ko jodkar ek ank tak laate hain: ${reduceChain(d)}. ` +
      `Isliye Mulank = ${mulankN}, jiska swami graha ${NUM_PLANET[mulankN].en} (${NUM_PLANET[mulankN].hi}) hai. ` +
      `Mulank aapka andar ka swabhav hai — jo aap khud ko mehsoos karte hain, jo pehla reaction hota hai.`,
    meaning: NUM_TRAITS[mulankN].core,
    strengths: NUM_TRAITS[mulankN].strengths,
    weaknesses: NUM_TRAITS[mulankN].weaknesses,
    advice: NUM_TRAITS[mulankN].advice,
  };

  /* ---- Bhagyank (Destiny / Life path) ---- */
  const allDigits = `${d}${m}${y}`.split("").map(Number);
  const rawSum = allDigits.reduce((a, b) => a + b, 0);
  const bhagyankN = reduce(rawSum, true);
  const bhagyankBase = reduce(rawSum);
  const bTrait = NUM_TRAITS[bhagyankN] ?? NUM_TRAITS[bhagyankBase];
  const bhagyank: Explained = {
    label: "Bhagyank (Destiny / Life Path)",
    value: bhagyankN,
    planet: NUM_PLANET[bhagyankBase].en,
    reason:
      `Poori janm tithi ${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y} ke saare ank jode: ` +
      `${allDigits.join("+")} = ${rawSum}, phir ${reduceChain(rawSum, true)}. Bhagyank = ${bhagyankN}` +
      (bhagyankN > 9 ? ` (master number — iska base ${bhagyankBase} hai)` : "") +
      `. Yeh aapka jeevan-path hai: duniya aapse kya karwaana chahti hai, aur aap kis raaste par baar-baar laut aate hain. ` +
      `Mulank se ziyada powerful — 35 saal ki umar ke baad Bhagyank ka asar Mulank se zyada dikhta hai.`,
    meaning: bTrait.core,
    strengths: bTrait.strengths,
    weaknesses: bTrait.weaknesses,
    advice: bTrait.advice,
  };

  /* ---- Kudrat / birthday number (unreduced) ---- */
  const kudrat: Explained = {
    label: "Janm-Din Ank (Birthday Number)",
    value: d,
    reason:
      `Bina jode, janm ka din khud ek sanket hai: ${d}. Jahan Mulank aapka core hai, wahin ` +
      `${d} tarikh apne aap me ek vishesh pratibha deti hai — do-ank wali tarikhon me pehla ank ` +
      `"kaise" batata hai aur doosra "kya".`,
    meaning:
      d > 9
        ? `${d} = ${digits(d).join(" + ")} — matlab ${NUM_PLANET[digits(d)[0]].en} ki urja ` +
          `${NUM_PLANET[digits(d)[1]].en} ke saath milkar ${NUM_PLANET[mulankN].en} ka phal deti hai. ` +
          `Isliye aap ${mulankN} ke gun to dikhate hain par unka rasta ${NUM_PLANET[digits(d)[0]].en} jaisa hota hai.`
        : `Single digit janm-tithi — ${NUM_PLANET[mulankN].en} ki urja bilkul shuddh roop me, bina kisi mixing ke. ` +
          `Iska matlab gun aur dosh dono teekhe hote hain.`,
  };

  /* ---- Name numbers ---- */
  const ch = sumLetters(input.name, CHALDEAN);
  const namankN = reduce(ch.total);
  const namank: Explained = {
    label: "Namank (Chaldean Name Number)",
    value: namankN,
    planet: NUM_PLANET[namankN].en,
    reason:
      ch.count === 0
        ? "Naam nahi diya gaya, isliye Namank nahi nikala ja saka."
        : `Chaldean paddhati me har akshar ki dhwani ka ek ank hota hai (8 kabhi assign nahi hota kyunki wo Saturn ka bhaari ank hai). ` +
          `"${input.name}" ke akshar: ${ch.parts.join(", ")}. Kul = ${ch.total}, phir ${reduceChain(ch.total)}. ` +
          `Namank wo hai jo duniya aapke naam sunkar mehsoos karti hai — isi se yash, business aur brand chalta hai.`,
    meaning: NUM_TRAITS[namankN].core,
    strengths: NUM_TRAITS[namankN].strengths,
    weaknesses: NUM_TRAITS[namankN].weaknesses,
    advice: NUM_TRAITS[namankN].advice,
  };

  const py = sumLetters(input.name, PYTHAGOREAN);
  const pyN = reduce(py.total, true);
  const pyBase = reduce(py.total);
  const pythagorean: Explained = {
    label: "Expression Number (Pythagorean)",
    value: pyN,
    planet: NUM_PLANET[pyBase].en,
    reason:
      `Pythagorean paddhati me A=1, B=2 ... I=9 aur phir dobara 1 se. ` +
      `"${input.name}" ka kul = ${py.total}, ${reduceChain(py.total, true)}. ` +
      `Expression Number batata hai ki aapki pratibha kis roop me bahar aati hai — kaam, kala ya bhasha me.`,
    meaning: (NUM_TRAITS[pyN] ?? NUM_TRAITS[pyBase]).core,
  };

  const sv = sumLetters(input.name, PYTHAGOREAN, (c) => VOWELS.has(c));
  const svN = reduce(sv.total, true);
  const soulUrge: Explained = {
    label: "Soul Urge (Antarmann ka Ank)",
    value: svN || 0,
    reason:
      sv.count === 0
        ? "Naam me swar (vowels) nahi mile."
        : `Sirf swar (A, E, I, O, U) ginte hain kyunki swar bina rok-tok nikalti dhwani hain — wahi aatma ki aawaz maani jaati hai. ` +
          `${sv.parts.join(", ")} → ${sv.total} → ${reduceChain(sv.total, true)}. ` +
          `Yeh wo cheez hai jo aap chupke se chahte hain, bhale duniya ko na bataayein.`,
    meaning: (NUM_TRAITS[svN] ?? NUM_TRAITS[reduce(sv.total || 1)]).core,
  };

  const cons = sumLetters(input.name, PYTHAGOREAN, (c) => !VOWELS.has(c));
  const consN = reduce(cons.total, true);
  const personality: Explained = {
    label: "Personality Number (Bahari Chhavi)",
    value: consN || 0,
    reason:
      cons.count === 0
        ? "Naam me vyanjan nahi mile."
        : `Sirf vyanjan (consonants) — kyunki vyanjan dhwani ko aakar dete hain, jaise aapka bahri vyavhaar aapko. ` +
          `${cons.parts.join(", ")} → ${cons.total} → ${reduceChain(cons.total, true)}. ` +
          `Yeh wo pehla impression hai jo log aapse milte hi banate hain.`,
    meaning: (NUM_TRAITS[consN] ?? NUM_TRAITS[reduce(cons.total || 1)]).core,
  };

  const matN = reduce(bhagyankBase + pyBase, true);
  const maturity: Explained = {
    label: "Maturity Number (Paripakvta Ank)",
    value: matN,
    reason:
      `Bhagyank (${bhagyankBase}) + Expression (${pyBase}) = ${bhagyankBase + pyBase} → ${reduceChain(bhagyankBase + pyBase, true)}. ` +
      `Yeh ank lagbhag 35-40 saal ki umar ke baad khulta hai — jab jeevan ka path aur aapki pratibha ek ho jaate hain. ` +
      `Isse pata chalta hai ki aap "ban kar" kya honge.`,
    meaning: (NUM_TRAITS[matN] ?? NUM_TRAITS[reduce(matN)]).core,
  };

  const presentSet = new Set(letters(input.name).map((c) => PYTHAGOREAN[c]));
  const missingLetters = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !presentSet.has(n));
  const initials = input.name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .filter((c) => /[A-Z]/.test(c));
  const balN = reduce(initials.reduce((a, c) => a + (PYTHAGOREAN[c] ?? 0), 0) || 1);
  const balance: Explained = {
    label: "Balance Number (Sankat me Sahara)",
    value: balN,
    reason:
      `Naam ke har shabd ke pehle akshar: ${initials.join(", ") || "—"} → jod = ` +
      `${initials.reduce((a, c) => a + (PYTHAGOREAN[c] ?? 0), 0)} → ${balN}. ` +
      `Jab aap dabav me hote hain to aap apne aap hi is ank jaisa vyavhaar karne lagte hain — ` +
      `isliye sankat me ${NUM_PLANET[balN].en} ke upay sabse jaldi kaam karte hain.`,
    meaning: NUM_TRAITS[balN].advice,
  };

  /* ---- Kua number ---- */
  const yearSum = reduce(y);
  let kuaN: number;
  const after2000 = y >= 2000;
  const female = /f|w|स्त्री|female/i.test(input.gender);
  if (female) kuaN = reduce(yearSum + (after2000 ? 6 : 4));
  else kuaN = reduce((after2000 ? 9 : 11) - yearSum + 9);
  if (kuaN === 5) kuaN = female ? 8 : 2;
  const kuaInfo = KUA_DIR[kuaN] ?? KUA_DIR[1];
  const kua: Explained & { good: string[]; bad: string[] } = {
    label: "Kua Number (Vastu Disha Ank)",
    value: kuaN,
    reason:
      `Janm varsh ${y} ke ank jode: ${reduceChain(y)}. ` +
      (female
        ? `Mahila ke liye niyam: ${yearSum} + ${after2000 ? 6 : 4} → Kua = ${kuaN}.`
        : `Purush ke liye niyam: ${after2000 ? 9 : 11} − ${yearSum} → Kua = ${kuaN}.`) +
      (kuaN === 2 || kuaN === 8 ? ` (5 aane par purush ko 2 aur mahila ko 8 diya jaata hai.)` : "") +
      ` Kua se pata chalta hai ki aapki urja kis disha me badhti hai — isliye study table, ` +
      `office chair aur sone ka sir isi hisaab se set karein.`,
    meaning:
      `Aap ${kuaInfo.group} me aate hain. Shubh dishaayein: ${kuaInfo.good.join(", ")}. ` +
      `Baithte waqt munh shubh disha me aur sote waqt sir shubh disha me rakhein. ` +
      `Ashubh dishaayein: ${kuaInfo.bad.join(", ")} — inme lambe samay tak kaam karne se thakaan aur vivaad badhta hai.`,
    good: kuaInfo.good,
    bad: kuaInfo.bad,
  };

  /* ---- Lo Shu grid ---- */
  const gridDigits = `${String(d).padStart(2, "0")}${String(m).padStart(2, "0")}${y}`
    .split("")
    .map(Number)
    .filter((n) => n > 0);
  const extra = [mulankN, bhagyankBase].filter((n) => n > 0);
  const allGrid = [...gridDigits, ...extra];
  const counts: Record<number, number> = {};
  allGrid.forEach((n) => (counts[n] = (counts[n] ?? 0) + 1));

  const cells: LoShuCell[] = LOSHU_LAYOUT.map((n) => {
    const c = counts[n] ?? 0;
    const info = LOSHU_MEANING[n];
    return {
      n,
      count: c,
      meaning: info.name,
      note:
        c === 0
          ? `Ank ${n} gayab hai — ${info.missing} Iska upay: ${NUM_PLANET[n].en} ke ank ko jeevan me jodein ` +
            `(${NUM_LUCK[n].colors[0]} rang, ${NUM_LUCK[n].days[0]} ko vishesh dhyan, mantra "${NUM_LUCK[n].mantra}").`
          : c === 1
            ? `Ek baar — santulit. ${info.has}`
            : `${c} baar — is gun ki ati. ${info.has} Par zarurat se zyada hone par yeh ` +
              `${n === 1 ? "zid aur zyada bolna" : n === 4 ? "over-thinking aur rigidity" : n === 8 ? "paise ki chinta" : n === 9 ? "ati-mahatvakansha aur krodh" : "asantulan"} bhi de sakta hai.`,
    };
  });

  const missing = LOSHU_LAYOUT.filter((n) => !counts[n]).sort((a, b) => a - b);
  const repeated = LOSHU_LAYOUT.filter((n) => (counts[n] ?? 0) >= 2)
    .sort((a, b) => a - b)
    .map((n) => ({
      n,
      count: counts[n],
      note: `${n} ${counts[n]} baar — ${NUM_PLANET[n].en} ki urja bahut prabal, isliye ${LOSHU_MEANING[n].name} aapki pehchaan ban jaata hai.`,
    }));

  const planes = PLANES.map((p) => {
    const complete = p.cells.every((c) => (counts[c] ?? 0) > 0);
    const absent = p.cells.filter((c) => !(counts[c] ?? 0));
    return {
      name: p.name,
      complete,
      meaning: p.meaning,
      note: complete
        ? `Poora bana hua — ${p.meaning} Yeh aapki sabse bharosemand shakti hai kyunki teeno ank (${p.cells.join(", ")}) maujood hain.`
        : `Adhoora — ${absent.join(", ")} gayab hai, isliye ${p.meaning.toLowerCase()} me rukavat aati hai. ` +
          `Poora karne ke liye gayab ank ki urja apnayein.`,
    };
  });

  /* ---- Compatibility ---- */
  const fr = FRIENDS[mulankN] ?? [];
  const en = ENEMIES[mulankN] ?? [];
  const neu = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !fr.includes(n) && !en.includes(n));
  const compatibility = {
    friendly: fr,
    neutral: neu,
    enemy: en,
    reason:
      `Ank-maitri graha-maitri par aadharit hai. Aapka Mulank ${mulankN} = ${NUM_PLANET[mulankN].en}. ` +
      `Jin grahon se ${NUM_PLANET[mulankN].en} ki mitrata hai unke ank mitra hain (${fr.join(", ")}), ` +
      `jinse shatruta hai wo (${en.join(", ")}), baaki sam (${neu.join(", ")}).`,
    partnerNote:
      `Vivah/partnership me sabse pehle dusre vyakti ka Mulank aur Bhagyank dekhein. ` +
      `Agar Mulank shatru ho par Bhagyank mitra ho to shuruaat me takraar hoti hai par lambe samay me sath nibhta hai — ` +
      `kyunki Bhagyank jeevan ki disha hai aur Mulank sirf swabhav. Aapke Bhagyank ${bhagyankBase} ke liye ` +
      `${(FRIENDS[bhagyankBase] ?? []).join(", ")} sabse anukool hain.`,
  };

  /* ---- Luck ---- */
  const lk = NUM_LUCK[mulankN];
  const luckyNumbers = Array.from(new Set([mulankN, bhagyankBase, ...fr])).sort((a, b) => a - b);
  const luckyDates = Array.from({ length: 31 }, (_, i) => i + 1).filter((n) =>
    luckyNumbers.includes(reduce(n)),
  );
  const luck = {
    ...lk,
    luckyNumbers,
    luckyDates,
    reason:
      `Rang, dhatu aur ratna Mulank ke swami graha ${NUM_PLANET[mulankN].en} se aate hain — ` +
      `kyunki wahi graha aapke mann ki frequency chalata hai. Shubh ank me Mulank (${mulankN}), ` +
      `Bhagyank (${bhagyankBase}) aur unke mitra ank shaamil hain. Shubh tarikhein wahi hain jinka jod ` +
      `in ankon me aata hai — isliye naya kaam, agreement ya launch inhi tarikhon par karein.`,
  };

  /* ---- Karmic debts ---- */
  const karmicSources: { n: number; source: string }[] = [
    { n: rawSum, source: "poori janm tithi ka jod" },
    { n: d, source: "janm ka din" },
    { n: ch.total, source: "naam ka Chaldean jod" },
    { n: py.total, source: "naam ka Pythagorean jod" },
  ];
  const karmicDebts = karmicSources
    .filter((s) => KARMIC_DEBT[s.n])
    .map((s) => ({
      ...KARMIC_DEBT[s.n],
      source: `${s.source} = ${s.n}`,
    }));

  /* ---- Pinnacles & challenges ---- */
  const rm = reduce(m), rd = reduce(d), ry = reduce(y);
  const p1 = reduce(rm + rd, true);
  const p2 = reduce(rd + ry, true);
  const p3 = reduce(reduce(p1) + reduce(p2), true);
  const p4 = reduce(rm + ry, true);
  const firstEnd = 36 - bhagyankBase;
  const pinnacles = [
    { n: 1, number: p1, from: 0, to: firstEnd, calc: `Maah (${rm}) + Din (${rd})` },
    { n: 2, number: p2, from: firstEnd + 1, to: firstEnd + 9, calc: `Din (${rd}) + Varsh (${ry})` },
    { n: 3, number: p3, from: firstEnd + 10, to: firstEnd + 18, calc: `Pinnacle 1 (${reduce(p1)}) + Pinnacle 2 (${reduce(p2)})` },
    { n: 4, number: p4, from: firstEnd + 19, to: 99, calc: `Maah (${rm}) + Varsh (${ry})` },
  ].map((p) => ({
    n: p.n,
    number: p.number,
    from: p.from,
    to: p.to,
    reason:
      `${p.calc} → ${p.number}. Pehla shikhar hamesha 36 − Bhagyank (${bhagyankBase}) = ${firstEnd} saal tak chalta hai, ` +
      `phir har agla 9 saal ka. Isliye ${p.from}–${p.to === 99 ? "aage" : p.to} saal ki umar me jeevan ` +
      `${NUM_PLANET[reduce(p.number)].en} ke rang me dhalta hai.`,
    meaning: PINNACLE_MEANING[p.number] ?? PINNACLE_MEANING[reduce(p.number)],
  }));

  const c1 = Math.abs(rm - rd);
  const c2 = Math.abs(rd - ry);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(rm - ry);
  const challenges = [
    { n: 1, number: c1, calc: `|Maah ${rm} − Din ${rd}|` },
    { n: 2, number: c2, calc: `|Din ${rd} − Varsh ${ry}|` },
    { n: 3, number: c3, calc: `|Challenge 1 ${c1} − Challenge 2 ${c2}| (jeevan bhar ka mukhya challenge)` },
    { n: 4, number: c4, calc: `|Maah ${rm} − Varsh ${ry}|` },
  ].map((c) => ({
    n: c.n,
    number: c.number,
    reason:
      `${c.calc} = ${c.number}. Challenge ghatane se nikalta hai kyunki yeh wo khaali jagah hai jo do urjaon ke ` +
      `antar se banti hai — jeevan isi khaali jagah ko bharne ke liye paristhitiyaan bhejta hai.`,
    meaning: CHALLENGE_MEANING[c.number] ?? CHALLENGE_MEANING[0],
  }));

  const cycles = [
    { name: "Pratham Chakra (Bachpan/Yuva)", number: reduce(m, true), from: 0, to: firstEnd, base: `Janm maah ${m}` },
    { name: "Dwitiya Chakra (Utpadak Kaal)", number: reduce(d, true), from: firstEnd + 1, to: firstEnd + 27, base: `Janm din ${d}` },
    { name: "Tritiya Chakra (Parinati)", number: reduce(y, true), from: firstEnd + 28, to: 99, base: `Janm varsh ${y}` },
  ].map((c) => ({
    name: c.name,
    number: c.number,
    from: c.from,
    to: c.to,
    reason: `${c.base} → ${c.number}. Jeevan ke teen bade chakra maah, din aur varsh se bante hain; ` +
      `har chakra apne graha ${NUM_PLANET[reduce(c.number)].en} ke hisaab se paristhiti banata hai.`,
    meaning: PINNACLE_MEANING[c.number] ?? PINNACLE_MEANING[reduce(c.number)],
  }));

  /* ---- Personal year / month / day ---- */
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();
  // Personal year runs from birthday; if birthday not yet passed this year, use previous.
  const hadBirthday = tm > m || (tm === m && td >= d);
  const pyYear = hadBirthday ? ty : ty - 1;
  const pYearN = reduce(reduce(d) + reduce(m) + reduce(pyYear));
  const pMonthN = reduce(pYearN + reduce(tm));
  const pDayN = reduce(pMonthN + reduce(td));

  const personal = {
    forecastYear: pyYear,
    year: {
      label: `Personal Year ${pyYear}`,
      value: pYearN,
      planet: NUM_PLANET[pYearN].en,
      reason:
        `Janm din (${reduce(d)}) + janm maah (${reduce(m)}) + chalu varsh (${reduceChain(pyYear)}) ` +
        `= ${reduce(d) + reduce(m) + reduce(pyYear)} → ${pYearN}. ` +
        `Personal year janmdin se janmdin tak chalta hai, 1 January se nahi — ` +
        `${hadBirthday ? "aapka is saal ka janmdin nikal chuka hai" : "aapka is saal ka janmdin abhi aaya nahi"}, ` +
        `isliye abhi ${pyYear} ka chakra chal raha hai. 1 se 9 tak ka poora chakra 9 saal ka hota hai.`,
      meaning: PERSONAL_YEAR[pYearN],
    },
    month: {
      label: `Personal Month — ${MONTH_NAMES[tm - 1]}`,
      value: pMonthN,
      planet: NUM_PLANET[pMonthN].en,
      reason: `Personal Year (${pYearN}) + chalu maah (${reduce(tm)}) = ${pYearN + reduce(tm)} → ${pMonthN}. ` +
        `Maah ka ank saal ke theme ke andar chhota chapter banata hai.`,
      meaning: PERSONAL_YEAR[pMonthN],
    },
    day: {
      label: "Personal Day (aaj)",
      value: pDayN,
      planet: NUM_PLANET[pDayN].en,
      reason: `Personal Month (${pMonthN}) + aaj ki tarikh (${reduce(td)}) = ${pMonthN + reduce(td)} → ${pDayN}. ` +
        `Aaj ka mood aur kaam ka rang ${NUM_PLANET[pDayN].en} jaisa rahega.`,
      meaning: PERSONAL_YEAR[pDayN],
    },
  };

  /* ---- Interlinks: mulank vs bhagyank vs namank ---- */
  const relations: string[] = [];
  const mbFriend = fr.includes(bhagyankBase);
  const mbEnemy = en.includes(bhagyankBase);
  relations.push(
    mulankN === bhagyankBase
      ? `Mulank aur Bhagyank dono ${mulankN} hain — yeh "double ${NUM_PLANET[mulankN].en}" hai. Iska matlab aapka swabhav aur aapka jeevan-path ek hi disha me hain, isliye focus bahut tez hoga; lekin ${NUM_PLANET[mulankN].en} ke dosh (${NUM_TRAITS[mulankN].weaknesses[0]}) bhi do guna dikhenge kyunki unhe balance karne wala doosra graha nahi hai.`
      : mbFriend
        ? `Mulank ${mulankN} (${NUM_PLANET[mulankN].en}) aur Bhagyank ${bhagyankBase} (${NUM_PLANET[bhagyankBase].en}) aapas me mitra hain — isliye aap jo chahte hain aur jo jeevan aapse karwaata hai, dono lagbhag ek hi hain. Andar ka takraav kam rehta hai aur mehnat ka phal seedha milta hai.`
        : mbEnemy
          ? `Mulank ${mulankN} (${NUM_PLANET[mulankN].en}) aur Bhagyank ${bhagyankBase} (${NUM_PLANET[bhagyankBase].en}) aapas me shatru hain — yahi aapke jeevan ka mool andar-ka-dwand hai: mann kuch chahta hai, halaat kuch aur karwaate hain. Iska hal ladna nahi, balki Bhagyank ko maalik maanna hai — kyunki 35 ke baad Bhagyank hi jeetta hai. Bhagyank ${bhagyankBase} ke upay (${NUM_TRAITS[bhagyankBase].advice}) sabse zaroori hain.`
          : `Mulank ${mulankN} aur Bhagyank ${bhagyankBase} sam (neutral) hain — na khaas madad, na rukavat. Aisi kundli me naam ka ank (Namank) nirnayak ho jaata hai, kyunki wahi tie-breaker banta hai.`,
  );
  if (ch.count) {
    const nFriendM = (FRIENDS[mulankN] ?? []).includes(namankN);
    const nFriendB = (FRIENDS[bhagyankBase] ?? []).includes(namankN);
    relations.push(
      namankN === mulankN || namankN === bhagyankBase
        ? `Namank ${namankN} aapke ${namankN === mulankN ? "Mulank" : "Bhagyank"} se milta hai — naam aapke swabhav ko aur majboot karta hai. Naam badalne ki koi zarurat nahi.`
        : nFriendM || nFriendB
          ? `Namank ${namankN} (${NUM_PLANET[namankN].en}) aapke ${nFriendM ? `Mulank ${mulankN}` : `Bhagyank ${bhagyankBase}`} ka mitra hai — naam aapke liye support kar raha hai. Public life aur business me yeh naam chalega.`
          : `Namank ${namankN} (${NUM_PLANET[namankN].en}) na Mulank ${mulankN} ka mitra hai na Bhagyank ${bhagyankBase} ka — yahi wajah hai ki mehnat ke hisaab se pehchaan kam milti hai. Spelling me halka badlaav karke Namank ko ${Array.from(new Set([...fr, ...(FRIENDS[bhagyankBase] ?? [])])).join(" ya ")} par laane se naam ka support mil jaata hai.`,
    );
  }
  if (missing.length) {
    relations.push(
      `Lo Shu me ${missing.join(", ")} gayab hain. Dhyan dein: agar gayab ank aapke Bhagyank ka mitra hai to uski kami zyada khalti hai, ` +
        `kyunki jeevan-path ko usi urja ki zarurat padti hai. Isliye ${missing
          .map((n) => `${n} ke liye ${NUM_LUCK[n].colors[0]} rang / ${NUM_LUCK[n].days[0]}`)
          .join(", ")} — yahi sabse saral bharpai hai.`,
    );
  }
  if (karmicDebts.length) {
    relations.push(
      `Karmic debt mila (${karmicDebts.map((k) => k.title).join(", ")}) — iska matlab bura bhagya nahi, ` +
        `balki ek nishchit paath hai jo baar-baar samne aayega jab tak seekh na lein. Yahi wajah hai ki ek jaisi ` +
        `pareshani zindagi me repeat hoti mehsoos hoti hai.`,
    );
  }
  relations.push(
    `Abhi Personal Year ${pYearN} chal raha hai jabki aapka Bhagyank ${bhagyankBase} hai — ` +
      ((FRIENDS[bhagyankBase] ?? []).includes(pYearN) || pYearN === bhagyankBase
        ? `dono anukool hain, isliye yeh saal aapke jeevan-lakshya ko aage badhane ke liye achha hai. Bade nirnay is saal lein.`
        : `dono ka mel kam hai, isliye is saal bade nirnay se pehle do baar sochein; yeh saal taiyari ka hai, chhalang ka nahi.`),
  );

  const nameTargets = Array.from(new Set([mulankN, bhagyankBase, ...fr])).sort((a, b) => a - b);
  const nameSuggestions = {
    targets: nameTargets,
    note:
      `Naam sudharne ka niyam: Namank ka jod ${nameTargets.join(", ")} me se kisi ek par aana chahiye. ` +
      `Badlaav sirf spelling me karein (jaise ek extra "a", "h" ya "e"), pukarne ka naam wahi rakhein — ` +
      `kyunki numerology dhwani par chalti hai, aur likhavat dhwani ko tune karti hai. Naya naam kam se kam ` +
      `40 din tak roz likhein aur bolein, tabhi uski frequency banti hai. 8 aur 4 ko naam-ank ke roop me ` +
      `aam taur par bachaya jaata hai jab tak wo aapka apna Mulank/Bhagyank na ho.`,
  };

  return {
    input,
    dob: { d, m, y },
    mulank,
    bhagyank,
    kudrat,
    namank,
    pythagorean,
    soulUrge,
    personality,
    maturity,
    balance,
    kua,
    loShu: { cells, missing, repeated, planes },
    compatibility,
    luck,
    karmicDebts,
    pinnacles,
    challenges,
    cycles,
    personal,
    relations,
    nameSuggestions,
  };
}

/** Numerology-to-numerology compatibility between two people. */
export function numerologyMatch(a: NumerologyInput, b: NumerologyInput) {
  const ra = buildNumerology(a);
  const rb = buildNumerology(b);
  const am = Number(ra.mulank.value), bm = Number(rb.mulank.value);
  const ab = reduce(Number(ra.bhagyank.value)), bb = reduce(Number(rb.bhagyank.value));

  const rate = (x: number, y: number) =>
    x === y ? 85 : (FRIENDS[x] ?? []).includes(y) ? 90 : (ENEMIES[x] ?? []).includes(y) ? 35 : 60;

  const mulankScore = rate(am, bm);
  const bhagyaScore = rate(ab, bb);
  const total = Math.round(mulankScore * 0.4 + bhagyaScore * 0.6);

  return {
    a: ra,
    b: rb,
    mulankScore,
    bhagyaScore,
    total,
    lines: [
      `Mulank ${am} (${NUM_PLANET[am].en}) vs ${bm} (${NUM_PLANET[bm].en}) → ${mulankScore}%. ` +
        `Mulank rozmarra ka swabhav hai, isliye ismein jitna mel hoga utni hi kam takraar hogi.`,
      `Bhagyank ${ab} (${NUM_PLANET[ab].en}) vs ${bb} (${NUM_PLANET[bb].en}) → ${bhagyaScore}%. ` +
        `Bhagyank jeevan ki disha hai — lambe rishte ka asli aadhaar yahi hai, isliye ise 60% weight diya gaya.`,
      `Kul ank-milan = ${total}%. ` +
        (total >= 75
          ? "Achha mel — dono ki urja ek disha me chalti hai."
          : total >= 55
            ? "Theek mel — thodi samajhdari se rishta sthir rahega; ek dusre ke lucky rang/din ka dhyan rakhein."
            : "Kamzor mel — takraar sambhav. Dono apne-apne swami graha ke upay karein aur ghar me common lucky colour rakhein."),
    ],
  };
}
