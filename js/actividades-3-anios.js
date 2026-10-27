// Actividades de 3 años: los ocho juegos como configuración (datos + funciones de reto).
// Cada juego define crear(nivel, previo) -> reto (con una "firma" para no repetirse) y montar(reto, escenario, ctx).
// Para otra edad basta con otro archivo así, apoyado en el mismo motor (js/actividades-motor.js).
(function () {
  var h = window.ActividadesMotor.h;

  // ---------- Datos comunes ----------
  var COLORES = [
    { id: 'rojo', hex: '#FF7A6B', nombre: 'Rojo', suave: '#FFF1EF' },
    { id: 'azul', hex: '#5BB8F0', nombre: 'Azul', suave: '#EEF8FE' },
    { id: 'amarillo', hex: '#FFD45E', nombre: 'Amarillo', suave: '#FFFAE8' },
    { id: 'verde', hex: '#7FD8B5', nombre: 'Verde', suave: '#EFFAF5' },
    { id: 'lila', hex: '#B7A6F2', nombre: 'Lila', suave: '#F5F2FE' }
  ];
  var FORMAS = [
    { id: 'circulo', nombre: 'círculo', fem: false },
    { id: 'cuadrado', nombre: 'cuadrado', fem: false },
    { id: 'triangulo', nombre: 'triángulo', fem: false },
    { id: 'rombo', nombre: 'rombo', fem: false },
    { id: 'estrella', nombre: 'estrella', fem: true }
  ];
  var GENERO = { rojo: 'roja', amarillo: 'amarilla' };

  // ---------- Utilidades ----------
  function azar(n) { return Math.floor(Math.random() * n); }
  function entre(a, b) { return a + azar(b - a + 1); }
  function uno(lista) { return lista[azar(lista.length)]; }
  function barajar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = azar(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function muestra(lista, n) { return barajar(lista).slice(0, n); }
  function px(n) { return 'calc(' + n + 'px * var(--k))'; }
  function nombreFigura(f) {
    return f.forma.nombre + ' ' + (f.forma.fem ? (GENERO[f.color.id] || f.color.id) : f.color.id);
  }

  // Figura dibujada con CSS: un contenedor con sombra y, dentro, la forma recortada.
  function figura(forma, color, tam) {
    var s = h('span', { class: 'ac-fig', 'data-forma': forma.id, 'data-color': color.id, 'aria-hidden': 'true' }, [
      h('i', { class: 'ac-f-' + forma.id, style: 'background:' + color.hex })
    ]);
    s.style.setProperty('--s', tam);
    return s;
  }
  function emoji(texto, tam) {
    var s = h('span', { class: 'ac-emo', 'aria-hidden': 'true', text: texto });
    if (tam) s.style.fontSize = tam;
    return s;
  }
  function puntos(n, clase) {
    var s = h('span', { class: 'ac-puntos ' + (clase || ''), 'aria-hidden': 'true' });
    for (var i = 0; i < n; i++) s.appendChild(h('span', { text: '●' }));
    return s;
  }
  function boton(clase, label, hijos) {
    return h('button', { class: clase, type: 'button', 'aria-label': label }, hijos);
  }
  // Opciones de respuesta única: la correcta resuelve el reto; las demás sacuden y avisan con cariño.
  function elegir(ctx, lista) {
    lista.forEach(function (o) {
      o.el.addEventListener('click', function () {
        if (!ctx.activo()) return;
        if (o.ok) {
          lista.forEach(function (p) { p.el.classList.add(p === o ? 'ac-ok' : 'ac-apagada'); });
          ctx.resuelto();
        } else {
          ctx.error(o.el);
        }
      });
    });
  }
  function fila(clase, hijos) { return h('div', { class: clase }, hijos); }
  function enfocarPrimero(esc) {
    var b = esc.querySelector('button:not(:disabled)');
    if (b) b.focus({ preventScroll: true });
  }

  var EMOJIS_CONTAR = ['🍎', '⭐', '🐥', '🧱', '🐟', '🍓', '🚗', '🎈'];
  var EMOJIS_GRUPO = ['🍎', '⭐', '🐥', '🍓', '🎈', '🐟'];
  var EMOJIS_MESA = ['🍎', '🍓', '🐥', '⭐', '🧱', '🐟'];
  var EMOJIS_TAMANO = ['🐘', '🐻', '🐶', '🐱', '🍎', '🎈', '🧸', '🚗'];

  // ---------- 1. Cuenta los objetos ----------
  var RANGO_1 = [[1, 3], [2, 4], [3, 5]];
  var juego1 = {
    titulo: 'Cuenta los objetos', emoji: '🍎', color: '#FFE3DF', resumen: 'Cuenta y toca el número.',
    practica: 'Conteo y cantidad',
    consejo: 'Cuenten juntos en voz alta señalando cada objeto con el dedo. Con tres años basta con llegar hasta 3 o 5; no importa si todavía no reconoce el número escrito.',
    crear: function (nivel) {
      var r = RANGO_1[nivel], n = entre(r[0], r[1]), e = uno(EMOJIS_CONTAR);
      var otros = muestra([1, 2, 3, 4, 5].filter(function (x) { return x !== n; }), 2);
      var opciones = barajar([n].concat(otros));
      return { instruccion: '¿Cuántos hay? Toca el número.', n: n, emoji: e, opciones: opciones, firma: [n, e, opciones.join('')].join('|') };
    },
    montar: function (r, esc, ctx) {
      var objetos = fila('ac-objetos');
      for (var i = 0; i < r.n; i++) {
        var o = emoji(r.emoji, 'var(--emo)');
        o.classList.add('ac-salta');
        o.style.animationDelay = (i * .35) + 's';
        objetos.appendChild(o);
      }
      var lista = r.opciones.map(function (v) {
        var b = boton('ac-opt', v + (v === 1 ? ' objeto' : ' objetos'), [
          h('span', { class: 'ac-opt__num', text: String(v), 'aria-hidden': 'true' }), puntos(v, 'ac-puntos--coral')
        ]);
        return { el: b, ok: v === r.n };
      });
      esc.appendChild(objetos);
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 2. Encuentra la misma figura ----------
  var juego2 = {
    titulo: 'Encuentra la misma figura', emoji: '🔺', color: '#DDF1FD', resumen: 'Busca la figura igual, aunque cambie de color.',
    practica: 'Reconocer figuras',
    consejo: 'Pregunta cómo es la figura: ¿es redonda?, ¿tiene picos?, ¿cuántos lados tiene? Mirar el color no basta: hay que fijarse en la forma.',
    crear: function () {
      var formas = muestra(FORMAS, 3), colores = muestra(COLORES, 4);
      // formas[0] es el modelo y la respuesta (en otro color); formas[1] y [2] son distractores.
      var figs = [
        { forma: formas[0], color: colores[1], ok: true },
        { forma: formas[1], color: colores[2], ok: false },
        { forma: formas[2], color: colores[3], ok: false }
      ];
      var opciones = barajar(figs);
      return {
        instruccion: 'Encuentra la misma figura.', modelo: { forma: formas[0], color: colores[0] }, opciones: opciones,
        firma: [formas[0].id, colores[0].id, opciones.map(function (o) { return o.forma.id + o.color.id; }).join('')].join('|')
      };
    },
    montar: function (r, esc, ctx) {
      esc.appendChild(h('div', { class: 'ac-modelo' }, [
        h('span', { class: 'ac-mono', text: 'Busca esta' }),
        figura(r.modelo.forma, r.modelo.color, px(120))
      ]));
      var lista = r.opciones.map(function (f) {
        var b = boton('ac-opt ac-opt--fig', 'Figura ' + f.forma.nombre, [figura(f.forma, f.color, px(100))]);
        return { el: b, ok: f.ok };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 3. Clasifica por colores ----------
  var juego3 = {
    titulo: 'Clasifica por colores', emoji: '🧺', color: '#FFF3C9', resumen: 'Toca un objeto y llévalo a su canasta.',
    practica: 'Clasificación',
    consejo: 'Invita a explicar por qué lo puso allí. Después busquen en el salón o en casa cosas del mismo color.',
    crear: function (nivel) {
      var colores = muestra(COLORES, 2), por = nivel === 0 ? 2 : 3, objetos = [], id = 0;
      colores.forEach(function (c) {
        for (var i = 0; i < por; i++) objetos.push({ id: id++, color: c, forma: uno(FORMAS) });
      });
      objetos = barajar(objetos);
      return {
        instruccion: 'Toca un objeto y luego su canasta.', colores: colores, objetos: objetos,
        firma: colores.map(function (c) { return c.id; }).join('') + '|' + objetos.map(function (o) { return o.forma.id + o.color.id; }).join('')
      };
    },
    montar: function (r, esc, ctx) {
      var seleccionado = null, pendientes = r.objetos.length;
      var filaObj = fila('ac-objetos ac-objetos--mezcla');
      var botones = {};
      r.objetos.forEach(function (o) {
        var b = boton('ac-tap', nombreFigura(o), [figura(o.forma, o.color, px(84))]);
        b.setAttribute('aria-pressed', 'false');
        botones[o.id] = b;
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          var yaEstaba = seleccionado === o;
          if (seleccionado) { botones[seleccionado.id].classList.remove('ac-sel'); botones[seleccionado.id].setAttribute('aria-pressed', 'false'); }
          seleccionado = yaEstaba ? null : o;
          if (seleccionado) { b.classList.add('ac-sel'); b.setAttribute('aria-pressed', 'true'); }
        });
        filaObj.appendChild(b);
      });
      var filaCan = fila('ac-canastas');
      r.colores.forEach(function (c) {
        var cuenta = puntos(0, 'ac-puntos--chico');
        var b = h('button', { class: 'ac-canasta', type: 'button', 'aria-label': 'Canasta ' + c.id }, [
          h('span', { class: 'ac-canasta__color', style: 'background:' + c.hex, 'aria-hidden': 'true' }),
          h('span', { class: 'ac-canasta__nombre', text: c.nombre }),
          cuenta
        ]);
        b.style.setProperty('--c', c.hex);
        b.style.setProperty('--suave', c.suave);
        var dentro = 0;
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          if (!seleccionado) { ctx.error(b, 'Primero toca un objeto.'); return; }
          var o = seleccionado, bo = botones[o.id];
          if (o.color.id !== c.id) { ctx.error(bo); return; }
          seleccionado = null;
          bo.parentNode.removeChild(bo);
          dentro++;
          cuenta.appendChild(h('span', { text: '●' }));
          cuenta.setAttribute('aria-label', dentro + ' en la canasta ' + c.id);
          pendientes--;
          if (pendientes === 0) ctx.resuelto(); else ctx.parcial();
        });
        filaCan.appendChild(b);
      });
      esc.appendChild(filaObj);
      esc.appendChild(filaCan);
    }
  };

  // ---------- 4. Grande y pequeño ----------
  var juego4 = {
    titulo: 'Grande y pequeño', emoji: '🐘', color: '#D9F5E9', resumen: 'Encuentra el más grande o el más pequeño.',
    practica: 'Comparar tamaños',
    consejo: 'Usen las palabras grande, mediano y pequeño en la vida diaria: zapatos, vasos, peluches.',
    crear: function (nivel) {
      var e = uno(EMOJIS_TAMANO), tamanos = nivel === 0 ? [150, 66] : [160, 108, 62];
      var orden = barajar(tamanos), pide = uno(['grande', 'pequeño']);
      return { instruccion: pide === 'grande' ? 'Toca el más grande.' : 'Toca el más pequeño.', emoji: e, orden: orden, pide: pide, tamanos: tamanos, firma: [e, orden.join(','), pide].join('|') };
    },
    montar: function (r, esc, ctx) {
      var max = Math.max.apply(null, r.tamanos), min = Math.min.apply(null, r.tamanos);
      var lista = r.orden.map(function (t) {
        var nombre = t === max ? 'grande' : (t === min ? 'pequeño' : 'mediano');
        var b = boton('ac-tap ac-tap--tam', 'objeto ' + nombre, [emoji(r.emoji)]);
        b.style.setProperty('--t', t);
        return { el: b, ok: r.pide === 'grande' ? t === max : t === min };
      });
      esc.appendChild(fila('ac-tamanos', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 5. ¿Dónde hay más? ----------
  var juego5 = {
    titulo: '¿Dónde hay más?', emoji: '🍓', color: '#ECE7FD', resumen: 'Compara dos grupos de objetos.',
    practica: 'Comparar cantidades',
    consejo: 'Antes de elegir, cuenten cada grupo con el dedo o emparejen objeto con objeto. Así descubren por qué uno tiene más.',
    crear: function (nivel) {
      var e = uno(EMOJIS_GRUPO), a, b, minDif = nivel === 2 ? 1 : 2;
      do { a = entre(1, 5); b = entre(1, 5); } while (Math.abs(a - b) < minDif);
      var pide = nivel === 0 ? 'más' : uno(['más', 'menos']);
      return { instruccion: '¿Dónde hay ' + pide + '?', emoji: e, a: a, b: b, pide: pide, firma: [e, a, b, pide].join('|') };
    },
    montar: function (r, esc, ctx) {
      var gana = r.pide === 'más' ? Math.max(r.a, r.b) : Math.min(r.a, r.b);
      var lista = [r.a, r.b].map(function (n) {
        var g = h('span', { class: 'ac-grupo__emos', 'aria-hidden': 'true' });
        for (var i = 0; i < n; i++) g.appendChild(emoji(r.emoji, px(54)));
        var b = boton('ac-opt ac-grupo', 'Grupo con ' + n + (n === 1 ? ' objeto' : ' objetos'), [g]);
        return { el: b, ok: n === gana };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 6. Completa la serie ----------
  var PATRONES = ['ABABAB', 'AABAAB', 'ABCABC'];
  var juego6 = {
    titulo: 'Completa la serie', emoji: '🔁', color: '#FFE3DF', resumen: 'Mira el patrón y elige lo que sigue.',
    practica: 'Patrones',
    consejo: 'Repitan el patrón en voz alta (círculo, estrella, círculo...). También pueden crear uno con bloques o aplausos.',
    crear: function (nivel) {
      var patron = PATRONES[nivel], formas = muestra(FORMAS, 4), colores = muestra(COLORES, 4);
      var fig = function (i) { return { forma: formas[i], color: colores[i] }; };
      var letras = { A: fig(0), B: fig(1), C: fig(2) };
      var distractora = fig(3);
      var usadas = nivel === 2 ? ['A', 'B', 'C'] : ['A', 'B'];
      var opciones = barajar(usadas.map(function (l) { return { f: letras[l], ok: l === patron[5] }; }).concat([{ f: distractora, ok: false }]));
      return {
        instruccion: '¿Qué sigue en la serie?', patron: patron, letras: letras, opciones: opciones,
        firma: patron + '|' + ['A', 'B', 'C'].map(function (l) { return letras[l].forma.id + letras[l].color.id; }).join('') + '|' + opciones.map(function (o) { return o.f.forma.id; }).join('')
      };
    },
    montar: function (r, esc, ctx) {
      var tam = 'calc(var(--cell) * .64)';
      var banda = fila('ac-banda');
      var casillas = [];
      for (var i = 0; i < 6; i++) {
        var c = h('span', { class: 'ac-casilla' });
        if (i < 5) { var f = r.letras[r.patron[i]]; c.appendChild(figura(f.forma, f.color, tam)); }
        else { c.classList.add('ac-casilla--duda'); c.appendChild(h('span', { class: 'ac-casilla__q', text: '?', 'aria-label': 'Casilla vacía' })); }
        casillas.push(c);
        banda.appendChild(c);
      }
      var lista = r.opciones.map(function (o) {
        var b = boton('ac-opt ac-opt--chica', 'Figura ' + o.f.forma.nombre, [figura(o.f.forma, o.f.color, 'max(48px, calc(56px * var(--k)))')]);
        return { el: b, ok: o.ok, f: o.f };
      });
      esc.appendChild(banda);
      esc.appendChild(fila('ac-opciones ac-opciones--serie', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
      // Al acertar, la casilla «?» se llena con la figura elegida.
      lista.forEach(function (o) {
        o.el.addEventListener('click', function () {
          if (!o.ok) return;
          var q = casillas[5];
          q.classList.remove('ac-casilla--duda');
          q.innerHTML = '';
          q.appendChild(figura(o.f.forma, o.f.color, tam));
        });
      });
    }
  };

  // ---------- 7. Une las figuras iguales ----------
  var juego7 = {
    titulo: 'Une las figuras iguales', emoji: '🧩', color: '#DDF1FD', resumen: 'Toca una figura y luego su pareja.',
    practica: 'Emparejar y discriminar',
    consejo: 'Conversen sobre lo que tienen igual y lo que cambia: forma, color o tamaño.',
    crear: function (nivel) {
      var n = nivel === 0 ? 2 : 3, formas = muestra(FORMAS, n), colores = muestra(COLORES, n);
      var pares = formas.map(function (f, i) { return { id: i, forma: f, color: colores[i] }; });
      var der;
      do { der = barajar(pares); } while (der.every(function (p, i) { return p === pares[i]; }));
      return { instruccion: 'Toca una figura y luego su pareja.', izq: pares, der: der, firma: pares.map(function (p) { return p.forma.id + p.color.id; }).join('') + '|' + der.map(function (p) { return p.id; }).join('') };
    },
    montar: function (r, esc, ctx) {
      var sel = null, quedan = r.izq.length;
      var colI = fila('ac-columna'), colD = fila('ac-columna');
      var bI = {}, bD = {};
      r.izq.forEach(function (p) {
        var b = boton('ac-tap', 'Figura de la izquierda: ' + nombreFigura(p), [figura(p.forma, p.color, px(76))]);
        b.setAttribute('aria-pressed', 'false');
        bI[p.id] = b;
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          if (sel !== null) { bI[sel].classList.remove('ac-sel'); bI[sel].setAttribute('aria-pressed', 'false'); }
          sel = sel === p.id ? null : p.id;
          if (sel !== null) { b.classList.add('ac-sel'); b.setAttribute('aria-pressed', 'true'); }
        });
        colI.appendChild(b);
      });
      r.der.forEach(function (p) {
        var b = boton('ac-tap', 'Figura de la derecha: ' + nombreFigura(p), [figura(p.forma, p.color, px(76))]);
        bD[p.id] = b;
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          if (sel === null) { ctx.error(b, 'Primero toca una figura de la izquierda.'); return; }
          if (sel !== p.id) { ctx.error(b); return; }
          [bI[sel], b].forEach(function (x) { x.classList.remove('ac-sel'); x.classList.add('ac-unida'); x.disabled = true; });
          bI[sel].setAttribute('aria-pressed', 'false');
          sel = null;
          quedan--;
          if (quedan === 0) ctx.resuelto();
          else { ctx.parcial(); enfocarPrimero(esc); }
        });
        colD.appendChild(b);
      });
      esc.appendChild(fila('ac-parejas', [colI, colD]));
    }
  };

  // ---------- 8. Pon la cantidad ----------
  var RANGO_8 = [[1, 2], [2, 4], [3, 4]];
  var juego8 = {
    titulo: 'Pon la cantidad', emoji: '🛒', color: '#FFF3C9', resumen: 'Pon en la canasta los que te piden.',
    practica: 'Cantidad y conteo uno a uno',
    consejo: 'Cuenten en voz alta cada objeto que pone en la canasta. Si se equivoca, pídanle que saque algunos y vuelvan a contar uno por uno.',
    crear: function (nivel) {
      var r = RANGO_8[nivel], n = entre(r[0], r[1]), e = uno(EMOJIS_MESA), mesa = nivel === 0 ? 5 : 6;
      return { instruccion: 'Pon ' + n + ' en la canasta.', n: n, emoji: e, mesa: mesa, firma: [n, e, mesa].join('|') };
    },
    montar: function (r, esc, ctx) {
      var enCesta = [];
      for (var i = 0; i < r.mesa; i++) enCesta.push(false);
      var pedido = h('div', { class: 'ac-pedido' }, [
        h('span', { class: 'ac-mono', text: 'Pon' }),
        h('span', { class: 'ac-pedido__num', text: String(r.n), 'aria-hidden': 'true' }),
        puntos(r.n, 'ac-puntos--coral')
      ]);
      var mesa = fila('ac-mesa');
      var cesta = h('div', { class: 'ac-cesta' });
      var cestaItems = fila('ac-cesta__items');
      cesta.appendChild(h('span', { class: 'ac-mono', text: '🧺 Canasta' }));
      cesta.appendChild(cestaItems);

      function pintar(foco) {
        mesa.innerHTML = ''; cestaItems.innerHTML = '';
        enCesta.forEach(function (dentro, i) {
          if (dentro) {
            var b = boton('ac-tap ac-tap--cesta', 'Objeto en la canasta. Toca para devolverlo.', [emoji(r.emoji, px(60))]);
            b.dataset.i = i;
            b.addEventListener('click', function () { if (ctx.activo()) { enCesta[i] = false; pintar(i); } });
            cestaItems.appendChild(b);
            mesa.appendChild(h('span', { class: 'ac-hueco', 'aria-hidden': 'true' }, [emoji(r.emoji, 'var(--emo-mesa)')]));
          } else {
            var m = boton('ac-tap', 'Objeto en la mesa. Toca para ponerlo en la canasta.', [emoji(r.emoji, 'var(--emo-mesa)')]);
            m.dataset.i = i;
            m.addEventListener('click', function () { if (ctx.activo()) { enCesta[i] = true; pintar(i); } });
            mesa.appendChild(m);
          }
        });
        if (foco !== undefined) {
          var nuevo = esc.querySelector('button[data-i="' + foco + '"]');
          if (nuevo && document.activeElement === document.body) nuevo.focus({ preventScroll: true });
        }
      }
      pintar();
      esc.appendChild(pedido);
      esc.appendChild(mesa);
      esc.appendChild(cesta);
      ctx.listo('¡Listo! ✔', function () {
        if (!ctx.activo()) return;
        var cuantos = enCesta.filter(Boolean).length;
        if (cuantos === r.n) ctx.resuelto();
        else ctx.error(cesta, 'Cuenta otra vez, con calma.');
      });
    }
  };

  window.ActividadesMotor.iniciar({
    juegos: [juego1, juego2, juego3, juego4, juego5, juego6, juego7, juego8]
  });
  window.ActividadesMotor.revelar();
})();
