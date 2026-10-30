// Filtro por edad de «Jugamos y enseñamos»: muestra solo el panel elegido y actualiza el contador.
(function () {
  var botones = [].slice.call(document.querySelectorAll('.jg-fb'));
  var paneles = [].slice.call(document.querySelectorAll('.jg-panel'));
  var contador = document.getElementById('jg-contador');
  var destino = document.getElementById('juegos');
  if (!botones.length) return;

  function filtrar(edad) {
    botones.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filtro') === edad ? 'true' : 'false'); });
    paneles.forEach(function (p) { p.hidden = edad !== 'todas' && p.getAttribute('data-edad') !== edad; });
    if (edad === 'todas') contador.textContent = '52 juegos en total';
    else if (edad === '8') contador.textContent = '12 retos para 8 años o más';
    else contador.textContent = '8 juegos para ' + edad + ' años';
  }

  botones.forEach(function (b) {
    b.addEventListener('click', function () { filtrar(b.getAttribute('data-filtro')); });
  });

  [].forEach.call(document.querySelectorAll('.jg-edad'), function (b) {
    b.addEventListener('click', function () {
      filtrar(b.getAttribute('data-edad'));
      var quieta = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      destino.scrollIntoView({ behavior: quieta ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
