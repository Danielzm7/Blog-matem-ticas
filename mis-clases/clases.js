/* ============ DATOS EDITABLES ============
   Cada clase: id de Drive, fecha de grabación (AAAA-MM-DD) y, si quieres,
   titulo y descripcion propios. Si se dejan vacíos, se usa «Clase N» y la fecha. */
var CLASES = [
  {id:'1TzJDy3dST0O7wqtmmSrwM1vnDZnZxtrF', fecha:'2026-08-21', titulo:'', descripcion:''},
  {id:'1i4ebKrU_2sjdBS8IT_I5K7JJkMwHO6Jy', fecha:'2026-08-24', titulo:'', descripcion:''},
  {id:'1RIU9NixNmqfPH9qrAgthnUg8gDcfFGpS', fecha:'2026-08-24', titulo:'', descripcion:''},
  {id:'1Ki06k40Bm5oMtwLqAP6MxQaaDORA8_0u', fecha:'2026-08-29', titulo:'', descripcion:''},
  {id:'19k0d-KZtoSPlOP2bYbKQ0ZANgJ5Yr6Pr', fecha:'2026-08-29', titulo:'', descripcion:''},
  {id:'1JIG1BrA_8eyIwR0H1iXlc4IHeaVWtKHN', fecha:'2026-10-09', titulo:'', descripcion:''},
  {id:'1VJFdhc0ljIuBl1Kv286bgbDeOVzIa2Dx', fecha:'2026-10-09', titulo:'', descripcion:''},
  {id:'1YIYEWEbF4_iv2UmW8glm6bJ-twRMA1wg', fecha:'2026-10-17', titulo:'', descripcion:''},
  {id:'1Et9kM1d7HFOkrIJ6sPxqJJFbpvUg03z0', fecha:'2026-11-24', titulo:'', descripcion:''},
  {id:'1Zyx0wSvkU0LlUD7Gtr_88ObOdpOIABhK', fecha:'2026-11-24', titulo:'', descripcion:''}
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
  return {id:c.id,n:i+1,mes:p[0]+'-'+('0'+p[1]).slice(-2),mesNombre:MESES[mes][0].toUpperCase()+MESES[mes].slice(1),larga:larga,
    corta:p[2]+' '+MESES[mes].slice(0,3),
    titulo:c.titulo||('Clase '+(i+1)),
    desc:c.descripcion||('Clase grabada el '+larga+'.'),
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
function thumb(id){return 'https://drive.google.com/thumbnail?id='+id+'&sz=w640'}

function chips(){
  var h='<button type="button" class="chip t" data-f="all" aria-pressed="'+(filtro==='all')+'">Todas · '+data.length+'</button>';
  meses.forEach(function(m,i){
    var n=data.filter(function(d){return d.mes===m.k}).length,c=COL[(i+1)%COL.length];
    h+='<button type="button" class="chip" data-f="'+m.k+'" style="--c:'+c[1]+'" aria-pressed="'+(filtro===m.k)+'">'+m.n+' · '+n+'</button>';
  });
  $('#chips').innerHTML=h;
}
function cards(){
  lista=data.filter(function(d){return filtro==='all'||d.mes===filtro});
  $('#count').textContent=(lista.length===1?'Mostrando 1 clase':'Mostrando '+lista.length+' clases');
  $('#grid').innerHTML=lista.map(function(d,i){
    return '<button type="button" class="card" data-i="'+i+'" style="--t:'+d.col[0]+';--c:'+d.col[1]+';animation-delay:'+(i*55)+'ms" aria-label="Ver '+esc(d.titulo)+', '+esc(d.larga)+'">'+
      '<span class="th">'+deco(d.n)+'<img alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-src="'+thumb(d.id)+'"><span class="num">Clase '+d.n+'</span><span class="play">'+PLAY+'</span></span>'+
      '<span class="bd"><span class="meta"><span class="tag">'+esc(d.corta)+'</span><span class="tag">'+esc(d.mesNombre)+'</span></span><h3>'+esc(d.titulo)+'</h3><p>'+esc(d.desc)+'</p><span class="ver">Ver la clase '+ARR+'</span></span></button>';
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

/* reproductor: el iframe solo se crea al abrir una clase */
var modal=$('#modal'),frame=$('#frame'),cur=-1,opener=null;
function abrir(i,from){
  cur=i;var d=lista[i];if(!d)return;
  if(from)opener=from;
  $('#m-t').textContent=d.titulo;$('#m-d').textContent=d.desc+' · Clase '+d.n+' de '+data.length;
  frame.innerHTML='<iframe src="https://drive.google.com/file/d/'+d.id+'/preview" title="'+esc(d.titulo)+'" allow="autoplay; fullscreen" allowfullscreen loading="eager"></iframe>';
  $('#prev').disabled=i<=0;$('#next').disabled=i>=lista.length-1;
  modal.classList.add('open');document.body.style.overflow='hidden';$('#cerrar').focus();
}
function cerrar(){
  modal.classList.remove('open');frame.innerHTML='';document.body.style.overflow='';
  if(opener)opener.focus();
}
document.addEventListener('click',function(e){
  var c=e.target.closest('.card');if(c){abrir(+c.dataset.i,c);return}
  var f=e.target.closest('[data-f]');if(f){filtro=f.dataset.f;chips();cards();return}
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
    var f=[].slice.call(modal.querySelectorAll('button:not([disabled]),iframe')),a=document.activeElement,i=f.indexOf(a);
    if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}
    else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}
  }
});
$('#n-total').textContent=data.length;
$('#n-desde').textContent=data[0].mesNombre.toLowerCase()+' de '+data[0].mes.slice(0,4);
chips();cards();
})();
