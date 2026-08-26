export const SIGNS = [
  { en: "Aries", hi: "मेष", lord: "Mars", element: "Fire", nature: "Movable" },
  { en: "Taurus", hi: "वृषभ", lord: "Venus", element: "Earth", nature: "Fixed" },
  { en: "Gemini", hi: "मिथुन", lord: "Mercury", element: "Air", nature: "Dual" },
  { en: "Cancer", hi: "कर्क", lord: "Moon", element: "Water", nature: "Movable" },
  { en: "Leo", hi: "सिंह", lord: "Sun", element: "Fire", nature: "Fixed" },
  { en: "Virgo", hi: "कन्या", lord: "Mercury", element: "Earth", nature: "Dual" },
  { en: "Libra", hi: "तुला", lord: "Venus", element: "Air", nature: "Movable" },
  { en: "Scorpio", hi: "वृश्चिक", lord: "Mars", element: "Water", nature: "Fixed" },
  { en: "Sagittarius", hi: "धनु", lord: "Jupiter", element: "Fire", nature: "Dual" },
  { en: "Capricorn", hi: "मकर", lord: "Saturn", element: "Earth", nature: "Movable" },
  { en: "Aquarius", hi: "कुम्भ", lord: "Saturn", element: "Air", nature: "Fixed" },
  { en: "Pisces", hi: "मीन", lord: "Jupiter", element: "Water", nature: "Dual" },
] as const;

export const NAKSHATRAS = [
  { en: "Ashwini", hi: "अश्विनी", lord: "Ketu", deity: "Ashwini Kumaras" },
  { en: "Bharani", hi: "भरणी", lord: "Venus", deity: "Yama" },
  { en: "Krittika", hi: "कृत्तिका", lord: "Sun", deity: "Agni" },
  { en: "Rohini", hi: "रोहिणी", lord: "Moon", deity: "Brahma" },
  { en: "Mrigashira", hi: "मृगशिरा", lord: "Mars", deity: "Soma" },
  { en: "Ardra", hi: "आर्द्रा", lord: "Rahu", deity: "Rudra" },
  { en: "Punarvasu", hi: "पुनर्वसु", lord: "Jupiter", deity: "Aditi" },
  { en: "Pushya", hi: "पुष्य", lord: "Saturn", deity: "Brihaspati" },
  { en: "Ashlesha", hi: "आश्लेषा", lord: "Mercury", deity: "Nagas" },
  { en: "Magha", hi: "मघा", lord: "Ketu", deity: "Pitras" },
  { en: "Purva Phalguni", hi: "पूर्वा फाल्गुनी", lord: "Venus", deity: "Bhaga" },
  { en: "Uttara Phalguni", hi: "उत्तरा फाल्गुनी", lord: "Sun", deity: "Aryaman" },
  { en: "Hasta", hi: "हस्त", lord: "Moon", deity: "Savitr" },
  { en: "Chitra", hi: "चित्रा", lord: "Mars", deity: "Vishwakarma" },
  { en: "Swati", hi: "स्वाति", lord: "Rahu", deity: "Vayu" },
  { en: "Vishakha", hi: "विशाखा", lord: "Jupiter", deity: "Indragni" },
  { en: "Anuradha", hi: "अनुराधा", lord: "Saturn", deity: "Mitra" },
  { en: "Jyeshtha", hi: "ज्येष्ठा", lord: "Mercury", deity: "Indra" },
  { en: "Mula", hi: "मूल", lord: "Ketu", deity: "Nirriti" },
  { en: "Purva Ashadha", hi: "पूर्वाषाढ़ा", lord: "Venus", deity: "Apas" },
  { en: "Uttara Ashadha", hi: "उत्तराषाढ़ा", lord: "Sun", deity: "Vishwadevas" },
  { en: "Shravana", hi: "श्रवण", lord: "Moon", deity: "Vishnu" },
  { en: "Dhanishta", hi: "धनिष्ठा", lord: "Mars", deity: "Vasus" },
  { en: "Shatabhisha", hi: "शतभिषा", lord: "Rahu", deity: "Varuna" },
  { en: "Purva Bhadrapada", hi: "पूर्वा भाद्रपद", lord: "Jupiter", deity: "Aja Ekapada" },
  { en: "Uttara Bhadrapada", hi: "उत्तरा भाद्रपद", lord: "Saturn", deity: "Ahirbudhnya" },
  { en: "Revati", hi: "रेवती", lord: "Mercury", deity: "Pushan" },
] as const;

export const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export const DASHA_ORDER = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

