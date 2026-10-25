/**
 * curriculum.js - Complete L3 Bridging (L3E-B1) & L4 HNC Curriculum Database
 * Contains all 12 Modules and 33 Sub-Topics with 4-Step Lessons & Question Generators
 */
const CurriculumModule = (function () {

  // Helper to generate consistent 4-option sets
  function makeOptions(correctStr, w1, w2, w3) {
    return [
      { text: correctStr, isCorrect: true },
      { text: w1, isCorrect: false },
      { text: w2, isCorrect: false },
      { text: w3, isCorrect: false }
    ];
  }

  // =========================================================================
  // ALGORITHMIC QUESTION GENERATORS (ALL 33 SUB-TOPICS)
  // =========================================================================
  function buildSingleQuestion(genKey, idx) {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    switch (genKey) {
      case "gen0_1": {
        const I = randInt(2, 12);
        const R = randInt(10, 50);
        const V = I * R;
        return {
          question: String.raw`A heating element with resistance \(R = ${R}\,\Omega\) draws a current of \(I = ${I}\text{ A}\). Calculate the supply voltage \(V\) and power \(P\).`,
          unitBanner: String.raw`<strong>Step 0 Check:</strong> Quantities are already in standard base units (\(\Omega\) and \(\text{A}\)). Use \(V = I \times R\) and \(P = V \times I\).`,
          options: makeOptions(
            String.raw`\(${V}\text{ V}, \; ${V * I}\text{ W}\)`,
            String.raw`\(${(R / I).toFixed(1)}\text{ V}, \; ${V}\text{ W}\)`,
            String.raw`\(${V + 10}\text{ V}, \; ${I * R}\text{ W}\)`,
            String.raw`\(${V * 2}\text{ V}, \; ${V * I * 2}\text{ W}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Voltage):</strong> \(V = I \times R = ${I} \times ${R} = ${V}\text{ V}\).<br><strong>Step 2 (Power):</strong> \(P = V \times I = ${V} \times ${I} = ${V * I}\text{ W}\).`
        };
      }
      case "gen0_2": {
        const prefs = [
          { s: "m", name: "milli", exp: -3, unit: "H" },
          { s: "\\mu ", name: "micro", exp: -6, unit: "F" },
          { s: "n", name: "nano", exp: -9, unit: "F" },
          { s: "k", name: "kilo", exp: 3, unit: "\\Omega" },
          { s: "M", name: "Mega", exp: 6, unit: "\\Omega" }
        ];
        const p = prefs[idx % prefs.length];
        const val = randInt(12, 95);
        return {
          question: String.raw`Convert the component value \(${val}\text{ }${p.s}${p.unit}\) into standard base unit scientific notation.`,
          unitBanner: String.raw`<strong>Step 0 Prefix Rule:</strong> Prefix <strong>${p.name} (\(${p.s}\))</strong> means \(\times 10^{${p.exp}}\).`,
          options: makeOptions(
            String.raw`\(${val} \times 10^{${p.exp}}\text{ }${p.unit}\)`,
            String.raw`\(${val} \times 10^{${p.exp + 3}}\text{ }${p.unit}\)`,
            String.raw`\(${val} \times 10^{${-p.exp}}\text{ }${p.unit}\)`,
            String.raw`\(${val} \times 10^{${p.exp - 3}}\text{ }${p.unit}\)`
          ),
          explanation: String.raw`Replace the prefix <strong>${p.name}</strong> directly with \(\times 10^{${p.exp}}\): \[ ${val}\text{ }${p.s}${p.unit} = ${val} \times 10^{${p.exp}}\text{ }${p.unit} \]`
        };
      }
      case "gen0_3": {
        const V = randInt(6, 24);
        const R_k = randInt(2, 8);
        const I_mA = (V / R_k).toFixed(2);
        return {
          question: String.raw`Using scientific calculator notation, calculate the current \(I = \frac{${V}\text{ V}}{${R_k}\text{ k}\Omega}\) and express the result in milliamps (\(\text{mA}\)).`,
          unitBanner: String.raw`<strong>Step 0 Conversion:</strong> \(${R_k}\text{ k}\Omega = ${R_k} \times 10^3\,\Omega\). On Casio: type <code>[${V}] [÷] [${R_k}] [x10ˣ] [3] [=]</code>.`,
          options: makeOptions(
            String.raw`\(${I_mA}\text{ mA}\)`,
            String.raw`\(${(V * R_k).toFixed(2)}\text{ mA}\)`,
            String.raw`\(${(V / R_k * 10).toFixed(2)}\text{ mA}\)`,
            String.raw`\(${(V / R_k / 10).toFixed(3)}\text{ mA}\)`
          ),
          explanation: String.raw`<strong>Step 0:</strong> \(R = ${R_k} \times 10^3\,\Omega\).<br><strong>Step 1:</strong> \(I = \frac{${V}}{${R_k} \times 10^3} = ${I_mA} \times 10^{-3}\text{ A} = ${I_mA}\text{ mA}\).`
        };
      }
      case "gen1_1": {
        const m = randInt(3, 8);
        const n = randInt(-6, -2);
        const k = randInt(-4, -1);
        const ans = m + n - k;
        return {
          question: String.raw`Simplify the index expression \(\frac{10^{${m}} \times 10^{${n}}}{10^{${k}}}\) into a single power of \(10\).`,
          unitBanner: String.raw`<strong>Index Law:</strong> Add powers when multiplying (\(m + n\)), subtract power when dividing (\(- k\)).`,
          options: makeOptions(
            String.raw`\(10^{${ans}}\)`,
            String.raw`\(10^{${m + n + k}}\)`,
            String.raw`\(10^{${m - n + k}}\)`,
            String.raw`\(10^{${ans + 2}}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Numerator):</strong> \(10^{${m} + (${n})} = 10^{${m + n}}\).<br><strong>Step 2 (Divide by \(10^{${k}}\)):</strong> \(10^{${m + n} - (${k})} = 10^{${ans}}\).`
        };
      }
      case "gen1_2": {
        const I = randInt(2, 9);
        const a = randInt(2, 5);
        const b = randInt(3, 6);
        const c = randInt(4, 12);
        const lhsConst = (a + b) * I + c;
        return {
          question: String.raw`Solve the linear loop equation \(${lhsConst} - ${a}I = ${b}I + ${c}\) for the unknown current \(I\).`,
          unitBanner: String.raw`Collect all \(I\) terms on one side and constants on the other, then divide by the combined coefficient of \(I\).`,
          options: makeOptions(
            String.raw`\(I = ${I}\text{ A}\)`,
            String.raw`\(I = ${I + 2}\text{ A}\)`,
            String.raw`\(I = ${(lhsConst / b).toFixed(1)}\text{ A}\)`,
            String.raw`\(I = ${Math.max(1, I - 1)}\text{ A}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> Subtract \(${c}\) and add \(${a}I\) to both sides: \(${lhsConst} - ${c} = (${a} + ${b})I \implies ${lhsConst - c} = ${a + b}I\).<br><strong>Step 2:</strong> \(I = \frac{${lhsConst - c}}{${a + b}} = ${I}\text{ A}\).`
        };
      }
      case "gen1_3": {
        const r1 = randInt(1, 4);
        const r2 = randInt(5, 9);
        const b = -(r1 + r2);
        const c = r1 * r2;
        return {
          question: String.raw`Solve the quadratic power equation \(I^2 ${b}I + ${c} = 0\) to find the two possible operating currents \(I_1\) and \(I_2\).`,
          unitBanner: String.raw`Use \(I = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\) with \(a = 1, \; b = ${b}, \; c = ${c}\).`,
          options: makeOptions(
            String.raw`\(I = ${r1}\text{ A}\text{ and } I = ${r2}\text{ A}\)`,
            String.raw`\(I = -${r1}\text{ A}\text{ and } I = -${r2}\text{ A}\)`,
            String.raw`\(I = ${r1 + 1}\text{ A}\text{ and } I = ${r2 + 1}\text{ A}\)`,
            String.raw`\(I = ${c}\text{ A}\text{ and } I = ${-b}\text{ A}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> Discriminant \(\Delta = (${b})^2 - 4(1)(${c}) = ${b*b - 4*c}\).<br><strong>Step 2:</strong> \(I = \frac{${-b} \pm \sqrt{${b*b - 4*c}}}{2} = \frac{${-b} \pm ${r2 - r1}}{2} \implies I = ${r1}\text{ A}\text{ or } ${r2}\text{ A}\).`
        };
      }
      case "gen2_1": {
        const R = (randInt(2, 15) / 10);
        const A_mm2 = randInt(1, 6);
        const A = A_mm2 * 1e-6;
        const rho = 1.72e-8;
        const l = (R * A) / rho;
        return {
          question: String.raw`Transpose \(R = \frac{\rho l}{A}\) to calculate cable length \(l\) when \(R = ${R}\,\Omega\), cross-sectional area \(A = ${A_mm2} \times 10^{-6}\text{ m}^2\), and \(\rho = 1.72 \times 10^{-8}\,\Omega\cdot\text{m}\).`,
          unitBanner: String.raw`<strong>Transposed Formula:</strong> Multiply by \(A\) and divide by \(\rho\) to get \(l = \frac{R \cdot A}{\rho}\).`,
          options: makeOptions(
            String.raw`\(${l.toFixed(1)}\text{ m}\)`,
            String.raw`\(${(l / 10).toFixed(1)}\text{ m}\)`,
            String.raw`\(${(l * 2.5).toFixed(1)}\text{ m}\)`,
            String.raw`\(${(l + 25).toFixed(1)}\text{ m}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Transpose):</strong> \(l = \frac{R \cdot A}{\rho}\).<br><strong>Step 2 (Substitute):</strong> \(l = \frac{${R} \times ${A_mm2} \times 10^{-6}}{1.72 \times 10^{-8}} = ${l.toFixed(1)}\text{ m}\).`
        };
      }
      case "gen2_2": {
        const P = randInt(2, 10);
        const R = randInt(20, 200);
        const V = Math.sqrt(P * R);
        return {
          question: String.raw`Transpose the power formula \(P = \frac{V^2}{R}\) to solve for maximum voltage \(V\) across a \(R = ${R}\,\Omega\) resistor rated at \(P = ${P}\text{ W}\).`,
          unitBanner: String.raw`Multiply both sides by \(R\), then take the square root: \(V = \sqrt{P \times R}\).`,
          options: makeOptions(
            String.raw`\(${V.toFixed(2)}\text{ V}\)`,
            String.raw`\(${(P * R).toFixed(0)}\text{ V}\)`,
            String.raw`\(${Math.sqrt(R / P).toFixed(2)}\text{ V}\)`,
            String.raw`\(${(V * 1.5).toFixed(2)}\text{ V}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Transpose):</strong> \(V^2 = P \cdot R \implies V = \sqrt{P \cdot R}\).<br><strong>Step 2 (Substitute):</strong> \(V = \sqrt{${P} \times ${R}} = \sqrt{${P * R}} = ${V.toFixed(2)}\text{ V}\).`
        };
      }
      case "gen2_3": {
        const fr_kHz = randInt(20, 120);
        const L_mH = randInt(2, 12);
        const fr = fr_kHz * 1e3;
        const L = L_mH * 1e-3;
        const C_nF = (1 / (4 * Math.PI * Math.PI * fr * fr * L)) * 1e9;
        return {
          question: String.raw`Transpose \(f_r = \frac{1}{2\pi\sqrt{LC}}\) to find the required capacitance \(C\) (in \(\text{nF}\)) for resonance at \(f_r = ${fr_kHz}\text{ kHz}\) with \(L = ${L_mH}\text{ mH}\).`,
          unitBanner: String.raw`<strong>Step 0 Units:</strong> \(f_r = ${fr_kHz} \times 10^3\text{ Hz}\), \(L = ${L_mH} \times 10^{-3}\text{ H}\). Transposed: \(C = \frac{1}{4\pi^2 f_r^2 L}\).`,
          options: makeOptions(
            String.raw`\(${C_nF.toFixed(2)}\text{ nF}\)`,
            String.raw`\(${(C_nF * 10).toFixed(2)}\text{ nF}\)`,
            String.raw`\(${(C_nF / 4).toFixed(2)}\text{ nF}\)`,
            String.raw`\(${(C_nF * 2.2).toFixed(2)}\text{ nF}\)`
          ),
          explanation: String.raw`<strong>Step 0:</strong> \(f_r = ${fr_kHz} \times 10^3\text{ Hz}\), \(L = ${L_mH} \times 10^{-3}\text{ H}\).<br><strong>Step 1:</strong> \(C = \frac{1}{4\pi^2 (${fr_kHz} \times 10^3)^2 (${L_mH} \times 10^{-3})} = ${C_nF.toFixed(2)} \times 10^{-9}\text{ F} = ${C_nF.toFixed(2)}\text{ nF}\).`
        };
      }
      case "gen3_1": {
        const k = randInt(2, 6);
        const ratio = (randInt(2, 8) / 10);
        const t = -Math.log(ratio) / k;
        return {
          question: String.raw`Solve the exponential equation \(e^{-${k}t} = ${ratio}\) for time \(t\) in seconds.`,
          unitBanner: String.raw`Take the natural logarithm \(\ln\) of both sides: \(-${k}t = \ln(${ratio})\).`,
          options: makeOptions(
            String.raw`\(${t.toFixed(3)}\text{ s}\)`,
            String.raw`\(${(t * 2).toFixed(3)}\text{ s}\)`,
            String.raw`\(${(-Math.log10(ratio) / k).toFixed(3)}\text{ s}\)`,
            String.raw`\(${(ratio / k).toFixed(3)}\text{ s}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(\ln(e^{-${k}t}) = \ln(${ratio}) \implies -${k}t = ${Math.log(ratio).toFixed(4)}\).<br><strong>Step 2:</strong> \(t = \frac{${Math.log(ratio).toFixed(4)}}{-${k}} = ${t.toFixed(3)}\text{ s}\).`
        };
      }
      case "gen3_2": {
        const Vin_mV = randInt(2, 10);
        const gainRatio = [10, 20, 50, 100, 200][idx % 5];
        const Vout_mV = Vin_mV * gainRatio;
        const dB = 20 * Math.log10(gainRatio);
        return {
          question: String.raw`An amplifier receives an input voltage of \(V_{\text{in}} = ${Vin_mV}\text{ mV}\) and produces an output of \(V_{\text{out}} = ${Vout_mV}\text{ mV}\). Calculate the voltage gain in decibels (\(\text{dB}\)).`,
          unitBanner: String.raw`<strong>Voltage Gain Formula:</strong> \(G_{\text{dB}} = 20\log_{10}\left(\frac{V_{\text{out}}}{V_{\text{in}}}\right)\).`,
          options: makeOptions(
            String.raw`\(${dB.toFixed(2)}\text{ dB}\)`,
            String.raw`\(${(dB / 2).toFixed(2)}\text{ dB}\)`,
            String.raw`\(${(dB + 6).toFixed(2)}\text{ dB}\)`,
            String.raw`\(${gainRatio}\text{ dB}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Ratio):</strong> \(\frac{V_{\text{out}}}{V_{\text{in}}} = \frac{${Vout_mV}}{${Vin_mV}} = ${gainRatio}\).<br><strong>Step 2 (Decibels):</strong> \(G_{\text{dB}} = 20\log_{10}(${gainRatio}) = ${dB.toFixed(2)}\text{ dB}\).`
        };
      }
      case "gen4_1": {
        const R = randInt(15, 60);
        const X = randInt(20, 80);
        const Z = Math.sqrt(R * R + X * X);
        const theta = Math.atan2(X, R) * (180 / Math.PI);
        return {
          question: String.raw`Using right-angled phasor trigonometry, find the hypotenuse impedance \(Z\) and phase angle \(\theta\) when \(R = ${R}\,\Omega\) and \(X = ${X}\,\Omega\).`,
          unitBanner: String.raw`Use Pythagoras \(Z = \sqrt{R^2 + X^2}\) and \(\theta = \tan^{-1}\left(\frac{X}{R}\right)\).`,
          options: makeOptions(
            String.raw`\(${Z.toFixed(2)}\,\Omega, \; \theta = ${theta.toFixed(1)}^\circ\)`,
            String.raw`\(${(R + X).toFixed(2)}\,\Omega, \; \theta = ${theta.toFixed(1)}^\circ\)`,
            String.raw`\(${Z.toFixed(2)}\,\Omega, \; \theta = ${(90 - theta).toFixed(1)}^\circ\)`,
            String.raw`\(${Math.abs(R - X).toFixed(2)}\,\Omega, \; \theta = 45.0^\circ\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(Z = \sqrt{${R}^2 + ${X}^2} = ${Z.toFixed(2)}\,\Omega\).<br><strong>Step 2:</strong> \(\theta = \tan^{-1}\left(\frac{${X}}{${R}}\right) = ${theta.toFixed(1)}^\circ\).`
        };
      }
      case "gen4_2": {
        const f = randInt(1, 20) * 25;
        const T_ms = (1000 / f);
        const omega = 2 * Math.PI * f;
        return {
          question: String.raw`An AC generator operates at a frequency of \(f = ${f}\text{ Hz}\). Calculate its periodic time \(T\) (in \(\text{ms}\)) and angular velocity \(\omega\) (in \(\text{rad/s}\)).`,
          unitBanner: String.raw`Use \(T = \frac{1}{f}\) (multiply by \(1000\) for \(\text{ms}\)) and \(\omega = 2\pi f\).`,
          options: makeOptions(
            String.raw`\(T = ${T_ms.toFixed(2)}\text{ ms}, \; \omega = ${omega.toFixed(1)}\text{ rad/s}\)`,
            String.raw`\(T = ${(T_ms / 10).toFixed(2)}\text{ ms}, \; \omega = ${(omega / 2).toFixed(1)}\text{ rad/s}\)`,
            String.raw`\(T = ${T_ms.toFixed(2)}\text{ ms}, \; \omega = ${(f * 360).toFixed(1)}\text{ rad/s}\)`,
            String.raw`\(T = ${(f / 10).toFixed(2)}\text{ ms}, \; \omega = ${omega.toFixed(1)}\text{ rad/s}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Period):</strong> \(T = \frac{1}{${f}} = ${(1/f).toFixed(5)}\text{ s} = ${T_ms.toFixed(2)}\text{ ms}\).<br><strong>Step 2 (Angular Velocity):</strong> \(\omega = 2\pi \times ${f} = ${omega.toFixed(1)}\text{ rad/s}\).`
        };
      }
      case "gen4_3": {
        const Vm = randInt(10, 32) * 10;
        const deg = [30, 45, 60][idx % 3];
        const vInst = Vm * Math.sin((deg * Math.PI) / 180);
        return {
          question: String.raw`An AC waveform has peak voltage \(V_m = ${Vm}\text{ V}\). Calculate its RMS voltage \(V_{\text{rms}}\) and instantaneous voltage \(v\) when phase angle \(\omega t = ${deg}^\circ\).`,
          unitBanner: String.raw`Use \(V_{\text{rms}} = \frac{V_m}{\sqrt{2}}\) and \(v = V_m \sin(${deg}^\circ)\).`,
          options: makeOptions(
            String.raw`\(V_{\text{rms}} = ${(Vm / Math.SQRT2).toFixed(1)}\text{ V}, \; v = ${vInst.toFixed(1)}\text{ V}\)`,
            String.raw`\(V_{\text{rms}} = ${(Vm * 0.5).toFixed(1)}\text{ V}, \; v = ${(Vm * Math.cos(deg * Math.PI / 180)).toFixed(1)}\text{ V}\)`,
            String.raw`\(V_{\text{rms}} = ${Vm}\text{ V}, \; v = ${vInst.toFixed(1)}\text{ V}\)`,
            String.raw`\(V_{\text{rms}} = ${(Vm / Math.SQRT2).toFixed(1)}\text{ V}, \; v = ${(Vm).toFixed(1)}\text{ V}\)`
          ),
          explanation: String.raw`<strong>Step 1 (RMS):</strong> \(V_{\text{rms}} = \frac{${Vm}}{\sqrt{2}} = ${(Vm / Math.SQRT2).toFixed(1)}\text{ V}\).<br><strong>Step 2 (Instantaneous):</strong> \(v = ${Vm}\sin(${deg}^\circ) = ${vInst.toFixed(1)}\text{ V}\).`
        };
      }
      case "gen5_1": {
        const a = randInt(10, 40);
        const b = randInt(15, 50);
        const r = Math.sqrt(a * a + b * b);
        const theta = Math.atan2(b, a) * (180 / Math.PI);
        return {
          question: String.raw`Convert the rectangular complex impedance \(Z = ${a} + j${b}\,\Omega\) into Polar form \(r\angle\theta\).`,
          unitBanner: String.raw`Use \(r = \sqrt{a^2 + b^2}\) and \(\theta = \tan^{-1}\left(\frac{b}{a}\right)\).`,
          options: makeOptions(
            String.raw`\(${r.toFixed(2)}\angle ${theta.toFixed(1)}^\circ\,\Omega\)`,
            String.raw`\(${(a + b).toFixed(2)}\angle ${theta.toFixed(1)}^\circ\,\Omega\)`,
            String.raw`\(${r.toFixed(2)}\angle ${(90 - theta).toFixed(1)}^\circ\,\Omega\)`,
            String.raw`\(${r.toFixed(2)}\angle -${theta.toFixed(1)}^\circ\,\Omega\)`
          ),
          explanation: String.raw`<strong>Step 1 (Magnitude):</strong> \(r = \sqrt{${a}^2 + ${b}^2} = ${r.toFixed(2)}\,\Omega\).<br><strong>Step 2 (Angle):</strong> \(\theta = \tan^{-1}\left(\frac{${b}}{${a}}\right) = ${theta.toFixed(1)}^\circ\).`
        };
      }
      case "gen5_2": {
        const f = 50;
        const L_mH = randInt(40, 250);
        const C_uF = randInt(15, 80);
        const XL = 2 * Math.PI * f * (L_mH * 1e-3);
        const XC = 1 / (2 * Math.PI * f * (C_uF * 1e-6));
        return {
          question: String.raw`At \(f = 50\text{ Hz}\), calculate the inductive reactance \(X_L\) of a \(L = ${L_mH}\text{ mH}\) coil and capacitive reactance \(X_C\) of a \(C = ${C_uF}\,\mu\text{F}\) capacitor.`,
          unitBanner: String.raw`<strong>Step 0 Units:</strong> \(L = ${L_mH} \times 10^{-3}\text{ H}\), \(C = ${C_uF} \times 10^{-6}\text{ F}\). Formulas: \(X_L = 2\pi f L\), \(X_C = \frac{1}{2\pi f C}\).`,
          options: makeOptions(
            String.raw`\(X_L = ${XL.toFixed(2)}\,\Omega, \; X_C = ${XC.toFixed(2)}\,\Omega\)`,
            String.raw`\(X_L = ${(XL * 10).toFixed(2)}\,\Omega, \; X_C = ${(XC / 10).toFixed(2)}\,\Omega\)`,
            String.raw`\(X_L = ${XC.toFixed(2)}\,\Omega, \; X_C = ${XL.toFixed(2)}\,\Omega\)`,
            String.raw`\(X_L = ${XL.toFixed(2)}\,\Omega, \; X_C = ${(XC * 2).toFixed(2)}\,\Omega\)`
          ),
          explanation: String.raw`<strong>Step 1 (\(X_L\)):</strong> \(X_L = 2\pi(50)(${L_mH} \times 10^{-3}) = ${XL.toFixed(2)}\,\Omega\).<br><strong>Step 2 (\(X_C\)):</strong> \(X_C = \frac{1}{2\pi(50)(${C_uF} \times 10^{-6})} = ${XC.toFixed(2)}\,\Omega\).`
        };
      }
      case "gen5_3": {
        const R = randInt(20, 60);
        const XL = randInt(50, 100);
        const XC = randInt(15, 45);
        const Xnet = XL - XC;
        const Z = Math.sqrt(R * R + Xnet * Xnet);
        const theta = Math.atan2(Xnet, R) * (180 / Math.PI);
        return {
          question: String.raw`A series RLC circuit has \(R = ${R}\,\Omega\), \(X_L = ${XL}\,\Omega\), and \(X_C = ${XC}\,\Omega\). Find the total polar impedance \(|Z|\angle\theta\).`,
          unitBanner: String.raw`Net reactance \(X_{\text{net}} = X_L - X_C\), \(|Z| = \sqrt{R^2 + X_{\text{net}}^2}\), \(\theta = \tan^{-1}\left(\frac{X_{\text{net}}}{R}\right)\).`,
          options: makeOptions(
            String.raw`\(${Z.toFixed(2)}\,\Omega \angle ${theta.toFixed(1)}^\circ\)`,
            String.raw`\(${Math.sqrt(R*R + (XL+XC)*(XL+XC)).toFixed(2)}\,\Omega \angle ${theta.toFixed(1)}^\circ\)`,
            String.raw`\(${Z.toFixed(2)}\,\Omega \angle -${theta.toFixed(1)}^\circ\)`,
            String.raw`\(${(R + Xnet).toFixed(2)}\,\Omega \angle 45.0^\circ\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(X_{\text{net}} = ${XL} - ${XC} = ${Xnet}\,\Omega\).<br><strong>Step 2:</strong> \(|Z| = \sqrt{${R}^2 + ${Xnet}^2} = ${Z.toFixed(2)}\,\Omega\), \(\theta = \tan^{-1}(${Xnet}/${R}) = ${theta.toFixed(1)}^\circ\).`
        };
      }
      case "gen5_4": {
        const V = 230;
        const I = randInt(4, 16);
        const deg = [25, 30, 36.87, 45][idx % 4];
        const S = V * I;
        const pf = Math.cos((deg * Math.PI) / 180);
        const P = S * pf;
        return {
          question: String.raw`An AC load draws \(I = ${I}\text{ A}\) from a \(V = 230\text{ V}\) supply at a phase angle of \(\theta = ${deg}^\circ\). Calculate the Apparent Power \(S\), Power Factor \(\cos\theta\), and True Power \(P\).`,
          unitBanner: String.raw`Use \(S = V \times I\text{ (VA)}\), \(\text{PF} = \cos\theta\), and \(P = S \cos\theta\text{ (W)}\).`,
          options: makeOptions(
            String.raw`\(S = ${S}\text{ VA}, \; \text{PF} = ${pf.toFixed(2)}, \; P = ${P.toFixed(0)}\text{ W}\)`,
            String.raw`\(S = ${S}\text{ VA}, \; \text{PF} = ${Math.sin(deg * Math.PI / 180).toFixed(2)}, \; P = ${(S * Math.sin(deg * Math.PI / 180)).toFixed(0)}\text{ W}\)`,
            String.raw`\(S = ${P.toFixed(0)}\text{ VA}, \; \text{PF} = ${pf.toFixed(2)}, \; P = ${S}\text{ W}\)`,
            String.raw`\(S = ${S * 2}\text{ VA}, \; \text{PF} = 1.00, \; P = ${S}\text{ W}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(S = 230 \times ${I} = ${S}\text{ VA}\).<br><strong>Step 2:</strong> \(\text{PF} = \cos(${deg}^\circ) = ${pf.toFixed(3)}\).<br><strong>Step 3:</strong> \(P = ${S} \times ${pf.toFixed(3)} = ${P.toFixed(0)}\text{ W}\).`
        };
      }
      case "gen6_1": {
        const a = randInt(4, 10);
        const b = -randInt(1, 4);
        const c = b;
        const d = randInt(5, 9);
        const det = a * d - b * c;
        return {
          question: String.raw`Calculate the determinant \(\Delta\) of the mesh resistance matrix \(\begin{pmatrix} ${a} & ${b} \\ ${c} & ${d} \end{pmatrix}\).`,
          unitBanner: String.raw`For a \(2 \times 2\) matrix \(\begin{pmatrix} a & b \\ c & d \end{pmatrix}\), \(\Delta = (a \times d) - (b \times c)\). Watch the negative signs!`,
          options: makeOptions(
            String.raw`\(\Delta = ${det}\)`,
            String.raw`\(\Delta = ${a * d + b * c}\)`,
            String.raw`\(\Delta = ${a + d - b - c}\)`,
            String.raw`\(\Delta = ${det + 6}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Main diagonal):</strong> \(${a} \times ${d} = ${a * d}\).<br><strong>Step 2 (Off-diagonal):</strong> \((${b}) \times (${c}) = ${b * c}\).<br><strong>Step 3 (Subtract):</strong> \(\Delta = ${a * d} - ${b * c} = ${det}\).`
        };
      }
      case "gen6_2": {
        const I1 = randInt(2, 6);
        const I2 = randInt(1, 4);
        const r11 = 6, r12 = -2, r21 = -2, r22 = 5;
        const V1 = r11 * I1 + r12 * I2;
        const V2 = r21 * I1 + r22 * I2;
        const det1 = V1 * r22 - r12 * V2;
        return {
          question: String.raw`Use Cramer's Rule to solve for Loop Current \(I_1\) in the simultaneous mesh equations:<br>\[ 6I_1 - 2I_2 = ${V1} \qquad \text{and} \qquad -2I_1 + 5I_2 = ${V2} \]`,
          unitBanner: String.raw`Find \(\Delta = \det\begin{pmatrix} 6 & -2 \\ -2 & 5 \end{pmatrix} = 26\) and \(\Delta_1 = \det\begin{pmatrix} ${V1} & -2 \\ ${V2} & 5 \end{pmatrix}\), then \(I_1 = \frac{\Delta_1}{\Delta}\).`,
          options: makeOptions(
            String.raw`\(I_1 = ${I1}\text{ A}\)`,
            String.raw`\(I_1 = ${I2}\text{ A}\)`,
            String.raw`\(I_1 = ${I1 + 3}\text{ A}\)`,
            String.raw`\(I_1 = ${(det1 / 10).toFixed(1)}\text{ A}\)`
          ),
          explanation: String.raw`<strong>Step 1 (\(\Delta\)):</strong> \(\Delta = (6 \times 5) - (-2 \times -2) = 30 - 4 = 26\).<br><strong>Step 2 (\(\Delta_1\)):</strong> \(\Delta_1 = (${V1} \times 5) - (-2 \times ${V2}) = ${det1}\).<br><strong>Step 3 (\(I_1\)):</strong> \(I_1 = \frac{${det1}}{26} = ${I1}\text{ A}\).`
        };
      }
      case "gen7_1": {
        const A = randInt(4, 15);
        const w = randInt(2, 9) * 10;
        const c = randInt(2, 6);
        return {
          question: String.raw`Differentiate the signal \(v(t) = ${A}\sin(${w}t) + ${c}t^2\) with respect to time \(t\).`,
          unitBanner: String.raw`Rules: \(\frac{d}{dt}[A\sin(\omega t)] = \omega A\cos(\omega t)\) and \(\frac{d}{dt}[ct^2] = 2ct\).`,
          options: makeOptions(
            String.raw`\(\frac{dv}{dt} = ${A * w}\cos(${w}t) + ${2 * c}t\)`,
            String.raw`\(\frac{dv}{dt} = ${A}\cos(${w}t) + ${2 * c}t\)`,
            String.raw`\(\frac{dv}{dt} = -${A * w}\cos(${w}t) + ${c}t\)`,
            String.raw`\(\frac{dv}{dt} = ${A * w}\sin(${w}t) + ${2 * c}t^2\)`
          ),
          explanation: String.raw`<strong>Step 1 (Sine derivative):</strong> \(\frac{d}{dt}[${A}\sin(${w}t)] = ${w} \times ${A}\cos(${w}t) = ${A * w}\cos(${w}t)\).<br><strong>Step 2 (Power rule):</strong> \(\frac{d}{dt}[${c}t^2] = ${2 * c}t\).`
        };
      }
      case "gen7_2": {
        const L_mH = randInt(20, 100);
        const a = randInt(2, 6);
        const t = randInt(2, 5);
        const di_dt = 2 * a * t;
        const vL = (L_mH * 1e-3) * di_dt;
        return {
          question: String.raw`The current through an inductor of \(L = ${L_mH}\text{ mH}\) varies as \(i(t) = ${a}t^2\text{ A}\). Calculate the induced back-EMF voltage \(v_L = L\frac{di}{dt}\) at \(t = ${t}\text{ s}\).`,
          unitBanner: String.raw`<strong>Step 0 Units:</strong> \(L = ${L_mH} \times 10^{-3}\text{ H}\). Differentiate \(i(t)\) first, evaluate at \(t = ${t}\text{ s}\), then multiply by \(L\).`,
          options: makeOptions(
            String.raw`\(${vL.toFixed(2)}\text{ V}\)`,
            String.raw`\(${(vL * 10).toFixed(2)}\text{ V}\)`,
            String.raw`\(${((L_mH * 1e-3) * a * t * t).toFixed(2)}\text{ V}\)`,
            String.raw`\(${(di_dt).toFixed(2)}\text{ V}\)`
          ),
          explanation: String.raw`<strong>Step 0:</strong> \(L = ${L_mH / 1000}\text{ H}\).<br><strong>Step 1 (Differentiate):</strong> \(\frac{di}{dt} = ${2 * a}t\). At \(t = ${t}\text{ s}\), \(\frac{di}{dt} = ${di_dt}\text{ A/s}\).<br><strong>Step 2:</strong> \(v_L = ${L_mH / 1000} \times ${di_dt} = ${vL.toFixed(2)}\text{ V}\).`
        };
      }
      case "gen7_3": {
        const I_peak = randInt(3, 9);
        const b = randInt(2, 5);
        const a = 2 * b * I_peak;
        const P_max = a * I_peak - b * I_peak * I_peak;
        return {
          question: String.raw`The power delivered to a load is given by \(P(I) = ${a}I - ${b}I^2\text{ W}\). Use differentiation (\(\frac{dP}{dI} = 0\)) to find the current \(I\) for maximum power and the value of \(P_{\max}\).`,
          unitBanner: String.raw`Set derivative \(\frac{dP}{dI} = ${a} - ${2 * b}I = 0\) to find \(I\), then substitute \(I\) back into \(P(I)\).`,
          options: makeOptions(
            String.raw`\(I = ${I_peak}\text{ A}, \; P_{\max} = ${P_max}\text{ W}\)`,
            String.raw`\(I = ${I_peak * 2}\text{ A}, \; P_{\max} = ${P_max * 2}\text{ W}\)`,
            String.raw`\(I = ${b}\text{ A}, \; P_{\max} = ${a}\text{ W}\)`,
            String.raw`\(I = ${I_peak}\text{ A}, \; P_{\max} = ${a * I_peak}\text{ W}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(\frac{dP}{dI} = ${a} - ${2 * b}I = 0 \implies I = \frac{${a}}{${2 * b}} = ${I_peak}\text{ A}\).<br><strong>Step 2:</strong> \(P_{\max} = ${a}(${I_peak}) - ${b}(${I_peak}^2) = ${P_max}\text{ W}\).`
        };
      }
      case "gen8_1": {
        const k = randInt(2, 6);
        const upper = randInt(2, 4);
        const ans = k * Math.pow(upper, 3);
        return {
          question: String.raw`Evaluate the definite integral \(\int_0^{${upper}} ${3 * k}t^2\,dt\).`,
          unitBanner: String.raw`Rule: \(\int 3kt^2\,dt = kt^3\). Substitute upper limit \(${upper}\) and subtract lower limit \(0\).`,
          options: makeOptions(
            String.raw`\(${ans}\)`,
            String.raw`\(${3 * k * upper * upper}\)`,
            String.raw`\(${ans / 2}\)`,
            String.raw`\(${ans + 12}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Integrate):</strong> \(\int ${3 * k}t^2\,dt = \big[ ${k}t^3 \big]_0^{${upper}}\).<br><strong>Step 2 (Limits):</strong> \({k}(${upper}^3) - 0 = ${k} \times ${Math.pow(upper, 3)} = ${ans}\).`
        };
      }
      case "gen8_2": {
        const m = randInt(2, 8);
        const tEnd = randInt(3, 6);
        const Q = 0.5 * m * tEnd * tEnd;
        return {
          question: String.raw`A ramp current \(i(t) = ${m}t\text{ A}\) charges a battery from \(t = 0\text{ s}\) to \(t = ${tEnd}\text{ s}\). Integrate \(Q = \int_0^{${tEnd}} i(t)\,dt\) to find the total charge transferred in Coulombs (\(\text{C}\)).`,
          unitBanner: String.raw`Use \(\int_0^{${tEnd}} ${m}t\,dt = \left[ \frac{${m}}{2}t^2 \right]_0^{${tEnd}}\).`,
          options: makeOptions(
            String.raw`\(${Q}\text{ C}\)`,
            String.raw`\(${Q * 2}\text{ C}\)`,
            String.raw`\(${m * tEnd}\text{ C}\)`,
            String.raw`\(${Q + 10}\text{ C}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(Q = \left[ ${m / 2}t^2 \right]_0^{${tEnd}} = ${m / 2} \times (${tEnd}^2) = ${Q}\text{ C}\).`
        };
      }
      case "gen9_1": {
        const R_k = randInt(10, 50);
        const C_uF = randInt(10, 100);
        const Vs = randInt(10, 24);
        const tau = (R_k * 1e3) * (C_uF * 1e-6);
        const vcAtTau = Vs * (1 - Math.exp(-1));
        return {
          question: String.raw`An RC circuit with \(R = ${R_k}\text{ k}\Omega\) and \(C = ${C_uF}\,\mu\text{F}\) is connected to a \(V_s = ${Vs}\text{ V}\) DC supply. Calculate the time constant \(\tau = RC\) and the capacitor voltage \(v_C\) at \(t = \tau\).`,
          unitBanner: String.raw`<strong>Step 0 Units:</strong> \(R = ${R_k} \times 10^3\,\Omega\), \(C = ${C_uF} \times 10^{-6}\text{ F}\). At \(t = \tau\), \(v_C = V_s(1 - e^{-1}) \approx 0.632 V_s\).`,
          options: makeOptions(
            String.raw`\(\tau = ${tau.toFixed(2)}\text{ s}, \; v_C = ${vcAtTau.toFixed(2)}\text{ V}\)`,
            String.raw`\(\tau = ${(tau * 10).toFixed(2)}\text{ s}, \; v_C = ${(Vs * 0.5).toFixed(2)}\text{ V}\)`,
            String.raw`\(\tau = ${tau.toFixed(2)}\text{ s}, \; v_C = ${(Vs * Math.exp(-1)).toFixed(2)}\text{ V}\)`,
            String.raw`\(\tau = ${(R_k / C_uF).toFixed(2)}\text{ s}, \; v_C = ${Vs}\text{ V}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Time Constant):</strong> \(\tau = (${R_k} \times 10^3)(${C_uF} \times 10^{-6}) = ${tau.toFixed(2)}\text{ s}\).<br><strong>Step 2 (Voltage at \(t = \tau\)):</strong> \(v_C = ${Vs}(1 - e^{-1}) = ${vcAtTau.toFixed(2)}\text{ V}\).`
        };
      }
      case "gen9_2": {
        const L_mH = randInt(100, 600);
        const R = randInt(10, 40);
        const Vs = R * randInt(2, 5);
        const Imax = Vs / R;
        const tau_ms = ((L_mH * 1e-3) / R) * 1000;
        return {
          question: String.raw`An inductor coil with \(L = ${L_mH}\text{ mH}\) and resistance \(R = ${R}\,\Omega\) is connected to a \(V_s = ${Vs}\text{ V}\) supply. Find the time constant \(\tau = \frac{L}{R}\) (in \(\text{ms}\)) and steady-state current \(I_{\max}\).`,
          unitBanner: String.raw`<strong>Step 0 Units:</strong> \(L = ${L_mH} \times 10^{-3}\text{ H}\). Use \(\tau = \frac{L}{R}\) and \(I_{\max} = \frac{V_s}{R}\).`,
          options: makeOptions(
            String.raw`\(\tau = ${tau_ms.toFixed(1)}\text{ ms}, \; I_{\max} = ${Imax}\text{ A}\)`,
            String.raw`\(\tau = ${(L_mH * R / 1000).toFixed(1)}\text{ ms}, \; I_{\max} = ${Imax}\text{ A}\)`,
            String.raw`\(\tau = ${tau_ms.toFixed(1)}\text{ ms}, \; I_{\max} = ${Imax * 2}\text{ A}\)`,
            String.raw`\(\tau = ${(tau_ms * 10).toFixed(1)}\text{ ms}, \; I_{\max} = ${(Imax / 2).toFixed(1)}\text{ A}\)`
          ),
          explanation: String.raw`<strong>Step 1 (\(\tau\)):</strong> \(\tau = \frac{${L_mH} \times 10^{-3}}{${R}} = ${(tau_ms / 1000).toFixed(4)}\text{ s} = ${tau_ms.toFixed(1)}\text{ ms}\).<br><strong>Step 2 (\(I_{\max}\)):</strong> \(I_{\max} = \frac{${Vs}}{${R}} = ${Imax}\text{ A}\).`
        };
      }
      case "gen9_3": {
        const tau = (randInt(2, 12) / 10);
        const Vs = 10;
        const vc = randInt(5, 9);
        const t = -tau * Math.log(1 - vc / Vs);
        return {
          question: String.raw`A capacitor charging circuit with time constant \(\tau = ${tau}\text{ s}\) is connected to \(V_s = 10\text{ V}\). Calculate the time \(t\) required for \(v_C\) to reach \(${vc}\text{ V}\).`,
          unitBanner: String.raw`Use the transposed natural log formula: \(t = -\tau \ln\left(1 - \frac{v_C}{V_s}\right)\).`,
          options: makeOptions(
            String.raw`\(${t.toFixed(3)}\text{ s}\)`,
            String.raw`\(${(tau * (vc / Vs)).toFixed(3)}\text{ s}\)`,
            String.raw`\(${(-tau * Math.log(vc / Vs)).toFixed(3)}\text{ s}\)`,
            String.raw`\(${(t * 2).toFixed(3)}\text{ s}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(1 - \frac{${vc}}{10} = ${(1 - vc / 10).toFixed(1)}\).<br><strong>Step 2:</strong> \(t = -${tau} \times \ln(${(1 - vc / 10).toFixed(1)}) = ${t.toFixed(3)}\text{ s}\).`
        };
      }
      case "gen10_1": {
        const A = randInt(3, 12);
        const a = randInt(2, 9);
        return {
          question: String.raw`Find the Laplace Transform \(F(s) = \mathcal{L}\{f(t)\}\) of the transient signal \(f(t) = ${A}e^{-${a}t}\).`,
          unitBanner: String.raw`Standard Laplace Transform pair: \(\mathcal{L}\{A e^{-at}\} = \frac{A}{s + a}\).`,
          options: makeOptions(
            String.raw`\(\frac{${A}}{s + ${a}}\)`,
            String.raw`\(\frac{${A}}{s - ${a}}\)`,
            String.raw`\(\frac{${a}}{s + ${A}}\)`,
            String.raw`\(\frac{${A}s}{s^2 + ${a}^2}\)`
          ),
          explanation: String.raw`By the standard exponential Laplace transform pair: \[ \mathcal{L}\{${A}e^{-${a}t}\} = \frac{${A}}{s + ${a}} \]`
        };
      }
      case "gen10_2": {
        const R = randInt(4, 20);
        const L = randInt(2, 6);
        const Vs = randInt(10, 40);
        return {
          question: String.raw`A series RL circuit with \(R = ${R}\,\Omega\) and \(L = ${L}\text{ H}\) is driven by a DC step voltage \(v(t) = ${Vs}\text{ V}\) (so \(V(s) = \frac{${Vs}}{s}\)). Write the \(s\)-domain current expression \(I(s) = \frac{V(s)}{Z(s)}\).`,
          unitBanner: String.raw`In the \(s\)-domain, total series impedance is \(Z(s) = R + sL = ${R} + ${L}s\).`,
          options: makeOptions(
            String.raw`\(I(s) = \frac{${Vs}}{s(${L}s + ${R})}\)`,
            String.raw`\(I(s) = \frac{${Vs}}{${L}s + ${R}}\)`,
            String.raw`\(I(s) = \frac{${Vs}s}{${L}s + ${R}}\)`,
            String.raw`\(I(s) = \frac{${R} + ${L}s}{${Vs}s}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(V(s) = \frac{${Vs}}{s}\) and \(Z(s) = ${L}s + ${R}\).<br><strong>Step 2:</strong> \(I(s) = \frac{V(s)}{Z(s)} = \frac{${Vs}}{s(${L}s + ${R})}\).`
        };
      }
      case "gen10_3": {
        const A = randInt(2, 8);
        const a = randInt(2, 6);
        const K = A * a;
        return {
          question: String.raw`Using partial fractions, find the inverse Laplace transform \(i(t) = \mathcal{L}^{-1}\{I(s)\}\) of \(I(s) = \frac{${K}}{s(s + ${a})}\).`,
          unitBanner: String.raw`Split \(\frac{${K}}{s(s+${a})} = \frac{A}{s} - \frac{A}{s+${a}}\) where \(A = \frac{${K}}{${a}} = ${A}\).`,
          options: makeOptions(
            String.raw`\(i(t) = ${A}\left(1 - e^{-${a}t}\right)\text{ A}\)`,
            String.raw`\(i(t) = ${K}\left(1 - e^{-${a}t}\right)\text{ A}\)`,
            String.raw`\(i(t) = ${A}e^{-${a}t}\text{ A}\)`,
            String.raw`\(i(t) = ${A}\left(1 + e^{+${a}t}\right)\text{ A}\)`
          ),
          explanation: String.raw`<strong>Step 1 (Partial Fractions):</strong> \(\frac{${K}}{s(s + ${a})} = \frac{${A}}{s} - \frac{${A}}{s + ${a}}\).<br><strong>Step 2 (Inverse Transform):</strong> \(i(t) = ${A} - ${A}e^{-${a}t} = ${A}(1 - e^{-${a}t})\text{ A}\).`
        };
      }
      case "gen11_1": {
        const f1 = [50, 60, 100, 400][idx % 4];
        const n = [3, 5, 7, 9][idx % 4];
        return {
          question: String.raw`A symmetrical square-wave power inverter has a fundamental frequency of \(f_1 = ${f1}\text{ Hz}\). Calculate the frequency \(f_{${n}}\) and angular velocity \(\omega_{${n}}\) of its \(${n}\text{th}\) harmonic.`,
          unitBanner: String.raw`Use \(f_n = n \times f_1\) and \(\omega_n = 2\pi f_n\).`,
          options: makeOptions(
            String.raw`\(f_{${n}} = ${n * f1}\text{ Hz}, \; \omega_{${n}} = ${(2 * Math.PI * n * f1).toFixed(1)}\text{ rad/s}\)`,
            String.raw`\(f_{${n}} = ${(f1 / n).toFixed(1)}\text{ Hz}, \; \omega_{${n}} = ${(2 * Math.PI * f1).toFixed(1)}\text{ rad/s}\)`,
            String.raw`\(f_{${n}} = ${n * f1}\text{ Hz}, \; \omega_{${n}} = ${(n * f1).toFixed(1)}\text{ rad/s}\)`,
            String.raw`\(f_{${n}} = ${(n + 1) * f1}\text{ Hz}, \; \omega_{${n}} = ${(2 * Math.PI * (n + 1) * f1).toFixed(1)}\text{ rad/s}\)`
          ),
          explanation: String.raw`<strong>Step 1:</strong> \(f_{${n}} = ${n} \times ${f1} = ${n * f1}\text{ Hz}\).<br><strong>Step 2:</strong> \(\omega_{${n}} = 2\pi \times ${n * f1} = ${(2 * Math.PI * n * f1).toFixed(1)}\text{ rad/s}\).`
        };
      }
      case "gen11_2":
      default: {
        const V = randInt(2, 12) * 10;
        const n = [1, 3, 5][idx % 3];
        const bn = (4 * V) / (n * Math.PI);
        return {
          question: String.raw`A symmetrical square wave switches between \(+${V}\text{ V}\) and \(-${V}\text{ V}\). Calculate the peak Fourier sine coefficient \(b_{${n}} = \frac{4V}{${n}\pi}\) for harmonic \(n = ${n}\).`,
          unitBanner: String.raw`For a square wave of amplitude \(V\), odd harmonic amplitude is \(b_n = \frac{4V}{n\pi}\).`,
          options: makeOptions(
            String.raw`\(${bn.toFixed(2)}\text{ V}\)`,
            String.raw`\(${(V / n).toFixed(2)}\text{ V}\)`,
            String.raw`\(${(bn * 2).toFixed(2)}\text{ V}\)`,
            String.raw`\(${(2 * V / (n * Math.PI)).toFixed(2)}\text{ V}\)`
          ),
          explanation: String.raw`<strong>Substitute \(V = ${V}\text{ V}\) and \(n = ${n}\):</strong> \[ b_{${n}} = \frac{4 \times ${V}}{${n} \times \pi} = ${bn.toFixed(2)}\text{ V} \]`
        };
      }
    }
  }

  // =========================================================================
  // CURRICULUM HIERARCHY (12 MODULES, 33 SUB-TOPICS WITH 4-STEP LESSONS)
  // =========================================================================
  const modules = [
    {
      moduleId: "M0",
      levelCode: "L3",
      levelLabel: "L3 Bridging (L3E-B1)",
      badgeClass: "bg-blue-600 text-white",
      moduleTitle: "Module 0: Foundational Units, SI Prefixes & Calculator Mastery",
      moduleDesc: "Zero-prerequisite entry module covering physical analogies for circuit quantities, SI prefixes, and Casio scientific calculator keys.",
      topics: [
        {
          id: "0.1",
          title: "0.1 Electrical Base Units & Physical Analogies",
          generator: "gen0_1",
          step1: String.raw`Electricity is invisible, so engineers picture it as water flowing through a closed loop of pipes.
            <ul class="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Voltage (\(V\), Volts) = Water Pressure:</strong> The push from the pump forcing water through the pipe.</li>
              <li><strong>Current (\(I\), Amperes/Amps) = Flow Rate:</strong> How many litres per second of water actually move past a point.</li>
              <li><strong>Resistance (\(R\), Ohms \(\Omega\)) = Pipe Narrowing:</strong> A grit filter or pinch in the pipe that resists water flow.</li>
              <li><strong>Capacitance (\(C\), Farads \(\text{F}\)) = Rubber Diaphragm Tank:</strong> Stores energy under pressure and releases it when pressure drops.</li>
              <li><strong>Inductance (\(L\), Henrys \(\text{H}\)) = Heavy Water Flywheel:</strong> Takes effort to spin up, and keeps water moving when you try to stop it.</li>
            </ul>`,
          step2: String.raw`Before plugging numbers into any formula, engineers verify that every quantity is expressed in its <strong>Standard SI Base Unit</strong>: Volts (\(\text{V}\)), Amps (\(\text{A}\)), Ohms (\(\Omega\)), Watts (\(\text{W}\)), Farads (\(\text{F}\)), Henrys (\(\text{H}\)), and Hertz (\(\text{Hz}\)). Mixing un-converted units causes factor-of-1,000 errors in circuit design.`,
          step3: String.raw`<div class="text-center py-2">\[ V = I \times R \qquad P = V \times I \qquad f = \frac{1}{T} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>\(V\) = Electrical Potential Difference in <strong>Volts (\(\text{V}\))</strong></li>
              <li>\(I\) = Electric Current in <strong>Amperes (\(\text{A}\))</strong></li>
              <li>\(R\) = Electrical Resistance in <strong>Ohms (\(\Omega\))</strong></li>
              <li>\(P\) = Electrical Power in <strong>Watts (\(\text{W}\))</strong></li>
              <li>\(f\) = Frequency in <strong>Hertz (\(\text{Hz}\))</strong>, \(T\) = Period in <strong>Seconds (\(\text{s}\))</strong></li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> A DC heater draws \(I = 2.5\text{ A}\) from a \(V = 230\text{ V}\) supply. Find its resistance \(R\) and power \(P\).<br>
            <strong>Step 0 (Check Base Units):</strong> Both \(2.5\text{ A}\) and \(230\text{ V}\) are already in standard base units.<br>
            <strong>Step 1 (Resistance):</strong> \[ R = \frac{V}{I} = \frac{230}{2.5} = 92\,\Omega \]<br>
            <strong>Step 2 (Power):</strong> \[ P = V \times I = 230 \times 2.5 = 575\text{ W} \]`
        },
        {
          id: "0.2",
          title: "0.2 SI Metric Prefixes (M, k, m, μ, n, p)",
          generator: "gen0_2",
          step1: String.raw`A 1 Farad capacitor is the size of a fizzy drink can, so real circuit boards use tiny fractions of a Farad—millionths (\(\mu\text{F}\)), billionths (\(\text{nF}\)), or trillionths (\(\text{pF}\)). Conversely, high-voltage power lines use thousands (\(\text{kV}\)) or millions (\(\text{MV}\)) of Volts. Metric prefixes are simply shorthand for powers of \(10^3\).`,
          step2: String.raw`Every time you read a component value off a schematic (like \(4.7\text{ k}\Omega\), \(100\text{ mH}\), or \(22\text{ nF}\)), your very first step ("Step 0") is replacing the prefix letter with its \(\times 10^n\) multiplier before touching the formula.`,
          step3: String.raw`<div class="text-center py-2">\[ \text{Base Value} = \text{Number} \times 10^{\text{Prefix Power}} \]</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono pt-2">
              <div class="bg-slate-900 p-2 rounded border border-slate-700">Mega (\(\text{M}\)) = \(\times 10^{6}\)</div>
              <div class="bg-slate-900 p-2 rounded border border-slate-700">kilo (\(\text{k}\)) = \(\times 10^{3}\)</div>
              <div class="bg-slate-900 p-2 rounded border border-slate-700">milli (\(\text{m}\)) = \(\times 10^{-3}\)</div>
              <div class="bg-slate-900 p-2 rounded border border-slate-700">micro (\(\mu\)) = \(\times 10^{-6}\)</div>
              <div class="bg-slate-900 p-2 rounded border border-slate-700">nano (\(\text{n}\)) = \(\times 10^{-9}\)</div>
              <div class="bg-slate-900 p-2 rounded border border-slate-700">pico (\(\text{p}\)) = \(\times 10^{-12}\)</div>
            </div>`,
          step4: String.raw`<strong>Problem:</strong> Convert \(C = 47\text{ nF}\) and \(R = 2.2\text{ M}\Omega\) into standard base units.<br>
            <strong>Step 1 (Nano to Farads):</strong> Replace \(\text{n}\) with \(\times 10^{-9}\): \[ 47\text{ nF} = 47 \times 10^{-9}\text{ F} = 4.7 \times 10^{-8}\text{ F} \]<br>
            <strong>Step 2 (Mega to Ohms):</strong> Replace \(\text{M}\) with \(\times 10^{6}\): \[ 2.2\text{ M}\Omega = 2.2 \times 10^{6}\,\Omega = 2,200,000\,\Omega \]`
        },
        {
          id: "0.3",
          title: "0.3 Scientific Calculator Mastery (x10ˣ & ENG Keys)",
          generator: "gen0_3",
          step1: String.raw`Many students get the right formula on paper but get the wrong answer on their calculator because they type <code class="text-red-400">× 10 ^ -6</code> instead of using the dedicated scientific notation key <code class="text-emerald-400">x10ˣ</code> (or <code class="text-emerald-400">EXP</code>). Using the <code class="text-emerald-400">x10ˣ</code> key glues the number and its power together as a single value.`,
          step2: String.raw`When dividing by values like \(2\pi \times 50\text{ mH}\) on a Casio calculator, typing <code class="text-emerald-400">[5][0][x10ˣ][-][3]</code> ensures the calculator treats \(50 \times 10^{-3}\) as one unified number. Once you get your final decimal answer, pressing the <code class="text-amber-300">ENG</code> key automatically formats the power of 10 into a multiple of 3 (\(-3, -6, -9\)) so you can read off the prefix immediately!`,
          step3: String.raw`<div class="text-center py-2">\[ X_C = \frac{1}{2\pi f C} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li><strong>Casio Fraction Key \(\left[\frac{\square}{\square}\right]\):</strong> Always start fraction formulas by pressing the fraction button so numerator and denominator stay separated.</li>
              <li><strong>The \(\left[\times 10^x\right]\) Key:</strong> Press this instead of typing \(\times 10\).</li>
              <li><strong>The \(\left[\text{ENG}\right]\) Key:</strong> Shifts the decimal point so the exponent is \(10^3, 10^6, 10^{-3}, 10^{-6}, 10^{-9}\).</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> Calculate \(I = \frac{12\text{ V}}{4\text{ k}\Omega}\) and express the result in milliamps (\(\text{mA}\)).<br>
            <strong>Step 0 (Convert Units):</strong> \(4\text{ k}\Omega = 4 \times 10^3\,\Omega\).<br>
            <strong>Step 1 (Casio Keystrokes):</strong> Press <code class="text-emerald-300">[1][2] [÷] [4] [x10ˣ] [3] [=]</code> \(\rightarrow\) Display shows \(0.003\) or \(3 \times 10^{-3}\).<br>
            <strong>Step 2 (Read Prefix):</strong> Since \(10^{-3}\) is milli (\(\text{m}\)), the current is \(3\text{ mA}\).`
        }
      ]
    },
    {
      moduleId: "M1",
      levelCode: "L3",
      levelLabel: "L3 Bridging (L3E-B1)",
      badgeClass: "bg-blue-600 text-white",
      moduleTitle: "Module 1: Engineering Algebra, Indices & Quadratics",
      moduleDesc: "Core algebraic manipulation, laws of indices, simultaneous equations, and quadratic roots for circuit analysis.",
      topics: [
        {
          id: "1.1",
          title: "1.1 Laws of Indices & Negative/Fractional Powers",
          generator: "gen1_1",
          step1: String.raw`Indices (powers) are a shortcut for repeated multiplication. When multiplying powers of 10 (like kilo \(\times\) micro), you don't need to write out zeros—you just add or subtract their exponents! A negative power (\(x^{-n}\)) simply means \(1 \div x^n\), and a fractional power (\(x^{1/2}\)) means the square root \(\sqrt{x}\).`,
          step2: String.raw`In electrical engineering, multiplying current in milliamps (\(10^{-3}\)) by resistance in kilohms (\(10^{3}\)) cancels the powers out completely: \(10^{-3+3} = 10^0 = 1\) Volt! Mastering index laws lets you spot-check whether your calculator answer makes sense.`,
          step3: String.raw`<div class="text-center py-2">\[ a^m \times a^n = a^{m+n} \qquad \frac{a^m}{a^n} = a^{m-n} \qquad (a^m)^n = a^{m \cdot n} \]</div>
            <div class="text-center py-1">\[ a^{-n} = \frac{1}{a^n} \qquad a^{1/2} = \sqrt{a} \qquad a^0 = 1 \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Simplify \(\frac{10^3 \times 10^{-9}}{10^{-4}}\) without a calculator.<br>
            <strong>Step 1 (Combine Numerator):</strong> Add powers on top: \(10^{3 + (-9)} = 10^{-6}\).<br>
            <strong>Step 2 (Divide by Denominator):</strong> Subtract bottom power: \(10^{-6 - (-4)} = 10^{-6 + 4} = 10^{-2} = 0.01\).`
        },
        {
          id: "1.2",
          title: "1.2 Expanding, Factorising & Linear Circuit Equations",
          generator: "gen1_2",
          step1: String.raw`Factorising is the reverse of expanding brackets. If two terms share a common variable—like current \(I\) appearing in both \(I R_1 + I R_2\)—we pull \(I\) outside brackets to get \(I(R_1 + R_2)\).`,
          step2: String.raw`When applying Kirchhoff's Voltage Law around a series loop, you get \(V_s = I R_1 + I R_2 + I R_3\). Factorising out \(I\) gives \(V_s = I(R_1 + R_2 + R_3)\), which is how the series resistance rule is proved and used to find unknown loop currents!`,
          step3: String.raw`<div class="text-center py-2">\[ a(b + c) = ab + ac \qquad I R_1 + I R_2 = I(R_1 + R_2) \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>To solve for \(I\), collect all \(I\) terms on the left side and constant voltage terms on the right side.</li>
              <li>Factorise \(I\) out, then divide both sides by the bracketed resistance sum.</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> Solve the loop equation \(24 - 3I = 5I + 8\) for current \(I\) in Amps.<br>
            <strong>Step 1 (Collect \(I\) terms):</strong> Add \(3I\) to both sides: \(24 = 8I + 8\).<br>
            <strong>Step 2 (Isolate constant):</strong> Subtract \(8\) from both sides: \(16 = 8I\).<br>
            <strong>Step 3 (Divide):</strong> \(I = \frac{16}{8} = 2\text{ A}\).`
        },
        {
          id: "1.3",
          title: "1.3 Quadratic Equations in Electrical Power Problems",
          generator: "gen1_3",
          step1: String.raw`When an unknown variable is squared (like \(I^2\)) alongside a linear term (\(I\)), you get a quadratic equation: \(ax^2 + bx + c = 0\). Because a squared number can come from a positive or negative root, quadratics usually give two possible answers.`,
          step2: String.raw`When a battery with internal resistance \(r\) supplies a fixed power \(P\) to a load, combining \(P = V I - I^2 r\) produces the quadratic equation \(r I^2 - V I + P = 0\). Engineers use the quadratic formula to find the two possible operating currents.`,
          step3: String.raw`<div class="text-center py-2">\[ ax^2 + bx + c = 0 \implies x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>\(a\) = coefficient of \(x^2\), \(b\) = coefficient of \(x\), \(c\) = constant term.</li>
              <li>The discriminant \(b^2 - 4ac\) must be \(\ge 0\) for real physical currents.</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> Find the positive roots of \(I^2 - 7I + 10 = 0\).<br>
            <strong>Step 1 (Identify \(a,b,c\)):</strong> \(a = 1, \; b = -7, \; c = 10\).<br>
            <strong>Step 2 (Substitute into Formula):</strong> \[ I = \frac{-(-7) \pm \sqrt{(-7)^2 - 4(1)(10)}}{2(1)} = \frac{7 \pm \sqrt{49 - 40}}{2} = \frac{7 \pm 3}{2} \]<br>
            <strong>Step 3 (Calculate Roots):</strong> \(I_1 = \frac{10}{2} = 5\text{ A}\) and \(I_2 = \frac{4}{2} = 2\text{ A}\).`
        }
      ]
    },
    {
      moduleId: "M2",
      levelCode: "L3",
      levelLabel: "L3 Bridging (L3E-B1)",
      badgeClass: "bg-blue-600 text-white",
      moduleTitle: "Module 2: Formula Transposition & Rearrangement",
      moduleDesc: "Step-by-step mastery of rearranging linear, fractional, root, and resonant frequency formulas.",
      topics: [
        {
          id: "2.1",
          title: "2.1 Transposing Linear & Fractional Formulas (Resistivity)",
          generator: "gen2_1",
          step1: String.raw`Think of a formula as a balanced seesaw. If your target letter is trapped in a fraction (like cable length \(l\) in \(R = \frac{\rho l}{A}\)), you peel away the other letters one by one using opposite operations: multiply to undo division, divide to undo multiplication.`,
          step2: String.raw`Cable installation engineers know the maximum allowed resistance \(R\) of a cable run and the resistivity \(\rho\) of copper, and must transpose \(R = \frac{\rho l}{A}\) to find the minimum safe cross-sectional area \(A\) so the cable doesn't overheat.`,
          step3: String.raw`<div class="text-center py-2">\[ R = \frac{\rho l}{A} \implies l = \frac{R A}{\rho} \implies A = \frac{\rho l}{R} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>\(R\) = Resistance (\(\Omega\)), \(\rho\) = Resistivity (\(\Omega\cdot\text{m}\)), \(l\) = Length (\(\text{m}\)), \(A\) = Area (\(\text{m}^2\)).</li>
              <li><strong>Cross-Multiplication Shortcut:</strong> Any variable on the bottom right can swap places directly with the variable on the top left!</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> Given \(R = \frac{\rho l}{A}\), find length \(l\) when \(R = 0.5\,\Omega\), \(A = 2.5 \times 10^{-6}\text{ m}^2\), and \(\rho = 1.72 \times 10^{-8}\,\Omega\cdot\text{m}\).<br>
            <strong>Step 1 (Transpose for \(l\)):</strong> Multiply by \(A\), then divide by \(\rho\): \(l = \frac{R A}{\rho}\).<br>
            <strong>Step 2 (Substitute):</strong> \[ l = \frac{0.5 \times 2.5 \times 10^{-6}}{1.72 \times 10^{-8}} = 72.67\text{ m} \]`
        },
        {
          id: "2.2",
          title: "2.2 Transposing Formulas with Squares & Roots",
          generator: "gen2_2",
          step1: String.raw`Squares (\(x^2\)) and square roots (\(\sqrt{x}\)) are exact opposites. If your target variable is squared (like \(I\) in \(P = I^2 R\)), isolate \(I^2\) first, then take the square root of both sides. If your target is trapped under a \(\sqrt{\phantom{x}}\) roof, isolate the root first, then square both sides!`,
          step2: String.raw`Fuse and circuit-breaker sizing relies on \(I = \sqrt{\frac{P}{R}}\) and \(V = \sqrt{P \cdot R}\) to determine the maximum safe RMS current or voltage a resistor can handle before exceeding its power rating.`,
          step3: String.raw`<div class="text-center py-2">\[ P = I^2 R \implies I = \sqrt{\frac{P}{R}} \qquad P = \frac{V^2}{R} \implies V = \sqrt{P \cdot R} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A \(R = 470\,\Omega\) resistor is rated at \(P = 0.5\text{ W}\). Find the maximum safe voltage \(V\) across it.<br>
            <strong>Step 1 (Transpose \(P = \frac{V^2}{R}\)):</strong> Multiply both sides by \(R\) to get \(V^2 = P \cdot R\), then square-root both sides: \(V = \sqrt{P \cdot R}\).<br>
            <strong>Step 2 (Calculate):</strong> \[ V = \sqrt{0.5 \times 470} = \sqrt{235} = 15.33\text{ V} \]`
        },
        {
          id: "2.3",
          title: "2.3 Transposing the LC Resonant Frequency Formula",
          generator: "gen2_3",
          step1: String.raw`In the resonant frequency formula \(f_r = \frac{1}{2\pi\sqrt{LC}}\), both \(L\) and \(C\) are trapped at the bottom of a fraction AND underneath a square root! To free them, we square the entire equation to destroy the square root, then swap the target variable to the top left.`,
          step2: String.raw`RF and power electronics engineers design tuned LC filters for a target frequency \(f_r\). Since inductors come in fixed stock values, the engineer picks an inductor \(L\) and uses the transposed formula to calculate the exact tuning capacitor \(C\).`,
          step3: String.raw`<div class="text-center py-2">\[ f_r = \frac{1}{2\pi\sqrt{LC}} \xrightarrow{\text{Square Both Sides}} f_r^2 = \frac{1}{4\pi^2 L C} \]</div>
            <div class="text-center py-1">\[ C = \frac{1}{4\pi^2 f_r^2 L} \qquad \text{and} \qquad L = \frac{1}{4\pi^2 f_r^2 C} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>\(f_r\) = Resonant Frequency (\(\text{Hz}\)), \(L\) = Inductance (\(\text{H}\)), \(C\) = Capacitance (\(\text{F}\)).</li>
              <li>Notice that \((2\pi)^2\) becomes \(4\pi^2\). Never forget to square both the \(2\), the \(\pi\), and the \(f_r\)!</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> Calculate the required capacitance \(C\) (in \(\text{nF}\)) to resonate at \(f_r = 50\text{ kHz}\) with an inductor of \(L = 4\text{ mH}\).<br>
            <strong>Step 0 (Convert to Base SI Units):</strong> \(f_r = 50 \times 10^3\text{ Hz}\), \(L = 4 \times 10^{-3}\text{ H}\).<br>
            <strong>Step 1 (Substitute into Transposed Formula):</strong> \[ C = \frac{1}{4\pi^2 (50 \times 10^3)^2 (4 \times 10^{-3})} = 2.533 \times 10^{-9}\text{ F} \]<br>
            <strong>Step 2 (Convert to nanoFarads):</strong> Since \(10^{-9}\text{ F} = 1\text{ nF}\), \(C = 2.53\text{ nF}\).`
        }
      ]
    },
    {
      moduleId: "M3",
      levelCode: "L3",
      levelLabel: "L3 Bridging (L3E-B1)",
      badgeClass: "bg-blue-600 text-white",
      moduleTitle: "Module 3: Logarithms, Exponentials & Decibels (dB)",
      moduleDesc: "Logarithmic laws, natural logs (ln), exponential growth/decay, and decibel gain/attenuation ratios.",
      topics: [
        {
          id: "3.1",
          title: "3.1 Laws of Logarithms (log₁₀ and ln) & Exponentials",
          generator: "gen3_1",
          step1: String.raw`A logarithm simply asks: <em>"What power must I raise the base to in order to get this number?"</em> For example, since \(10^3 = 1000\), \(\log_{10}(1000) = 3\). Engineers use two bases: Base 10 (\(\log_{10}\)) for decibels and Bode plots, and Euler's natural base \(e \approx 2.718\) (\(\ln\)) for capacitor and inductor transients.`,
          step2: String.raw`Whenever an unknown variable \(t\) is trapped in an exponent (such as \(e^{-t/\tau} = 0.5\)), taking the natural logarithm \(\ln\) of both sides immediately frees the exponent: \(\ln(e^x) = x\).`,
          step3: String.raw`<div class="text-center py-2">\[ \log(A \cdot B) = \log A + \log B \qquad \log\left(\frac{A}{B}\right) = \log A - \log B \qquad \log(A^n) = n\log A \]</div>
            <div class="text-center py-1">\[ y = e^x \iff x = \ln(y) \qquad y = 10^x \iff x = \log_{10}(y) \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Solve the exponential decay equation \(e^{-2t} = 0.25\) for time \(t\) in seconds.<br>
            <strong>Step 1 (Take \(\ln\) of both sides):</strong> \(-2t = \ln(0.25) = -1.3863\).<br>
            <strong>Step 2 (Divide by \(-2\)):</strong> \(t = \frac{-1.3863}{-2} = 0.693\text{ s}\).`
        },
        {
          id: "3.2",
          title: "3.2 Decibel (dB) Power & Voltage Gain Ratios",
          generator: "gen3_2",
          step1: String.raw`Amplifiers can boost signals by factors of 1,000,000, while long cables can shrink signals to 0.0001. Instead of multiplying huge numbers, engineers use the logarithmic <strong>Decibel (\(\text{dB}\))</strong> scale, which turns multiplication of gains into simple addition and subtraction!`,
          step2: String.raw`Because electrical power is proportional to voltage squared (\(P = \frac{V^2}{R}\)), the logarithm power rule brings the \(2\) out to the front. Therefore, power ratio uses \(10\log_{10}(P_2/P_1)\), whereas voltage ratio uses \(20\log_{10}(V_2/V_1)\).`,
          step3: String.raw`<div class="text-center py-2">\[ G_{\text{dB (Power)}} = 10\log_{10}\left(\frac{P_{\text{out}}}{P_{\text{in}}}\right) \qquad G_{\text{dB (Voltage)}} = 20\log_{10}\left(\frac{V_{\text{out}}}{V_{\text{in}}}\right) \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li><strong>Double Power (\(\times 2\)):</strong> \(\approx +3\text{ dB}\). <strong>Half Power (\(\times 0.5\)):</strong> \(\approx -3\text{ dB}\).</li>
              <li><strong>Reverse Formula (dB to Ratio):</strong> \(\frac{V_{\text{out}}}{V_{\text{in}}} = 10^{(G_{\text{dB}} / 20)}\).</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> An audio pre-amplifier takes a microphone input of \(V_{\text{in}} = 2\text{ mV}\) and outputs \(V_{\text{out}} = 200\text{ mV}\). Find the voltage gain in \(\text{dB}\).<br>
            <strong>Step 1 (Find Voltage Ratio):</strong> \(\frac{V_{\text{out}}}{V_{\text{in}}} = \frac{200\text{ mV}}{2\text{ mV}} = 100\).<br>
            <strong>Step 2 (Apply \(20\log_{10}\)):</strong> \[ G_{\text{dB}} = 20\log_{10}(100) = 20 \times 2 = 40\text{ dB} \]`
        }
      ]
    },
    {
      moduleId: "M4",
      levelCode: "L3",
      levelLabel: "L3 Bridging (L3E-B1)",
      badgeClass: "bg-blue-600 text-white",
      moduleTitle: "Module 4: Trigonometry, Radians & AC Sinusoidal Waveforms",
      moduleDesc: "Right-angled phasor triangles, radian conversion, angular velocity, and instantaneous AC sine waves.",
      topics: [
        {
          id: "4.1",
          title: "4.1 Right-Angled Phasor Triangles (Pythagoras & SOHCAHTOA)",
          generator: "gen4_1",
          step1: String.raw`In AC circuits, voltages and impedances don't just add in a straight line—they pull at \(90^\circ\) right angles to each other! We draw them as a right-angled triangle: horizontal side (Adjacent = Resistance \(R\)), vertical side (Opposite = Reactance \(X\)), and diagonal result (Hypotenuse = Impedance \(Z\)).`,
          step2: String.raw`Pythagoras' theorem gives the total magnitude of impedance or voltage, while \(\tan^{-1}(\text{Opp}/\text{Adj})\) gives the phase angle \(\theta\) between voltage and current.`,
          step3: String.raw`<div class="text-center py-2">\[ Z = \sqrt{R^2 + X^2} \qquad \cos\theta = \frac{R}{Z} \qquad \sin\theta = \frac{X}{Z} \qquad \tan\theta = \frac{X}{R} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A coil has resistance \(R = 30\,\Omega\) and inductive reactance \(X_L = 40\,\Omega\). Find its total impedance \(Z\) and phase angle \(\theta\).<br>
            <strong>Step 1 (Pythagoras):</strong> \(Z = \sqrt{30^2 + 40^2} = \sqrt{900 + 1600} = \sqrt{2500} = 50\,\Omega\).<br>
            <strong>Step 2 (Phase Angle):</strong> \(\theta = \tan^{-1}\left(\frac{40}{30}\right) = 53.13^\circ\).`
        },
        {
          id: "4.2",
          title: "4.2 Radians, Periodic Time (T) & Angular Velocity (ω)",
          generator: "gen4_2",
          step1: String.raw`Alternating Current is generated by a coil spinning in a circle inside a magnetic field. One full \(360^\circ\) rotation equals \(2\pi\) radians (\(\approx 6.283\text{ rad}\)). If the generator spins \(f\) times per second (Hertz), its angular speed \(\omega\) in radians per second is simply \(2\pi \times f\).`,
          step2: String.raw`Every AC formula in HNC engineering uses \(\omega = 2\pi f\). Knowing how to convert between frequency \(f\), periodic time \(T = \frac{1}{f}\), degrees, and radians is essential for oscilloscope measurements and waveform equations.`,
          step3: String.raw`<div class="text-center py-2">\[ \omega = 2\pi f = \frac{2\pi}{T} \qquad T = \frac{1}{f} \qquad \text{Radians} = \text{Degrees} \times \frac{\pi}{180^\circ} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>\(\omega\) = Angular Velocity in <strong>radians per second (\(\text{rad/s}\))</strong>.</li>
              <li>For UK mains frequency \(f = 50\text{ Hz}\): \(\omega = 2\pi(50) = 100\pi \approx 314.16\text{ rad/s}\) and \(T = 20\text{ ms}\).</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> An AC signal has a periodic time of \(T = 4\text{ ms}\). Find its frequency \(f\) and angular velocity \(\omega\).<br>
            <strong>Step 0 (Units):</strong> \(T = 4 \times 10^{-3}\text{ s}\).<br>
            <strong>Step 1 (Frequency):</strong> \(f = \frac{1}{4 \times 10^{-3}} = 250\text{ Hz}\).<br>
            <strong>Step 2 (Angular Velocity):</strong> \(\omega = 2\pi \times 250 = 1570.8\text{ rad/s}\).`
        },
        {
          id: "4.3",
          title: "4.3 Instantaneous AC Sine Wave Equations",
          generator: "gen4_3",
          step1: String.raw`An AC voltage is constantly changing from millisecond to millisecond. The equation \(v(t) = V_m \sin(\omega t + \phi)\) lets you take a "snapshot" to find the exact voltage at any specific instant in time \(t\).`,
          step2: String.raw`<strong>Crucial Calculator Rule:</strong> Because \(\omega\) is in radians per second (\(\text{rad/s}\)), \(\omega t\) is in <strong>Radians</strong>! If you evaluate \(\sin(\omega t)\) directly, your calculator MUST be in <strong>RAD mode</strong> (or convert \(\omega t\) to degrees first).`,
          step3: String.raw`<div class="text-center py-2">\[ v(t) = V_m \sin(\omega t \pm \phi) \qquad V_{\text{rms}} = \frac{V_m}{\sqrt{2}} \approx 0.707 V_m \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>\(V_m\) = Peak Amplitude (\(\text{V}\)), \(\omega\) = Angular Velocity (\(\text{rad/s}\)), \(\phi\) = Phase shift.</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> Given \(v(t) = 325\sin(100\pi t)\text{ V}\), find the RMS voltage and the instantaneous voltage at \(t = 2.5\text{ ms}\).<br>
            <strong>Step 1 (RMS Voltage):</strong> \(V_{\text{rms}} = \frac{325}{\sqrt{2}} = 229.8\text{ V}\).<br>
            <strong>Step 2 (Instantaneous Voltage in RAD mode):</strong> At \(t = 0.0025\text{ s}\), angle \(= 100\pi \times 0.0025 = \frac{\pi}{4}\text{ rad} (45^\circ)\).<br>
            \[ v(0.0025) = 325 \sin(\pi/4) = 325 \times 0.7071 = 229.8\text{ V} \]`
        }
      ]
    },
    {
      moduleId: "M5",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 5: Complex Numbers & AC Impedance Analysis",
      moduleDesc: "Rectangular/Polar j-notation, inductive/capacitive reactances, RLC series/parallel impedance, and AC power factor.",
      topics: [
        {
          id: "5.1",
          title: "5.1 Rectangular (a + jb) & Polar (r∠θ) Conversions",
          generator: "gen5_1",
          step1: String.raw`In electrical engineering, the letter \(i\) is already used for current, so we use \(j = \sqrt{-1}\) to represent a \(90^\circ\) rotation! A complex number has two forms: <strong>Rectangular form (\(a + jb\))</strong> which gives horizontal and vertical steps (great for adding/subtracting), and <strong>Polar form (\(r\angle\theta\))</strong> which gives straight-line distance and angle (great for multiplying/dividing).`,
          step2: String.raw`When impedances are in series, engineers add them in Rectangular form. When dividing voltage by impedance (\(I = \frac{V\angle 0^\circ}{Z\angle\theta}\)), engineers use Polar form: divide the magnitudes and subtract the angles!`,
          step3: String.raw`<div class="text-center py-2">\[ Z = a + jb = r\angle\theta \qquad r = \sqrt{a^2 + b^2} \qquad \theta = \tan^{-1}\left(\frac{b}{a}\right) \]</div>
            <div class="text-center py-1">\[ a = r\cos\theta \qquad b = r\sin\theta \qquad j^2 = -1 \]</div>
            <div class="text-center py-1">\[ \frac{r_1\angle\theta_1}{r_2\angle\theta_2} = \left(\frac{r_1}{r_2}\right)\angle(\theta_1 - \theta_2) \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Convert \(Z = 12 - j16\,\Omega\) into Polar form.<br>
            <strong>Step 1 (Magnitude \(r\)):</strong> \(r = \sqrt{12^2 + (-16)^2} = \sqrt{144 + 256} = \sqrt{400} = 20\,\Omega\).<br>
            <strong>Step 2 (Angle \(\theta\)):</strong> \(\theta = \tan^{-1}\left(\frac{-16}{12}\right) = -53.13^\circ\).<br>
            <strong>Result:</strong> \(Z = 20\angle -53.13^\circ\,\Omega\) (or use Casio <code class="text-emerald-300">[SHIFT] [+] (Pol)</code> key!).`
        },
        {
          id: "5.2",
          title: "5.2 Inductive & Capacitive Reactance (XL and XC)",
          generator: "gen5_2",
          step1: String.raw`Inductors and capacitors oppose AC current differently depending on frequency. An inductor (heavy flywheel) hates high-frequency changes, so \(X_L\) grows larger as frequency rises. A capacitor (storage tank) passes rapid AC surges easily, so \(X_C\) shrinks as frequency rises.`,
          step2: String.raw`In complex \(j\)-notation, Inductive Reactance points \(+90^\circ\) straight up (\(+jX_L\)), while Capacitive Reactance points \(-90^\circ\) straight down (\(-jX_C\)).`,
          step3: String.raw`<div class="text-center py-2">\[ X_L = 2\pi f L = \omega L \qquad X_C = \frac{1}{2\pi f C} = \frac{1}{\omega C} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>Inductor Complex Impedance: \(Z_L = +jX_L = X_L\angle +90^\circ\,\Omega\).</li>
              <li>Capacitor Complex Impedance: \(Z_C = -jX_C = X_C\angle -90^\circ\,\Omega\).</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> Calculate \(X_L\) and \(X_C\) at \(f = 50\text{ Hz}\) for \(L = 100\text{ mH}\) and \(C = 47\,\mu\text{F}\).<br>
            <strong>Step 0 (Base Units):</strong> \(L = 0.1\text{ H}\), \(C = 47 \times 10^{-6}\text{ F}\).<br>
            <strong>Step 1 (\(X_L\)):</strong> \(X_L = 2\pi (50)(0.1) = 31.42\,\Omega\).<br>
            <strong>Step 2 (\(X_C\)):</strong> \(X_C = \frac{1}{2\pi (50)(47 \times 10^{-6})} = 67.73\,\Omega\).`
        },
        {
          id: "5.3",
          title: "5.3 Series RLC Impedance & AC Current Calculation",
          generator: "gen5_3",
          step1: String.raw`When a resistor \(R\), inductor \(X_L\), and capacitor \(X_C\) are in series, \(+jX_L\) and \(-jX_C\) pull in exact opposite vertical directions! Their net vertical reactance is simply \(X_{\text{net}} = X_L - X_C\).`,
          step2: String.raw`If \(X_L > X_C\), the circuit is net inductive (positive phase angle, current lags voltage—remember <strong>CIVIL</strong>). If \(X_C > X_L\), the circuit is net capacitive (negative phase angle, current leads voltage).`,
          step3: String.raw`<div class="text-center py-2">\[ Z = R + j(X_L - X_C) \qquad |Z| = \sqrt{R^2 + (X_L - X_C)^2} \qquad \theta = \tan^{-1}\left(\frac{X_L - X_C}{R}\right) \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A series circuit has \(R = 40\,\Omega\), \(X_L = 90\,\Omega\), and \(X_C = 60\,\Omega\) connected to a \(200\angle 0^\circ\text{ V}\) supply. Find \(Z\) and current \(I\).<br>
            <strong>Step 1 (Net Reactance):</strong> \(X_{\text{net}} = 90 - 60 = 30\,\Omega\).<br>
            <strong>Step 2 (Polar Impedance):</strong> \(|Z| = \sqrt{40^2 + 30^2} = 50\,\Omega\), \(\theta = \tan^{-1}(30/40) = 36.87^\circ \implies Z = 50\angle 36.87^\circ\,\Omega\).<br>
            <strong>Step 3 (Current):</strong> \(I = \frac{200\angle 0^\circ}{50\angle 36.87^\circ} = 4\angle -36.87^\circ\text{ A}\).`
        },
        {
          id: "5.4",
          title: "5.4 AC Power Triangle (P, Q, S) & Power Factor",
          generator: "gen5_4",
          step1: String.raw`Think of AC power like a glass of beer: <strong>True Power (\(P\), Watts)</strong> is the liquid that actually quenches your thirst (does real mechanical/heat work). <strong>Reactive Power (\(Q\), VAR)</strong> is the foam at the top that sloshes back and forth between source and magnetic fields. <strong>Apparent Power (\(S\), VA)</strong> is the total size of the glass the power company must supply!`,
          step2: String.raw`The ratio \(\text{PF} = \frac{P}{S} = \cos\theta\) is the <strong>Power Factor</strong>. Industrial factories full of induction motors have lagging power factors, so engineers add capacitor banks to cancel \(Q\) and bring \(\cos\theta\) close to \(1.0\).`,
          step3: String.raw`<div class="text-center py-2">\[ S = V_{\text{rms}} I_{\text{rms}}\text{ (VA)} \qquad P = S\cos\theta\text{ (W)} \qquad Q = S\sin\theta\text{ (VAR)} \]</div>
            <div class="text-center py-1">\[ S = \sqrt{P^2 + Q^2} \qquad \text{Power Factor (PF)} = \cos\theta = \frac{P}{S} = \frac{R}{|Z|} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A motor draws \(I = 10\text{ A}\) from a \(V = 230\text{ V}\) supply at a lagging phase angle of \(\theta = 30^\circ\). Find \(S\), \(P\), \(Q\), and Power Factor.<br>
            <strong>Step 1 (Apparent Power \(S\)):</strong> \(S = 230 \times 10 = 2300\text{ VA} = 2.3\text{ kVA}\).<br>
            <strong>Step 2 (Power Factor & True Power \(P\)):</strong> \(\text{PF} = \cos(30^\circ) = 0.866\). \(P = 2300 \times 0.866 = 1991.9\text{ W}\).<br>
            <strong>Step 3 (Reactive Power \(Q\)):</strong> \(Q = 2300 \times \sin(30^\circ) = 1150\text{ VAR}\).`
        }
      ]
    },
    {
      moduleId: "M6",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 6: Matrices, Determinants & Multi-Loop Mesh Analysis",
      moduleDesc: "Matrix algebra, 2x2 and 3x3 determinants, Cramer's Rule, and solving simultaneous Kirchhoff mesh/nodal equations.",
      topics: [
        {
          id: "6.1",
          title: "6.1 Matrix Operations & 2x2 / 3x3 Determinants",
          generator: "gen6_1",
          step1: String.raw`A matrix is an organised grid of numbers representing a system of equations. Its <strong>Determinant (\(\Delta\) or \(\det A\))</strong> is a single scaling number calculated by multiplying the main diagonal (\(a \times d\)) and subtracting the off-diagonal (\(b \times c\)).`,
          step2: String.raw`If the determinant of an impedance matrix is zero (\(\Delta = 0\)), the circuit equations are dependent or have no unique solution. If \(\Delta \neq 0\), we can immediately find every loop current in the circuit!`,
          step3: String.raw`<div class="text-center py-2">\[ A = \begin{pmatrix} a & b \\ c & d \end{pmatrix} \implies \Delta = \det(A) = (a \cdot d) - (b \cdot c) \]</div>
            <div class="text-center py-1">\[ A^{-1} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Find the determinant \(\Delta\) of the mesh resistance matrix \(R = \begin{pmatrix} 8 & -3 \\ -3 & 6 \end{pmatrix}\).<br>
            <strong>Step 1 (Main diagonal \(a \cdot d\)):</strong> \(8 \times 6 = 48\).<br>
            <strong>Step 2 (Subtract off-diagonal \(b \cdot c\)):</strong> \((-3) \times (-3) = +9\).<br>
            <strong>Step 3 (Result):</strong> \(\Delta = 48 - 9 = 39\).`
        },
        {
          id: "6.2",
          title: "6.2 Cramer's Rule for Two-Loop Mesh Current Analysis",
          generator: "gen6_2",
          step1: String.raw`Cramer's Rule is a clean recipe for solving simultaneous circuit equations without messy algebra substitution. To find Loop Current \(I_1\), you simply replace Column 1 of the resistance matrix with the Voltage column, find its determinant \(\Delta_1\), and divide by the main determinant \(\Delta\)!`,
          step2: String.raw`In two-loop bridge and battery-charging circuits, Kirchhoff's Voltage Law produces:
            \(R_{11}I_1 + R_{12}I_2 = V_1\) and \(R_{21}I_1 + R_{22}I_2 = V_2\). Cramer's Rule solves for \(I_1\) and \(I_2\) in three quick determinant steps.`,
          step3: String.raw`<div class="text-center py-2">\[ \begin{pmatrix} R_{11} & R_{12} \\ R_{21} & R_{22} \end{pmatrix} \begin{pmatrix} I_1 \\ I_2 \end{pmatrix} = \begin{pmatrix} V_1 \\ V_2 \end{pmatrix} \]</div>
            <div class="text-center py-1">\[ I_1 = \frac{\Delta_1}{\Delta} = \frac{\det\begin{pmatrix} V_1 & R_{12} \\ V_2 & R_{22} \end{pmatrix}}{\det\begin{pmatrix} R_{11} & R_{12} \\ R_{21} & R_{22} \end{pmatrix}} \qquad I_2 = \frac{\Delta_2}{\Delta} = \frac{\det\begin{pmatrix} R_{11} & V_1 \\ R_{21} & V_2 \end{pmatrix}}{\Delta} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Solve \(5I_1 - 2I_2 = 16\) and \(-2I_1 + 4I_2 = 0\) for \(I_1\).<br>
            <strong>Step 1 (Main Determinant \(\Delta\)):</strong> \(\Delta = (5 \times 4) - (-2 \times -2) = 20 - 4 = 16\).<br>
            <strong>Step 2 (Replace Col 1 with Voltages for \(\Delta_1\)):</strong> \(\Delta_1 = \det\begin{pmatrix} 16 & -2 \\ 0 & 4 \end{pmatrix} = (16 \times 4) - (-2 \times 0) = 64\).<br>
            <strong>Step 3 (Calculate \(I_1\)):</strong> \(I_1 = \frac{64}{16} = 4\text{ A}\).`
        }
      ]
    },
    {
      moduleId: "M7",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 7: Differential Calculus for Electrical Engineers",
      moduleDesc: "Derivatives of polynomials, sinusoids, and exponentials; dynamic v=L(di/dt) & i=C(dv/dt) analysis; and maximum power transfer.",
      topics: [
        {
          id: "7.1",
          title: "7.1 Standard Derivatives (Polynomials, Trig & Exponentials)",
          generator: "gen7_1",
          step1: String.raw`Differentiation measures the instantaneous <strong>rate of change</strong> (steepness/gradient) of a signal at any exact microsecond. For powers of \(t\), you multiply by the power and reduce the power by 1. For \(\sin(\omega t)\) and \(e^{at}\), the chain rule multiplies the front by the inner constant (\(\omega\) or \(a\)).`,
          step2: String.raw`Since AC signals are sine waves and transient signals are exponentials, memorizing the three standard engineering derivatives lets you differentiate any voltage or current waveform on sight.`,
          step3: String.raw`<div class="text-center py-2">\[ \frac{d}{dt}\left(a t^n\right) = a n t^{n-1} \qquad \frac{d}{dt}\left(A e^{kt}\right) = k A e^{kt} \]</div>
            <div class="text-center py-1">\[ \frac{d}{dt}\big(A\sin(\omega t)\big) = \omega A\cos(\omega t) \qquad \frac{d}{dt}\big(A\cos(\omega t)\big) = -\omega A\sin(\omega t) \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Differentiate \(v(t) = 10\sin(50t) + 4t^3\) with respect to time \(t\).<br>
            <strong>Step 1 (Trig term):</strong> \(\frac{d}{dt}[10\sin(50t)] = 50 \times 10\cos(50t) = 500\cos(50t)\).<br>
            <strong>Step 2 (Polynomial term):</strong> \(\frac{d}{dt}[4t^3] = 3 \times 4t^{3-1} = 12t^2\).<br>
            <strong>Result:</strong> \(\frac{dv}{dt} = 500\cos(50t) + 12t^2\).`
        },
        {
          id: "7.2",
          title: "7.2 Dynamic Circuit Rates: Inductor v = L(di/dt) & Capacitor i = C(dv/dt)",
          generator: "gen7_2",
          step1: String.raw`A capacitor only passes current when its voltage is <em>changing</em> (\(i_C = C\frac{dv}{dt}\)). An inductor only generates a back-EMF voltage when its current is <em>changing</em> (\(v_L = L\frac{di}{dt}\)). If voltage or current is steady DC (rate of change = 0), \(i_C = 0\) and \(v_L = 0\)!`,
          step2: String.raw`This is why switching off an inductive motor coil too fast (\(\frac{di}{dt}\) is huge) creates a massive high-voltage spark (\(v_L = L\frac{di}{dt}\)) across switch contacts unless a flyback diode is fitted!`,
          step3: String.raw`<div class="text-center py-2">\[ v_L(t) = L \frac{di}{dt} \qquad i_C(t) = C \frac{dv}{dt} \qquad i(t) = \frac{dq}{dt} \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>Always convert \(L\) (to Henrys) and \(C\) (to Farads) first, differentiate the time expression, then substitute the given time \(t\).</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> The current through a \(L = 50\text{ mH}\) inductor varies as \(i(t) = 3t^2\text{ A}\). Find the induced voltage \(v_L\) at \(t = 4\text{ s}\).<br>
            <strong>Step 0 (Convert Units):</strong> \(L = 50\text{ mH} = 0.05\text{ H}\).<br>
            <strong>Step 1 (Differentiate \(i(t)\)):</strong> \(\frac{di}{dt} = \frac{d}{dt}(3t^2) = 6t\).<br>
            <strong>Step 2 (Evaluate at \(t = 4\text{ s}\)):</strong> \(v_L = L \frac{di}{dt} = 0.05 \times (6 \times 4) = 0.05 \times 24 = 1.2\text{ V}\).`
        },
        {
          id: "7.3",
          title: "7.3 Stationary Points (Maxima/Minima) & Maximum Power Transfer",
          generator: "gen7_3",
          step1: String.raw`At the very peak of a hill (maximum) or the bottom of a valley (minimum), the ground is momentarily flat—meaning the gradient (derivative) equals <strong>zero</strong>! Setting \(\frac{dy}{dx} = 0\) lets engineers find the exact operating point that maximises power or efficiency.`,
          step2: String.raw`By differentiating the load power equation \(P = I^2 R_L = \left(\frac{V_s}{R_s + R_L}\right)^2 R_L\) and setting \(\frac{dP}{dR_L} = 0\), engineers prove the <strong>Maximum Power Transfer Theorem</strong>: maximum power is delivered when load resistance matches source resistance (\(R_L = R_s\)).`,
          step3: String.raw`<div class="text-center py-2">\[ \text{At a Maximum or Minimum Turning Point:} \quad \frac{dy}{dt} = 0 \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li><strong>Second Derivative Test:</strong> If \(\frac{d^2y}{dt^2} < 0\), it is a <strong>Maximum</strong>. If \(\frac{d^2y}{dt^2} > 0\), it is a <strong>Minimum</strong>.</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> The power in a circuit varies with current \(I\) according to \(P(I) = 24I - 3I^2\text{ W}\). Find the current \(I\) that gives maximum power, and state the maximum power.<br>
            <strong>Step 1 (Differentiate & set to 0):</strong> \(\frac{dP}{dI} = 24 - 6I = 0 \implies I = \frac{24}{6} = 4\text{ A}\).<br>
            <strong>Step 2 (Substitute \(I = 4\text{ A}\) into \(P\)):</strong> \(P_{\max} = 24(4) - 3(4^2) = 96 - 48 = 48\text{ W}\).`
        }
      ]
    },
    {
      moduleId: "M8",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 8: Integral Calculus & Waveform Averages",
      moduleDesc: "Indefinite and definite integrals, charge accumulation, capacitor voltage integration, and Mean/RMS waveform calculus.",
      topics: [
        {
          id: "8.1",
          title: "8.1 Indefinite & Definite Integration Rules",
          generator: "gen8_1",
          step1: String.raw`Integration is the exact reverse of differentiation—it sums up tiny slices over time to find the total accumulated amount (the area under a graph). For a power \(t^n\), you <strong>add 1 to the power, then divide by the new power</strong>.`,
          step2: String.raw`An <strong>indefinite integral</strong> includes a constant of integration (\(+C\), representing initial charge or voltage). A <strong>definite integral</strong> \(\int_a^b f(t)\,dt\) computes the exact numerical change between start time \(a\) and end time \(b\).`,
          step3: String.raw`<div class="text-center py-2">\[ \int a t^n\,dt = \frac{a}{n+1}t^{n+1} + C \qquad \int_a^b f(t)\,dt = \Big[ F(t) \Big]_a^b = F(b) - F(a) \]</div>
            <div class="text-center py-1">\[ \int e^{kt}\,dt = \frac{1}{k}e^{kt} + C \qquad \int \sin(\omega t)\,dt = -\frac{1}{\omega}\cos(\omega t) + C \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Evaluate the definite integral \(\int_0^3 6t^2\,dt\).<br>
            <strong>Step 1 (Integrate term):</strong> \(\int 6t^2\,dt = \frac{6}{2+1}t^{2+1} = 2t^3\).<br>
            <strong>Step 2 (Apply Limits \(3\) and \(0\)):</strong> \(\big[ 2t^3 \big]_0^3 = 2(3^3) - 2(0^3) = 2(27) - 0 = 54\).`
        },
        {
          id: "8.2",
          title: "8.2 Charge Accumulation, Energy & Mean/RMS Waveform Integrals",
          generator: "gen8_2",
          step1: String.raw`If water flows into a bucket at a varying rate \(i(t)\), the total water collected between \(t_1\) and \(t_2\) is the integral of flow rate. In electronics, integrating current \(i(t)\) over time gives the total <strong>Electrical Charge \(Q\) (Coulombs)</strong> transferred into a battery or capacitor!`,
          step2: String.raw`Integration also defines the true heating power (<strong>RMS value</strong>) and DC average (<strong>Mean value</strong>) of any arbitrary waveform shape (sawtooth, rectified sine, or pulse train).`,
          step3: String.raw`<div class="text-center py-2">\[ Q = \int_{t_1}^{t_2} i(t)\,dt\text{ (Coulombs)} \qquad v_C(t) = \frac{1}{C}\int i(t)\,dt \]</div>
            <div class="text-center py-1">\[ V_{\text{mean}} = \frac{1}{T}\int_0^T v(t)\,dt \qquad V_{\text{rms}} = \sqrt{\frac{1}{T}\int_0^T \big[v(t)\big]^2\,dt} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A current \(i(t) = 4t\text{ A}\) flows into an initially uncharged capacitor from \(t = 0\text{ s}\) to \(t = 5\text{ s}\). Find the total charge \(Q\) stored.<br>
            <strong>Step 1 (Set up Definite Integral):</strong> \(Q = \int_0^5 4t\,dt\).<br>
            <strong>Step 2 (Integrate & Evaluate):</strong> \(Q = \big[ 2t^2 \big]_0^5 = 2(5^2) - 0 = 50\text{ C}\).`
        }
      ]
    },
    {
      moduleId: "M9",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 9: First-Order Differential Equations & Circuit Transients",
      moduleDesc: "Capacitor (RC) and Inductor (RL) step responses, time constants (τ), and solving transient equations using natural logs.",
      topics: [
        {
          id: "9.1",
          title: "9.1 RC Capacitor Charging & Discharging Transients (τ = RC)",
          generator: "gen9_1",
          step1: String.raw`When you connect a flat capacitor to a battery \(V_s\) through a resistor \(R\), it doesn't fill up instantly. Initially, when the tank is empty, current rushes in fast; as the capacitor fills up, its own voltage pushes back, slowing the charging down along a smooth <strong>exponential curve</strong>.`,
          step2: String.raw`The speed of charging is governed by the <strong>Time Constant \(\tau = R \times C\)</strong> (in seconds). After \(1\tau\), the capacitor reaches \(63.2\%\) of \(V_s\). After \(5\tau\), it is \(99.3\%\) charged (considered fully charged in engineering).`,
          step3: String.raw`<div class="text-center py-2">\[ \tau = R \cdot C \qquad v_C(t)\text{ [Charging]} = V_s\left(1 - e^{-t/\tau}\right) \]</div>
            <div class="text-center py-1">\[ v_C(t)\text{ [Discharging]} = V_0 \, e^{-t/\tau} \qquad i_C(t) = \frac{V_s}{R} e^{-t/\tau} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> An uncharged \(C = 100\,\mu\text{F}\) capacitor is charged through \(R = 20\text{ k}\Omega\) from a \(V_s = 12\text{ V}\) supply. Find \(\tau\) and \(v_C\) at \(t = 2\text{ s}\).<br>
            <strong>Step 0 (Units):</strong> \(\tau = (20 \times 10^3) \times (100 \times 10^{-6}) = 2.0\text{ s}\).<br>
            <strong>Step 1 (Substitute \(t = 2\text{ s}\)):</strong> \[ v_C(2) = 12\left(1 - e^{-2/2}\right) = 12\left(1 - e^{-1}\right) = 12(1 - 0.3679) = 7.59\text{ V} \]`
        },
        {
          id: "9.2",
          title: "9.2 RL Inductor Current Growth & Decay Transients (τ = L/R)",
          generator: "gen9_2",
          step1: String.raw`An inductor acts like a heavy flywheel: when you close a switch, it initially blocks sudden current change, forcing current to grow gradually along \(i_L(t) = I_{\max}(1 - e^{-t/\tau})\). Notice that for an RL circuit, the time constant is \(\tau = \frac{L}{R}\) (more resistance actually speeds up the transient!).`,
          step2: String.raw`Engineers use RL transient equations to calculate how fast relay solenoids pull in, how fuel injectors open, and how motor windings build up magnetic flux.`,
          step3: String.raw`<div class="text-center py-2">\[ \tau = \frac{L}{R}\text{ (seconds)} \qquad I_{\max} = \frac{V_s}{R} \]</div>
            <div class="text-center py-1">\[ i_L(t)\text{ [Growth]} = I_{\max}\left(1 - e^{-t/\tau}\right) \qquad v_L(t) = V_s \, e^{-t/\tau} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A coil with \(L = 400\text{ mH}\) and \(R = 20\,\Omega\) is connected to \(V_s = 40\text{ V}\). Find the time constant \(\tau\), steady-state current \(I_{\max}\), and current at \(t = 20\text{ ms}\).<br>
            <strong>Step 0 (Units):</strong> \(L = 0.4\text{ H}\), \(t = 0.02\text{ s}\).<br>
            <strong>Step 1 (\(\tau\) and \(I_{\max}\)):</strong> \(\tau = \frac{0.4}{20} = 0.02\text{ s} (20\text{ ms})\). \(I_{\max} = \frac{40}{20} = 2\text{ A}\).<br>
            <strong>Step 2 (Current at \(t = \tau\)):</strong> \(i_L(0.02) = 2(1 - e^{-1}) = 2 \times 0.6321 = 1.26\text{ A}\).`
        },
        {
          id: "9.3",
          title: "9.3 Solving Transient Equations for Time (t) Using Natural Logs",
          generator: "gen9_3",
          step1: String.raw`What if you know the target threshold voltage of a timer circuit (e.g. a 555 timer triggers when \(v_C\) reaches \(\frac{2}{3}V_s\)) and need to find the exact <strong>time \(t\)</strong> it takes to get there? Since \(t\) is trapped inside \(e^{-t/\tau}\), we isolate the exponential term and take \(\ln\) of both sides!`,
          step2: String.raw`This transposed natural log formula is the foundation of all RC timing circuits, watchdog delay timers, and pulse-width modulators.`,
          step3: String.raw`<div class="text-center py-2">\[ v_C = V_s\left(1 - e^{-t/\tau}\right) \implies e^{-t/\tau} = 1 - \frac{v_C}{V_s} \]</div>
            <div class="text-center py-1">\[ t = -\tau \ln\left(1 - \frac{v_C}{V_s}\right) \quad \text{[Charging]} \qquad t = -\tau \ln\left(\frac{v_C}{V_0}\right) \quad \text{[Discharging]} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> An RC circuit with \(\tau = 0.5\text{ s}\) charges from \(0\text{ V}\) towards \(V_s = 10\text{ V}\). How long does it take to reach \(v_C = 8\text{ V}\)?<br>
            <strong>Step 1 (Find remaining fraction):</strong> \(1 - \frac{v_C}{V_s} = 1 - \frac{8}{10} = 0.2\).<br>
            <strong>Step 2 (Apply \(-\tau\ln\)):</strong> \[ t = -0.5 \times \ln(0.2) = -0.5 \times (-1.6094) = 0.805\text{ s} \]`
        }
      ]
    },
    {
      moduleId: "M10",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 10: Laplace Transforms & s-Domain Circuit Analysis",
      moduleDesc: "Transforming differential equations into algebraic s-domain models, s-impedances (sL, 1/sC), and inverse transforms via partial fractions.",
      topics: [
        {
          id: "10.1",
          title: "10.1 Forward Laplace Transforms of Standard Signals",
          generator: "gen10_1",
          step1: String.raw`Solving differential equations in the time domain (\(t\)) gets very difficult when a circuit has multiple inductors and capacitors. The <strong>Laplace Transform \(\mathcal{L}\{f(t)\} = F(s)\)</strong> teleports the problem from the time world (\(t\)) into the complex frequency world (\(s\)), turning calculus derivatives into simple algebra multiplication by \(s\)!`,
          step2: String.raw`Engineers use a standard lookup table to transform input signals (DC steps, exponential decays, ramps, and sine waves) directly into \(s\)-domain fractions.`,
          step3: String.raw`<div class="text-center py-2">\[ \mathcal{L}\{A\text{ (DC Step)}\} = \frac{A}{s} \qquad \mathcal{L}\{A t\} = \frac{A}{s^2} \qquad \mathcal{L}\{A e^{-at}\} = \frac{A}{s + a} \]</div>
            <div class="text-center py-1">\[ \mathcal{L}\{A\sin(\omega t)\} = \frac{A\omega}{s^2 + \omega^2} \qquad \mathcal{L}\{A\cos(\omega t)\} = \frac{A s}{s^2 + \omega^2} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Find the Laplace transform \(V(s)\) of the signal \(v(t) = 12 + 5e^{-3t}\).<br>
            <strong>Step 1 (Transform DC step \(12\)):</strong> \(\mathcal{L}\{12\} = \frac{12}{s}\).<br>
            <strong>Step 2 (Transform exponential \(5e^{-3t}\)):</strong> \(\mathcal{L}\{5e^{-3t}\} = \frac{5}{s + 3}\).<br>
            <strong>Result:</strong> \(V(s) = \frac{12}{s} + \frac{5}{s + 3}\).`
        },
        {
          id: "10.2",
          title: "10.2 s-Domain Impedances (R, sL, 1/sC) & Transfer Functions",
          generator: "gen10_2",
          step1: String.raw`Once inside the \(s\)-domain, resistors, inductors, and capacitors all behave like simple algebraic resistors! A resistor stays \(R\), an inductor becomes \(sL\), and a capacitor becomes \(\frac{1}{sC}\).`,
          step2: String.raw`You can apply Ohm's Law (\(V(s) = I(s) Z(s)\)) and voltage dividers directly in the \(s\)-domain to find a circuit's <strong>Transfer Function \(H(s) = \frac{V_{\text{out}}(s)}{V_{\text{in}}(s)}\)</strong>.`,
          step3: String.raw`<div class="text-center py-2">\[ Z_R(s) = R \qquad Z_L(s) = sL \qquad Z_C(s) = \frac{1}{sC} \]</div>
            <div class="text-center py-1">\[ Z_{\text{series}}(s) = R + sL + \frac{1}{sC} \qquad I(s) = \frac{V(s)}{Z(s)} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A series RL circuit with \(R = 10\,\Omega\) and \(L = 2\text{ H}\) is connected to a DC step voltage of \(V_s = 20\text{ V}\) at \(t = 0\). Find the \(s\)-domain current \(I(s)\).<br>
            <strong>Step 1 (Transform Source & Impedance):</strong> \(V(s) = \frac{20}{s}\), \(Z(s) = R + sL = 10 + 2s\).<br>
            <strong>Step 2 (Apply Ohm's Law in \(s\)-domain):</strong> \[ I(s) = \frac{V(s)}{Z(s)} = \frac{20/s}{2s + 10} = \frac{20}{s(2s + 10)} = \frac{10}{s(s + 5)} \]`
        },
        {
          id: "10.3",
          title: "10.3 Partial Fractions & Inverse Laplace Transforms",
          generator: "gen10_3",
          step1: String.raw`Once you have solved for \(I(s)\) in the \(s\)-domain (such as \(I(s) = \frac{10}{s(s+5)}\)), you need to translate it back into real time \(i(t)\) using the <strong>Inverse Laplace Transform \(\mathcal{L}^{-1}\)</strong>. By splitting a combined fraction into two simple <strong>Partial Fractions</strong> \(\frac{A}{s} + \frac{B}{s+5}\), each piece matches our standard table!`,
          step2: String.raw`The <strong>Cover-Up Rule</strong> makes finding \(A\) and \(B\) effortless: to find \(A\) (over \(s\)), cover up \(s\) in the original denominator and plug in \(s = 0\). To find \(B\) (over \(s+a\)), cover up \((s+a)\) and plug in \(s = -a\).`,
          step3: String.raw`<div class="text-center py-2">\[ \frac{K}{s(s + a)} = \frac{A}{s} + \frac{B}{s + a} = \frac{K/a}{s} - \frac{K/a}{s + a} \]</div>
            <div class="text-center py-1">\[ \mathcal{L}^{-1}\left\{\frac{A}{s} - \frac{A}{s + a}\right\} = A\left(1 - e^{-at}\right) \]</div>`,
          step4: String.raw`<strong>Problem:</strong> Find the inverse Laplace transform \(i(t)\) of \(I(s) = \frac{15}{s(s + 3)}\).<br>
            <strong>Step 1 (Partial Fractions via Cover-Up Rule):</strong><br>
            For \(s = 0\): \(A = \frac{15}{0 + 3} = 5\). For \(s = -3\): \(B = \frac{15}{-3} = -5\).<br>
            <strong>Step 2 (Inverse Transform):</strong> \[ I(s) = \frac{5}{s} - \frac{5}{s + 3} \xrightarrow{\mathcal{L}^{-1}} i(t) = 5 - 5e^{-3t} = 5\left(1 - e^{-3t}\right)\text{ A} \]`
        }
      ]
    },
    {
      moduleId: "M11",
      levelCode: "L4",
      levelLabel: "L4 HNC Electrical",
      badgeClass: "bg-purple-600 text-white",
      moduleTitle: "Module 11: Fourier Series & Harmonic Waveform Analysis",
      moduleDesc: "Deconstructing square, sawtooth, and distorted power waveforms into DC offsets, fundamentals, odd/even harmonics, and THD.",
      topics: [
        {
          id: "11.1",
          title: "11.1 Fundamental Frequency, Harmonics & Symmetry Rules",
          generator: "gen11_1",
          step1: String.raw`Joseph Fourier discovered something remarkable: <em>any</em> repeating waveform—even a sharp square wave or jagged sawtooth wave—is actually built by adding together pure sine waves! The slowest sine wave matches the wave's repetition rate (the <strong>1st Harmonic / Fundamental \(f_1\)</strong>), while faster multiples (\(2f_1, 3f_1, 5f_1\dots\)) sharpen the corners.`,
          step2: String.raw`Switch-mode power supplies, variable speed motor drives, and LED dimmers draw non-sinusoidal currents that inject <strong>3rd, 5th, and 7th harmonics</strong> into the mains grid. Engineers use Fourier analysis to design harmonic filters and prevent neutral cables from overheating.`,
          step3: String.raw`<div class="text-center py-2">\[ f_n = n \cdot f_1 \qquad \omega_n = n \cdot \omega_1 = 2\pi n f_1 \]</div>
            <ul class="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li><strong>DC Component (\(a_0\)):</strong> The mean (average) height of the waveform over one full cycle.</li>
              <li><strong>Half-Wave Symmetric Waveforms (Square & Triangle waves):</strong> Contain <strong>ONLY ODD Harmonics</strong> (\(n = 1, 3, 5, 7\dots\)).</li>
            </ul>`,
          step4: String.raw`<strong>Problem:</strong> A square-wave inverter operates at a fundamental frequency of \(f_1 = 50\text{ Hz}\). Find the frequencies of its first three harmonic components above the fundamental.<br>
            <strong>Step 1 (Identify Symmetry):</strong> A symmetrical square wave contains only odd harmonics (\(n = 3, 5, 7\)).<br>
            <strong>Step 2 (Calculate Frequencies):</strong> \(f_3 = 3 \times 50 = 150\text{ Hz}\), \(f_5 = 5 \times 50 = 250\text{ Hz}\), \(f_7 = 7 \times 50 = 350\text{ Hz}\).`
        },
        {
          id: "11.2",
          title: "11.2 Square Wave Fourier Series & Harmonic RMS / THD",
          generator: "gen11_2",
          step1: String.raw`For a symmetrical square wave switching between \(+V\) and \(-V\), the Fourier recipe shows that the fundamental sine wave actually has a peak amplitude of \(\frac{4V}{\pi}\) (about \(1.273 V\)), the 3rd harmonic has \(\frac{1}{3}\) of that amplitude, the 5th harmonic has \(\frac{1}{5}\), and so on!`,
          step2: String.raw`To find the total RMS value of a distorted waveform containing harmonics, you square-root the sum of the squares of each harmonic's RMS value. <strong>Total Harmonic Distortion (THD)</strong> measures how much of the wave's energy is wasted in harmonics compared to the fundamental.`,
          step3: String.raw`<div class="text-center py-2">\[ v_{\text{square}}(t) = \frac{4V}{\pi}\left(\sin(\omega t) + \frac{1}{3}\sin(3\omega t) + \frac{1}{5}\sin(5\omega t) + \dots\right) \]</div>
            <div class="text-center py-1">\[ b_n\text{ (Odd } n\text{)} = \frac{4V}{n\pi} \qquad V_{\text{rms}} = \sqrt{V_0^2 + V_{1\text{rms}}^2 + V_{3\text{rms}}^2 + V_{5\text{rms}}^2 + \dots} \]</div>`,
          step4: String.raw`<strong>Problem:</strong> A symmetrical square wave has amplitude \(V = 100\text{ V}\). Calculate the peak amplitude of its fundamental (\(b_1\)) and 3rd harmonic (\(b_3\)).<br>
            <strong>Step 1 (Fundamental \(n = 1\)):</strong> \(b_1 = \frac{4 \times 100}{1 \times \pi} = \frac{400}{\pi} = 127.32\text{ V}\).<br>
            <strong>Step 2 (3rd Harmonic \(n = 3\)):</strong> \(b_3 = \frac{4 \times 100}{3 \times \pi} = \frac{127.32}{3} = 42.44\text{ V}\).`
        }
      ]
    }
  ];

  // =========================================================================
  // EXPORTED GETTERS & AUTO-BINDINGS
  // =========================================================================
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
          badgeClass: m.badgeClass,
          generateQuestion: function (idx) {
            return buildSingleQuestion(t.generator, idx);
          }
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
