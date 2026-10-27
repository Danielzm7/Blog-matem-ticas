// Menú del celular: abre y cierra el panel con los enlaces y el buscador.
(function () {
  var panel = document.getElementById('panel-movil');
  var botonMenu = document.querySelector('[data-abrir-menu]');
  var botonBusqueda = document.querySelector('[data-abrir-busqueda]');
  if (!panel || !botonMenu) return;

  function abrir(enfocarBusqueda) {
    panel.hidden = false;
    botonMenu.setAttribute('aria-expanded', 'true');
    botonMenu.setAttribute('aria-label', 'Cerrar menú');
    if (botonBusqueda) botonBusqueda.setAttribute('aria-expanded', 'true');
    if (enfocarBusqueda) panel.querySelector('input').focus();
  }

  function cerrar() {
    panel.hidden = true;
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', 'Abrir menú');
    if (botonBusqueda) botonBusqueda.setAttribute('aria-expanded', 'false');
  }

  botonMenu.addEventListener('click', function () {
    panel.hidden ? abrir(false) : cerrar();
  });

  if (botonBusqueda) {
    botonBusqueda.addEventListener('click', function () {
      panel.hidden ? abrir(true) : panel.querySelector('input').focus();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) {
      cerrar();
      botonMenu.focus();
    }
  });
})();