export type PlanetKey =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export const PLANET_META: Record<
  PlanetKey,
  {
    hi: string;
    short: string;
    nature: "Benefic" | "Malefic" | "Neutral";
    signifies: string;
    body: string;
    career: string;
    own: number[];
    exalt: number;
    debil: number;
    mool?: number;
    friends: PlanetKey[];
    enemies: PlanetKey[];
    gem: string;
    metal: string;
    mantra: string;
    beej: string;
    day: string;
    charity: string;
    rudraksha: string;
    colour: string;
    deity: string;
  }
> = {
  Sun: {
    hi: "सूर्य", short: "Su", nature: "Malefic",
    signifies: "Soul, father, authority, vitality, government, self-confidence",
    body: "Heart, eyes, bones, right eye",
    career: "Administration, government service, medicine, leadership roles",
    own: [4], exalt: 0, debil: 6, mool: 4,
    friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"],
    gem: "Ruby (Manik), 3-6 carat, gold ring, right ring finger, Sunday sunrise",
    metal: "Gold / Copper",
    mantra: "ॐ घृणिः सूर्याय नमः (7,000 times)",
    beej: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    day: "Sunday", charity: "Wheat, jaggery, red cloth, copper to a temple",
    rudraksha: "12 Mukhi", colour: "Deep red / orange", deity: "Lord Surya, Shiva",
  },
  Moon: {
    hi: "चन्द्र", short: "Mo", nature: "Benefic",
    signifies: "Mind, mother, emotions, memory, nourishment, public",
    body: "Blood, lungs, lymph, left eye, stomach",
    career: "Nursing, hospitality, water business, dairy, psychology, arts",
    own: [3], exalt: 1, debil: 7, mool: 1,
    friends: ["Sun", "Mercury"], enemies: [],
    gem: "Pearl (Moti), 4-7 carat, silver ring, little finger, Monday evening",
    metal: "Silver",
    mantra: "ॐ सोम सोमाय नमः (11,000 times)",
    beej: "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः",
    day: "Monday", charity: "Rice, milk, white cloth, silver, curd",
    rudraksha: "2 Mukhi", colour: "White / silver", deity: "Goddess Parvati, Shiva",
  },
  Mars: {
    hi: "मंगल", short: "Ma", nature: "Malefic",
    signifies: "Courage, energy, siblings, land, surgery, conflict, ambition",
    body: "Muscles, bone marrow, blood, forehead",
    career: "Defence, police, surgery, engineering, sports, real estate",
    own: [0, 7], exalt: 9, debil: 3, mool: 0,
    friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"],
    gem: "Red Coral (Moonga), 6-9 carat, copper/gold, ring finger, Tuesday",
    metal: "Copper",
    mantra: "ॐ अं अंगारकाय नमः (10,000 times)",
    beej: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    day: "Tuesday", charity: "Red lentils (masoor), red cloth, jaggery, copper",
    rudraksha: "3 Mukhi", colour: "Red", deity: "Hanuman ji, Kartikeya",
  },
  Mercury: {
    hi: "बुध", short: "Me", nature: "Neutral",
    signifies: "Intellect, speech, commerce, calculation, skin, education",
    body: "Skin, nervous system, tongue, intestines",
    career: "Business, accounting, writing, IT, teaching, trading, media",
    own: [2, 5], exalt: 5, debil: 11, mool: 5,
    friends: ["Sun", "Venus"], enemies: ["Moon"],
    gem: "Emerald (Panna), 4-7 carat, gold/silver, little finger, Wednesday",
    metal: "Gold / Bronze",
    mantra: "ॐ बुं बुधाय नमः (9,000 times)",
    beej: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    day: "Wednesday", charity: "Green moong dal, green cloth, books to students",
    rudraksha: "4 Mukhi", colour: "Green", deity: "Lord Vishnu, Ganesha",
  },
  Jupiter: {
    hi: "गुरु", short: "Ju", nature: "Benefic",
    signifies: "Wisdom, dharma, children, wealth, teachers, expansion, luck",
    body: "Liver, fat, thighs, arterial system",
    career: "Teaching, law, finance, priesthood, counselling, publishing",
    own: [8, 11], exalt: 3, debil: 9, mool: 8,
    friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"],
    gem: "Yellow Sapphire (Pukhraj), 5-8 carat, gold, index finger, Thursday",
    metal: "Gold",
    mantra: "ॐ बृं बृहस्पतये नमः (19,000 times)",
    beej: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    day: "Thursday", charity: "Chana dal, turmeric, yellow cloth, ghee, books",
    rudraksha: "5 Mukhi", colour: "Yellow / golden", deity: "Brihaspati, Vishnu",
  },
  Venus: {
    hi: "शुक्र", short: "Ve", nature: "Benefic",
    signifies: "Love, marriage, beauty, luxury, vehicles, arts, comforts",
    body: "Reproductive system, kidneys, face, eyes",
    career: "Art, design, fashion, entertainment, luxury goods, hospitality",
    own: [1, 6], exalt: 11, debil: 5, mool: 6,
    friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"],
    gem: "Diamond / White Sapphire, 1+ carat, silver/platinum, middle finger, Friday",
    metal: "Silver / Platinum",
    mantra: "ॐ शुं शुक्राय नमः (16,000 times)",
    beej: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    day: "Friday", charity: "Rice, sugar, white/ silk cloth, perfume, curd",
    rudraksha: "6 Mukhi", colour: "White / pastel", deity: "Goddess Lakshmi",
  },
  Saturn: {
    hi: "शनि", short: "Sa", nature: "Malefic",
    signifies: "Discipline, karma, delay, labour, longevity, detachment",
    body: "Bones, teeth, joints, knees, nerves",
    career: "Labour, mining, iron, agriculture, law, research, service",
    own: [9, 10], exalt: 6, debil: 0, mool: 10,
    friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"],
    gem: "Blue Sapphire (Neelam), 4-6 carat, iron/silver, middle finger, Saturday",
    metal: "Iron / Panchdhatu",
    mantra: "ॐ शं शनैश्चराय नमः (23,000 times)",
    beej: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    day: "Saturday", charity: "Black sesame, mustard oil, black cloth, iron, urad dal",
    rudraksha: "7 Mukhi", colour: "Black / dark blue", deity: "Shani Dev, Hanuman ji",
  },
  Rahu: {
    hi: "राहु", short: "Ra", nature: "Malefic",
    signifies: "Desire, illusion, foreign lands, technology, sudden rise",
    body: "Nervous disorders, skin, speech defects",
    career: "Technology, aviation, foreign trade, politics, speculation",
    own: [], exalt: 1, debil: 7,
    friends: ["Saturn", "Venus", "Mercury"], enemies: ["Sun", "Moon", "Mars"],
    gem: "Hessonite (Gomed), 6-9 carat, silver, middle finger, Saturday",
    metal: "Silver / Ashtadhatu",
    mantra: "ॐ रां राहवे नमः (18,000 times)",
    beej: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    day: "Saturday", charity: "Urad dal, mustard oil, blanket, coconut in water",
    rudraksha: "8 Mukhi", colour: "Smoky grey", deity: "Durga, Bhairav",
  },
  Ketu: {
    hi: "केतु", short: "Ke", nature: "Malefic",
    signifies: "Detachment, moksha, past karma, occult, sudden loss & insight",
    body: "Spine, joints, unexplained ailments",
    career: "Spirituality, healing, research, occult sciences, computing",
    own: [], exalt: 7, debil: 1,
    friends: ["Mars", "Jupiter"], enemies: ["Moon", "Venus"],
    gem: "Cat's Eye (Lehsunia), 5-7 carat, silver, ring finger, Tuesday",
    metal: "Silver",
    mantra: "ॐ कें केतवे नमः (17,000 times)",
    beej: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    day: "Tuesday", charity: "Sesame, blanket, black-white blanket, feed dogs",
    rudraksha: "9 Mukhi", colour: "Multi / brown", deity: "Ganesha, Bhairav",
  },
};

