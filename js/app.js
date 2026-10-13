/*
  app.js: the program of the gap text exercise.
  - builds the code view and the element area from data.js
  - drag and drop with mouse and touch (pointer events)
  - "Prüfen" (check), score, "Zurücksetzen" (reset)
*/
(function () {
  'use strict';

  var D = window.AUFGABE;

  // ---------- elements (drag and drop items) ----------
  var gapIds = Object.keys(D.luecken).map(Number).sort(function (a, b) { return a - b; });
  var elements = [];
  gapIds.forEach(function (n) {
    elements.push({ id: 'e' + elements.length, text: D.luecken[n][0] });
  });
  D.zusatzElemente.forEach(function (t) {
    elements.push({ id: 'e' + elements.length, text: t });
  });
  var elById = {};
  elements.forEach(function (e) { elById[e.id] = e; });

  // ---------- state ----------
  var state = {
    inGap: {},     // gap number -> element id (or null)
    marks: {},     // gap number -> 'richtig' | 'falsch'
    score: null    // { correct, total } after "Prüfen"
  };
  gapIds.forEach(function (n) { state.inGap[n] = null; });

  // ---------- helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  var ICON_RICHTIG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1E7B4B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.5"/></svg>';
  var ICON_FALSCH = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#B3261E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>';

  function icon(mark) {
    var s = el('span', 'marke');
    s.innerHTML = mark === 'richtig' ? ICON_RICHTIG : ICON_FALSCH;
    s.title = mark === 'richtig' ? 'richtig' : 'falsch';
    return s;
  }

  // Sorting: alphabetically by name; a leading "<", "</" or "<!" and a trailing ">"
  // are ignored. Elements consisting only of symbols come first.
  function sortKey(text) {
    return text.toLowerCase().replace(/^<[\/!]?/, '').replace(/>$/, '');
  }
  function hasLetter(key) { return /[a-z0-9äöüß]/.test(key); }
  var collator = new Intl.Collator('de');
  function compareElements(a, b) {
    var ka = sortKey(a.text), kb = sortKey(b.text);
    var la = hasLetter(ka) ? 1 : 0, lb = hasLetter(kb) ? 1 : 0;
    if (la !== lb) return la - lb;
    var c = collator.compare(ka, kb);
    if (c !== 0) return c;
    c = collator.compare(a.text, b.text);
    if (c !== 0) return c;
    return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
  }

  function findGapOf(elId) {
    for (var i = 0; i < gapIds.length; i++) {
      if (state.inGap[gapIds[i]] === elId) return gapIds[i];
    }
    return null;
  }

  // ---------- build the code view ----------
  var codeEl = document.getElementById('code');
  var listEl = document.getElementById('elemente-liste');
  var trayEl = document.getElementById('elemente');
  var scoreEl = document.getElementById('punkte');
  var btnCheck = document.getElementById('btn-pruefen');
  var btnReset = document.getElementById('btn-zuruecksetzen');
  var codeAreaEl = document.getElementById('code-bereich');

  var gapEls = {}; // gap number -> element

  D.zeilen.forEach(function (parts, i) {
    var line = el('div', 'zeile');
    line.appendChild(el('span', 'zeilennr', String(i + 1)));
    var src = el('span', 'quelltext');
    parts.forEach(function (p) {
      if (p.gap) {
        var g = el('span', 'luecke leer');
        g.dataset.gap = String(p.gap);
        gapEls[p.gap] = g;
        src.appendChild(g);
      } else {
        src.appendChild(el('span', 't-' + p.k, p.t));
      }
    });
    line.appendChild(src);
    codeEl.appendChild(line);
  });

  // ---------- rendering ----------
  function chipEl(elm, mark) {
    var c = el('span', 'chip', elm.text);
    c.dataset.el = elm.id;
    if (mark) c.appendChild(icon(mark));
    return c;
  }

  function renderGaps() {
    gapIds.forEach(function (n) {
      var g = gapEls[n];
      var elId = state.inGap[n];
      var mark = state.marks[n];
      g.className = 'luecke' + (elId ? '' : ' leer') + (mark ? ' ' + mark : '');
      g.textContent = '';
      if (elId) g.appendChild(chipEl(elById[elId], mark));
      else if (mark) g.appendChild(icon(mark));
    });
  }

  function renderList() {
    var placed = {};
    gapIds.forEach(function (n) { if (state.inGap[n]) placed[state.inGap[n]] = true; });
    var free = elements.filter(function (e) { return !placed[e.id]; }).sort(compareElements);
    listEl.textContent = '';
    free.forEach(function (e) { listEl.appendChild(chipEl(e, null)); });
  }

  function renderStatus() {
    if (state.score) {
      scoreEl.hidden = false;
      scoreEl.textContent = state.score.correct + ' von ' + state.score.total + ' richtig';
    } else {
      scoreEl.hidden = true;
      scoreEl.textContent = '';
    }
    var allCorrect = gapIds.every(function (n) { return state.marks[n] === 'richtig'; });
    btnCheck.hidden = allCorrect;
  }

  function render() {
    renderGaps();
    renderList();
    renderStatus();
  }

  // ---------- moving elements ----------
  // gapN === null: back to the element area
  function place(elId, gapN) {
    var from = findGapOf(elId);
    if (gapN === from) return;
    if (from !== null) {
      state.inGap[from] = null;
      delete state.marks[from];
    }
    if (gapN !== null) {
      // an element that was in the target gap returns to the element area automatically
      state.inGap[gapN] = elId;
      delete state.marks[gapN];
    }
    render();
  }

  // ---------- drag and drop (mouse and touch) ----------
  var HOLD_MS = 220;      // touch: hold this long to start dragging (otherwise it scrolls)
  var MOUSE_THRESHOLD = 5; // mouse: pixels before a drag starts
  var TOUCH_CANCEL = 10;   // touch: moving further than this before the hold = scrolling
  var TOUCH_OFFSET_Y = -44; // touch: the dragged element is shown above the finger

  var drag = null;
  var scrollFrame = null;

  function dropPoint() {
    return { x: drag.cx, y: drag.cy + drag.offY };
  }

  function onDown(e) {
    if (drag) return;
    var chip = e.target.closest ? e.target.closest('.chip') : null;
    if (!chip || chip.classList.contains('schwebend')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var g = chip.closest('.luecke');
    drag = {
      id: chip.dataset.el,
      pid: e.pointerId,
      type: e.pointerType,
      x: e.clientX, y: e.clientY,
      cx: e.clientX, cy: e.clientY,
      offY: e.pointerType === 'mouse' ? 0 : TOUCH_OFFSET_Y,
      active: false,
      timer: null,
      chip: chip,
      ghost: null,
      hoverGap: null,
      hoverList: false,
      from: g ? Number(g.dataset.gap) : null
    };
    if (e.pointerType !== 'mouse') {
      drag.timer = setTimeout(function () {
        if (drag && !drag.active) startDrag();
      }, HOLD_MS);
    }
  }

  function startDrag() {
    drag.active = true;
    var ghost = el('span', 'chip schwebend', elById[drag.id].text);
    document.body.appendChild(ghost);
    drag.ghost = ghost;
    drag.chip.classList.add('wird-gezogen');
    document.body.classList.add('zieht');
    moveGhost();
    scrollFrame = requestAnimationFrame(autoScroll);
  }

  function moveGhost() {
    var p = dropPoint();
    drag.ghost.style.left = p.x + 'px';
    drag.ghost.style.top = p.y + 'px';
  }

  function updateHover() {
    var p = dropPoint();
    var t = document.elementFromPoint(p.x, p.y);
    var gap = t && t.closest ? t.closest('.luecke') : null;
    var inTray = !gap && t && t.closest ? !!t.closest('#elemente') : false;
    if (drag.hoverGap && drag.hoverGap !== gap) drag.hoverGap.classList.remove('ziel');
    if (gap) gap.classList.add('ziel');
    drag.hoverGap = gap;
    listEl.classList.toggle('ziel', inTray);
    drag.hoverList = inTray;
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    drag.cx = e.clientX;
    drag.cy = e.clientY;
    if (!drag.active) {
      var d = Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
      if (drag.type === 'mouse') {
        if (d > MOUSE_THRESHOLD) startDrag();
      } else if (d > TOUCH_CANCEL) {
        clearTimeout(drag.timer);
        drag = null; // the finger is scrolling
      }
      if (!drag || !drag.active) return;
    }
    e.preventDefault();
    moveGhost();
    updateHover();
  }

  function endDrag() {
    if (!drag) return;
    clearTimeout(drag.timer);
    if (drag.ghost) drag.ghost.remove();
    if (drag.chip) drag.chip.classList.remove('wird-gezogen');
    if (drag.hoverGap) drag.hoverGap.classList.remove('ziel');
    listEl.classList.remove('ziel');
    document.body.classList.remove('zieht');
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
    drag = null;
  }

  function onUp(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    if (drag.active) {
      var p = dropPoint();
      var t = document.elementFromPoint(p.x, p.y);
      var gap = t && t.closest ? t.closest('.luecke') : null;
      var inTray = t && t.closest ? !!t.closest('#elemente') : false;
      var id = drag.id;
      endDrag();
      if (gap) place(id, Number(gap.dataset.gap));
      else if (inTray) place(id, null);
      // anywhere else: the element stays where it was
    } else {
      endDrag();
    }
  }

  function onCancel(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    endDrag();
  }

  // scroll the code area / the element list while dragging near their edges
  function autoScroll() {
    if (!drag || !drag.active) return;
    var p = dropPoint();
    [codeAreaEl, listEl].forEach(function (sc) {
      var r = sc.getBoundingClientRect();
      var edge = 48;
      if (p.x < r.left || p.x > r.right || p.y < r.top - 24 || p.y > r.bottom + 24) return;
      var dy = 0, dx = 0;
      if (p.y < r.top + edge) dy = -Math.ceil((edge - (p.y - r.top)) / edge * 14);
      else if (p.y > r.bottom - edge) dy = Math.ceil((edge - (r.bottom - p.y)) / edge * 14);
      if (p.x < r.left + edge) dx = -Math.ceil((edge - (p.x - r.left)) / edge * 14);
      else if (p.x > r.right - edge) dx = Math.ceil((edge - (r.right - p.x)) / edge * 14);
      if (dy) sc.scrollTop += dy;
      if (dx) sc.scrollLeft += dx;
    });
    updateHover();
    scrollFrame = requestAnimationFrame(autoScroll);
  }

  document.addEventListener('pointerdown', onDown);
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onCancel);
  // while dragging with a finger the page must not scroll
  document.addEventListener('touchmove', function (e) {
    if (drag && drag.active) e.preventDefault();
  }, { passive: false });
  // no context menu on a long press on an element
  document.addEventListener('contextmenu', function (e) {
    if (e.target.closest && e.target.closest('.chip')) e.preventDefault();
  });

  // ---------- buttons ----------
  btnCheck.addEventListener('click', function () {
    var correct = 0;
    gapIds.forEach(function (n) {
      var elId = state.inGap[n];
      var ok = elId !== null && D.luecken[n].indexOf(elById[elId].text) !== -1;
      state.marks[n] = ok ? 'richtig' : 'falsch';
      if (ok) correct++;
    });
    state.score = { correct: correct, total: gapIds.length };
    render();
  });

  btnReset.addEventListener('click', function () {
    if (!window.confirm('Wirklich zurücksetzen?')) return;
    gapIds.forEach(function (n) { state.inGap[n] = null; });
    state.marks = {};
    state.score = null;
    render();
  });

  // session ID: 8 random hex digits (upper case), new on every page load
  var sessionId = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16).toUpperCase();
  while (sessionId.length < 8) sessionId = '0' + sessionId;
  document.getElementById('session').textContent = 'Session ID: ' + sessionId;

  render();
})();
