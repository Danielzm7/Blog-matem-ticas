// Tangram interactivo: siete piezas que se mueven, se giran y se voltean para armar figuras.
// Las figuras están en unidades donde el cuadrado completo mide 4 × 4.
(function () {
  var raiz = document.getElementById('tg-app');
  if (!raiz) return;

  // =====================================================================
  //  DATOS EDITABLES
  // =====================================================================

  // Las siete piezas (triángulos: 2 grandes, 1 mediano y 2 pequeños; 1 cuadrado; 1 paralelogramo).
  var BASE = {
    L: [[0, 0], [4, 0], [2, 2]],
    M: [[0, 0], [2, 0], [0, 2]],
    S: [[0, 0], [2, 0], [1, 1]],
    Q: [[0, 1], [1, 0], [2, 1], [1, 2]],
    P: [[0, 0], [2, 0], [3, 1], [1, 1]]
  };
  var NOMBRE = { L: 'triángulo grande', M: 'triángulo mediano', S: 'triángulo pequeño', Q: 'cuadrado', P: 'paralelogramo' };
  // Orden y color de las siete piezas (colores de la paleta del blog).
  var JUEGO = [
    { t: 'L', color: '#FF7A6B' }, { t: 'L', color: '#FF9A8D' }, { t: 'M', color: '#FFD45E' },
    { t: 'S', color: '#7FD8B5' }, { t: 'Q', color: '#B7A6F2' }, { t: 'S', color: '#A0E5C9' },
    { t: 'P', color: '#5BB8F0' }
  ];

  // Figuras para armar: cada pieza trae su lugar exacto en la silueta.
  var FIGURAS = [{"id":"cuadrado","nombre":"Cuadrado","pista":"Todas las piezas juntas forman un cuadrado.","piezas":[{"t":"L","p":[[0,0],[4,0],[2,-2]]},{"t":"L","p":[[0,-4],[0,0],[2,-2]]},{"t":"S","p":[[2,-4],[0,-4],[1,-3]]},{"t":"Q","p":[[2,-2],[3,-3],[2,-4],[1,-3]]},{"t":"S","p":[[3,-1],[3,-3],[2,-2]]},{"t":"M","p":[[4,-4],[2,-4],[4,-2]]},{"t":"P","p":[[4,0],[4,-2],[3,-3],[3,-1]]}]},{"id":"triangulo","nombre":"Triángulo grande","pista":"Un triángulo enorme con las siete piezas.","piezas":[{"t":"L","p":[[0,0],[4,0],[2,-2]]},{"t":"L","p":[[4,0],[4,-4],[2,-2]]},{"t":"M","p":[[4,0],[6,0],[4,-2]]},{"t":"Q","p":[[5,-1],[6,-2],[5,-3],[4,-2]]},{"t":"S","p":[[4,-4],[4,-2],[5,-3]]},{"t":"P","p":[[8,0],[6,0],[5,-1],[7,-1]]},{"t":"S","p":[[5,-1],[7,-1],[6,-2]]}]},{"id":"diamante","nombre":"Diamante","pista":"Una joya con punta arriba y abajo.","piezas":[{"t":"L","p":[[2,-2],[2,-6],[0,-4]]},{"t":"M","p":[[0,-6],[0,-4],[2,-6]]},{"t":"S","p":[[0,-6],[2,-6],[1,-7]]},{"t":"Q","p":[[2,-6],[3,-7],[2,-8],[1,-7]]},{"t":"L","p":[[2,-6],[2,-2],[4,-4]]},{"t":"S","p":[[3,-5],[3,-7],[2,-6]]},{"t":"P","p":[[4,-4],[4,-6],[3,-7],[3,-5]]}]},{"id":"barco","nombre":"Barco","pista":"Un barco con su vela.","piezas":[{"t":"L","p":[[4,-2],[0,-2],[2,0]]},{"t":"L","p":[[2,0],[6,0],[4,-2]]},{"t":"M","p":[[4,-2],[4,-4],[2,-2]]},{"t":"Q","p":[[5,-1],[6,-2],[5,-3],[4,-2]]},{"t":"S","p":[[4,-4],[4,-2],[5,-3]]},{"t":"S","p":[[7,-1],[5,-1],[6,0]]},{"t":"P","p":[[5,-1],[7,-1],[8,-2],[6,-2]]}]},{"id":"pez","nombre":"Pez","pista":"El pez que armamos en clase.","piezas":[{"t":"L","p":[[1.4142,0.7071],[1.4142,-2.1213],[4.2426,0.7071]]},{"t":"L","p":[[1.4142,0.7071],[4.2426,0.7071],[1.4142,3.5355]]},{"t":"Q","p":[[0,0],[1.4142,0],[1.4142,1.4142],[0,1.4142]]},{"t":"S","p":[[0,0],[1.4142,0],[1.4142,-1.4142]]},{"t":"S","p":[[0,1.4142],[1.4142,1.4142],[1.4142,2.8284]]},{"t":"M","p":[[0,1.4142],[-1.4142,0],[-1.4142,2.8284]]},{"t":"P","p":[[-1.4142,-1.4142],[0,0],[0,1.4142],[-1.4142,0]]}]}];

  // =====================================================================
  //  A partir de aquí no hace falta editar nada
  // =====================================================================

  var NS = 'http://www.w3.org/2000/svg';
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag, attrs, padre) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (padre) padre.appendChild(e);
    return e;
  }
  function html(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }
  function centroide(pts) {
    var a = 0, cx = 0, cy = 0, n = pts.length;
    for (var i = 0; i < n; i++) {
      var p = pts[i], q = pts[(i + 1) % n], c = p[0] * q[1] - q[0] * p[1];
      a += c; cx += (p[0] + q[0]) * c; cy += (p[1] + q[1]) * c;
    }
    return [cx / (3 * a), cy / (3 * a)];
  }
  function dentro(x, y, poly) {
    var ins = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins;
    }
    return ins;
  }
  function puntosPoly(pts) { return pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); }

  // ---------- Estructura de la actividad ----------
  var nivelesEl = html('div', 'tg-niveles');
  nivelesEl.setAttribute('role', 'group'); nivelesEl.setAttribute('aria-label', 'Elegir figura');
  var tablero = html('div', 'tg-tablero');
  var svg = el('svg', { class: 'tg-svg', role: 'application', 'aria-label': 'Tablero del tangram: arrastra las piezas para armar la figura' });
  tablero.appendChild(svg);
  var burbuja = html('div', 'tg-burbuja'); burbuja.hidden = true;
  tablero.appendChild(burbuja);
  var confeti = html('div', 'tg-confeti'); confeti.setAttribute('aria-hidden', 'true');
  tablero.appendChild(confeti);
  var estado = html('p', 'tg-estado'); estado.setAttribute('role', 'status'); estado.setAttribute('aria-live', 'polite');

  var barra = html('div', 'tg-barra');
  function boton(clase, icono, texto, etiqueta) {
    var b = html('button', 'tg-btn ' + clase);
    b.type = 'button';
    if (etiqueta) b.setAttribute('aria-label', etiqueta);
    b.innerHTML = '<span aria-hidden="true">' + icono + '</span><span>' + texto + '</span>';
    return b;
  }
  var bIzq = boton('', '↺', 'Girar', 'Girar la pieza a la izquierda');
  var bDer = boton('', '↻', 'Girar', 'Girar la pieza a la derecha');
  var bVolt = boton('', '⇋', 'Voltear', 'Voltear la pieza');
  var bPista = boton('tg-btn--sol', '💡', 'Pista', 'Ver una pista');
  var bMezclar = boton('', '🔀', 'Mezclar', 'Mezclar las piezas');
  var interr = html('label', 'tg-interr');
  var cajaGuia = html('input'); cajaGuia.type = 'checkbox'; cajaGuia.checked = true;
  interr.appendChild(cajaGuia); interr.appendChild(html('span', 'tg-interr__pista')); interr.appendChild(html('span', '', 'Con guía'));
  [bIzq, bDer, bVolt, bPista, bMezclar, interr].forEach(function (b) { barra.appendChild(b); });
  var ayuda = html('p', 'tg-ayuda', 'Toca una pieza para elegirla, arrástrala y usa los botones para girarla o voltearla. Con el teclado: flechas para mover, R para girar y F para voltear.');

  raiz.appendChild(nivelesEl);
  raiz.appendChild(tablero);
  raiz.appendChild(estado);
  raiz.appendChild(barra);
  raiz.appendChild(ayuda);

  // ---------- Estado ----------
  var ANCHO = { W: 20, H: 12 }, ANGOSTO = { W: 12, H: 20 };
  var modo = null;               // distribución actual (ancho o angosto)
  var actual = 0;                // índice de la figura; FIGURAS.length = modo libre
  var piezas = [];               // piezas sueltas
  var sel = null;                // pieza elegida
  var resueltas = {};
  var ganado = false;
  var arrastre = null;
  var capaSilueta, capaPiezas, capaGuia;
  var tmpPista = 0;
  try { resueltas = JSON.parse(localStorage.getItem('tangram-resueltas') || '{}') || {}; } catch (e) { resueltas = {}; }
  function guardar() { try { localStorage.setItem('tangram-resueltas', JSON.stringify(resueltas)); } catch (e) {} }

  function distribucion() { return raiz.clientWidth >= 640 ? ANCHO : ANGOSTO; }
  function esLibre() { return actual === FIGURAS.length; }

  // ---------- Geometría de una pieza ----------
  var ESC = 1; // aumento de piezas y silueta; se ajusta a cada figura para aprovechar el tablero
  function ptsLocales(p) {
    var b = BASE[p.t], c = centroide(b);
    return b.map(function (v) { return [(v[0] - c[0]) * ESC, (v[1] - c[1]) * ESC]; });
  }
  function ptsMundo(p) {
    var r = (p.rot % 360) * Math.PI / 180, co = Math.cos(r), si = Math.sin(r), f = p.flip ? -1 : 1;
    return ptsLocales(p).map(function (v) {
      var x = v[0] * f, y = v[1];
      return [p.x + x * co - y * si, p.y + x * si + y * co];
    });
  }
  function transformar(p) {
    return 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + p.rot + 'deg) scale(' + (p.flip ? -1 : 1) + ',1)';
  }
  function pintar(p) { p.g.style.transform = transformar(p); }

  // ---------- Dibujo ----------
  function ajustarVista() {
    modo = distribucion();
    svg.setAttribute('viewBox', '0 0 ' + modo.W + ' ' + modo.H);
    tablero.classList.toggle('tg-tablero--alto', modo === ANGOSTO);
  }
  function limpiar() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var tray = el('rect', { class: 'tg-bandeja', x: modo === ANCHO ? 11 : 0.25, y: modo === ANCHO ? 0.25 : 10, width: modo === ANCHO ? 8.75 : 11.5, height: modo === ANCHO ? 11.5 : 9.75, rx: 0.6 }, svg);
    capaSilueta = el('g', { class: 'tg-silueta' }, svg);
    capaGuia = el('g', { class: 'tg-guia' }, svg);
    capaPiezas = el('g', { class: 'tg-piezas' }, svg);
  }
  var slots = [], contorno = [], areaObjetivo = 0, cajaObj = null;
  function prepararFigura() {
    slots = []; contorno = []; areaObjetivo = 0; cajaObj = null;
    if (esLibre()) { ESC = modo === ANCHO ? 1.3 : 1.15; return; }
    var f = FIGURAS[actual], xs = [], ys = [];
    f.piezas.forEach(function (p) { p.p.forEach(function (v) { xs.push(v[0]); ys.push(v[1]); }); });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    var cx = modo === ANCHO ? 5.5 : 6, cy = modo === ANCHO ? 6 : 5;
    // Se agranda cuanto quepa en la zona de la silueta (con un máximo para que las piezas sueltas sigan cabiendo)
    var libreW = modo === ANCHO ? 10 : 11.2, libreH = modo === ANCHO ? 11 : 9.2;
    ESC = Math.max(1, Math.min(modo === ANCHO ? 1.3 : 1.2, libreW / (maxx - minx), libreH / (maxy - miny)));
    var dx = cx - ESC * (minx + maxx) / 2, dy = cy - ESC * (miny + maxy) / 2;
    f.piezas.forEach(function (p) {
      slots.push({ t: p.t, pts: p.p.map(function (v) { return [v[0] * ESC + dx, v[1] * ESC + dy]; }) });
    });
    minx *= ESC; maxx *= ESC; miny *= ESC; maxy *= ESC;
    cajaObj = [minx + dx, miny + dy, maxx + dx, maxy + dy];
    // vértices del borde exterior (los que tienen puntos cercanos fuera de la silueta)
    var vistos = {};
    slots.forEach(function (s) {
      s.pts.forEach(function (v) {
        var k = v[0].toFixed(2) + ',' + v[1].toFixed(2);
        if (vistos[k]) return; vistos[k] = 1;
        var fuera = false;
        for (var a = 0; a < 8 && !fuera; a++) {
          var px = v[0] + 0.12 * Math.cos(a * Math.PI / 4), py = v[1] + 0.12 * Math.sin(a * Math.PI / 4);
          if (!enSilueta(px, py)) fuera = true;
        }
        if (fuera) contorno.push(v);
      });
    });
    for (var x = cajaObj[0]; x <= cajaObj[2]; x += 0.1) for (var y = cajaObj[1]; y <= cajaObj[3]; y += 0.1) if (enSilueta(x, y)) areaObjetivo++;
  }
  function enSilueta(x, y) { for (var i = 0; i < slots.length; i++) if (dentro(x, y, slots[i].pts)) return true; return false; }

  function dibujarSilueta() {
    if (esLibre()) {
      var t = el('text', { x: modo === ANCHO ? 5.5 : 6, y: modo === ANCHO ? 5.6 : 4.6, 'text-anchor': 'middle', class: 'tg-libre' }, capaSilueta);
      t.textContent = 'Zona libre';
      var t2 = el('text', { x: modo === ANCHO ? 5.5 : 6, y: modo === ANCHO ? 6.7 : 5.7, 'text-anchor': 'middle', class: 'tg-libre tg-libre--sub' }, capaSilueta);
      t2.textContent = 'Crea tu propia figura';
      return;
    }
    slots.forEach(function (s) { el('polygon', { class: 'tg-borde', points: puntosPoly(s.pts) }, capaSilueta); });
    slots.forEach(function (s) { el('polygon', { class: 'tg-relleno', points: puntosPoly(s.pts) }, capaSilueta); });
    slots.forEach(function (s, i) {
      var c = JUEGO.filter(function (j) { return j.t === s.t; });
      el('polygon', { class: 'tg-hueco', points: puntosPoly(s.pts), style: 'fill:' + (c[0] ? c[0].color : '#fff') }, capaGuia);
    });
    capaGuia.setAttribute('class', 'tg-guia' + (cajaGuia.checked ? ' is-visible' : ''));
  }

  function posicionesBandeja() {
    var pos = [];
    if (modo === ANCHO) {
      var cx = [12.6, 15.4, 18.2], cy = [2.8, 6.7, 10.2];
      [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, 2]].forEach(function (c) { pos.push([cx[c[0]], cy[c[1]]]); });
    } else {
      var cx2 = [2.4, 6, 9.6], cy2 = [12.2, 15.6, 18.4];
      [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, 2]].forEach(function (c) { pos.push([cx2[c[0]], cy2[c[1]]]); });
    }
    return pos;
  }
  var ROT0 = [90, 0, 180, 270, 90, 180, 0];
  function crearPiezas(mezclar) {
    var pos = posicionesBandeja();
    capaPiezas.textContent = '';
    var antes = piezas;
    piezas = JUEGO.map(function (j, i) {
      var p = { id: i, t: j.t, color: j.color, x: pos[i][0], y: pos[i][1], rot: (i === 1 && modo === ANCHO) ? 90 : ROT0[i], flip: false };
      if (mezclar) { p.rot = ROT0[(i + 3) % 7] + (Math.random() < 0.5 ? 0 : 90); p.flip = j.t === 'P' && Math.random() < 0.5; }
      var g = el('g', { class: 'tg-pieza', tabindex: '0', role: 'button', 'aria-label': 'Pieza ' + (i + 1) + ': ' + NOMBRE[j.t] }, capaPiezas);
      el('polygon', { points: puntosPoly(ptsLocales(p)), fill: j.color }, g);
      var brillo = ptsLocales(p).map(function (v) { return [v[0] * 0.58, v[1] * 0.58]; });
      el('polygon', { class: 'tg-brillo', points: puntosPoly(brillo) }, g);
      p.g = g;
      g.style.transitionDelay = (reducir ? 0 : i * 40) + 'ms';
      pintar(p);
      g.addEventListener('pointerdown', function (e) { empezar(e, p); });
      g.addEventListener('keydown', function (e) { teclas(e, p); });
      g.addEventListener('focus', function () { elegir(p, true); });
      return p;
    });
    if (!reducir) piezas.forEach(function (p, i) {
      p.g.classList.add('is-entra');
      setTimeout(function () { p.g.classList.remove('is-entra'); }, 700 + i * 40);
    });
    sel = null; elegir(null);
  }

  function elegir(p, sinFoco) {
    sel = p;
    piezas.forEach(function (q) { q.g.classList.toggle('is-sel', q === p); });
    var hay = !!p;
    [bIzq, bDer, bVolt].forEach(function (b) { b.disabled = !hay; });
    if (p && capaPiezas.lastChild !== p.g) {
      var tenia = document.activeElement === p.g;
      capaPiezas.appendChild(p.g);
      if (tenia) { try { p.g.focus({ preventScroll: true }); } catch (err) {} }
    }
  }

  // ---------- Arrastrar ----------
  function puntoSvg(e) {
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
    var r = pt.matrixTransform(m.inverse()); return { x: r.x, y: r.y };
  }
  function empezar(e, p) {
    if (ganado && !esLibre()) return;
    e.preventDefault();
    var ya = sel === p;
    elegir(p);
    var q = puntoSvg(e);
    arrastre = { p: p, dx: p.x - q.x, dy: p.y - q.y, mov: 0, ya: ya, id: e.pointerId };
    p.g.classList.add('is-arrastra');
    try { p.g.focus({ preventScroll: true }); } catch (err) {}
    try { p.g.setPointerCapture(e.pointerId); } catch (err) {}
    p.g.addEventListener('pointermove', mover);
    p.g.addEventListener('pointerup', soltar);
    p.g.addEventListener('pointercancel', soltar);
  }
  function mover(e) {
    if (!arrastre) return;
    var q = puntoSvg(e), p = arrastre.p;
    var nx = q.x + arrastre.dx, ny = q.y + arrastre.dy;
    arrastre.mov += Math.abs(nx - p.x) + Math.abs(ny - p.y);
    p.x = Math.max(0.4, Math.min(modo.W - 0.4, nx));
    p.y = Math.max(0.4, Math.min(modo.H - 0.4, ny));
    pintar(p);
  }
  function soltar(e) {
    if (!arrastre) return;
    var p = arrastre.p, g = p.g;
    g.removeEventListener('pointermove', mover);
    g.removeEventListener('pointerup', soltar);
    g.removeEventListener('pointercancel', soltar);
    g.classList.remove('is-arrastra');
    try { g.releasePointerCapture(arrastre.id); } catch (err) {}
    var toque = arrastre.mov < 0.2, ya = arrastre.ya;
    arrastre = null;
    if (toque) { if (ya) girar(p, 45); }
    else { imantar(p); }
    revisar();
  }

  // ---------- Girar, voltear, imantar ----------
  function girar(p, grados) { p.rot += grados; pintar(p); imantar(p); revisar(); anunciar('Pieza girada.'); }
  function voltear(p) { p.flip = !p.flip; pintar(p); imantar(p); revisar(); anunciar(p.flip ? 'Pieza volteada.' : 'Pieza en su lado original.'); }
  function imantar(p) {
    var cand = [];
    if (!esLibre()) {
      if (cajaGuia.checked) slots.forEach(function (s) { s.pts.forEach(function (v) { cand.push(v); }); });
      else contorno.forEach(function (v) { cand.push(v); });
    }
    piezas.forEach(function (q) { if (q !== p) ptsMundo(q).forEach(function (v) { cand.push(v); }); });
    var mine = ptsMundo(p), mejor = null;
    mine.forEach(function (v) {
      cand.forEach(function (c) {
        var d = Math.hypot(c[0] - v[0], c[1] - v[1]);
        if (d < 0.45 && (!mejor || d < mejor.d)) mejor = { d: d, dx: c[0] - v[0], dy: c[1] - v[1] };
      });
    });
    if (mejor) { p.x += mejor.dx; p.y += mejor.dy; pintar(p); }
  }
  function teclas(e, p) {
    var k = e.key, paso = e.shiftKey ? 0.5 : 0.25, usado = true;
    if (ganado && !esLibre()) return;
    if (k === 'ArrowLeft') p.x -= paso;
    else if (k === 'ArrowRight') p.x += paso;
    else if (k === 'ArrowUp') p.y -= paso;
    else if (k === 'ArrowDown') p.y += paso;
    else if (k === 'r' || k === 'R') { girar(p, e.shiftKey ? -45 : 45); return e.preventDefault(); }
    else if (k === 'f' || k === 'F') { voltear(p); return e.preventDefault(); }
    else usado = false;
    if (!usado) return;
    e.preventDefault();
    p.x = Math.max(0.4, Math.min(modo.W - 0.4, p.x)); p.y = Math.max(0.4, Math.min(modo.H - 0.4, p.y));
    pintar(p); revisar();
  }

  // ---------- Comprobar ----------
  function revisar() {
    if (esLibre() || ganado) return;
    var polis = piezas.map(ptsMundo);
    var cub = 0, mal = 0;
    for (var x = cajaObj[0] - 0.05; x <= cajaObj[2] + 0.05; x += 0.1) {
      for (var y = cajaObj[1] - 0.05; y <= cajaObj[3] + 0.05; y += 0.1) {
        var n = 0; for (var i = 0; i < polis.length; i++) if (dentro(x, y, polis[i])) n++;
        if (enSilueta(x, y)) { if (n >= 1) cub++; if (n >= 2) mal++; }
        else if (n >= 1) mal++;
      }
    }
    // piezas bien puestas (dentro de la silueta)
    piezas.forEach(function (p, i) {
      var pol = polis[i], tot = 0, ok = 0, c = centroide(pol);
      for (var a = 0; a < 40; a++) {
        var u = Math.random(), v = Math.random() * (1 - u), P = pol, base = P[0];
        var px, py;
        if (P.length === 3) { px = base[0] + u * (P[1][0] - base[0]) + v * (P[2][0] - base[0]); py = base[1] + u * (P[1][1] - base[1]) + v * (P[2][1] - base[1]); }
        else { px = base[0] + u * (P[1][0] - base[0]) + (1 - u) * 0 + v * (P[3][0] - base[0]); py = base[1] + u * (P[1][1] - base[1]) + v * (P[3][1] - base[1]); }
        tot++; if (enSilueta(px, py)) ok++;
      }
      p.g.classList.toggle('is-bien', ok / tot > 0.97 && Math.hypot(p.x, p.y) > 0 && enSilueta(c[0], c[1]));
    });
    if (cub / areaObjetivo >= 0.93 && mal / areaObjetivo <= 0.07) ganar();
  }
  function anunciar(t) { estado.textContent = t; }
  function ganar() {
    ganado = true;
    var f = FIGURAS[actual];
    resueltas[f.id] = 1; guardar();
    pintarNiveles();
    tablero.classList.add('is-ganado');
    piezas.forEach(function (p, i) { p.g.classList.remove('is-sel'); p.g.style.transitionDelay = (i * 60) + 'ms'; p.g.classList.add('is-salto'); });
    var hechas = FIGURAS.filter(function (g) { return resueltas[g.id]; }).length;
    burbuja.textContent = '';
    burbuja.appendChild(html('strong', '', '¡Lo lograste!'));
    burbuja.appendChild(html('span', '', 'Armaste el ' + f.nombre.toLowerCase() + ' con las 7 piezas. ' + (hechas === FIGURAS.length ? '¡Completaste todas las figuras!' : '')));
    var sig = html('button', 'tg-btn tg-btn--oscuro');
    sig.type = 'button';
    sig.textContent = actual < FIGURAS.length - 1 ? 'Siguiente figura →' : 'Jugar en modo libre →';
    sig.addEventListener('click', function () { irA(actual + 1); });
    burbuja.appendChild(sig);
    burbuja.hidden = false;
    anunciar('¡Lo lograste! Armaste el ' + f.nombre.toLowerCase() + '.');
    lanzarConfeti();
    setTimeout(function () { try { sig.focus({ preventScroll: true }); } catch (e) {} }, 400);
  }
  function lanzarConfeti() {
    if (reducir) return;
    confeti.textContent = '';
    var cols = ['#FF7A6B', '#FFD45E', '#7FD8B5', '#5BB8F0', '#B7A6F2'];
    for (var i = 0; i < 36; i++) {
      var c = html('i', 'tg-conf tg-conf--' + (i % 3));
      c.style.setProperty('--c', cols[i % 5]);
      c.style.left = (Math.random() * 100) + '%';
      c.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
      c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      c.style.animationDelay = (Math.random() * 0.5) + 's';
      c.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
      confeti.appendChild(c);
    }
    setTimeout(function () { confeti.textContent = ''; }, 3600);
  }

  // ---------- Figuras ----------
  function pintarNiveles() {
    nivelesEl.textContent = '';
    var simb = { cuadrado: '◼', triangulo: '▲', diamante: '◆', barco: '⛵', pez: '🐟' };
    FIGURAS.forEach(function (f, i) {
      var b = html('button', 'tg-nivel' + (i === actual ? ' is-actual' : '') + (resueltas[f.id] ? ' is-hecha' : ''));
      b.type = 'button';
      b.setAttribute('aria-pressed', i === actual ? 'true' : 'false');
      b.innerHTML = '<span class="tg-nivel__ic" aria-hidden="true">' + (simb[f.id] || '★') + '</span><span class="tg-nivel__tx">' + f.nombre + '</span><span class="tg-nivel__ok" aria-hidden="true">✓</span>';
      b.addEventListener('click', function () { irA(i); });
      nivelesEl.appendChild(b);
    });
    var l = html('button', 'tg-nivel tg-nivel--libre' + (esLibre() ? ' is-actual' : ''));
    l.type = 'button'; l.setAttribute('aria-pressed', esLibre() ? 'true' : 'false');
    l.innerHTML = '<span class="tg-nivel__ic" aria-hidden="true">✎</span><span class="tg-nivel__tx">Modo libre</span>';
    l.addEventListener('click', function () { irA(FIGURAS.length); });
    nivelesEl.appendChild(l);
  }
  function irA(i) {
    actual = (i + FIGURAS.length + 1) % (FIGURAS.length + 1);
    ganado = false;
    tablero.classList.remove('is-ganado');
    burbuja.hidden = true; confeti.textContent = '';
    ajustarVista(); limpiar(); prepararFigura(); dibujarSilueta(); crearPiezas(false);
    pintarNiveles();
    var libre = esLibre();
    interr.hidden = libre; bPista.hidden = libre;
    anunciar(libre
      ? 'Modo libre: recrea siluetas de animales, personas, letras o formas geométricas.'
      : 'Figura ' + (actual + 1) + ' de ' + FIGURAS.length + ': ' + FIGURAS[actual].nombre + '. ' + FIGURAS[actual].pista);
  }

  // ---------- Botones ----------
  bIzq.addEventListener('click', function () { if (sel) { girar(sel, -45); sel.g.focus({ preventScroll: true }); } });
  bDer.addEventListener('click', function () { if (sel) { girar(sel, 45); sel.g.focus({ preventScroll: true }); } });
  bVolt.addEventListener('click', function () { if (sel) { voltear(sel); sel.g.focus({ preventScroll: true }); } });
  bMezclar.addEventListener('click', function () {
    if (ganado) { irA(actual); return; }
    crearPiezas(true); anunciar('Piezas mezcladas.');
  });
  cajaGuia.addEventListener('change', function () {
    capaGuia.setAttribute('class', 'tg-guia' + (cajaGuia.checked ? ' is-visible' : ''));
    anunciar(cajaGuia.checked ? 'Guía activada: se ve dónde va cada pieza.' : 'Solo silueta: sin guía de las piezas.');
  });
  bPista.addEventListener('click', function () {
    if (esLibre() || ganado) return;
    capaGuia.setAttribute('class', 'tg-guia is-visible is-pista');
    clearTimeout(tmpPista);
    tmpPista = setTimeout(function () { capaGuia.setAttribute('class', 'tg-guia' + (cajaGuia.checked ? ' is-visible' : '')); }, 3500);
    anunciar('Pista: mira por 3 segundos dónde va cada pieza.');
  });
  svg.addEventListener('pointerdown', function (e) { if (e.target === svg || e.target.classList.contains('tg-bandeja') || e.target.closest('.tg-silueta')) elegir(null); });
  svg.addEventListener('touchmove', function (e) { if (arrastre) e.preventDefault(); }, { passive: false });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sel) elegir(null); });

  // Si la pantalla cambia entre ancha y angosta, se vuelve a acomodar la figura actual.
  var anchoVisto = raiz.clientWidth;
  var temp = 0;
  window.addEventListener('resize', function () {
    clearTimeout(temp);
    temp = setTimeout(function () {
      var nuevo = distribucion();
      if (nuevo !== modo && !arrastre) irA(actual);
    }, 200);
  });

  irA(0);
  // Aviso para pruebas y accesibilidad
  raiz.setAttribute('data-listo', '1');
  raiz.__tangram = { piezas: function () { return piezas; }, slots: function () { return slots; }, figura: function () { return actual; }, ir: irA, ganado: function () { return ganado; }, pts: ptsMundo, revisar: revisar };
})();
