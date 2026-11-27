/* ============================================================
   SITIO: funciones compartidas de Semillas de Conocimiento (matemáticas)
   - API de datos locales: perfiles, progreso, accesibilidad, códigos de actividad
   - En las páginas de juego: barra superior, botones Regresar/Inicio, pantalla completa,
     compartir, código de actividad, panel de accesibilidad, modo calma y registro del progreso
   Todo vive en el navegador (localStorage). No hay cuentas ni datos personales.
   Carga: <script src="/matematicas/js/i18n.js"> y luego este archivo, justo antes de </head>.
   ============================================================ */
(function () {
  'use strict';
  const W = window, D = document;

  /* ---------- almacenamiento seguro ---------- */
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  const t = (k, v) => {
    const I = W.SC_I18N || {}, s0 = (I[W.SC_LANG || 'es'] || {})[k] ?? (I.es || {})[k] ?? k; let s = s0;
    if (v) for (const x in v) s = s.replace('{' + x + '}', v[x]);
    return s;
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hoy = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const slugActual = () => { const m = location.pathname.match(/\/juegos\/([^/]+)/); return m ? m[1] : null; };

  /* ---------- accesibilidad (23-A) ---------- */
  const ACC_K = 'sc_acc';
  const acc = Object.assign({ calma: false, texto: 0, contraste: false, anim: false }, LS.get(ACC_K, {}));
  function aplicaAcc() {
    const h = D.documentElement;
    h.classList.toggle('acc-calma', !!acc.calma); h.classList.toggle('acc-contraste', !!acc.contraste); h.classList.toggle('acc-anim', !!acc.anim);
    h.setAttribute('data-acc-texto', String(acc.texto || 0));
  }
  aplicaAcc();
  /* "Reducir animaciones": los juegos consultan prefers-reduced-motion al cargar; aquí se responde que sí cuando está activada la opción */
  const mm = W.matchMedia.bind(W);
  W.matchMedia = function (q) {
    const r = mm(q);
    if (acc.anim && /prefers-reduced-motion:\s*reduce/.test(String(q))) return new Proxy(r, { get: (o, k) => k === 'matches' ? true : (typeof o[k] === 'function' ? o[k].bind(o) : o[k]) });
    return r;
  };

  /* ---------- progreso y perfiles (23-B) ---------- */
  const PK = 'sc_prog_v1';
  const leer = () => { const d = LS.get(PK, null); return d && d.perfiles ? d : { actual: null, perfiles: {} }; };
  const guardar = d => LS.set(PK, d);
  const nuevoId = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  function crearPerfil(nombre, avatar) {
    const d = leer(), id = nuevoId();
    d.perfiles[id] = { nombre: String(nombre || 'Jugador').trim().slice(0, 18) || 'Jugador', avatar: avatar || '🙂', creado: hoy(), juegos: {}, dias: [] };
    d.actual = id; guardar(d); return id;
  }
  function perfilActual(crear) {
    const d = leer();
    if (d.actual && d.perfiles[d.actual]) return { id: d.actual, p: d.perfiles[d.actual] };
    if (!crear) return null;
    const id = crearPerfil(t('invitado'), '🙂'); return { id, p: leer().perfiles[id] };
  }
  function registra(slug, ses) {
    const d = leer(); let id = d.actual;
    if (!id || !d.perfiles[id]) { id = nuevoId(); d.perfiles[id] = { nombre: t('invitado'), avatar: '🙂', creado: hoy(), juegos: {}, dias: [] }; d.actual = id; }
    const p = d.perfiles[id], j = p.juegos[slug] || (p.juegos[slug] = { n: 0, mejorPts: 0, mejorPct: null, ult: '', ses: [] });
    j.n++; j.ult = ses.f; if (ses.pts != null && ses.pts > j.mejorPts) j.mejorPts = ses.pts;
    if (ses.p != null && (j.mejorPct == null || ses.p > j.mejorPct)) j.mejorPct = ses.p;
    j.ses.push(ses); if (j.ses.length > 30) j.ses.shift();
    if (!p.dias.includes(ses.f)) { p.dias.push(ses.f); if (p.dias.length > 400) p.dias.shift(); }
    guardar(d);
  }
  /* porcentaje medio de aciertos de un juego */
  const pctMedio = j => { const v = (j.ses || []).filter(s => s.p != null).map(s => s.p); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
  const estrellas = j => !j || !j.n ? 0 : j.mejorPct == null ? 1 : j.mejorPct >= 95 ? 3 : j.mejorPct >= 80 ? 2 : j.mejorPct >= 60 ? 1 : 0;

  /* ---------- códigos de actividad (23-C) ---------- */
  const b64 = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unb64 = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
  /* act = {t: título, j: [[slug, nivel|null], ...]} */
  const codifica = act => b64(JSON.stringify(act));
  function decodifica(c) {
    try {
      c = String(c || '').trim(); const m = c.match(/[?&]act=([^&#\s]+)/); if (m) c = decodeURIComponent(m[1]);
      const a = JSON.parse(unb64(c));
      if (!a || !Array.isArray(a.j) || !a.j.length || a.j.length > 8) return null;
      a.j = a.j.filter(x => Array.isArray(x) && /^[a-z0-9-]+$/.test(x[0])).map(x => [x[0], x[1] == null ? null : (+x[1] | 0)]);
      a.t = String(a.t || 'Actividad').slice(0, 60); return a.j.length ? a : null;
    } catch (e) { return null; }
  }
  const enlaceActividad = (act, i) => location.origin + '/matematicas/juegos/' + act.j[i || 0][0] + '/?act=' + encodeURIComponent(codifica(act)) + '&i=' + (i || 0);

  W.SC = {
    LS, t, esc, hoy, acc, aplicaAcc, guardarAcc() { LS.set(ACC_K, acc); aplicaAcc(); },
    leer, guardar, crearPerfil, perfilActual, registra, pctMedio, estrellas, codifica, decodifica, enlaceActividad,
    ok() { cuenta.ok++; }, error() { cuenta.err++; }
  };
  const cuenta = { ok: 0, err: 0 };

  /* =====================  A PARTIR DE AQUÍ: solo páginas de juego  ===================== */
  const CSS = `
:root{--sc-h:128px;--sc-extra:0px;--W:min(100vw - 16px,(100dvh - var(--sc-h) - var(--sc-extra))*1.6)}
@media (max-width:700px) and (orientation:portrait){:root{--W:min(100vw - 16px,(100dvh - var(--sc-h) - var(--sc-extra))*.6)}}
:root:fullscreen{--sc-h:20px}
.volver{display:none!important}
#sc-bar,#sc-foot,#sc-act{width:var(--W);display:flex;align-items:center;gap:8px;font:700 14px/1.2 'Fredoka','Nunito',system-ui,sans-serif;color:#e8f0ff}
#sc-bar{justify-content:space-between;flex-wrap:nowrap;min-height:36px}
#sc-mig{display:flex;align-items:center;gap:6px;min-width:0;white-space:nowrap;overflow:hidden}
#sc-mig a{color:#cfe3fb;text-decoration:none;padding:6px 4px;border-radius:8px}#sc-mig a:hover{color:#fff;background:rgba(255,255,255,.12)}
#sc-mig b{overflow:hidden;text-overflow:ellipsis;color:#fff}#sc-mig span{opacity:.6}
#sc-btns{display:flex;gap:6px;flex-shrink:0}
#sc-bar button,#sc-bar a.scb,#sc-foot a,#sc-act button,#sc-act a{font:inherit;cursor:pointer;color:#fff;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.35);border-radius:99px;min-height:36px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;text-decoration:none}
#sc-bar button:hover,#sc-bar a.scb:hover,#sc-foot a:hover,#sc-act button:hover,#sc-act a:hover{background:rgba(255,255,255,.25)}
#sc-bar svg,#sc-foot svg{width:18px;height:18px;flex-shrink:0}
#sc-foot{justify-content:center;gap:16px;min-height:48px}
#sc-foot a{padding:0 16px 0 4px;min-height:48px;border-width:3px}
#sc-foot .circ{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;border:3px solid #fff}
#sc-foot a.reg .circ{background:#2A7DE1}#sc-foot a.ini .circ{background:#2FA65A}
#sc-act{justify-content:space-between;background:rgba(255,216,74,.18);border:2px solid #FFD84A;border-radius:12px;padding:4px 8px;min-height:30px}
#sc-act .sig{background:#FFD84A;color:#3A2A00;border-color:#FFD84A}
#sc-act .sig.listo{animation:scpulse 1s ease-in-out infinite}@keyframes scpulse{50%{transform:scale(1.06)}}
:root:fullscreen #sc-bar,:root:fullscreen #sc-foot,:root:fullscreen #sc-act{display:none}
#sc-salir{display:none;position:fixed;left:10px;top:10px;z-index:99;font:700 14px 'Fredoka',system-ui,sans-serif;background:rgba(0,0,0,.55);color:#fff;border:2px solid #fff;border-radius:99px;min-height:40px;padding:0 14px;cursor:pointer}
:root:fullscreen #sc-salir{display:inline-flex;align-items:center}
#sc-pan{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;background:rgba(10,6,30,.7);padding:12px}
#sc-pan.on{display:flex}
#sc-pan .caja{background:#fff;color:#1b2440;border-radius:18px;padding:18px 20px;max-width:440px;width:100%;box-shadow:0 12px 40px rgba(0,0,0,.5);font:600 16px/1.4 'Nunito','Fredoka',system-ui,sans-serif}
#sc-pan h2{margin:0 0 10px;font:800 22px 'Fredoka','Nunito',system-ui,sans-serif}
#sc-pan label{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid #e3e8f5;cursor:pointer}
#sc-pan input[type=checkbox]{width:24px;height:24px;flex-shrink:0;margin-top:2px}
#sc-pan small{display:block;color:#51608a;font-weight:600}
#sc-pan .txt{display:flex;gap:8px;flex-wrap:wrap;padding:8px 0;border-top:1px solid #e3e8f5;align-items:center}
#sc-pan .txt button{min-height:44px;padding:0 14px;border-radius:12px;border:2px solid #2A7DE1;background:#fff;color:#1b2440;font:800 15px inherit;cursor:pointer}
#sc-pan .txt button[aria-pressed=true]{background:#2A7DE1;color:#fff}
#sc-pan .cerrar{margin-top:10px;min-height:48px;width:100%;border:0;border-radius:12px;background:#1b2440;color:#fff;font:800 17px inherit;cursor:pointer}
#sc-pan .aviso{font-size:13px;color:#51608a;margin-top:8px}
#sc-toast{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:300;background:#1b2440;color:#fff;border:2px solid #fff;border-radius:99px;padding:8px 18px;font:700 15px 'Fredoka',system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .2s}
#sc-toast.on{opacity:1}
#sc-bar :focus-visible,#sc-foot :focus-visible,#sc-act :focus-visible,#sc-pan :focus-visible,#sc-salir:focus-visible{outline:3px solid #FFE066;outline-offset:2px}
@media (max-width:700px){#sc-mig{display:none}#sc-btns{width:100%;justify-content:center}#sc-btns .lb{display:none}#sc-bar button,#sc-bar a.scb{padding:0 12px}}
/* accesibilidad */
html.acc-anim *,html.acc-anim *::before,html.acc-anim *::after{animation-duration:.001s!important;animation-iteration-count:1!important;transition-duration:.001s!important;scroll-behavior:auto!important}
html.acc-contraste #stage{filter:contrast(1.28) saturate(1.1)}
html.acc-contraste #sc-bar button,html.acc-contraste #sc-bar a.scb,html.acc-contraste #sc-foot a,html.acc-contraste #sc-act button{background:#000;border-color:#fff}
html.acc-calma :is(#clock,#reloj,#tiempo,#vidas){display:none!important}
html[data-acc-texto="1"] #stage :is(#msg,#fb,#obj,.sub,#prog,.pill){zoom:1.15}
html[data-acc-texto="2"] #stage :is(#msg,#fb,#obj,.sub,#prog,.pill){zoom:1.3}
html[data-acc-texto="1"] :is(#sc-bar,#sc-foot,#sc-act){font-size:17px}html[data-acc-texto="2"] :is(#sc-bar,#sc-foot,#sc-act){font-size:20px}
`;
  const ICO = {
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4M8.6 13.4l6.8 4"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
    acc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="2"/><path d="M4 8h16M12 8v6M8 21l4-7 4 7"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 5l-7 7 7 7"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/></svg>'
  };
  let toastT;
  function aviso(msg) { let e = D.getElementById('sc-toast'); if (!e) { e = D.createElement('div'); e.id = 'sc-toast'; e.setAttribute('role', 'status'); D.body.appendChild(e); } e.textContent = msg; e.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('on'), 2400); }
  async function copia(txt) {
    try { await navigator.clipboard.writeText(txt); return true; } catch (e) { /* alternativa */ }
    try { const a = D.createElement('textarea'); a.value = txt; a.style.cssText = 'position:fixed;opacity:0'; D.body.appendChild(a); a.select(); const ok = D.execCommand('copy'); a.remove(); return ok; } catch (e) { return false; }
  }

  function iniciaJuego() {
    const slug = slugActual(), stage = D.getElementById('stage'), wrap = D.getElementById('wrap') || stage.parentNode;
    const titulo = (D.title || '').replace(/\s*[|·].*$/, '');
    const st = D.createElement('style'); st.textContent = CSS; D.head.appendChild(st);

    /* ----- actividad (código del docente) ----- */
    const sp = new URLSearchParams(location.search), act = decodifica(sp.get('act')), ai = Math.max(0, Math.min(act ? act.j.length - 1 : 0, +sp.get('i') || 0));

    /* ----- barra superior ----- */
    const bar = D.createElement('div'); bar.id = 'sc-bar'; bar.setAttribute('role', 'navigation'); bar.setAttribute('aria-label', 'Opciones del juego');
    const pf = perfilActual(false);
    bar.innerHTML = `<nav id="sc-mig" aria-label="Ruta"><a href="/">${esc(t('inicio'))}</a><span aria-hidden="true">›</span><a href="/matematicas/">${esc(t('matematicas'))}</a><span aria-hidden="true">›</span><b aria-current="page">${esc(titulo)}</b></nav>
      <div id="sc-btns"><button type="button" id="sc-fs" aria-label="${esc(t('pantallaCompleta'))}">${ICO.full}<span class="lb">${esc(t('pantallaCompleta'))}</span></button>
      <button type="button" id="sc-sh" aria-label="${esc(t('compartir'))}">${ICO.share}<span class="lb">${esc(t('compartir'))}</span></button>
      <button type="button" id="sc-co" aria-label="${esc(t('codigo'))}">${ICO.code}<span class="lb">${esc(t('codigo'))}</span></button>
      <button type="button" id="sc-ac" aria-label="${esc(t('accesibilidad'))}" aria-haspopup="dialog">${ICO.acc}<span class="lb">${esc(t('accesibilidad'))}</span></button>
      <a class="scb" id="sc-pf" href="/matematicas/perfil/" aria-label="${esc(t('perfil'))}: ${esc(pf ? pf.p.nombre : t('invitado'))}. ${esc(t('cambiarPerfil'))}"><span aria-hidden="true">${esc(pf ? pf.p.avatar : '🙂')}</span><span class="lb">${esc(pf ? pf.p.nombre : t('invitado'))}</span></a></div>`;
    wrap.insertBefore(bar, stage);
    if (act) {
      D.documentElement.classList.add('sc-act'); D.documentElement.style.setProperty('--sc-extra', '34px');
      const b = D.createElement('div'); b.id = 'sc-act'; b.setAttribute('role', 'status');
      const ultimo = ai >= act.j.length - 1;
      b.innerHTML = `<span><b>${esc(t('actividad'))}:</b> ${esc(act.t)} · ${esc(t('juegoDe', { i: ai + 1, n: act.j.length }))}</span>` +
        (ultimo ? `<a class="sig" href="/matematicas/perfil/">${esc(t('actividadLista'))}</a>` : `<button type="button" class="sig" id="sc-sig">${esc(t('siguienteJuego'))} →</button>`);
      wrap.insertBefore(b, stage);
      const bs = D.getElementById('sc-sig'); if (bs) bs.addEventListener('click', () => { location.href = enlaceActividad(act, ai + 1); });
      /* nivel indicado por el docente: se pulsa el botón de nivel correspondiente */
      const nivel = act.j[ai][1];
      if (nivel != null) setTimeout(() => { const bt = D.querySelectorAll('#niv .btn, #niv button')[nivel]; if (bt) bt.click(); }, 700);
    }
    /* ----- pie: Regresar e Inicio ----- */
    const foot = D.createElement('div'); foot.id = 'sc-foot'; foot.setAttribute('role', 'navigation'); foot.setAttribute('aria-label', 'Salir del juego');
    foot.innerHTML = `<a class="reg" href="/matematicas/#juegos" id="sc-reg"><span class="circ">${ICO.back}</span>${esc(t('regresar'))}</a><a class="ini" href="/"><span class="circ">${ICO.home}</span>${esc(t('inicio'))}</a>`;
    stage.insertAdjacentElement('afterend', foot);
    D.getElementById('sc-reg').addEventListener('click', e => { if (history.length > 1 && D.referrer && new URL(D.referrer).origin === location.origin && !act) { e.preventDefault(); history.back(); } });
    const salir = D.createElement('button'); salir.id = 'sc-salir'; salir.type = 'button'; salir.textContent = t('salirPantalla'); D.body.appendChild(salir);

    /* ----- pantalla completa ----- */
    const fsOn = () => !!(D.fullscreenElement || D.webkitFullscreenElement);
    function alterna() {
      try { if (fsOn()) (D.exitFullscreen || D.webkitExitFullscreen).call(D); else { const r = D.documentElement; (r.requestFullscreen || r.webkitRequestFullscreen).call(r); } } catch (e) { aviso('No se pudo abrir la pantalla completa'); }
    }
    D.getElementById('sc-fs').addEventListener('click', alterna); salir.addEventListener('click', alterna);
    if (!(D.documentElement.requestFullscreen || D.documentElement.webkitRequestFullscreen)) D.getElementById('sc-fs').style.display = 'none';

    /* ----- compartir enlace y código ----- */
    D.getElementById('sc-sh').addEventListener('click', async () => {
      const url = location.origin + location.pathname;
      if (navigator.share) { try { await navigator.share({ title: titulo, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      aviso((await copia(url)) ? t('copiado') : url);
    });
    D.getElementById('sc-co').addEventListener('click', async () => {
      const cod = codifica({ t: titulo, j: [[slug || '', null]] });
      aviso((await copia(cod)) ? t('copiadoCodigo') : cod);
    });

    /* ----- panel de accesibilidad ----- */
    const pan = D.createElement('div'); pan.id = 'sc-pan'; pan.setAttribute('role', 'dialog'); pan.setAttribute('aria-modal', 'true'); pan.setAttribute('aria-labelledby', 'sc-pan-t');
    const pintaPan = () => {
      pan.innerHTML = `<div class="caja"><h2 id="sc-pan-t">${esc(t('accesibilidad'))}</h2>
        <label><input type="checkbox" id="a-calma" ${acc.calma ? 'checked' : ''}><span>${esc(t('calma'))}<small>${esc(t('calmaAyuda'))}</small></span></label>
        <div class="txt" role="group" aria-label="${esc(t('texto'))}"><b>${esc(t('texto'))}:</b>${[['0', 'textoN'], ['1', 'textoG'], ['2', 'textoXG']].map(([v, k]) => `<button type="button" data-tx="${v}" aria-pressed="${String(acc.texto) === v}">${esc(t(k))}</button>`).join('')}</div>
        <label><input type="checkbox" id="a-con" ${acc.contraste ? 'checked' : ''}><span>${esc(t('contraste'))}</span></label>
        <label><input type="checkbox" id="a-anim" ${acc.anim ? 'checked' : ''}><span>${esc(t('anim'))}<small>Se aplica al abrir el juego de nuevo.</small></span></label>
        <p class="aviso">${esc(t('avisoDatos'))}</p><button type="button" class="cerrar" id="a-x">${esc(t('cerrar'))}</button></div>`;
    };
    D.body.appendChild(pan);
    const cierraPan = () => { pan.classList.remove('on'); D.getElementById('sc-ac').focus(); };
    pan.addEventListener('click', e => {
      if (e.target === pan || e.target.id === 'a-x') return cierraPan();
      const tx = e.target.closest('[data-tx]'); if (tx) { acc.texto = +tx.dataset.tx; W.SC.guardarAcc(); pintaPan(); const b = pan.querySelector('[data-tx="' + acc.texto + '"]'); if (b) b.focus(); }
    });
    pan.addEventListener('change', e => {
      if (e.target.id === 'a-calma') { acc.calma = e.target.checked; aplicaCalma(); aviso(acc.calma ? 'Modo calma activado: empieza una partida nueva' : 'Modo calma desactivado'); }
      if (e.target.id === 'a-con') acc.contraste = e.target.checked;
      if (e.target.id === 'a-anim') acc.anim = e.target.checked;
      W.SC.guardarAcc();
    });
    D.addEventListener('keydown', e => { if (e.key === 'Escape' && pan.classList.contains('on')) { e.stopPropagation(); cierraPan(); } }, true);
    D.getElementById('sc-ac').addEventListener('click', () => {
      try { if (typeof S !== 'undefined' && S.pantalla === 'juego' && !S.fin && S.pausas && !S.pausas.size && typeof pausar === 'function') pausar('panel'); } catch (e) { /* sin pausa */ }
      pintaPan(); pan.classList.add('on'); D.getElementById('a-x').focus();
    });

    /* ----- modo calma: sin cronómetro ni vidas (se aplica a la configuración del juego) ----- */
    const orig = {};
    function aplicaCalma() {
      if (typeof CFG === 'undefined' || !CFG) return;
      const numeros = ['SEG', 'SEG_PREG', 'VIDAS', 'BASE', 'FACTOR', 'SEG_RIVAL'];
      if (!orig.guardado) { numeros.forEach(k => { if (k in CFG) orig[k] = Array.isArray(CFG[k]) ? JSON.parse(JSON.stringify(CFG[k])) : CFG[k]; }); orig.guardado = true; }
      numeros.forEach(k => { if (k in orig) CFG[k] = Array.isArray(orig[k]) ? JSON.parse(JSON.stringify(orig[k])) : orig[k]; });
      if (!acc.calma) return;
      if ('SEG' in CFG && typeof CFG.SEG === 'number') CFG.SEG = CFG.SEG <= 30 ? 3600 : 600;   // por pregunta: sin límite · por ronda: 10 minutos
      if ('SEG_PREG' in CFG && typeof CFG.SEG_PREG === 'number') CFG.SEG_PREG = 0;
      if ('VIDAS' in CFG && typeof CFG.VIDAS === 'number') CFG.VIDAS = 99;
      if ('BASE' in CFG && 'FACTOR' in CFG) { CFG.BASE = 10; CFG.FACTOR = 0; }   // sin tiempo, cada acierto vale 10
      if (Array.isArray(CFG.SEG_RIVAL)) CFG.SEG_RIVAL = CFG.SEG_RIVAL.map(a => Array.isArray(a) ? a.map(x => x * 8) : a * 8);
    }
    aplicaCalma();

    /* ----- registro del progreso: cuenta aciertos y errores por los sonidos y guarda al terminar ----- */
    try {
      if (typeof Snd !== 'undefined' && Snd && typeof Snd.sfx === 'function') {
        const o = Snd.sfx; Snd.sfx = function (n) { if (n === 'acierto') cuenta.ok++; else if (n === 'error') cuenta.err++; return o.apply(this, arguments); };
      }
    } catch (e) { /* sin sonido */ }
    const fin = D.getElementById('fin'); let guardado = false;
    const reset = () => { cuenta.ok = 0; cuenta.err = 0; guardado = false; };
    if (fin) new MutationObserver(() => {
      if (fin.classList.contains('on')) {
        if (guardado) return; guardado = true;
        const txt = ['fA', 'fB', 'fC'].map(i => (D.getElementById(i) || {}).textContent || '');
        const tot = cuenta.ok + cuenta.err; let p = tot >= 3 ? Math.round(100 * cuenta.ok / tot) : null;
        if (p == null) { const m = txt.join(' ').match(/(\d{1,3})\s*%/); if (m) p = Math.min(100, +m[1]); }
        const mp = (txt[0] || '').match(/-?\d+/);
        registra(slug || 'juego', { f: hoy(), h: Date.now(), p, pts: mp ? +mp[0] : null, a: cuenta.ok, e: cuenta.err, calma: !!acc.calma });
        if (act) { const s = D.getElementById('sc-sig'); if (s) s.classList.add('listo'); }
      } else reset();
    }).observe(fin, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(() => { if (stage.classList.contains('mode-juego') && !fin.classList.contains('on')) reset(); }).observe(stage, { attributes: true, attributeFilter: ['class'] });
  }

  function listo() { if (D.getElementById('stage')) iniciaJuego(); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', listo); else listo();
})();
