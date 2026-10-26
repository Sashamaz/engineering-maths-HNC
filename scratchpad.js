/**
 * scratchpad.js - High-Res Canvas Scratchpad
 * Features:
 * - Native two-finger pinch-to-zoom & pan (50% to 400%)
 * - Visible toolbar zoom controls ([-] 100% [+])
 * - Hardware multi-touch detection (impossible to draw lines between 2 fingers)
 * - Dynamic Full-Screen Question HUD with Collapse / Expand toggle
 * - Zero-drift orientation, rotation & zoom coordinate compensation
 * - Infinite downward scrolling
 */
const Scratchpad = (function () {
  let canvas, ctx;
  let isDrawing = false;
  let isTouchActive = false;
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

  // Pinch tracking
  let lastPinchDist = 0;
  let lastPinchCenter = { x: 0, y: 0 };
  let strokeBackup = null;
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

    // Mathematically exact coordinate calculation compensating for zoom, pan, and DPI
    const getPos = (touchOrPointer) => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const scaleX = (canvas.width / dpr) / (r.width || 1);
      const scaleY = (canvas.height / dpr) / (r.height || 1);
      return {
        x: (touchOrPointer.clientX - r.left) * scaleX,
        y: (touchOrPointer.clientY - r.top) * scaleY
      };
    };

    const getTouchDist = (touches) => {
      return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
    };

    const getTouchCenter = (touches) => {
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
      };
    };

    // =========================================================================
    // NATIVE TOUCH EVENTS (Guarantees zero lines when 2 fingers touch)
    // =========================================================================
    canvas.addEventListener('touchstart', (e) => {
      isTouchActive = true;

      if (e.touches.length === 1) {
        // EXACTLY 1 FINGER: Start drawing
        isDrawing = true;

        if (!strokeBackup) strokeBackup = document.createElement('canvas');
        strokeBackup.width = canvas.width;
        strokeBackup.height = canvas.height;
        strokeBackup.getContext('2d').drawImage(canvas, 0, 0);
        strokeStartTime = Date.now();

        applySettings();
        const p = getPos(e.touches[0]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);

      } else if (e.touches.length >= 2) {
        // 2 OR MORE FINGERS: CANCEL DRAWING IMMEDIATELY
        isDrawing = false;

        // Erase any small stray dot drawn during the first 250ms of the gesture
        if (strokeBackup && (Date.now() - strokeStartTime < 250)) {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(strokeBackup, 0, 0);
          ctx.restore();
          applySettings();
        }

        lastPinchDist = getTouchDist(e.touches);
        lastPinchCenter = getTouchCenter(e.touches);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (e.touches.length >= 2) {
        // STRICT PINCH & PAN — NEVER DRAW
        isDrawing = false;
        const currentDist = getTouchDist(e.touches);
        const currentCenter = getTouchCenter(e.touches);

        if (lastPinchDist > 0 && currentDist > 0) {
          const factor = currentDist / lastPinchDist;
          const newZoom = Math.min(Math.max(MIN_ZOOM, zoom * factor), MAX_ZOOM);

          const containerRect = scrollContainer ? scrollContainer.getBoundingClientRect() : { left: 0, top: 0 };
          const focalX = currentCenter.x - containerRect.left;
          const focalY = currentCenter.y - containerRect.top;

          panX = focalX - (focalX - panX) * (newZoom / zoom) + (currentCenter.x - lastPinchCenter.x);
          panY = focalY - (focalY - panY) * (newZoom / zoom) + (currentCenter.y - lastPinchCenter.y);
          zoom = newZoom;

          applyTransform();
          lastPinchDist = currentDist;
          lastPinchCenter = currentCenter;
        }

      } else if (e.touches.length === 1 && isDrawing) {
        // STRICT 1-FINGER DRAWING
        const p = getPos(e.touches[0]);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        checkInfiniteExpansion(p.y);
      }
    }, { passive: false });

    const endTouch = (e) => {
      if (e.touches.length === 0) {
        isDrawing = false;
        lastPinchDist = 0;
        setTimeout(() => { isTouchActive = false; }, 80);
      } else if (e.touches.length === 1) {
        // Prevent drawing when lifting only 1 finger from a pinch
        isDrawing = false;
        lastPinchDist = 0;
      }
    };

    canvas.addEventListener('touchend', endTouch);
    canvas.addEventListener('touchcancel', endTouch);

    // =========================================================================
    // MOUSE & WACOM STYLUS EVENTS (Desktop / PC)
    // =========================================================================
    canvas.addEventListener('pointerdown', (e) => {
      if (isTouchActive || e.pointerType === 'touch') return;
      e.preventDefault();
      isDrawing = true;
      applySettings();
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (isTouchActive || e.pointerType === 'touch') return;
      if (!isDrawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      checkInfiniteExpansion(p.y);
    });

    const stopPointer = (e) => {
      if (isTouchActive || (e && e.pointerType === 'touch')) return;
      isDrawing = false;
    };
    canvas.addEventListener('pointerup', stopPointer);
    canvas.addEventListener('pointercancel', stopPointer);

    // Trackpad / Mouse Wheel Zoom
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const factor = e.deltaY < 0 ? 1.08 : 0.92;
          const newZoom = Math.min(Math.max(MIN_ZOOM, zoom * factor), MAX_ZOOM);
          const containerRect = scrollContainer.getBoundingClientRect();
          const focalX = e.clientX - containerRect.left;
          const focalY = e.clientY - containerRect.top;

          panX = focalX - (focalX - panX) * (newZoom / zoom);
          panY = focalY - (focalY - panY) * (newZoom / zoom);
          zoom = newZoom;
          applyTransform();
        }
      }, { passive: false });
    }

    // Window Resize / Orientation
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
