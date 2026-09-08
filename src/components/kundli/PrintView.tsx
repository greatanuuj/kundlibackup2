import { forwardRef } from "react";
import type { Kundli } from "@/lib/astro/kundli";
import { NAKSHATRAS, PLANET_META, SIGNS } from "@/lib/astro/data";
import { formatDegree } from "@/lib/astro/kundli";
import { buildReport } from "@/lib/astro/interpret";
import { analyzeHouse } from "@/lib/astro/houseAnalysis";
import { buildLalKitab, LK_HOUSE_TITLE } from "@/lib/astro/lalkitab";
import { buildNumerology, NUM_PLANET } from "@/lib/astro/numerology";
import { computeTransits } from "@/lib/astro/transit";
import { ChartDiagram } from "./ChartDiagram";
import { divisionalSign } from "@/lib/astro/kundli";

const fmt = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function PrintSection({
  title,
  hi,
  children,
}: {
  title: string;
  hi?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="print-section" style={{ breakInside: "avoid" }}>
      <h2 className="print-h2">
        {title}
        {hi && <span className="print-hi"> {hi}</span>}
      </h2>
      <div className="print-body">{children}</div>
    </section>
  );
}

export const PrintView = forwardRef<HTMLDivElement, { k: Kundli }>(function PrintView(
  { k },
  _ref,
) {
  const report = buildReport(k);
  const transits = computeTransits(k, new Date());
  const lk = buildLalKitab(k);
  const numerology = buildNumerology({
    name: k.input.name,
    gender: k.input.gender,
    date: k.input.date,
  });
  const weak = [...k.planets].sort((a, b) => a.strength - b.strength).slice(0, 4);
  const activeDoshas = k.doshas.filter((d) => d.present);

  return (
    <div id="print-view" className="hidden print:block">
      {/* Cover header */}
      <div className="print-cover" style={{ breakAfter: "page" }}>
        <p className="print-devanagari">॥ श्री गणेशाय नमः ॥</p>
        <h1 className="print-title">Kundli Analyzer Pro</h1>
        <div className="print-cover-info">
          <h2>{k.input.name}</h2>
          <p>
            {k.input.date} · {k.input.time} · {k.input.place}
          </p>
          <p>
            {k.panchang.weekday} ({k.panchang.weekdayHi}) · {k.panchang.tithi} ({k.panchang.paksha})
          </p>
          <p>Nakshatra: {NAKSHATRAS[k.planets[1].nakshatra].en}</p>
          <p>Ayanamsa (Lahiri): {k.ayanamsa.toFixed(4)}°</p>
        </div>
      </div>

      {/* Summary cards */}
      <PrintSection title="Summary" hi="सारांश">
        <table className="print-table">
          <tbody>
            <tr><td>Lagna</td><td>{SIGNS[k.ascendant.sign].en} ({SIGNS[k.ascendant.sign].hi}) · {formatDegree(k.ascendant.degreeInSign)}</td></tr>
            <tr><td>Chandra Rashi (Moon)</td><td>{SIGNS[k.moonSign].en} ({SIGNS[k.moonSign].hi}) · Nakshatra {NAKSHATRAS[k.planets[1].nakshatra].en} pada {k.planets[1].pada}</td></tr>
            <tr><td>Surya Rashi (Sun)</td><td>{SIGNS[k.sunSign].en} ({SIGNS[k.sunSign].hi})</td></tr>
            <tr><td>Running Dasha</td><td>{k.currentDasha ? `${k.currentDasha.maha.lord} / ${k.currentDasha.antar.lord} until ${fmt(k.currentDasha.antar.end)}` : "—"}</td></tr>
            <tr><td>Vaar</td><td>{k.panchang.weekday} ({k.panchang.weekdayHi})</td></tr>
            <tr><td>Tithi</td><td>{k.panchang.tithi} ({k.panchang.paksha})</td></tr>
            <tr><td>Yoga</td><td>{k.panchang.yoga}</td></tr>
            <tr><td>Karana</td><td>{k.panchang.karana}</td></tr>
          </tbody>
        </table>
      </PrintSection>

      {/* Birth chart */}
      <PrintSection title="Rashi Chakra (D-1)" hi="राशि चक्र">
        <ChartDiagram
          ascSign={k.ascendant.sign}
          placements={k.planets.map((p) => ({ key: p.key, sign: p.sign, retro: p.retrograde }))}
          title="D-1 Birth Chart"
        />
      </PrintSection>

      {/* Planets */}
      <PrintSection title="Graha Positions & Strength" hi="ग्रह स्थिति">
        <table className="print-table">
          <thead>
            <tr>
              <th>Graha</th><th>Sign</th><th>Degree</th><th>House</th><th>Nakshatra</th><th>Dignity</th><th>Strength</th><th>Retro</th>
            </tr>
          </thead>
          <tbody>
            {k.planets.map((p) => (
              <tr key={p.key}>
                <td><strong>{p.key}</strong> <span className="print-hi-inline">{PLANET_META[p.key].hi}</span></td>
                <td>{SIGNS[p.sign].en}</td>
                <td>{formatDegree(p.degreeInSign)}</td>
                <td>{p.house}</td>
                <td>{NAKSHATRAS[p.nakshatra].en} p{p.pada}</td>
                <td>{p.dignity}</td>
                <td>{p.strength}%</td>
                <td>{p.retrograde ? "Yes" : ""}{p.combust ? " (Combust)" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrintSection>

      {/* Detailed planet remedies */}
      <PrintSection title="Graha Remedies" hi="ग्रह उपाय">
        {k.planets.map((p) => {
          const m = PLANET_META[p.key];
          return (
            <div key={p.key} className="print-planet-card">
              <h3>{p.key} ({m.hi}) — {p.dignity}, {p.strength}%, House {p.house}</h3>
              <table className="print-table-inner">
                <tbody>
                  <tr><td>Signifies</td><td>{m.signifies}</td></tr>
                  <tr><td>Gemstone</td><td>{m.gem} ({m.metal})</td></tr>
                  <tr><td>Mantra</td><td className="print-hi-inline">{m.mantra}</td></tr>
                  <tr><td>Beej Mantra</td><td className="print-hi-inline">{m.beej}</td></tr>
                  <tr><td>Fasting Day</td><td>{m.day}</td></tr>
                  <tr><td>Daan (Charity)</td><td>{m.charity}</td></tr>
                  <tr><td>Rudraksha</td><td>{m.rudraksha}</td></tr>
                  <tr><td>Colour</td><td>{m.colour}</td></tr>
                  <tr><td>Deity</td><td>{m.deity}</td></tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </PrintSection>

      {/* Houses */}
      <PrintSection title="Bhava Vishleshan (Houses)" hi="भाव विश्लेषण">
        {k.houseLords.map((h) => {
          const a = analyzeHouse(k, h.house);
          return (
            <div key={h.house} className="print-house-card">
              <h3>
                House {h.house} — {a.title} ({a.hi})
              </h3>
              <p className="print-grade">Grade: {a.grade} · Score: {a.score}%</p>
              <p className="print-verdict">{a.verdict}</p>
              {a.sections.map((s) => (
                <div key={s.title} className="print-subsection">
                  <h4>{s.title}</h4>
                  <ul>
                    {s.lines.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {a.links.length > 0 && (
                <div className="print-subsection">
                  <h4>Interconnections</h4>
                  <ul>
                    {a.links.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </PrintSection>

      {/* Divisional charts */}
      <PrintSection title="Divisional Charts" hi="वर्ग कुंडली">
        <div className="print-grid-2">
          {[
            { d: 1, name: "D-1 Rashi", purpose: "Main birth chart" },
            { d: 9, name: "D-9 Navamsa", purpose: "Marriage & dharma" },
            { d: 10, name: "D-10 Dashamsa", purpose: "Career" },
            { d: 2, name: "D-2 Hora", purpose: "Wealth" },
            { d: 7, name: "D-7 Saptamsa", purpose: "Children" },
            { d: 12, name: "D-12 Dwadashamsa", purpose: "Parents" },
          ].map((c) => (
            <ChartDiagram
              key={c.d}
              ascSign={divisionalSign(k.ascendant.longitude, c.d)}
              placements={k.planets.map((p) => ({
                key: p.key,
                sign: divisionalSign(p.longitude, c.d),
                retro: p.retrograde,
              }))}
              title={c.name}
              subtitle={c.purpose}
            />
          ))}
        </div>
      </PrintSection>

      {/* Dasha */}
      <PrintSection title="Vimshottari Dasha" hi="विंशोत्तरी दशा">
        {k.dashas.map((p) => {
          const m = PLANET_META[p.lord as keyof typeof PLANET_META];
          return (
            <div key={p.lord + p.start.toISOString()} className="print-dasha-card">
              <h3>{p.lord} ({m.hi}) — {fmt(p.start)} to {fmt(p.end)}</h3>
              <p>Theme: {m.signifies}</p>
              {p.antar && (
                <table className="print-table-inner">
                  <thead><tr><th>Antar</th><th>From</th><th>To</th></tr></thead>
                  <tbody>
                    {p.antar.map((a) => (
                      <tr key={a.lord}>
                        <td>{p.lord} / {a.lord}</td>
                        <td>{fmt(a.start)}</td>
                        <td>{fmt(a.end)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </PrintSection>

      {/* Yogas & Doshas */}
      <PrintSection title="Yogas & Doshas" hi="योग और दोष">
        <h3 className="print-h3">Yogas Detected</h3>
        {k.yogas.length === 0 && <p>No major classical yoga formed.</p>}
        {k.yogas.map((y) => (
          <div key={y.name} className="print-yoga-card">
            <h4>{y.name} — {y.type === "good" ? "Supportive" : "Needs care"}</h4>
            <p>{y.detail}</p>
          </div>
        ))}
        <h3 className="print-h3 mt-4">Dosha Analysis</h3>
        <p className="print-note">
          {activeDoshas.length} dosha(s) present out of {k.doshas.length} checked.
        </p>
        {k.doshas.map((d) => (
          <div key={d.name} className="print-yoga-card">
            <h4>{d.name} — {d.present ? d.severity : "Not present"}</h4>
            <p>{d.reason}</p>
            {d.present && <p><strong>Remedy:</strong> {d.remedy}</p>}
          </div>
        ))}
      </PrintSection>

      {/* Transits */}
      <PrintSection title="Gochar (Transits)" hi="गोचर">
        <table className="print-table">
          <thead>
            <tr><th>Graha</th><th>Sign</th><th>Degree</th><th>From Moon</th><th>From Lagna</th><th>Effect</th></tr>
          </thead>
          <tbody>
            {transits.planets.map((p) => (
              <tr key={p.key}>
                <td><strong>{p.key}</strong></td>
                <td>{SIGNS[p.sign].en}</td>
                <td>{formatDegree(p.degreeInSign)}</td>
                <td>{p.fromMoon}</td>
                <td>{p.fromLagna}</td>
                <td>{p.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="print-h3 mt-4">Sade Sati</h3>
        <p>{transits.sadeSati.phase} — {transits.sadeSati.note}</p>
        <h3 className="print-h3">Jupiter Transit</h3>
        <p>House from Moon: {transits.jupiter.house} — {transits.jupiter.note}</p>
        {transits.highlights.length > 0 && (
          <>
            <h3 className="print-h3">What Matters Now</h3>
            <ul>
              {transits.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </>
        )}
      </PrintSection>

      {/* Lal Kitab */}
      <PrintSection title="Lal Kitab" hi="लाल किताब">
        <h3 className="print-h3">Teva Summary</h3>
        <ul>
          {[...lk.summary, ...lk.teva].map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
        <h3 className="print-h3 mt-4">Grah ka Phal</h3>
        {lk.planets.map((p) => (
          <div key={p.key} className="print-yoga-card">
            <h4>{p.key} — Ghar {p.lkHouse} ({p.state})</h4>
            <p>{p.effect}</p>
            <p className="print-note">{p.stateWhy}</p>
            <ul>
              {p.upay.map((u, i) => (
                <li key={i}>Upay: {u}</li>
              ))}
            </ul>
          </div>
        ))}
        <h3 className="print-h3 mt-4">Rin (Karmic Debts)</h3>
        {lk.rin.map((r) => (
          <div key={r.name} className="print-yoga-card">
            <h4>{r.name} — {r.present ? "Present" : "Not present"}</h4>
            <p>{r.reason}</p>
            {r.present && <p><strong>Upay:</strong> {r.upay}</p>}
          </div>
        ))}
      </PrintSection>

      {/* Remedies */}
      <PrintSection title="Remedies" hi="उपाय">
        <h3 className="print-h3">Priority Remedies (weakest grahas first)</h3>
        {weak.map((p, i) => {
          const m = PLANET_META[p.key];
          return (
            <div key={p.key} className="print-planet-card">
              <h3>Priority {i + 1}: {p.key} ({m.hi}) — {p.strength}%, House {p.house}</h3>
              <table className="print-table-inner">
                <tbody>
                  <tr><td>Mantra</td><td className="print-hi-inline">{m.mantra}</td></tr>
                  <tr><td>Beej</td><td className="print-hi-inline">{m.beej}</td></tr>
                  <tr><td>Gemstone</td><td>{m.gem}</td></tr>
                  <tr><td>Metal</td><td>{m.metal}</td></tr>
                  <tr><td>Fasting Day</td><td>{m.day}</td></tr>
                  <tr><td>Daan</td><td>{m.charity}</td></tr>
                  <tr><td>Rudraksha</td><td>{m.rudraksha}</td></tr>
                  <tr><td>Colour</td><td>{m.colour}</td></tr>
                  <tr><td>Deity</td><td>{m.deity}</td></tr>
                </tbody>
              </table>
            </div>
          );
        })}
        <h3 className="print-h3 mt-4">Daily Spiritual Routine</h3>
        <ul>
          <li>Sunrise: water offering to the Sun with a red flower, Gayatri mantra 11 times.</li>
          <li>Light a ghee lamp at home in the evening; keep the north-east corner clean.</li>
          <li>108 japa of your running Maha Dasha lord's beej mantra with a rudraksha mala.</li>
          <li>Tuesday / Saturday: Hanuman Chalisa for protection from malefic pressure.</li>
          <li>Feed cows, crows, dogs and ants weekly — classical Lal Kitaab upaay.</li>
          <li>Respect parents and elders; the strongest remedy for Sun, Moon and Pitra dosha.</li>
        </ul>
      </PrintSection>

      {/* Numerology */}
      <PrintSection title="Numerology" hi="अंक ज्योतिष">
        <h3 className="print-h3">Core Numbers</h3>
        <table className="print-table">
          <tbody>
            <tr><td>Mulank (Root)</td><td>{numerology.mulank.value} — {numerology.mulank.meaning}</td></tr>
            <tr><td>Bhagyank (Destiny)</td><td>{numerology.bhagyank.value} — {numerology.bhagyank.meaning}</td></tr>
            <tr><td>Namank (Name)</td><td>{numerology.namank.value} — {numerology.namank.meaning}</td></tr>
            <tr><td>Soul Urge</td><td>{numerology.soulUrge.value} — {numerology.soulUrge.meaning}</td></tr>
            <tr><td>Personality</td><td>{numerology.personality.value} — {numerology.personality.meaning}</td></tr>
            <tr><td>Kua Number</td><td>{numerology.kua.value} — Good directions: {numerology.kua.good.join(", ")}</td></tr>
            <tr><td>Personal Year</td><td>{numerology.personal.year.value} — {numerology.personal.year.meaning}</td></tr>
          </tbody>
        </table>
        <h3 className="print-h3 mt-4">Lucky Elements</h3>
        <table className="print-table">
          <tbody>
            <tr><td>Colours</td><td>{numerology.luck.colors.join(", ")}</td></tr>
            <tr><td>Days</td><td>{numerology.luck.days.join(", ")}</td></tr>
            <tr><td>Gemstone</td><td>{numerology.luck.gem}</td></tr>
            <tr><td>Numbers</td><td>{numerology.luck.luckyNumbers.join(", ")}</td></tr>
            <tr><td>Deity</td><td>{numerology.luck.deity}</td></tr>
            <tr><td>Mantra</td><td className="print-hi-inline">{numerology.luck.mantra}</td></tr>
          </tbody>
        </table>
      </PrintSection>

      {/* Full report text */}
      <PrintSection title="Complete Written Report" hi="विस्तृत रिपोर्ट">
        {report.map((s) => (
          <div key={s.title} className="print-report-section">
            <h3 className="print-h3">{s.title} {s.hi && <span className="print-hi">{s.hi}</span>}</h3>
            {s.lines.map((l, i) => (
              <p key={i} className="print-para">{l}</p>
            ))}
          </div>
        ))}
      </PrintSection>

      {/* Footer */}
      <div className="print-footer">
        <p>Generated by Kundli Analyzer Pro — {new Date().toLocaleDateString("en-IN")}</p>
        <p>For self-reflection and study. Not a substitute for medical, legal or financial advice.</p>
      </div>
    </div>
  );
});
