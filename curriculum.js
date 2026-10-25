/**
 * curriculum.js - Complete L3 Bridging (L3E-B1) & L4 HNC Curriculum Database
 */
const CurriculumModule = (function () {
  const modules = [
    {
      moduleId: "M0",
      levelCode: "L3",
      levelLabel: "L3 Bridging (L3E-B1)",
      badgeClass: "bg-blue-600 text-white",
      moduleTitle: "Module 0: Foundational Units, SI Prefixes & Scientific Notation",
      moduleDesc: "Zero-prerequisite foundations: physical analogies for V, I, R, C, L, metric prefixes, and calculator keys.",
      topics: [
        {
          id: "0.1",
          title: "0.1 Electrical Base Units & Physical Analogies",
          step1: String.raw`Electricity behaves much like water flowing through closed pipework:
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Voltage (\(V\)):</strong> Water pressure pushing through the hose.</li>
              <li><strong>Current (\(I\)):</strong> The flow rate of water (litres per second) passing a point.</li>
              <li><strong>Resistance (\(R\)):</strong> A narrow constriction in the pipe restricting flow.</li>
              <li><strong>Capacitance (\(C\)):</strong> An expandable storage tank storing pressure.</li>
              <li><strong>Inductance (\(L\)):</strong> A heavy water flywheel opposing sudden changes in flow.</li>
            </ul>`,
          step2: String.raw`Engineering formulas require inputs in standard SI base units (Volts, Amps, Ohms, Farads, Henrys). Mixing raw un-converted values produces factor-of-1,000 calculation errors.`,
          step3: String.raw`<div class="text-center py-2">\[ V = I \times R \qquad P = V \times I \qquad f = \frac{1}{T} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A circuit element with \(R = 47\,\Omega\) draws \(I = 2\text{ A}\). Calculate voltage \(V\) and power \(P\).<br>
            <strong>Step 1:</strong> \(V = I \times R = 2 \times 47 = 94\text{ V}\).<br>
            <strong>Step 2:</strong> \(P = V \times I = 94 \times 2 = 188\text{ W}\).`,
          generateQuestion: function (idx) {
            const I = Math.floor(Math.random() * 8) + 2;
            const R = Math.floor(Math.random() * 40) + 10;
            const V = I * R;
            return {
              question: String.raw`A component has resistance \(R = ${R}\,\Omega\) and carries current \(I = ${I}\text{ A}\). Calculate supply voltage \(V\) and power \(P\).`,
              unitBanner: String.raw`Standard units: \(V = I \times R\) and \(P = V \times I\).`,
              options: [
                { text: String.raw`\(${V}\text{ V}, \; ${V * I}\text{ W}\)`, isCorrect: true },
                { text: String.raw`\(${(R / I).toFixed(1)}\text{ V}, \; ${V}\text{ W}\)`, isCorrect: false },
                { text: String.raw`\(${V + 10}\text{ V}, \; ${I * R}\text{ W}\)`, isCorrect: false },
                { text: String.raw`\(${V * 2}\text{ V}, \; ${V * I * 2}\text{ W}\)`, isCorrect: false }
              ],
              explanation: String.raw`\(V = ${I} \times ${R} = ${V}\text{ V}\). Power \(P = ${V} \times ${I} = ${V * I}\text{ W}\).`
            };
          }
        },
        {
          id: "0.2",
          title: "0.2 Metric Prefixes (M, k, m, μ, n, p)",
          step1: String.raw`Metric prefixes represent powers of 10. Farads and Henrys are large units, so electronics components use micro (\(\mu\text{F}\)), nano (\(\text{nF}\)), and milli (\(\text{mH}\)).`,
          step2: String.raw`Step 0 in every engineering formula is converting prefixed values to base scientific notation before calculating.`,
          step3: String.raw`<div class="text-center py-2">\[ \text{Mega (M)} = 10^6 \quad \text{kilo (k)} = 10^3 \quad \text{milli (m)} = 10^{-3} \quad \text{micro (}\mu\text{)} = 10^{-6} \quad \text{nano (n)} = 10^{-9} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Convert \(C = 22\text{ nF}\) to Farads.<br>
            <strong>Step 1:</strong> Replace nano with \(\times 10^{-9}\): \(22\text{ nF} = 22 \times 10^{-9}\text{ F}\).`,
          generateQuestion: function (idx) {
            const prefs = [
              { s: "m", exp: -3, unit: "H" },
              { s: "\\mu ", exp: -6, unit: "F" },
              { s: "n", exp: -9, unit: "F" },
              { s: "k", exp: 3, unit: "\\Omega" }
            ];
            const p = prefs[idx % prefs.length];
            const val = Math.floor(Math.random() * 80) + 12;
            return {
              question: String.raw`Express \(${val}\text{ }${p.s}${p.unit}\) in standard base units.`,
              unitBanner: String.raw`Prefix rule: replace prefix with its power of 10.`,
              options: [
                { text: String.raw`\(${val} \times 10^{${p.exp}}\text{ }${p.unit}\)`, isCorrect: true },
                { text: String.raw`\(${val} \times 10^{${p.exp + 3}}\text{ }${p.unit}\)`, isCorrect: false },
                { text: String.raw`\(${val} \times 10^{${-p.exp}}\text{ }${p.unit}\)`, isCorrect: false },
                { text: String.raw`\(${val} \times 10^{${p.exp - 3}}\text{ }${p.unit}\)`, isCorrect: false }
              ],
              explanation: String.raw`\(${val}\text{ }${p.s}${p.unit} = ${val} \times 10^{${p.exp}}\text{ }${p.unit}\).`
            };
          }
        }
      ]
    },
    {
      moduleId: "M2",
      levelCode: "L3",
      levelLabel: "L3 Bridging (L3E-B1)",
      badgeClass: "bg-blue-600 text-white",
      moduleTitle: "Module 2: Formula Transposition & Resonant Frequency",
      moduleDesc: "Algebraic rearrangement, transposing fractions, squares, roots, and LC resonant circuits.",
      topics: [
        {
          id: "2.1",
          title: "2.1 Transposing the LC Resonant Frequency Formula",
          step1: String.raw`In a tuned LC circuit, inductive reactance cancels capacitive reactance at the resonant frequency \(f_r\). Both \(L\) and \(C\) appear in the denominator under a square root.`,
          step2: String.raw`To design a filter or radio tuner, engineers pick an inductor and transpose the formula to solve for the required capacitance \(C\).`,
          step3: String.raw`<div class="text-center py-2">\[ f_r = \frac{1}{2\pi\sqrt{LC}} \implies C = \frac{1}{4\pi^2 f_r^2 L} \implies L = \frac{1}{4\pi^2 f_r^2 C} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Find \(C\) in nF for \(f_r = 100\text{ kHz}\) and \(L = 2\text{ mH}\).<br>
            <strong>Step 0:</strong> \(f_r = 100 \times 10^3\text{ Hz}\), \(L = 2 \times 10^{-3}\text{ H}\).<br>
            <strong>Step 1:</strong> \(C = \frac{1}{4\pi^2 (100 \times 10^3)^2 (2 \times 10^{-3})} = 1.27 \times 10^{-9}\text{ F} = 1.27\text{ nF}\).`,
          generateQuestion: function (idx) {
            const fr_kHz = Math.floor(Math.random() * 80) + 20;
            const L_mH = Math.floor(Math.random() * 8) + 2;
            const fr = fr_kHz * 1e3;
            const L = L_mH * 1e-3;
            const C_nF = (1 / (4 * Math.PI * Math.PI * fr * fr * L)) * 1e9;
            return {
              question: String.raw`Find capacitance \(C\) in nF for resonance at \(f_r = ${fr_kHz}\text{ kHz}\) with \(L = ${L_mH}\text{ mH}\).`,
              unitBanner: String.raw`Conversions: \(f_r = ${fr_kHz} \times 10^3\text{ Hz}\), \(L = ${L_mH} \times 10^{-3}\text{ H}\). Formula: \(C = \frac{1}{4\pi^2 f_r^2 L}\).`,
              options: [
                { text: String.raw`\(${C_nF.toFixed(2)}\text{ nF}\)`, isCorrect: true },
                { text: String.raw`\(${(C_nF * 10).toFixed(2)}\text{ nF}\)`, isCorrect: false },
                { text: String.raw`\(${(C_nF / 4).toFixed(2)}\text{ nF}\)`, isCorrect: false },
                { text: String.raw`\(${(C_nF * 1.8).toFixed(2)}\text{ nF}\)`, isCorrect: false }
              ],
              explanation: String.raw`\(C = \frac{1}{4\pi^2 (${fr_kHz} \times 10^3)^2 (${L_mH} \times 10^{-3})} = ${C_nF.toFixed(2)}\text{ nF}\).`
            };
          }
        }
      ]
    },
    {
      moduleId: "M5",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 5: Complex Numbers & AC Impedance Analysis",
      moduleDesc: "Rectangular and polar forms, reactances (XL, XC), and series RLC impedance vectors.",
      topics: [
        {
          id: "5.1",
          title: "5.1 Series RLC Impedance & Complex j-Notation",
          step1: String.raw`In AC circuits, resistance \(R\) sits on the real horizontal axis, while reactances sit on the vertical imaginary axis using \(j = \sqrt{-1}\). Inductors oppose current at \(+jX_L\) and capacitors at \(-jX_C\).`,
          step2: String.raw`Combined AC opposition is Impedance \(Z = R + j(X_L - X_C)\). Polar form \(|Z|\angle\theta\) gives total magnitude and phase shift.`,
          step3: String.raw`<div class="text-center py-2">\[ Z = R + j(X_L - X_C) \qquad |Z| = \sqrt{R^2 + (X_L - X_C)^2} \qquad \theta = \tan^{-1}\left(\frac{X_L - X_C}{R}\right) \]</div>`,
          step4: String.raw`<strong>Problem:</strong> \(R = 30\,\Omega\), \(X_L = 70\,\Omega\), \(X_C = 30\,\Omega\). Find polar \(|Z|\angle\theta\).<br>
            <strong>Step 1:</strong> Net \(X = 70 - 30 = 40\,\Omega\).<br>
            <strong>Step 2:</strong> \(|Z| = \sqrt{30^2 + 40^2} = 50\,\Omega\), \(\theta = \tan^{-1}(40/30) = 53.13^\circ\).`,
          generateQuestion: function (idx) {
            const R = Math.floor(Math.random() * 30) + 15;
            const XL = Math.floor(Math.random() * 50) + 40;
            const XC = Math.floor(Math.random() * 25) + 10;
            const Xnet = XL - XC;
            const Z = Math.sqrt(R * R + Xnet * Xnet);
            const theta = Math.atan2(Xnet, R) * (180 / Math.PI);
            return {
              question: String.raw`A series AC circuit has \(R = ${R}\,\Omega\), \(X_L = ${XL}\,\Omega\), and \(X_C = ${XC}\,\Omega\). Calculate total impedance \(|Z|\angle\theta\).`,
              unitBanner: String.raw`Net reactance \(X = X_L - X_C\). Total \(|Z| = \sqrt{R^2 + X^2}\), \(\theta = \tan^{-1}(X/R)\).`,
              options: [
                { text: String.raw`\(${Z.toFixed(2)}\,\Omega \angle ${theta.toFixed(1)}^\circ\)`, isCorrect: true },
                { text: String.raw`\(${(R + Xnet).toFixed(2)}\,\Omega \angle ${theta.toFixed(1)}^\circ\)`, isCorrect: false },
                { text: String.raw`\(${Z.toFixed(2)}\,\Omega \angle -${theta.toFixed(1)}^\circ\)`, isCorrect: false },
                { text: String.raw`\(${Z.toFixed(2)}\,\Omega \angle 45.0^\circ\)`, isCorrect: false }
              ],
              explanation: String.raw`\(X_{\text{net}} = ${XL} - ${XC} = ${Xnet}\,\Omega\). \(|Z| = \sqrt{${R}^2 + ${Xnet}^2} = ${Z.toFixed(2)}\,\Omega\). Angle \(\theta = ${theta.toFixed(1)}^\circ\).`
            };
          }
        }
      ]
    }
  ];

  function getAllTopics() {
    const list = [];
    modules.forEach(m => {
      m.topics.forEach(t => {
        list.push({
          ...t,
          moduleId: m.moduleId,
          moduleTitle: m.moduleTitle,
          levelCode: m.levelCode,
          levelLabel: m.levelLabel,
          badgeClass: m.badgeClass
        });
      });
    });
    return list;
  }

  function getTopicById(id) {
    const all = getAllTopics();
    return all.find(t => t.id === id) || all[0];
  }

  return {
    modules,
    getAllTopics,
    getTopicById
  };
})();