/**
 * Compact astronomical engine: apparent geocentric ecliptic longitudes
 * for the Sun, Moon and the five visible planets, plus the lunar node.
 * Accuracy is on the order of a few arc-minutes for 1800-2100, which is
 * sufficient for sign / nakshatra / house resolution in Jyotish work.
 */

export const DEG = Math.PI / 180;

export const norm360 = (x: number) => ((x % 360) + 360) % 360;
const sin = (d: number) => Math.sin(d * DEG);
const cos = (d: number) => Math.cos(d * DEG);

/** Julian Day from a UTC calendar date/time. */
export function julianDay(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFrac = day + (hour + minute / 60 + second / 3600) / 24;
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    dayFrac +
    b -
    1524.5
  );
}

/** Mean obliquity of the ecliptic (degrees). */
export function obliquity(jd: number): number {
  const t = (jd - 2451545) / 36525;
  return 23.439291 - 0.0130042 * t - 1.64e-7 * t * t + 5.04e-7 * t * t * t;
}

/** Greenwich mean sidereal time in degrees. */
export function gmst(jd: number): number {
  const d = jd - 2451545;
  const t = d / 36525;
  return norm360(
    280.46061837 + 360.98564736629 * d + 0.000387933 * t * t - (t * t * t) / 38710000,
  );
}

/** Lahiri (Chitrapaksha) ayanamsa in degrees. */
export function ayanamsa(jd: number): number {
  const t = (jd - 2451545) / 36525;
  // Chitra at 180deg definition, polynomial fit to Lahiri values.
  return 23.85337 + 1.3969879 * t + 0.00030833 * t * t;
}

/* ------------------------------- Sun --------------------------------- */

export function sunLongitude(jd: number): number {
  const t = (jd - 2451545) / 36525;
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * sin(m) +
    (0.019993 - 0.000101 * t) * sin(2 * m) +
    0.000289 * sin(3 * m);
  const trueLong = l0 + c;
  const omega = 125.04 - 1934.136 * t;
  return norm360(trueLong - 0.00569 - 0.00478 * sin(omega));
}

/* ------------------------------- Moon -------------------------------- */

export function moonLongitude(jd: number): number {
  const t = (jd - 2451545) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t;
  const D = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t;
  const M = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t;
  const Mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t;
  const F = 93.272095 + 483202.0175233 * t - 0.0036539 * t * t;

  const terms: [number, number, number, number, number][] = [
    [6288774, 0, 0, 1, 0],
    [1274027, 2, 0, -1, 0],
    [658314, 2, 0, 0, 0],
    [213618, 0, 0, 2, 0],
    [-185116, 0, 1, 0, 0],
    [-114332, 0, 0, 0, 2],
    [58793, 2, 0, -2, 0],
    [57066, 2, -1, -1, 0],
    [53322, 2, 0, 1, 0],
    [45758, 2, -1, 0, 0],
    [-40923, 0, 1, -1, 0],
    [-34720, 1, 0, 0, 0],
    [-30383, 0, 1, 1, 0],
    [15327, 2, 0, 0, -2],
    [-12528, 0, 0, 1, 2],
    [10980, 0, 0, 1, -2],
    [10675, 4, 0, -1, 0],
    [10034, 0, 0, 3, 0],
    [8548, 4, 0, -2, 0],
    [-7888, 2, 1, -1, 0],
    [-6766, 2, 1, 0, 0],
    [-5163, 1, 0, -1, 0],
    [4987, 1, 1, 0, 0],
    [4036, 2, -1, 1, 0],
    [3994, 2, 0, 2, 0],
    [3861, 4, 0, 0, 0],
    [3665, 2, 0, -3, 0],
    [-2689, 0, 1, -2, 0],
    [-2602, 2, 0, -1, 2],
    [2390, 2, -1, -2, 0],
    [-2348, 1, 0, 1, 0],
    [2236, 2, -2, 0, 0],
    [-2120, 0, 1, 2, 0],
    [-2069, 0, 2, 0, 0],
    [2048, 2, -2, -1, 0],
    [-1773, 2, 0, 1, -2],
    [-1595, 2, 0, 0, 2],
    [1215, 4, -1, -1, 0],
    [-1110, 0, 0, 2, 2],
    [-892, 3, 0, -1, 0],
    [-810, 2, 1, 1, 0],
    [759, 4, -1, -2, 0],
    [-713, 0, 2, -1, 0],
    [-700, 2, 2, -1, 0],
    [691, 2, 1, -2, 0],
    [596, 2, -1, 0, -2],
    [549, 4, 0, 1, 0],
    [537, 0, 0, 4, 0],
    [520, 4, -1, 0, 0],
    [-487, 1, 0, -2, 0],
  ];
  const e = 1 - 0.002516 * t - 0.0000074 * t * t;
  let sum = 0;
  for (const [coef, d, m, mp, f] of terms) {
    let ecc = 1;
    if (Math.abs(m) === 1) ecc = e;
    else if (Math.abs(m) === 2) ecc = e * e;
    sum += coef * ecc * sin(d * D + m * M + mp * Mp + f * F);
  }
  return norm360(Lp + sum / 1000000);
}

