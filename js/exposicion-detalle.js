// Páginas «Exposición N»: carrusel de diapositivas y aparición de las secciones al desplazarse.
(function () {
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  var CHEV_IZQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEV_DER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function h(tag, props, html) {
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) { el.setAttribute(k, props[k]); });
    if (html) el.innerHTML = html;
    return el;
  }

  document.querySelectorAll('.dt-carr').forEach(function (marco) {
    var pista = marco.querySelector('.dt-pista');
    var total = marco.querySelectorAll('.dt-slide').length;
    if (total < 2) return;
    var actual = 0;
    var ant = h('button', { class: 'dt-flecha dt-flecha--ant', type: 'button', 'aria-label': 'Diapositiva anterior' }, CHEV_IZQ);
    var sig = h('button', { class: 'dt-flecha dt-flecha--sig', type: 'button', 'aria-label': 'Diapositiva siguiente' }, CHEV_DER);
    var cont = h('span', { class: 'dt-cont', 'aria-hidden': 'true' });
    var puntos = h('div', { class: 'dt-puntos' });
    var botones = [];
    for (var k = 0; k < total; k++) {
      var b = h('button', { class: 'dt-punto', type: 'button', 'aria-label': 'Ir a la diapositiva ' + (k + 1) + ' de ' + total });
      botones.push(b); puntos.appendChild(b);
    }
    [ant, sig, cont, puntos].forEach(function (el) { marco.appendChild(el); });

    function pintar(i) {
      actual = i;
      cont.textContent = (i + 1) + ' / ' + total;
      botones.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    }
    function ir(i) {
      i = ((i % total) + total) % total;
      pista.scrollTo({ left: i * pista.clientWidth, behavior: reducir.matches ? 'instant' : 'smooth' });
      pintar(i);
    }
    var pendiente = false;
    pista.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(function () {
        pendiente = false;
        var i = Math.max(0, Math.min(total - 1, Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth))));
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
    window.addEventListener('resize', function () { pista.scrollTo({ left: actual * pista.clientWidth, behavior: 'instant' }); });
    pintar(0);
  });

  if (document.documentElement.classList.contains('js')) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.dt-rev').forEach(function (el) { obs.observe(el); });
  }
})();
