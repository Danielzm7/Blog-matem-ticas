// Actividades de 5 años: los ocho juegos como configuración (datos + funciones de reto).
// Misma estructura que 3 y 4 años; las piezas compartidas viven en js/actividades-comun.js.
(function () {
  var h = window.ActividadesMotor.h;
  var C = window.ActividadesMotor.comun;
  var COLORES = C.COLORES, FORMAS6 = C.FORMAS6;
  var entre = C.entre, uno = C.uno, barajar = C.barajar, muestra = C.muestra, px = C.px;
  var figura = C.figura, emoji = C.emoji, puntos = C.puntos, boton = C.boton;
  var elegir = C.elegir, fila = C.fila, enfocarPrimero = C.enfocarPrimero;

  // Tres números: el correcto y dos cercanos (±1, ±2) dentro del rango, sin repetir.
  function numeros(v, min, max) {
    var cerca = [v - 2, v - 1, v + 1, v + 2].filter(function (x) { return x >= min && x <= max; });
    var otros = barajar(cerca).slice(0, 2);
    // Si el rango es tan estrecho que faltan, se completan con los más cercanos libres.
    for (var d = 3; otros.length < 2 && d < 12; d++) {
      [v - d, v + d].forEach(function (x) { if (otros.length < 2 && x >= min && x <= max && otros.indexOf(x) < 0) otros.push(x); });
    }
    return barajar([v].concat(otros));
  }
  function botonesNumero(esc, ctx, opciones, correcto) {
    var lista = opciones.map(function (v) {
      return { el: boton('ac-opt', String(v), [h('span', { class: 'ac-opt__num', text: String(v), 'aria-hidden': 'true' })]), ok: v === correcto };
    });
    esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
    elegir(ctx, lista);
    return lista;
  }
  // Cuando se acierta, la casilla «?» se llena con el valor.
  function rellenarAlAcertar(lista, casilla, texto) {
    lista.forEach(function (o) {
      o.el.addEventListener('click', function () {
        if (!o.ok) return;
        casilla.classList.remove('ac-casilla--duda');
        casilla.classList.add('ac-casilla--ok');
        casilla.innerHTML = '';
        casilla.appendChild(h('span', { class: 'ac-casilla__q', text: String(texto) }));
      });
    });
  }
  function interrogante(extra) {
    return h('span', { class: 'ac-casilla ac-casilla--duda ' + (extra || '') }, [
      h('span', { class: 'ac-casilla__q', text: '?', 'aria-label': 'Casilla vacía' })
    ]);
  }

  // ---------- 1. Cuadro del diez ----------
  var RANGO_P = [[1, 5], [4, 9], [3, 9]];
  var juego1 = {
    titulo: 'Cuadro del diez', emoji: '🔟', color: '#DDF1FD', resumen: 'Mira los puntos y cuenta hasta 10.',
    practica: 'Conteo hasta 10 y descomposición del 10',
    consejo: 'Usen los dedos de las dos manos: 10 dedos son 5 y 5. Pregunten «¿cuántos dedos están abajo?» para ver cuántos faltan para llegar a 10.',
    crear: function (nivel) {
      var r = RANGO_P[nivel], p = entre(r[0], r[1]), faltan = nivel === 2;
      var resp = faltan ? 10 - p : p;
      return {
        instruccion: faltan ? '¿Cuántos faltan para llegar a 10?' : '¿Cuántos puntos hay?',
        puntos: p, resp: resp, opciones: numeros(resp, 1, 10), firma: [p, faltan].join('|') + '|' + ''
      };
    },
    montar: function (r, esc, ctx) {
      var cuadro = h('div', { class: 'ac-diez', role: 'img', 'aria-label': 'Cuadro de diez con ' + r.puntos + ' puntos' });
      for (var i = 0; i < 10; i++) {
        var c = h('span', { class: 'ac-diez__casilla' });
        if (i < r.puntos) c.appendChild(h('span', { class: 'ac-diez__punto' }));
        cuadro.appendChild(c);
      }
      esc.appendChild(cuadro);
      botonesNumero(esc, ctx, r.opciones, r.resp);
    }
  };

  // ---------- 2. Suma de galletas ----------
  var EMOJIS_SUMA = ['🍪', '🍓', '🍎', '🍬', '🧁'];
  var MAX_SUMA = [6, 8, 10];
  function sumando(n, e, color) {
    var g = h('span', { class: 'ac-emos-chicos' });
    for (var i = 0; i < n; i++) g.appendChild(emoji(e, px(34)));
    return h('div', { class: 'ac-sumando', style: 'background:' + color, 'aria-label': n + ' ' + e }, [
      h('span', { class: 'ac-sumando__num', text: String(n), 'aria-hidden': 'true' }), g
    ]);
  }
  var juego2 = {
    titulo: 'Suma de galletas', emoji: '🍪', color: '#FFF3C9', resumen: 'Suma dos números y encuentra el total.',
    practica: 'Suma hasta 10',
    consejo: 'Que cuente el primer grupo y siga contando con el segundo («tres... cuatro, cinco»). Después pueden sumar con piedritas, fichas o frutas reales.',
    crear: function (nivel) {
      var a, b, max = MAX_SUMA[nivel], e = uno(EMOJIS_SUMA);
      do { a = entre(1, max - 1); b = entre(1, max - 1); } while (a + b < 3 || a + b > max);
      var total = a + b;
      return { instruccion: 'Suma y encuentra el total.', a: a, b: b, total: total, emoji: e, opciones: numeros(total, 1, 11), firma: [a, b, e, ''].join('+') };
    },
    montar: function (r, esc, ctx) {
      var duda = interrogante('ac-casilla--grande');
      esc.appendChild(fila('ac-suma', [
        sumando(r.a, r.emoji, '#FFF3C9'),
        h('span', { class: 'ac-signo ac-signo--mas', text: '+', 'aria-hidden': 'true' }),
        sumando(r.b, r.emoji, '#D9F5E9'),
        h('span', { class: 'ac-signo ac-signo--igual', text: '=', 'aria-hidden': 'true' }),
        duda
      ]));
      rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.total), duda, r.total);
    }
  };

  // ---------- 3. Se van los globos ----------
  var EMOJIS_GLOBOS = ['🎈', '🦆', '🐟', '🍎', '🚗'];
  var GLOBOS = [{ n: [3, 5], k: [1, 2] }, { n: [5, 8], k: [1, 4] }, { n: [6, 10], k: [2, 6] }];
  var juego3 = {
    titulo: 'Se van los globos', emoji: '🎈', color: '#FFE3DF', resumen: 'Mira cuántos se fueron y cuenta los que quedan.',
    practica: 'Resta con objetos',
    consejo: 'Usen objetos reales: pongan 6 fichas, quiten 2 y pregunten cuántas quedan. Cuenten la historia: «tenía... se fueron... quedan».',
    crear: function (nivel) {
      var g = GLOBOS[nivel], n = entre(g.n[0], g.n[1]), k;
      do { k = entre(g.k[0], g.k[1]); } while (k >= n);
      var e = uno(EMOJIS_GLOBOS), quedan = n - k;
      return { instruccion: 'Algunos se fueron. ¿Cuántos quedan?', n: n, k: k, quedan: quedan, emoji: e, opciones: numeros(quedan, 1, 10), firma: [n, k, e].join('|') };
    },
    montar: function (r, esc, ctx) {
      var franja = h('div', { class: 'ac-franja ac-franja--coral', role: 'img', 'aria-label': r.n + ' objetos y ' + r.k + ' tachados' });
      for (var i = 0; i < r.n; i++) {
        var o = h('span', { class: 'ac-globo' }, [emoji(r.emoji, px(56))]);
        if (i >= r.n - r.k) { o.classList.add('ac-globo--ido'); o.appendChild(h('span', { class: 'ac-globo__x', text: '✕' })); }
        franja.appendChild(o);
      }
      esc.appendChild(franja);
      botonesNumero(esc, ctx, r.opciones, r.quedan);
    }
  };

  // ---------- 4. Números vecinos ----------
  var juego4 = {
    titulo: 'Números vecinos', emoji: '🏘️', color: '#D9F5E9', resumen: '¿Qué número va antes, después o en medio?',
    practica: 'Antes, después y entre',
    consejo: 'Canten la serie numérica y deténganse antes de un número para que lo completen. Después busquen los vecinos de un número en una puerta o en un buzón.',
    crear: function (nivel) {
      var tipo = nivel === 0 ? 'despues' : (nivel === 1 ? uno(['antes', 'despues']) : 'medio'), max = nivel === 2 ? 15 : 9, x, resp, celdas, texto;
      if (tipo === 'despues') { x = entre(1, max - 1); resp = x + 1; celdas = [x, null]; texto = '¿Qué número va después del ' + x + '?'; }
      else if (tipo === 'antes') { x = entre(2, max); resp = x - 1; celdas = [null, x]; texto = '¿Qué número va antes del ' + x + '?'; }
      else { x = entre(2, max - 1); resp = x; celdas = [x - 1, null, x + 1]; texto = '¿Qué número va en el medio?'; }
      return { instruccion: texto, celdas: celdas, resp: resp, opciones: numeros(resp, 1, max), firma: tipo + '|' + celdas.join(',') };
    },
    montar: function (r, esc, ctx) {
      var banda = fila('ac-banda ac-banda--verde'), duda;
      r.celdas.forEach(function (n) {
        if (n === null) { duda = interrogante('ac-casilla--vecino'); banda.appendChild(duda); }
        else banda.appendChild(h('span', { class: 'ac-casilla ac-casilla--vecino' }, [h('span', { class: 'ac-casilla__q', text: String(n) })]));
      });
      esc.appendChild(banda);
      rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.resp), duda, r.resp);
    }
  };

  // ---------- 5. Figuras escondidas ----------
  var OBJETOS = [
    { e: '⚽', art: 'la', n: 'pelota', f: 'circulo' }, { e: '🍪', art: 'la', n: 'galleta', f: 'circulo' },
    { e: '🍕', art: 'el', n: 'pedazo de pizza', f: 'triangulo' }, { e: '🪟', art: 'la', n: 'ventana', f: 'cuadrado' },
    { e: '📺', art: 'el', n: 'televisor', f: 'rectangulo' }, { e: '🧱', art: 'el', n: 'ladrillo', f: 'rectangulo' },
    { e: '🪁', art: 'la', n: 'cometa', f: 'rombo' }, { e: '💎', art: 'el', n: 'diamante', f: 'rombo' },
    { e: '⭐', art: 'la', n: 'estrella', f: 'estrella' }
  ];
  var PARECIDAS = ['cuadrado', 'rectangulo', 'rombo'];
  function forma(id) { return FORMAS6.filter(function (f) { return f.id === id; })[0]; }
  var juego5 = {
    titulo: 'Figuras escondidas', emoji: '🔍', color: '#ECE7FD', resumen: 'Descubre qué figura tiene cada objeto.',
    practica: 'Figuras en el entorno',
    consejo: 'Salgan a buscar figuras en casa: ¿qué tiene forma de círculo?, ¿de rectángulo? Conversen sobre si tiene picos o es redondo.',
    crear: function (nivel) {
      var obj = uno(OBJETOS), cuantas = nivel === 0 ? 3 : 4, ids = [obj.f];
      var otras = FORMAS6.map(function (f) { return f.id; }).filter(function (x) { return x !== obj.f; });
      if (nivel === 2 && PARECIDAS.indexOf(obj.f) >= 0) {
        var par = barajar(PARECIDAS.filter(function (x) { return x !== obj.f; }));
        ids = ids.concat(par);
        otras = otras.filter(function (x) { return par.indexOf(x) < 0; });
      }
      ids = ids.concat(barajar(otras)).slice(0, cuantas);
      ids = barajar(ids);
      var colores = muestra(COLORES, ids.length);
      var figs = ids.map(function (id, i) { return { forma: forma(id), color: colores[i], ok: id === obj.f }; });
      return {
        instruccion: '¿Qué figura se parece a ' + obj.art + ' ' + obj.n + '?', obj: obj, figs: figs,
        firma: obj.n + '|' + figs.map(function (f) { return f.forma.id + f.color.id; }).join('')
      };
    },
    montar: function (r, esc, ctx) {
      esc.appendChild(h('div', { class: 'ac-modelo' }, [
        h('span', { class: 'ac-modelo__emoji', text: r.obj.e, 'aria-hidden': 'true' }),
        h('span', { class: 'ac-modelo__nombre ac-modelo__nombre--chico', text: r.obj.n.charAt(0).toUpperCase() + r.obj.n.slice(1) })
      ]));
      var lista = r.figs.map(function (f) {
        return { el: boton('ac-opt ac-opt--fig', f.forma.nombre, [figura(f.forma, f.color, px(100))]), ok: f.ok };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 6. ¿Cuál es mayor? ----------
  var TOPE = [6, 10, 20];
  var juego6 = {
    titulo: '¿Cuál es mayor?', emoji: '⚖️', color: '#FFE3DF', resumen: 'Compara dos números y elige.',
    practica: 'Comparar números',
    consejo: 'Usen las palabras «mayor» y «menor» y comprueben con objetos: ¿cuál montón es más grande? Después prueben con cartas numeradas.',
    crear: function (nivel) {
      var a, b, tope = TOPE[nivel];
      do { a = entre(1, tope); b = entre(1, tope); } while (a === b || (nivel === 0 && Math.abs(a - b) < 2));
      var pide = nivel === 0 ? 'mayor' : uno(['mayor', 'menor']);
      return { instruccion: 'Toca el número ' + pide + '.', a: a, b: b, pide: pide, ayuda: nivel === 0, firma: [a, b, pide].join('|') };
    },
    montar: function (r, esc, ctx) {
      var gana = r.pide === 'mayor' ? Math.max(r.a, r.b) : Math.min(r.a, r.b);
      var lista = [r.a, r.b].map(function (v) {
        var hijos = [h('span', { class: 'ac-opt__num', text: String(v), 'aria-hidden': 'true' })];
        if (r.ayuda) hijos.push(puntos(v, 'ac-puntos--coral'));
        return { el: boton('ac-opt ac-opt--enorme', String(v), hijos), ok: v === gana };
      });
      esc.appendChild(fila('ac-opciones ac-opciones--enorme', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 7. Lee la gráfica ----------
  var EMOJIS_GRAFICA = ['🍎', '🍌', '🍇', '🐶', '🐱', '🚗', '⭐', '🎈'];
  var COLORES_BARRA = ['#FF7A6B', '#FFD45E', '#7FD8B5'];
  var juego7 = {
    titulo: 'Lee la gráfica', emoji: '📊', color: '#DDF1FD', resumen: 'Mira las barras y responde.',
    practica: 'Lectura de datos',
    consejo: 'Hagan su propia gráfica con objetos de casa: ¿cuántos zapatos, cuántas medias? Pregunten «¿de cuál hay más?» y «¿cuántos más?».',
    crear: function (nivel) {
      var emojis = muestra(EMOJIS_GRAFICA, 3), cant = muestra([1, 2, 3, 4, 5, 6, 7], 3), r = { emojis: emojis, cant: cant, nivel: nivel };
      if (nivel === 0) {
        var mx = Math.max.apply(null, cant); r.tipo = 'mas'; r.resp = emojis[cant.indexOf(mx)];
        r.instruccion = '¿De cuál hay más?'; r.opciones = barajar(emojis);
      } else if (nivel === 1) {
        var i = entre(0, 2); r.tipo = 'cuantos'; r.resp = cant[i]; r.instruccion = '¿Cuántos ' + emojis[i] + ' hay?'; r.opciones = numeros(cant[i], 0, 9);
      } else {
        var orden = [0, 1, 2].sort(function (x, y) { return cant[y] - cant[x]; });
        var A = orden[0], B = uno([orden[1], orden[2]]);
        r.tipo = 'dif'; r.resp = cant[A] - cant[B]; r.instruccion = '¿Cuántos más hay de ' + emojis[A] + ' que de ' + emojis[B] + '?'; r.opciones = numeros(r.resp, 0, 9);
      }
      r.firma = [emojis.join(''), cant.join(''), r.instruccion].join('|');
      return r;
    },
    montar: function (r, esc, ctx) {
      var tarjeta = h('div', { class: 'ac-grafica' });
      r.emojis.forEach(function (e, i) {
        var barra = h('span', { class: 'ac-grafica__barra', role: 'img', 'aria-label': r.cant[i] + ' ' + e });
        for (var k = 0; k < r.cant[i]; k++) barra.appendChild(h('span', { class: 'ac-grafica__cuadro', style: 'background:' + COLORES_BARRA[i] }));
        tarjeta.appendChild(h('div', { class: 'ac-grafica__fila' }, [h('span', { class: 'ac-grafica__emoji', text: e, 'aria-hidden': 'true' }), barra]));
      });
      esc.appendChild(tarjeta);
      if (r.tipo === 'mas') {
        var lista = r.opciones.map(function (e) {
          return { el: boton('ac-opt', 'barra de ' + e, [emoji(e, px(64))]), ok: e === r.resp };
        });
        esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
        elegir(ctx, lista);
      } else botonesNumero(esc, ctx, r.opciones, r.resp);
    }
  };

  // ---------- 8. Ordena los números ----------
  var ORDEN = [{ n: 3, max: 9 }, { n: 4, max: 12 }, { n: 4, max: 20 }];
  var juego8 = {
    titulo: 'Ordena los números', emoji: '🪜', color: '#FFF3C9', resumen: 'Toca los números en orden.',
    practica: 'Orden de los números',
    consejo: 'Escriban números en tarjetas, mézclenlas y pídanle que las ordene de menor a mayor y luego al revés.',
    crear: function (nivel) {
      var o = ORDEN[nivel], nums = muestra(Array.apply(null, Array(o.max)).map(function (_, i) { return i + 1; }), o.n);
      var asc = nivel < 2 || Math.random() < .5, meta = nums.slice().sort(function (a, b) { return asc ? a - b : b - a; }), orden;
      do { orden = barajar(nums); } while (orden.every(function (v, i) { return v === meta[i]; }));
      return {
        instruccion: asc ? 'Toca los números del menor al mayor.' : 'Toca los números del mayor al menor.',
        orden: orden, meta: meta, firma: orden.join(',') + '|' + asc
      };
    },
    montar: function (r, esc, ctx) {
      var siguiente = 0;
      var contenedor = fila('ac-opciones');
      r.orden.forEach(function (n) {
        var b = boton('ac-opt ac-opt--insignia', String(n), [h('span', { class: 'ac-opt__num', text: String(n), 'aria-hidden': 'true' })]);
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          if (n !== r.meta[siguiente]) { ctx.error(b); return; }
          siguiente++;
          b.classList.add('ac-ok', 'ac-hecho');
          b.appendChild(h('span', { class: 'ac-insignia ac-insignia--grande', text: String(siguiente), 'aria-hidden': 'true' }));
          b.disabled = true;
          if (siguiente === r.meta.length) ctx.resuelto(); else { ctx.parcial(); enfocarPrimero(esc); }
        });
        contenedor.appendChild(b);
      });
      esc.appendChild(contenedor);
    }
  };

  window.ActividadesMotor.iniciar({
    juegos: [juego1, juego2, juego3, juego4, juego5, juego6, juego7, juego8]
  });
  window.ActividadesMotor.revelar();
})();
