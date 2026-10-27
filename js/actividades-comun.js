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


  var FORMAS6 = FORMAS.slice();
  FORMAS6.splice(2, 0, { id: 'rectangulo', nombre: 'rectángulo', fem: false });

  window.ActividadesMotor.comun = {
    COLORES: COLORES, FORMAS: FORMAS, FORMAS6: FORMAS6, azar: azar, entre: entre, uno: uno, barajar: barajar,
    muestra: muestra, px: px, nombreFigura: nombreFigura, figura: figura, emoji: emoji, puntos: puntos,
    boton: boton, elegir: elegir, fila: fila, enfocarPrimero: enfocarPrimero
  };
})();
