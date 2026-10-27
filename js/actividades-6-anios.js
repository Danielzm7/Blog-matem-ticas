// Actividades de 6 años: los ocho juegos como configuración (datos + funciones de reto).
// Misma estructura que 3, 4 y 5 años; las piezas compartidas viven en js/actividades-comun.js.
(function () {
  var h = window.ActividadesMotor.h;
  var C = window.ActividadesMotor.comun;
  var COLORES = C.COLORES;
  var entre = C.entre, uno = C.uno, barajar = C.barajar, muestra = C.muestra, px = C.px;
  var figura = C.figura, boton = C.boton, elegir = C.elegir, fila = C.fila;
  var numeros = C.numeros, botonesNumero = C.botonesNumero, rellenarAlAcertar = C.rellenarAlAcertar, interrogante = C.interrogante;

  var operacion = C.operacion;

  // ---------- 1. Sumas ----------
  var MAX_SUMA = [10, 15, 20];
  var juego1 = {
    titulo: 'Sumas', emoji: '🧮', color: '#FFF3C9', resumen: 'Suma dos números y encuentra el total.',
    practica: 'Suma hasta 20',
    consejo: 'Pidan que empiece por el número mayor y cuente hacia adelante («8... nueve, diez, once»). También pueden armar sumas con 10 + otro número.',
    crear: function (nivel) {
      var max = MAX_SUMA[nivel], a, b;
      do { a = entre(2, max - 2); b = entre(2, max - 2); } while (a + b > max);
      var total = a + b;
      return { instruccion: 'Suma y encuentra el total.', a: a, b: b, total: total, opciones: numeros(total, 3, max + 2), firma: a + '+' + b };
    },
    montar: function (r, esc, ctx) {
      var op = operacion(r.a, '+', r.b, 'ac-signo--mas');
      esc.appendChild(op.el);
      rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.total), op.duda, r.total);
    }
  };

  // ---------- 2. Restas ----------
  var juego2 = {
    titulo: 'Restas', emoji: '➖', color: '#FFE3DF', resumen: 'Quita y encuentra cuánto queda.',
    practica: 'Resta hasta 20',
    consejo: 'Usen la recta numérica o los dedos: de 12 quito 3, retrocedo tres pasos. Relacionen cada resta con su suma («8 + 4 = 12, entonces 12 − 4 = 8»).',
    crear: function (nivel) {
      var max = MAX_SUMA[nivel], a = entre(4, max), b = entre(1, a - 2), dif = a - b;
      return { instruccion: 'Resta y encuentra cuántos quedan.', a: a, b: b, dif: dif, opciones: numeros(dif, 1, max), firma: a + '-' + b };
    },
    montar: function (r, esc, ctx) {
      var op = operacion(r.a, '−', r.b, 'ac-signo--mas');
      esc.appendChild(op.el);
      rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.dif), op.duda, r.dif);
    }
  };

  // ---------- 3. ¿Cuánto dinero hay? ----------
  var MONEDAS = {
    100: { px: 66, color: '#FFD45E', texto: 15 },
    200: { px: 78, color: '#7FD8B5', texto: 17 },
    500: { px: 92, color: '#B7A6F2', texto: 20 }
  };
  function pesos(v) { return '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function totalMonedas(l) { return l.reduce(function (a, b) { return a + b; }, 0); }
  function sacar(nivel) {
    var lista, total, tipos;
    do {
      var n;
      if (nivel === 0) { n = entre(2, 5); lista = []; for (var i = 0; i < n; i++) lista.push(100); }
      else if (nivel === 1) { n = entre(3, 5); lista = [100, 200]; for (var j = 2; j < n; j++) lista.push(uno([100, 200])); }
      else { n = entre(3, 4); lista = []; for (var k = 0; k < n; k++) lista.push(uno([100, 200, 500])); }
      total = totalMonedas(lista);
      tipos = lista.filter(function (x, i) { return lista.indexOf(x) === i; }).length;
    } while (total < 200 || total > 1200 || (nivel === 2 && tipos < 2));
    return barajar(lista);
  }
  var juego3 = {
    titulo: '¿Cuánto dinero hay?', emoji: '💰', color: '#D9F5E9', resumen: 'Suma el valor de las monedas.',
    practica: 'Sistema monetario',
    consejo: 'Jueguen a la tienda con monedas reales o de cartón: «tengo 300 pesos, ¿qué puedo comprar?». Primero cuenten las de 100, luego sumen las de 200 y 500.',
    crear: function (nivel) {
      var lista = sacar(nivel), total = totalMonedas(lista);
      var cerca = [total - 200, total - 100, total + 100, total + 200];
      return { instruccion: '¿Cuánto dinero hay en total?', monedas: lista, total: total, opciones: numeros(total, 100, 1400, cerca), firma: lista.join(',') };
    },
    montar: function (r, esc, ctx) {
      var franja = h('div', { class: 'ac-franja ac-franja--sol', role: 'img', 'aria-label': 'Monedas: ' + r.monedas.map(function (m) { return pesos(m); }).join(', ') });
      r.monedas.forEach(function (m) {
        var d = MONEDAS[m];
        var c = h('span', { class: 'ac-moneda', style: 'background:' + d.color, 'aria-hidden': 'true' }, [h('span', { text: pesos(m) })]);
        c.style.setProperty('--m', d.px);
        c.style.fontSize = d.texto + 'px';
        franja.appendChild(c);
      });
      esc.appendChild(franja);
      botonesNumero(esc, ctx, r.opciones, r.total, function (v) { return { texto: pesos(v), label: pesos(v) + ' pesos', clase: 'dinero' }; });
    }
  };

  // ---------- 4. ¿Qué hora es? ----------
  function hora(hh, mm) { return hh + ':' + (mm < 10 ? '0' + mm : mm); }
  function vecina(hh, d) { return ((hh - 1 + d + 12) % 12) + 1; }
  var juego4 = {
    titulo: '¿Qué hora es?', emoji: '🕐', color: '#DDF1FD', resumen: 'Lee la hora en el reloj de manecillas.',
    practica: 'Lectura de la hora',
    consejo: 'Usen un reloj real. La manecilla corta dice la hora y la larga los minutos: en el 12 es «en punto», en el 6 es «y media», en el 3 es «y cuarto».',
    crear: function (nivel) {
      var hh = entre(1, 12), mins = nivel === 0 ? [0] : (nivel === 1 ? [0, 30] : [0, 15, 30]), mm = uno(mins), correcta = hora(hh, mm), opciones;
      if (nivel === 0) {
        var otras = muestra([vecina(hh, -2), vecina(hh, -1), vecina(hh, 1), vecina(hh, 2)], 2);
        opciones = [correcta].concat(otras.map(function (x) { return hora(x, 0); }));
      } else {
        var otroMin = uno(mins.filter(function (m) { return m !== mm; }));
        opciones = [correcta, hora(hh, otroMin), hora(vecina(hh, uno([-1, 1])), mm)];
      }
      return { instruccion: '¿Qué hora marca el reloj?', hh: hh, mm: mm, correcta: correcta, opciones: barajar(opciones), firma: correcta };
    },
    montar: function (r, esc, ctx) {
      esc.appendChild(C.reloj(r.hh, r.mm));
      var lista = r.opciones.map(function (t) {
        return { el: boton('ac-opt', 'las ' + t, [h('span', { class: 'ac-opt__num ac-opt__num--hora', text: t, 'aria-hidden': 'true' })]), ok: t === r.correcta };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 5. Decenas y unidades ----------
  var RANGO_DU = [[11, 29], [20, 59], [30, 99]];
  var juego5 = {
    titulo: 'Decenas y unidades', emoji: '🏗️', color: '#ECE7FD', resumen: 'Cuenta barras y cuadritos y forma el número.',
    practica: 'Valor posicional',
    consejo: 'Agrupen palitos o fichas de a 10 con una banda. Pregunten: «¿cuántos grupos de diez?, ¿cuántos sueltos?» y digan el número juntos.',
    crear: function (nivel) {
      var r = RANGO_DU[nivel], n = entre(r[0], r[1]);
      return { instruccion: '¿Qué número formaron las barras y los cuadritos?', n: n, decenas: Math.floor(n / 10), unidades: n % 10, opciones: numeros(n, 1, 99, [n - 10, n + 10, n - 1, n + 1, n - 9, n + 9]), firma: String(n) };
    },
    montar: function (r, esc, ctx) {
      var barras = h('span', { class: 'ac-du__barras' }), sueltos = h('span', { class: 'ac-du__sueltos' });
      for (var i = 0; i < r.decenas; i++) barras.appendChild(h('span', { class: 'ac-du__barra' }));
      for (var j = 0; j < r.unidades; j++) sueltos.appendChild(h('span', { class: 'ac-du__cuadrito' }));
      esc.appendChild(h('div', { class: 'ac-du' }, [
        h('div', { class: 'ac-du__tarjeta', role: 'img', 'aria-label': r.decenas + (r.decenas === 1 ? ' barra de diez y ' : ' barras de diez y ') + r.unidades + (r.unidades === 1 ? ' cuadrito suelto' : ' cuadritos sueltos') }, [barras, sueltos]),
        h('p', { class: 'ac-du__nota', text: 'Cada barra vale 10 · cada cuadrito vale 1' })
      ]));
      botonesNumero(esc, ctx, r.opciones, r.n);
    }
  };

  // ---------- 6. Mitades y cuartos ----------
  var DESIGUALES = [30, 20, 36, 15];
  var juego6 = {
    titulo: 'Mitades y cuartos', emoji: '🍰', color: '#FFE3DF', resumen: 'Descubre las partes iguales de un círculo.',
    practica: 'Fracciones básicas',
    consejo: 'Partan una tortilla, una arepa o un papel en 2 y en 4 partes iguales. Pregunten qué pasa si las partes no son iguales y comparen cuál porción es más grande.',
    crear: function (nivel) {
      if (nivel === 0) {
        var malos = muestra(DESIGUALES, 2);
        var circulos = barajar([{ ok: true, p: 50 }, { ok: false, p: malos[0] }, { ok: false, p: malos[1] }]);
        return { instruccion: '¿Qué círculo está partido en 2 partes iguales?', modo: 'mitades', circulos: circulos, firma: circulos.map(function (c) { return c.p; }).join(',') };
      }
      var pide = nivel === 1 ? 1 : uno([2, 3]);
      var texto = pide === 1 ? '¿Qué círculo tiene pintado un cuarto (¼)?' : (pide === 2 ? '¿Qué círculo tiene pintada la mitad (½)?' : '¿Qué círculo tiene pintados tres cuartos (¾)?');
      var cs = barajar([1, 2, 3]).map(function (n) { return { ok: n === pide, n: n }; });
      return { instruccion: texto, modo: 'cuartos', circulos: cs, firma: pide + '|' + cs.map(function (c) { return c.n; }).join('') };
    },
    montar: function (r, esc, ctx) {
      var lista = r.circulos.map(function (c) {
        var circ = h('span', { class: 'ac-circ', 'aria-hidden': 'true' });
        var label;
        if (r.modo === 'mitades') {
          circ.style.background = 'conic-gradient(#FF7A6B 0 ' + c.p + '%, #5BB8F0 ' + c.p + '% 100%)';
          label = 'círculo dividido en 2 partes ' + (c.ok ? 'iguales' : 'desiguales');
        } else {
          circ.classList.add('ac-circ--cruz');
          circ.style.background = 'conic-gradient(#FF7A6B 0 ' + (c.n * 25) + '%, #fff ' + (c.n * 25) + '% 100%)';
          label = 'círculo con ' + c.n + ' de 4 partes pintadas';
        }
        return { el: boton('ac-opt ac-opt--circ', label, [circ]), ok: c.ok };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 7. Saltos de 2, 5 y 10 ----------
  var juego7 = {
    titulo: 'Saltos de 2, 5 y 10', emoji: '🦘', color: '#D9F5E9', resumen: 'Sigue la fila de números que salta.',
    practica: 'Conteo de 2 en 2, 5 en 5 y 10 en 10',
    consejo: 'Salten en la sala diciendo la cuenta en voz alta («2, 4, 6...»). Cuenten los dedos de 5 en 5 y las monedas de 10 en 10.',
    crear: function (nivel) {
      var paso = nivel === 0 ? 2 : (nivel === 1 ? 5 : uno([2, 5, 10])), inicio = paso * entre(1, 3), fila_ = [];
      for (var i = 0; i < 5; i++) fila_.push(inicio + paso * i);
      var oculto = entre(1, 3), v = fila_[oculto];
      var cand = [v - 1, v + 1, v - 2, v + 2, v + 3].filter(function (x) { return x >= 1 && fila_.indexOf(x) < 0; });
      return { instruccion: 'Salta de ' + paso + ' en ' + paso + '. ¿Qué número falta?', fila: fila_, oculto: oculto, v: v, opciones: numeros(v, 1, 99, cand), firma: paso + '|' + inicio + '|' + oculto };
    },
    montar: function (r, esc, ctx) {
      var banda = fila('ac-banda ac-banda--verde'), duda;
      r.fila.forEach(function (n, i) {
        if (i === r.oculto) { duda = interrogante('ac-casilla--salto'); banda.appendChild(duda); }
        else banda.appendChild(h('span', { class: 'ac-casilla ac-casilla--salto' }, [h('span', { class: 'ac-casilla__q', text: String(n) })]));
      });
      esc.appendChild(banda);
      rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.v), duda, r.v);
    }
  };

  // ---------- 8. Lados y esquinas ----------
  var POLIGONOS = [
    { id: 'triangulo', nombre: 'triángulo', fem: false, n: 3 },
    { id: 'cuadrado', nombre: 'cuadrado', fem: false, n: 4 },
    { id: 'rectangulo', nombre: 'rectángulo', fem: false, n: 4 },
    { id: 'rombo', nombre: 'rombo', fem: false, n: 4 },
    { id: 'pentagono', nombre: 'pentágono', fem: false, n: 5 },
    { id: 'hexagono', nombre: 'hexágono', fem: false, n: 6 }
  ];
  var juego8 = {
    titulo: 'Lados y esquinas', emoji: '📐', color: '#FFF3C9', resumen: 'Cuenta los lados y las esquinas de cada figura.',
    practica: 'Geometría: lados y vértices',
    consejo: 'Recorran con el dedo el borde de cada figura contando los lados, y toquen cada esquina. Busquen figuras en la casa y comparen cuántos lados tienen.',
    crear: function (nivel) {
      var pool = nivel === 0 ? POLIGONOS.slice(0, 2) : (nivel === 1 ? POLIGONOS.slice(0, 4) : POLIGONOS);
      var f = uno(pool), lados = nivel === 0 ? true : Math.random() < .5, color = uno(COLORES);
      return {
        instruccion: (lados ? '¿Cuántos lados tiene ' : '¿Cuántas esquinas tiene ') + 'el ' + f.nombre + '?',
        forma: f, color: color, opciones: numeros(f.n, 2, 7), firma: f.id + '|' + lados + '|' + color.id
      };
    },
    montar: function (r, esc, ctx) {
      var fig = figura(r.forma, r.color, '130px');
      fig.classList.add('ac-fig--recto');
      var tarjeta = h('div', { class: 'ac-poligono', role: 'img', 'aria-label': 'El ' + r.forma.nombre }, [fig]);
      esc.appendChild(tarjeta);
      botonesNumero(esc, ctx, r.opciones, r.forma.n);
    }
  };

  window.ActividadesMotor.iniciar({
    juegos: [juego1, juego2, juego3, juego4, juego5, juego6, juego7, juego8]
  });
  window.ActividadesMotor.revelar();
})();
