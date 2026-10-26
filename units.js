/**
 * units.js - SI Units and Metric Prefixes Reference & Live Converter
 * Features:
 * - Displays the actual standard decimal number instead of calculator keys
 * - Live dynamic metric prefix conversion with exact decimal values
 * - Self-contained modal controller with KaTeX rendering
 */
const UnitsModule = (function () {
  const prefixes = [
    { name: 'Mega', symbol: 'M', power: 6, decimal: '1,000,000' },
    { name: 'kilo', symbol: 'k', power: 3, decimal: '1,000' },
    { name: 'milli', symbol: 'm', power: -3, decimal: '0.001' },
    { name: 'micro', symbol: 'μ', power: -6, decimal: '0.000001' },
    { name: 'nano', symbol: 'n', power: -9, decimal: '0.000000001' },
    { name: 'pico', symbol: 'p', power: -12, decimal: '0.000000000001' }
  ];

  function ensureModalElement() {
    let modal = document.getElementById('unit-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'unit-modal';
      document.body.appendChild(modal);
    }
    modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
    modal.onclick = function (e) {
      if (e.target === modal) closeModal();
    };
    return modal;
  }

  function openModal() {
    const modal = ensureModalElement();
    modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-6 shadow-2xl" onclick="event.stopPropagation()">
        
        <!-- MODAL HEADER -->
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>📏</span> SI Units & Metric Prefixes Reference
          </h3>
          <button onclick="UnitsModule.closeModal()" class="text-slate-400 hover:text-white text-2xl font-bold leading-none p-1 transition">&times;</button>
        </div>

        <!-- LIVE PREFIX CONVERTER -->
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-400">Live Metric Prefix Converter</h4>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Value</label>
              <input type="number" id="conv-val" value="10" oninput="UnitsModule.runConversion()" class="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-slate-400 mb-1">From Prefix</label>
              <select id="conv-from" onchange="UnitsModule.runConversion()" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none focus:border-indigo-500">
                <option value="6">Mega (M, 10⁶)</option>
                <option value="3">kilo (k, 10³)</option>
                <option value="0">Base Unit (10⁰)</option>
                <option value="-3">milli (m, 10⁻³)</option>
                <option value="-6" selected>micro (μ, 10⁻⁶)</option>
                <option value="-9">nano (n, 10⁻⁹)</option>
                <option value="-12">pico (p, 10⁻¹²)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-400 mb-1">To Prefix</label>
              <select id="conv-to" onchange="UnitsModule.runConversion()" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none focus:border-indigo-500">
                <option value="6">Mega (M, 10⁶)</option>
                <option value="3">kilo (k, 10³)</option>
                <option value="0" selected>Base Unit (10⁰)</option>
                <option value="-3">milli (m, 10⁻³)</option>
                <option value="-6">micro (μ, 10⁻⁶)</option>
                <option value="-9">nano (n, 10⁻⁹)</option>
                <option value="-12">pico (p, 10⁻¹²)</option>
              </select>
            </div>
          </div>
          <div class="bg-slate-950 p-2.5 rounded text-center text-xs sm:text-sm font-mono text-emerald-400 border border-slate-800" id="conv-result"></div>
        </div>

        <!-- PREFIX REFERENCE TABLE WITH ACTUAL NUMBERS -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">SI Prefix Values & Actual Decimal Numbers</h4>
          <div class="overflow-x-auto rounded-lg border border-slate-800">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                  <th class="py-2.5 px-3">Prefix</th>
                  <th class="py-2.5 px-2">Symbol</th>
                  <th class="py-2.5 px-3">Multiplier</th>
                  <th class="py-2.5 px-3 text-right">Actual Number</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-300 font-mono">
                ${prefixes.map(p => `
                  <tr class="hover:bg-slate-800/40 transition">
                    <td class="py-2 px-3 font-sans font-semibold text-slate-200">${p.name}</td>
                    <td class="py-2 px-2 text-indigo-400 font-bold">${p.symbol}</td>
                    <td class="py-2 px-3">\\(\\times 10^{${p.power}}\\)</td>
                    <td class="py-2 px-3 text-right text-emerald-400 font-semibold">${p.decimal}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- MODAL FOOTER -->
        <div class="text-right pt-1">
          <button onclick="UnitsModule.closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition">Close</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    runConversion();

    // Trigger KaTeX rendering
    if (window.App && typeof window.App.renderMath === 'function') {
      window.App.renderMath(modal);
    } else if (window.renderMathInElement) {
      renderMathInElement(modal, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById('unit-modal');
    if (modal) modal.classList.add('hidden');
  }

  function runConversion() {
    const valInput = document.getElementById('conv-val');
    const fromSelect = document.getElementById('conv-from');
    const toSelect = document.getElementById('conv-to');
    const resultBox = document.getElementById('conv-result');
    if (!valInput || !fromSelect || !toSelect || !resultBox) return;

    const val = parseFloat(valInput.value);
    if (isNaN(val)) {
      resultBox.innerHTML = `<span class="text-slate-400">Enter a valid number</span>`;
      return;
    }

    const fromExp = parseInt(fromSelect.value, 10);
    const toExp = parseInt(toSelect.value, 10);
    const diff = fromExp - toExp;
    const result = val * Math.pow(10, diff);

    // Format display for actual standard decimal number
    let actualNumberStr = '';
    if (Math.abs(result) >= 1 && Math.abs(result) < 1e12) {
      actualNumberStr = result.toLocaleString('en-US', { maximumFractionDigits: 12 });
    } else if (Math.abs(result) > 0 && Math.abs(result) < 1) {
      actualNumberStr = result.toFixed(Math.min(14, Math.max(0, -diff + 2))).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1');
    } else {
      actualNumberStr = result.toLocaleString('en-US');
    }

    resultBox.innerHTML = `<strong>${val}</strong> = <span class="text-amber-300 font-bold">${actualNumberStr}</span> <span class="text-slate-400 text-xs">(${result.toExponential(4)})</span>`;
  }

  // Keyboard shortcut: Escape key closes modal
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  return {
    openModal,
    closeModal,
    runConversion
  };
})();

// Global aliases to ensure existing buttons in index.html work automatically
window.openUnitModal = UnitsModule.openModal;
window.closeUnitModal = UnitsModule.closeModal;
