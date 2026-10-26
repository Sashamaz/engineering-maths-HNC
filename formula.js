/**
 * formula.js - Master Electrical Engineering Formulary Modal & Database
 * Comprehensive reference for Level 3 Bridging (L3E-B1) and Level 4 HNC Electrical
 */
const FormulasModule = (function () {
  let activeFilter = 'all';
  let searchTerm = '';

  const formulaDatabase = [
    // =========================================================================
    // LEVEL 3 BRIDGING (L3E-B1)
    // =========================================================================
    {
      id: "ohm_power",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Ohm's Law & DC Electrical Power",
      description: "Fundamental relationship between voltage, current, and resistance in DC circuits, and the thermal power dissipated across resistive components.",
      formulaLatex: String.raw`V = I \times R \qquad P = V \times I = I^2 R = \frac{V^2}{R}`,
      symbols: [
        { sym: "V", name: "Potential Difference (Voltage)", unit: "Volts (V)" },
        { sym: "I", name: "Electric Current", unit: "Amperes / Amps (A)" },
        { sym: "R", name: "Electrical Resistance", unit: "Ohms (\\Omega)" },
        { sym: "P", name: "Electrical Power Dissipated", unit: "Watts (W)" }
      ]
    },
    {
      id: "resistivity",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Conductor Resistance & Material Resistivity",
      description: "Calculates the DC resistance of a cable run based on conductor length, cross-sectional area, and material resistivity.",
      formulaLatex: String.raw`R = \frac{\rho \cdot l}{A} \iff l = \frac{R \cdot A}{\rho} \iff A = \frac{\rho \cdot l}{R}`,
      symbols: [
        { sym: "R", name: "Cable Resistance", unit: "Ohms (\\Omega)" },
        { sym: "\\rho", name: "Material Resistivity (e.g. Copper: 1.72 \\times 10^{-8})", unit: "Ohm-metres (\\Omega\\cdot m)" },
        { sym: "l", name: "Conductor Length", unit: "Metres (m)" },
        { sym: "A", name: "Cross-Sectional Area (\\pi r^2)", unit: "Square metres (m^2)" }
      ]
    },
    {
      id: "series_parallel_r",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Series & Parallel Resistor Combinations",
      description: "Determines the single equivalent resistance of multiple components wired in series loops or parallel branch junctions.",
      formulaLatex: String.raw`R_{\text{series}} = R_1 + R_2 + \dots \qquad \frac{1}{R_{\text{parallel}}} = \frac{1}{R_1} + \frac{1}{R_2} \implies R_T = \frac{R_1 R_2}{R_1 + R_2}`,
      symbols: [
        { sym: "R_{\\text{series}}", name: "Total Equivalent Series Resistance", unit: "Ohms (\\Omega)" },
        { sym: "R_{\\text{parallel}}", name: "Total Equivalent Parallel Resistance", unit: "Ohms (\\Omega)" },
        { sym: "R_1, R_2", name: "Individual Branch Resistors", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "res_freq",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "LC Resonant Frequency & Transposed Forms",
      description: "Calculates the frequency where inductive and capacitive reactances cancel out, and transposed forms to size tuning components.",
      formulaLatex: String.raw`f_r = \frac{1}{2\pi\sqrt{L C}} \qquad C = \frac{1}{4\pi^2 f_r^2 L} \qquad L = \frac{1}{4\pi^2 f_r^2 C}`,
      symbols: [
        { sym: "f_r", name: "Resonant Frequency", unit: "Hertz (Hz)" },
        { sym: "L", name: "Circuit Inductance", unit: "Henrys (H)" },
        { sym: "C", name: "Circuit Capacitance", unit: "Farads (F)" },
        { sym: "\\pi", name: "Mathematical Constant", unit: "\\approx 3.14159" }
      ]
    },
    {
      id: "decibels",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Decibel (dB) Gain & Attenuation Ratios",
      description: "Logarithmic scale used to quantify amplification boost, cable signal attenuation, and filter frequency responses.",
      formulaLatex: String.raw`G_{\text{dB(Power)}} = 10\log_{10}\left(\frac{P_2}{P_1}\right) \qquad G_{\text{dB(Voltage)}} = 20\log_{10}\left(\frac{V_2}{V_1}\right)`,
      symbols: [
        { sym: "G_{\\text{dB}}", name: "Gain / Loss in Decibels (+3dB = double power)", unit: "Decibels (dB)" },
        { sym: "P_1, P_2", name: "Input Power / Output Power", unit: "Watts (W)" },
        { sym: "V_1, V_2", name: "Input Voltage / Output Voltage", unit: "Volts (V)" }
      ]
    },
    {
      id: "ac_waveforms",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Sinusoidal AC Waveforms & Angular Velocity",
      description: "Represents alternating current instantaneous snapshots, cycle timing, and effective thermal heating (RMS) values.",
      formulaLatex: String.raw`\omega = 2\pi f = \frac{2\pi}{T} \qquad v(t) = V_m \sin(\omega t \pm \phi) \qquad V_{\text{rms}} = \frac{V_m}{\sqrt{2}} \approx 0.707 V_m`,
      symbols: [
        { sym: "\\omega", name: "Angular Velocity / Angular Frequency", unit: "Radians per second (rad/s)" },
        { sym: "f", name: "Frequency (UK Mains = 50 Hz)", unit: "Hertz (Hz)" },
        { sym: "T", name: "Periodic Time (T = 1/f)", unit: "Seconds (s)" },
        { sym: "V_m", name: "Peak Maximum Amplitude", unit: "Volts (V)" },
        { sym: "\\phi", name: "Phase Shift Angle", unit: "Radians (rad) or Degrees (^\\circ)" },
        { sym: "V_{\\text{rms}}", name: "Root-Mean-Square Effective Voltage", unit: "Volts (V)" }
      ]
    },

    // =========================================================================
    // LEVEL 4 HNC ELECTRICAL & ELECTRONIC ENGINEERING
    // =========================================================================
    {
      id: "reactance_impedance",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Reactance & AC Complex Impedance (Z = R + jX)",
      description: "Frequency-dependent opposition to AC current in inductors and capacitors, combined into rectangular and polar vectors.",
      formulaLatex: String.raw`X_L = 2\pi f L \qquad X_C = \frac{1}{2\pi f C} \qquad Z = R + j(X_L - X_C) = |Z|\angle\theta`,
      symbols: [
        { sym: "X_L", name: "Inductive Reactance (leads by +90°)", unit: "Ohms (\\Omega)" },
        { sym: "X_C", name: "Capacitive Reactance (lags by -90°)", unit: "Ohms (\\Omega)" },
        { sym: "Z", name: "Total AC Complex Impedance", unit: "Ohms (\\Omega)" },
        { sym: "j", name: "Imaginary Unit Operator (\\sqrt{-1})", unit: "90^\\circ\\text{ rotation}" },
        { sym: "|Z|", name: "Impedance Magnitude: \\sqrt{R^2 + (X_L - X_C)^2}", unit: "Ohms (\\Omega)" },
        { sym: "\\theta", name: "Phase Angle: \\tan^{-1}\\left(\\frac{X_L - X_C}{R}\\right)", unit: "Degrees (^\\circ)" }
      ]
    },
    {
      id: "power_triangle",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "AC Power Triangle & Power Factor",
      description: "Decomposes total supplied AC power into useful work (True Power), magnetic/electrostatic storage (Reactive Power), and total load demand (Apparent Power).",
      formulaLatex: String.raw`S = V I \quad P = S\cos\theta \quad Q = S\sin\theta \quad S = \sqrt{P^2 + Q^2} \quad \text{PF} = \cos\theta = \frac{P}{S}`,
      symbols: [
        { sym: "S", name: "Apparent Power (total grid capacity)", unit: "Volt-Amperes (VA)" },
        { sym: "P", name: "True / Active Power (converted to heat/work)", unit: "Watts (W)" },
        { sym: "Q", name: "Reactive Power (sloshing magnetic energy)", unit: "Volt-Amps Reactive (VAR)" },
        { sym: "\\text{PF}", name: "Power Factor (\\cos\\theta = R / |Z|)", unit: "Ratio (0.0 to 1.0)" }
      ]
    },
    {
      id: "mesh_cramer",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "2x2 Matrix Determinants & Cramer's Rule",
      description: "Direct solution for simultaneous Kirchhoff mesh and nodal equations without manual algebraic substitution.",
      formulaLatex: String.raw`\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc \qquad I_1 = \frac{\Delta_1}{\Delta} = \frac{\det\begin{pmatrix} V_1 & R_{12} \\ V_2 & R_{22} \end{pmatrix}}{\det\begin{pmatrix} R_{11} & R_{12} \\ R_{21} & R_{22} \end{pmatrix}}`,
      symbols: [
        { sym: "\\Delta", name: "Main System Determinant (must be \\neq 0)", unit: "Scalar" },
        { sym: "\\Delta_1, \\Delta_2", name: "Determinants with voltage vector inserted", unit: "Scalar" },
        { sym: "I_1, I_2", name: "Independent Loop Mesh Currents", unit: "Amperes (A)" },
        { sym: "R_{11}, R_{22}", name: "Self-Loop Resistances", unit: "Ohms (\\Omega)" },
        { sym: "R_{12}, R_{21}", name: "Mutual / Shared Branch Resistances", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "calculus_dynamic",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Dynamic Circuit Rates & Maximum Power",
      description: "Defines inductor back-EMF, capacitor charging current, and stationary turning points for maximum power transfer.",
      formulaLatex: String.raw`v_L(t) = L\frac{di}{dt} \qquad i_C(t) = C\frac{dv}{dt} \qquad \text{Max Power: } \frac{dP}{dR_L} = 0 \implies R_L = R_s`,
      symbols: [
        { sym: "v_L", name: "Induced Back-EMF Voltage across Coil", unit: "Volts (V)" },
        { sym: "i_C", name: "Capacitive Displacement Current", unit: "Amperes (A)" },
        { sym: "di/dt", name: "Current Rate of Change", unit: "Amps per second (A/s)" },
        { sym: "dv/dt", name: "Voltage Rate of Change", unit: "Volts per second (V/s)" },
        { sym: "R_L = R_s", name: "Maximum Power Transfer Condition", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "integration_averages",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Charge Accumulation & Waveform Calculus",
      description: "Definite integrals used to calculate stored electrostatic charge and mathematical mean and RMS heating values of arbitrary waveforms.",
      formulaLatex: String.raw`Q = \int_{t_1}^{t_2} i(t)\,dt \qquad V_{\text{mean}} = \frac{1}{T}\int_0^T v(t)\,dt \qquad V_{\text{rms}} = \sqrt{\frac{1}{T}\int_0^T [v(t)]^2\,dt}`,
      symbols: [
        { sym: "Q", name: "Accumulated Electrical Charge (Q = C \\cdot V)", unit: "Coulombs (C)" },
        { sym: "V_{\\text{mean}}", name: "Average / DC Component over Period T", unit: "Volts (V)" },
        { sym: "V_{\\text{rms}}", name: "Root-Mean-Square Heating Equivalent", unit: "Volts (V)" },
        { sym: "T", name: "Full Cycle Period", unit: "Seconds (s)" }
      ]
    },
    {
      id: "transients",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "First-Order RC & RL Transients (Charging & Discharging)",
      description: "Exponential growth and decay curves governing voltage and current step responses in capacitive and inductive networks.",
      formulaLatex: String.raw`\tau_{RC} = R C \quad \tau_{RL} = \frac{L}{R} \quad v_C(t) = V_s(1 - e^{-t/\tau}) \quad t = -\tau\ln\left(1 - \frac{v_C}{V_s}\right)`,
      symbols: [
        { sym: "\\tau", name: "Time Constant (1\\tau = 63.2%, 5\\tau = 99.3%)", unit: "Seconds (s)" },
        { sym: "V_s", name: "DC Step Voltage Source", unit: "Volts (V)" },
        { sym: "v_C(t)", name: "Instantaneous Voltage at Time t", unit: "Volts (V)" },
        { sym: "e", name: "Euler's Natural Base", unit: "\\approx 2.71828" },
        { sym: "t", name: "Elapsed Time since Switch Operation", unit: "Seconds (s)" }
      ]
    },
    {
      id: "laplace",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Laplace Transform Pairs & s-Domain Impedances",
      description: "Converts differential equations into algebraic fractions using the complex frequency variable s = \\sigma + j\\omega.",
      formulaLatex: String.raw`\mathcal{L}\{1\} = \frac{1}{s} \quad \mathcal{L}\{e^{-at}\} = \frac{1}{s+a} \quad Z_R(s) = R \quad Z_L(s) = sL \quad Z_C(s) = \frac{1}{sC}`,
      symbols: [
        { sym: "s", name: "Complex Frequency Parameter (\\sigma + j\\omega)", unit: "rad/s" },
        { sym: "\\mathcal{L}\\{f(t)\\}", name: "Forward Laplace Transform", unit: "s-domain" },
        { sym: "Z_L(s) = sL", name: "Inductor Impedance in s-domain", unit: "Ohms (\\Omega)" },
        { sym: "Z_C(s) = 1/sC", name: "Capacitor Impedance in s-domain", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "fourier",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Fourier Series, Harmonic Spectra & THD",
      description: "Deconstructs non-sinusoidal periodic waveforms into fundamental and harmonic multiples, and measures Total Harmonic Distortion.",
      formulaLatex: String.raw`v(t) = a_0 + \sum_{n=1}^\infty \Big(a_n\cos(n\omega t) + b_n\sin(n\omega t)\Big) \qquad \text{THD} = \frac{\sqrt{V_2^2 + V_3^2 + \dots}}{V_1} \times 100\%`,
      symbols: [
        { sym: "a_0", name: "DC Component / Average Height", unit: "Volts (V)" },
        { sym: "b_n", name: "Sine Harmonic Amplitude (Square wave: \\frac{4V}{n\\pi})", unit: "Volts (V)" },
        { sym: "n", name: "Harmonic Order (Odd n = 1, 3, 5...)", unit: "Integer" },
        { sym: "\\text{THD}", name: "Total Harmonic Distortion", unit: "Percentage (%)" }
      ]
    }
  ];

  function openModal() {
    activeFilter = 'all';
    searchTerm = '';
    renderModalHtml();
  }

  function closeModal() {
    const modal = document.getElementById('formulas-modal');
    if (modal) modal.classList.add('hidden');
  }

  function setFilter(filter) {
    activeFilter = filter;
    renderModalList();
  }

  function setSearch(term) {
    searchTerm = (term || '').toLowerCase().trim();
    renderModalList();
  }

  function renderModalHtml() {
    const modal = document.getElementById('formulas-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        <!-- MODAL HEADER -->
        <div class="p-4 sm:p-5 border-b border-slate-800 bg-slate-900 sticky top-0 z-20 space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>📐</span> Master Engineering Formulary
            </h3>
            <button onclick="FormulasModule.closeModal()" class="text-slate-400 hover:text-white text-2xl font-bold leading-none p-1">&times;</button>
          </div>

          <!-- SEARCH & LEVEL FILTER BAR -->
          <div class="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pt-1">
            <div class="relative flex-grow">
              <input 
                type="text" 
                id="formula-search-input"
                placeholder="Search formulas, letters (e.g. XL, resonance, transient)..."
                oninput="FormulasModule.setSearch(this.value)"
                class="w-full bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button onclick="FormulasModule.setFilter('all')" id="f-filter-all" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white">All</button>
              <button onclick="FormulasModule.setFilter('L3')" id="f-filter-L3" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-blue-400 border border-blue-500/30 hover:bg-slate-700">L3 Bridging</button>
              <button onclick="FormulasModule.setFilter('L4')" id="f-filter-L4" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-purple-400 border border-purple-500/30 hover:bg-slate-700">L4 HNC</button>
            </div>
          </div>
        </div>

        <!-- FORMULA LIST CONTAINER -->
        <div class="p-4 sm:p-6 overflow-y-auto space-y-5 flex-grow" id="formula-cards-container"></div>

        <!-- FOOTER -->
        <div class="p-3.5 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span id="formula-count-text">Showing formulas</span>
          <button onclick="FormulasModule.closeModal()" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition">Close Formulary</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    renderModalList();
  }

  function renderModalList() {
    const container = document.getElementById('formula-cards-container');
    const countText = document.getElementById('formula-count-text');
    if (!container) return;

    ['all', 'L3', 'L4'].forEach(code => {
      const btn = document.getElementById(`f-filter-${code}`);
      if (btn) {
        btn.className = (code === activeFilter)
          ? 'px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white'
          : 'px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700';
      }
    });

    const filtered = formulaDatabase.filter(item => {
      const matchesLevel = (activeFilter === 'all' || item.levelCode === activeFilter);
      if (!matchesLevel) return false;
      if (!searchTerm) return true;

      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const descMatch = item.description.toLowerCase().includes(searchTerm);
      const latexMatch = item.formulaLatex.toLowerCase().includes(searchTerm);
      const symbolMatch = item.symbols.some(s => 
        s.sym.toLowerCase().includes(searchTerm) || 
        s.name.toLowerCase().includes(searchTerm) ||
        s.unit.toLowerCase().includes(searchTerm)
      );

      return titleMatch || descMatch || latexMatch || symbolMatch;
    });

    if (countText) {
      countText.innerText = `Showing ${filtered.length} of ${formulaDatabase.length} master formulas`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400 space-y-2">
          <p class="text-base font-bold text-slate-300">No matching formulas found</p>
          <p class="text-xs">Try searching for a different keyword or switch to "All".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-md">
        <!-- Title & Level Badge -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
          <h4 class="text-sm sm:text-base font-extrabold text-white">${item.title}</h4>
          <span class="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.badgeClass}">${item.level}</span>
        </div>

        <!-- Description -->
        <p class="text-xs text-slate-300 leading-relaxed">${item.description}</p>

        <!-- LaTeX Formula Box -->
        <div class="chalkboard p-3.5 rounded-lg text-amber-300 text-center font-mono overflow-x-auto text-sm sm:text-base">
          \\[ ${item.formulaLatex} \\]
        </div>

        <!-- Symbols & Units Breakdown -->
        <div class="space-y-1.5 pt-1">
          <div class="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
            <span>📖</span> Symbols, Quantities & SI Units:
          </div>
          <div class="grid gap-1.5 sm:grid-cols-2 text-xs">
            ${item.symbols.map(s => `
              <div class="bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1.5 flex items-start gap-2">
                <span class="font-mono text-emerald-400 font-bold shrink-0 min-w-[28px]">\\(${s.sym}\\)</span>
                <span class="text-slate-300">= ${s.name} <span class="text-slate-400 font-medium">(${s.unit})</span></span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // Trigger KaTeX rendering on the container
    if (window.App && typeof window.App.renderMath === 'function') {
      window.App.renderMath(container);
    } else if (window.renderMathInElement) {
      renderMathInElement(container, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }
  }

  return {
    openModal,
    closeModal,
    setFilter,
    setSearch
  };
})();