export const HOUSES = [
  { name: "Tanu Bhava", hi: "प्रथम — तनु", title: "Self & Personality", areas: "Body, appearance, vitality, temperament, life direction" },
  { name: "Dhana Bhava", hi: "द्वितीय — धन", title: "Wealth & Speech", areas: "Savings, family, food, speech, values, movable assets" },
  { name: "Sahaja Bhava", hi: "तृतीय — सहज", title: "Siblings & Courage", areas: "Younger siblings, communication, skills, short travel" },
  { name: "Sukha Bhava", hi: "चतुर्थ — सुख", title: "Mother & Home", areas: "Mother, property, vehicles, inner peace, early education" },
  { name: "Putra Bhava", hi: "पंचम — पुत्र", title: "Children & Creativity", areas: "Children, romance, intellect, mantra siddhi, speculation" },
  { name: "Roga Bhava", hi: "षष्ठ — रोग", title: "Health & Enemies", areas: "Disease, debts, competition, service, daily discipline" },
  { name: "Kalatra Bhava", hi: "सप्तम — कलत्र", title: "Marriage & Partnership", areas: "Spouse, business partners, contracts, public dealings" },
  { name: "Ayu Bhava", hi: "अष्टम — आयु", title: "Longevity & Occult", areas: "Longevity, inheritance, research, transformation, sudden events" },
  { name: "Bhagya Bhava", hi: "नवम — भाग्य", title: "Fortune & Dharma", areas: "Luck, father, guru, higher learning, pilgrimage, ethics" },
  { name: "Karma Bhava", hi: "दशम — कर्म", title: "Career & Status", areas: "Profession, authority, reputation, karma in the world" },
  { name: "Labha Bhava", hi: "एकादश — लाभ", title: "Gains & Network", areas: "Income, elder siblings, friends, fulfilment of desires" },
  { name: "Vyaya Bhava", hi: "द्वादश — व्यय", title: "Loss & Liberation", areas: "Expenses, foreign lands, sleep, moksha, hidden matters" },
];

