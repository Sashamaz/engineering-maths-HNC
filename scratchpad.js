/**
 * scratchpad.js - High-Res Canvas Scratchpad (Wacom Pen, Stylus & Touch)
 */
const Scratchpad = (function () {
  let canvas, ctx;
  let isDrawing = false;
  let tool = 'pen';
  let color = '#facc15';
  let height = 260;

  function init(resetHeight = false) {
    canvas = document.getElementById('scratchpad');
    if (!canvas) return;

    if (resetHeight) height = 260;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 650;

    // Preserve existing drawing when resizing
    let backup = null;
    if (!resetHeight && canvas.width > 0 && canvas.height > 0) {
      backup = document.createElement('canvas');
      backup.width = canvas.width;
      backup.height = canvas.height;
      backup.getContext('2d').drawImage(canvas, 0, 0);
    }

    canvas.style.height = height + 'px';
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx = canvas.getContext('2d');
    if (backup) {
      ctx.drawImage(backup, 0, 0);
    }
    ctx.scale(dpr, dpr);
    applySettings();

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: e.clientX - r.left,
        y: e.clientY - r.top
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
    };

    canvas.onpointermove = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
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
  }

  function applySettings() {
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
    }
  }

  function setTool(newTool, newColor) {
    tool = newTool;
    if (newColor) color = newColor;
    applySettings();
  }

  function extendHeight() {
    height += 200;
    init(false);
  }

  function clear() {
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  return {
    init,
    setTool,
    extendHeight,
    clear
  };
})();