/** Mean lunar ascending node (Rahu), always retrograde. */
export function rahuLongitude(jd: number): number {
  const t = (jd - 2451545) / 36525;
  return norm360(
    125.0445479 - 1934.1362891 * t + 0.0020754 * t * t + (t * t * t) / 467441,
  );
}

/* ------------------------------ Planets ------------------------------ */

type Elements = {
  a: [number, number];
  e: [number, number];
  i: [number, number];
  L: [number, number];
  wbar: [number, number];
  node: [number, number];
};

/** JPL approximate orbital elements (1800-2050), a in AU, angles in degrees. */
const ELEMENTS: Record<string, Elements> = {
  Mercury: {
    a: [0.38709927, 0.00000037],
    e: [0.20563593, 0.00001906],
    i: [7.00497902, -0.00594749],
    L: [252.2503235, 149472.67411175],
    wbar: [77.45779628, 0.16047689],
    node: [48.33076593, -0.12534081],
  },
  Venus: {
    a: [0.72333566, 0.0000039],
    e: [0.00677672, -0.00004107],
    i: [3.39467605, -0.0007889],
    L: [181.9790995, 58517.81538729],
    wbar: [131.60246718, 0.00268329],
    node: [76.67984255, -0.27769418],
  },
  Earth: {
    a: [1.00000261, 0.00000562],
    e: [0.01671123, -0.00004392],
    i: [-0.00001531, -0.01294668],
    L: [100.46457166, 35999.37244981],
    wbar: [102.93768193, 0.32327364],
    node: [0, 0],
  },
  Mars: {
    a: [1.52371034, 0.0000018],
    e: [0.0933941, 0.00007882],
    i: [1.84969142, -0.00813131],
    L: [-4.55343205, 19140.30268499],
    wbar: [-23.94362959, 0.44441088],
    node: [49.55953891, -0.29257343],
  },
  Jupiter: {
    a: [5.202887, -0.00011607],
    e: [0.04838624, -0.00013253],
    i: [1.30439695, -0.00183714],
    L: [34.39644051, 3034.74612775],
    wbar: [14.72847983, 0.21252668],
    node: [100.47390909, 0.20469106],
  },
  Saturn: {
    a: [9.53667594, -0.0012506],
    e: [0.05386179, -0.00050991],
    i: [2.48599187, 0.00193609],
    L: [49.95424423, 1222.49362201],
    wbar: [92.59887831, -0.41897216],
    node: [113.66242448, -0.28867794],
  },
};

function heliocentric(name: string, t: number): [number, number, number] {
  const el = ELEMENTS[name];
  const a = el.a[0] + el.a[1] * t;
  const e = el.e[0] + el.e[1] * t;
  const i = el.i[0] + el.i[1] * t;
  const L = el.L[0] + el.L[1] * t;
  const wbar = el.wbar[0] + el.wbar[1] * t;
  const node = el.node[0] + el.node[1] * t;
  const w = wbar - node;
  const M = norm360(L - wbar);

  // Kepler equation
  let E = M;
  for (let k = 0; k < 12; k++) {
    const dE = (M - (E - (180 / Math.PI) * e * sin(E))) / (1 - e * cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-9) break;
  }
  const xv = a * (cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * sin(E);
  const v = Math.atan2(yv, xv) / DEG;
  const r = Math.sqrt(xv * xv + yv * yv);
  const u = v + w;
  const x = r * (cos(node) * cos(u) - sin(node) * sin(u) * cos(i));
  const y = r * (sin(node) * cos(u) + cos(node) * sin(u) * cos(i));
  const z = r * (sin(u) * sin(i));
  return [x, y, z];
}

/** Geocentric apparent ecliptic longitude of a planet (tropical, degrees). */
export function planetLongitude(name: string, jd: number): number {
  const t = (jd - 2451545) / 36525;
  const [px, py, pz] = heliocentric(name, t);
  const [ex, ey, ez] = heliocentric("Earth", t);
  // light-time correction (one iteration)
  const dist = Math.sqrt((px - ex) ** 2 + (py - ey) ** 2 + (pz - ez) ** 2);
  const t2 = t - (dist * 0.0057755183) / 36525;
  const [qx, qy] = heliocentric(name, t2);
  return norm360(Math.atan2(qy - ey, qx - ex) / DEG);
}

/** Daily motion in longitude (degrees/day) — negative means retrograde. */
export function dailyMotion(fn: (jd: number) => number, jd: number): number {
  const a = fn(jd - 0.5);
  const b = fn(jd + 0.5);
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

/** Tropical ascendant longitude for a moment and place. */
export function ascendantLongitude(jd: number, latitude: number, longitude: number): number {
  const lst = norm360(gmst(jd) + longitude);
  const eps = obliquity(jd);
  const asc =
    Math.atan2(cos(lst), -(sin(lst) * cos(eps) + Math.tan(latitude * DEG) * sin(eps))) / DEG;
  return norm360(asc);
}

/** Tropical midheaven longitude. */
export function midheavenLongitude(jd: number, longitude: number): number {
  const lst = norm360(gmst(jd) + longitude);
  const eps = obliquity(jd);
  return norm360(Math.atan2(sin(lst), cos(lst) * cos(eps)) / DEG);
}
