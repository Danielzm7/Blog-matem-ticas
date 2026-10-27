// Página «¿Quiénes somos?»: tarjetas del equipo (una sola abierta) y aparición al desplazarse.
(function () {
  // ---- Equipo: un solo estado, el índice de la tarjeta abierta (o null) ----
  var tarjetas = document.querySelectorAll('[data-integrante]');
  var abierta = null;

  function pintar() {
    tarjetas.forEach(function (tarjeta, i) {
      var abierto = abierta === i;
      var panel = tarjeta.querySelector('.qs-detalle');
      var boton = tarjeta.querySelector('.qs-mas');
      var foto = tarjeta.querySelector('.qs-foto__boton');
      panel.hidden = !abierto;
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      foto.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      boton.querySelector('.qs-mas__texto').textContent = abierto ? 'Ocultar' : 'Conoce más';
    });
  }

  function alternar(i) {
    abierta = abierta === i ? null : i;
    pintar();
  }

  tarjetas.forEach(function (tarjeta, i) {
    tarjeta.querySelectorAll('.qs-mas, .qs-foto__boton').forEach(function (control) {
      control.addEventListener('click', function () { alternar(i); });
    });
  });
  pintar();

  // ---- Aparición al desplazarse (la clase "js" la pone el <head> solo si hay soporte) ----
  if (!document.documentElement.classList.contains('js')) return;
  var elementos = document.querySelectorAll('.qs-rev');
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      var el = entrada.target;
      observador.unobserve(el);
      el.classList.add('is-in');
      // Cuando termina la entrada se quita la clase, para que el hover recupere su propia transición.
      setTimeout(function () { el.classList.remove('qs-rev', 'is-in'); }, 900);
    });
  }, { threshold: 0.12 });
  elementos.forEach(function (el) { observador.observe(el); });
})();
