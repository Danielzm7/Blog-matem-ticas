// Actividades de 8 años o más: doce juegos como configuración (datos + funciones de reto).
// La dificultad llega como d = 0..4 (Explorador: 0-2, Experto: 2-4). Las piezas compartidas viven en js/actividades-comun.js.
(function () {
  var h = window.ActividadesMotor.h;
  var C = window.ActividadesMotor.comun;
  var entre = C.entre, uno = C.uno, barajar = C.barajar, muestra = C.muestra;
  var boton = C.boton, elegir = C.elegir, fila = C.fila;
  var botonesNumero = C.botonesNumero, rellenarAlAcertar = C.rellenarAlAcertar;

  // ---------- Formato: miles con punto, decimales con coma ----------
  function miles(texto) { return texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function fmt(n) { return miles(String(Math.round(n))); }
  function fnum(x) {
    var t = String(Math.round(x * 1000) / 1000).split('.');
    return miles(t[0]) + (t[1] ? ',' + t[1] : '');
  }
  function pesos(n) { return '$ ' + fmt(n); }
  function mayus(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function dig4(texto) { return texto.replace(/\D/g, '').length >= 4; }
  // Clase del tamaño del texto de un botón: 4 o más cifras → 52px.
  function claseTam(texto, normal, chico) { return 't' + (dig4(texto) ? (chico || 52) : normal); }

  // Dos distractores distintos entre sí y de la respuesta; "relleno(i)" da más candidatos si faltan.
  function dos(resp, cands, valido, relleno) {
    var vistos = {}, otros = [];
    vistos[String(resp)] = 1;
    function probar(x) {
      var k = String(x);
      if (otros.length < 2 && !vistos[k] && valido(x)) { vistos[k] = 1; otros.push(x); }
    }
    barajar(cands).forEach(probar);
    for (var i = 1; otros.length < 2 && i < 400; i++) probar(relleno(i));
    return barajar([resp].concat(otros));
  }
  function salto(v, i) { return i % 2 ? v + (i + 1) / 2 : v - i / 2; }
  function tresNum(v, cands) {
    return dos(v, cands, function (x) { return x > 0; }, function (i) { return salto(v, i); });
  }
  // Botones numéricos con el formato de la página (miles con punto).
  function botonesN(esc, ctx, opciones, correcto, normal, formatoTexto, etiqueta) {
    return botonesNumero(esc, ctx, opciones, correcto, function (v) {
      var t = formatoTexto ? formatoTexto(v) : fmt(v);
      return { texto: t, label: etiqueta ? etiqueta(v) : t, clase: claseTam(t, normal || 78, 52) };
    });
  }

  // Caja con un número (como en 7 años) y operación completa con casilla «?».
  function operacion(a, signo, b, clase) {
    var grande = String(a).length > 3 || String(b).length > 3 || dig4(String(a)) || dig4(String(b));
    return C.operacion(String(a), signo, String(b), clase + (grande ? ' ac-suma--ng' : ''));
  }

  // ---------- 1. Tablas de multiplicar ----------
  var juego1 = {
    titulo: 'Tablas de multiplicar', emoji: '✖️', color: '#FFF3C9', tema: 'CÁLCULO', resumen: 'Multiplica y encuentra el resultado o el factor que falta.',
    practica: 'Multiplicación',
    consejo: 'Practiquen las tablas con ritmo: una palmada por cada número («3, 6, 9, 12...»). Si olvidan un resultado, búsquenlo sumando desde el anterior: 7 × 6 es 7 × 5 más 7.',
    crear: function (d) {
      var a, b;
      if (d === 0) { a = uno([2, 5, 10]); b = entre(1, 5); }
      else if (d === 1) { a = entre(2, 5); b = entre(2, 10); }
      else if (d === 2) { a = entre(2, 9); b = entre(2, 9); }
      else { a = entre(3, 12); b = entre(3, 12); }
      var P = a * b, falta = d === 4;
      return {
        instruccion: falta ? 'Encuentra el factor que falta.' : 'Multiplica y encuentra el resultado.', a: a, b: b, P: P, falta: falta,
        opciones: falta ? tresNum(b, [b - 1, b + 1, b - 2, b + 2]) : tresNum(P, [P + a, P - a, P + b, P - b, P + 1, P - 1, P + 10, P - 10]),
        firma: a + 'x' + b + (falta ? 'f' : '')
      };
    },
    montar: function (r, esc, ctx) {
      if (!r.falta) {
        var op = operacion(r.a, '×', r.b, 'ac-suma--8');
        esc.appendChild(op.el);
        rellenarAlAcertar(botonesN(esc, ctx, r.opciones, r.P), op.duda, r.P);
        return;
      }
      var q = h('span', { class: 'ac-sumando__num', text: '?', 'aria-label': 'Casilla vacía' });
      var hueco = h('div', { class: 'ac-sumando ac-sumando--solo ac-sumando--duda' }, [q]);
      var caja = h('div', { class: 'ac-sumando ac-sumando--solo', 'aria-label': String(r.a) }, [h('span', { class: 'ac-sumando__num', text: String(r.a), 'aria-hidden': 'true' })]);
      var prod = h('span', { class: 'ac-casilla ac-casilla--grande' }, [h('span', { class: 'ac-casilla__q', text: String(r.P) })]);
      esc.appendChild(fila('ac-suma ac-suma--6 ac-suma--8', [
        caja, h('span', { class: 'ac-signo ac-signo--mas', text: '×', 'aria-hidden': 'true' }), hueco,
        h('span', { class: 'ac-signo ac-signo--igual', text: '=', 'aria-hidden': 'true' }), prod
      ]));
      var lista = botonesN(esc, ctx, r.opciones, r.b);
      lista.forEach(function (o) {
        o.el.addEventListener('click', function () {
          if (!o.ok) return;
          hueco.classList.remove('ac-sumando--duda');
          q.textContent = String(r.b);
        });
      });
    }
  };

  // ---------- 2. Divisiones ----------
  var juego2 = {
    titulo: 'Divisiones', emoji: '➗', color: '#D9F5E9', tema: 'CÁLCULO', resumen: 'Reparte en partes iguales y halla el cociente.',
    practica: 'División exacta',
    consejo: 'Relacionen cada división con una multiplicación: «¿qué número por 6 da 42?». Pueden repartir fichas o galletas entre varios platos para verlo.',
    crear: function (d) {
      var dv, c;
      if (d === 0) { dv = uno([2, 5, 10]); c = entre(1, 5); }
      else if (d === 1) { dv = entre(2, 5); c = entre(2, 10); }
      else if (d === 2) { dv = entre(2, 9); c = entre(2, 9); }
      else if (d === 3) { dv = entre(3, 12); c = entre(3, 12); }
      else { dv = entre(3, 9); c = entre(11, 20); }
      var a = dv * c;
      return {
        instruccion: 'Divide y encuentra el cociente.', a: a, dv: dv, c: c,
        opciones: tresNum(c, [c - 1, c + 1, c - 2, c + 2, c - 10, c + 10]), firma: a + '/' + dv
      };
    },
    montar: function (r, esc, ctx) {
      var op = operacion(r.a, '÷', r.dv, 'ac-suma--8');
      esc.appendChild(op.el);
      rellenarAlAcertar(botonesN(esc, ctx, r.opciones, r.c), op.duda, r.c);
    }
  };

  // ---------- 3. Sumas y restas grandes ----------
  var LIMITE = [300, 600, 1000, 5000, 10000];
  var juego3 = {
    titulo: 'Sumas y restas grandes', emoji: '🚀', color: '#DDF1FD', tema: 'CÁLCULO', resumen: 'Suma y resta con centenas y millares.',
    practica: 'Suma y resta con números grandes',
    consejo: 'Alinen las unidades, las decenas y las centenas y resuelvan de derecha a izquierda. Antes de elegir, estimen: ¿el resultado debería ser más o menos que 1.000?',
    crear: function (d) {
      var L = LIMITE[d], min = L / 10, suma = Math.random() < .5, a, b, res;
      if (suma) {
        a = entre(min, L - min); b = entre(min, L - a); res = a + b;
      } else {
        a = entre(2 * min, L); b = entre(min, a - min); res = a - b;
      }
      var cands = [res - 1, res + 1, res - 10, res + 10, res - 100, res + 100];
      if (L >= 5000) cands.push(res - 1000, res + 1000);
      return {
        instruccion: suma ? 'Suma y encuentra el total.' : 'Resta y encuentra la diferencia.', a: a, b: b, suma: suma, res: res,
        opciones: tresNum(res, cands), firma: a + (suma ? '+' : '-') + b
      };
    },
    montar: function (r, esc, ctx) {
      var op = operacion(fmt(r.a), r.suma ? '+' : '−', fmt(r.b), 'ac-suma--7');
      esc.appendChild(op.el);
      var lista = botonesNumero(esc, ctx, r.opciones, r.res, function (v) {
        return { texto: fmt(v), label: fmt(v), clase: 't' + (r.opciones.some(function (x) { return x > 999; }) ? 52 : 70) };
      });
      rellenarAlAcertar(lista, op.duda, fmt(r.res));
    }
  };

  // ---------- 4. Valor de la cifra ----------
  function cifrasSinRepetir(len) {
    var ds;
    do { ds = barajar([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); } while (ds[0] === 0);
    return ds.slice(0, len);
  }
  var UNIDAD_REDONDEO = { 10: 'decena', 100: 'centena', 1000: 'millar' };
  var juego4 = {
    titulo: 'Valor de la cifra', emoji: '🏛️', color: '#FFE3DF', tema: 'NÚMEROS', resumen: 'Descubre cuánto vale cada cifra de un número.',
    practica: 'Valor posicional y aproximación',
    consejo: 'Usen una tabla de unidades, decenas, centenas y millares. Digan el número en voz alta separando sus partes: «tres mil ochocientos cuarenta y siete».',
    crear: function (d) {
      if (d === 2) {
        var ds = [entre(1, 9), entre(1, 9), entre(1, 9)], n = ds[0] * 100 + ds[1] * 10 + ds[2];
        var partes = [ds[0] * 100, ds[1] * 10, ds[2]], falta = entre(0, 2), resp = partes[falta];
        var cands = [];
        for (var p = 0; p < 3; p++) if (p !== falta) cands.push(ds[falta] * Math.pow(10, 2 - p));
        cands.push(ds[falta] * Math.pow(10, 2 - falta) * 10);
        return {
          tipo: 'desc', instruccion: 'Completa la descomposición de ' + n + '.', n: n, partes: partes, falta: falta, resp: resp,
          opciones: dos(resp, cands, function (x) { return x > 0; }, function (i) { return resp + i; }), firma: 'd' + n + falta
        };
      }
      if (d === 4) {
        var u = uno([10, 100, 1000]), v, medio = u / 2;
        do { v = entre(1001, 9990); } while (v % u === medio);
        var abajo = Math.floor(v / u) * u, arriba = abajo + u, resp2 = v - abajo < medio ? abajo : arriba;
        var otro = resp2 === abajo ? arriba : abajo;
        return {
          tipo: 'aprox', instruccion: 'Aproxima ' + fmt(v) + (u === 1000 ? ' al millar más cercano.' : ' a la ' + UNIDAD_REDONDEO[u] + ' más cercana.'), n: v, resp: resp2,
          opciones: dos(resp2, [otro, resp2 + 2 * u, resp2 - 2 * u, resp2 * 10], function (x) { return x > 0; }, function (i) { return resp2 + i * u; }), firma: 'a' + v
        };
      }
      var len = d === 0 ? 3 : (d === 1 ? 4 : 5);
      var cs = cifrasSinRepetir(len), pos;
      do { pos = entre(0, len - 1); } while (cs[pos] === 0);
      var num = +cs.join(''), vr = cs[pos] * Math.pow(10, len - 1 - pos), cd = [];
      for (var q = 0; q < len; q++) if (q !== pos) cd.push(cs[pos] * Math.pow(10, len - 1 - q));
      return {
        tipo: 'cifra', instruccion: '¿Qué valor tiene el ' + cs[pos] + ' en ' + fmt(num) + '?', n: num, cs: cs, pos: pos, resp: vr,
        opciones: dos(vr, cd, function (x) { return x > 0; }, function (i) { return vr + i; }), firma: 'c' + num + pos
      };
    },
    montar: function (r, esc, ctx) {
      var franja = h('div', { class: 'ac-cifras' });
      if (r.tipo === 'desc') {
        franja.setAttribute('role', 'img');
        franja.setAttribute('aria-label', 'Descomposición de ' + r.n + ' con una parte que falta');
        var hueco = null;
        r.partes.forEach(function (v, i) {
          if (i) franja.appendChild(h('span', { class: 'ac-cifras__signo', text: '+', 'aria-hidden': 'true' }));
          if (i === r.falta) {
            hueco = h('span', { class: 'ac-casilla ac-casilla--duda ac-casilla--parte' }, [h('span', { class: 'ac-casilla__q', text: '?' })]);
            franja.appendChild(hueco);
          } else franja.appendChild(h('span', { class: 'ac-cifras__parte', text: String(v) }));
        });
        esc.appendChild(franja);
        rellenarAlAcertar(botonesN(esc, ctx, r.opciones, r.resp, 64), hueco, String(r.resp));
        return;
      }
      var texto = fmt(r.n), k = -1;
      franja.setAttribute('role', 'img');
      franja.setAttribute('aria-label', 'Número ' + texto);
      for (var i = 0; i < texto.length; i++) {
        if (texto[i] === '.') { franja.appendChild(h('span', { class: 'ac-cifras__punto', text: '.', 'aria-hidden': 'true' })); continue; }
        k++;
        franja.appendChild(h('span', { class: 'ac-cifra' + (r.tipo === 'cifra' && k === r.pos ? ' ac-cifra--ref' : ''), text: texto[i], 'aria-hidden': 'true' }));
      }
      if (r.tipo === 'aprox') {
        var dudaA = h('span', { class: 'ac-casilla ac-casilla--duda ac-casilla--parte' }, [h('span', { class: 'ac-casilla__q', text: '≈ ?' })]);
        franja.appendChild(dudaA);
        esc.appendChild(franja);
        rellenarAlAcertar(botonesN(esc, ctx, r.opciones, r.resp, 64), dudaA, '≈ ' + fmt(r.resp));
        return;
      }
      esc.appendChild(franja);
      botonesN(esc, ctx, r.opciones, r.resp, 64);
    }
  };

  // ---------- 5. Fracciones ----------
  function pastel(k, q, clase) {
    var s = h('span', { class: 'ac-pastel ' + (clase || ''), 'aria-hidden': 'true' });
    s.style.background = 'repeating-conic-gradient(from -1deg, #1F2A44 0deg 2deg, transparent 2deg ' + (360 / q) + 'deg), conic-gradient(#FF7A6B 0deg ' + (k * 360 / q) + 'deg, #fff ' + (k * 360 / q) + 'deg)';
    s.setAttribute('data-k', k); s.setAttribute('data-q', q);
    return s;
  }
  function frac(n, d) { return n + '/' + d; }
  function parteDe(t) { var p = t.split('/'); return { n: +p[0], d: +p[1] }; }
  var DENOM = [[2, 4], [2, 3, 4, 6], [3, 4, 5, 6, 8, 10]];
  var juego5 = {
    titulo: 'Fracciones', emoji: '🍕', color: '#FFF3C9', tema: 'NÚMEROS', resumen: 'Nombra, compara y reconoce fracciones iguales.',
    practica: 'Fracciones y equivalencia',
    consejo: 'Partan una pizza, una barra de chocolate o un papel en partes iguales. Comparen: ¿qué es más grande, un cuarto o un tercio? Doblen papeles para ver que 1/2 es igual a 2/4.',
    crear: function (d) {
      if (d === 3) {
        var lista, valores;
        do {
          lista = [];
          for (var i = 0; i < 3; i++) { var q = uno([2, 3, 4, 5, 6, 8]); lista.push({ k: entre(1, q - 1), q: q }); }
          valores = lista.map(function (f) { return f.k / f.q; });
        } while (valores.some(function (v, i) { return valores.some(function (w, j) { return i !== j && Math.abs(v - w) < 1e-9; }); }));
        var gana = 0;
        valores.forEach(function (v, i) { if (v > valores[gana]) gana = i; });
        return { tipo: 'mayor', instruccion: '¿Qué círculo tiene pintada la mayor parte?', lista: lista, gana: gana, firma: lista.map(function (f) { return f.k + '/' + f.q; }).join(',') };
      }
      if (d === 4) {
        var base = uno([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]]), m = uno([2, 3, 4]);
        var k = base[0], q2 = base[1], resp = frac(k * m, q2 * m);
        var eq = function (t) { var f = parteDe(t); return f.n * q2 === k * f.d; };
        var cands = [frac(k * m + 1, q2 * m), frac(k * m - 1, q2 * m), frac(k, q2 * m), frac(k * m, q2 * m + 1), frac(q2 * m - k, q2 * m), frac(k + 1, q2 * m), frac(k * m + 2, q2 * m + 1)];
        return {
          tipo: 'equiv', instruccion: '¿Qué fracción vale lo mismo que ' + frac(k, q2) + '?', k: k, q: q2, resp: resp,
          opciones: dos(resp, cands, function (t) { var f = parteDe(t); return f.n >= 1 && f.n < f.d && !eq(t); }, function (i) { return frac(k * m + i, q2 * m + i + 1); }),
          firma: 'e' + resp
        };
      }
      var den = uno(DENOM[d]), kk = entre(1, den - 1), r = frac(kk, den);
      var eq2 = function (t) { var f = parteDe(t); return f.n * den === kk * f.d; };
      var cs = [frac(den - kk, den), frac(kk, den + 1), frac(kk + 1, den), frac(kk, den + 2), frac(kk - 1, den)];
      return {
        tipo: 'nombra', instruccion: '¿Qué fracción del círculo está pintada?', k: kk, q: den, resp: r,
        opciones: dos(r, cs, function (t) { var f = parteDe(t); return f.n >= 1 && f.n < f.d && !eq2(t); }, function (i) { return frac(kk, den + 2 + i); }),
        firma: 'n' + r
      };
    },
    montar: function (r, esc, ctx) {
      if (r.tipo === 'mayor') {
        var lista = r.lista.map(function (f, i) {
          var etq = 'círculo con ' + f.k + ' de ' + f.q + ' partes pintadas';
          return { el: boton('ac-opt ac-opt--circ ac-opt--pastel', etq, [pastel(f.k, f.q, 'ac-pastel--boton')]), ok: i === r.gana };
        });
        esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
        elegir(ctx, lista);
        return;
      }
      esc.appendChild(h('div', { class: 'ac-modelo ac-modelo--pastel', role: 'img', 'aria-label': 'Círculo con ' + r.k + ' de ' + r.q + ' partes pintadas' }, [pastel(r.k, r.q, 'ac-pastel--grande')]));
      botonesNumero(esc, ctx, r.opciones, r.resp, function (v) {
        var f = parteDe(v);
        return { texto: v, label: f.n + ' de ' + f.d, clase: 't56' };
      });
    }
  };

  // ---------- 6. Secuencias ----------
  function serie(d) {
    var s, p, i, seq = [];
    if (d === 0) { s = entre(1, 10); p = entre(2, 5); for (i = 0; i < 5; i++) seq.push(s + p * i); }
    else if (d === 1) {
      if (Math.random() < .5) { s = entre(1, 20); p = entre(6, 16); for (i = 0; i < 5; i++) seq.push(s + p * i); }
      else { p = entre(3, 12); for (i = 0; i < 5; i++) seq.push(60 - p * i); }
    } else if (d === 2) {
      if (Math.random() < .5) { s = entre(1, 6); for (i = 0; i < 5; i++) seq.push(s * Math.pow(2, i)); }
      else { s = entre(1, 30); p = entre(10, 19); for (i = 0; i < 5; i++) seq.push(s + p * i); }
    } else if (d === 3) {
      s = entre(1, 10); p = entre(2, 5); seq.push(s);
      for (i = 0; i < 4; i++) seq.push(seq[i] + p + i);
    } else if (Math.random() < .5) { s = uno([1, 2]); for (i = 0; i < 5; i++) seq.push(s * Math.pow(3, i)); }
    else { s = entre(1, 5); for (i = 0; i < 5; i++) seq.push((s + i) * (s + i)); }
    return seq;
  }
  var juego6 = {
    titulo: 'Secuencias', emoji: '🌀', color: '#ECE7FD', tema: 'NÚMEROS', resumen: 'Descubre la regla y completa la fila.',
    practica: 'Patrones numéricos',
    consejo: 'Pregunten «¿qué hay que hacer para pasar de un número al siguiente?». Prueben a sumar, restar, duplicar o ver si la diferencia va creciendo.',
    crear: function (d) {
      var seq = serie(d), idx = entre(1, 3), resp = seq[idx], paso = Math.abs(seq[idx] - seq[idx - 1]);
      var cands = [resp - 1, resp + 1, resp - 2, resp + 2, resp - paso, resp + paso];
      return {
        instruccion: 'Descubre la regla. ¿Qué número falta?', seq: seq, idx: idx, resp: resp,
        opciones: dos(resp, cands, function (x) { return x > 0 && seq.indexOf(x) < 0; }, function (i) { return resp + i * 3; }), firma: seq.join(',') + idx
      };
    },
    montar: function (r, esc, ctx) {
      var duda = C.interrogante('ac-casilla--serie');
      var casillas = r.seq.map(function (v, i) {
        return i === r.idx ? duda : h('span', { class: 'ac-casilla ac-casilla--serie', 'aria-label': String(v) }, [h('span', { class: 'ac-casilla__q', text: String(v), 'aria-hidden': 'true' })]);
      });
      esc.appendChild(fila('ac-serie', casillas));
      rellenarAlAcertar(botonesN(esc, ctx, r.opciones, r.resp), duda, r.resp);
    }
  };

  // ---------- 7. Compras y vueltos ----------
  var COMPRAS = ['🧢', '👟', '📘', '🧃', '🎒', '🍫', '⚽', '🎨'];
  var PRECIOS_DESC = [20000, 24000, 32000, 40000, 48000, 60000, 80000];
  var juego7 = {
    titulo: 'Compras y vueltos', emoji: '💵', color: '#D9F5E9', tema: 'MEDIDAS', resumen: 'Calcula cuánto te devuelven o cuánto pagas.',
    practica: 'Dinero y porcentajes',
    consejo: 'Jueguen a la tienda con billetes de cartón y precios reales. Para los descuentos: el 50% es la mitad, el 25% es la mitad de la mitad y el 10% se saca moviendo la coma.',
    crear: function (d) {
      var emojis = barajar(COMPRAS), cands, resp;
      if (d === 4) {
        var precio = uno(PRECIOS_DESC), pct = uno([10, 25, 50]);
        resp = precio * (100 - pct) / 100;
        var desc = precio - resp;
        cands = [desc, resp - 1000, resp + 1000, resp - 2000, resp + 2000, resp - 5000, resp + 5000];
        return {
          instruccion: '¿Cuánto pagas con el descuento?', tipo: 'desc', precios: [precio], pct: pct, emojis: emojis, resp: resp,
          opciones: tresNum(resp, cands), firma: precio + '|' + pct
        };
      }
      var precios, billete;
      if (d === 0) { billete = 1000; precios = [100 * entre(1, 9)]; }
      else if (d === 1) { billete = 5000; precios = [500 * entre(1, 9)]; }
      else if (d === 2) { billete = 10000; precios = [100 * entre(10, 99)]; }
      else {
        billete = uno([10000, 20000, 50000]);
        var tope = Math.floor(billete * .45 / 500);
        do { precios = [500 * entre(2, tope), 500 * entre(2, tope)]; } while (precios[0] + precios[1] > billete - 500);
      }
      resp = billete - precios.reduce(function (a, c) { return a + c; }, 0);
      cands = [resp - 100, resp + 100, resp - 200, resp + 200, resp - 500, resp + 500, resp - 1000, resp + 1000];
      return {
        instruccion: precios.length > 1 ? '¿Cuánto te devuelven por las dos compras?' : '¿Cuánto te devuelven?', tipo: 'vuelto', precios: precios,
        billete: billete, emojis: emojis, resp: resp, opciones: tresNum(resp, cands), firma: precios.join('+') + '|' + billete
      };
    },
    montar: function (r, esc, ctx) {
      var piezas = r.precios.map(function (p, i) {
        var hijos = [h('span', { class: 'ac-etiqueta__emoji', text: r.emojis[i], 'aria-hidden': 'true' }), h('span', { class: 'ac-etiqueta__precio', text: pesos(p), 'aria-hidden': 'true' })];
        if (r.tipo === 'desc') hijos.push(h('span', { class: 'ac-etiqueta__desc', text: '−' + r.pct + '%', 'aria-hidden': 'true' }));
        return h('div', { class: 'ac-etiqueta' }, hijos);
      });
      if (r.tipo === 'vuelto') {
        piezas.push(h('div', { class: 'ac-billete', 'aria-hidden': 'true' }, [h('span', { class: 'ac-mono', text: 'Pagas con' }), h('span', { class: 'ac-billete__valor', text: pesos(r.billete) })]));
      }
      var etq = r.tipo === 'desc' ? 'Un producto de ' + pesos(r.precios[0]) + ' con ' + r.pct + '% de descuento'
        : 'Compras de ' + r.precios.map(pesos).join(' y ') + ', pagas con ' + pesos(r.billete);
      esc.appendChild(h('div', { class: 'ac-compra', role: 'img', 'aria-label': etq }, piezas));
      botonesNumero(esc, ctx, r.opciones, r.resp, function (v) {
        return { texto: pesos(v), label: pesos(v) + ' pesos', clase: 't44' };
      });
    }
  };

  // ---------- 8. ¿Cuánto tiempo pasa? ----------
  function p2(m) { return m < 10 ? '0' + m : String(m); }
  function hm(t, ampm) {
    var h24 = Math.floor(t / 60) % 24, m = t % 60, h12 = h24 % 12 || 12;
    return h12 + ':' + p2(m) + (ampm ? (h24 < 12 ? ' a. m.' : ' p. m.') : '');
  }
  function durTexto(m) {
    if (m < 60) return m + ' min';
    if (m % 60 === 0) return m / 60 === 1 ? '1 hora' : (m / 60) + ' horas';
    return Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
  }
  var juego8 = {
    titulo: '¿Cuánto tiempo pasa?', emoji: '⏱️', color: '#DDF1FD', tema: 'MEDIDAS', resumen: 'Calcula la hora final o cuánto dura algo.',
    practica: 'Tiempo transcurrido',
    consejo: 'Usen un reloj real o una recta del tiempo. Avancen primero hasta la hora en punto y luego sumen los minutos que faltan: de 3:45 a 5:10 son 15 min + 1 h + 10 min.',
    crear: function (d) {
      var ini, dur, ampm = d === 4;
      if (d === 0) { ini = entre(1, 12) * 60; dur = 60 * entre(1, 3); }
      else if (d === 1) { ini = entre(1, 12) * 60 + uno([0, 30]); dur = uno([30, 60, 90]); }
      else if (d === 2) { ini = entre(1, 12) * 60 + uno([0, 15, 30, 45]); dur = uno([15, 30, 45, 60, 75]); }
      else if (d === 3) { ini = entre(1, 12) * 60 + 5 * entre(0, 11); dur = 5 * entre(4, 35); }
      else { ini = entre(6, 10) * 60 + 15 * entre(0, 3) + uno([0, 720]); dur = 15 * entre(8, 24); }
      var fin = ini + dur, M = ampm ? 1440 : 720, norm = function (x) { return ((x % M) + M) % M; };
      var r = { d: d, ini: ini, dur: dur, fin: fin, ampm: ampm, firma: ini + '|' + dur };
      if (d <= 2) {
        r.instruccion = '¿A qué hora termina?';
        var resp = norm(fin);
        r.resp = resp;
        r.opciones = dos(resp, [15, -15, 30, -30, 60, -60].map(function (x) { return norm(fin + x); }), function () { return true; }, function (i) { return norm(fin + 15 * i); });
      } else {
        r.instruccion = '¿Cuánto tiempo pasa entre las dos horas?';
        r.resp = dur;
        r.opciones = dos(dur, [10, -10, 15, -15, 30, -30, 60, -60].map(function (x) { return dur + x; }), function (x) { return x > 0; }, function (i) { return dur + 5 * i; });
      }
      return r;
    },
    montar: function (r, esc, ctx) {
      var pregunta = r.d <= 2 ? 'fin' : 'dur';
      var cajas = {};
      function caja(clave, titulo, texto, clase) {
        var q = clave === pregunta;
        var valor = h('span', { class: 'ac-caja-t__valor', text: q ? '?' : texto });
        var el = h('div', { class: 'ac-caja-t ' + clase + (q ? ' ac-caja-t--duda' : ''), role: 'group', 'aria-label': titulo + ': ' + (q ? 'casilla vacía' : texto) }, [
          h('span', { class: 'ac-mono', text: titulo, 'aria-hidden': 'true' }), valor
        ]);
        cajas[clave] = { el: el, valor: valor };
        return el;
      }
      var resp = r.resp;
      var textoResp = r.d <= 2 ? hm(resp, r.ampm) : durTexto(resp);
      esc.appendChild(fila('ac-tiempo', [
        caja('ini', 'Empieza', hm(r.ini, r.ampm), 'ac-caja-t--ini'),
        caja('dur', 'Dura', durTexto(r.dur), 'ac-caja-t--dur'),
        caja('fin', 'Termina', hm(r.fin, r.ampm), 'ac-caja-t--fin')
      ]));
      var lista = botonesNumero(esc, ctx, r.opciones, resp, function (v) {
        var t = r.d <= 2 ? hm(v, r.ampm) : durTexto(v);
        return { texto: t, label: r.d <= 2 ? 'las ' + t : t, clase: r.d <= 2 ? 't54' : 't40' };
      });
      lista.forEach(function (o) {
        o.el.addEventListener('click', function () {
          if (!o.ok) return;
          var c = cajas[pregunta];
          c.el.classList.remove('ac-caja-t--duda');
          c.valor.textContent = textoResp;
        });
      });
    }
  };

  // ---------- 9. Unidades de medida ----------
  var NOMBRE_U = { m: 'metros', cm: 'centímetros', mm: 'milímetros', km: 'kilómetros', kg: 'kilogramos', g: 'gramos', L: 'litros', mL: 'mililitros' };
  var LISTA_MIL = [150, 250, 350, 500, 1500, 2000, 3000];
  var LISTA_CM = [150, 250, 350, 450, 500, 200, 300];
  var LARGOS = [150, 180, 200, 210, 240, 250, 260, 300, 320, 350];
  var juego9 = {
    titulo: 'Unidades de medida', emoji: '🧪', color: '#FFE3DF', tema: 'MEDIDAS', resumen: 'Convierte metros, gramos, litros y más.',
    practica: 'Conversión de unidades',
    consejo: 'Busquen etiquetas en casa (un jugo de 1 L, un paquete de 500 g) y pregunten cuántos mililitros o gramos son. Recuerden: «kilo» es mil, «centi» es cien y «mili» es mil partes.',
    crear: function (d) {
      if (d === 4) {
        var cms = muestra(LARGOS, 3), us = barajar(['m', 'cm', 'mm']);
        var textos = cms.map(function (c, i) {
          var u = us[i], v = u === 'm' ? c / 100 : (u === 'cm' ? c : c * 10);
          return { c: c, u: u, texto: fnum(v) + ' ' + u, label: fnum(v) + ' ' + NOMBRE_U[u] };
        });
        var mayor = textos.reduce(function (a, t) { return t.c > a.c ? t : a; }, textos[0]);
        return { tipo: 'larga', instruccion: '¿Cuál es la longitud más larga?', textos: textos, resp: mayor.texto, firma: textos.map(function (t) { return t.texto; }).join('|') };
      }
      var de, a, f, v, resp;
      if (d === 0) { de = 'm'; a = 'cm'; f = 100; v = entre(1, 9); resp = v * f; }
      else if (d === 1) { var par = uno([['kg', 'g'], ['L', 'mL']]); de = par[0]; a = par[1]; f = 1000; v = entre(1, 9); resp = v * f; }
      else if (d === 2) { var t = uno([['km', 'm', 1000], ['cm', 'mm', 10], ['m', 'cm', 100]]); de = t[0]; a = t[1]; f = t[2]; v = entre(2, 9); resp = v * f; }
      else {
        var t3 = uno([['g', 'kg', 1000, LISTA_MIL], ['cm', 'm', 100, LISTA_CM], ['mL', 'L', 1000, LISTA_MIL]]);
        de = t3[0]; a = t3[1]; f = t3[2]; v = uno(t3[3]); resp = v / f;
      }
      var cands = [resp * 10, resp / 10, resp * 100, resp / 100];
      if (d === 3) cands.push(resp + .5, resp - .5);
      var clave = function (x) { return String(Math.round(x * 1000) / 1000); };
      var valido = function (x) { return x > 0 && clave(x) !== clave(resp); };
      var opciones = dos(clave(resp), cands.map(clave), function (x) { return valido(+x); }, function (i) { return clave(resp * (i + 1) * 3); });
      return { tipo: 'conv', instruccion: 'Convierte a la otra unidad.', de: de, a: a, v: v, resp: clave(resp), opciones: opciones, firma: v + de + a };
    },
    montar: function (r, esc, ctx) {
      if (r.tipo === 'larga') {
        esc.appendChild(h('div', { class: 'ac-leyenda' }, [h('span', { class: 'ac-mono', text: 'Busca la medida más grande' })]));
        var lista = r.textos.map(function (t) {
          return { el: boton('ac-opt', t.label, [h('span', { class: 'ac-opt__num ac-opt__num--t44', text: t.texto, 'aria-hidden': 'true' })]), ok: t.texto === r.resp };
        });
        esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
        elegir(ctx, lista);
        return;
      }
      var duda = C.interrogante('ac-casilla--conv');
      esc.appendChild(fila('ac-conversion', [
        h('div', { class: 'ac-ficha-u ac-ficha-u--de', 'aria-label': fnum(r.v) + ' ' + NOMBRE_U[r.de] }, [h('span', { text: fnum(r.v) + ' ' + r.de, 'aria-hidden': 'true' })]),
        h('span', { class: 'ac-signo ac-signo--igual', text: '=', 'aria-hidden': 'true' }),
        duda,
        h('div', { class: 'ac-ficha-u ac-ficha-u--a', 'aria-label': NOMBRE_U[r.a] }, [h('span', { text: r.a, 'aria-hidden': 'true' })])
      ]));
      var lista2 = botonesNumero(esc, ctx, r.opciones, r.resp, function (v) {
        var t = fnum(+v);
        return { texto: t, label: t + ' ' + NOMBRE_U[r.a], clase: 't56' };
      });
      rellenarAlAcertar(lista2, duda, fnum(+r.resp));
    }
  };

  // ---------- 10. Perímetro y área ----------
  var juego10 = {
    titulo: 'Perímetro y área', emoji: '🟦', color: '#FFF3C9', tema: 'GEOMETRÍA', resumen: 'Mide el contorno y cuenta los cuadritos.',
    practica: 'Perímetro y área',
    consejo: 'Dibujen figuras en papel cuadriculado. El perímetro es caminar por el borde; el área es llenar el interior de cuadritos. Comparen figuras con el mismo perímetro y distinto área.',
    crear: function (d) {
      var w, hh, tipo, resp, cands, cw = 0, ch = 0;
      if (d === 0) { tipo = 'per'; w = entre(2, 6); hh = entre(2, 4); }
      else if (d === 1) { tipo = 'area'; w = entre(3, 6); hh = entre(2, 5); }
      else if (d === 2) { tipo = 'per'; w = entre(5, 10); hh = entre(3, 8); }
      else if (d === 3) { tipo = 'area'; w = entre(6, 12); hh = entre(4, 8); }
      else { tipo = 'ele'; w = entre(6, 10); hh = entre(5, 8); cw = entre(2, w - 3); ch = entre(2, hh - 3); }
      var per = 2 * (w + hh);
      if (tipo === 'per') { resp = per; cands = [per + 2, per - 2, per + 4, per - 4, w * hh, w + hh]; }
      else {
        resp = w * hh - cw * ch;
        cands = [resp + w, resp - w, resp + hh, resp - hh, per, resp + 2, resp - 2];
        if (tipo === 'ele') cands.push(w * hh);
      }
      return {
        instruccion: tipo === 'per' ? '¿Cuánto mide el perímetro (todo el contorno)?' : (tipo === 'area' ? '¿Cuál es el área? ¿Cuántos cuadritos cubre?' : '¿Cuál es el área de la figura? Cuenta los cuadritos.'),
        tipo: tipo, w: w, h: hh, cw: cw, ch: ch, resp: resp, opciones: tresNum(resp, cands), firma: tipo + w + 'x' + hh + '-' + cw + 'x' + ch
      };
    },
    montar: function (r, esc, ctx) {
      var rej = h('div', { class: 'ac-rejilla' });
      rej.style.setProperty('--w', r.w);
      rej.style.setProperty('--n', r.h);
      for (var y = 0; y < r.h; y++) {
        for (var x = 0; x < r.w; x++) {
          var fuera = r.tipo === 'ele' && x >= r.w - r.cw && y < r.ch;
          rej.appendChild(h('i', { class: 'ac-cuadrito' + (fuera ? ' ac-cuadrito--fuera' : '') }));
        }
      }
      var etq = r.tipo === 'ele'
        ? 'Figura en L: rectángulo de ' + r.w + ' cm por ' + r.h + ' cm sin una esquina de ' + r.cw + ' cm por ' + r.ch + ' cm'
        : 'Rectángulo de ' + r.w + ' cm por ' + r.h + ' cm';
      esc.appendChild(h('div', { class: 'ac-medidas', role: 'img', 'aria-label': etq }, [
        h('span', { class: 'ac-medidas__ancho ac-mono', text: r.w + ' cm', 'aria-hidden': 'true' }),
        h('span', { class: 'ac-medidas__alto ac-mono', text: r.h + ' cm', 'aria-hidden': 'true' }),
        h('div', { class: 'ac-marco', 'aria-hidden': 'true' }, [rej])
      ]));
      botonesNumero(esc, ctx, r.opciones, r.resp, function (v) {
        return r.tipo === 'per'
          ? { texto: v + ' cm', label: v + ' centímetros', clase: 't46' }
          : { texto: v + ' cm²', label: v + ' centímetros cuadrados', clase: 't46' };
      });
    }
  };

  // ---------- 11. Ángulos ----------
  var TIPOS = { agudo: 'Agudo', recto: 'Recto', obtuso: 'Obtuso', llano: 'Llano' };
  function tipoAngulo(g) { return g < 90 ? 'agudo' : (g === 90 ? 'recto' : (g < 180 ? 'obtuso' : 'llano')); }
  var ANGULOS = [
    { agudo: [30, 45, 60], recto: [90], obtuso: [120, 135, 150] },
    { agudo: [70, 75, 80], recto: [90], obtuso: [100, 105, 110] },
    { agudo: [40, 60, 80], recto: [90], obtuso: [110, 130, 150], llano: [180] }
  ];
  var juego11 = {
    titulo: 'Ángulos', emoji: '🧭', color: '#D9F5E9', tema: 'GEOMETRÍA', resumen: 'Reconoce y mide ángulos.',
    practica: 'Clasificación y medida de ángulos',
    consejo: 'Usen una hoja doblada para ver el ángulo recto (90°) y comparen: ¿es más abierto o más cerrado? Recuerden que los tres ángulos de un triángulo siempre suman 180°.',
    crear: function (d) {
      if (d === 4) {
        var a = 5 * entre(4, 13), b = 5 * entre(4, 13), resp = 180 - a - b;
        var cands = [resp - 5, resp + 5, resp - 10, resp + 10, resp - 20, resp + 20, 180 - a, 90];
        return {
          tipo: 'suma', instruccion: 'Los tres ángulos de un triángulo suman 180°. ¿Cuánto mide el tercero?', a: a, b: b, resp: resp,
          opciones: dos(resp, cands, function (x) { return x > 0 && x < 180; }, function (i) { return resp + 5 * i; }), firma: 's' + a + ',' + b
        };
      }
      if (d === 3) {
        var g = uno([30, 45, 60, 120, 135, 150]);
        var c3 = [g - 15, g + 15, g - 30, g + 30, 90, 180 - g];
        return {
          tipo: 'mide', instruccion: '¿Cuánto mide este ángulo?', g: g, resp: g,
          opciones: dos(g, c3, function (x) { return x > 0 && x < 180; }, function (i) { return g + 5 * i; }), firma: 'm' + g
        };
      }
      var set = ANGULOS[d], tipos = Object.keys(set), tp = uno(tipos), gr = uno(set[tp]);
      return { tipo: 'clase', instruccion: '¿Qué tipo de ángulo es?', g: gr, resp: tp, tipos: tipos, firma: 'c' + gr };
    },
    montar: function (r, esc, ctx) {
      if (r.tipo === 'suma') {
        var duda = h('span', { class: 'ac-casilla ac-casilla--duda ac-casilla--ang' }, [h('span', { class: 'ac-casilla__q', text: '?', 'aria-label': 'Casilla vacía' })]);
        var ficha = function (t) { return h('span', { class: 'ac-casilla ac-casilla--ang', 'aria-label': t + ' grados' }, [h('span', { class: 'ac-casilla__q', text: t + '°', 'aria-hidden': 'true' })]); };
        esc.appendChild(fila('ac-angulos-suma', [ficha(r.a), ficha(r.b), duda]));
        rellenarAlAcertar(botonesNumero(esc, ctx, r.opciones, r.resp, function (v) { return { texto: v + '°', label: v + ' grados', clase: 't60' }; }), duda, r.resp + '°');
        return;
      }
      var dib = h('div', { class: 'ac-angulo', role: 'img', 'aria-label': 'Un ángulo dibujado con dos líneas', 'data-deg': r.g }, [
        h('span', { class: 'ac-angulo__rayo ac-angulo__rayo--base' }),
        h('span', { class: 'ac-angulo__rayo ac-angulo__rayo--giro' }),
        h('span', { class: 'ac-angulo__punto' })
      ]);
      dib.querySelector('.ac-angulo__rayo--giro').style.transform = 'rotate(' + (-r.g) + 'deg)';
      esc.appendChild(dib);
      if (r.tipo === 'mide') {
        botonesNumero(esc, ctx, r.opciones, r.resp, function (v) { return { texto: v + '°', label: v + ' grados', clase: 't60' }; });
        return;
      }
      var lista = barajar(r.tipos).map(function (t) {
        return { el: boton('ac-opt', TIPOS[t], [h('span', { class: 'ac-opt__num ac-opt__num--t40', text: TIPOS[t], 'aria-hidden': 'true' })]), ok: t === r.resp };
      });
      esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
      elegir(ctx, lista);
    }
  };

  // ---------- 12. ¿Qué tan probable es? ----------
  var BOLAS = C.COLORES;
  var FEM = { rojo: 'roja', amarillo: 'amarilla' };
  function colorF(c) { return FEM[c.id] || c.id; }
  function bolsaEtq(conteos) {
    return 'Bolsa con ' + conteos.map(function (c) { return c.n + (c.n === 1 ? ' bola ' : ' bolas ') + c.color.id; }).join(', ');
  }
  var juego12 = {
    titulo: '¿Qué tan probable es?', emoji: '🎱', color: '#ECE7FD', tema: 'DATOS Y AZAR', resumen: 'Saca una bola de la bolsa y piensa en las posibilidades.',
    practica: 'Probabilidad',
    consejo: 'Hagan el experimento con una bolsa y fichas de colores: predigan antes de sacar y anoten los resultados. Hablen de seguro, posible e imposible.',
    crear: function (d) {
      var cols = barajar(BOLAS), conteos, r;
      if (d <= 1) {
        var nums = muestra([1, 2, 3, 4, 5, 6, 7], 3);
        conteos = cols.slice(0, 3).map(function (c, i) { return { color: c, n: nums[i] }; });
        var orden = conteos.slice().sort(function (x, y) { return x.n - y.n; });
        var resp = d === 0 ? orden[2].color.id : orden[0].color.id;
        return { tipo: 'color', instruccion: d === 0 ? '¿De qué color es más probable sacar una bola?' : '¿De qué color es menos probable sacar una bola?', conteos: conteos, resp: resp, firma: conteos.map(function (c) { return c.color.id + c.n; }).join(',') + d };
      }
      if (d === 2) {
        var tp = uno(['seguro', 'posible', 'imposible']), pedido;
        if (tp === 'seguro') { pedido = cols[0]; conteos = [{ color: pedido, n: entre(4, 8) }]; }
        else if (tp === 'imposible') { pedido = cols[0]; conteos = [{ color: cols[1], n: entre(2, 5) }, { color: cols[2], n: entre(2, 5) }]; }
        else { pedido = cols[0]; conteos = [{ color: cols[0], n: entre(1, 5) }, { color: cols[1], n: entre(2, 5) }]; }
        r = { tipo: 'certeza', instruccion: '¿Es seguro, posible o imposible sacar una bola ' + colorF(pedido) + '?', conteos: conteos, resp: tp, firma: tp + pedido.id + conteos.map(function (c) { return c.n; }).join(',') };
        return r;
      }
      conteos = cols.slice(0, 3).map(function (c) { return { color: c, n: entre(1, 5) }; });
      var total = conteos.reduce(function (a, c) { return a + c.n; }, 0), k, texto;
      if (d === 3) {
        var uno1 = conteos[0];
        k = uno1.n; texto = '¿Qué probabilidad hay de sacar una bola ' + colorF(uno1.color) + '?';
      } else {
        k = conteos[0].n + conteos[1].n;
        texto = '¿Qué probabilidad hay de sacar una bola ' + colorF(conteos[0].color) + ' o ' + colorF(conteos[1].color) + '?';
      }
      var ans = k + ' de ' + total;
      var cands = [[k + 1, total], [k - 1, total], [k, total + 1], [k, total - 1], [total - k, total]].map(function (p) { return p[0] + ' de ' + p[1]; });
      var valido = function (t) { var p = t.split(' de '); return +p[0] >= 1 && +p[0] <= +p[1]; };
      return {
        tipo: 'prob', instruccion: texto, conteos: conteos, total: total, resp: ans,
        opciones: dos(ans, cands, valido, function (i) { return (k + i) + ' de ' + (total + i); }), firma: ans + d + conteos.map(function (c) { return c.n; }).join(',')
      };
    },
    montar: function (r, esc, ctx) {
      var bolas = [];
      r.conteos.forEach(function (c) { for (var i = 0; i < c.n; i++) bolas.push(c.color); });
      bolas = barajar(bolas);
      esc.appendChild(h('div', { class: 'ac-bolsa', role: 'img', 'aria-label': bolsaEtq(r.conteos) }, bolas.map(function (c) {
        var b = h('span', { class: 'ac-bola', 'aria-hidden': 'true' });
        b.style.background = c.hex;
        return b;
      })));
      if (r.tipo === 'color') {
        var lista = barajar(r.conteos.map(function (c) { return c.color; })).map(function (c) {
          var b = boton('ac-opt ac-opt--color', c.nombre.toLowerCase(), [h('span', { class: 'ac-color-bola', 'aria-hidden': 'true' })]);
          b.firstChild.style.background = c.hex;
          return { el: b, ok: c.id === r.resp };
        });
        esc.appendChild(fila('ac-opciones', lista.map(function (o) { return o.el; })));
        elegir(ctx, lista);
        return;
      }
      if (r.tipo === 'certeza') {
        var l2 = ['seguro', 'posible', 'imposible'].map(function (t) {
          return { el: boton('ac-opt', mayus(t), [h('span', { class: 'ac-opt__num ac-opt__num--t40', text: mayus(t), 'aria-hidden': 'true' })]), ok: t === r.resp };
        });
        esc.appendChild(fila('ac-opciones', l2.map(function (o) { return o.el; })));
        elegir(ctx, l2);
        return;
      }
      botonesNumero(esc, ctx, r.opciones, r.resp, function (v) { return { texto: v, label: v, clase: 't48' }; });
    }
  };

  window.ActividadesMotor.iniciar({
    modos: true,
    juegos: [juego1, juego2, juego3, juego4, juego5, juego6, juego7, juego8, juego9, juego10, juego11, juego12]
  });
  window.ActividadesMotor.revelar();
})();
