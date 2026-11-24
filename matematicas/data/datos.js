/* Datos de la sección Matemáticas. Aquí viven los juegos, mundos, niveles, el reto del día,
   los videos y los materiales. La página los lee desde este archivo: para agregar un juego,
   un video o un material basta con añadir un elemento a la lista que corresponda.
   - games con url:'/ruta/' abren su propia página en lugar del visor de la sección (sin estrellas ni exploración libre).
   - videos: {id, titulo, desc, tipo:'archivo'|'enlace', archivo:'/matematicas/archivos/video.mp4' | enlace:'https://www.youtube.com/watch?v=...', pic, col, edad, cat, fecha}
   - mats:   {id, titulo, desc, tipo:'PDF', edad, cat, archivo:'/matematicas/archivos/ficha.pdf', miniatura:'(opcional) /matematicas/archivos/ficha.jpg', col}
*/
window.DATOS_MATE = {
  cats: [
    {id:'contemos', nombre:'Contemos juntos', desc:'Contar objetos y unir cada cantidad con su número.', pic:'p-abacus', col:'sky', activa:true},
    {id:'figuras', nombre:'Figuras y formas', desc:'Reconocer círculos, cuadrados y triángulos, y construir con ellos.', pic:'p-tri', col:'sun', activa:true},
    {id:'patrones', nombre:'Patrones y secuencias', desc:'Descubrir qué sigue y completar el orden.', pic:'p-star', col:'rose', activa:true},
    {id:'comparamos', nombre:'Comparamos y ordenamos', desc:'Más, menos, primero y último.', pic:'p-dice', col:'mint', activa:true},
    {id:'espacio', nombre:'Espacio y ubicación', desc:'Arriba, abajo, a un lado: ¿dónde está?', pic:'p-compass', col:'lilac', activa:true},
    {id:'desafios', corto:'Desafíos', nombre:'Pequeños desafíos', desc:'Retos cortos para pensar un poquito más.', pic:'p-map', col:'pink', activa:true}
  ],
  niveles: [
    {id:'explorador', nombre:'Explorador', col:'mint'},
    {id:'descubridor', nombre:'Descubridor', col:'sun'},
    {id:'desafio', nombre:'Desafío', col:'rose'}
  ],
  games: [
    {id:'g1', motor:'count', titulo:'Cuenta y encuentra', cat:'contemos', edades:[3,4], nivel:'explorador', habilidad:'Contar hasta 5', tiempo:'3 min', estado:'publicado', pic:'o-apple',
      fam:{meta:'Contar objetos uno a uno y reconocer el número que representan.', acompanar:'Pídele que señale cada objeto mientras lo cuenta en voz alta.', materiales:'Fichas, botones o frutas reales para contar en casa.', observar:'Si toca cada objeto una sola vez y si dice los números en orden.'}},
    {id:'g2', motor:'sort', titulo:'Clasifica las figuras', cat:'figuras', edades:[4,5], nivel:'descubridor', habilidad:'Reconocer figuras', tiempo:'4 min', estado:'publicado', pic:'s-tri',
      fam:{meta:'Reconocer círculo, cuadrado y triángulo sin importar su color.', acompanar:'Pregunta «¿por qué va ahí?» y deja que explique con sus palabras.', materiales:'Figuras de cartón de colores y tres cajas.', observar:'Si se guía por la forma o se distrae con el color.'}},
    {id:'g3', motor:'seq', titulo:'Completa la secuencia', cat:'patrones', edades:[4,5], nivel:'descubridor', habilidad:'Seguir patrones', tiempo:'4 min', estado:'publicado', pic:'p-star',
      fam:{meta:'Identificar la unidad que se repite y anticipar lo que sigue.', acompanar:'Lean el patrón juntos en voz alta: «azul, rojo, azul, rojo…».', materiales:'Cuentas, bloques o cubos de dos o tres colores.', observar:'Si puede continuar el patrón sin ayuda y si crea uno propio.'}},
    {id:'g4', motor:'order', titulo:'Ordena los números', cat:'comparamos', edades:[5], nivel:'descubridor', habilidad:'Ordenar del 1 al 5', tiempo:'3 min', estado:'publicado', pic:'p-dice',
      fam:{meta:'Ordenar una serie numérica de menor a mayor.', acompanar:'Canten la serie numérica antes de jugar.', materiales:'Tarjetas con números del 1 al 5 para ordenar en el piso.', observar:'Qué número ubica primero y si se corrige solo.'}},
    {id:'g5', motor:'more', titulo:'¿Dónde hay más?', cat:'comparamos', edades:[3,4], nivel:'explorador', habilidad:'Comparar cantidades', tiempo:'3 min', estado:'publicado', pic:'o-ball',
      fam:{meta:'Comparar dos cantidades sin necesidad de contar.', acompanar:'Pregunta «¿cómo supiste?» y celebra cualquier estrategia.', materiales:'Dos montoncitos de objetos pequeños.', observar:'Si compara a simple vista o prefiere contar uno por uno.'}},
    {id:'g6', motor:'build', titulo:'Construye con figuras', cat:'figuras', edades:[5], nivel:'desafio', habilidad:'Componer figuras', tiempo:'5 min', estado:'publicado', pic:'s-square',
      fam:{meta:'Componer un dibujo uniendo figuras geométricas.', acompanar:'Primero nombren las figuras del modelo y después busquen cada una.', materiales:'Tangram, bloques de madera o recortes de papel.', observar:'Si nombra las figuras y cómo las ubica en el espacio.'}},
    {id:'g7', motor:'train', titulo:'El tren de los números', cat:'patrones', edades:[4,5], nivel:'descubridor', habilidad:'Secuencia numérica', tiempo:'4 min', estado:'publicado', pic:'p-abacus',
      fam:{meta:'Completar secuencias contando de 1 en 1 y de 2 en 2.', acompanar:'Canten la secuencia señalando cada vagón.', materiales:'Vagones de cartón numerados.', observar:'Si reconoce el número que falta y si cuenta de 2 en 2.'}},
    {id:'g8', motor:'pairs', titulo:'Encuentra las parejas', cat:'contemos', edades:[4,5], nivel:'desafio', habilidad:'Unir número y cantidad', tiempo:'4 min', estado:'publicado', pic:'p-ring',
      fam:{meta:'Relacionar el símbolo numérico con su cantidad.', acompanar:'Anímalo a decir en voz alta lo que ve antes de voltear otra carta.', materiales:'Un memorama casero con números y puntos.', observar:'Qué estrategia usa para recordar dónde estaba cada carta.'}},
    {id:'g9', motor:'where', titulo:'Arriba, abajo y al lado', cat:'espacio', edades:[4,5], nivel:'explorador', habilidad:'Ubicación en el espacio', tiempo:'3 min', estado:'publicado', pic:'p-compass',
      fam:{meta:'Usar palabras de posición: arriba, abajo, izquierda y derecha.', acompanar:'Jueguen con objetos reales: «pon el osito arriba de la caja».', materiales:'Una caja y un juguete.', observar:'Si distingue izquierda y derecha o solo arriba y abajo.'}},
    {id:'g10', motor:'sum', titulo:'Junta y cuenta', cat:'desafios', edades:[5,6], nivel:'desafio', habilidad:'Juntar grupos', tiempo:'4 min', estado:'publicado', pic:'o-flower',
      fam:{meta:'Reunir dos grupos y encontrar cuántos hay en total.', acompanar:'Que junte los grupos con las manos antes de contestar.', materiales:'Fichas o botones en dos montoncitos.', observar:'Si cuenta todo desde 1 o continúa desde el primer grupo.'}},
    {id:'g12', motor:'', url:'/matematicas/juegos/robots-forma-expandida/', titulo:'Robots: forma expandida', cat:'contemos', edades:[7,8,9], nivel:'desafio', habilidad:'Forma expandida de números de tres cifras', tiempo:'5 min', estado:'publicado', pic:'o-robot', portada:'robots',
      fam:{meta:'Descomponer un número de tres cifras según el valor de cada dígito (centenas, decenas y unidades).', acompanar:'Pídele que explique por qué el 7 de 788 vale 700 y no 7.', materiales:'Tarjetas de valor posicional (100, 10, 1) o bloques base diez.', observar:'Si confunde el valor posicional con el dígito suelto y cómo trata los ceros (305).'}},
    {id:'g11', motor:'', titulo:'Mi primer mapa', cat:'espacio', edades:[5,6], nivel:'desafio', habilidad:'Leer un mapa sencillo', tiempo:'5 min', estado:'proximamente', pic:'p-map',
      fam:{meta:'Seguir un recorrido sencillo sobre un mapa.', acompanar:'Dibujen juntos el mapa del cuarto.', materiales:'Papel y lápices de colores.', observar:'Cómo describe el camino.'}}
  ],
  reto: {pregunta:'Hay 3 manzanas en la canasta y llegan 2 más. ¿Cuántas manzanas hay ahora?', objeto:'manzana', a:3, b:2, opciones:'4,5,6', correcta:'5', felicitacion:'¡Lo lograste! Juntar 3 y 2 da 5.'},
  videos: [],
  mats: []
};
