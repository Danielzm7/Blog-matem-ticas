// Piezas compartidas por las páginas de actividades: colores, formas, utilidades y figuras dibujadas con CSS.
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


  // Tres números: el correcto y dos cercanos (±1, ±2) dentro del rango, sin repetir.
  // "candidatos" permite dar otra lista de números cercanos; se descartan los que no sirven.
  function numeros(v, min, max, candidatos) {
    var cerca = (candidatos || [v - 2, v - 1, v + 1, v + 2]).filter(function (x) { return x >= min && x <= max && x !== v; });
    var otros = barajar(cerca).slice(0, 2);
    // Si el rango es tan estrecho que faltan, se completan con los más cercanos libres.
    for (var d = 3; otros.length < 2 && d < 12; d++) {
      [v - d, v + d].forEach(function (x) { if (otros.length < 2 && x >= min && x <= max && x !== v && otros.indexOf(x) < 0) otros.push(x); });
    }
    return barajar([v].concat(otros));
  }
  // Tres botones con números (o textos), el correcto resuelve el reto.
  function botonesNumero(esc, ctx, opciones, correcto, formato) {
    var lista = opciones.map(function (v) {
      var texto = formato ? formato(v) : String(v);
      return { el: boton('ac-opt', formato ? texto.label : texto, [h('span', { class: 'ac-opt__num' + (formato ? ' ac-opt__num--' + texto.clase : ''), text: formato ? texto.texto : texto, 'aria-hidden': 'true' })]), ok: v === correcto };
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
  // Reloj de manecillas dibujado con CSS: hora = (h mod 12)×30° + min×0,5°; minutos = min×6°.
  function reloj(hora, min) {
    var r = h('div', { class: 'ac-reloj', role: 'img', 'aria-label': 'Reloj de manecillas' });
    for (var n = 1; n <= 12; n++) {
      var a = n * 30 * Math.PI / 180;
      var num = h('span', { class: 'ac-reloj__num', text: String(n), 'aria-hidden': 'true' });
      num.style.left = 'calc(50% + ' + (Math.sin(a) * 96).toFixed(2) + 'px)';
      num.style.top = 'calc(50% - ' + (Math.cos(a) * 96).toFixed(2) + 'px)';
      r.appendChild(num);
    }
    var mh = h('span', { class: 'ac-reloj__mano ac-reloj__mano--hora', 'aria-hidden': 'true' });
    var mm = h('span', { class: 'ac-reloj__mano ac-reloj__mano--min', 'aria-hidden': 'true' });
    mh.style.setProperty('--ang', ((hora % 12) * 30 + min * 0.5) + 'deg');
    mm.style.setProperty('--ang', (min * 6) + 'deg');
    r.appendChild(mh); r.appendChild(mm);
    r.appendChild(h('span', { class: 'ac-reloj__centro', 'aria-hidden': 'true' }));
    return r;
  }

  var FORMAS6 = FORMAS.slice();
  FORMAS6.splice(2, 0, { id: 'rectangulo', nombre: 'rectángulo', fem: false });

  window.ActividadesMotor.comun = {
    COLORES: COLORES, FORMAS: FORMAS, FORMAS6: FORMAS6, azar: azar, entre: entre, uno: uno, barajar: barajar,
    muestra: muestra, px: px, nombreFigura: nombreFigura, figura: figura, emoji: emoji, puntos: puntos,
    boton: boton, elegir: elegir, fila: fila, enfocarPrimero: enfocarPrimero,
    numeros: numeros, botonesNumero: botonesNumero, rellenarAlAcertar: rellenarAlAcertar, interrogante: interrogante, reloj: reloj
  };
})();
