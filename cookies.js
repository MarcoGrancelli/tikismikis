/* Aviso de cookies y pixel de Meta.
   - El pixel se carga SOLO si la persona toca «Aceptar». Antes de elegir no se carga nada.
   - Si rechaza, no se carga nunca y la elección queda guardada en el navegador.
   - El aviso sale en el idioma que tenga la página (es, fr, en) y cambia si se cambia el idioma.
   - Las estadísticas (Umami) van aparte, en el <head>: no usan cookies y no dependen de esto.
   Para cambiar el pixel: PIXELES. La elección se guarda con el nombre CLAVE. */
(function () {
  var PIXELES = ['1781858836448711'];            // pixel «Sitio Tikismikis», propio del sitio, en la empresa Tikismikis
  var CLAVE = 'tikismikis:cookies';              // localStorage: "si" / "no"
  var PRIVACIDAD = 'privacidad.html';
  var TXT = {
    es: { aviso: 'Este sitio utiliza cookies de terceros para personalizar contenidos.', mas: 'Más información', no: 'Rechazar', si: 'Aceptar',
          region: 'Aviso de cookies', estado: 'Estado actual: ', aceptadas: 'aceptadas.', rechazadas: 'rechazadas.', sin: 'sin respuesta.' },
    fr: { aviso: 'Ce site utilise des cookies tiers pour personnaliser les contenus.', mas: 'En savoir plus', no: 'Refuser', si: 'Accepter',
          region: 'Avis sur les cookies', estado: 'État actuel : ', aceptadas: 'acceptés.', rechazadas: 'refusés.', sin: 'sans réponse.' },
    en: { aviso: 'This site uses third-party cookies to personalise content.', mas: 'More information', no: 'Reject', si: 'Accept',
          region: 'Cookie notice', estado: 'Current status: ', aceptadas: 'accepted.', rechazadas: 'rejected.', sin: 'no answer yet.' }
  };
  if (!PIXELES.length) return;

  function t() { var l = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase(); return TXT[l] || TXT.es; }
  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  var cargado = false;
  function cargarPixel() {
    if (cargado) return; cargado = true;
    !function (f, b, e, v, n, s0, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      s0 = b.createElement(e); s0.async = !0; s0.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(s0, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('consent', 'grant');
    PIXELES.forEach(function (id) { window.fbq('init', id); });
    window.fbq('track', 'PageView');             // un solo track: llega a todos los pixeles iniciados
  }
  function borrarCookiesMeta() {                 // al rechazar después de haber aceptado
    var dom = location.hostname.replace(/^www\./, '');
    ['_fbp', '_fbc'].forEach(function (n) {
      document.cookie = n + '=; Max-Age=0; path=/';
      document.cookie = n + '=; Max-Age=0; path=/; domain=.' + dom;
    });
  }

  var aviso = null;
  function pintarAviso() {
    if (!aviso) return;
    var x = t();
    aviso.setAttribute('aria-label', x.region);
    aviso.innerHTML =
      '<p>' + x.aviso + ' <a href="' + PRIVACIDAD + '">' + x.mas + '</a></p>' +
      '<div class="cookies-botones"><button type="button" class="cookies-btn" data-cookies="no">' + x.no + '</button>' +
      '<button type="button" class="cookies-btn" data-cookies="si">' + x.si + '</button></div>';
  }
  function mostrarAviso() {
    aviso = document.createElement('div');
    aviso.className = 'cookies';
    aviso.setAttribute('role', 'region');
    pintarAviso();
    document.body.appendChild(aviso);
  }
  function quitarAviso() { if (aviso) { aviso.remove(); aviso = null; } }
  function mostrarEstado() {                     // en la página de privacidad: <p id="estadoCookies">
    var el = document.getElementById('estadoCookies'); if (!el) return;
    var v = leer(), x = t();
    el.textContent = x.estado + (v === 'si' ? x.aceptadas : v === 'no' ? x.rechazadas : x.sin);
  }
  function elegir(v) {
    guardar(v); quitarAviso();
    if (v === 'si') cargarPixel();
    else { if (window.fbq) window.fbq('consent', 'revoke'); borrarCookiesMeta(); }
    mostrarEstado();
  }
  function arrancar() {
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-cookies]');
      if (b) elegir(b.getAttribute('data-cookies'));
    });
    var v = leer();
    if (v === 'si') cargarPixel();
    else if (v !== 'no' && !document.getElementById('estadoCookies')) mostrarAviso();   // en privacidad ya están los botones
    mostrarEstado();
    /* si la persona cambia el idioma de la página, el aviso y el estado cambian con ella */
    new MutationObserver(function () { pintarAviso(); mostrarEstado(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
