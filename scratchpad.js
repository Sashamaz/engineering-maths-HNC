/**
 * scratchpad.js - True Infinite Viewport-Locked Canvas Scratchpad
 * Features:
 * - Edge-to-edge drawable surface in both normal and Full-Screen modes
 * - ResizeObserver auto-fitting (never gets stuck at a small internal box size)
 * - 2D Camera Zoom (50% to 300%) & Pan (infinite space in all directions)
 * - Manual Zoom Slider, [−] / [+] Buttons, 100% Reset, Pan Toggle & Undo
 * - Two-finger pinch-to-zoom & two-finger pan on touchscreens
 * - Full-screen overlay with collapsible question HUD
 */
const Scratchpad = (function () {
  let canvas, ctx;
  let scrollContainer = null;
  let resizeObserver = null;

  let isDrawing = false;
  let isPanning = false;
  let panMode = false;
  let tool = 'pen';
  let color = '#facc15';
  let isFullScreen = false;
  let isQuestionVisible = true;
  let normalHeight = 360;

  // Vector stroke storage so zooming/rotating never clips or blurs work
  let strokes = [];
  let currentStroke = null;
  let strokeStartTime = 0;

  // Infinite Camera state
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3.0;

  // Multi-touch Pinch & Pan state
  let startPinchDist = 0;
  let startPinchMid = { x: 0, y: 0 };
  let startZoom = 1.0;
  let startPanX = 0;
  let startPanY = 0;
  let panStartClient = { x: 0, y: 0 };

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
        height: 100dvh !important;
        max-height: 100dvh !important;
        border-radius: 0 !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        background-color: #020617 !important;
        padding: 10px 12px !important;
        box-sizing: border-box !important;
        transition: none !important;
      }
      .scratchpad-fullscreen #scratchpad-scroll-wrapper {
        flex: 1 1 0% !important;
        max-height: none !important;
        height: 100% !important;
        width: 100% !important;
      }
      #scratchpad-scroll-wrapper {
        touch-action: none !important;
        overflow: hidden !important;
        position: relative !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        width: 100% !important;
      }
      #scratchpad {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureZoomToolbar() {
    if (document.getElementById('scratchpad-zoom-bar')) return;
    if (!canvas) return;

    const wrapper = document.getElementById('scratchpad-scroll-wrapper') || canvas.parentElement;
    if (!wrapper || !wrapper.parentElement) return;

    const bar = document.createElement('div');
    bar.id = 'scratchpad-zoom-bar';
    bar.className = 'flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs shrink-0';
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
        <button type="button" id="scratchpad-zoom-label" onclick="Scratchpad.resetZoom()" class="font-mono text-[11px] bg-slate-900 hover:bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 shrink-0 transition" title="Reset Zoom & Center">100%</button>
      </div>
      <div class="flex items-center gap-1.5">
        <button type="button" id="btn-pan-mode" onclick="Scratchpad.togglePanMode()" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold transition" title="Toggle between Drawing and Moving the board">
          ✋ Move / Pan
        </button>
        <button type="button" onclick="Scratchpad.undo()" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition" title="Undo Last Stroke">
          ↩ Undo
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
      normalHeight = 360;
      zoom = 1.0;
      panX = 0;
      panY = 0;
      panMode = false;
      updatePanButtonUI();
      updateZoomUI();
    }

    syncViewportSize();
    setupEvents();
  }

  // Matches the internal canvas pixel resolution to 100% of the visible wrapper
  function syncViewportSize() {
    if (!canvas || !scrollContainer) return;

    if (!isFullScreen) {
      scrollContainer.style.height = normalHeight + 'px';
      scrollContainer.style.maxHeight = normalHeight + 'px';
    } else {
      scrollContainer.style.height = '100%';
      scrollContainer.style.maxHeight = 'none';
    }

    const rect = scrollContainer.getBoundingClientRect();
    const cssW = Math.floor(rect.width);
    const cssH = Math.floor(rect.height);

    // If tab is currently hidden (0x0), wait until visible
    if (cssW < 10 || cssH < 10) return;

    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.floor(cssW * dpr);
    const targetH = Math.floor(cssH * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx = canvas.getContext('2d');
    renderAll();
  }

  // Redraws all vector strokes through the 2D Camera matrix (Zoom + Pan)
  function renderAll() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;

    // 1. Clear full physical viewport
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 2. Apply Camera Transform (Zoom & Pan)
    ctx.save();
    ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, dpr * panX, dpr * panY);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < strokes.length; i++) {
      drawSingleStroke(strokes[i]);
    }
    if (currentStroke) {
      drawSingleStroke(currentStroke);
    }

    ctx.restore();
  }

  function drawSingleStroke(s) {
    if (!s || s.points.length === 0) return;
    ctx.beginPath();
    if (s.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 24 / zoom; // Keep eraser size comfortable at any zoom
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.4;
    }

    const pts = s.points;
    ctx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 1) {
      ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
    } else {
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
    }
    ctx.stroke();
  }

  // Converts screen touch/mouse coordinates into infinite world coordinates
  function getWorldPos(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    const screenX = clientX - r.left;
    const screenY = clientY - r.top;
    return {
      x: (screenX - panX) / zoom,
      y: (screenY - panY) / zoom
    };
  }

  function updateZoomUI() {
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
    const rect = canvas
      ? canvas.getBoundingClientRect()
      : { left: 0, top: 0, width: 500, height: 360 };

    const fx = focalClientX !== undefined ? (focalClientX - rect.left) : (rect.width / 2);
    const fy = focalClientY !== undefined ? (focalClientY - rect.top) : (rect.height / 2);

    panX = fx - ((fx - panX) / zoom) * clamped;
    panY = fy - ((fy - panY) / zoom) * clamped;
    zoom = clamped;

    updateZoomUI();
    renderAll();
  }

  function zoomBy(delta) {
    setZoom(zoom + delta);
  }

  function resetZoom() {
    zoom = 1.0;
    panX = 0;
    panY = 0;
    updateZoomUI();
    renderAll();
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
      btn.className = 'text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded border border-amber-300 font-bold transition shadow';
      if (canvas) canvas.style.cursor = 'grab';
    } else {
      btn.innerHTML = '✋ Move / Pan';
      btn.className = 'text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold transition';
      if (canvas) canvas.style.cursor = 'crosshair';
    }
  }

  function undo() {
    if (strokes.length > 0) {
      strokes.pop();
      renderAll();
    }
  }

  function setupEvents() {
    if (canvas._hasEvents) return;
    canvas._hasEvents = true;

    // Automatically resize the drawable surface whenever wrapper dimensions change
    if (window.ResizeObserver && scrollContainer && !resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        syncViewportSize();
      });
      resizeObserver.observe(scrollContainer);
    }

    // =========================================================================
    // 1. TOUCHSCREEN ENGINE (1 Finger = Draw/Pan, 2 Fingers = Pinch Zoom & Pan)
    // =========================================================================
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      syncViewportSize();

      if (e.touches.length === 1) {
        const t = e.touches[0];
        if (panMode) {
          isDrawing = false;
          isPanning = true;
          panStartClient = { x: t.clientX - panX, y: t.clientY - panY };
        } else {
          isPanning = false;
          isDrawing = true;
          strokeStartTime = Date.now();
          const p = getWorldPos(t.clientX, t.clientY);
          currentStroke = { tool, color, points: [p] };
          renderAll();
        }
      } else if (e.touches.length >= 2) {
        // Second finger touched down: discard accidental tap dot & start pinch/pan
        if (isDrawing && currentStroke && (Date.now() - strokeStartTime < 300)) {
          currentStroke = null;
        } else if (isDrawing && currentStroke) {
          strokes.push(currentStroke);
          currentStroke = null;
        }
        isDrawing = false;
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
        renderAll();
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
          const rect = canvas.getBoundingClientRect();
          const scale = curDist / startPinchDist;
          const newZoom = Math.min(Math.max(MIN_ZOOM, startZoom * scale), MAX_ZOOM);

          const startRelX = startPinchMid.x - rect.left;
          const startRelY = startPinchMid.y - rect.top;
          const curRelX = curMid.x - rect.left;
          const curRelY = curMid.y - rect.top;

          panX = curRelX - ((startRelX - startPanX) / startZoom) * newZoom;
          panY = curRelY - ((startRelY - startPanY) / startZoom) * newZoom;
          zoom = newZoom;

          updateZoomUI();
          renderAll();
        }
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        if (isPanning && panMode) {
          panX = t.clientX - panStartClient.x;
          panY = t.clientY - panStartClient.y;
          renderAll();
        } else if (isDrawing && currentStroke && !panMode) {
          const p = getWorldPos(t.clientX, t.clientY);
          currentStroke.points.push(p);
          renderAll();
        }
      }
    }, { passive: false });

    const handleTouchEnd = (e) => {
      if (isDrawing && currentStroke) {
        strokes.push(currentStroke);
        currentStroke = null;
        renderAll();
      }
      if (e.touches.length === 0) {
        isDrawing = false;
        isPanning = false;
        startPinchDist = 0;
      } else if (e.touches.length === 1) {
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
      if (e.pointerType === 'touch') return;
      e.preventDefault();
      syncViewportSize();

      if (panMode || e.button === 1) {
        isPanning = true;
        isDrawing = false;
        panStartClient = { x: e.clientX - panX, y: e.clientY - panY };
      } else {
        isDrawing = true;
        isPanning = false;
        const p = getWorldPos(e.clientX, e.clientY);
        currentStroke = { tool, color, points: [p] };
        renderAll();
      }
    });

    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      if (e.buttons === 0) {
        if (isDrawing && currentStroke) {
          strokes.push(currentStroke);
          currentStroke = null;
          renderAll();
        }
        isDrawing = false;
        isPanning = false;
        return;
      }

      if (isPanning) {
        e.preventDefault();
        panX = e.clientX - panStartClient.x;
        panY = e.clientY - panStartClient.y;
        renderAll();
      } else if (isDrawing && currentStroke) {
        e.preventDefault();
        const p = getWorldPos(e.clientX, e.clientY);
        currentStroke.points.push(p);
        renderAll();
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') return;
      if (isDrawing && currentStroke) {
        strokes.push(currentStroke);
        currentStroke = null;
        renderAll();
      }
      isDrawing = false;
      isPanning = false;
    });

    // Trackpad pinch & Mouse Wheel support
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          const delta = e.deltaY < 0 ? 0.15 : -0.15;
          setZoom(zoom + delta, e.clientX, e.clientY);
        } else {
          // Two-finger trackpad scroll or mouse wheel pans the infinite board
          panX -= e.deltaX;
          panY -= e.deltaY;
          renderAll();
        }
      }, { passive: false });
    }

    window.addEventListener('resize', syncViewportSize);
    window.addEventListener('orientationchange', () => {
      setTimeout(syncViewportSize, 100);
    });
  }

  function setTool(newTool, newColor) {
    tool = newTool;
    if (newColor) color = newColor;
    if (panMode) {
      panMode = false;
      updatePanButtonUI();
    }
  }

  // "+ Space" shifts the canvas upward to give fresh writing room at the bottom
  function extendHeight(extra = 300) {
    if (!isFullScreen) {
      normalHeight += 220;
      syncViewportSize();
    } else {
      panY -= 250;
      renderAll();
    }
  }

  function clear() {
    strokes = [];
    currentStroke = null;
    panX = 0;
    panY = 0;
    renderAll();
    if (isFullScreen) {
      setTimeout(syncQuestionContent, 20);
    }
  }

  // =========================================================================
  // FULL-SCREEN MODE & COLLAPSIBLE QUESTION BANNER
  // =========================================================================
  function ensureQuestionBanner(box) {
    let banner = document.getElementById('scratchpad-fs-question');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'scratchpad-fs-question';
      banner.className = 'bg-slate-900/95 border border-indigo-500/40 rounded-xl p-3 mb-2 shadow-xl backdrop-blur shrink-0';
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

    syncViewportSize();
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

    // Immediate sync + fallback frame sync
    syncViewportSize();
    requestAnimationFrame(syncViewportSize);
  }

  return {
    init,
    setTool,
    extendHeight,
    clear,
    undo,
    toggleFullScreen,
    toggleQuestion,
    setZoom,
    zoomBy,
    resetZoom,
    togglePanMode
  };
})();
