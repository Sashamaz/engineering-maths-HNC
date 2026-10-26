/**
 * formula.js - Self-Contained Master Engineering Formulary
 * 
 * Completely self-contained:
 * - Injects its own modal into the page automatically
 * - Handles both openFormulasModal() and FormulasModule.openModal()
 * - Full plain-English explanations and symbol/unit breakdowns
 * - Live keyword search and Level (L3 / L4) filtering
 * - Reliable KaTeX math rendering with String.raw
 */
const FormulasModule = (function () {
  let activeFilter = 'all';
  let searchTerm = '';

  // =========================================================================
  // COMPREHENSIVE FORMULARY DATABASE (L3 BRIDGING & L4 HNC ELECTRICAL)
  // =========================================================================
  const formulaDatabase = [
    // --- LEVEL 3 BRIDGING (L3E-B1) ---
    {
      id: "ohm_power",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Ohm's Law & DC Electrical Power",
      description: "Relates electrical pressure (Voltage) to the flow rate of charge (Current) and physical opposition (Resistance). Power represents the rate at which electrical energy is converted into heat or work.",
      formulaLatex: String.raw`V = I \times R \qquad P = V \times I = I^2 R = \frac{V^2}{R}`,
      symbols: [
        { sym: "V", name: "Potential Difference (Voltage)", unit: "Volts (V)" },
        { sym: "I", name: "Electric Current Flow", unit: "Amperes / Amps (A)" },
        { sym: "R", name: "Resistance to Current Flow", unit: "Ohms (\\Omega)" },
        { sym: "P", name: "Thermal Power Dissipation", unit: "Watts (W)" }
      ]
    },
    {
      id: "resistivity",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Conductor Resistance & Cable Resistivity",
      description: "Calculates the physical DC resistance of any wire or busbar based on its length, cross-sectional area, and the material's specific electrical resistivity.",
      formulaLatex: String.raw`R = \frac{\rho \cdot l}{A} \iff l = \frac{R \cdot A}{\rho} \iff A = \frac{\rho \cdot l}{R}`,
      symbols: [
        { sym: "R", name: "Total Conductor Resistance", unit: "Ohms (\\Omega)" },
        { sym: "\\rho", name: "Material Resistivity (Copper = 1.72 \\times 10^{-8})", unit: "Ohm-metres (\\Omega\\cdot m)" },
        { sym: "l", name: "Length of Conductor Run", unit: "Metres (m)" },
        { sym: "A", name: "Cross-Sectional Area (A = \\pi r^2 = \\frac{\\pi d^2}{4})", unit: "Square metres (m^2)" }
      ]
    },
    {
      id: "series_parallel_r",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Series & Parallel Equivalent Resistance",
      description: "Rules for combining multiple resistors into a single equivalent value. Series resistances add directly; parallel branches provide alternative current paths, lowering total resistance.",
      formulaLatex: String.raw`R_{\text{series}} = R_1 + R_2 + \dots \qquad \frac{1}{R_{\text{parallel}}} = \frac{1}{R_1} + \frac{1}{R_2} \implies R_T = \frac{R_1 R_2}{R_1 + R_2}`,
      symbols: [
        { sym: "R_{\\text{series}}", name: "Total Equivalent Series Resistance", unit: "Ohms (\\Omega)" },
        { sym: "R_{\\text{parallel}}", name: "Total Equivalent Parallel Resistance", unit: "Ohms (\\Omega)" },
        { sym: "R_1, R_2", name: "Individual Branch / Loop Resistors", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "res_freq",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "LC Resonant Frequency & Transposed Sizing",
      description: "The exact frequency where an inductor's opposition (+jXL) balances a capacitor's opposition (-jXC). The transposed forms are used to size tuning capacitors or inductors for filter circuits.",
      formulaLatex: String.raw`f_r = \frac{1}{2\pi\sqrt{L C}} \qquad C = \frac{1}{4\pi^2 f_r^2 L} \qquad L = \frac{1}{4\pi^2 f_r^2 C}`,
      symbols: [
        { sym: "f_r", name: "Resonant Frequency", unit: "Hertz (Hz)" },
        { sym: "L", name: "Coil Inductance", unit: "Henrys (H)" },
        { sym: "C", name: "Capacitance", unit: "Farads (F)" },
        { sym: "\\pi", name: "Pi Constant (\\approx 3.14159)", unit: "Dimensionless" }
      ]
    },
    {
      id: "decibels",
      level: "L3 Bridging",
      levelCode: "L3",
      badgeClass: "bg-blue-600 text-white",
      title: "Decibel (dB) Power & Voltage Gain Ratios",
      description: "A logarithmic scale representing amplifier gain or cable signal loss. A +3 dB change doubles power; a +6 dB change doubles voltage.",
      formulaLatex: String.raw`G_{\text{dB(Power)}} = 10\log_{10}\left(\frac{P_2}{P_1}\right) \qquad G_{\text{dB(Voltage)}} = 20\log_{10}\left(\frac{V_2}{V_1}\right)`,
      symbols: [
        { sym: "G_{\\text{dB}}", name: "Gain (+) or Attenuation (-) in Decibels", unit: "Decibels (dB)" },
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
      description: "Mathematical model of an alternating voltage generated by rotating machinery. Gives instantaneous voltage snapshots and thermal heating (RMS) equivalents.",
      formulaLatex: String.raw`\omega = 2\pi f = \frac{2\pi}{T} \qquad v(t) = V_m \sin(\omega t \pm \phi) \qquad V_{\text{rms}} = \frac{V_m}{\sqrt{2}} \approx 0.707 V_m`,
      symbols: [
        { sym: "\\omega", name: "Angular Velocity / Frequency", unit: "Radians per second (rad/s)" },
        { sym: "f", name: "Cyclic Frequency (UK mains = 50 Hz)", unit: "Hertz (Hz)" },
        { sym: "T", name: "Periodic Time (T = 1/f)", unit: "Seconds (s)" },
        { sym: "V_m", name: "Peak Voltage Amplitude", unit: "Volts (V)" },
        { sym: "\\phi", name: "Phase Shift Angle", unit: "Radians (rad) or Degrees (^\\circ)" },
        { sym: "V_{\\text{rms}}", name: "Root-Mean-Square (Equivalent DC Heating)", unit: "Volts (V)" }
      ]
    },

    // --- LEVEL 4 HNC ELECTRICAL ---
    {
      id: "reactances",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Inductive & Capacitive AC Reactance",
      description: "Frequency-dependent resistance in AC circuits. Inductors resist rapid current changes (+90° phase lead), whereas capacitors resist rapid voltage changes (-90° phase lag).",
      formulaLatex: String.raw`X_L = 2\pi f L = \omega L \qquad X_C = \frac{1}{2\pi f C} = \frac{1}{\omega C}`,
      symbols: [
        { sym: "X_L", name: "Inductive Reactance (points up at +j)", unit: "Ohms (\\Omega)" },
        { sym: "X_C", name: "Capacitive Reactance (points down at -j)", unit: "Ohms (\\Omega)" },
        { sym: "L", name: "Inductance", unit: "Henrys (H)" },
        { sym: "C", name: "Capacitance", unit: "Farads (F)" }
      ]
    },
    {
      id: "complex_impedance",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Complex Impedance & Rectangular / Polar Vectors",
      description: "Total opposition to AC current combining resistance and reactances into complex numbers. Rectangular form adds in series; polar form divides with Ohm's law.",
      formulaLatex: String.raw`Z = R + j(X_L - X_C) = |Z|\angle\theta \qquad |Z| = \sqrt{R^2 + (X_L - X_C)^2} \qquad \theta = \tan^{-1}\left(\frac{X_L - X_C}{R}\right)`,
      symbols: [
        { sym: "Z", name: "Total AC Complex Impedance", unit: "Ohms (\\Omega)" },
        { sym: "j", name: "Imaginary Unit (\\sqrt{-1}) indicating 90° rotation", unit: "Dimensionless" },
        { sym: "|Z|", name: "Polar Impedance Magnitude", unit: "Ohms (\\Omega)" },
        { sym: "\\theta", name: "Phase Angle between Voltage and Current", unit: "Degrees (^\\circ)" }
      ]
    },
    {
      id: "power_triangle",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "AC Power Triangle & Power Factor",
      description: "Deconstructs total AC apparent power into useful work (True Power) and sloshing magnetic field energy (Reactive Power). Power factor measures grid utilization efficiency.",
      formulaLatex: String.raw`S = V I \quad P = S\cos\theta \quad Q = S\sin\theta \quad S = \sqrt{P^2 + Q^2} \quad \text{PF} = \cos\theta = \frac{P}{S} = \frac{R}{|Z|}`,
      symbols: [
        { sym: "S", name: "Apparent Power (Total grid rating)", unit: "Volt-Amperes (VA)" },
        { sym: "P", name: "True / Active Power (Heat / mechanical work)", unit: "Watts (W)" },
        { sym: "Q", name: "Reactive Power (Magnetic / electric field exchange)", unit: "Volt-Amps Reactive (VAR)" },
        { sym: "\\text{PF}", name: "Power Factor (\\cos\\theta, ideally 1.0)", unit: "Ratio (0.0 to 1.0)" }
      ]
    },
    {
      id: "mesh_cramer",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "2x2 Matrix Determinants & Cramer's Rule",
      description: "A direct determinant method used to solve simultaneous multi-loop Kirchhoff Voltage Law (KVL) circuit equations without manual substitution.",
      formulaLatex: String.raw`\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc \qquad I_1 = \frac{\Delta_1}{\Delta} = \frac{\det\begin{pmatrix} V_1 & R_{12} \\ V_2 & R_{22} \end{pmatrix}}{\det\begin{pmatrix} R_{11} & R_{12} \\ R_{21} & R_{22} \end{pmatrix}}`,
      symbols: [
        { sym: "\\Delta", name: "Main System Resistance Determinant", unit: "Scalar" },
        { sym: "\\Delta_1", name: "Determinant with Column 1 replaced by Voltages", unit: "Scalar" },
        { sym: "I_1, I_2", name: "Independent Mesh Loop Currents", unit: "Amperes (A)" },
        { sym: "R_{11}, R_{22}", name: "Self-Loop Total Resistances", unit: "Ohms (\\Omega)" },
        { sym: "R_{12}, R_{21}", name: "Shared / Mutual Branch Resistances", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "calculus_dynamic",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Dynamic Circuit Rates & Maximum Power Transfer",
      description: "Calculus derivatives for calculating back-EMF in motor coils, capacitive displacement current, and stationary turning points for maximum power delivery.",
      formulaLatex: String.raw`v_L(t) = L\frac{di}{dt} \qquad i_C(t) = C\frac{dv}{dt} \qquad \text{Max Power: } \frac{dP}{dR_L} = 0 \implies R_L = R_s`,
      symbols: [
        { sym: "v_L(t)", name: "Induced Inductor Back-EMF Voltage", unit: "Volts (V)" },
        { sym: "i_C(t)", name: "Current through Capacitor", unit: "Amperes (A)" },
        { sym: "di/dt", name: "Rate of Change of Current with Time", unit: "Amps per second (A/s)" },
        { sym: "dv/dt", name: "Rate of Change of Voltage with Time", unit: "Volts per second (V/s)" },
        { sym: "R_L = R_s", name: "Load matching source for max power", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "integration_averages",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Charge Accumulation & Mean / RMS Integration",
      description: "Integration calculates total accumulated electrostatic charge, DC average values, and true thermal heating (RMS) values for arbitrary waveforms.",
      formulaLatex: String.raw`Q = \int_{t_1}^{t_2} i(t)\,dt \qquad V_{\text{mean}} = \frac{1}{T}\int_0^T v(t)\,dt \qquad V_{\text{rms}} = \sqrt{\frac{1}{T}\int_0^T [v(t)]^2\,dt}`,
      symbols: [
        { sym: "Q", name: "Accumulated Stored Charge", unit: "Coulombs (C)" },
        { sym: "V_{\\text{mean}}", name: "Mean / DC Average over Period T", unit: "Volts (V)" },
        { sym: "V_{\\text{rms}}", name: "True RMS Value of Complex Waveform", unit: "Volts (V)" },
        { sym: "T", name: "Full Cycle Time Period", unit: "Seconds (s)" }
      ]
    },
    {
      id: "transients",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "First-Order RC & RL Transients (Charging & Discharging)",
      description: "Exponential curves governing how voltages and currents change over time when DC switches operate. Time constants define charging speed.",
      formulaLatex: String.raw`\tau_{RC} = R C \quad \tau_{RL} = \frac{L}{R} \quad v_C(t) = V_s(1 - e^{-t/\tau}) \quad t = -\tau\ln\left(1 - \frac{v_C}{V_s}\right)`,
      symbols: [
        { sym: "\\tau", name: "Time Constant (1\\tau = 63.2%, 5\\tau = 99.3%)", unit: "Seconds (s)" },
        { sym: "V_s", name: "DC Supply Step Voltage", unit: "Volts (V)" },
        { sym: "v_C(t)", name: "Capacitor Voltage at Time t", unit: "Volts (V)" },
        { sym: "e", name: "Euler's Natural Base (\\approx 2.71828)", unit: "Dimensionless" },
        { sym: "t", name: "Elapsed Time since Switching", unit: "Seconds (s)" }
      ]
    },
    {
      id: "laplace",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Laplace Transform Pairs & s-Domain Impedances",
      description: "Converts differential equations into simple algebra using the complex frequency variable s = \\sigma + j\\omega. Resistors, inductors, and capacitors all behave like simple resistors.",
      formulaLatex: String.raw`\mathcal{L}\{1\} = \frac{1}{s} \quad \mathcal{L}\{e^{-at}\} = \frac{1}{s+a} \quad Z_R(s) = R \quad Z_L(s) = sL \quad Z_C(s) = \frac{1}{sC}`,
      symbols: [
        { sym: "s", name: "Complex Frequency Parameter (\\sigma + j\\omega)", unit: "rad/s" },
        { sym: "\\mathcal{L}\\{f(t)\\}", name: "Forward Laplace Transform", unit: "s-domain" },
        { sym: "Z_L(s) = sL", name: "Inductor Complex s-Impedance", unit: "Ohms (\\Omega)" },
        { sym: "Z_C(s) = 1/sC", name: "Capacitor Complex s-Impedance", unit: "Ohms (\\Omega)" }
      ]
    },
    {
      id: "fourier",
      level: "L4 HNC Electrical",
      levelCode: "L4",
      badgeClass: "bg-purple-600 text-white",
      title: "Fourier Series, Harmonic Spectra & THD",
      description: "Deconstructs square, triangular, or distorted industrial waveforms into fundamental sine waves and higher harmonic multiples, calculating Total Harmonic Distortion.",
      formulaLatex: String.raw`v(t) = a_0 + \sum_{n=1}^\infty \Big(a_n\cos(n\omega t) + b_n\sin(n\omega t)\Big) \qquad \text{THD} = \frac{\sqrt{V_2^2 + V_3^2 + \dots}}{V_1} \times 100\%`,
      symbols: [
        { sym: "a_0", name: "DC Offset / Cycle Mean Value", unit: "Volts (V)" },
        { sym: "b_n", name: "Odd Harmonic Peak (Square wave: \\frac{4V}{n\\pi})", unit: "Volts (V)" },
        { sym: "n", name: "Harmonic Order (Odd harmonics = 1, 3, 5...)", unit: "Integer" },
        { sym: "\\text{THD}", name: "Total Harmonic Distortion Ratio", unit: "Percentage (%)" }
      ]
    }
  ];

  // =========================================================================
  // SELF-CONTAINED DOM INJECTION & MODAL CONTROLS
  // =========================================================================
  function ensureModalElement() {
    let modal = document.getElementById('formulas-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'formulas-modal';
      document.body.appendChild(modal);
    }
    modal.className = 'fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 hidden';
    
    // Close on backdrop click
    modal.onclick = function (e) {
      if (e.target === modal) closeModal();
    };
    return modal;
  }

  function openModal() {
    activeFilter = 'all';
    searchTerm = '';
    const modal = ensureModalElement();

    modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden" onclick="event.stopPropagation()">
        
        <!-- MODAL HEADER -->
        <div class="p-4 sm:p-5 border-b border-slate-800 bg-slate-900 sticky top-0 z-20 space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span class="text-amber-400">📐</span> Master Engineering Formulary
            </h3>
            <button onclick="FormulasModule.closeModal()" class="text-slate-400 hover:text-white text-2xl font-bold leading-none p-1.5 transition">&times;</button>
          </div>

          <!-- SEARCH & LEVEL FILTER BAR -->
          <div class="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pt-1">
            <div class="relative flex-grow">
              <input 
                type="text" 
                id="formula-search-input"
                placeholder="Search formulas, letters (e.g. XL, resonance, transient, tau)..."
                oninput="FormulasModule.setSearch(this.value)"
                class="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button onclick="FormulasModule.setFilter('all')" id="f-filter-all" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow">All</button>
              <button onclick="FormulasModule.setFilter('L3')" id="f-filter-L3" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-blue-400 border border-blue-500/30 hover:bg-slate-700">L3 Bridging</button>
              <button onclick="FormulasModule.setFilter('L4')" id="f-filter-L4" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-purple-400 border border-purple-500/30 hover:bg-slate-700">L4 HNC</button>
            </div>
          </div>
        </div>

        <!-- FORMULA LIST CONTAINER -->
        <div class="p-4 sm:p-6 overflow-y-auto space-y-5 flex-grow" id="formula-cards-container"></div>

        <!-- MODAL FOOTER -->
        <div class="p-3.5 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span id="formula-count-text">Loading formulas...</span>
          <button onclick="FormulasModule.closeModal()" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition">Close Formulary</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    renderModalList();
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

  function renderModalList() {
    const container = document.getElementById('formula-cards-container');
    const countText = document.getElementById('formula-count-text');
    if (!container) return;

    // Update filter tab styling
    ['all', 'L3', 'L4'].forEach(code => {
      const btn = document.getElementById(`f-filter-${code}`);
      if (btn) {
        btn.className = (code === activeFilter)
          ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow'
          : 'px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700';
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
      countText.innerText = `Showing ${filtered.length} of ${formulaDatabase.length} master engineering formulas`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400 space-y-2">
          <p class="text-base font-bold text-slate-200">No matching formulas found</p>
          <p class="text-xs">Try searching for a different keyword or click "All".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-md">
        <!-- Title & Level Badge -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
          <h4 class="text-sm sm:text-base font-black text-white">${item.title}</h4>
          <span class="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.badgeClass}">${item.level}</span>
        </div>

        <!-- Plain-English Description -->
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${item.description}</p>

        <!-- Chalkboard LaTeX Formula Box -->
        <div class="chalkboard p-3.5 rounded-lg text-amber-300 text-center font-mono overflow-x-auto text-sm sm:text-base border border-slate-800">
          \\[ ${item.formulaLatex} \\]
        </div>

        <!-- Symbols & Units Legend -->
        <div class="space-y-1.5 pt-1">
          <div class="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
            <span>📖</span> Symbols, Variables & SI Units:
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

    // Trigger KaTeX math rendering immediately
    renderMath(container);
  }

  function renderMath(targetEl) {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(targetEl, {
          delimiters: [
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn('Formula KaTeX render error:', e);
      }
    }
  }

  // Keyboard shortcut: Escape key closes modal
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  return {
    openModal,
    closeModal,
    setFilter,
    setSearch
  };
})();

// =========================================================================
// GLOBAL ALIASES (Ensures buttons in index.html work automatically)
// =========================================================================
window.openFormulasModal = FormulasModule.openModal;
window.closeFormulasModal = FormulasModule.closeModal;
