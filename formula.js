/**
 * formula.js - Master Electrical Engineering Formulary Modal & Database
 */
const FormulasModule = (function () {
  const formulaCategories = [
    {
      level: "L3 Bridging",
      color: "text-blue-400",
      title: "DC Analysis & Cable Resistivity",
      equations: [
        String.raw`V = IR, \quad P = VI = I^2R = \frac{V^2}{R}`,
        String.raw`R = \frac{\rho l}{A}, \quad R_T = R_1 + R_2, \quad \frac{1}{R_T} = \frac{1}{R_1} + \frac{1}{R_2}`
      ]
    },
    {
      level: "L3 Bridging",
      color: "text-blue-400",
      title: "Resonance, Waveforms & Decibels",
      equations: [
        String.raw`f_r = \frac{1}{2\pi\sqrt{LC}}, \quad L = \frac{1}{4\pi^2 f_r^2 C}, \quad C = \frac{1}{4\pi^2 f_r^2 L}`,
        String.raw`\omega = 2\pi f = \frac{2\pi}{T}, \quad v(t) = V_m \sin(\omega t \pm \phi)`,
        String.raw`G_{\text{dB}} = 10\log_{10}\left(\frac{P_2}{P_1}\right) = 20\log_{10}\left(\frac{V_2}{V_1}\right)`
      ]
    },
    {
      level: "L4 HNC",
      color: "text-purple-400",
      title: "AC Impedance, Phasors & Power Triangle",
      equations: [
        String.raw`X_L = 2\pi f L, \quad X_C = \frac{1}{2\pi f C}, \quad Z = R + j(X_L - X_C)`,
        String.raw`|Z| = \sqrt{R^2 + X^2}, \quad \theta = \tan^{-1}\left(\frac{X}{R}\right), \quad \text{PF} = \cos\theta = \frac{P}{S}`,
        String.raw`S = VI\text{ (VA)}, \quad P = S\cos\theta\text{ (W)}, \quad Q = S\sin\theta\text{ (VAR)}`
      ]
    },
    {
      level: "L4 HNC",
      color: "text-purple-400",
      title: "Calculus, Transients & Frequency Domain",
      equations: [
        String.raw`v_L(t) = L\frac{di}{dt}, \quad i_C(t) = C\frac{dv}{dt}, \quad q = \int i\,dt`,
        String.raw`v_C(t) = V_s(1 - e^{-t/RC}), \quad i_L(t) = \frac{V_s}{R}(1 - e^{-Rt/L})`,
        String.raw`\mathcal{L}\{1\} = \frac{1}{s}, \quad \mathcal{L}\{e^{-at}\} = \frac{1}{s+a}, \quad Z_L(s) = sL, \quad Z_C(s) = \frac{1}{sC}`
      ]
    }
  ];

  function openModal() {
    const modal = document.getElementById('formulas-modal');
    modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3 sticky top-0 bg-slate-900 z-10">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>📐</span> Master Engineering Formulary
          </h3>
          <button onclick="FormulasModule.closeModal()" class="text-slate-400 hover:text-white text-2xl font-bold">&times;</button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 text-xs text-slate-300">
          ${formulaCategories.map(cat => `
            <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
              <span class="${cat.color} font-bold uppercase">[${cat.level}] ${cat.title}</span>
              ${cat.equations.map(eq => `<div class="py-0.5">\\[ ${eq} \\]</div>`).join('')}
            </div>
          `).join('')}
        </div>

        <div class="text-right">
          <button onclick="FormulasModule.closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg">Close</button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    if (window.App) window.App.renderMath(modal);
  }

  function closeModal() {
    document.getElementById('formulas-modal').classList.add('hidden');
  }

  return {
    openModal,
    closeModal
  };
})();