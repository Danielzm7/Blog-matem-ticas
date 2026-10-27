// Operaciones de la portada: cambian solas cada pocos segundos.
// El resultado siempre se calcula a partir de los dos números, nunca se escribe a mano.
(function () {
  var caja = document.querySelector('[data-operaciones]');
  if (!caja || !caja.animate) return;

  var valores = caja.querySelectorAll('.il-suma__valor'); // a, signo, b, resultado
  var bloques = caja.querySelectorAll('.bloque');
  var calcular = {
    '+': function (a, b) { return a + b; },
    '−': function (a, b) { return a - b; },
    '×': function (a, b) { return a * b; },
    '÷': function (a, b) { return a / b; }
  };

  var lista = [
    [1, '+', 2], [4, '+', 3], [8, '−', 5], [2, '×', 3], [10, '−', 4], [6, '+', 2],
    [12, '÷', 3], [3, '+', 3], [9, '−', 2], [2, '×', 4], [5, '+', 4], [7, '−', 3],
    [6, '÷', 2], [2, '+', 6], [3, '×', 3], [10, '−', 7], [5, '+', 5], [8, '÷', 4],
    [4, '+', 4], [6, '−', 1], [2, '×', 5], [7, '+', 2], [9, '÷', 3], [10, '÷', 2]
  ].filter(function (o) {
    var r = calcular[o[1]](o[0], o[2]);
    return Number.isInteger(r) && r >= 0 && r <= 12;
  });

  // Colores de los recuadros; en cada cambio se usan tres distintos
  var colores = ['#FF7A6B', '#FFD45E', '#7FD8B5', '#5BB8F0']; // sin lila: se pierde sobre el círculo morado
  var actuales = [0, 1, 2];

  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  var indice = 0;
  var temporizador = null;
  var visible = true;
  var ESPERA = 4200;

  function cambiar(el, texto, retraso, bloque) {
    var quieto = reducir.matches;
    var salida = quieto
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }];
    var entrada = quieto
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }];
    var fuera = el.animate(salida, { duration: quieto ? 120 : 220, delay: retraso, easing: 'ease-in', fill: 'forwards' });
    fuera.onfinish = function () {
      el.textContent = texto;
      el.animate(entrada, { duration: quieto ? 120 : 320, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' })
        .onfinish = function () { this.cancel(); fuera.cancel(); };
      if (bloque && !quieto) {
        bloque.animate(
          [{ transform: 'none' }, { transform: 'translateY(-5px) scale(1.04)' }, { transform: 'none' }],
          { duration: 380, easing: 'ease-out' }
        );
      }
    };
  }

  function recolorear() {
    var nuevos = [];
    while (nuevos.length < 3) {
      var c = Math.floor(Math.random() * colores.length);
      if (nuevos.indexOf(c) === -1 && actuales.indexOf(c) !== nuevos.length) nuevos.push(c);
    }
    actuales = nuevos;
    bloques.forEach(function (b, i) { b.style.setProperty('--c', colores[nuevos[i]]); });
  }

  function siguiente() {
    recolorear();
    indice = (indice + 1) % lista.length;
    var o = lista[indice];
    var r = calcular[o[1]](o[0], o[2]);
    // Pequeño desfase entre recuadros para que el cambio se vea natural
    cambiar(valores[0], String(o[0]), 0, bloques[0]);
    cambiar(valores[1], o[1], 90);
    cambiar(valores[2], String(o[2]), 180, bloques[1]);
    cambiar(valores[3], String(r), 420, bloques[2]);
  }

  function iniciar() {
    if (temporizador || !visible || document.hidden) return;
    temporizador = setInterval(siguiente, ESPERA);
  }
  function parar() {
    clearInterval(temporizador);
    temporizador = null;
  }

  // Solo corre mientras la portada se ve y la pestaña está activa
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
      visible ? iniciar() : parar();
    }).observe(caja);
  }
  document.addEventListener('visibilitychange', function () {
    document.hidden ? parar() : iniciar();
  });
  iniciar();
})();
