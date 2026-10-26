/**
 * scratchpad.js - High-Res Canvas Scratchpad
 * Features:
 * - Unified Pointer Events engine (Mouse, Wacom Stylus, Apple Pencil & Touch)
 * - Two-finger pinch-to-zoom (50% to 400%) & two-finger pan
 * - Anti-stray-mark suppression on two-finger contact
 * - Mathematically exact coordinate mapping at any zoom level or orientation
 * - Manual toolbar zoom controls ([−] 100% [+])
 * - Infinite downward scrolling
 * - Full-screen overlay with collapsible question HUD
 */
const Scratchpad = (function () {
  let canvas, ctx;
  let isDrawing = false;
  let isPinching = false;
  let tool = 'pen';
  let color = '#facc15';
  let height = 300;
  let isFullScreen = false;
  let isQuestionVisible = true;
  let scrollContainer = null;

  // Zoom & Pan state
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4.0;

  // Multi-touch tracking
  const activePointers = new Map();
  let initialPinchDist = 0;
  let initialPinchCenter = { x: 0, y: 0 };
  let initialZoom = 1.0;
  let initialPanX = 0;
  let initialPanY = 0;
  let strokeSnapshot = null;
  let strokeStartedAt = 0;

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
      #scratchpad-scroll-wrapper {
        touch-action: none !important;
        overflow: hidden !important;
        position: relative !important;
      }
      #scratchpad {
        transform-origin: 0 0 !important;
        touch-action: none !important;
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureZoomControls() {
    if (document.getElementById('zoom-controls-group')) return;
    const toolbar = document.querySelector('#scratchpad-box .flex-wrap.items-center');
    if (!toolbar) return;

    const group = document.createElement('div');
    group.id = 'zoom-controls-group';
    group.className = 'flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800 text-xs';
    group.innerHTML = `
      <button type="button" onclick="Scratchpad.zoomStep(-0.25)" class="px-1.5 py-0.5 text-slate-300 hover:text-white font-bold" title="Zoom Out">−</button>
      <button type="button" id="btn-zoom-val" onclick="Scratchpad.resetZoom()" class="font-mono text-[11px] text-amber-300 px-1 font-semibold" title="Tap to reset to 100%">100%</button>
      <button type="button" onclick="Scratchpad.zoomStep(0.25)" class="px-1.5 py-0.5 text-slate-300 hover:text-white font-bold" title="Zoom In">+</button>
    `;

    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      toolbar.insertBefore(group, fsBtn);
    } else {
      toolbar.appendChild(group);
    }
  }

  function init(resetHeight = false) {
    injectStyles();
    canvas = document.getElementById('scratchpad');
    if (!canvas) return;

    scrollContainer = document.getElementById('scratchpad-scroll-wrapper') || canvas.parentElement;

    if (resetHeight) {
      height = isFullScreen ? window.innerHeight * 1.5 : 300;
      zoom = 1.0;
      panX = 0;
      panY = 0;
    }

    ensureZoomControls();
    resizeCanvas(height, !resetHeight);
    applyTransform();
    setupEvents();
  }

  function resizeCanvas(newHeight, preserveContent = true) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = (scrollContainer && scrollContainer.clientWidth > 0)
      ? scrollContainer.clientWidth
      : (canvas.getBoundingClientRect().width || 650);

    let backup = null;
    if (preserveContent && canvas.width > 0 && canvas.height > 0) {
      backup = document.createElement('canvas');
      backup.width = canvas.width;
      backup.height = canvas.height;
      backup.getContext('2d').drawImage(canvas, 0, 0);
    }

    height = Math.max(newHeight, isFullScreen ? window.innerHeight : 300);
    canvas.style.width = cssWidth + 'px';
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

  function applyTransform() {
    if (!canvas) return;
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;

    const zoomVal = document.getElementById('btn-zoom-val');
    if (zoomVal) {
      zoomVal.innerText = `${Math.round(zoom * 100)}%`;
    }
  }

  function zoomStep(delta) {
    const newZoom = Math.min(Math.max(MIN_ZOOM, zoom + delta), MAX_ZOOM);
    const rect = scrollContainer ? scrollContainer.getBoundingClientRect() : { width: 400, height: 300 };
    const focalX = rect.width / 2;
    const focalY = rect.height / 2;

    panX = focalX - (focalX - panX) * (newZoom / zoom);
    panY = focalY - (focalY - panY) * (newZoom / zoom);
    zoom = newZoom;
    applyTransform();
  }

  function resetZoom() {
    zoom = 1.0;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function setupEvents() {
    if (canvas._hasEvents) return;
    canvas._hasEvents = true;

    // Direct mathematical coordinate translation via container anchor
    const getPos = (e) => {
      const rect = scrollContainer.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - panX) / zoom,
        y: (e.clientY - rect.top - panY) / zoom
      };
    };

    // POINTER DOWN: Register finger / stylus / mouse
    canvas.onpointerdown = (e) => {
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      activePointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

      if (activePointers.size === 1) {
        // Single pointer: initialize drawing path
        isPinching = false;
        isDrawing = true;

        // Take snapshot in case a second finger joins for a pinch
        if (!strokeSnapshot) strokeSnapshot = document.createElement('canvas');
        strokeSnapshot.width = canvas.width;
        strokeSnapshot.height = canvas.height;
        strokeSnapshot.getContext('2d').drawImage(canvas, 0, 0);
        strokeStartedAt = Date.now();

        applySettings();
        const p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 0.1, p.y + 0.1);
        ctx.stroke();

      } else if (activePointers.size >= 2) {
        // Two fingers detected: CANCEL DRAWING & INITIALIZE PINCH/PAN
        isDrawing = false;
        isPinching = true;

        // Revert any accidental dot drawn during the first 250ms of touch
        if (strokeSnapshot && (Date.now() - strokeStartedAt < 250)) {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(strokeSnapshot, 0, 0);
          ctx.restore();
          applySettings();
        }

        const pts = Array.from(activePointers.values());
        initialPinchDist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
        initialPinchCenter = {
          x: (pts[0].clientX + pts[1].clientX) / 2,
          y: (pts[0].clientY + pts[1].clientY) / 2
        };
        initialZoom = zoom;
        initialPanX = panX;
        initialPanY = panY;
      }
    };

    // POINTER MOVE: Draw or Pinch/Pan
    canvas.onpointermove = (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

      if (isPinching && activePointers.size >= 2) {
        // TWO-FINGER PINCH-TO-ZOOM & PAN (NO DRAWING)
        const pts = Array.from(activePointers.values());
        const currentDist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
        const currentCenter = {
          x: (pts[0].clientX + pts[1].clientX) / 2,
          y: (pts[0].clientY + pts[1].clientY) / 2
        };

        if (initialPinchDist > 0 && currentDist > 0) {
          const rect = scrollContainer.getBoundingClientRect();
          const scaleFactor = currentDist / initialPinchDist;
          const newZoom = Math.min(Math.max(MIN_ZOOM, initialZoom * scaleFactor), MAX_ZOOM);

          const originX = initialPinchCenter.x - rect.left;
          const originY = initialPinchCenter.y - rect.top;
          const currentOriginX = currentCenter.x - rect.left;
          const currentOriginY = currentCenter.y - rect.top;

          panX = currentOriginX - ((originX - initialPanX) / initialZoom) * newZoom;
          panY = currentOriginY - ((originY - initialPanY) / initialZoom) * newZoom;
          zoom = newZoom;

          applyTransform();
        }

      } else if (isDrawing && activePointers.size === 1 && !isPinching) {
        // SINGLE-POINTER DRAWING
        e.preventDefault();
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        checkInfiniteExpansion(p.y);
      }
    };

    // POINTER UP / CANCEL
    const stop = (e) => {
      if (e && e.pointerId !== undefined) {
        activePointers.delete(e.pointerId);
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }

      if (activePointers.size === 0) {
        isDrawing = false;
        isPinching = false;
        initialPinchDist = 0;
        strokeSnapshot = null;
      } else if (activePointers.size === 1) {
        // Prevent accidental drawing when lifting one finger from a pinch
        isDrawing = false;
      }
    };

    canvas.onpointerup = stop;
    canvas.onpointercancel = stop;

    // Desktop/Trackpad pinch-to-zoom (Wheel + Ctrl)
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const factor = e.deltaY < 0 ? 1.08 : 0.92;
          const newZoom = Math.min(Math.max(MIN_ZOOM, zoom * factor), MAX_ZOOM);
          const rect = scrollContainer.getBoundingClientRect();
          const focalX = e.clientX - rect.left;
          const focalY = e.clientY - rect.top;

          panX = focalX - (focalX - panX) * (newZoom / zoom);
          panY = focalY - (focalY - panY) * (newZoom / zoom);
          zoom = newZoom;
          applyTransform();
        }
      }, { passive: false });
    }

    // Screen rotation & window resizing
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvas && canvas.offsetParent !== null) {
          resizeCanvas(height, true);
          applyTransform();
        }
      }, 150);
    });
    window.addEventListener('orientationchange', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvas && canvas.offsetParent !== null) {
          resizeCanvas(height, true);
          applyTransform();
        }
      }, 200);
    });
  }

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
    applySettings();
  }

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

    setTimeout(() => {
      resizeCanvas(height, true);
      applyTransform();
    }, 30);
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
      applyTransform();
    }, 50);
  }

  return {
    init,
    setTool,
    extendHeight,
    clear,
    toggleFullScreen,
    toggleQuestion,
    resetZoom,
    zoomStep
  };
})();
