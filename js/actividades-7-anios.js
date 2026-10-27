// Actividades de 7 años: los ocho juegos como configuración (datos + funciones de reto).
// Misma estructura que las demás edades; las piezas compartidas viven en js/actividades-comun.js.
(function () {
  var h = window.ActividadesMotor.h;
  var C = window.ActividadesMotor.comun;
  var entre = C.entre, uno = C.uno, barajar = C.barajar, muestra = C.muestra;
  var emoji = C.emoji, boton = C.boton, elegir = C.elegir, fila = C.fila;
  var numeros = C.numeros, botonesNumero = C.botonesNumero, rellenarAlAcertar = C.rellenarAlAcertar;

  function cifras(n) { return { d: Math.floor(n / 10), u: n % 10 }; }
  function cerca10(v) { return [v - 10, v + 10, v - 1, v + 1]; }
  function mayus(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function minutos(m) { return m < 10 ? '0' + m : String(m); }
  function hora(hh, mm) { return hh + ':' + minutos(mm); }
  function vecina(hh, d) { return ((hh - 1 + d + 12) % 12) + 1; }

  // ---------- 1. Sumas hasta 100 ----------
  var juego1 = {
    titulo: 'Sumas hasta 100', emoji: '💯', color: '#D9F5E9', resumen: 'Suma números de dos cifras.',
    practica: 'Suma con decenas y unidades',
    consejo: 'Pidan que sume primero las decenas y luego las unidades (23 + 14: 20 + 10 y 3 + 4). Cuando las unidades pasan de 10, hablen de «llevar» una decena.',
    crear: function (nivel) {
      var a, b;
      if (nivel === 0) {
        a = 10 * entre(1, 8); b = 10 * entre(1, (100 - a) / 10);
      } else {
        do {
          a = entre(11, 98); b = entre(11, 98);
          var ua = a % 10, ub = b % 10;
          var ok = ua !== 0 && ub !== 0 && (nivel === 1 ? ua + ub <= 9 && a + b <= 99 : ua + ub >= 10 && a + b <= 100);
        } while (!ok);
      }
      var total = a + b;
      return { instruccion: 'Suma y encuentra el total.', a: a, b: b, total: total, opciones: numeros(total, 11, 100, cerca10(total)), firma: a + '+' + b };
    },
    montar: function (r, esc, ctx) {
      var op = C.operacion(r.a, '+', r.b, 'ac-suma--7');
      esc.appendChild(op.el);
      rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.total), op.duda, r.total);
    }
  };

  // ---------- 2. Grupos iguales ----------
  var EMOJIS_GRUPO = ['🥚', '🍓', '⭐', '🐟', '🍪'];
  var FONDOS = ['#FFF3C9', '#D9F5E9', '#FFE3DF', '#DDF1FD', '#ECE7FD'];
  var TAM_GRUPO = { 2: [112, 40], 3: [112, 40], 5: [150, 30], 10: [176, 24] };
  var GRUPOS = [{ s: [2, 3], n: [2, 4] }, { s: [2, 5], n: [2, 5] }, { s: [2, 5, 10], n: [2, 5] }];
  var juego2 = {
    titulo: 'Grupos iguales', emoji: '🛍️', color: '#FFF3C9', resumen: 'Cuenta cuántos hay en varios grupos iguales.',
    practica: 'Preparación para multiplicar',
    consejo: 'Armen grupos iguales con fichas o galletas y cuenten de 2 en 2, de 5 en 5 o de 10 en 10. Digan «3 grupos de 5 son 15» y escríbanlo como suma repetida: 5 + 5 + 5.',
    crear: function (nivel) {
      var g = GRUPOS[nivel], s = uno(g.s), n = entre(g.n[0], g.n[1]), e = uno(EMOJIS_GRUPO), total = n * s;
      return {
        instruccion: 'Hay ' + n + ' grupos con ' + s + ' en cada uno. ¿Cuántos hay en total?', n: n, s: s, emoji: e, total: total,
        opciones: numeros(total, 2, 60, [total - s, total + s, total - 1, total + 1]), firma: [n, s, e].join('|')
      };
    },
    montar: function (r, esc, ctx) {
      var contenedor = fila('ac-grupos');
      var t = TAM_GRUPO[r.s];
      for (var i = 0; i < r.n; i++) {
        var caja = h('div', { class: 'ac-grupo-caja', role: 'img', 'aria-label': 'grupo de ' + r.s, style: 'background:' + FONDOS[i] });
        caja.style.width = 'calc(' + t[0] + 'px * var(--k))';
        for (var j = 0; j < r.s; j++) caja.appendChild(emoji(r.emoji, 'calc(' + t[1] + 'px * var(--k))'));
        contenedor.appendChild(caja);
      }
      esc.appendChild(contenedor);
      botonesNumero(esc, ctx, r.opciones, r.total);
    }
  };

  // ---------- 3. Restas hasta 100 ----------
  var juego3 = {
    titulo: 'Restas hasta 100', emoji: '🎯', color: '#FFE3DF', resumen: 'Quita y encuentra cuánto queda.',
    practica: 'Resta con decenas y unidades',
    consejo: 'Resten primero las decenas y luego las unidades. Si las unidades no alcanzan, «abran» una decena y jueguen con fichas de 10 y de 1 para ver el cambio.',
    crear: function (nivel) {
      var a, b;
      if (nivel === 0) { a = 10 * entre(3, 10); b = 10 * entre(1, a / 10 - 1); }
      else {
        do {
          a = entre(11, 99); b = entre(11, 99);
          var ua = a % 10, ub = b % 10;
          var ok = b < a && (nivel === 1 ? ua >= ub && ua !== 0 && ub !== 0 && a - b >= 2 : ua < ub);
        } while (!ok);
      }
      var dif = a - b;
      return { instruccion: 'Resta y encuentra cuántos quedan.', a: a, b: b, dif: dif, opciones: numeros(dif, 1, 99, cerca10(dif)), firma: a + '-' + b };
    },
    montar: function (r, esc, ctx) {
      var op = C.operacion(r.a, '−', r.b, 'ac-suma--7');
      esc.appendChild(op.el);
      rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.dif), op.duda, r.dif);
    }
  };

  // ---------- 4. El calendario ----------
  var DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  var DIAS_AB = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MESES_AB = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var juego4 = {
    titulo: 'El calendario', emoji: '🗓️', color: '#DDF1FD', resumen: 'Días de la semana y meses del año.',
    practica: 'Orden de los días y los meses',
    consejo: 'Usen un calendario real: marquen el día de hoy y pregunten qué día fue ayer y cuál será mañana. Reciten los meses en orden como una canción.',
    crear: function (nivel) {
      var meses = nivel === 1 ? true : (nivel === 2 ? Math.random() < .5 : false);
      var nombres = meses ? MESES : DIAS, n = nombres.length, ref = entre(0, n - 1), texto, resp;
      if (nivel < 2) {
        var despues = Math.random() < .5;
        resp = (ref + (despues ? 1 : -1) + n) % n;
        texto = meses ? '¿Qué mes va ' + (despues ? 'después de ' : 'antes de ') + nombres[ref] + '?' : '¿Qué día va ' + (despues ? 'después del ' : 'antes del ') + nombres[ref] + '?';
      } else {
        var paso = entre(2, 4); resp = (ref + paso) % n;
        texto = meses ? 'Estamos en ' + nombres[ref] + '. ¿Qué mes será dentro de ' + paso + ' meses?' : 'Hoy es ' + nombres[ref] + '. ¿Qué día será dentro de ' + paso + ' días?';
      }
      var cand = [resp - 2, resp - 1, resp + 1, resp + 2].map(function (x) { return (x + n) % n; }).filter(function (x) { return x !== ref && x !== resp; });
      var opciones = barajar([resp].concat(muestra(cand, 2)));
      return { instruccion: texto, meses: meses, ref: ref, resp: resp, opciones: opciones, firma: (meses ? 'm' : 'd') + ref + '|' + texto };
    },
    montar: function (r, esc, ctx) {
      var nombres = r.meses ? MESES : DIAS, abre = r.meses ? MESES_AB : DIAS_AB;
      var franja = h('div', { class: 'ac-calendario', role: 'img', 'aria-label': r.meses ? 'Meses del año' : 'Días de la semana' });
      abre.forEach(function (t, i) {
        franja.appendChild(h('span', { class: 'ac-chip-cal' + (i === r.ref ? ' ac-chip-cal--ref' : ''), text: t }));
      });
      esc.appendChild(franja);
      var lista = r.opciones.map(function (i) {
        return { el: boton('ac-opt', mayus(nombres[i]), [h('span', { class: 'ac-opt__num ac-opt__num--nombre', text: mayus(nombres[i]), 'aria-hidden': 'true' })]), ok: i === r.resp };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 5. Hora y minutos ----------
  var juego5 = {
    titulo: 'Hora y minutos', emoji: '⏰', color: '#ECE7FD', resumen: 'Lee la hora de 5 en 5 minutos.',
    practica: 'Lectura de la hora en minutos',
    consejo: 'Cuenten los minutos de 5 en 5 alrededor del reloj («5, 10, 15...»). Cada número es 5 minutos más: el 3 es :15, el 6 es :30 y el 9 es :45.',
    crear: function (nivel) {
      var hh = entre(1, 12), mm = nivel === 0 ? uno([0, 15, 30, 45]) : 5 * entre(0, 11), correcta = hora(hh, mm), opciones;
      var otraHora = hora(vecina(hh, uno([-1, 1])), mm);
      if (nivel === 0) {
        opciones = [correcta, hora(hh, uno([0, 15, 30, 45].filter(function (m) { return m !== mm; }))), otraHora];
      } else {
        var mismas = [mm - 10, mm - 5, mm + 5, mm + 10].filter(function (m) { return m >= 0 && m <= 55; });
        var misma = hora(hh, uno(mismas));
        if (nivel === 2 && mm % 15 !== 0) opciones = [correcta, hora(vecina(hh, uno([-1, 1])), 60 - mm), misma];
        else opciones = [correcta, misma, otraHora];
      }
      // Las tres opciones deben ser distintas (la hora vecina con minutos invertidos nunca coincide con la correcta).
      var vistos = {};
      opciones = opciones.filter(function (o) { if (vistos[o]) return false; vistos[o] = true; return true; });
      while (opciones.length < 3) { var extra = hora(vecina(hh, uno([-2, 2])), mm); if (!vistos[extra]) { vistos[extra] = true; opciones.push(extra); } }
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

  // ---------- 6. ¿Par o impar? ----------
  var RANGO_PAR = [[1, 10], [11, 30], [31, 99]];
  var juego6 = {
    titulo: '¿Par o impar?', emoji: '🎲', color: '#FFE3DF', resumen: 'Decide si el número es par o impar.',
    practica: 'Números pares e impares',
    consejo: 'Si se pueden formar parejas sin que sobre ninguno, es par. Prueben con fichas, y observen la última cifra: 0, 2, 4, 6 u 8 es par.',
    crear: function (nivel) {
      var r = RANGO_PAR[nivel], n = entre(r[0], r[1]);
      return { instruccion: '¿El número ' + n + ' es par o impar?', n: n, firma: String(n) };
    },
    montar: function (r, esc, ctx) {
      var hijos = [h('span', { class: 'ac-par__num', text: String(r.n) })];
      if (r.n <= 10) {
        var rejilla = h('span', { class: 'ac-par__puntos', 'aria-hidden': 'true' });
        for (var i = 0; i < r.n; i++) rejilla.appendChild(h('span', { class: 'ac-par__punto' }));
        hijos.push(rejilla);
      }
      esc.appendChild(h('div', { class: 'ac-par', role: 'img', 'aria-label': 'Número ' + r.n }, hijos));
      var lista = ['Par', 'Impar'].map(function (t) {
        return { el: boton('ac-opt', t.toLowerCase(), [h('span', { class: 'ac-opt__num ac-opt__num--palabra', text: t, 'aria-hidden': 'true' })]), ok: (t === 'Par') === (r.n % 2 === 0) };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 7. Mide con la regla ----------
  var PASO = 92 / 12;
  var juego7 = {
    titulo: 'Mide con la regla', emoji: '🖍️', color: '#D9F5E9', resumen: 'Lee cuántos centímetros mide la barra.',
    practica: 'Medición en centímetros',
    consejo: 'Midan lápices, borradores y cuadernos con una regla real. Recuerden empezar en el cero y, si el objeto empieza en otra marca, restar para saber cuánto mide.',
    crear: function (nivel) {
      var s, n;
      if (nivel === 0) { s = 0; n = entre(1, 10); }
      else if (nivel === 1) { s = 0; n = entre(3, 12); }
      else { do { s = entre(1, 5); n = entre(2, 7); } while (s + n > 12); }
      return {
        instruccion: nivel === 2 ? '¿Cuánto mide la barra? Mira dónde empieza.' : '¿Cuánto mide la barra?', s: s, n: n,
        opciones: numeros(n, 1, 12), firma: s + '|' + n
      };
    },
    montar: function (r, esc, ctx) {
      var regla = h('div', { class: 'ac-regla', role: 'img', 'aria-label': 'Regla de 0 a 12 centímetros y una barra' });
      regla.appendChild(h('span', { class: 'ac-regla__linea' }));
      for (var k = 0; k <= 12; k++) {
        var m = h('span', { class: 'ac-regla__marca' }), t = h('span', { class: 'ac-regla__num', text: String(k) });
        m.style.left = t.style.left = (4 + k * PASO) + '%';
        regla.appendChild(m); regla.appendChild(t);
      }
      var barra = h('span', { class: 'ac-regla__barra' });
      barra.style.left = (4 + r.s * PASO) + '%';
      barra.style.width = (r.n * PASO) + '%';
      regla.appendChild(barra);
      esc.appendChild(regla);
      botonesNumero(esc, ctx, r.opciones, r.n, function (v) { return { texto: v + ' cm', label: v + ' centímetros', clase: 'cm' }; });
    }
  };

  // ---------- 8. Cuerpos geométricos ----------
  var OBJETOS = [
    { e: '⚽', art: 'la', n: 'pelota', c: 'esfera' }, { e: '🏀', art: 'el', n: 'balón', c: 'esfera' },
    { e: '🎲', art: 'el', n: 'dado', c: 'cubo' }, { e: '🧊', art: 'el', n: 'cubo de hielo', c: 'cubo' },
    { e: '🥫', art: 'la', n: 'lata', c: 'cilindro' }, { e: '🎩', art: 'el', n: 'sombrero de copa', c: 'cilindro' },
    { e: '🍦', art: 'el', n: 'cono de helado', c: 'cono' },
    { e: '📦', art: 'la', n: 'caja', c: 'prisma' }, { e: '🧱', art: 'el', n: 'ladrillo', c: 'prisma' }
  ];
  var CUERPOS = [['esfera', 'cubo', 'cilindro'], ['esfera', 'cubo', 'cilindro', 'cono'], ['esfera', 'cubo', 'cilindro', 'cono', 'prisma']];
  var juego8 = {
    titulo: 'Cuerpos geométricos', emoji: '🧊', color: '#FFF3C9', resumen: 'Descubre la forma de cada objeto.',
    practica: 'Figuras en 3D',
    consejo: 'Busquen en casa cubos, esferas, cilindros y conos: dados, pelotas, latas y cucuruchos. Pregunten cuáles ruedan, cuáles se apilan y cuáles tienen caras planas.',
    crear: function (nivel) {
      var permitidos = CUERPOS[nivel];
      var obj = uno(OBJETOS.filter(function (o) { return permitidos.indexOf(o.c) >= 0; }));
      var opciones;
      if (nivel === 0) opciones = permitidos.slice();
      else if (nivel === 1) opciones = permitidos.slice();
      else opciones = [obj.c].concat(muestra(permitidos.filter(function (c) { return c !== obj.c; }), 3));
      opciones = barajar(opciones);
      return {
        instruccion: '¿Qué cuerpo geométrico se parece ' + (obj.art === 'el' ? 'al ' : 'a la ') + obj.n + '?', obj: obj, opciones: opciones,
        firma: obj.n + '|' + opciones.join(',')
      };
    },
    montar: function (r, esc, ctx) {
      esc.appendChild(h('div', { class: 'ac-modelo ac-modelo--coral' }, [
        h('span', { class: 'ac-modelo__emoji', text: r.obj.e, 'aria-hidden': 'true' }),
        h('span', { class: 'ac-modelo__nombre ac-modelo__nombre--chico', text: mayus(r.obj.n) })
      ]));
      var lista = r.opciones.map(function (c) {
        return { el: boton('ac-opt', mayus(c), [h('span', { class: 'ac-opt__num ac-opt__num--cuerpo', text: mayus(c), 'aria-hidden': 'true' })]), ok: c === r.obj.c };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  window.ActividadesMotor.iniciar({
    juegos: [juego1, juego2, juego3, juego4, juego5, juego6, juego7, juego8]
  });
  window.ActividadesMotor.revelar();
})();
