// Inicio: aparición suave de las secciones al desplazarse.
(function () {
  if (!document.documentElement.classList.contains('js')) return;
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return;
      obs.unobserve(en.target);
      en.target.classList.add('is-in');
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.in-rev').forEach(function (el) { obs.observe(el); });
})();
