/**
 * scratchpad.js - High-Res Canvas Scratchpad
 * Features:
 * - Manual Zoom Slider (50% to 300%), [−] / [+] Buttons, 100% Reset & Pan Mode Toggle
 * - Two-finger pinch-to-zoom & two-finger pan on touchscreens
 * - Hardware-backed touch & stylus separation (cannot deadlock or get stuck)
 * - Zero-drift coordinate scaling across all zoom levels & screen rotations
 * - Infinite downward expansion
 * - Full-screen overlay with collapsible question HUD
 */
const Scratchpad = (function () {
  let canvas, ctx;
  let isDrawing = false;
  let isPanning = false;
  let panMode = false; // Toggleable 1-finger/mouse pan tool
  let tool = 'pen';
  let color = '#facc15';
  let height = 320;
  let logicalWidth = 650;
  let isFullScreen = false;
  let isQuestionVisible = true;
  let scrollContainer = null;

  // Zoom & Pan transform state
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3.0;

  // Pinch & Pan tracking
  let startPinchDist = 0;
  let startPinchMid = { x: 0, y: 0 };
  let startZoom = 1.0;
  let startPanX = 0;
  let startPanY = 0;
  let panStartClient = { x: 0, y: 0 };

  // Snapshot to erase accidental dot when 2nd finger touches down
  let strokeSnapshot = null;
  let strokeStartTime = 0;

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
        user-select: none !important;
        -webkit-user-select: none !important;
      }
      #scratchpad {
        transform-origin: 0 0 !important;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Injects the visible Zoom Buttons + Slider + Pan bar right above the canvas
  function ensureZoomToolbar() {
    if (document.getElementById('scratchpad-zoom-bar')) return;
    if (!canvas) return;

    const wrapper = document.getElementById('scratchpad-scroll-wrapper') || canvas.parentElement;
    if (!wrapper || !wrapper.parentElement) return;

    const bar = document.createElement('div');
    bar.id = 'scratchpad-zoom-bar';
    bar.className = 'flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs';
    bar.innerHTML = `
      <div class="flex items-center gap-1.5 flex-grow max-w-xs">
        <span class="text-[11px] text-slate-400 font-semibold shrink-0">🔍 Zoom:</span>
        <button type="button" onclick="Scratchpad.zoomBy(-0.2)" class="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded border border-slate-700 transition" title="Zoom Out">−</button>
        <input 
          type="range" 
          id="scratchpad-zoom-slider" 
          min="50" 
          max="300" 
          step="5" 
          value="100" 
          oninput="Scratchpad.setZoom(this.value / 100)"
          class="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <button type="button" onclick="Scratchpad.zoomBy(0.2)" class="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded border border-slate-700 transition" title="Zoom In">+</button>
        <button type="button" id="scratchpad-zoom-label" onclick="Scratchpad.resetZoom()" class="font-mono text-[11px] bg-slate-900 hover:bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 shrink-0 transition" title="Reset Zoom & Position">100%</button>
      </div>
      <div class="flex items-center gap-1.5">
        <button type="button" id="btn-pan-mode" onclick="Scratchpad.togglePanMode()" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold transition" title="Toggle between Drawing and Panning">
          ✋ Move / Pan
        </button>
        <button type="button" onclick="Scratchpad.resetZoom()" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded border border-slate-700 transition">
          Center
        </button>
      </div>
    `;

    wrapper.parentElement.insertBefore(bar, wrapper);
  }

  function init(resetHeight = false) {
    injectStyles();
    canvas = document.getElementById('scratchpad');
    if (!canvas) return;

    scrollContainer = document.getElementById('scratchpad-scroll-wrapper') || canvas.parentElement;
    ensureZoomToolbar();

    if (resetHeight) {
      height = isFullScreen ? Math.max(window.innerHeight * 1.5, 600) : 320;
      zoom = 1.0;
      panX = 0;
      panY = 0;
      panMode = false;
      updatePanButtonUI();
    }

    resizeCanvas(height, !resetHeight);
    applyTransform();
    setupEvents();
  }

  function resizeCanvas(newHeight, preserveContent = true) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const wrapperWidth = scrollContainer ? scrollContainer.clientWidth : 0;
    logicalWidth = wrapperWidth > 50 ? wrapperWidth : 650;

    let backup = null;
    if (preserveContent && canvas.width > 0 && canvas.height > 0) {
      backup = document.createElement('canvas');
      backup.width = canvas.width;
      backup.height = canvas.height;
      backup.getContext('2d').drawImage(canvas, 0, 0);
    }

    height = Math.max(newHeight, isFullScreen ? window.innerHeight : 320);
    canvas.style.height = height + 'px';
    canvas.width = Math.floor(logicalWidth * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (backup) {
      ctx.drawImage(backup, 0, 0);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    applySettings();
  }

  function applyTransform() {
    if (!canvas) return;
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;

    const pct = Math.round(zoom * 100);
    const label = document.getElementById('scratchpad-zoom-label');
    if (label) label.innerText = `${pct}%`;

    const slider = document.getElementById('scratchpad-zoom-slider');
    if (slider && parseInt(slider.value, 10) !== pct) {
      slider.value = pct;
    }
  }

  function setZoom(newZoomVal, focalClientX, focalClientY) {
    const clamped = Math.min(Math.max(MIN_ZOOM, newZoomVal), MAX_ZOOM);
    const wrapRect = scrollContainer
      ? scrollContainer.getBoundingClientRect()
      : { left: 0, top: 0, width: 400, height: 300 };

    const fx = focalClientX !== undefined ? (focalClientX - wrapRect.left) : (wrapRect.width / 2);
    const fy = focalClientY !== undefined ? (focalClientY - wrapRect.top) : (wrapRect.height / 2);

    panX = fx - ((fx - panX) / zoom) * clamped;
    panY = fy - ((fy - panY) / zoom) * clamped;
    zoom = clamped;

    applyTransform();
  }

  function zoomBy(delta) {
    setZoom(zoom + delta);
  }

  function resetZoom() {
    zoom = 1.0;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function togglePanMode() {
    panMode = !panMode;
    updatePanButtonUI();
  }

  function updatePanButtonUI() {
    const btn = document.getElementById('btn-pan-mode');
    if (!btn) return;
    if (panMode) {
      btn.innerHTML = '✏️ Draw Mode';
      btn.className = 'text-[11px] bg-amber-600 hover:bg-amber-500 text-slate-950 px-2.5 py-1 rounded border border-amber-400 font-bold transition shadow';
      if (canvas) canvas.style.cursor = 'grab';
    } else {
      btn.innerHTML = '✋ Move / Pan';
      btn.className = 'text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold transition';
      if (canvas) canvas.style.cursor = 'crosshair';
    }
  }

  // Exact coordinate calculation using the live transformed canvas bounding box
  function getPos(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const internalW = canvas.width / dpr;
    const internalH = canvas.height / dpr;
    return {
      x: (clientX - r.left) * (internalW / (r.width || internalW)),
      y: (clientY - r.top) * (internalH / (r.height || internalH))
    };
  }

  function takeSnapshot() {
    if (!canvas || canvas.width === 0) return;
    if (!strokeSnapshot) strokeSnapshot = document.createElement('canvas');
    strokeSnapshot.width = canvas.width;
    strokeSnapshot.height = canvas.height;
    strokeSnapshot.getContext('2d').drawImage(canvas, 0, 0);
    strokeStartTime = Date.now();
  }

  function restoreSnapshotIfRecent() {
    if (strokeSnapshot && (Date.now() - strokeStartTime < 300)) {
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(strokeSnapshot, 0, 0);
      ctx.restore();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applySettings();
    }
  }

  function setupEvents() {
    if (canvas._hasEvents) return;
    canvas._hasEvents = true;

    // =========================================================================
    // 1. TOUCHSCREEN ENGINE (1 Finger = Draw/Pan, 2 Fingers = Pinch Zoom & Pan)
    // =========================================================================
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();

      // Ensure canvas is properly sized if initialized while tab was hidden
      if (scrollContainer && scrollContainer.clientWidth > 50 && Math.abs(scrollContainer.clientWidth - logicalWidth) > 20) {
        resizeCanvas(height, true);
      }

      if (e.touches.length === 1) {
        const t = e.touches[0];
        if (panMode) {
          isDrawing = false;
          isPanning = true;
          panStartClient = { x: t.clientX - panX, y: t.clientY - panY };
        } else {
          isPanning = false;
          isDrawing = true;
          takeSnapshot();
          applySettings();
          const p = getPos(t.clientX, t.clientY);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 0.1, p.y + 0.1);
          ctx.stroke();
        }
      } else if (e.touches.length >= 2) {
        // Two fingers down: cancel drawing & start pinch-to-zoom
        if (isDrawing) {
          isDrawing = false;
          restoreSnapshotIfRecent();
        }
        isPanning = false;

        const t0 = e.touches[0];
        const t1 = e.touches[1];
        startPinchDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        startPinchMid = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2
        };
        startZoom = zoom;
        startPanX = panX;
        startPanY = panY;
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (e.touches.length >= 2) {
        isDrawing = false;
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const curDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        const curMid = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2
        };

        if (startPinchDist > 10) {
          const wrapRect = scrollContainer.getBoundingClientRect();
          const scale = curDist / startPinchDist;
          const newZoom = Math.min(Math.max(MIN_ZOOM, startZoom * scale), MAX_ZOOM);

          const startRelX = startPinchMid.x - wrapRect.left;
          const startRelY = startPinchMid.y - wrapRect.top;
          const curRelX = curMid.x - wrapRect.left;
          const curRelY = curMid.y - wrapRect.top;

          panX = curRelX - ((startRelX - startPanX) / startZoom) * newZoom;
          panY = curRelY - ((startRelY - startPanY) / startZoom) * newZoom;
          zoom = newZoom;

          applyTransform();
        }
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        if (isPanning && panMode) {
          panX = t.clientX - panStartClient.x;
          panY = t.clientY - panStartClient.y;
          applyTransform();
        } else if (isDrawing && !panMode) {
          const p = getPos(t.clientX, t.clientY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          checkInfiniteExpansion(p.y);
        }
      }
    }, { passive: false });

    const handleTouchEnd = (e) => {
      if (e.touches.length === 0) {
        isDrawing = false;
        isPanning = false;
        startPinchDist = 0;
      } else if (e.touches.length === 1) {
        // Don't start an accidental line when lifting 1 finger after a 2-finger pinch
        isDrawing = false;
        startPinchDist = 0;
      }
    };

    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    // =========================================================================
    // 2. MOUSE & WACOM STYLUS ENGINE (Desktop / Laptop / Stylus Pen)
    // =========================================================================
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // Handled by native touch engine above
      e.preventDefault();

      if (scrollContainer && scrollContainer.clientWidth > 50 && Math.abs(scrollContainer.clientWidth - logicalWidth) > 20) {
        resizeCanvas(height, true);
      }

      if (panMode || e.button === 1) {
        isPanning = true;
        isDrawing = false;
        panStartClient = { x: e.clientX - panX, y: e.clientY - panY };
      } else {
        isDrawing = true;
        isPanning = false;
        applySettings();
        const p = getPos(e.clientX, e.clientY);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 0.1, p.y + 0.1);
        ctx.stroke();
      }
    });

    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      if (e.buttons === 0) {
        isDrawing = false;
        isPanning = false;
        return;
      }

      if (isPanning) {
        e.preventDefault();
        panX = e.clientX - panStartClient.x;
        panY = e.clientY - panStartClient.y;
        applyTransform();
      } else if (isDrawing) {
        e.preventDefault();
        const p = getPos(e.clientX, e.clientY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        checkInfiniteExpansion(p.y);
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') return;
      isDrawing = false;
      isPanning = false;
    });

    // Trackpad pinch & Ctrl+Wheel zoom on PC/Mac
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY < 0 ? 0.15 : -0.15;
          setZoom(zoom + delta, e.clientX, e.clientY);
        }
      }, { passive: false });
    }

    // Orientation & Window Resize listener
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvas && canvas.offsetParent !== null) {
          resizeCanvas(height, true);
          applyTransform();
        }
      }, 150);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
  }

  function checkInfiniteExpansion(yPos) {
    if (yPos > height - 100) {
      extendHeight(450);
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
    // Automatically switch back to Draw mode if user clicks a pen or eraser
    if (panMode) {
      panMode = false;
      updatePanButtonUI();
    }
    applySettings();
  }

  function extendHeight(extra = 400) {
    resizeCanvas(height + extra, true);
    applyTransform();
  }

  function clear() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    applySettings();
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
    setZoom,
    zoomBy,
    resetZoom,
    togglePanMode
  };
})();
