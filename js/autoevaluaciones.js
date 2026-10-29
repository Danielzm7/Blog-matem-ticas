// Página «Autoevaluaciones»: botones de resaltado (uno a la vez por sección) y aparición al desplazarse.
(function () {
  document.querySelectorAll('[data-persona]').forEach(function (sec) {
    var botones = Array.prototype.slice.call(sec.querySelectorAll('.ae-res'));
    var frases = Array.prototype.slice.call(sec.querySelectorAll('.ae-fr'));
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-f');
        var activo = b.getAttribute('aria-pressed') === 'true';
        botones.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        frases.forEach(function (f) { f.classList.remove('is-on'); });
        if (activo) return;
        b.setAttribute('aria-pressed', 'true');
        frases.forEach(function (f) { if (f.getAttribute('data-f') === k) f.classList.add('is-on'); });
      });
    });
  });

  if (document.documentElement.classList.contains('js')) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.ae-rev').forEach(function (el) { obs.observe(el); });
  }
})();
