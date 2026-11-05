// Página «Situaciones didácticas y juegos»: la Carrera del 20 (dos jugadores en la misma pantalla) y la aparición al desplazarse.
(function () {
  var META = 20;
  var tablero = document.getElementById('sd-tablero');
  var total = document.getElementById('sd-total');
  var turno = document.getElementById('sd-turno');
  var turnoLetra = document.getElementById('sd-turno-letra');
  var registro = document.getElementById('sd-registro');
  var final = document.getElementById('sd-final');
  var botones = [document.getElementById('sd-sumar-1'), document.getElementById('sd-sumar-2')];
  var casillas = [];
  var suma = 0, jugador = 'A', terminado = false;

  for (var i = 1; i <= META; i++) {
    var li = document.createElement('li');
    li.className = 'sd-casilla' + (i === META ? ' sd-casilla--meta' : '');
    li.textContent = i;
    tablero.appendChild(li); casillas.push(li);
  }

  function pintar() {
    total.textContent = suma;
    botones.forEach(function (b, k) {
      var no = terminado || suma + (k + 1) > META;
      if (no) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled');
    });
    turno.hidden = terminado;
    turno.className = 'sd-turno sd-turno--' + jugador;
    turno.lastChild.textContent = 'Turno del jugador ' + jugador;
    turnoLetra.textContent = jugador;
  }

  function jugar(n) {
    if (terminado || suma + n > META) return;
    var quien = jugador;
    for (var k = suma + 1; k <= suma + n; k++) casillas[k - 1].classList.add('is-' + quien);
    suma += n;
    var p = document.createElement('li');
    p.textContent = quien + ' suma ' + n + ' → ' + suma;
    registro.appendChild(p);
    if (suma === META) {
      terminado = true;
      final.textContent = '¡Llegó a 20! Gana el jugador ' + quien + '.';
      final.hidden = false;
    } else {
      jugador = quien === 'A' ? 'B' : 'A';
    }
    pintar();
  }

  function reiniciar() {
    suma = 0; jugador = 'A'; terminado = false;
    casillas.forEach(function (c) { c.classList.remove('is-A', 'is-B'); });
    registro.innerHTML = '';
    final.hidden = true; final.textContent = '';
    pintar();
  }

  botones.forEach(function (b, k) { b.addEventListener('click', function () { jugar(k + 1); }); });
  document.getElementById('sd-reiniciar').addEventListener('click', reiniciar);
  pintar();

  // ---------- Tarea 3: tabla de puntajes y preguntas ----------
  var cuerpo = document.getElementById('sd-tabla-b');
  if (cuerpo) {
    var celdas = [];
    for (var r = 1; r <= 4; r++) {
      var tr = document.createElement('tr');
      var th = document.createElement('th'); th.scope = 'row'; th.textContent = 'Pareja ' + r; tr.appendChild(th);
      for (var t = 1; t <= 5; t++) {
        var td = document.createElement('td');
        var inp = document.createElement('input');
        inp.className = 'sd-celda'; inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 3; inp.autocomplete = 'off';
        inp.setAttribute('aria-label', 'Pareja ' + r + ', turno ' + t);
        inp.dataset.r = r; inp.dataset.t = t;
        td.appendChild(inp); tr.appendChild(td); celdas.push(inp);
      }
      cuerpo.appendChild(tr);
    }
    var resp = document.getElementById('sd-tabla-resp');
    var pregs = [].slice.call(document.querySelectorAll('.sd-preg'));
    var activa = null;
    var TEXTO_INICIAL = 'Elige una pregunta para ver qué casillas responden.';
    function valor(c) { var v = c.value.trim(); return /^(0|[1-9]\d*)$/.test(v) ? parseInt(v, 10) : null; }
    function donde(lista) { return lista.map(function (c) { return 'pareja ' + c.dataset.r + ', turno ' + c.dataset.t; }).join('; '); }
    function limpiarMarcas() { celdas.forEach(function (c) { c.classList.remove('is-resalta', 'is-resalta2', 'is-mal'); }); }
    function responder() {
      limpiarMarcas();
      if (!activa) { resp.textContent = TEXTO_INICIAL; return; }
      var llenas = celdas.filter(function (c) { return c.value.trim() !== ''; });
      var nums = celdas.filter(function (c) { return valor(c) !== null; });
      if (!llenas.length) { resp.textContent = 'Primero escribe algunos puntajes en la tabla.'; return; }
      var vs = nums.map(valor), txt = '';
      if (activa === 'mayor' || activa === 'menor') {
        if (!nums.length) { resp.textContent = 'Escribe números para poder compararlos.'; return; }
        var ref = activa === 'mayor' ? Math.max.apply(null, vs) : Math.min.apply(null, vs);
        var hit = nums.filter(function (c) { return valor(c) === ref; });
        hit.forEach(function (c) { c.classList.add('is-resalta'); });
        txt = 'El ' + (activa === 'mayor' ? 'mayor' : 'menor') + ' número es ' + ref + ' (' + donde(hit) + '). ¿Por qué es ' + (activa === 'mayor' ? 'mayor' : 'menor') + '?';
      } else if (activa === 'igual') {
        var cuenta = {}; vs.forEach(function (v) { cuenta[v] = (cuenta[v] || 0) + 1; });
        var rep = nums.filter(function (c) { return cuenta[valor(c)] > 1; });
        rep.forEach(function (c) { c.classList.add('is-resalta'); });
        var distintos = Object.keys(cuenta).filter(function (k) { return cuenta[k] > 1; });
        txt = rep.length ? 'Dan igual los números repetidos: ' + distintos.join(', ') + '.' : 'Todavía no hay dos puntajes iguales.';
      } else if (activa === 'docesveintiuno') {
        var d = nums.filter(function (c) { return valor(c) === 12; }), v = nums.filter(function (c) { return valor(c) === 21; });
        d.forEach(function (c) { c.classList.add('is-resalta'); }); v.forEach(function (c) { c.classList.add('is-resalta2'); });
        txt = 'Doces (amarillo): ' + (d.length ? donde(d) : 'ninguno') + '. Veintiunos (lila): ' + (v.length ? donde(v) : 'ninguno') + '.';
      } else if (activa === 'escritura') {
        var mal = llenas.filter(function (c) { return valor(c) === null; });
        mal.forEach(function (c) { c.classList.add('is-mal'); });
        txt = mal.length ? 'Revisa estas casillas, no son un número bien escrito: ' + donde(mal) + '.' : 'Todos los números están bien escritos.';
      }
      resp.textContent = txt;
    }
    pregs.forEach(function (b) {
      b.addEventListener('click', function () {
        var misma = activa === b.dataset.p;
        activa = misma ? null : b.dataset.p;
        pregs.forEach(function (o) { o.setAttribute('aria-pressed', o === b && !misma ? 'true' : 'false'); });
        responder();
      });
    });
    celdas.forEach(function (c, i) {
      c.addEventListener('input', function () { if (activa) responder(); });
      c.addEventListener('keydown', function (e) {
        var k = e.key, n = -1;
        if (k === 'ArrowRight') n = i + 1; else if (k === 'ArrowLeft') n = i - 1;
        else if (k === 'ArrowDown') n = i + 5; else if (k === 'ArrowUp') n = i - 5;
        if (n >= 0 && n < celdas.length) { e.preventDefault(); celdas[n].focus(); }
      });
    });
    document.getElementById('sd-tabla-limpiar').addEventListener('click', function () {
      celdas.forEach(function (c) { c.value = ''; });
      activa = null; pregs.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      responder();
    });
  }

  if (document.documentElement.classList.contains('js')) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.sd-rev').forEach(function (el) { obs.observe(el); });
  }
})();
