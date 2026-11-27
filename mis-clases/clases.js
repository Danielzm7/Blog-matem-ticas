/* ============ DATOS EDITABLES ============
   Cada clase: archivo (carpeta /mis-clases/videos/), fecha de grabación (AAAA-MM-DD),
   duración en segundos, titulo y descripcion. Cambia los textos libremente. */
var CLASES = [
  {n:'01', fecha:'2026-08-21', seg:19, titulo:'Lectura, bloques y juego digital', descripcion:'Una hoja de comprensión lectora, piezas de colores y un juego en el computador.'},
  {n:'02', fecha:'2026-08-24', seg:12, titulo:'Armamos palabras con rompecabezas', descripcion:'Rompecabezas con dibujos y letras para formar palabras sobre la mesa.'},
  {n:'03', fecha:'2026-08-24', seg:21, titulo:'Aros, rompecabezas y hojas de palabras', descripcion:'Aros de colores en el piso, pelotas y hojas de trabajo con palabras y dibujos.'},
  {n:'04', fecha:'2026-08-29', seg:14, titulo:'Torres de vasos y pelotas', descripcion:'Vasos apilados y pelotas de colores que se trasladan con una cuchara.'},
  {n:'05', fecha:'2026-08-29', seg:19, titulo:'Movimiento con vasos y aros', descripcion:'Una actividad de movimiento con vasos, aros y papeles de colores.'},
  {n:'06', fecha:'2026-10-09', seg:10, titulo:'Circuito de aros y figuras', descripcion:'Un circuito con aros y pelotas, y una hoja de figuras geométricas para colorear.'},
  {n:'07', fecha:'2026-10-09', seg:22, titulo:'Aros, pelotas y hojas de trabajo', descripcion:'Recorrido con aros y pelotas, combinado con hojas de actividades.'},
  {n:'08', fecha:'2026-10-17', seg:12, titulo:'Tulipanes, aros y vasos', descripcion:'Una hoja de trabajo con tulipanes, aros en el piso y vasos con pelotas.'},
  {n:'09', fecha:'2026-11-24', seg:22, titulo:'Tablero de colores y sumas', descripcion:'Un tablero de colores, una hoja de sumas con llevadas y un juego con aros.'},
  {n:'10', fecha:'2026-11-24', seg:11, titulo:'Cuchara, pelota y patrones', descripcion:'Equilibrio con cuchara y pelota, y una hoja de patrones de colores y números.'}
];
(function(){
'use strict';
var MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var COL=[['#DDF1FC','#59B9E9'],['#FFF1C9','#FFD66B'],['#FCE3EC','#FF827C'],['#DDF5EC','#83D7BC'],['#ECE6FC','#B9A5F1']];
var $=function(s,r){return (r||document).querySelector(s)};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var data=CLASES.map(function(c,i){
  var p=c.fecha.split('-').map(Number), mes=p[1]-1;
  var larga=p[2]+' de '+MESES[mes]+' de '+p[0];
  return {f:c.n,n:i+1,seg:c.seg,mes:p[0]+'-'+('0'+p[1]).slice(-2),mesNombre:MESES[mes][0].toUpperCase()+MESES[mes].slice(1),larga:larga,
    corta:p[2]+' '+MESES[mes].slice(0,3),
    titulo:c.titulo||('Clase '+(i+1)),
    desc:c.descripcion||('Clase grabada el '+larga+'.'),
    dur:Math.floor(c.seg/60)+':'+('0'+(c.seg%60)).slice(-2),
    col:COL[i%COL.length]};
});
var meses=[],vistos={};data.forEach(function(d){if(!vistos[d.mes]){vistos[d.mes]=1;meses.push({k:d.mes,n:d.mesNombre})}});
var filtro='all',lista=data.slice();

var ARR='<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var PLAY='<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="#202D4A" stroke="#202D4A" stroke-width="2" stroke-linejoin="round"/></svg>';
function deco(i){
  var f=['<circle cx="50" cy="50" r="34" fill="#fff" stroke="#202D4A" stroke-width="4"/>','<path d="M50 14 L88 82 H12 Z" fill="#fff" stroke="#202D4A" stroke-width="4" stroke-linejoin="round"/>','<rect x="16" y="16" width="68" height="68" rx="16" fill="#fff" stroke="#202D4A" stroke-width="4" transform="rotate(10 50 50)"/>','<path d="M50 10l12 27 29 3-22 19 7 29-26-15-26 15 7-29L9 40l29-3z" fill="#fff" stroke="#202D4A" stroke-width="4" stroke-linejoin="round"/>'];
  return '<svg class="ph" viewBox="0 0 100 100" aria-hidden="true">'+f[i%4]+'</svg>';
}
function poster(d){return '/mis-clases/posters/clase-'+d.f+'.jpg'}
function vid(d){return '/mis-clases/videos/clase-'+d.f+'.mp4'}

function cards(){
  lista=data.filter(function(d){return filtro==='all'||d.mes===filtro});
  $('#count').textContent=(lista.length===1?'Mostrando 1 clase':'Mostrando '+lista.length+' clases');
  $('#grid').innerHTML=lista.map(function(d,i){
    return '<button type="button" class="card" data-i="'+i+'" style="--t:'+d.col[0]+';--c:'+d.col[1]+';animation-delay:'+(i*55)+'ms" aria-label="Ver '+esc(d.titulo)+'">'+
      '<span class="th">'+deco(d.n)+'<img alt="" loading="lazy" decoding="async" width="540" height="960" data-src="'+poster(d)+'"><span class="num">Clase '+d.n+'</span><span class="dur">'+d.dur+'</span><span class="play">'+PLAY+'</span></span>'+
      '<span class="bd"><h3>'+esc(d.titulo)+'</h3><p>'+esc(d.desc)+'</p><span class="ver">Ver la clase '+ARR+'</span></span></button>';
  }).join('');
  lazy();
}
/* miniaturas con carga diferida; si Drive no entrega la imagen, queda la ilustración */
var io=null;
function lazy(){
  var imgs=document.querySelectorAll('#grid img[data-src]');
  function load(im){var s=im.getAttribute('data-src');im.removeAttribute('data-src');im.onload=function(){if(im.naturalWidth>40)im.classList.add('ok')};im.onerror=function(){im.remove()};im.src=s}
  if(!('IntersectionObserver' in window)){imgs.forEach(load);return}
  if(io)io.disconnect();
  io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);load(e.target)}})},{rootMargin:'200px'});
  imgs.forEach(function(im){io.observe(im)});
}

