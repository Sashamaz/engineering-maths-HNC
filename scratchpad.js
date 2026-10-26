/**
 * scratchpad.js - High-Res Canvas Scratchpad
 * Features:
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
  let scrollContainer = null;

  // Inject required full-screen styles automatically
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
        padding: 12px !important;
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

  // Full-Screen Toggle
  function toggleFullScreen() {
    const box = document.getElementById('scratchpad-box');
    const fsBtn = document.getElementById('btn-fullscreen');
    if (!box) return;

    isFullScreen = !isFullScreen;

    if (isFullScreen) {
      box.classList.add('scratchpad-fullscreen');
      if (fsBtn) {
        fsBtn.innerHTML = '✕ Exit Fullscreen';
        fsBtn.classList.replace('bg-indigo-950', 'bg-red-900');
        fsBtn.classList.replace('text-indigo-300', 'text-white');
      }
    } else {
      box.classList.remove('scratchpad-fullscreen');
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
    toggleFullScreen
  };
})();
