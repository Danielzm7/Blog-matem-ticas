// Actividades de 4 años: los ocho juegos como configuración (datos + funciones de reto).
// Misma estructura que la de 3 años; las piezas compartidas viven en js/actividades-comun.js.
(function () {
  var h = window.ActividadesMotor.h;
  var C = window.ActividadesMotor.comun;
  var COLORES = C.COLORES, FORMAS6 = C.FORMAS6;
  var entre = C.entre, uno = C.uno, barajar = C.barajar, muestra = C.muestra, px = C.px;
  var nombreFigura = C.nombreFigura, figura = C.figura, emoji = C.emoji, puntos = C.puntos, boton = C.boton;
  var elegir = C.elegir, fila = C.fila, enfocarPrimero = C.enfocarPrimero;
  var SOMBRA = { id: 'sombra', hex: '#8FA0BF' };

  function articulo(f) { return f.fem ? 'la' : 'el'; }
  function forma(id) { return FORMAS6.filter(function (f) { return f.id === id; })[0]; }
  function sinRepetir(lista) { return lista.filter(function (x, i) { return lista.indexOf(x) === i; }); }

  // ---------- 1. Junta y cuenta ----------
  var EMOJIS_JUNTA = ['🍇', '🍌', '🍊', '🥕', '🐸', '🦆', '🐢', '🐞'];
  var PAREJAS = [
    [[1, 1], [1, 2], [2, 1], [2, 2], [1, 3], [3, 1]],
    [[1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1], [2, 2]],
    [[3, 3], [2, 4], [4, 2], [1, 5], [5, 1], [3, 2], [2, 3]]
  ];
  function grupo(n, e, color) {
    var g = h('div', { class: 'ac-grupo-suma', style: 'background:' + color, 'aria-hidden': 'true' });
    for (var i = 0; i < n; i++) g.appendChild(emoji(e, px(52)));
    return g;
  }
  var juego1 = {
    titulo: 'Junta y cuenta', emoji: '➕', color: '#D9F5E9', resumen: 'Junta dos grupos y cuenta cuántos hay.',
    practica: 'Juntar y contar (suma con objetos)',
    consejo: 'Pidan que cuente el primer grupo, luego el segundo y al final todo junto. Con objetos reales (galletas, bloques) se entiende mejor que «juntar» es agregar.',
    crear: function (nivel) {
      var par = uno(PAREJAS[nivel]), total = par[0] + par[1], e = uno(EMOJIS_JUNTA);
      var cerca = barajar([total - 2, total - 1, total + 1, total + 2].filter(function (x) { return x >= 1; })).slice(0, 2);
      var opciones = barajar([total].concat(cerca));
      return {
        instruccion: 'Junta los dos grupos. ¿Cuántos hay en total?', a: par[0], b: par[1], total: total, emoji: e,
        opciones: opciones, ayuda: nivel === 0, firma: [par.join('+'), e, opciones.join('')].join('|')
      };
    },
    montar: function (r, esc, ctx) {
      var duda = h('span', { class: 'ac-casilla ac-casilla--grande ac-casilla--duda' }, [
        h('span', { class: 'ac-casilla__q', text: '?', 'aria-label': 'Casilla vacía' })
      ]);
      esc.appendChild(fila('ac-suma', [
        grupo(r.a, r.emoji, '#FFF3C9'),
        h('span', { class: 'ac-signo ac-signo--mas', text: '+', 'aria-hidden': 'true' }),
        grupo(r.b, r.emoji, '#D9F5E9'),
        h('span', { class: 'ac-signo ac-signo--igual', text: '=', 'aria-hidden': 'true' }),
        duda
      ]));
      var lista = r.opciones.map(function (v) {
        var hijos = [h('span', { class: 'ac-opt__num', text: String(v), 'aria-hidden': 'true' })];
        if (r.ayuda) hijos.push(puntos(v, 'ac-puntos--coral'));
        return { el: boton('ac-opt', String(v), hijos), ok: v === r.total, v: v };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
      lista.forEach(function (o) {
        o.el.addEventListener('click', function () {
          if (!o.ok) return;
          duda.classList.remove('ac-casilla--duda');
          duda.classList.add('ac-casilla--ok');
          duda.innerHTML = '';
          duda.appendChild(h('span', { class: 'ac-casilla__q', text: String(r.total) }));
        });
      });
    }
  };

  // ---------- 2. Nombra las figuras ----------
  var SIMILARES = ['cuadrado', 'rectangulo', 'rombo'];
  var juego2 = {
    titulo: 'Nombra las figuras', emoji: '🔶', color: '#FFE3DF', resumen: 'Toca el círculo, el cuadrado, el triángulo...',
    practica: 'Nombrar figuras',
    consejo: 'Digan el nombre de cada figura y busquen la misma forma en objetos de casa: una pelota, una ventana, un pañuelo.',
    crear: function (nivel) {
      var cuantas = nivel === 0 ? 3 : 4, ids;
      if (nivel === 2) {
        var otras = FORMAS6.map(function (f) { return f.id; }).filter(function (x) { return SIMILARES.indexOf(x) < 0; });
        ids = muestra(SIMILARES, 3).concat(muestra(otras, 1));
      } else {
        ids = muestra(FORMAS6.map(function (f) { return f.id; }), cuantas);
      }
      ids = barajar(ids);
      var colores = muestra(COLORES, ids.length);
      var meta = uno(ids);
      var figs = ids.map(function (id, i) { return { forma: forma(id), color: colores[i], ok: id === meta }; });
      return { instruccion: 'Toca ' + articulo(forma(meta)) + ' ' + forma(meta).nombre + '.', meta: forma(meta), figs: figs, firma: meta + '|' + figs.map(function (f) { return f.forma.id + f.color.id; }).join('') };
    },
    montar: function (r, esc, ctx) {
      var nombre = h('span', { class: 'ac-modelo__nombre', text: r.meta.nombre });
      esc.appendChild(h('div', { class: 'ac-modelo' }, [h('span', { class: 'ac-mono', text: 'Busca' }), nombre]));
      var lista = r.figs.map(function (f) {
        return { el: boton('ac-opt ac-opt--fig', f.forma.nombre, [figura(f.forma, f.color, px(100))]), ok: f.ok };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 3. ¿Qué número falta? ----------
  var juego3 = {
    titulo: '¿Qué número falta?', emoji: '🔢', color: '#ECE7FD', resumen: 'Completa la fila de números.',
    practica: 'Secuencia numérica',
    consejo: 'Recítenla juntos de corrido («uno, dos, tres...») y dejen un silencio donde falta el número. Después prueben contar hacia atrás.',
    crear: function (nivel) {
      var largo = nivel === 0 ? 4 : 5, inicio = entre(1, nivel === 0 ? 3 : (nivel === 1 ? 4 : 5));
      var atras = nivel === 2 && Math.random() < .5;
      var fila_ = [];
      for (var i = 0; i < largo; i++) fila_.push(atras ? inicio + largo - 1 - i : inicio + i);
      var oculto = entre(1, largo - 2), v = fila_[oculto];
      var libre = function (x) { return x >= 1 && fila_.indexOf(x) < 0; };
      var cand = [v - 2, v - 1, v + 1, v + 2, v + 3].filter(libre);
      // Si la fila ya ocupa casi todos los números cercanos, se amplía un poco el rango.
      [v + 4, v - 3, v + 5].forEach(function (x) { if (cand.length < 2 && libre(x)) cand.push(x); });
      var opciones = barajar([v].concat(barajar(cand).slice(0, 2)));
      return {
        instruccion: atras ? 'Cuenta hacia atrás. ¿Qué número falta?' : '¿Qué número falta?',
        fila: fila_, oculto: oculto, valor: v, opciones: opciones, ayuda: nivel === 0,
        firma: fila_.join(',') + '|' + oculto + '|' + opciones.join('')
      };
    },
    montar: function (r, esc, ctx) {
      var banda = fila('ac-banda ac-banda--lila');
      var duda;
      r.fila.forEach(function (n, i) {
        var col = h('div', { class: 'ac-numcol' });
        var c = h('span', { class: 'ac-casilla ac-casilla--num' });
        if (i === r.oculto) {
          c.classList.add('ac-casilla--duda');
          c.appendChild(h('span', { class: 'ac-casilla__q', text: '?', 'aria-label': 'Número que falta' }));
          duda = c;
        } else {
          c.appendChild(h('span', { class: 'ac-casilla__q', text: String(n) }));
        }
        col.appendChild(c);
        if (r.ayuda && i !== r.oculto) col.appendChild(puntos(n, 'ac-puntos--coral ac-puntos--chico'));
        banda.appendChild(col);
      });
      esc.appendChild(banda);
      var lista = r.opciones.map(function (v) {
        return { el: boton('ac-opt', String(v), [h('span', { class: 'ac-opt__num', text: String(v), 'aria-hidden': 'true' })]), ok: v === r.valor };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
      lista.forEach(function (o) {
        o.el.addEventListener('click', function () {
          if (!o.ok) return;
          duda.classList.remove('ac-casilla--duda');
          duda.classList.add('ac-casilla--ok');
          duda.innerHTML = '';
          duda.appendChild(h('span', { class: 'ac-casilla__q', text: String(r.valor) }));
        });
      });
    }
  };

  // ---------- 4. Una pista de colores ----------
  var juego4 = {
    titulo: 'Una pista de colores', emoji: '🎨', color: '#DDF1FD', resumen: 'Lleva cada objeto a su canasta.',
    practica: 'Clasificación',
    consejo: 'Pregunten por qué va en esa canasta: «¿es del mismo color o de la misma forma?». Luego prueben a clasificar juguetes de otra manera.',
    crear: function (nivel) {
      var porColor = nivel === 0, grupos = nivel === 2 ? 3 : 2, por = nivel === 1 ? 3 : 2, claves, objetos = [], id = 0;
      if (porColor) claves = muestra(COLORES, grupos);
      else claves = muestra(FORMAS6, grupos);
      claves.forEach(function (k) {
        for (var i = 0; i < por; i++) {
          objetos.push(porColor ? { id: id++, color: k, forma: uno(FORMAS6), clave: k.id }
                                : { id: id++, color: uno(COLORES), forma: k, clave: k.id });
        }
      });
      objetos = barajar(objetos);
      return {
        instruccion: porColor ? 'Lleva cada figura a su canasta del mismo color.' : 'Lleva cada figura a su canasta de la misma forma.',
        porColor: porColor, claves: claves, objetos: objetos,
        firma: claves.map(function (k) { return k.id; }).join('') + '|' + objetos.map(function (o) { return o.forma.id + o.color.id; }).join('')
      };
    },
    montar: function (r, esc, ctx) {
      var sel = null, pendientes = r.objetos.length, botones = {};
      var filaObj = fila('ac-objetos ac-objetos--mezcla');
      r.objetos.forEach(function (o) {
        var b = boton('ac-tap', nombreFigura(o), [figura(o.forma, o.color, px(84))]);
        b.setAttribute('aria-pressed', 'false');
        botones[o.id] = b;
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          var igual = sel === o;
          if (sel) { botones[sel.id].classList.remove('ac-sel'); botones[sel.id].setAttribute('aria-pressed', 'false'); }
          sel = igual ? null : o;
          if (sel) { b.classList.add('ac-sel'); b.setAttribute('aria-pressed', 'true'); }
        });
        filaObj.appendChild(b);
      });
      var filaCan = fila('ac-canastas');
      r.claves.forEach(function (k) {
        var cuenta = puntos(0, 'ac-puntos--chico');
        var muestraEl = r.porColor
          ? h('span', { class: 'ac-canasta__color', style: 'background:' + k.hex, 'aria-hidden': 'true' })
          : figura(k, { id: 'gris', hex: '#5B6B8C' }, '46px');
        var nombre = r.porColor ? k.nombre : k.nombre;
        var b = h('button', { class: 'ac-canasta ac-canasta--34', type: 'button', 'aria-label': 'Canasta ' + (r.porColor ? k.id : k.nombre) }, [
          muestraEl, h('span', { class: 'ac-canasta__nombre', text: nombre.charAt(0).toUpperCase() + nombre.slice(1) }), cuenta
        ]);
        var tono = r.porColor ? k : { hex: '#B7A6F2', suave: '#F5F2FE' };
        b.style.setProperty('--c', tono.hex);
        b.style.setProperty('--suave', tono.suave);
        var dentro = 0;
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          if (!sel) { ctx.error(b, 'Primero toca una figura.'); return; }
          var o = sel, bo = botones[o.id];
          if (o.clave !== k.id) { ctx.error(bo); return; }
          sel = null;
          bo.parentNode.removeChild(bo);
          dentro++;
          cuenta.appendChild(h('span', { text: '●' }));
          cuenta.setAttribute('aria-label', dentro + ' en la canasta');
          pendientes--;
          if (pendientes === 0) ctx.resuelto(); else ctx.parcial();
        });
        filaCan.appendChild(b);
      });
      esc.appendChild(filaObj);
      esc.appendChild(filaCan);
    }
  };

  // ---------- 5. Ordena por tamaño ----------
  var EMOJIS_TAMANO = ['🐘', '🐻', '🐶', '🐱', '🍎', '🎈', '🧸', '🚗'];
  var NOMBRES_TAM = { 3: ['pequeño', 'mediano', 'grande'], 4: ['muy pequeño', 'pequeño', 'grande', 'muy grande'] };
  var juego5 = {
    titulo: 'Ordena por tamaño', emoji: '📏', color: '#FFF3C9', resumen: 'Toca de uno en uno, en orden.',
    practica: 'Seriación',
    consejo: 'Usen las palabras pequeño, mediano y grande. Ordenen vasos, zapatos o cucharas de la casa de menor a mayor.',
    crear: function (nivel) {
      var tamanos = nivel === 0 ? [60, 104, 150] : [54, 84, 114, 150], e = uno(EMOJIS_TAMANO);
      var creciente = nivel < 2 || Math.random() < .5, orden;
      do { orden = barajar(tamanos); } while (orden.every(function (t, i) { return t === tamanos[i]; }) || orden.every(function (t, i) { return t === tamanos[tamanos.length - 1 - i]; }));
      return {
        instruccion: creciente ? 'Toca del más pequeño al más grande.' : 'Toca del más grande al más pequeño.',
        emoji: e, tamanos: tamanos, orden: orden, creciente: creciente,
        firma: [e, orden.join(','), creciente].join('|')
      };
    },
    montar: function (r, esc, ctx) {
      var meta = r.creciente ? r.tamanos.slice() : r.tamanos.slice().reverse();
      var siguiente = 0, botones = {};
      var nombres = NOMBRES_TAM[r.tamanos.length];
      var contenedor = fila('ac-tamanos');
      r.orden.forEach(function (t) {
        var b = boton('ac-tap ac-tap--tam ac-tap--insignia', 'objeto ' + nombres[r.tamanos.indexOf(t)], [emoji(r.emoji)]);
        b.style.setProperty('--t', t);
        botones[t] = b;
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          if (t !== meta[siguiente]) { ctx.error(b); return; }
          siguiente++;
          b.appendChild(h('span', { class: 'ac-insignia', text: String(siguiente), 'aria-hidden': 'true' }));
          b.classList.add('ac-hecho');
          b.disabled = true;
          if (siguiente === meta.length) ctx.resuelto(); else { ctx.parcial(); enfocarPrimero(esc); }
        });
        contenedor.appendChild(b);
      });
      esc.appendChild(contenedor);
    }
  };

  // ---------- 6. Arriba, abajo, dentro, fuera ----------
  var OBJETOS_POS = [
    { e: '⚽', art: 'la', n: 'pelota' }, { e: '🍎', art: 'la', n: 'manzana' }, { e: '🐥', art: 'el', n: 'pollito' },
    { e: '⭐', art: 'la', n: 'estrella' }, { e: '🧸', art: 'el', n: 'osito' }
  ];
  var POSICIONES = ['dentro', 'fuera', 'arriba', 'abajo'];
  var POS_XY = { dentro: [0, 0], fuera: [65, 0], arriba: [0, -50], abajo: [0, 50] };
  function escena(obj, pos) {
    var e = h('span', { class: 'ac-escena', 'aria-hidden': 'true' }, [
      h('span', { class: 'ac-escena__caja' }),
      h('span', { class: 'ac-escena__obj', text: obj.e })
    ]);
    e.lastChild.style.setProperty('--dx', POS_XY[pos][0]);
    e.lastChild.style.setProperty('--dy', POS_XY[pos][1]);
    return e;
  }
  var juego6 = {
    titulo: 'Arriba, abajo, dentro, fuera', emoji: '📦', color: '#FFF3C9', resumen: '¿Dónde está el objeto respecto a la caja?',
    practica: 'Posición en el espacio',
    consejo: 'Jueguen con una caja real: pongan un objeto dentro, fuera, arriba y abajo, y pidan que lo describan con esas palabras.',
    crear: function (nivel) {
      var obj = uno(OBJETOS_POS), meta, pos;
      if (nivel === 0) { pos = ['dentro', 'fuera']; meta = uno(pos); }
      else {
        meta = uno(POSICIONES);
        pos = nivel === 1 ? [meta].concat(muestra(POSICIONES.filter(function (p) { return p !== meta; }), 2)) : POSICIONES.slice();
      }
      pos = barajar(pos);
      return {
        instruccion: 'Toca dónde está ' + obj.art + ' ' + obj.n + ' ' + meta + ' de la caja.',
        obj: obj, meta: meta, pos: pos, firma: [obj.n, meta, pos.join(',')].join('|')
      };
    },
    montar: function (r, esc, ctx) {
      var lista = r.pos.map(function (p) {
        return { el: boton('ac-opt ac-opt--escena', r.obj.n + ' ' + p + ' de la caja', [escena(r.obj, p)]), ok: p === r.meta };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 7. Ritmo de figuras ----------
  var PATRONES = [['ABABAB', 'AABAAB'], ['ABBABB', 'ABCABC'], ['AABBAABB', 'ABCABCAB']];
  var juego7 = {
    titulo: 'Ritmo de figuras', emoji: '🎶', color: '#FFE3DF', resumen: 'Descubre el patrón y sigue la serie.',
    practica: 'Patrones',
    consejo: 'Digan el patrón en voz alta o con palmadas. Pidan que inventen uno propio con bloques o pasos.',
    crear: function (nivel) {
      var patron = uno(PATRONES[nivel]), formas = muestra(FORMAS6, 4), colores = muestra(COLORES, 4);
      var fig = function (i) { return { forma: formas[i], color: colores[i] }; };
      var letras = { A: fig(0), B: fig(1), C: fig(2) }, distractora = fig(3);
      var usadas = sinRepetir(patron.split('')), ultima = patron.charAt(patron.length - 1);
      var distr = [distractora];
      if (usadas.length === 2) distr.push(fig(2));
      var opciones = barajar(usadas.map(function (l) { return { f: letras[l], ok: l === ultima }; }).concat(distr.map(function (f) { return { f: f, ok: false }; })));
      return {
        instruccion: '¿Qué figura sigue en la serie?', patron: patron, letras: letras, opciones: opciones,
        firma: patron + '|' + ['A', 'B', 'C'].map(function (l) { return letras[l].forma.id + letras[l].color.id; }).join('') + '|' + opciones.map(function (o) { return o.f.forma.id; }).join('')
      };
    },
    montar: function (r, esc, ctx) {
      var tam = 'calc(var(--cell) * .64)';
      var banda = fila('ac-banda'), ultima;
      for (var i = 0; i < r.patron.length; i++) {
        var c = h('span', { class: 'ac-casilla' });
        if (i < r.patron.length - 1) { var f = r.letras[r.patron[i]]; c.appendChild(figura(f.forma, f.color, tam)); }
        else { c.classList.add('ac-casilla--duda'); c.appendChild(h('span', { class: 'ac-casilla__q', text: '?', 'aria-label': 'Casilla vacía' })); ultima = c; }
        banda.appendChild(c);
      }
      var lista = r.opciones.map(function (o) {
        return { el: boton('ac-opt ac-opt--chica', nombreForma(o.f), [figura(o.f.forma, o.f.color, 'max(48px, calc(56px * var(--k)))')]), ok: o.ok, f: o.f };
      });
      function nombreForma(f) { return 'Figura ' + f.forma.nombre; }
      esc.appendChild(banda);
      esc.appendChild(fila('ac-opciones ac-opciones--serie', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
      lista.forEach(function (o) {
        o.el.addEventListener('click', function () {
          if (!o.ok) return;
          ultima.classList.remove('ac-casilla--duda');
          ultima.innerHTML = '';
          ultima.appendChild(figura(o.f.forma, o.f.color, tam));
        });
      });
    }
  };

  // ---------- 8. Une con su sombra ----------
  var juego8 = {
    titulo: 'Une con su sombra', emoji: '🌓', color: '#DDF1FD', resumen: 'Une cada figura con su sombra.',
    practica: 'Discriminación visual',
    consejo: 'Conversen sobre el contorno: ¿tiene picos?, ¿es redondo? Fíjense en la forma, no en el color.',
    crear: function (nivel) {
      var formas;
      if (nivel === 0) formas = muestra(FORMAS6, 3);
      else if (nivel === 1) formas = muestra(FORMAS6, 4);
      else formas = muestra(SIMILARES.map(forma), 3).concat(muestra(FORMAS6.filter(function (f) { return SIMILARES.indexOf(f.id) < 0; }), 1));
      var colores = muestra(COLORES, formas.length);
      var pares = formas.map(function (f, i) { return { id: i, forma: f, color: colores[i] }; });
      var der;
      do { der = barajar(pares); } while (der.every(function (p, i) { return p === pares[i]; }));
      return { instruccion: 'Une cada figura con su sombra.', izq: pares, der: der, firma: pares.map(function (p) { return p.forma.id + p.color.id; }).join('') + '|' + der.map(function (p) { return p.id; }).join('') };
    },
    montar: function (r, esc, ctx) {
      var sel = null, quedan = r.izq.length;
      var colI = fila('ac-columna'), colD = fila('ac-columna');
      var bI = {};
      r.izq.forEach(function (p) {
        var b = boton('ac-tap', 'Figura: ' + nombreFigura(p), [figura(p.forma, p.color, px(76))]);
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
        var b = boton('ac-tap ac-tap--sombra', 'Sombra: ' + p.forma.nombre, [figura(p.forma, SOMBRA, px(76))]);
        b.addEventListener('click', function () {
          if (!ctx.activo()) return;
          if (sel === null) { ctx.error(b, 'Primero toca una figura de la izquierda.'); return; }
          if (sel !== p.id) { ctx.error(b); return; }
          [bI[sel], b].forEach(function (x) {
            x.classList.remove('ac-sel'); x.classList.add('ac-unida'); x.disabled = true;
            x.style.boxShadow = '0 0 0 4px ' + p.color.hex;
          });
          bI[sel].setAttribute('aria-pressed', 'false');
          sel = null;
          quedan--;
          if (quedan === 0) ctx.resuelto(); else { ctx.parcial(); enfocarPrimero(esc); }
        });
        colD.appendChild(b);
      });
      esc.appendChild(fila('ac-parejas', [colI, colD]));
    }
  };

  window.ActividadesMotor.iniciar({
    juegos: [juego1, juego2, juego3, juego4, juego5, juego6, juego7, juego8]
  });
  window.ActividadesMotor.revelar();
})();
