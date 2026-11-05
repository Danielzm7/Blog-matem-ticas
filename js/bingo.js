// Bingo evaluativo interactivo: ruleta con sombrero de mago, tabla BINGO y 20 preguntas de las exposiciones.
(function () {
  var raiz = document.getElementById('bg-app');
  if (!raiz) return;

  // =====================================================================
  //  DATOS EDITABLES
  // =====================================================================

  // Columnas de la palabra BINGO: 20 números repartidos en partes iguales (4 por columna).
  var COLUMNAS = [
    { letra: 'B', color: '#FFD45E', desde: 1 },
    { letra: 'I', color: '#5BB8F0', desde: 5 },
    { letra: 'N', color: '#FF7A6B', desde: 9 },
    { letra: 'G', color: '#7FD8B5', desde: 13 },
    { letra: 'O', color: '#B7A6F2', desde: 17 }
  ];

  // Una pregunta por número (1 a 20), tomadas de las diapositivas de las cuatro exposiciones.
  //   fuente: exposición y diapositiva de donde sale · o: opciones · c: posición de la correcta (0 = A)
  //   exp: lo que dice la exposición (se muestra al ver la respuesta)
  var EXPO = {
    1: 'Exposición 01 · Referentes curriculares',
    2: 'Exposición 02 · Pensamiento numérico',
    3: 'Exposición 03 · Pensamiento espacial',
    4: 'Exposición 04 · Dimensiones del desarrollo'
  };
  var PREGUNTAS = [
    { e: 1, f: 'Concepciones sobre la naturaleza de las matemáticas', q: '¿Qué corriente filosófica concibe las matemáticas como un sistema de verdades preexistentes e independientes del ser humano?', o: ['Platonismo', 'Logicismo', 'Formalismo', 'Constructivismo'], c: 0, x: 'El platonismo concibe las matemáticas como un sistema de verdades preexistentes e independientes del ser humano.' },
    { e: 1, f: 'Estructura curricular: los tres pilares interconectados', q: '¿Cuáles son los tres pilares interconectados de la estructura curricular?', o: ['Preactiva, interactiva y posactiva', 'Procesos generales, conocimientos básicos y contexto', 'Platonismo, formalismo y constructivismo', 'Cuerpos, superficies y ángulos'], c: 1, x: 'El currículo integra simultáneamente tres pilares: procesos generales, conocimientos básicos y el contexto.' },
    { e: 1, f: 'La transposición didáctica y el trabajo didáctico', q: 'En la transposición didáctica, ¿cuál es el trabajo del profesor?', o: ['Despersonaliza y descontextualiza los hallazgos para hacerlos universales', 'Simula la actividad científica: formula conjeturas y construye modelos', 'Recontextualiza y repersonaliza el saber académico con situaciones problema', 'Enseña las matemáticas como un libro de recetas rígidas'], c: 2, x: 'El trabajo del profesor recontextualiza y repersonaliza el saber académico, proponiendo situaciones problema donde los conocimientos surjan como respuestas naturales.' },
    { e: 1, f: 'Fases de la enseñanza y reflexión docente (modelo de Llinares)', q: '¿Cuáles son las tres fases del modelo de Llinares para el ejercicio docente?', o: ['Preactiva, interactiva y posactiva', 'Diagnóstica, formativa y sumativa', 'Acción, formulación y validación', 'Procesos, conocimientos y contexto'], c: 0, x: 'El ejercicio docente se concibe en tres momentos interconectados: fase preactiva (diseño y diagnóstico), interactiva (puesta en práctica y gestión de aula) y posactiva (sistematización y reflexión).' },
    { e: 1, f: 'Modelo 3: espacio tridimensional con la esfera envolvente del contexto', q: 'En el Modelo 3 de la exposición, ¿cómo se representa el contexto?', o: ['Como un eje rígido', 'Como una cara del cubo', 'Como un punto en el espacio', 'Como una esfera envolvente que abraza todo el sistema'], c: 3, x: 'El contexto deja de ser un eje rígido y se representa como una esfera envolvente que abraza todo el sistema.' },

    { e: 2, f: '¿Qué es el pensamiento numérico?', q: '¿Qué es el pensamiento numérico?', o: ['Saber recitar la serie numérica lo más lejos posible', 'La capacidad de comprender los números, las cantidades y sus relaciones, y utilizarlos para resolver situaciones cotidianas', 'Memorizar los resultados de las operaciones', 'Resolver operaciones solo con lápiz y papel'], c: 1, x: 'Es comprender los números, las cantidades y sus relaciones, y utilizarlos para resolver situaciones de la vida cotidiana. Saber contar no basta para comprender los números.' },
    { e: 2, f: 'Los números tienen distintos significados', q: 'Si digo «vivo en la casa número cinco», ¿qué significado tiene el 5?', o: ['Cantidad: hay cinco casas', 'Medida: la casa mide cinco metros', 'Identificación: sirve para identificar una casa, no para contar cinco', 'Ninguno, el 5 aquí no significa nada'], c: 2, x: 'Un número puede representar cantidad, medida, orden o posición, identificación. Aquí no cuento cinco casas, identifico una casa.' },
    { e: 2, f: 'Contar con sentido', q: 'Al contar una colección, ¿qué nos dice el último número que pronunciamos?', o: ['El nombre de la última ficha', 'El color de los objetos', 'El orden de las fichas', 'Cuántos objetos hay en total'], c: 3, x: 'Al contar una colección, la última palabra dicha también representa cuántos objetos hay en total.' },
    { e: 2, f: 'El sistema de numeración decimal', q: 'En el sistema de numeración decimal, ¿a qué equivale el número 32?', o: ['3 decenas y 2 unidades', '2 decenas y 3 unidades', '32 decenas', '3 unidades y 2 centenas'], c: 0, x: 'Ejemplo de la exposición: 32 = 3 decenas + 2 unidades. El valor de cada cifra depende del lugar que ocupa.' },
    { e: 2, f: 'El significado de las operaciones', q: 'Según la exposición, ¿con qué acciones se puede relacionar una resta?', o: ['Reunir y añadir', 'Quitar, comparar y encontrar una diferencia', 'Formar grupos iguales', 'Repartir y agrupar'], c: 1, x: 'Restar puede significar quitar, encontrar una diferencia o averiguar cuánto falta; por ejemplo «tengo 5 fichas y pierdo 3» y «tengo 5 fichas y tú 3».' },

    { e: 3, f: 'Howard Gardner', q: 'Según Howard Gardner, ¿para qué se utiliza la inteligencia espacial?', o: ['Para clasificar figuras jerárquicamente', 'Para trabajar con axiomas y teoremas', 'Para recitar la serie numérica', 'Para representar y manipular información sobre ubicación, orientación y distribución de espacios'], c: 3, x: 'La inteligencia espacial se utiliza para representar y manipular información, lo que facilita el aprendizaje y la resolución de problemas de ubicación, orientación y distribución de espacios.' },
    { e: 3, f: 'Desarrollo del pensamiento geométrico (Van Hiele)', q: '¿Cómo se describe el Nivel 1 de Van Hiele?', o: ['Nivel de análisis: se conocen los componentes y propiedades de las figuras', 'Visualización: el alumno percibe las figuras como un todo global, sin detectar relaciones', 'Nivel de ordenamiento: se clasifican las figuras jerárquicamente', 'Razonamiento deductivo con axiomas y teoremas'], c: 1, x: 'El Nivel 1 es el de la visualización: el alumno percibe las figuras como un todo global, sin detectar relaciones entre ellas o entre sus partes.' },
    { e: 3, f: '¿Cómo se pasa de un nivel a otro?', q: 'Según la exposición, el avance entre los niveles de Van Hiele…', o: ['Ocurre automáticamente con la edad', 'Depende solo de memorizar definiciones', 'Es automático y no necesita experiencias', 'No es automático: no depende únicamente de la edad y necesita experiencias que desarrollen el pensamiento geométrico'], c: 3, x: 'El avance entre niveles no es automático: no depende únicamente de la edad y se necesitan experiencias que desarrollen el pensamiento geométrico.' },
    { e: 3, f: 'Transformaciones geométricas', q: '¿Cómo se llama la transformación geométrica que consiste en girar una figura?', o: ['Traslación', 'Reflexión', 'Rotación', 'Perspectiva'], c: 2, x: 'Traslación: mover o deslizar una figura. Rotación: girar una figura. Reflexión: reflejar una figura como en un espejo.' },
    { e: 3, f: 'Representación bidimensional del espacio tridimensional', q: '¿De qué formas podemos representar objetos de 3 dimensiones en una hoja de papel, que tiene 2?', o: ['Traslación, rotación y reflexión', 'Visualización, análisis y ordenamiento', 'Vista única, vistas múltiples y perspectiva', 'Mundo real, hoja de papel y plano'], c: 2, x: 'El mundo real tiene 3 dimensiones y la hoja de papel 2. Los objetos 3D se representan con vista única, vistas múltiples o perspectiva.' },

    { e: 4, f: 'Lineamientos pedagógicos para la educación preescolar (MEN, 1998)', q: '¿Cuáles son los tres principios de la educación preescolar?', o: ['Juego, evaluación y disciplina', 'Enseñanza, aprendizaje y evaluación', 'Integralidad, participación y lúdica', 'Cognición, lenguaje y comunicación'], c: 2, x: 'Pregunta de la actividad en clase. La exposición cita los Lineamientos pedagógicos para la educación preescolar del Ministerio de Educación Nacional (1998, pp. 17-22).' },
    { e: 1, f: 'Pilar 2: conocimientos básicos (tipos de pensamiento)', q: 'La docente pregunta a los estudiantes qué medio de transporte utilizan para llegar al colegio. Luego, construyen conjuntamente una tabla para organizar y analizar la información recolectada. ¿Qué pensamiento matemático se favorece principalmente?', o: ['Pensamiento numérico y sistemas numéricos', 'Pensamiento espacial y sistemas geométricos', 'Pensamiento métrico y sistemas de medida', 'Pensamiento aleatorio y sistemas de datos'], c: 3, x: 'El pensamiento aleatorio y los sistemas de datos incluyen el tratamiento de la incertidumbre, la recolección de datos y su análisis.' },
    { e: 4, f: 'Dimensión socioafectiva', q: 'Durante una actividad de bienvenida, la docente invita a los niños a escoger una tarjeta que represente cómo se sienten ese día. Cada niño comparte con sus compañeros por qué eligió esa tarjeta y escucha con respeto las emociones de los demás. ¿Qué dimensión del desarrollo se favorece principalmente?', o: ['Dimensión corporal', 'Dimensión socioafectiva', 'Dimensión cognitiva', 'Dimensión estética'], c: 1, x: 'La dimensión socioafectiva construye la identidad y el autoconcepto, maneja y expresa las emociones, y crea vínculos basados en afecto y respeto.' },
    { e: 4, f: 'Dimensión cognitiva', q: '¿A través de qué permite la dimensión cognitiva comprender la realidad?', o: ['La percepción, la atención, la memoria y la capacidad simbólica', 'La psicomotricidad y el movimiento del cuerpo', 'Los valores como respeto, honestidad y tolerancia', 'La creatividad y la expresión por el arte'], c: 0, x: 'La dimensión cognitiva permite comprender la realidad a través de la percepción, la atención, la memoria y la capacidad simbólica.' },
    { e: 4, f: 'El desarrollo infantil es integral', q: '¿Qué significa que el desarrollo infantil es integral?', o: ['Cada dimensión se desarrolla por separado y en un orden fijo', 'Solo importa la dimensión cognitiva', 'Todas sus dimensiones se desarrollan de manera simultánea y están conectadas', 'Todos los niños se desarrollan al mismo ritmo'], c: 2, x: 'Todas sus dimensiones se desarrollan de manera simultánea y están conectadas; cada niño es único y tiene su propio ritmo.' }
  ];

  // =====================================================================
  //  A partir de aquí no hace falta editar nada
  // =====================================================================

  var N = PREGUNTAS.length;           // 20
  var NS = 'http://www.w3.org/2000/svg';
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LETRAS = ['A', 'B', 'C', 'D'];

  function h(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    return e;
  }
  function s(tag, attrs, padre) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (padre) padre.appendChild(e);
    return e;
  }
  function columnaDe(n) { return COLUMNAS[Math.floor((n - 1) / 4)]; }
  function azar(max) { // entero uniforme en [0, max)
    try {
      var a = new Uint32Array(1), tope = Math.floor(4294967296 / max) * max, v;
      do { window.crypto.getRandomValues(a); v = a[0]; } while (v >= tope);
      return v % max;
    } catch (e) { return Math.floor(Math.random() * max); }
  }

  // ---------- Estado ----------
  var salidos = [];            // números ya sacados, en orden
  var actual = null;           // número cuya pregunta se muestra
  var girando = false;
  var angulo = 0;              // giro acumulado de la rueda
  var misNumeros = [];         // tabla personal (1 a 20 en otro orden)

  // ---------- Estructura ----------
  var cuerpo = h('div', 'bg-cuerpo');
  var izq = h('div', 'bg-izq');
  var der = h('div', 'bg-der');
  cuerpo.appendChild(izq); cuerpo.appendChild(der);
  raiz.appendChild(cuerpo);

  // Ruleta con sombrero
  var rueda = h('div', 'bg-ruleta');
  var svg = s('svg', { viewBox: '-170 -170 340 340', class: 'bg-ruleta__svg', 'aria-hidden': 'true', focusable: 'false' });
  rueda.appendChild(svg);
  var disco = s('g', { class: 'bg-disco' }, svg);
  var gajos = [];
  for (var i = 0; i < N; i++) {
    var a0 = (i * 18 - 90 - 9) * Math.PI / 180, a1 = ((i + 1) * 18 - 90 - 9) * Math.PI / 180;
    var R = 160, r = 74;
    var d = 'M' + (r * Math.cos(a0)) + ',' + (r * Math.sin(a0)) + ' L' + (R * Math.cos(a0)) + ',' + (R * Math.sin(a0)) +
      ' A' + R + ',' + R + ' 0 0 1 ' + (R * Math.cos(a1)) + ',' + (R * Math.sin(a1)) +
      ' L' + (r * Math.cos(a1)) + ',' + (r * Math.sin(a1)) + ' A' + r + ',' + r + ' 0 0 0 ' + (r * Math.cos(a0)) + ',' + (r * Math.sin(a0)) + ' Z';
    var g = s('g', { class: 'bg-gajo' }, disco);
    s('path', { d: d, fill: columnaDe(i + 1).color }, g);
    var am = (i * 18 - 90) * Math.PI / 180;
    var t = s('text', { x: 119 * Math.cos(am), y: 119 * Math.sin(am), 'text-anchor': 'middle', 'dominant-baseline': 'central', transform: 'rotate(' + (i * 18) + ' ' + (119 * Math.cos(am)) + ' ' + (119 * Math.sin(am)) + ')' }, g);
    t.textContent = String(i + 1);
    gajos.push(g);
  }
  s('circle', { r: 160, class: 'bg-aro' }, disco);
  s('circle', { r: 74, class: 'bg-aro' }, disco);
  // Puntero fijo arriba
  s('path', { d: 'M-13,-176 L13,-176 L0,-150 Z', class: 'bg-puntero' }, svg);

  // Sombrero de mago en el centro (no gira con la rueda)
  var sombrero = h('div', 'bg-sombrero');
  sombrero.innerHTML =
    '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<ellipse cx="60" cy="98" rx="52" ry="12" fill="#1F2A44"/>' +
    '<path d="M32 96 L40 28 Q60 4 80 28 L88 96 Z" fill="#2B3A5E" stroke="#1F2A44" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M35 78 Q60 90 85 78 L86 92 Q60 104 34 92 Z" fill="#FF7A6B" stroke="#1F2A44" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<ellipse cx="60" cy="97" rx="52" ry="12" fill="none" stroke="#1F2A44" stroke-width="3"/>' +
    '<path d="M60 36l3.2 7 7.6.8-5.7 5.2 1.7 7.5-6.8-4-6.8 4 1.7-7.5-5.7-5.2 7.6-.8z" fill="#FFD45E" stroke="#1F2A44" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<circle cx="46" cy="62" r="3" fill="#FFD45E"/><circle cx="74" cy="58" r="2.4" fill="#7FD8B5"/><circle cx="68" cy="70" r="2" fill="#B7A6F2"/>' +
    '</svg>';
  var tarjeta = h('div', 'bg-tarjeta'); // el papel con el número que sale del sombrero
  tarjeta.setAttribute('aria-hidden', 'true');
  sombrero.insertBefore(tarjeta, sombrero.firstChild);
  rueda.appendChild(sombrero);
  var chispas = h('div', 'bg-chispas'); chispas.setAttribute('aria-hidden', 'true');
  for (var k = 0; k < 8; k++) { var c = h('i'); c.style.setProperty('--a', (k * 45) + 'deg'); chispas.appendChild(c); }
  rueda.appendChild(chispas);
  izq.appendChild(rueda);

  var botonGirar = h('button', 'bg-btn bg-btn--grande');
  botonGirar.type = 'button';
  botonGirar.innerHTML = '<span aria-hidden="true">🎩</span><span class="bg-btn__txt">¡Girar el sombrero!</span>';
  var acciones = h('div', 'bg-acciones');
  var botonReiniciar = h('button', 'bg-btn bg-btn--claro'); botonReiniciar.type = 'button';
  botonReiniciar.innerHTML = '<span aria-hidden="true">↺</span><span>Empezar de nuevo</span>';
  acciones.appendChild(botonGirar); acciones.appendChild(botonReiniciar);
  izq.appendChild(acciones);
  var estado = h('p', 'bg-estado', 'Gira el sombrero para sacar el primer número.');
  estado.setAttribute('role', 'status'); estado.setAttribute('aria-live', 'polite');
  izq.appendChild(estado);

  // Pregunta
  var panel = h('div', 'bg-pregunta');
  panel.setAttribute('aria-live', 'polite');
  der.appendChild(panel);

  // Tablero BINGO y tabla personal
  var abajo = h('div', 'bg-abajo');
  raiz.appendChild(abajo);
  var cajaTablero = h('div', 'bg-caja');
  cajaTablero.appendChild(h('p', 'bg-caja__rot', 'Números que han salido'));
  var tablero = h('div', 'bg-tablero');
  tablero.setAttribute('role', 'group'); tablero.setAttribute('aria-label', 'Tabla BINGO con los números del 1 al 20 por columna');
  COLUMNAS.forEach(function (co, ci) {
    var col = h('div', 'bg-col');
    var cab = h('b', 'bg-col__letra', co.letra); cab.style.background = co.color; cab.setAttribute('aria-hidden', 'true');
    col.appendChild(cab);
    for (var n = co.desde; n < co.desde + 4; n++) {
      var b = h('button', 'bg-num', String(n));
      b.type = 'button'; b.dataset.n = n; b.style.setProperty('--c', co.color);
      b.setAttribute('aria-label', 'Número ' + n + ', columna ' + co.letra);
      b.addEventListener('click', function (e) { var m = +e.currentTarget.dataset.n; if (salidos.indexOf(m) >= 0 && !girando) mostrar(m, false); });
      col.appendChild(b);
    }
    tablero.appendChild(col);
  });
  cajaTablero.appendChild(tablero);
  var leyenda = h('p', 'bg-leyenda');
  cajaTablero.appendChild(leyenda);
  abajo.appendChild(cajaTablero);

  var cajaMia = h('div', 'bg-caja');
  cajaMia.appendChild(h('p', 'bg-caja__rot', 'Mi tabla de bingo'));
  var miTabla = h('div', 'bg-mia');
  miTabla.setAttribute('role', 'group'); miTabla.setAttribute('aria-label', 'Mi tabla con los números del 1 al 20');
  cajaMia.appendChild(miTabla);
  var botonBarajar = h('button', 'bg-btn bg-btn--claro bg-btn--chico'); botonBarajar.type = 'button';
  botonBarajar.innerHTML = '<span aria-hidden="true">🔀</span><span>Armar otra tabla</span>';
  cajaMia.appendChild(h('p', 'bg-caja__ayuda', 'Cada participante tiene su propia tabla con los números del 1 al 20. Si sale un número que está en tu tabla, ¡te toca responder!'));
  cajaMia.appendChild(botonBarajar);
  abajo.appendChild(cajaMia);

  // ---------- Dibujo ----------
  function armarMiTabla() {
    var arr = [];
    for (var n = 1; n <= N; n++) arr.push(n);
    for (var i = arr.length - 1; i > 0; i--) { var j = azar(i + 1), t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    misNumeros = arr;
    miTabla.textContent = '';
    arr.forEach(function (n) {
      var c = h('span', 'bg-mia__c', String(n));
      c.dataset.n = n; c.style.setProperty('--c', columnaDe(n).color);
      miTabla.appendChild(c);
    });
    pintarRegistro();
  }

  function pintarRegistro() {
    [].forEach.call(tablero.querySelectorAll('.bg-num'), function (b) {
      var n = +b.dataset.n, sale = salidos.indexOf(n) >= 0;
      b.classList.toggle('is-salio', sale);
      b.classList.toggle('is-actual', n === actual);
      b.setAttribute('aria-pressed', sale ? 'true' : 'false');
    });
    [].forEach.call(miTabla.querySelectorAll('.bg-mia__c'), function (c) {
      c.classList.toggle('is-salio', salidos.indexOf(+c.dataset.n) >= 0);
      c.classList.toggle('is-actual', +c.dataset.n === actual);
    });
    gajos.forEach(function (g, i) { g.classList.toggle('is-salio', salidos.indexOf(i + 1) >= 0); });
    leyenda.textContent = salidos.length
      ? 'Han salido ' + salidos.length + ' de ' + N + ': ' + salidos.join(', ') + '. Faltan ' + (N - salidos.length) + '. Toca uno de los que ya salieron para ver su pregunta otra vez.'
      : 'Todavía no ha salido ningún número. Quedan ' + N + '.';
  }

  function vaciarPanel(msg) {
    panel.textContent = '';
    var v = h('div', 'bg-vacio');
    v.appendChild(h('span', 'bg-vacio__ic', '?'));
    v.appendChild(h('p', '', msg));
    panel.appendChild(v);
  }

  // Pregunta del número n. «nuevo»: acaba de salir de la ruleta.
  function mostrar(n, nuevo) {
    actual = n;
    var q = PREGUNTAS[n - 1], co = columnaDe(n);
    panel.textContent = '';
    panel.style.setProperty('--c', co.color);
    var cab = h('div', 'bg-pregunta__cab');
    var ficha = h('span', 'bg-ficha'); ficha.style.background = co.color;
    ficha.innerHTML = '<small>' + co.letra + '</small><b>' + n + '</b>';
    ficha.setAttribute('aria-hidden', 'true');
    cab.appendChild(ficha);
    var tit = h('div');
    tit.appendChild(h('p', 'bg-pregunta__rot', 'Pregunta ' + n + ' de ' + N + ' · columna ' + co.letra));
    tit.appendChild(h('p', 'bg-fuente', EXPO[q.e] + ' · ' + q.f));
    cab.appendChild(tit);
    panel.appendChild(cab);
    var enun = h('h3', 'bg-q', q.q);
    enun.tabIndex = -1;
    panel.appendChild(enun);
    var lista = h('ul', 'bg-ops');
    var fb = h('div', 'bg-fb'); fb.hidden = true;
    var respondida = false;
    var btns = q.o.map(function (txt, i) {
      var li = h('li');
      var b = h('button', 'bg-op'); b.type = 'button';
      b.innerHTML = '<b aria-hidden="true">' + LETRAS[i] + '</b><span></span>';
      b.lastChild.textContent = txt;
      b.addEventListener('click', function () {
        if (respondida) return;
        respondida = true;
        revelar(i);
      });
      li.appendChild(b); lista.appendChild(li);
      return b;
    });
    panel.appendChild(lista);
    var ver = h('button', 'bg-btn bg-btn--claro bg-btn--chico'); ver.type = 'button';
    ver.innerHTML = '<span aria-hidden="true">👀</span><span>Mostrar la respuesta</span>';
    ver.addEventListener('click', function () { if (!respondida) { respondida = true; revelar(-1); } });
    panel.appendChild(ver);
    panel.appendChild(fb);
    function revelar(elegida) {
      btns.forEach(function (b, i) {
        b.disabled = true;
        if (i === q.c) b.classList.add('is-ok');
        else if (i === elegida) b.classList.add('is-mal');
      });
      ver.hidden = true;
      fb.hidden = false; fb.textContent = '';
      fb.className = 'bg-fb ' + (elegida === q.c ? 'bg-fb--ok' : elegida < 0 ? 'bg-fb--ver' : 'bg-fb--mal');
      fb.appendChild(h('strong', '', elegida === q.c ? '¡Correcto!' : elegida < 0 ? 'La respuesta es la ' + LETRAS[q.c] + '.' : 'Casi. La respuesta es la ' + LETRAS[q.c] + '.'));
      fb.appendChild(h('span', '', q.x));
    }
    pintarRegistro();
    if (!nuevo) { try { enun.focus({ preventScroll: true }); } catch (e) {} }
  }

  // ---------- La ruleta ----------
  function girar() {
    if (girando) return;
    if (salidos.length >= N) { estado.textContent = 'Ya salieron los 20 números. Toca «Empezar de nuevo» para jugar otra vez.'; return; }
    var libres = [];
    for (var n = 1; n <= N; n++) if (salidos.indexOf(n) < 0) libres.push(n);
    var elegido = libres[azar(libres.length)];   // al azar entre los que no han salido
    girando = true;
    botonGirar.disabled = true; botonReiniciar.disabled = true;
    rueda.classList.remove('is-sale'); rueda.classList.add('is-gira');
    tarjeta.textContent = '';
    vaciarPanel('El sombrero está girando…');
    estado.textContent = 'Girando…';
    // El gajo del número elegido debe quedar bajo el puntero (arriba)
    var destino = -(elegido - 1) * 18;
    var vueltas = reducir ? 0 : 4 + azar(3);
    var extra = (azar(10) - 4.5) * 1.4;           // cae en cualquier punto del gajo
    var sig = angulo - (((angulo % 360) + 360) % 360) + 360 * vueltas + (((destino + extra) % 360) + 360) % 360;
    if (sig <= angulo) sig += 360;
    angulo = sig;
    disco.style.transitionDuration = reducir ? '0s' : (3.4 + Math.random() * 0.8) + 's';
    disco.style.transform = 'rotate(' + angulo + 'deg)';
    var terminado = false;
    function fin() {
      if (terminado) return; terminado = true;
      disco.removeEventListener('transitionend', onEnd);
      clearInterval(parpadeo);
      salidos.push(elegido);
      girando = false;
      rueda.classList.remove('is-gira');
      tarjeta.textContent = elegido;
      tarjeta.style.setProperty('--c', columnaDe(elegido).color);
      rueda.classList.add('is-sale');
      botonGirar.disabled = salidos.length >= N; botonReiniciar.disabled = false;
      botonGirar.querySelector('.bg-btn__txt').textContent = salidos.length >= N ? '¡Ya salieron todos!' : 'Girar otra vez';
      estado.textContent = 'Salió el ' + elegido + ' (columna ' + columnaDe(elegido).letra + '). ' + (salidos.length >= N ? '¡Salieron los 20 números!' : 'Quedan ' + (N - salidos.length) + ' números.');
      mostrar(elegido, true);
      if (window.innerWidth <= 1000) { try { panel.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'nearest' }); } catch (e) {} }
    }
    function onEnd(e) { if (e.target === disco) fin(); }
    disco.addEventListener('transitionend', onEnd);
    // La tarjeta muestra números al azar mientras gira
    var parpadeo = setInterval(function () { tarjeta.textContent = String(1 + azar(N)); }, 90);
    tarjeta.style.setProperty('--c', '#fff');
    setTimeout(fin, reducir ? 50 : 5400);
  }

  function reiniciar() {
    if (girando) return;
    salidos = []; actual = null;
    disco.style.transitionDuration = '0s';
    angulo = 0; disco.style.transform = 'rotate(0deg)';
    rueda.classList.remove('is-sale', 'is-gira');
    tarjeta.textContent = '';
    botonGirar.disabled = false;
    botonGirar.querySelector('.bg-btn__txt').textContent = '¡Girar el sombrero!';
    estado.textContent = 'Todo listo: gira el sombrero para sacar el primer número.';
    vaciarPanel('Aquí aparecerá la pregunta del número que salga.');
    pintarRegistro();
  }

  botonGirar.addEventListener('click', girar);
  botonReiniciar.addEventListener('click', reiniciar);
  botonBarajar.addEventListener('click', armarMiTabla);

  disco.style.transition = 'transform 4s cubic-bezier(.12,.7,.18,1)';
  vaciarPanel('Aquí aparecerá la pregunta del número que salga.');
  armarMiTabla();
  pintarRegistro();
  raiz.setAttribute('data-listo', '1');
  // Ganchos para pruebas
  raiz.__bingo = { preguntas: PREGUNTAS, salidos: function () { return salidos.slice(); }, girando: function () { return girando; }, actual: function () { return actual; } };
})();
