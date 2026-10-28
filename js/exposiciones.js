// Página «Exposiciones»: las siete exposiciones se dibujan a partir de la lista de datos de abajo.
(function () {
  // =====================================================================
  //  DATOS EDITABLES — es lo único que hay que tocar para completar la página
  // =====================================================================

  // Cuántos espacios reservados se muestran en el carrusel mientras una exposición no tiene imágenes.
  // Con 1 no aparecen flechas, puntos ni contador.
  var MARCADORES = 3;

  // Una entrada por exposición, en orden (la primera es la Exposición 01, y así hasta la 07).
  //   titulo:       tema expuesto. Vacío = «Tema por definir».
  //   descripcion:  texto breve. Vacío = texto provisional.
  //   integrantes:  lista de nombres, por ejemplo ['Nombre 1', 'Nombre 2']. Vacía = «Integrantes por añadir».
  //   imagenes:     lista de { src: 'img/mi-foto.jpg', alt: 'qué se ve en la imagen' }. Vacía = espacios reservados.
  //   diapositivas: enlace completo (https://…). Vacío o inválido = «Próximamente».
  var EXPOSICIONES = [
    { titulo: '', descripcion: '', integrantes: [], imagenes: [], diapositivas: '' }, // 01
    { titulo: '', descripcion: '', integrantes: [], imagenes: [], diapositivas: '' }, // 02
    { titulo: '', descripcion: '', integrantes: [], imagenes: [], diapositivas: '' }, // 03
    { titulo: '', descripcion: '', integrantes: [], imagenes: [], diapositivas: '' }, // 04
    { titulo: '', descripcion: '', integrantes: [], imagenes: [], diapositivas: '' }, // 05
    { titulo: '', descripcion: '', integrantes: [], imagenes: [], diapositivas: '' }, // 06
    { titulo: '', descripcion: '', integrantes: [], imagenes: [], diapositivas: '' }  // 07
  ];

  // =====================================================================
  //  A partir de aquí no hace falta editar nada
  // =====================================================================
  var ACENTOS = ['#5BB8F0', '#FF7A6B', '#FFD45E', '#7FD8B5', '#B7A6F2', '#FF7A6B', '#7FD8B5'];
  var DURACIONES = [8, 9, 10, 7, 11, 9, 8];
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');

  function h(tag, props, hijos) {
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'class') el.className = props[k];
      else if (k === 'text') el.textContent = props[k];
      else el.setAttribute(k, props[k]);
    });
    (hijos || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function esUrl(u) { return typeof u === 'string' && /^https?:\/\/\S+/i.test(u.trim()); }
  function dos(n) { return n < 10 ? '0' + n : String(n); }

  // Figura propia de cada exposición, hecha solo con CSS.
  function figura(n, dur, acento) {
    var hijos = [];
    if (n === 1 || n === 3) hijos = [h('i'), h('i'), h('i')];
    if (n === 7) hijos = [h('i'), h('i'), h('i'), h('i')];
    if (n === 2) hijos = [h('span', { text: '123' })];
    var f = h('span', { class: 'ex-fig ex-fig--' + n, 'aria-hidden': 'true' }, hijos);
    if (dur) f.style.setProperty('--d', dur + 's');
    if (acento) f.style.setProperty('--a', acento);
    return f;
  }

  // ---------- Carrusel (uno por exposición, independientes) ----------
  var CHEVRON_IZQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEVRON_DER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function carrusel(n, datos) {
    var imgs = (datos.imagenes || []).filter(function (i) { return i && i.src; });
    var reales = imgs.length > 0;
    var total = reales ? imgs.length : Math.max(1, MARCADORES);
    var slides = [];
    for (var i = 0; i < total; i++) {
      var contenido;
      if (reales) {
        contenido = h('img', { src: imgs[i].src, alt: imgs[i].alt || '', loading: i === 0 ? 'eager' : 'lazy', decoding: 'async', draggable: 'false' });
      } else {
        contenido = null;
      }
      var s = h('div', { class: 'ex-slide' + (reales ? '' : ' ex-slide--vacia'), role: 'group', 'aria-roledescription': 'diapositiva', 'aria-label': (i + 1) + ' de ' + total }, [contenido]);
      if (!reales) {
        s.appendChild(figura(n, DURACIONES[n - 1] + 1));
        s.appendChild(h('p', { class: 'ex-slide__num', text: 'Imagen ' + (i + 1) + ' de ' + total }));
        s.appendChild(h('p', { class: 'ex-slide__frase', text: 'Espacio reservado para las fotos de esta exposición' }));
      }
      slides.push(s);
    }
    var pista = h('div', { class: 'ex-pista', tabindex: '0' }, slides);
    var marco = h('div', { class: 'ex-carrusel', role: 'region', 'aria-roledescription': 'carrusel', 'aria-label': 'Imágenes de la exposición ' + n }, [pista]);
    if (total < 2) return marco;

    var contador = h('span', { class: 'ex-contador', 'aria-hidden': 'true', text: '1 / ' + total });
    var ant = h('button', { class: 'ex-flecha ex-flecha--ant', type: 'button', 'aria-label': 'Imagen anterior, exposición ' + n });
    var sig = h('button', { class: 'ex-flecha ex-flecha--sig', type: 'button', 'aria-label': 'Imagen siguiente, exposición ' + n });
    ant.innerHTML = CHEVRON_IZQ; sig.innerHTML = CHEVRON_DER;
    var puntos = h('div', { class: 'ex-puntos' });
    var botones = [];
    for (var k = 0; k < total; k++) {
      var b = h('button', { class: 'ex-punto', type: 'button', 'aria-label': 'Ir a la imagen ' + (k + 1) + ' de la exposición ' + n });
      botones.push(b); puntos.appendChild(b);
    }
    marco.appendChild(contador); marco.appendChild(ant); marco.appendChild(sig); marco.appendChild(puntos);

    var actual = 0;
    function pintar(i) {
      actual = i;
      contador.textContent = (i + 1) + ' / ' + total;
      botones.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    }
    function ir(i) {
      i = ((i % total) + total) % total;
      pista.scrollTo({ left: i * pista.clientWidth, behavior: reducir.matches ? 'auto' : 'smooth' });
      pintar(i);
    }
    // El contador y los puntos siguen también al deslizar con el dedo o con el scroll.
    var pendiente = false;
    pista.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(function () {
        pendiente = false;
        var i = Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth));
        i = Math.max(0, Math.min(total - 1, i));
        if (i !== actual) pintar(i);
      });
    }, { passive: true });
    ant.addEventListener('click', function () { ir(actual - 1); });
    sig.addEventListener('click', function () { ir(actual + 1); });
    botones.forEach(function (b, j) { b.addEventListener('click', function () { ir(j); }); });
    pista.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
    });
    window.addEventListener('resize', function () { pista.scrollLeft = actual * pista.clientWidth; });
    pintar(0);
    return marco;
  }

  // ---------- Texto de cada exposición ----------
  function texto(n, d) {
    var titulo = (d.titulo || '').trim(), desc = (d.descripcion || '').trim();
    var nombres = (d.integrantes || []).filter(function (x) { return x && String(x).trim(); });
    var integrantes = h('ul', { class: 'ex-integrantes', 'aria-label': 'Integrantes' }, nombres.length
      ? nombres.map(function (x) { return h('li', { text: String(x).trim() }); })
      : [h('li', { class: 'ex-vacio', text: 'Integrantes por añadir' })]);
    var boton = esUrl(d.diapositivas)
      ? h('a', { class: 'ex-diap', href: d.diapositivas.trim(), target: '_blank', rel: 'noopener noreferrer' }, ['Ver diapositivas ', h('span', { 'aria-hidden': 'true', text: '↗' })])
      : h('span', { class: 'ex-prox', text: 'Próximamente' });
    return h('div', { class: 'ex-texto' }, [
      h('div', { class: 'ex-texto__cab' }, [h('span', { class: 'ex-etiqueta', text: 'Exposición ' + dos(n) }), figura(n, DURACIONES[n - 1])]),
      h('h2', { class: 'ex-titulo' + (titulo ? '' : ' ex-vacio'), text: titulo || 'Tema por definir' }),
      h('p', { class: 'ex-desc' + (desc ? '' : ' ex-vacio'), text: desc || 'Aquí irá una descripción breve de lo que se expuso.' }),
      integrantes,
      boton
    ]);
  }

  // Orden de los dos componentes en cada tarjeta: el carrusel primero o el texto primero.
  var TEXTO_PRIMERO = { 4: true, 7: true };

  document.querySelectorAll('[data-expo]').forEach(function (card) {
    var n = +card.getAttribute('data-expo'), d = EXPOSICIONES[n - 1] || {};
    var c = carrusel(n, d), t = texto(n, d);
    if (TEXTO_PRIMERO[n]) { card.appendChild(t); card.appendChild(c); } else { card.appendChild(c); card.appendChild(t); }
  });

  // ---------- Índice ----------
  var indice = document.getElementById('ex-indice');
  EXPOSICIONES.forEach(function (d, i) {
    var n = i + 1, titulo = (d.titulo || '').trim();
    var num = h('span', { class: 'ex-ind__num', text: dos(n), 'aria-hidden': 'true' });
    num.style.background = ACENTOS[i];
    indice.appendChild(h('a', { class: 'ex-ind', href: '#expo-' + n }, [num, h('span', { text: titulo || 'Tema por definir' })]));
  });

  // ---------- Franja oscura: se cuenta sola ----------
  var publicadas = EXPOSICIONES.filter(function (d) { return esUrl(d.diapositivas); }).length;
  document.getElementById('ex-cuenta').textContent = publicadas + ' de ' + EXPOSICIONES.length;
  var barras = document.getElementById('ex-barras');
  barras.setAttribute('aria-label', publicadas + ' de ' + EXPOSICIONES.length + ' diapositivas publicadas');
  EXPOSICIONES.forEach(function (d) { barras.appendChild(h('i', { class: esUrl(d.diapositivas) ? 'ex-on' : '' })); });

  // ---------- Aparición al desplazarse ----------
  if (document.documentElement.classList.contains('js')) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.ex-rev').forEach(function (el) { obs.observe(el); });
  }
})();
