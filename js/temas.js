// Página «Temas»: el mapa, los tipos de evaluación y el vuelo se dibujan a partir de las listas de abajo.
(function () {
  // =====================================================================
  //  DATOS EDITABLES
  // =====================================================================

  // Un tema por entrada, en orden. De aquí salen los nodos del mapa y sus enlaces.
  //   numero: '01' · tipo: 'tema' o 'actividad' · titulo: nombre en el mapa
  //   a / t:  color de acento y tinte · id: ancla del bloque en la página (t1, t2…)
  // Para añadir un tema: copia un bloque <section> de temas.html, ponle su id, y suma aquí su entrada.
  var TEMAS = [
    { numero: '01', tipo: 'actividad', titulo: 'Actividad del emisario', a: '#FFD45E', t: '#FFF3C9', id: 't1' },
    { numero: '02', tipo: 'tema',      titulo: 'Evaluación',             a: '#5BB8F0', t: '#DDF1FD', id: 't2' },
    { numero: '03', tipo: 'tema',      titulo: 'Tipos de evaluación',    a: '#FF7A6B', t: '#FFE3DF', id: 't3' },
    { numero: '04', tipo: 'tema',      titulo: 'Evaluación formativa',   a: '#7FD8B5', t: '#D9F5E9', id: 't4' },
    { numero: '05', tipo: 'tema',      titulo: 'Retroalimentación',      a: '#B7A6F2', t: '#ECE7FD', id: 't5' },
    { numero: '06', tipo: 'tema',      titulo: 'Ticket de salida',       a: '#FFD45E', t: '#FFF3C9', id: 't6' },
    { numero: '07', tipo: 'tema',      titulo: 'Retos matemáticos',      a: '#5BB8F0', t: '#DDF1FD', id: 't7' },
    { numero: '08', tipo: 'actividad', titulo: 'Bingo evaluativo',       a: '#FF7A6B', t: '#FFE3DF', id: 't8' }
  ];

  // Los cuatro tipos de evaluación del tema 03.
  //   etiqueta: 'Momento' o 'Contexto' · momento: cuándo o dónde ocurre · texto: en qué consiste
  var TIPOS = [
    { nombre: 'Diagnóstica', color: '#7FD8B5', etiqueta: 'Momento', momento: 'Antes de iniciar un tema o proceso', texto: 'Se realiza antes de iniciar un tema o proceso educativo para identificar los conocimientos previos, las habilidades y las necesidades de los estudiantes. Permite planear la enseñanza.' },
    { nombre: 'Formativa',   color: '#5BB8F0', etiqueta: 'Momento', momento: 'Durante el aprendizaje', texto: 'Se desarrolla durante el aprendizaje para reconocer avances y dificultades, brindar retroalimentación y ajustar las estrategias pedagógicas.' },
    { nombre: 'Sumativa',    color: '#FFD45E', etiqueta: 'Momento', momento: 'Al finalizar un tema, unidad o periodo', texto: 'Se realiza al finalizar un tema, unidad o periodo para valorar los aprendizajes alcanzados en relación con los objetivos propuestos.' },
    { nombre: 'Auténtica',   color: '#B7A6F2', etiqueta: 'Contexto', momento: 'Situaciones reales o significativas', texto: 'Valora cómo los estudiantes aplican sus conocimientos y habilidades en situaciones reales o significativas.' }
  ];

  // Las seis paradas del vuelo del tema 04 (analogía de Furman, 2021).
  var VUELO = [
    { nombre: 'Piloto',              significado: 'Docente que guía y orienta el proceso' },
    { nombre: 'Monitoreo constante', significado: 'Seguimiento continuo del aprendizaje' },
    { nombre: 'Ajustar rumbo',       significado: 'Retroalimentar y corregir dificultades' },
    { nombre: 'No esperar al final', significado: 'Acompañar en todo el trayecto' },
    { nombre: 'Pasajeros distintos', significado: 'Reconocer la subjetividad y diversidad' },
    { nombre: 'Meta del vuelo',      significado: 'Aprendizaje con confianza y sentido' }
  ];

  // =====================================================================
  //  A partir de aquí no hace falta editar nada
  // =====================================================================

  function h(tag, props, hijos) {
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'class') el.className = props[k];
      else if (k === 'text') el.textContent = props[k];
      else el.setAttribute(k, props[k]);
    });
    (hijos || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function usarTeclas(lista, botones, elegir) {
    lista.addEventListener('keydown', function (e) {
      var i = botones.indexOf(document.activeElement);
      if (i < 0) return;
      var j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % botones.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + botones.length) % botones.length;
      if (j < 0) return;
      e.preventDefault(); elegir(j); botones[j].focus();
    });
  }

  // ---------- Mapa de temas ----------
  var nodos = document.getElementById('tm-nodos');
  TEMAS.forEach(function (d, i) {
    var act = d.tipo === 'actividad';
    var a = h('a', { class: 'tm-nodo' + (act ? ' tm-nodo--act' : ''), href: '#' + d.id }, [
      h('span', { class: 'tm-nodo__n', 'aria-hidden': 'true', text: d.numero }),
      h('span', { class: 'tm-nodo__txt' }, [
        h('span', { class: 'tm-nodo__tipo', text: act ? 'Actividad' : 'Tema' }),
        h('span', { class: 'tm-nodo__nom', text: d.titulo })
      ])
    ]);
    a.style.setProperty('--a', d.a); a.style.setProperty('--t', d.t);
    a.setAttribute('aria-label', (act ? 'Actividad ' : 'Tema ') + d.numero + ': ' + d.titulo);
    var li = h('li', {}, [a]);
    // Flechas decorativas entre nodos consecutivos. La primera fila (01 a 05) va hacia la derecha,
    // el 05 baja al 06 y la segunda fila (06, 07, 08) vuelve hacia la izquierda.
    if (i < 4) li.classList.add('tm-conecta');
    else if (i === 4) li.classList.add('tm-conecta', 'tm-conecta--abajo');
    else if (i < TEMAS.length - 1) li.classList.add('tm-conecta', 'tm-conecta--izq');
    if (i >= 5 && i <= 7) li.classList.add('tm-fila2-' + (i + 1));
    nodos.appendChild(li);
  });

  // ---------- Tipos de evaluación ----------
  var contTipos = document.getElementById('tm-tipos');
  var panelTipo = document.getElementById('tm-tipo-panel');
  var botonesTipo = [];
  function elegirTipo(i) {
    var t = TIPOS[i];
    botonesTipo.forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    panelTipo.style.setProperty('--c', t.color);
    panelTipo.setAttribute('aria-labelledby', botonesTipo[i].id);
    document.getElementById('tm-tp-rot').textContent = 'Tipo ' + (i + 1) + ' de ' + TIPOS.length;
    document.getElementById('tm-tp-tit').textContent = 'Evaluación ' + t.nombre.toLowerCase();
    document.getElementById('tm-tp-etq').textContent = t.etiqueta;
    document.getElementById('tm-tp-mom').textContent = t.momento;
    document.getElementById('tm-tp-txt').textContent = t.texto;
  }
  TIPOS.forEach(function (t, i) {
    var dot = h('i', { 'aria-hidden': 'true' });
    var b = h('button', { class: 'tm-tipos__btn', type: 'button', role: 'tab', id: 'tm-tipo-' + (i + 1), 'aria-controls': 'tm-tipo-panel', 'aria-selected': 'false' }, [dot, t.nombre]);
    b.style.setProperty('--c', t.color);
    b.addEventListener('click', function () { elegirTipo(i); });
    botonesTipo.push(b); contTipos.appendChild(b);
  });
  usarTeclas(contTipos, botonesTipo, elegirTipo);
  elegirTipo(0);

  // ---------- Vuelo ----------
  var ruta = document.getElementById('tm-ruta');
  var contParadas = document.getElementById('tm-paradas');
  var panelParada = document.getElementById('tm-parada-panel');
  var puntos = h('div', { class: 'tm-ruta__puntos' });
  var marcas = VUELO.map(function () { var m = h('i'); puntos.appendChild(m); return m; });
  var avion = h('span', { class: 'tm-avion' });
  avion.innerHTML = '<svg viewBox="0 0 40 40"><path d="M4 18L36 4 26 36 18 23z" fill="#fff" stroke="#1F2A44" stroke-width="2.6" stroke-linejoin="round"/><path d="M36 4L18 23" fill="none" stroke="#1F2A44" stroke-width="2.6" stroke-linecap="round"/><path d="M18 23l-1 10 6-7" fill="#fff" stroke="#1F2A44" stroke-width="2.6" stroke-linejoin="round"/></svg>';
  ruta.appendChild(h('div', { class: 'tm-ruta__linea' }));
  ruta.appendChild(puntos);
  ruta.appendChild(avion);
  var botonesParada = [];
  function elegirParada(i) {
    var p = VUELO[i];
    botonesParada.forEach(function (b, j) {
      b.setAttribute('aria-selected', j === i ? 'true' : 'false');
    });
    marcas.forEach(function (m, j) { m.classList.toggle('is-hecho', j <= i); });
    ruta.style.setProperty('--i', i);
    panelParada.setAttribute('aria-labelledby', botonesParada[i].id);
    document.getElementById('tm-pp-rot').textContent = 'Parada ' + (i + 1) + ' de ' + VUELO.length;
    document.getElementById('tm-pp-tit').textContent = p.nombre;
    document.getElementById('tm-pp-sig').textContent = p.significado;
  }
  VUELO.forEach(function (p, i) {
    var b = h('button', { class: 'tm-parada', type: 'button', role: 'tab', id: 'tm-parada-' + (i + 1), 'aria-controls': 'tm-parada-panel', 'aria-selected': 'false' }, [h('i', { 'aria-hidden': 'true', text: String(i + 1) }), p.nombre]);
    b.addEventListener('click', function () { elegirParada(i); });
    botonesParada.push(b); contParadas.appendChild(b);
  });
  usarTeclas(contParadas, botonesParada, elegirParada);
  elegirParada(0);

  // ---------- Aparición al desplazarse ----------
  if (document.documentElement.classList.contains('js')) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.tm-rev').forEach(function (el) { obs.observe(el); });
  }
})();