/* reproductor propio: el <video> solo se crea al abrir una clase */
var modal=$('#modal'),frame=$('#frame'),cur=-1,opener=null;
function abrir(i,from){
  cur=i;var d=lista[i];if(!d)return;
  if(from)opener=from;
  $('#m-t').textContent=d.titulo;$('#m-d').textContent=d.desc;$('#m-f').textContent='Duración: '+d.dur+' min';$('#m-n').textContent='Clase '+d.n+' de '+data.length;
  frame.innerHTML='';
  var v=document.createElement('video');v.controls=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='metadata';v.poster=poster(d);v.src=vid(d);v.setAttribute('controlslist','nodownload');v.setAttribute('aria-label',d.titulo);
  frame.appendChild(v);
  $('#prev').disabled=i<=0;$('#next').disabled=i>=lista.length-1;
  modal.classList.add('open');document.body.style.overflow='hidden';$('#cerrar').focus();
  var p=v.play();if(p&&p.catch)p.catch(function(){});
}
function cerrar(){
  var v=frame.querySelector('video');if(v){v.pause();v.removeAttribute('src');v.load()}
  modal.classList.remove('open');frame.innerHTML='';document.body.style.overflow='';
  if(opener)opener.focus();
}
document.addEventListener('click',function(e){
  var c=e.target.closest('.card');if(c){abrir(+c.dataset.i,c);return}
  var f=e.target.closest('[data-f]');if(f){filtro=f.dataset.f;cards();return}
  if(e.target.closest('#cerrar')||e.target===modal){cerrar();return}
  if(e.target.closest('#prev')&&cur>0){abrir(cur-1);return}
  if(e.target.closest('#next')&&cur<lista.length-1){abrir(cur+1);return}
});
document.addEventListener('keydown',function(e){
  if(!modal.classList.contains('open'))return;
  if(e.key==='Escape'){cerrar();return}
  if(e.key==='ArrowLeft'&&cur>0)abrir(cur-1);
  if(e.key==='ArrowRight'&&cur<lista.length-1)abrir(cur+1);
  if(e.key==='Tab'){
    var f=[].slice.call(modal.querySelectorAll('button:not([disabled]),video')),a=document.activeElement,i=f.indexOf(a);
    if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}
    else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}
  }
});
$('#n-total').textContent=data.length;
cards();
})();
