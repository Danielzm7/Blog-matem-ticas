// Página «Situaciones didácticas y juegos»: la Carrera del 20 (dos jugadores en la misma pantalla) y la aparición al desplazarse.
(function () {
  var META = 20;
  var tablero = document.getElementById('sd-tablero');
  var total = document.getElementById('sd-total');
  var turno = document.getElementById('sd-turno');
  var turnoLetra = document.getElementById('sd-turno-letra');
  var registro = document.getElementById('sd-registro');
  var final = document.getElementById('sd-final');
  var botones = [document.getElementById('sd-sumar-1'), document.getElementById('sd-sumar-2')];
  var casillas = [];
  var suma = 0, jugador = 'A', terminado = false;

  for (var i = 1; i <= META; i++) {
    var li = document.createElement('li');
    li.className = 'sd-casilla' + (i === META ? ' sd-casilla--meta' : '');
    li.textContent = i;
    tablero.appendChild(li); casillas.push(li);
  }

  function pintar() {
    total.textContent = suma;
    botones.forEach(function (b, k) {
      var no = terminado || suma + (k + 1) > META;
      if (no) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled');
    });
    turno.hidden = terminado;
    turno.className = 'sd-turno sd-turno--' + jugador;
    turno.lastChild.textContent = 'Turno del jugador ' + jugador;
    turnoLetra.textContent = jugador;
  }

  function jugar(n) {
    if (terminado || suma + n > META) return;
    var quien = jugador;
    for (var k = suma + 1; k <= suma + n; k++) casillas[k - 1].classList.add('is-' + quien);
    suma += n;
    var p = document.createElement('li');
    p.textContent = quien + ' suma ' + n + ' → ' + suma;
    registro.appendChild(p);
    if (suma === META) {
      terminado = true;
      final.textContent = '¡Llegó a 20! Gana el jugador ' + quien + '.';
      final.hidden = false;
    } else {
      jugador = quien === 'A' ? 'B' : 'A';
    }
    pintar();
  }

  function reiniciar() {
    suma = 0; jugador = 'A'; terminado = false;
    casillas.forEach(function (c) { c.classList.remove('is-A', 'is-B'); });
    registro.innerHTML = '';
    final.hidden = true; final.textContent = '';
    pintar();
  }

  botones.forEach(function (b, k) { b.addEventListener('click', function () { jugar(k + 1); }); });
  document.getElementById('sd-reiniciar').addEventListener('click', reiniciar);
  pintar();

  if (document.documentElement.classList.contains('js')) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.sd-rev').forEach(function (el) { obs.observe(el); });
  }
})();
