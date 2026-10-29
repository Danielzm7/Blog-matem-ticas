// Página «Exposiciones»: las siete exposiciones se dibujan a partir de la lista de datos de abajo.
(function () {
  // =====================================================================
  //  DATOS EDITABLES — es lo único que hay que tocar para completar la página
  // =====================================================================

  // Cuántos espacios reservados se muestran en el carrusel mientras una exposición no tiene imágenes.
  // Con 1 no aparecen flechas, puntos ni contador.
  var MARCADORES = 3;

  // Una entrada por exposición, en orden (la primera es la Exposición 01, y así hasta la 04).
  //   titulo:       tema expuesto. Vacío = «Tema por definir».
  //   descripcion:  texto breve. Vacío = texto provisional.
  //   integrantes:  lista de nombres, por ejemplo ['Nombre 1', 'Nombre 2']. Vacía = «Integrantes por añadir».
  //   imagenes:     lista de { src: 'img/mi-foto.jpg', alt: 'qué se ve en la imagen', fit: 'contain' (opcional: sin recortar) }. Vacía = espacios reservados.
  //   diapositivas: enlace completo (https://…). Vacío o inválido = «Próximamente».
  //   conceptos:    (opcional) lista de ideas clave; si existe, se muestra la caja «Conceptos clave».
  //   autoplay:     (opcional) true = el carrusel avanza solo (se pausa con un clic).
  //   pantalla:     (opcional) true = botón circular de pantalla arriba a la izquierda, que abre las imágenes en modo presentación (pantalla completa).
  var AUTO_MS = 7000;   // tiempo entre diapositivas
  var PAUSA_MS = 12000; // cuánto dura la pausa si nadie vuelve a tocar el carrusel

  // Diapositivas de la Exposición 1: img/exposicion-1/s01.jpg … s19.jpg (1280×720).
  // Cuando las imágenes estén en la carpeta, cambia a true.
  var DIAPOS_1_LISTAS = true;
  var ALT_1 = [
    'Portada: Referentes curriculares, realizado por las dos integrantes',
    'Índice de la presentación',
    'Bienvenida',
    'Introducción',
    'Concepciones sobre la naturaleza de las matemáticas',
    'Las cinco corrientes: platonismo, logicismo, formalismo, intuicionismo y constructivismo',
    'Reconceptualización de la didáctica matemática',
    'Transposición didáctica y trabajo didáctico',
    'Estructura curricular: los tres pilares',
    'Pilar 1: procesos generales',
    'Pilar 2: conocimientos básicos',
    'Pilar 3: contexto y situaciones problemáticas',
    'Fases de la enseñanza y reflexión docente (Llinares)',
    'Fases preactiva, interactiva y posactiva',
    'Modelos que relacionan contexto, procesos y conocimientos',
    'Modelo 1: el cubo curricular',
    'Modelo 2: los tres ejes de coordenadas',
    'Modelo 3: esfera envolvente del contexto',
    'Agradecimientos'
  ];
  var IMAGENES_1 = DIAPOS_1_LISTAS ? ALT_1.map(function (alt, i) {
    return { src: 'img/exposicion-1/s' + (i < 9 ? '0' : '') + (i + 1) + '.jpg', alt: 'Diapositiva ' + (i + 1) + ': ' + alt };
  }) : [];

  // Exposición 2: captura de la portada de la exploración interactiva (img/expo2/s01.jpg).
  // Cuando la imagen esté en la carpeta, cambia a true.
  var IMAGEN_2_LISTA = true;
  var IMAGENES_2 = IMAGEN_2_LISTA ? [
    { src: 'img/expo2/s01.jpg', alt: 'Pantalla 1 de 9 de la exploración interactiva. Portada: Pensamiento numérico y sistemas numéricos, con la pregunta «¿Crees que saber contar significa comprender los números?»' },
    { src: 'img/expo2/s02.jpg', alt: 'Pantalla 2 de 9 de la exploración interactiva. ¿Qué es el pensamiento numérico? Reto breve con estrategias para resolver 8 + 7' },
    { src: 'img/expo2/s03.jpg', alt: 'Pantalla 3 de 9 de la exploración interactiva. Los números tienen distintos significados: el 5 como cantidad, medida, orden e identificación' },
    { src: 'img/expo2/s04.jpg', alt: 'Pantalla 4 de 9 de la exploración interactiva. ¿Cómo se construye la comprensión del número? Contamos una colección de fichas' },
    { src: 'img/expo2/s05.jpg', alt: 'Pantalla 5 de 9 de la exploración interactiva. El sistema de numeración decimal: representar el 32 con decenas y unidades' },
    { src: 'img/expo2/s06.jpg', alt: 'Pantalla 6 de 9 de la exploración interactiva. El significado de las operaciones: quitar, comparar y diferencia con fichas' },
    { src: 'img/expo2/s07.jpg', alt: 'Pantalla 7 de 9 de la exploración interactiva. Más de una estrategia: ¿cuántas ruedas tienen 8 triciclos?' },
    { src: 'img/expo2/s08.jpg', alt: 'Pantalla 8 de 9 de la exploración interactiva. Estimar y comprobar: ¿podría pagar $5.140 si compro algo de $260 y algo de $380?' },
    { src: 'img/expo2/s09.jpg', alt: 'Pantalla 9 de 9 de la exploración interactiva. ¿Qué significa esto para educación infantil? Reflexión final sobre la práctica docente' }
  ] : [];

  var EXPOSICIONES = [
    // 01 · Referentes curriculares
    {
      titulo: 'Referentes curriculares',
      descripcion: 'Presentación del Capítulo 2 de los Lineamientos Curriculares de Matemáticas del Ministerio de Educación: la matemática escolar no sirve para aprender procedimientos mecánicos, sino para desarrollar el pensamiento y permitir que el estudiante comprenda y actúe en su realidad.',
      integrantes: ['Karol Daiana Gomez Gomez', 'Elsy Victoria Martínez'],
      conceptos: ['Cinco concepciones de las matemáticas', 'Transposición didáctica', 'Tres pilares curriculares', 'Modelo de Llinares', 'Tres modelos curriculares'],
      autoplay: true,
      pantalla: true,
      imagenes: IMAGENES_1,
      diapositivas: 'https://canva.link/ccvbb7s7egbsu27'
    },
    // 02 · Pensamiento numérico
    {
      titulo: 'Pensamiento numérico y sistemas numéricos',
      descripcion: 'El pensamiento numérico es la capacidad de comprender los números, las cantidades y sus relaciones, y utilizarlos para resolver situaciones de la vida cotidiana. En la primera infancia se desarrolla al contar juguetes, comparar dónde hay más o menos objetos, ordenar cantidades y repartir materiales.',
      integrantes: ['Sharon Liset Sánchez Castro', 'Yuliana Andrea Villada Osorio', 'Angie Yiset Florez Coronado'],
      conceptos: ['Pensamiento numérico', 'Significados del número', 'Contar con sentido', 'Sistema de numeración decimal', 'Significado de las operaciones', 'Estimar y comprobar'],
      pantalla: true,
      imagenes: IMAGENES_2,
      diapositivas: 'https://semillaseducativas.my.canva.site/'
    },
    // 03 · Pensamiento espacial
    {
      titulo: 'Pensamiento espacial y sistemas geométricos',
      descripcion: 'La geometría intuitiva busca recuperar la importancia del pensamiento espacial, que fue dejado de lado con la llegada de la matemática moderna. Propone aprender mediante experiencias prácticas, la exploración y la representación del espacio, para comprender el entorno y relacionar las matemáticas con la vida cotidiana.',
      integrantes: ['Isabella Giraldo Ruiz', 'Alba Deisy Godoy Ibañez'],
      conceptos: ['Inteligencia espacial (Gardner)', 'Geometría activa', 'Niveles de Van Hiele', 'Representación bidimensional del espacio', 'Transformaciones geométricas'],
      pantalla: true,
      imagenes: [
        { src: 'img/expo3/s01.jpg', alt: 'Portada: Conocimientos básicos, pensamiento espacial y sistemas geométricos, con los nombres de las integrantes Isabella Giraldo Ruiz y Alba Deisy Godoy Ibañez', fit: 'contain' },
        { src: 'img/expo3/s02.jpg', alt: 'Contenido: introducción, la inteligencia espacial, geometría activa, desarrollo del pensamiento geométrico, actividad Kahoot, representación bidimensional del espacio tridimensional, transformaciones geométricas, actividad Gimkit y evaluación', fit: 'contain' },
        { src: 'img/expo3/s03.jpg', alt: 'Introducción: la geometría intuitiva fue dejada de lado con la matemática moderna y hoy se recupera el sentido espacial', fit: 'contain' },
        { src: 'img/expo3/s04.jpg', alt: 'Howard Gardner: la inteligencia espacial como base del pensamiento científico, con la pregunta sobre qué profesiones necesitan más pensamiento espacial', fit: 'contain' },
        { src: 'img/expo3/s05.jpg', alt: 'Puntos importantes: profesiones y disciplinas que requieren un alto desarrollo de la inteligencia espacial', fit: 'contain' },
        { src: 'img/expo3/s06.jpg', alt: 'La propuesta de renovación curricular enfatiza la geometría activa para restablecer el estudio de los sistemas geométricos', fit: 'contain' },
        { src: 'img/expo3/s07.jpg', alt: 'Geometría activa: aprender haciendo, moviéndose, dibujando y construyendo', fit: 'contain' },
        { src: 'img/expo3/s08.jpg', alt: 'Diferencia entre mostrar y hacer, con los ejemplos cuerpos, superficies y líneas, y ángulo', fit: 'contain' },
        { src: 'img/expo3/s09.jpg', alt: 'Van Hiele: nivel 1 de visualización y nivel 2 de análisis', fit: 'contain' },
        { src: 'img/expo3/s10.jpg', alt: 'Retroalimentación: actividad Kahoot con su PIN de juego y código QR', fit: 'contain' },
        { src: 'img/expo3/s11.jpg', alt: 'Van Hiele: nivel 3 de ordenamiento, con el ejemplo cuadrado, rectángulo y paralelogramo', fit: 'contain' },
        { src: 'img/expo3/s12.jpg', alt: 'Van Hiele: nivel 4 de razonamiento deductivo y nivel 5 de rigor', fit: 'contain' },
        { src: 'img/expo3/s13.jpg', alt: '¿Cómo se pasa de un nivel a otro? El avance no es automático ni depende solo de la edad', fit: 'contain' },
        { src: 'img/expo3/s14.jpg', alt: 'Representación bidimensional del espacio tridimensional: vista única, vistas múltiples y perspectiva', fit: 'contain' },
        { src: 'img/expo3/s15.jpg', alt: 'Transformaciones geométricas: traslación, rotación y reflexión', fit: 'contain' },
        { src: 'img/expo3/s16.jpg', alt: 'Retroalimentación: actividad Gimkit con código QR y enlace para unirse', fit: 'contain' },
        { src: 'img/expo3/s17.jpg', alt: 'Evaluación: código QR para el cuestionario en Wordwall', fit: 'contain' },
        { src: 'img/expo3/s18.jpg', alt: 'Gracias por su atención', fit: 'contain' }
      ],
      diapositivas: 'https://canva.link/k2kqce4uaohuwbv'
    },
    // 04 · Dimensiones del desarrollo
    {
      titulo: 'La visión del niño desde sus dimensiones del desarrollo',
      descripcion: 'El desarrollo infantil ocurre de manera integral: todas las dimensiones del niño están relacionadas y se desarrollan al mismo tiempo. Cada niño es único, tiene su propio ritmo de aprendizaje y crece en un contexto particular; por eso es importante comprenderlo como un ser integral.',
      integrantes: ['Paola Andrea Moreno', 'Luisa Fernanda Osorno', 'Sailuz Elinor Reverol'],
      conceptos: ['Desarrollo infantil integral', 'Dimensión socioafectiva', 'Dimensión corporal', 'Dimensión cognitiva y comunicativa', 'Dimensiones estética, espiritual y ética'],
      pantalla: true,
      imagenes: [
        { src: 'img/expo4/s01.jpg', alt: 'Portada: La visión del niño desde sus dimensiones del desarrollo, con las integrantes Paola Andrea Moreno, Luisa Fernanda Osorno y Sailuz Elinor Reverol' },
        { src: 'img/expo4/s02.jpg', alt: 'Índice: juego de la telaraña, el desarrollo infantil es integral, dimensiones socioafectiva, corporal, cognitiva, comunicativa, estética, espiritual y ética, conclusión, actividad evaluativa y referencias' },
        { src: 'img/expo4/s03.jpg', alt: 'La telaraña: niños jugando junto a una telaraña dibujada en rojo' },
        { src: 'img/expo4/s04.jpg', alt: 'El desarrollo infantil es integral: todas las dimensiones se desarrollan al mismo tiempo, cada niño es único y hay que mirarlo en su totalidad' },
        { src: 'img/expo4/s05.jpg', alt: 'Dimensión socioafectiva y dimensión corporal' },
        { src: 'img/expo4/s06.jpg', alt: 'Dimensión cognitiva y dimensión comunicativa' },
        { src: 'img/expo4/s07.jpg', alt: 'Dimensiones estética, espiritual y ética' },
        { src: 'img/expo4/s08.jpg', alt: 'Conclusión: el desarrollo integral se construye con la conexión entre todas las dimensiones' },
        { src: 'img/expo4/s09.jpg', alt: 'Actividad evaluativa' },
        { src: 'img/expo4/s10.jpg', alt: 'Referencias: Ministerio de Educación Nacional (1998), Lineamientos pedagógicos para la educación preescolar' }
      ],
      diapositivas: 'https://aulasvirtuales.uniquindio.edu.co/mod/resource/view.php?id=2890112'
    }
  ];

  // =====================================================================
  //  A partir de aquí no hace falta editar nada
  // =====================================================================
  var ACENTOS = ['#5BB8F0', '#FF7A6B', '#FFD45E', '#7FD8B5'];
  var DURACIONES = [8, 9, 10, 7];
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');

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
  function esUrl(u) { return typeof u === 'string' && /^https?:\/\/\S+/i.test(u.trim()); }
  function iniciales(nombre) {
    var p = nombre.split(/\s+/).filter(function (w) { return w.length > 2; }).slice(0, 2);
    if (!p.length) p = nombre.split(/\s+/).slice(0, 2);
    return p.map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  function dos(n) { return n < 10 ? '0' + n : String(n); }

  // Figura propia de cada exposición, hecha solo con CSS.
  function figura(n, dur, acento) {
    var hijos = [];
    if (n === 1 || n === 3) hijos = [h('i'), h('i'), h('i')];
    if (n === 7) hijos = [h('i'), h('i'), h('i'), h('i')];
    if (n === 2) hijos = [h('span', { text: '123' })];
    var f = h('span', { class: 'ex-fig ex-fig--' + n, 'aria-hidden': 'true' }, hijos);
    if (dur) f.style.setProperty('--d', dur + 's');
    if (acento) f.style.setProperty('--a', acento);
    return f;
  }

  // ---------- Carrusel (uno por exposición, independientes) ----------
  var CHEVRON_IZQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEVRON_DER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function carrusel(n, datos) {
    var imgs = (datos.imagenes || []).filter(function (i) { return i && i.src; });
    var reales = imgs.length > 0;
    var total = reales ? imgs.length : Math.max(1, MARCADORES);
    var auto = !!datos.autoplay && total > 1;
    var slides = [];
    for (var i = 0; i < total; i++) {
      var contenido;
      if (reales) {
        contenido = h('img', { src: imgs[i].src, alt: imgs[i].alt || '', loading: i === 0 ? 'eager' : 'lazy', decoding: 'async', draggable: 'false' });
      } else {
        contenido = null;
      }
      var s = h('div', { class: 'ex-slide' + (reales ? '' : ' ex-slide--vacia') + (reales && imgs[i].fit === 'contain' ? ' ex-slide--contain' : ''), role: 'group', 'aria-roledescription': 'diapositiva', 'aria-label': (i + 1) + ' de ' + total }, [contenido]);
      if (!reales) {
        s.appendChild(figura(n, DURACIONES[n - 1] + 1));
        s.appendChild(h('p', { class: 'ex-slide__num', text: 'Imagen ' + (i + 1) + ' de ' + total }));
        s.appendChild(h('p', { class: 'ex-slide__frase', text: 'Espacio reservado para las fotos de esta exposición' }));
      }
      slides.push(s);
    }
    var pista = h('div', { class: 'ex-pista' + (auto ? ' ex-pista--clic' : ''), tabindex: '0' }, slides);
    if (auto) pista.setAttribute('aria-label', 'Diapositivas de la exposición ' + n + '. Toca o haz clic para pausar o reanudar; usa las flechas del teclado para cambiar de diapositiva.');
    var marco = h('div', { class: 'ex-carrusel' + (total > 9 ? ' ex-carrusel--muchos' : '') + (auto ? ' ex-carrusel--auto' : ''), role: 'region', 'aria-roledescription': 'carrusel', 'aria-label': (auto ? 'Diapositivas' : 'Imágenes') + ' de la exposición ' + n }, [pista]);
    if (total < 2) return marco;
    var palabra = auto ? 'diapositiva' : 'imagen';

    var contador = h('span', { class: 'ex-contador', 'aria-hidden': 'true', text: '1 / ' + total });
    var ant = h('button', { class: 'ex-flecha ex-flecha--ant', type: 'button', 'aria-label': (auto ? 'Diapositiva anterior' : 'Imagen anterior') + ', exposición ' + n });
    var sig = h('button', { class: 'ex-flecha ex-flecha--sig', type: 'button', 'aria-label': (auto ? 'Diapositiva siguiente' : 'Imagen siguiente') + ', exposición ' + n });
    ant.innerHTML = CHEVRON_IZQ; sig.innerHTML = CHEVRON_DER;
    var puntos = h('div', { class: 'ex-puntos' });
    var botones = [];
    for (var k = 0; k < total; k++) {
      var b = h('button', { class: 'ex-punto', type: 'button', 'aria-label': 'Ir a la ' + palabra + ' ' + (k + 1) + ' de la exposición ' + n });
      botones.push(b); puntos.appendChild(b);
    }
    marco.appendChild(contador); marco.appendChild(ant); marco.appendChild(sig); marco.appendChild(puntos);

    var actual = 0;
    function pintar(i) {
      actual = i;
      contador.textContent = (i + 1) + ' / ' + total;
      botones.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    }
    var alPausar = null; // se define más abajo si hay autoplay
    function ir(i, instantaneo, automatico) {
      i = ((i % total) + total) % total;
      pista.scrollTo({ left: i * pista.clientWidth, behavior: (instantaneo || reducir.matches) ? 'instant' : 'smooth' });
      pintar(i);
      if (alPausar && !automatico) alPausar();
    }
    // El contador y los puntos siguen también al deslizar con el dedo o con el scroll.
    var pendiente = false;
    pista.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(function () {
        pendiente = false;
        var i = Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth));
        i = Math.max(0, Math.min(total - 1, i));
        if (i !== actual) pintar(i);
      });
    }, { passive: true });
    ant.addEventListener('click', function () { ir(actual - 1); });
    sig.addEventListener('click', function () { ir(actual + 1); });
    botones.forEach(function (b, j) { b.addEventListener('click', function () { ir(j); }); });
    pista.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
    });
    window.addEventListener('resize', function () { pista.scrollTo({ left: actual * pista.clientWidth, behavior: 'instant' }); });
    pintar(0);
    if (auto) autoplay(marco, pista, ir, function () { return actual; }, total, function (f) { alPausar = f; });
    return marco;
  }

  // ---------- Reproducción automática (solo Exposición 1) ----------
  var PAUSA_SVG = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1" width="2.4" height="8" rx=".6" fill="currentColor"/><rect x="6.1" y="1" width="2.4" height="8" rx=".6" fill="currentColor"/></svg>';

  function autoplay(marco, pista, ir, actualFn, total, registrar) {
    var etiqueta = h('div', { class: 'ex-pausa', role: 'status' });
    etiqueta.innerHTML = PAUSA_SVG + '<span>En pausa</span>';
    marco.appendChild(etiqueta);
    var pausado = false, temporizador = null, reanudar = null, visible = true, programado = false;

    function enPantalla() {
      var r = marco.getBoundingClientRect();
      return r.bottom > 80 && r.top < window.innerHeight - 80;
    }
    function puedeAvanzar() { return !pausado && !document.hidden && visible && !reducir.matches; }
    function siguiente() {
      if (!puedeAvanzar()) return;
      var i = actualFn();
      // De la última a la primera salta de golpe, sin recorrer todas las diapositivas.
      ir(i + 1, i === total - 1, true);
    }
    function arrancar() {
      clearInterval(temporizador);
      temporizador = reducir.matches ? null : setInterval(siguiente, AUTO_MS);
    }
    function pausar() {
      pausado = true;
      etiqueta.classList.add('is-on');
      clearTimeout(reanudar);
      reanudar = setTimeout(continuar, PAUSA_MS);
      arrancar();
    }
    function continuar() {
      pausado = false;
      etiqueta.classList.remove('is-on');
      clearTimeout(reanudar);
      arrancar();
    }
    registrar(pausar);

    // Un toque o clic sobre la diapositiva pausa; otro la reanuda al instante.
    var inicio = null;
    pista.addEventListener('pointerdown', function (e) { inicio = { x: e.clientX, y: e.clientY }; });
    pista.addEventListener('click', function (e) {
      if (inicio && (Math.abs(e.clientX - inicio.x) > 8 || Math.abs(e.clientY - inicio.y) > 8)) return;
      if (pausado) continuar(); else pausar();
    });
    // Deslizar con el dedo también pausa.
    pista.addEventListener('touchmove', function () { if (!pausado) pausar(); else { clearTimeout(reanudar); reanudar = setTimeout(continuar, PAUSA_MS); } }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { rootMargin: '-80px 0px -80px 0px' }).observe(marco);
    }
    var cambio = function () { arrancar(); };
    if (reducir.addEventListener) reducir.addEventListener('change', cambio);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) arrancar(); });
    arrancar();
  }

  // ---------- Texto de cada exposición ----------
  function texto(n, d) {
    var titulo = (d.titulo || '').trim(), desc = (d.descripcion || '').trim();
    var nombres = (d.integrantes || []).filter(function (x) { return x && String(x).trim(); });
    var real = !!(d.conceptos && d.conceptos.length);
    var integrantes = h('ul', { class: 'ex-integrantes' + (real ? ' ex-integrantes--pres' : ''), 'aria-label': 'Integrantes' }, nombres.length
      ? nombres.map(function (x) {
          x = String(x).trim();
          return h('li', {}, real ? [h('span', { class: 'ex-ini', 'aria-hidden': 'true', text: iniciales(x) }), h('span', { text: x })] : [x]);
        })
      : [h('li', { class: 'ex-vacio', text: 'Integrantes por añadir' })]);
    var boton = esUrl(d.diapositivas)
      ? h('a', { class: 'ex-diap', href: d.diapositivas.trim(), target: '_blank', rel: 'noopener noreferrer' }, ['Ver exposición ', h('span', { 'aria-hidden': 'true', text: '↗' })])
      : h('span', { class: 'ex-prox', text: 'Próximamente' });
    return h('div', { class: 'ex-texto' }, [
      h('div', { class: 'ex-texto__cab' }, [h('span', { class: 'ex-etiqueta', text: 'Exposición ' + dos(n) }), figura(n, DURACIONES[n - 1])]),
      h('h2', { class: 'ex-titulo' + (titulo ? '' : ' ex-vacio'), text: titulo || 'Tema por definir' }),
      h('p', { class: 'ex-desc' + (desc ? '' : ' ex-vacio'), text: desc || 'Aquí irá una descripción breve de lo que se expuso.' }),
      real && nombres.length ? h('p', { class: 'ex-pres', text: 'Presentado por' }) : null,
      integrantes,
      boton
    ]);
  }

  // ---------- Modo presentación (pantalla completa dentro de la misma página) ----------
  var X_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  var OCULTAR_MS = 2500; // los controles se esconden si el cursor no se mueve
  var pres = null;

  function presentar(n, laminas, disparador) {
    if (pres) return;
    var total = laminas.length, actual = 0, oculto = null;
    var img = h('img', { class: 'ex-modo__img', alt: '', draggable: 'false' });
    var contador = h('span', { class: 'ex-modo__cont', 'aria-live': 'polite' });
    var cerrar = h('button', { class: 'ex-modo__btn ex-modo__cerrar', type: 'button', 'aria-label': 'Salir del modo presentación' });
    var ant = h('button', { class: 'ex-modo__btn ex-modo__ant', type: 'button', 'aria-label': 'Diapositiva anterior' });
    var sig = h('button', { class: 'ex-modo__btn ex-modo__sig', type: 'button', 'aria-label': 'Diapositiva siguiente' });
    cerrar.innerHTML = X_SVG + '<span>Salir</span>'; ant.innerHTML = CHEVRON_IZQ; sig.innerHTML = CHEVRON_DER;
    var capa = h('div', { class: 'ex-modo', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Presentación de la exposición ' + n }, [img, cerrar, contador]);
    if (total > 1) { capa.appendChild(ant); capa.appendChild(sig); }

    function pintar(i) {
      actual = ((i % total) + total) % total;
      img.src = laminas[actual].src; img.alt = laminas[actual].alt || '';
      contador.textContent = (actual + 1) + ' / ' + total;
      var vecina = laminas[(actual + 1) % total]; if (vecina) { var pre = new Image(); pre.src = vecina.src; }
    }
    function mostrar() {
      capa.classList.remove('is-quieta');
      clearTimeout(oculto);
      oculto = setTimeout(function () { capa.classList.add('is-quieta'); }, OCULTAR_MS);
    }
    function salir() {
      if (!pres) return;
      pres = null;
      clearTimeout(oculto);
      document.removeEventListener('keydown', teclas, true);
      document.removeEventListener('fullscreenchange', alCambiarPantalla);
      document.body.classList.remove('ex-modo-abierta');
      if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
      capa.remove();
      if (disparador && disparador.focus) disparador.focus();
    }
    function alCambiarPantalla() { if (!document.fullscreenElement) salir(); }
    function teclas(e) {
      if (e.key === 'Escape') { e.preventDefault(); salir(); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); pintar(actual + 1); mostrar(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); pintar(actual - 1); mostrar(); }
      else if (e.key === 'Home') { pintar(0); mostrar(); }
      else if (e.key === 'End') { pintar(total - 1); mostrar(); }
      else if (e.key === 'Tab') { // el foco se queda dentro de la presentación
        var bs = [cerrar].concat(total > 1 ? [ant, sig] : []);
        var i = bs.indexOf(document.activeElement);
        e.preventDefault(); bs[(i + (e.shiftKey ? -1 : 1) + bs.length) % bs.length].focus(); mostrar();
      }
    }
    cerrar.addEventListener('click', salir);
    ant.addEventListener('click', function () { pintar(actual - 1); mostrar(); });
    sig.addEventListener('click', function () { pintar(actual + 1); mostrar(); });
    capa.addEventListener('mousemove', mostrar);
    capa.addEventListener('pointerdown', mostrar);
    // En el celular se puede deslizar con el dedo.
    var x0 = null;
    capa.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    capa.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { pintar(actual + (dx < 0 ? 1 : -1)); }
    }, { passive: true });

    pres = capa;
    pintar(0);
    document.body.appendChild(capa);
    document.body.classList.add('ex-modo-abierta');
    document.addEventListener('keydown', teclas, true);
    var fs = capa.requestFullscreen && capa.requestFullscreen();
    if (fs && fs.then) fs.then(function () { document.addEventListener('fullscreenchange', alCambiarPantalla); }, function () {});
    cerrar.focus({ preventScroll: true });
    mostrar();
  }

  // Orden de los dos componentes en cada tarjeta: el carrusel primero o el texto primero.
  var TEXTO_PRIMERO = { 2: true, 4: true };

  document.querySelectorAll('[data-expo]').forEach(function (card) {
    var n = +card.getAttribute('data-expo'), d = EXPOSICIONES[n - 1] || {};
    var c = carrusel(n, d), t = texto(n, d);
    var laminas = (d.imagenes || []).filter(function (i) { return i && i.src; });
    if (d.pantalla && laminas.length) {
      var abrir = h('button', { class: 'ex-pantalla', type: 'button', 'aria-label': 'Ver las diapositivas de la exposición ' + n + ' en pantalla completa' });
      abrir.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 8.2v5.6l4.6-2.8z" fill="currentColor"/><path d="M8 20.5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      abrir.addEventListener('click', function () { presentar(n, laminas, abrir); });
      c.appendChild(abrir);
    }
    if (d.conceptos && d.conceptos.length) {
      var caja = h('div', { class: 'ex-conceptos' }, [
        h('p', { class: 'ex-conceptos__tit', text: 'Conceptos clave' }),
        h('ul', {}, d.conceptos.map(function (x) { return h('li', { text: x }); }))
      ]);
      var izq = h('div', { class: 'ex-izq' }, [c, caja]);
      if (TEXTO_PRIMERO[n]) { card.appendChild(t); card.appendChild(izq); } else { card.appendChild(izq); card.appendChild(t); }
      return;
    }
    if (TEXTO_PRIMERO[n]) { card.appendChild(t); card.appendChild(c); } else { card.appendChild(c); card.appendChild(t); }
  });

  // ---------- Índice ----------
  var indice = document.getElementById('ex-indice');
  EXPOSICIONES.forEach(function (d, i) {
    var n = i + 1, titulo = (d.titulo || '').trim();
    var num = h('span', { class: 'ex-ind__num', text: dos(n), 'aria-hidden': 'true' });
    num.style.background = ACENTOS[i];
    indice.appendChild(h('a', { class: 'ex-ind', href: '#expo-' + n }, [num, h('span', { text: titulo || 'Tema por definir' })]));
  });

  // ---------- Franja oscura: se cuenta sola ----------
  var publicadas = EXPOSICIONES.filter(function (d) { return esUrl(d.diapositivas); }).length;
  document.getElementById('ex-cuenta').textContent = publicadas + ' de ' + EXPOSICIONES.length;
  var barras = document.getElementById('ex-barras');
  barras.setAttribute('aria-label', publicadas + ' de ' + EXPOSICIONES.length + ' diapositivas publicadas');
  EXPOSICIONES.forEach(function (d) { barras.appendChild(h('i', { class: esUrl(d.diapositivas) ? 'ex-on' : '' })); });

  // ---------- Aparición al desplazarse ----------
  if (document.documentElement.classList.contains('js')) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.ex-rev').forEach(function (el) { obs.observe(el); });
  }
})();
