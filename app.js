/**
 * app.js - Central Application Controller & Quiz Engine
 */
const App = (function () {
  let state = {};
  let quizQuestions = [];
  let currentQuizIndex = 0;
  let roundScore = 0;

  function init() {
    state = StorageModule.loadState();
    updateScoreDisplay();
    populateQuickTopicDropdown();
    filterCurriculum(state.currentFilter);

    if (state.currentTopicId) {
      const resumeBtn = document.getElementById('resume-btn');
      const lastT = CurriculumModule.getTopicById(state.currentTopicId);
      resumeBtn.innerText = `▶ Resume ${lastT.id}: ${lastT.title.replace(/^[0-9.]+\s*/, '')}`;
      resumeBtn.classList.remove('hidden');
    }

    Scratchpad.init(true);
  }

  function updateScoreDisplay() {
    document.getElementById('score-display').innerText = `${state.totalCorrect}/${state.totalAttempted}`;
  }

  function renderMath(targetEl = document.body) {
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
        console.error('KaTeX rendering error:', e);
      }
    }
  }

  function filterCurriculum(level) {
    state.currentFilter = level;
    StorageModule.saveState(state);

    ['all', 'L3', 'L4'].forEach(code => {
      const btn = document.getElementById(`filter-${code}`);
      if (btn) {
        btn.className = (code === level)
          ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow'
          : 'px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-700';
      }
    });

    const container = document.getElementById('modules-container');
    const filteredMods = CurriculumModule.modules.filter(m => level === 'all' || m.levelCode === level);

    container.innerHTML = filteredMods.map(mod => `
      <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${mod.badgeClass}">${mod.levelLabel}</span>
              <span class="text-xs text-slate-400 font-mono">${mod.topics.length} Lessons</span>
            </div>
            <h3 class="text-lg font-extrabold text-white">${mod.moduleTitle}</h3>
            <p class="text-xs text-slate-400 mt-0.5">${mod.moduleDesc}</p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          ${mod.topics.map(t => {
            const best = state.completedTopics[t.id];
            const badge = (best !== undefined)
              ? `<span class="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-2 py-0.5 rounded font-bold">✓ Best: ${best}/10</span>`
              : `<span class="text-[10px] bg-slate-900 text-slate-400 border border-slate-700 px-2 py-0.5 rounded">Lesson + 10 Qs</span>`;
            return `
              <div onclick="App.selectTopicById('${t.id}', true)" class="bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-indigo-500 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between group">
                <div>
                  <div class="flex justify-between items-center gap-1 mb-2">
                    <span class="text-xs font-mono font-bold text-indigo-400">Topic ${t.id}</span>
                    ${badge}
                  </div>
                  <h4 class="font-bold text-sm text-slate-100 group-hover:text-indigo-300 leading-snug">${t.title.replace(/^[0-9.]+\s*/, '')}</h4>
                </div>
                <div class="mt-4 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] font-semibold text-indigo-400">
                  <span>Open Lesson</span>
                  <span class="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    renderMath(container);
  }

  function populateQuickTopicDropdown() {
    const select = document.getElementById('quick-topic-select');
    select.innerHTML = CurriculumModule.modules.map(mod => `
      <optgroup label="[${mod.levelCode}] ${mod.moduleTitle}">
        ${mod.topics.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}
      </optgroup>
    `).join('');
  }

  function selectTopicById(topicId, resetQuiz = true) {
    const topic = CurriculumModule.getTopicById(topicId);
    state.currentTopicId = topic.id;
    StorageModule.saveState(state);

    document.getElementById('view-topic-list').classList.add('hidden');
    document.getElementById('view-lesson').classList.remove('hidden');
    document.getElementById('quick-topic-select').value = topic.id;

    const lessonContainer = document.getElementById('lesson-content');
    lessonContainer.innerHTML = `
      <div class="bg-slate-800/90 p-5 sm:p-7 rounded-2xl border border-slate-700 space-y-6 shadow-lg">
        <div class="border-b border-slate-700 pb-4 space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${topic.badgeClass}">${topic.levelLabel}</span>
            <span class="text-xs text-indigo-400 font-semibold">${topic.moduleTitle}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-white">${topic.title}</h2>
        </div>

        <div class="bg-slate-900/90 p-5 rounded-xl border-l-4 border-indigo-500 border border-slate-700 space-y-2">
          <div class="text-indigo-400 font-extrabold text-sm uppercase">Step 1: Layman's Terms & Intuitive Idea</div>
          <div class="text-sm text-slate-200 leading-relaxed">${topic.step1}</div>
        </div>

        <div class="bg-slate-900/90 p-5 rounded-xl border-l-4 border-sky-500 border border-slate-700 space-y-2">
          <div class="text-sky-400 font-extrabold text-sm uppercase">Step 2: Real-World Circuit Application</div>
          <div class="text-sm text-slate-200 leading-relaxed">${topic.step2}</div>
        </div>

        <div class="chalkboard p-5 rounded-xl border-l-4 border-amber-400 space-y-3">
          <div class="text-amber-400 font-extrabold text-sm uppercase">Step 3: Formula & Units Breakdown</div>
          <div class="text-sm text-slate-100 leading-relaxed">${topic.step3}</div>
        </div>

        <div class="bg-emerald-950/30 p-5 rounded-xl border-l-4 border-emerald-500 border border-emerald-700/40 space-y-2">
          <div class="text-emerald-400 font-extrabold text-sm uppercase">Step 4: Step-by-Step Worked Example</div>
          <div class="text-sm text-slate-200 leading-relaxed space-y-1.5">${topic.step4}</div>
        </div>

        <div class="pt-4 border-t border-slate-700 flex justify-end">
          <button onclick="App.switchTab('practice')" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition">
            ✏️ Practice 10 Questions on this Topic →
          </button>
        </div>
      </div>
    `;

    renderMath(lessonContainer);

    if (resetQuiz) {
      quizQuestions = [];
      for (let i = 0; i < 10; i++) {
        quizQuestions.push(topic.generateQuestion(i));
      }
      currentQuizIndex = 0;
      roundScore = 0;
    }
    renderQuizQuestion();
  }

  function showTopicList() {
    document.getElementById('view-lesson').classList.add('hidden');
    document.getElementById('view-topic-list').classList.remove('hidden');
    filterCurriculum(state.currentFilter);
  }

  function resumeSavedTopic() {
    selectTopicById(state.currentTopicId, true);
  }

  function switchTab(tab) {
    state.currentTab = tab;
    StorageModule.saveState(state);

    const lessonContent = document.getElementById('lesson-content');
    const practiceContent = document.getElementById('practice-content');
    const btnLesson = document.getElementById('btn-tab-lesson');
    const btnPractice = document.getElementById('btn-tab-practice');

    if (tab === 'lesson') {
      lessonContent.classList.remove('hidden');
      practiceContent.classList.add('hidden');
      btnLesson.className = 'px-3.5 py-2 rounded-lg font-bold bg-indigo-600 text-white text-xs transition';
      btnPractice.className = 'px-3.5 py-2 rounded-lg font-bold bg-slate-900 text-slate-300 hover:bg-slate-700 border border-slate-700 text-xs transition';
      renderMath(lessonContent);
    } else {
      lessonContent.classList.add('hidden');
      practiceContent.classList.remove('hidden');
      btnPractice.className = 'px-3.5 py-2 rounded-lg font-bold bg-indigo-600 text-white text-xs transition';
      btnLesson.className = 'px-3.5 py-2 rounded-lg font-bold bg-slate-900 text-slate-300 hover:bg-slate-700 border border-slate-700 text-xs transition';
      setTimeout(() => {
        Scratchpad.init(true);
        renderMath(practiceContent);
      }, 50);
    }
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderQuizQuestion() {
    const topic = CurriculumModule.getTopicById(state.currentTopicId);
    const q = quizQuestions[currentQuizIndex];

    const badge = document.getElementById('quiz-level-badge');
    badge.className = `text-[10px] px-2 py-0.5 rounded font-bold uppercase ${topic.badgeClass}`;
    badge.innerText = topic.levelLabel;

    document.getElementById('quiz-step-indicator').innerText = `Question ${currentQuizIndex + 1} of 10`;
    document.getElementById('quiz-topic-title').innerText = topic.title;
    document.getElementById('quiz-unit-banner-text').innerHTML = q.unitBanner;
    document.getElementById('quiz-question').innerHTML = q.question;

    const shuffled = shuffle(q.options);
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = shuffled.map((opt, idx) => `
      <button onclick="App.checkAnswer(${opt.isCorrect}, this)" class="quiz-opt-btn text-left p-4 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700 text-sm text-slate-100 transition flex items-center justify-between gap-2">
        <span>${opt.text}</span>
        <span class="shrink-0 text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">${String.fromCharCode(65 + idx)}</span>
      </button>
    `).join('');

    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-next-btn').classList.add('hidden');

    Scratchpad.clear();
    renderMath(document.getElementById('practice-content'));
  }

  function checkAnswer(isCorrect, btn) {
    document.querySelectorAll('.quiz-opt-btn').forEach(b => (b.disabled = true));

    state.totalAttempted++;
    if (isCorrect) {
      state.totalCorrect++;
      roundScore++;
      btn.classList.add('bg-emerald-950/90', 'border-emerald-500', 'text-emerald-200');
    } else {
      btn.classList.add('bg-red-950/90', 'border-red-500', 'text-red-200');
    }

    updateScoreDisplay();
    StorageModule.saveState(state);

    const expBox = document.getElementById('quiz-explanation');
    expBox.innerHTML = `
      <div class="text-xs font-bold uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}">
        ${isCorrect ? '✓ Correct! Full Solution:' : '✗ Step-by-Step Derivation:'}
      </div>
      <div class="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
        ${quizQuestions[currentQuizIndex].explanation}
      </div>
    `;
    expBox.classList.remove('hidden');

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.innerText = currentQuizIndex < 9 ? 'Next Question →' : 'Complete 10-Question Round →';
    nextBtn.classList.remove('hidden');

    renderMath(expBox);
  }

  function nextQuestion() {
    if (currentQuizIndex < 9) {
      currentQuizIndex++;
      renderQuizQuestion();
    } else {
      const prevBest = state.completedTopics[state.currentTopicId] || 0;
      if (roundScore >= prevBest) {
        state.completedTopics[state.currentTopicId] = roundScore;
        StorageModule.saveState(state);
      }

      const optionsContainer = document.getElementById('quiz-options');
      optionsContainer.innerHTML = `
        <div class="col-span-2 bg-slate-900 p-6 rounded-xl border border-indigo-500/50 text-center space-y-4">
          <h3 class="text-xl font-extrabold text-white">🎉 Round Complete!</h3>
          <p class="text-sm text-slate-300">You scored <strong class="text-emerald-400">${roundScore} / 10</strong> on this practice set.</p>
          <div class="flex flex-wrap justify-center gap-3 pt-2">
            <button onclick="App.selectTopicById('${state.currentTopicId}', true); App.switchTab('practice');" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl">
              🔄 Practice 10 New Questions
            </button>
            <button onclick="App.showTopicList()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700">
              📚 Back to Curriculum
            </button>
          </div>
        </div>
      `;
      document.getElementById('quiz-next-btn').classList.add('hidden');
    }
  }

  return {
    init,
    showTopicList,
    resumeSavedTopic,
    selectTopicById,
    switchTab,
    filterCurriculum,
    checkAnswer,
    nextQuestion,
    renderMath
  };
})();

window.addEventListener('DOMContentLoaded', App.init);