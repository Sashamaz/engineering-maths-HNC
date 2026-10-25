/**
 * units.js - SI Units and Metric Prefixes Reference & Live Converter
 */
const UnitsModule = (function () {
  const prefixes = [
    { name: 'Mega', symbol: 'M', power: 6, key: '[x10ˣ] [6]' },
    { name: 'kilo', symbol: 'k', power: 3, key: '[x10ˣ] [3]' },
    { name: 'milli', symbol: 'm', power: -3, key: '[x10ˣ] [-] [3]' },
    { name: 'micro', symbol: 'μ', power: -6, key: '[x10ˣ] [-] [6]' },
    { name: 'nano', symbol: 'n', power: -9, key: '[x10ˣ] [-] [9]' },
    { name: 'pico', symbol: 'p', power: -12, key: '[x10ˣ] [-] [12]' }
  ];

  function openModal() {
    const modal = document.getElementById('unit-modal');
    modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>📏</span> SI Units & Metric Prefixes Converter
          </h3>
          <button onclick="UnitsModule.closeModal()" class="text-slate-400 hover:text-white text-2xl font-bold">&times;</button>
        </div>

        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-400">Live Metric Prefix Converter</h4>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Value</label>
              <input type="number" id="conv-val" value="47" oninput="UnitsModule.runConversion()" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white">
            </div>
            <div>
              <label class="block text-slate-400 mb-1">From Prefix</label>
              <select id="conv-from" onchange="UnitsModule.runConversion()" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white">
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
              <select id="conv-to" onchange="UnitsModule.runConversion()" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white">
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
          <div class="bg-slate-950 p-2.5 rounded text-center text-sm font-mono text-emerald-400" id="conv-result"></div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400">
                <th class="py-2 px-1">Prefix</th>
                <th class="py-2 px-1">Symbol</th>
                <th class="py-2 px-1">Multiplier</th>
                <th class="py-2 px-1">Casio Key</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300 font-mono">
              ${prefixes.map(p => `
                <tr>
                  <td class="py-1.5 px-1">${p.name}</td>
                  <td class="text-indigo-400 font-bold">${p.symbol}</td>
                  <td>\\(\\times 10^{${p.power}}\\)</td>
                  <td>${p.key}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="text-right">
          <button onclick="UnitsModule.closeModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg">Close</button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    runConversion();
    if (window.App) window.App.renderMath(modal);
  }

  function closeModal() {
    document.getElementById('unit-modal').classList.add('hidden');
  }

  function runConversion() {
    const val = parseFloat(document.getElementById('conv-val').value) || 0;
    const fromExp = parseInt(document.getElementById('conv-from').value, 10);
    const toExp = parseInt(document.getElementById('conv-to').value, 10);
    const result = (val * Math.pow(10, fromExp)) / Math.pow(10, toExp);
    document.getElementById('conv-result').innerText = `${val} × 10^(${fromExp - toExp}) = ${result.toExponential(4)}`;
  }

  return {
    openModal,
    closeModal,
    runConversion
  };
})();