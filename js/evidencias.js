// Evidencias: amplía cada imagen en una ventana, con anterior/siguiente y cierre con Esc.
(function () {
  var modal = document.getElementById('ev-modal');
  if (!modal || typeof modal.showModal !== 'function') return;
  var botones = [].slice.call(document.querySelectorAll('.ev-ver'));
  var img = document.getElementById('ev-img');
  var leyenda = document.getElementById('ev-leyenda');
  var actual = 0, origen = null;

  function mostrar(i) {
    actual = (i + botones.length) % botones.length;
    var b = botones[actual], foto = b.querySelector('img');
    img.src = foto.currentSrc || foto.src;
    img.alt = foto.alt;
    var pie = b.parentNode.querySelector('figcaption');
    leyenda.textContent = pie.querySelector('strong').textContent + ' · ' + pie.lastElementChild.textContent;
  }
  function abrir(i) { origen = botones[i]; mostrar(i); modal.showModal(); }

  botones.forEach(function (b, i) { b.addEventListener('click', function () { abrir(i); }); });
  document.getElementById('ev-cerrar').addEventListener('click', function () { modal.close(); });
  document.getElementById('ev-ant').addEventListener('click', function () { mostrar(actual - 1); });
  document.getElementById('ev-sig').addEventListener('click', function () { mostrar(actual + 1); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
  });
  modal.addEventListener('close', function () { if (origen) origen.focus(); });
})();
