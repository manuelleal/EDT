/* Taller IA + Inglés · comportamiento de la página.
   ENLACES y los botones que dependen de él siguen en index.html, justo antes de este archivo. */
(function () {
  window.__tallerListo = true;
  var root = document.documentElement;
  var quieto = matchMedia('(prefers-reduced-motion: reduce)');
  var mover = root.classList.contains('js-anim');

  /* Aviso para lectores de pantalla */
  var aviso = document.getElementById('aviso');
  function avisar(texto) {
    if (!aviso) return;
    aviso.textContent = '';
    setTimeout(function () { aviso.textContent = texto; }, 60);
  }

  /* Copiar: el botón se pone verde y dibuja un check */
  var CHECK = '<svg class="ic ic-ok" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M3 8.6l3.1 3.1L13 4.6"/></svg>';
  function copyText(text, btn) {
    var label = btn.querySelector('span');
    var done = function () {
      clearTimeout(btn._t);
      btn.classList.remove('done');
      void btn.offsetWidth;
      btn.classList.add('done');
      if (label) label.textContent = 'Copiado';
      avisar('Copiado. Ya puede pegarlo en la IA.');
      btn._t = setTimeout(function () { btn.classList.remove('done'); if (label) label.textContent = 'Copiar'; }, 2000);
    };
    var fallback = function (el) {
      var r = document.createRange(); r.selectNodeContents(el);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      if (label) label.textContent = 'Seleccionado: Ctrl+C';
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { if (label) label.textContent = 'Copiar'; }, 4000);
    };
    try {
      navigator.clipboard.writeText(text).then(done, function () { fallback(btn._src); });
    } catch (e) { fallback(btn._src); }
  }
  document.querySelectorAll('.copy, .js-copyout').forEach(function (btn) {
    btn.insertAdjacentHTML('afterbegin', CHECK);
  });
  document.querySelectorAll('.promptbox .copy').forEach(function (btn) {
    var pre = btn.closest('.promptbox').querySelector('pre');
    btn._src = pre;
    btn.addEventListener('click', function () { copyText(pre.textContent.trim(), btn); });
  });

  /* Practique aquí: su prompt en 3 loops */
  function val(id) { return document.getElementById(id).value.trim(); }
  function marcar(id) {
    var o = document.getElementById(id);
    o.classList.remove('cambio'); void o.offsetWidth; o.classList.add('cambio');
  }
  function build(e) {
    document.getElementById('o-1').textContent = 'Actúa como ' + val('p-rol') + '. Tengo estudiantes de ' + val('p-ctx') +
      '. Necesito ' + val('p-tarea') + ' sobre ' + (val('p-tema') || '[tema]') + '.';
    document.getElementById('o-2').textContent = 'Está muy genérico. Ajusta esto a un contexto donde ' + val('p-friccion') +
      '. Cambia la teoría por un práctico o estudio de caso local.';
    document.getElementById('o-3').textContent = 'Perfecto. Ahora entrégamelo en ' + val('p-formato') +
      ' y agrega al final 3 preguntas trampa para verificar que el estudiante realmente pensó y no usó IA.';
    if (e && e.target) {
      var paso = e.target.closest('.loop-step');
      var out = paso && paso.querySelector('.prompt-out');
      if (out) marcar(out.id);
    }
  }
  ['p-rol', 'p-ctx', 'p-tarea', 'p-tema', 'p-friccion', 'p-formato'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', build);
  });
  build();
  document.querySelectorAll('.js-copyout').forEach(function (btn) {
    var o = document.getElementById(btn.dataset.out); btn._src = o;
    btn.addEventListener('click', function () { copyText(o.textContent, btn); });
  });

  /* Hero: las piezas de la fórmula se arman una por una y luego se escribe la instrucción */
  var asm = document.querySelector('.assembly');
  if (asm) {
    var piezas = asm.querySelectorAll('.chips > *');
    var chips = asm.querySelectorAll('.chip');
    var out = asm.querySelector('.out');
    var src = document.createElement('span');
    src.className = 'src';
    while (out.firstChild) src.appendChild(out.firstChild);
    out.appendChild(src);
    var relojes = [];
    var limpiar = function () {
      relojes.forEach(clearTimeout); relojes = [];
      var viejo = out.querySelector('.tw'); if (viejo) viejo.remove();
      out.classList.remove('is-typing');
      chips.forEach(function (c) { c.classList.remove('lit'); });
    };
    var armar = function () {
      limpiar();
      if (!mover) return;
      piezas.forEach(function (p) { p.classList.remove('on'); });
      var tw = src.cloneNode(true);
      tw.className = 'tw';
      tw.setAttribute('aria-hidden', 'true');
      var nodos = [], w = document.createTreeWalker(tw, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) nodos.push(w.currentNode);
      var textos = nodos.map(function (n) { return n.data; });
      var fuertes = Array.prototype.slice.call(tw.querySelectorAll('strong'));
      nodos.forEach(function (n) { n.data = ''; });
      out.classList.add('is-typing');
      out.appendChild(tw);
      piezas.forEach(function (p, i) {
        relojes.push(setTimeout(function () { p.classList.add('on'); }, 300 + i * 230));
      });
      var k = 0, j = 0;
      var paso = function () {
        if (k >= nodos.length) {
          relojes.push(setTimeout(function () { tw.remove(); out.classList.remove('is-typing'); }, 600));
          return;
        }
        if (j === 0) {
          /* Cada parte resaltada del texto enciende su pieza: Contexto, Tarea, Realidad, Formato */
          var f = fuertes.indexOf(nodos[k].parentNode);
          if (f > -1 && chips[f + 1]) chips[f + 1].classList.add('lit');
        }
        j++;
        nodos[k].data = textos[k].slice(0, j);
        if (j >= textos[k].length) { k++; j = 0; }
        relojes.push(setTimeout(paso, 22));
      };
      relojes.push(setTimeout(function () { chips[0].classList.add('lit'); paso(); }, 300 + piezas.length * 230 + 350));
    };
    var repetir = asm.querySelector('.replay');
    if (repetir) repetir.addEventListener('click', armar);
    armar();
  }

  /* Entrada al hacer scroll: aparecer + subir, escalonado entre hermanos */
  if (mover) {
    document.querySelectorAll('.rise').forEach(function (el) {
      var hermanos = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('rise'); });
      var i = hermanos.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 0.09 + 's');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.rise').forEach(function (el) { io.observe(el); });
  }

  /* Contadores de Quién facilita */
  var cifras = document.querySelectorAll('[data-count]');
  if (mover && cifras.length) {
    var contar = function (el) {
      var meta = parseInt(el.dataset.count, 10), t0 = null;
      var cuadro = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(meta * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(cuadro);
      };
      requestAnimationFrame(cuadro);
    };
    var ioN = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { contar(e.target); ioN.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    cifras.forEach(function (el) { el.textContent = '0'; ioN.observe(el); });
  }

  /* Foto del facilitador: solo se pide si data-foto trae una ruta */
  var avatar = document.querySelector('.avatar[data-foto]');
  if (avatar && avatar.dataset.foto && avatar.dataset.foto !== 'no') {
    var foto = new Image();
    foto.alt = '';
    foto.onload = function () { avatar.appendChild(foto); avatar.classList.add('con-foto'); };
    foto.src = avatar.dataset.foto;
  }

  /* Juego: al abrirlo arranca un reloj de 2 minutos en la tarjeta */
  var juego = document.querySelector('.juego');
  if (juego) {
    var cifra = juego.querySelector('.reloj b');
    var intervalo = null;
    var mostrar = function (s) { cifra.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    juego.querySelectorAll('.js-link').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!a.getAttribute('href')) return;
        clearInterval(intervalo);
        var fin = Date.now() + 120000;
        juego.classList.remove('terminado');
        juego.classList.add('jugando');
        mostrar(120);
        intervalo = setInterval(function () {
          var resta = Math.max(0, Math.round((fin - Date.now()) / 1000));
          mostrar(resta);
          if (resta === 0) {
            clearInterval(intervalo);
            juego.classList.remove('jugando');
            juego.classList.add('terminado');
            cifra.textContent = '¡Tiempo!';
            avisar('Se acabaron los 2 minutos de juego.');
          }
        }, 1000);
      });
    });
  }

  /* Barra de progreso y botón de volver arriba */
  var barra = document.querySelector('.progreso span');
  var arriba = document.querySelector('.arriba');
  var pendiente = false;
  var medir = function () {
    pendiente = false;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var p = alto > 0 ? Math.min(window.scrollY / alto, 1) : 0;
    if (barra) barra.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (arriba) arriba.classList.toggle('visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(medir); }
  }, { passive: true });
  window.addEventListener('resize', medir);
  medir();
  if (arriba) {
    arriba.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: quieto.matches ? 'auto' : 'smooth' });
      var marca = document.querySelector('.site-nav .brand');
      if (marca) marca.focus({ preventScroll: true });
    });
  }

  /* Modo claro / oscuro: sigue al sistema hasta que la persona elige */
  var btnTema = document.querySelector('.theme-btn');
  var oscuroSistema = matchMedia('(prefers-color-scheme: dark)');
  var aplicarTema = function (t) {
    if (t) root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    var oscuro = t ? t === 'dark' : oscuroSistema.matches;
    root.setAttribute('data-bs-theme', oscuro ? 'dark' : 'light');
    if (btnTema) {
      btnTema.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btnTema.setAttribute('title', oscuro ? 'Modo claro' : 'Modo oscuro');
    }
  };
  var temaGuardado = function () { try { return localStorage.getItem('taller-tema'); } catch (e) { return null; } };
  aplicarTema(temaGuardado());
  if (btnTema) {
    btnTema.addEventListener('click', function () {
      var t = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('taller-tema', t); } catch (e) {}
      aplicarTema(t);
    });
  }
  if (oscuroSistema.addEventListener) {
    oscuroSistema.addEventListener('change', function () { if (!temaGuardado()) aplicarTema(null); });
  }

  /* Cerrar el menú del celular al elegir una sección */
  document.querySelectorAll('#menu .nav-link').forEach(function (l) {
    l.addEventListener('click', function () {
      var m = document.getElementById('menu');
      if (m.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(m).hide();
    });
  });
})();
