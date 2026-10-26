/**
 * scratchpad.js - High-Res Canvas Scratchpad
 * Features:
 * - Two-finger pinch-to-zoom & spread-to-zoom (50% to 400%)
 * - Two-finger pan navigation
 * - Dynamic Full-Screen Question HUD with Collapse / Expand toggle
 * - Zero-drift orientation, rotation & zoom coordinate compensation
 * - Infinite downward scrolling
 * - Active Wacom Stylus, Apple Pencil & Touch support
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

  // Zoom & Pan state
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4.0;

  // Multi-touch tracking
  const activePointers = new Map();
  let lastPinchDist = 0;
  let lastPinchCenter = { x: 0, y: 0 };
  let strokeBackup = null;
  let strokeStartTime = 0;

  // Inject full-screen layout, touch-action and zoom styling
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
        transform-origin: 0 0;
        touch-action: none !important;
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureZoomButton() {
    if (document.getElementById('btn-zoom-reset')) return;
    const toolbar = document.querySelector('#scratchpad-box .flex-wrap.items-center');
    if (!toolbar) return;

    const zoomBtn = document.createElement('button');
    zoomBtn.id = 'btn-zoom-reset';
    zoomBtn.type = 'button';
    zoomBtn.title = 'Tap to reset zoom to 100%';
    zoomBtn.className = 'text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono px-2 py-1 rounded border border-slate-700 transition';
    zoomBtn.innerText = '100%';
    zoomBtn.onclick = resetZoom;

    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      toolbar.insertBefore(zoomBtn, fsBtn);
    } else {
      toolbar.appendChild(zoomBtn);
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

    ensureZoomButton();
    resizeCanvas(height, !resetHeight);
    applyTransform();
    setupEvents();
  }

  function resizeCanvas(newHeight, preserveContent = true) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssWidth = (scrollContainer && scrollContainer.clientWidth > 0) 
      ? scrollContainer.clientWidth 
      : (rect.width || 650);

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

  function applyTransform() {
    if (!canvas) return;
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;

    const zoomBtn = document.getElementById('btn-zoom-reset');
    if (zoomBtn) {
      zoomBtn.innerText = `${Math.round(zoom * 100)}%`;
      if (Math.abs(zoom - 1.0) > 0.05 || Math.abs(panX) > 4 || Math.abs(panY) > 4) {
        zoomBtn.classList.add('text-amber-300', 'border-amber-500/50', 'bg-slate-900');
        zoomBtn.classList.remove('text-slate-300', 'border-slate-700', 'bg-slate-800');
      } else {
        zoomBtn.classList.remove('text-amber-300', 'border-amber-500/50', 'bg-slate-900');
        zoomBtn.classList.add('text-slate-300', 'border-slate-700', 'bg-slate-800');
      }
    }
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

    // Mathematically exact position ratio compensating for device DPI, CSS zoom & Pan
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
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });

      if (activePointers.size === 1) {
        // Single pointer: prepare to draw
        if (canvas.setPointerCapture) {
          try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        }

        // Backup canvas in case second finger joins for a pinch gesture
        if (!strokeBackup) {
          strokeBackup = document.createElement('canvas');
        }
        strokeBackup.width = canvas.width;
        strokeBackup.height = canvas.height;
        strokeBackup.getContext('2d').drawImage(canvas, 0, 0);
        strokeStartTime = Date.now();

        isDrawing = true;
        applySettings();
        const p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        checkInfiniteExpansion(p.y);

      } else if (activePointers.size >= 2) {
        // Two fingers detected: abort drawing & clear accidental stray tap mark
        isDrawing = false;
        if (strokeBackup && (Date.now() - strokeStartTime < 250)) {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(strokeBackup, 0, 0);
          ctx.restore();
          applySettings();
        }

        const pts = Array.from(activePointers.values());
        lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        lastPinchCenter = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      }
    };

    canvas.onpointermove = (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });

      if (activePointers.size >= 2) {
        // Multi-touch active: execute pinch-to-zoom and two-finger pan
        const pts = Array.from(activePointers.values());
        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const currentCenter = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };

        if (lastPinchDist > 0 && currentDist > 0) {
          const factor = currentDist / lastPinchDist;
          const newZoom = Math.min(Math.max(MIN_ZOOM, zoom * factor), MAX_ZOOM);

          // Zoom centered around touch midpoint
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

      } else if (activePointers.size === 1 && isDrawing) {
        // Single pointer active: draw line
        e.preventDefault();
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        checkInfiniteExpansion(p.y);
      }
    };

    const stop = (e) => {
      if (e && e.pointerId !== undefined) {
        activePointers.delete(e.pointerId);
        if (canvas.releasePointerCapture) {
          try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      }

      if (activePointers.size < 2) {
        lastPinchDist = 0;
      }
      if (activePointers.size === 0) {
        isDrawing = false;
      }
    };

    canvas.onpointerup = stop;
    canvas.onpointercancel = stop;

    // Desktop/Trackpad pinch-to-zoom (Wheel + Ctrl/Meta)
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
          const newZoom = Math.min(Math.max(MIN_ZOOM, zoom * zoomFactor), MAX_ZOOM);

          const containerRect = scrollContainer.getBoundingClientRect();
          const focalX = e.clientX - containerRect.left;
          const focalY = e.clientY - containerRect.top;

          panX = focalX - (focalX - panX) * (newZoom / zoom);
          panY = focalY - (focalY - panY) * (newZoom / zoom);
          zoom = newZoom;

          applyTransform();
        } else if (e.shiftKey) {
          // Shift + Wheel pan horizontally
          panX -= e.deltaY;
          applyTransform();
        }
      }, { passive: false });
    }

    // Suppress native iOS Safari gesture zoom overrides
    const preventGesture = (e) => e.preventDefault();
    canvas.addEventListener('gesturestart', preventGesture);
    canvas.addEventListener('gesturechange', preventGesture);
    canvas.addEventListener('gestureend', preventGesture);

    // Screen Rotation & Window Resize compensation
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvas && canvas.offsetParent !== null) {
          resizeCanvas(height, true);
          applyTransform();
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
    resetZoom
  };
})();
