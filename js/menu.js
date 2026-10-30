// Buscador de la cabecera: lleva a la página que mejor coincide con lo escrito.
(function () {
  var guion = document.currentScript && document.currentScript.src;
  var base = guion ? guion.replace(/js\/menu\.js.*$/, '') : '';
  var PAGINAS = [
    ['index.html', 'inicio portada semillas matematicas blog'],
    ['quienes-somos.html', 'quienes somos equipo sharon yuliana angie autoras estudiantes contexto objetivo'],
    ['temas.html', 'temas evaluacion formativa retroalimentacion ticket de salida retos matematicos bingo emisario'],
    ['exposiciones.html', 'exposiciones presentaciones diapositivas clase'],
    ['exposicion-1.html', 'referentes curriculares lineamientos exposicion 1'],
    ['exposicion-2.html', 'pensamiento numerico sistemas numericos numeros exposicion 2'],
    ['exposicion-3.html', 'pensamiento espacial sistemas geometricos geometria exposicion 3'],
    ['exposicion-4.html', 'vision del nino dimensiones del desarrollo exposicion 4'],
    ['situaciones.html', 'situaciones didacticas juegos carrera del 20 juego'],
    ['autoevaluaciones.html', 'autoevaluaciones autoevaluacion reflexion aprendizaje'],
    ['actividades/3-anios.html', '3 anos tres contar cuenta objetos colores figuras actividades'],
    ['actividades/4-anios.html', '4 anos cuatro ordenar tamano serie ritmo figuras actividades'],
    ['actividades/5-anios.html', '5 anos cinco suma sumas comparar mayor cuadro del diez grafica actividades'],
    ['actividades/6-anios.html', '6 anos seis restas dinero hora decenas unidades mitades actividades'],
    ['actividades/7-anios.html', '7 anos siete regla medir calendario par impar cuerpos geometricos actividades'],
    ['actividades/8-anios.html', '8 anos ocho multiplicar tablas divisiones fracciones perimetro area angulos probabilidad actividades juegos']
  ];
  function norm(t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  [].forEach.call(document.querySelectorAll('form.buscador'), function (f) {
    var campo = f.querySelector('input');
    campo.addEventListener('input', function () { campo.setCustomValidity(''); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var palabras = norm(campo.value).split(/\s+/).filter(function (p) { return p.length > 1 || /\d/.test(p); });
      if (!palabras.length) return;
      var mejor = null, max = 0;
      PAGINAS.forEach(function (p) {
        var n = palabras.filter(function (w) { return norm(p[1]).indexOf(w) !== -1; }).length;
        if (n > max) { max = n; mejor = p[0]; }
      });
      if (mejor) { window.location.href = base + mejor; return; }
      campo.setCustomValidity('No encontramos resultados. Prueba con «3 años», «exposiciones» o «juegos».');
      campo.reportValidity();
    });
  });
})();

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