export const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

export const KARANAS = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
];

export const YOGAS_PANCHANG = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
  "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];

export const WEEKDAYS = [
  { en: "Sunday", hi: "रविवार" },
  { en: "Monday", hi: "सोमवार" },
  { en: "Tuesday", hi: "मंगलवार" },
  { en: "Wednesday", hi: "बुधवार" },
  { en: "Thursday", hi: "गुरुवार" },
  { en: "Friday", hi: "शुक्रवार" },
  { en: "Saturday", hi: "शनिवार" },
];

export type City = { name: string; state: string; lat: number; lon: number; tz: number };

export const CITIES: City[] = [
  { name: "Delhi", state: "Delhi", lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882, tz: 5.5 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lon: 76.9558, tz: 5.5 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: "Mysuru", state: "Karnataka", lat: 12.2958, lon: 76.6394, tz: 5.5 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lon: 78.4867, tz: 5.5 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lon: 72.8311, tz: 5.5 },
  { name: "Rajkot", state: "Gujarat", lat: 22.3039, lon: 70.8022, tz: 5.5 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lon: 73.0243, tz: 5.5 },
  { name: "Udaipur", state: "Rajasthan", lat: 24.5854, lon: 73.7125, tz: 5.5 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319, tz: 5.5 },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lon: 81.8463, tz: 5.5 },
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lon: 78.0081, tz: 5.5 },
  { name: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lon: 77.7064, tz: 5.5 },
  { name: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lon: 83.3732, tz: 5.5 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { name: "Gaya", state: "Bihar", lat: 24.7955, lon: 85.0002, tz: 5.5 },
  { name: "Ranchi", state: "Jharkhand", lat: 23.3441, lon: 85.3096, tz: 5.5 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, tz: 5.5 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, tz: 5.5 },
  { name: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lon: 78.1828, tz: 5.5 },
  { name: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lon: 79.9864, tz: 5.5 },
  { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, tz: 5.5 },
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lon: 76.7794, tz: 5.5 },
  { name: "Ludhiana", state: "Punjab", lat: 30.901, lon: 75.8573, tz: 5.5 },
  { name: "Amritsar", state: "Punjab", lat: 31.634, lon: 74.8723, tz: 5.5 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322, tz: 5.5 },
  { name: "Haridwar", state: "Uttarakhand", lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, tz: 5.5 },
  { name: "Srinagar", state: "J&K", lat: 34.0837, lon: 74.7973, tz: 5.5 },
  { name: "Jammu", state: "J&K", lat: 32.7266, lon: 74.857, tz: 5.5 },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, tz: 5.5 },
  { name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lon: 85.8245, tz: 5.5 },
  { name: "Cuttack", state: "Odisha", lat: 20.4625, lon: 85.8828, tz: 5.5 },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lon: 76.9366, tz: 5.5 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673, tz: 5.5 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, tz: 5.5 },
  { name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lon: 80.648, tz: 5.5 },
  { name: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { name: "Goa (Panaji)", state: "Goa", lat: 15.4909, lon: 73.8278, tz: 5.5 },
  { name: "Kathmandu", state: "Nepal", lat: 27.7172, lon: 85.324, tz: 5.75 },
  { name: "Dubai", state: "UAE", lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: "London", state: "UK", lat: 51.5072, lon: -0.1276, tz: 0 },
  { name: "New York", state: "USA", lat: 40.7128, lon: -74.006, tz: -5 },
  { name: "Toronto", state: "Canada", lat: 43.6532, lon: -79.3832, tz: -5 },
  { name: "Singapore", state: "Singapore", lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: "Sydney", state: "Australia", lat: -33.8688, lon: 151.2093, tz: 10 },
];
