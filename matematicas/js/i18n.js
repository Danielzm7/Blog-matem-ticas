/* Textos del sitio (español). Para otro idioma: agregar window.SC_I18N.en = {...} y poner SC_LANG = 'en'. */
window.SC_I18N = window.SC_I18N || {};
window.SC_I18N.es = {
  nombre: 'Español',
  inicio: 'Inicio', matematicas: 'Matemáticas', regresar: 'Regresar', pantallaCompleta: 'Pantalla completa', salirPantalla: 'Salir de pantalla completa',
  compartir: 'Compartir enlace', copiado: 'Enlace copiado', copiadoCodigo: 'Código de actividad copiado', codigo: 'Código de actividad',
  accesibilidad: 'Accesibilidad', calma: 'Modo calma (sin cronómetro ni vidas)', calmaAyuda: 'Quita los temporizadores y las vidas en los juegos de preguntas. Se aplica al empezar una partida nueva.',
  texto: 'Tamaño del texto', textoN: 'Normal', textoG: 'Grande', textoXG: 'Muy grande', contraste: 'Contraste alto', anim: 'Reducir animaciones', cerrar: 'Cerrar',
  perfil: 'Perfil', invitado: 'Invitado', cambiarPerfil: 'Cambiar perfil',
  actividad: 'Actividad', juegoDe: 'Juego {i} de {n}', siguienteJuego: 'Siguiente juego', actividadLista: '¡Actividad completa!', volverInicio: 'Volver al inicio',
  idioma: 'Idioma', cargando: 'Cargando', listo: '¡Listo!',
  avisoDatos: 'Los datos de progreso viven solo en este navegador. Si borras la memoria (caché) del navegador, se eliminan.'
};

/* Textos fijos de la interfaz común de los juegos (pausa, fin de partida, etc.): se traducen en pantalla cuando SC_LANG no es 'es'.
   Las claves son el texto en español; si termina en ':' se traduce el prefijo (p. ej. «Puntaje: 83%»). Los enunciados de los problemas siguen en español. */
window.SC_I18N.es.ui = {};
window.SC_I18N.en = {
  nombre: 'English',
  inicio: 'Home', matematicas: 'Math', regresar: 'Back', pantallaCompleta: 'Full screen', salirPantalla: 'Exit full screen',
  compartir: 'Share link', copiado: 'Link copied', copiadoCodigo: 'Activity code copied', codigo: 'Activity code',
  accesibilidad: 'Accessibility', calma: 'Calm mode (no timer or lives)', calmaAyuda: 'Removes timers and lives in question games. Applies when you start a new game.',
  texto: 'Text size', textoN: 'Normal', textoG: 'Large', textoXG: 'Extra large', contraste: 'High contrast', anim: 'Reduce animations', cerrar: 'Close',
  perfil: 'Profile', invitado: 'Guest', cambiarPerfil: 'Change profile', actividad: 'Activity', juegoDe: 'Game {i} of {n}', siguienteJuego: 'Next game',
  actividadLista: 'Activity complete!', volverInicio: 'Back home', idioma: 'Language', cargando: 'Loading', listo: 'Ready!',
  avisoDatos: 'Progress data lives only in this browser. Clearing the browser cache deletes it.',
  sub: [['¡Nuevo!', 'New!'], [' aciertos en ', ' correct in '], [' intentos', ' tries'], [' preguntas de ', ' questions of '], [' errores', ' mistakes']],
  ui: {
    'Pausa': 'Paused', 'El juego está en pausa.': 'The game is paused.', 'Continuar': 'Continue', 'Fin del juego': 'Game over', 'Jugar de nuevo': 'Play again',
    'Récord': 'Best', 'Récord:': 'Best:', 'Preguntas': 'Questions', 'Preguntas:': 'Questions:', 'Aciertos': 'Correct', 'JUGAR': 'PLAY', 'Inicio': 'Home', 'Errores': 'Mistakes', 'Errores:': 'Mistakes:',
    'Pista': 'Hint', 'Otra vez': 'Again', 'Siguiente': 'Next', 'Responder': 'Answer', 'Mejor': 'Best', 'Mejor:': 'Best:', 'Puntaje:': 'Score:', 'Puntaje': 'Score', 'Hojas:': 'Leaves:', 'Vueltas:': 'Rounds:',
    '¡Se acabó el tiempo!': 'Time is up!', 'Se acabó el tiempo': 'Time is up', '¡Lo lograste!': 'You did it!', '¡Muy bien!': 'Well done!', '¡Bien!': 'Good!', 'Inténtalo otra vez': 'Try again',
    '¡Tablero despejado!': 'Board cleared!', '¡Tren completo!': 'Train complete!', '¡Aterrizaje perfecto!': 'Perfect landing!', '¡BINGO!': 'BINGO!', '¡Barco terminado!': 'Boat finished!', '¡Experimento listo!': 'Experiment ready!'
  }
};
