/**
 * scratchpad.js - High-Res Canvas Scratchpad
 * Features:
 * - Dynamic Full-Screen Question HUD with Collapse / Expand toggle
 * - Zero-drift orientation & rotation compensation
 * - Infinite downward scrolling
 * - Mobile & desktop full-screen overlay toggle
 * - Active Wacom Stylus, Apple Pencil & Multi-touch support
 */
const Scratchpad = (function () {
  let canvas, ctx;
  let isDrawing = false;
  let tool = 'pen';
  let color = '#facc15';
  let height = 300;
  let isFullScreen = false;
  let isQuestionVisible = true;
  let scrollContainer = null;

  // Inject full-screen layout and question banner styling
  function injectStyles() {
    if (document.getElementById('scratchpad-styles')) return;
    const style = document.createElement('style');
    style.id = 'scratchpad-styles';
    style.textContent = `
      .scratchpad-fullscreen {
        position: fixed !important;
        inset: 0 !important;
        z-index: 9999 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        background-color: #020617 !important;
        padding: 10px 12px !important;
        box-sizing: border-box !important;
      }
      .scratchpad-fullscreen #scratchpad-scroll-wrapper {
        flex: 1 1 0% !important;
        max-height: none !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

  function init(resetHeight = false) {
    injectStyles();
    canvas = document.getElementById('scratchpad');
    if (!canvas) return;

    scrollContainer = document.getElementById('scratchpad-scroll-wrapper') || canvas.parentElement;

    if (resetHeight) height = isFullScreen ? window.innerHeight * 1.5 : 300;

    resizeCanvas(height, !resetHeight);
    setupEvents();
  }

  function resizeCanvas(newHeight, preserveContent = true) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width || (canvas.parentElement ? canvas.parentElement.clientWidth : 650);

    let backup = null;
    if (preserveContent && canvas.width > 0 && canvas.height > 0) {
      backup = document.createElement('canvas');
      backup.width = canvas.width;
      backup.height = canvas.height;
      const bCtx = backup.getContext('2d');
      bCtx.drawImage(canvas, 0, 0);
    }

    height = Math.max(newHeight, isFullScreen ? window.innerHeight : 300);
    canvas.style.height = height + 'px';
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx = canvas.getContext('2d');
    if (backup) {
      ctx.drawImage(backup, 0, 0);
    }
    ctx.scale(dpr, dpr);
    applySettings();
  }

  function setupEvents() {
    if (canvas._hasEvents) return;
    canvas._hasEvents = true;

    // Mathematically exact position ratio to eliminate orientation/rotation drift
    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const scaleX = (canvas.width / dpr) / (r.width || 1);
      const scaleY = (canvas.height / dpr) / (r.height || 1);
      return {
        x: (e.clientX - r.left) * scaleX,
        y: (e.clientY - r.top) * scaleY
      };
    };

    canvas.onpointerdown = (e) => {
      e.preventDefault();
      if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
      isDrawing = true;
      applySettings();
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      checkInfiniteExpansion(p.y);
    };

    canvas.onpointermove = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      checkInfiniteExpansion(p.y);
    };

    const stop = (e) => {
      if (!isDrawing) return;
      isDrawing = false;
      if (e && canvas.releasePointerCapture && e.pointerId !== undefined) {
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };

    canvas.onpointerup = stop;
    canvas.onpointercancel = stop;

    // Infinite scroll listener: auto-adds space when scrolling down
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', () => {
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 150) {
          extendHeight(600);
        }
      });
    }

    // Screen Rotation & Window Resize compensation
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvas && canvas.offsetParent !== null) {
          resizeCanvas(height, true);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  }

  // Auto-expands the whiteboard infinitely as you draw towards the bottom
  function checkInfiniteExpansion(yPos) {
    if (yPos > height - 120) {
      extendHeight(500);
    }
  }

  function applySettings() {
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 24;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
    }
  }

  function setTool(newTool, newColor) {
    tool = newTool;
    if (newColor) color = newColor;
    applySettings();
  }

  function extendHeight(extra = 400) {
    resizeCanvas(height + extra, true);
  }

  function clear() {
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // =========================================================================
  // FULL-SCREEN MODE & COLLAPSIBLE QUESTION BANNER
  // =========================================================================
  function ensureQuestionBanner(box) {
    let banner = document.getElementById('scratchpad-fs-question');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'scratchpad-fs-question';
      banner.className = 'bg-slate-900/95 border border-indigo-500/40 rounded-xl p-3 mb-2 shadow-xl backdrop-blur shrink-0 transition-all';
      banner.innerHTML = `
        <div class="flex justify-between items-center gap-2 cursor-pointer select-none" onclick="Scratchpad.toggleQuestion()">
          <div class="flex items-center gap-2 overflow-hidden">
            <span class="text-xs font-black text-indigo-400 uppercase tracking-wider shrink-0" id="scratchpad-fs-q-indicator">Question</span>
            <span class="text-[11px] text-slate-400 truncate" id="scratchpad-fs-q-topic"></span>
          </div>
          <button type="button" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 font-bold shrink-0 transition">
            <span id="scratchpad-fs-q-icon">▲</span>
            <span id="scratchpad-fs-q-btn-text">Hide Question</span>
          </button>
        </div>
        <div id="scratchpad-fs-q-body" class="mt-2 text-xs sm:text-sm font-medium text-slate-100 leading-relaxed border-t border-slate-800 pt-2 overflow-y-auto max-h-36"></div>
      `;
      box.insertBefore(banner, box.firstChild);
    }
    return banner;
  }

  function syncQuestionContent() {
    const qSource = document.getElementById('quiz-question');
    const stepSource = document.getElementById('quiz-step-indicator');
    const topicSource = document.getElementById('quiz-topic-title');

    const indTarget = document.getElementById('scratchpad-fs-q-indicator');
    const topicTarget = document.getElementById('scratchpad-fs-q-topic');
    const bodyTarget = document.getElementById('scratchpad-fs-q-body');

    if (stepSource && indTarget) indTarget.innerText = stepSource.innerText;
    if (topicSource && topicTarget) topicTarget.innerText = topicSource.innerText ? `• ${topicSource.innerText}` : '';
    if (qSource && bodyTarget) {
      bodyTarget.innerHTML = qSource.innerHTML;
      if (window.App && typeof window.App.renderMath === 'function') {
        window.App.renderMath(bodyTarget);
      }
    }
  }

  function toggleQuestion() {
    isQuestionVisible = !isQuestionVisible;
    const body = document.getElementById('scratchpad-fs-q-body');
    const icon = document.getElementById('scratchpad-fs-q-icon');
    const btnText = document.getElementById('scratchpad-fs-q-btn-text');

    if (!body || !icon || !btnText) return;

    if (isQuestionVisible) {
      body.classList.remove('hidden');
      icon.innerText = '▲';
      btnText.innerText = 'Hide Question';
    } else {
      body.classList.add('hidden');
      icon.innerText = '▼';
      btnText.innerText = 'Show Question';
    }

    setTimeout(() => resizeCanvas(height, true), 30);
  }

  function toggleFullScreen() {
    const box = document.getElementById('scratchpad-box');
    const fsBtn = document.getElementById('btn-fullscreen');
    if (!box) return;

    isFullScreen = !isFullScreen;

    if (isFullScreen) {
      box.classList.add('scratchpad-fullscreen');
      const banner = ensureQuestionBanner(box);
      banner.classList.remove('hidden');
      syncQuestionContent();

      if (fsBtn) {
        fsBtn.innerHTML = '✕ Exit Fullscreen';
        fsBtn.classList.replace('bg-indigo-950', 'bg-red-900');
        fsBtn.classList.replace('text-indigo-300', 'text-white');
      }
    } else {
      box.classList.remove('scratchpad-fullscreen');
      const banner = document.getElementById('scratchpad-fs-question');
      if (banner) banner.classList.add('hidden');

      if (fsBtn) {
        fsBtn.innerHTML = '⛶ Fullscreen';
        fsBtn.classList.replace('bg-red-900', 'bg-indigo-950');
        fsBtn.classList.replace('text-white', 'text-indigo-300');
      }
    }

    setTimeout(() => {
      resizeCanvas(height, true);
    }, 50);
  }

  return {
    init,
    setTool,
    extendHeight,
    clear,
    toggleFullScreen,
    toggleQuestion
  };
})();
