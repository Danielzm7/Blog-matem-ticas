// Motor de las páginas de actividades: selector de juegos, panel, progreso, mensajes, pantalla ampliada.
// No sabe nada de ninguna edad: recibe una configuración con juegos { titulo, emoji, color, resumen, practica,
// consejo, crear(nivel, previo), montar(reto, escenario, ctx) } y los pone a jugar.
(function () {
  var MSG_OK = ['¡Muy bien!', '¡Lo lograste!', '¡Excelente!', '¡Eso es!', '¡Genial!'];
  var MSG_ERR = ['¡Casi! Inténtalo otra vez.', 'Mira con calma y prueba de nuevo.', '¡Tú puedes! Prueba otra vez.'];
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');

  function h(tag, props, hijos) {
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'class') el.className = props[k];
      else if (k === 'text') el.textContent = props[k];
      else el.setAttribute(k, props[k]);
    });
    (hijos || []).forEach(function (c) { el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function $(id) { return document.getElementById(id); }
  function estrellas(n, total) {
    var s = '';
    for (var i = 0; i < total; i++) s += i < n ? '★' : '☆';
    return s;
  }

  function iniciar(cfg) {
    var juegos = cfg.juegos;
    var total = juegos.length;
    // Retos resueltos por juego y por modo (0 = Explorador, 1 = Experto). Sin selector de modo solo se usa el 0.
    var progreso = juegos.map(function () { return { s: [0, 0] }; });
    var modo = 0;
    function resueltos(i) { return progreso[i].s[modo]; }
    var actual = 0;
    var reto = null;       // { juego, firma, instruccion, ... }
    var nivel = 0;
    var resuelto = false;
    var ciclo = 0;         // sube con cada reto; los avisos de un reto anterior se ignoran
    var ultimoOk = -1, ultimoErr = -1;

    var panel = $('ac-panel'), escenario = $('ac-escenario'), zona = $('ac-respuesta');
    var zMsg = h('p', { class: 'ac-msg ac-msg--base' });
    var zAcc = h('div', { class: 'ac-acciones' });
    zona.appendChild(zMsg); zona.appendChild(zAcc);
    var contTarjetas = $('ac-tarjetas');
    var tarjetas = [];

    // ---------- Selector ----------
    juegos.forEach(function (j, i) {
      var b = h('button', { class: 'ac-tarjeta', type: 'button', 'aria-pressed': 'false' }, [
        h('span', { class: 'ac-tarjeta__img', 'aria-hidden': 'true', style: 'background:' + j.color }, [h('span', { text: j.emoji })]),
        j.tema ? h('span', { class: 'ac-mono ac-tarjeta__tema', text: j.tema }) : '',
        h('h3', { text: j.titulo }),
        h('p', { text: j.resumen }),
        h('span', { class: 'ac-tarjeta__estrellas', 'aria-hidden': 'true' })
      ]);
      b.addEventListener('click', function () { elegir(i, true); });
      contTarjetas.appendChild(b);
      tarjetas.push(b);
    });

    function pintarProgreso() {
      var s = resueltos(actual);
      var n = Math.min(s, 5);
      $('ac-estrellas').textContent = estrellas(n, 5);
      $('ac-conteo').textContent = s >= 5 ? '¡5 estrellas! Sigue jugando'
        : s + (s === 1 ? ' reto resuelto' : ' retos resueltos');
      tarjetas.forEach(function (t, i) {
        t.querySelector('.ac-tarjeta__estrellas').textContent = estrellas(Math.min(resueltos(i), 5), 5);
        t.setAttribute('aria-pressed', i === actual ? 'true' : 'false');
        t.setAttribute('aria-label', juegos[i].titulo + '. ' + juegos[i].resumen + ' ' + Math.min(resueltos(i), 5) + ' de 5 estrellas.');
      });
    }

    // ---------- Mensajes y acciones ----------
    function mensaje(tipo, texto) {
      zMsg.className = 'ac-msg ac-msg--' + tipo;
      zMsg.textContent = texto;
      // Se vuelve a poner el nodo para que el lector de pantalla anuncie también un mensaje repetido.
      zona.replaceChild(zMsg.cloneNode(true), zMsg);
      zMsg = zona.firstChild;
    }
    function mensajeBase() { mensaje('base', 'Toma tu tiempo. No hay prisa ni respuestas malas.'); }
    function sorteo(lista, ultimo) {
      var i;
      do { i = Math.floor(Math.random() * lista.length); } while (i === ultimo && lista.length > 1);
      return i;
    }
    function botonAccion(texto, clase, fn) {
      var b = h('button', { class: 'ac-grande ' + clase, type: 'button', text: texto });
      b.addEventListener('click', fn);
      zAcc.innerHTML = '';
      zAcc.appendChild(b);
      return b;
    }

    function confeti() {
      if (reducir.matches) return;
      var capa = h('div', { class: 'ac-confeti', 'aria-hidden': 'true' });
      var signos = ['⭐', '✨', '🎉'];
      for (var i = 0; i < 16; i++) {
        var p = h('span', { text: signos[i % 3] });
        p.style.left = (4 + Math.random() * 92) + '%';
        p.style.animationDelay = (Math.random() * .35) + 's';
        p.style.fontSize = (22 + Math.random() * 18) + 'px';
        capa.appendChild(p);
      }
      panel.appendChild(capa);
      setTimeout(function () { if (capa.parentNode) capa.parentNode.removeChild(capa); }, 1700);
    }

    // ---------- Un reto ----------
    function crearCtx() {
      var mio = ciclo;
      var vivo = function () { return mio === ciclo; };
      return {
        instruccion: function (t) { $('ac-instruccion').textContent = '👉 ' + t; },
        activo: function () { return vivo() && !resuelto; },
        // Sacude el elemento (dos animaciones que se alternan para que se repita) y avisa con cariño.
        error: function (el, texto) {
          if (!vivo() || resuelto) return;
          if (el) {
            var b = el.dataset.sacude === 'a' ? 'b' : 'a';
            el.dataset.sacude = b;
            el.classList.remove('ac-sacude-a', 'ac-sacude-b');
            el.classList.add('ac-sacude-' + b);
          }
          if (texto) { mensaje('err', '💛 ' + texto); return; }
          ultimoErr = sorteo(MSG_ERR, ultimoErr);
          mensaje('err', '💛 ' + MSG_ERR[ultimoErr]);
        },
        // Un paso bien hecho de un reto que aún no termina.
        parcial: function () {
          if (!vivo() || resuelto) return;
          ultimoOk = sorteo(MSG_OK, ultimoOk);
          mensaje('ok', '🌟 ' + MSG_OK[ultimoOk]);
        },
        // El reto quedó resuelto: cuenta una sola vez y deja las respuestas inactivas hasta «Otro reto».
        resuelto: function () {
          if (!vivo() || resuelto) return;
          resuelto = true;
          progreso[actual].s[modo]++;
          ultimoOk = sorteo(MSG_OK, ultimoOk);
          mensaje('ok', '🌟 ' + MSG_OK[ultimoOk]);
          escenario.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
          pintarProgreso();
          confeti();
          var otro = botonAccion('Otro reto →', 'ac-grande--otro', function () { nuevoReto(); });
          otro.focus({ preventScroll: true });
        },
        // Botón grande de validación (juego 8).
        listo: function (texto, fn) {
          if (!vivo() || resuelto) return;
          botonAccion(texto, 'ac-grande--listo', fn);
        },
        espera: function (fn, ms) { setTimeout(function () { if (vivo()) fn(); }, reducir.matches ? 0 : ms); }
      };
    }

    function nuevoReto() {
      var j = juegos[actual];
      ciclo++;
      resuelto = false;
      nivel = modo * 2 + Math.min(2, Math.floor(resueltos(actual) / 2));
      var previo = reto && reto.juego === actual ? reto : null;
      var r = null;
      for (var i = 0; i < 60; i++) {
        r = j.crear(nivel, previo);
        if (!previo || r.firma !== previo.firma) break;
      }
      r.juego = actual;
      reto = r;
      escenario.innerHTML = '';
      zAcc.innerHTML = '';
      mensajeBase();
      var ctx = crearCtx();
      ctx.instruccion(r.instruccion || '');
      j.montar(r, escenario, ctx);
    }

    function pintarJuego() {
      var j = juegos[actual];
      $('ac-num').textContent = 'Juego ' + (actual + 1) + ' de ' + total;
      $('ac-titulo-juego').textContent = j.titulo;
      $('ac-practica').textContent = j.practica;
      $('ac-consejo').textContent = j.consejo;
      pintarProgreso();
    }

    function elegir(i, scroll) {
      if (i === actual && reto) return;
      actual = i;
      reto = null;
      pintarJuego();
      nuevoReto();
      if (scroll && !panel.classList.contains('ac-panel--completa')) {
        panel.scrollIntoView({ behavior: reducir.matches ? 'auto' : 'smooth', block: 'start' });
      }
    }

    $('ac-reiniciar').addEventListener('click', function () {
      progreso[actual].s[modo] = 0;
      pintarProgreso();
      nuevoReto();
    });

    // ---------- Modo (Explorador / Experto) y filtro por tema: solo si la página los trae ----------
    var botonesModo = [].slice.call(document.querySelectorAll('[data-modo]'));
    botonesModo.forEach(function (b) {
      b.addEventListener('click', function () {
        var nuevo = +b.getAttribute('data-modo');
        if (nuevo === modo) return;
        modo = nuevo;
        botonesModo.forEach(function (o) { o.setAttribute('aria-pressed', +o.getAttribute('data-modo') === modo ? 'true' : 'false'); });
        var linea = $('ac-modo-linea');
        if (linea) linea.textContent = linea.getAttribute(modo ? 'data-experto' : 'data-explorador');
        pintarProgreso();
        nuevoReto();
      });
    });
    var chipsTema = [].slice.call(document.querySelectorAll('[data-tema]'));
    chipsTema.forEach(function (c) {
      c.addEventListener('click', function () {
        var tema = c.getAttribute('data-tema');
        chipsTema.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
        tarjetas.forEach(function (t, i) { t.hidden = !!tema && juegos[i].tema !== tema; });
      });
    });

    // ---------- Pantalla ampliada (dentro de la página, sin API Fullscreen) ----------
    var bPantalla = $('ac-pantalla'), bCerrar = $('ac-cerrar');
    var area = $('ac-area');
    function inerte(valor) {
      var otros = [document.querySelector('.saltar'), document.querySelector('.cabecera'), document.querySelector('.pie')]
        .concat([].slice.call(document.querySelectorAll('main > *')).filter(function (e) { return e !== area; }));
      otros.forEach(function (e) { if (!e) return; if (valor) e.setAttribute('inert', ''); else e.removeAttribute('inert'); });
    }
    function abrirPantalla() {
      panel.classList.add('ac-panel--completa');
      document.documentElement.classList.add('ac-sin-scroll');
      bCerrar.hidden = false;
      inerte(true);
      bCerrar.focus({ preventScroll: true });
    }
    function cerrarPantalla() {
      if (!panel.classList.contains('ac-panel--completa')) return;
      panel.classList.remove('ac-panel--completa');
      document.documentElement.classList.remove('ac-sin-scroll');
      bCerrar.hidden = true;
      inerte(false);
      bPantalla.focus({ preventScroll: true });
    }
    bPantalla.addEventListener('click', abrirPantalla);
    bCerrar.addEventListener('click', cerrarPantalla);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarPantalla(); });

    // ---------- Arranque ----------
    pintarJuego();
    nuevoReto();

    // Solo para revisar el comportamiento (no revela respuestas).
    window.ActividadesMotor.estado = function () {
      return {
        actual: actual, nivel: nivel, modo: modo, resuelto: resuelto,
        solved: progreso.map(function (p) { return p.s[modo]; }),
        solvedModos: progreso.map(function (p) { return p.s.slice(); }),
        completa: panel.classList.contains('ac-panel--completa')
      };
    };
  }

  // ---------- Aparición al desplazarse (la clase "js" la pone el <head> solo si hay soporte) ----------
  function revelar() {
    if (!document.documentElement.classList.contains('js')) return;
    var elementos = document.querySelectorAll('.ac-rev');
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.12 });
    elementos.forEach(function (el) { obs.observe(el); });
  }

  window.ActividadesMotor = { iniciar: iniciar, revelar: revelar, h: h };
})();
