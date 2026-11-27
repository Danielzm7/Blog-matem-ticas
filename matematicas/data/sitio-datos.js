/* Datos compartidos del sitio: temas, grados y rutas sugeridas por grado. Se edita aquí, sin tocar el código. */
window.SC_META = {
  temas: { numeros: 'Números y contar', sumas: 'Sumas', restas: 'Restas', multiplicar: 'Multiplicar', dividir: 'Dividir', comparar: 'Comparar', formas: 'Formas', memoria: 'Memoria', fracciones: 'Fracciones', problemas: 'Problemas', patrones: 'Patrones', espacio: 'Espacio' },
  /* Filtros de habilidad de la portada */
  habilidades: [['contar', 'Contar y números', ['numeros']], ['sumar', 'Sumar y restar', ['sumas', 'restas']], ['multi', 'Multiplicar y dividir', ['multiplicar', 'dividir']], ['comparar', 'Comparar', ['comparar']], ['formas', 'Formas', ['formas']], ['memoria', 'Memoria', ['memoria']], ['otros', 'Fracciones y problemas', ['fracciones', 'problemas', 'patrones', 'espacio']]],
  /* Grado: edades que le corresponden */
  grados: [['pre', 'Preescolar', [3, 4, 5]], ['1', '1.º', [6]], ['2', '2.º', [7]], ['3', '3.º', [8]], ['4', '4.º', [9]], ['5', '5.º', [10]]],
  /* Rutas sugeridas (ids de juego de datos.js). Estrellas: 1 con 60 %, 2 con 80 %, 3 con 95 % de aciertos */
  rutas: [
    { grado: 'pre', nombre: 'Preescolar', juegos: ['g39', 'g29', 'g22', 'g30', 'g40'], nota: 'Contar, seguir los números, bingo hasta 10, memoria y primeras sumas.' },
    { grado: '1', nombre: '1.º', juegos: ['g47', 'g40', 'g24', 'g49', 'g50'], nota: 'Contar frutas, sumas pequeñas y partes de un total.' },
    { grado: '2', nombre: '2.º', juegos: ['g19', 'g20', 'g48', 'g23', 'g41'], nota: 'Sumas y restas hasta 100 y el objetivo de las gemas.' },
    { grado: '3', nombre: '3.º', juegos: ['g34', 'g36', 'g38', 'g37', 'g52'], nota: 'Tablas de multiplicar, súper reto y monstruos.' },
    { grado: '4', nombre: '4.º', juegos: ['g35', 'g43', 'g14', 'g51', 'g16'], nota: 'Dividir, problemas, comparar números y fracciones.' },
    { grado: '5', nombre: '5.º', juegos: ['g17', 'g27', 'g15', 'g12', 'g28'], nota: 'Fracciones, decimales y operaciones combinadas.' }
  ],
  avatares: ['🦊', '🐼', '🐯', '🐸', '🦉', '🐙', '🦄', '🐢', '🐰', '🦁']
};
