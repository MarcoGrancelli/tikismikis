/* AGENDA del sitio. Para sumar un concierto: copiar un renglón de AGENDA y cambiar los datos.
     fecha   año-mes-día (2027-05-21)
     lugar   nombre del establecimiento o del festival
     ciudad  nombre de la ciudad
     depto   número de departamento, SOLO si es en Francia
     pais    FR, DE, AT, CH, LV… (si falta uno, sumarlo en PAISES)
   El orden no importa: los de hoy en adelante salen en «Próximos» y los demás pasan solos a «Anteriores».
   Anotar solo conciertos confirmados que ya se puedan anunciar. */
(function () {
  var AGENDA = [
    { fecha: '2027-07-21', lugar: 'Festival Bleu Trompette', ciudad: 'Montpezat-de-Quercy', depto: '82', pais: 'FR' },
    { fecha: '2027-05-29', lugar: 'Festival d’Agen', ciudad: 'Agen', depto: '47', pais: 'FR' },
    { fecha: '2027-05-21', lugar: 'La Peñac', ciudad: 'Marciac', depto: '32', pais: 'FR' },

    { fecha: '2026-08-22', lugar: 'Vieille Église', ciudad: 'Saint-Clar', depto: '32', pais: 'FR' },
    { fecha: '2026-08-15', lugar: 'INNtöne Festival', ciudad: 'Diersbach', pais: 'AT' },
    { fecha: '2026-07-13', lugar: 'Festival Convivencia', ciudad: 'Villesèquelande', depto: '11', pais: 'FR' },
    { fecha: '2026-07-11', lugar: 'Festival Mākslas pikniks, Lūznavas muiža', ciudad: 'Lūznava', pais: 'LV' },
    { fecha: '2026-07-03', lugar: 'Festival Les Méridiennes', ciudad: 'Tours', depto: '37', pais: 'FR' },
    { fecha: '2026-06-27', lugar: 'Fête des Couleurs', ciudad: 'Aigle', pais: 'CH' },
    { fecha: '2026-06-13', lugar: 'Festival A la Montanha', ciudad: 'Lacaze', depto: '81', pais: 'FR' },
    { fecha: '2026-06-07', lugar: 'Ludwigsburger Schlossfestspiele', ciudad: 'Ludwigsburg', pais: 'DE' },
    { fecha: '2025-04-19', lugar: 'Festival Xiru', ciudad: 'Mauléon-Licharre', depto: '64', pais: 'FR' },
    { fecha: '2025-03-24', lugar: 'Cinélatino, Rencontres de Toulouse', ciudad: 'Toulouse', depto: '31', pais: 'FR' },
    { fecha: '2024-08-08', lugar: 'Abbaye de Bonnefont', ciudad: 'Proupiary', depto: '31', pais: 'FR' }
  ];

  /* país: castellano, francés, inglés */
  var PAISES = {
    FR: ['Francia', 'France', 'France'],
    DE: ['Alemania', 'Allemagne', 'Germany'],
    AT: ['Austria', 'Autriche', 'Austria'],
    CH: ['Suiza', 'Suisse', 'Switzerland'],
    LV: ['Letonia', 'Lettonie', 'Latvia'],
    ES: ['España', 'Espagne', 'Spain'],
    BE: ['Bélgica', 'Belgique', 'Belgium'],
    IT: ['Italia', 'Italie', 'Italy'],
    GB: ['Reino Unido', 'Royaume-Uni', 'United Kingdom']
  };
  var MESES = {
    es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  var COLUMNA = { es: 0, fr: 1, en: 2 };

  var proximos = document.getElementById('agendaProximos');
  var pasados = document.getElementById('agendaPasados');
  if (!proximos || !pasados) return;

  function dos(n) { return (n < 10 ? '0' : '') + n; }
  var h = new Date();
  var hoy = h.getFullYear() + '-' + dos(h.getMonth() + 1) + '-' + dos(h.getDate());

  function parte(clase, texto) {
    var s = document.createElement('span');
    s.className = clase;
    s.textContent = texto;
    return s;
  }
  function renglon(c, idioma) {
    var p = c.fecha.split('-');
    var li = document.createElement('li');
    var fecha = document.createElement('time');
    fecha.dateTime = c.fecha;
    fecha.appendChild(parte('dia', String(Number(p[2]))));
    fecha.appendChild(document.createTextNode(' '));
    fecha.appendChild(parte('mes', MESES[idioma][Number(p[1]) - 1] + ' ' + p[0]));
    li.appendChild(fecha);
    li.appendChild(parte('lugar', c.lugar));
    var donde = parte('donde', c.ciudad + (c.depto ? ' (' + c.depto + ')' : ''));
    donde.appendChild(parte('pais', PAISES[c.pais] ? PAISES[c.pais][COLUMNA[idioma]] : c.pais));
    li.appendChild(donde);
    return li;
  }
  function llenar(lista, conciertos, idioma) {
    lista.textContent = '';
    conciertos.forEach(function (c) { lista.appendChild(renglon(c, idioma)); });
    lista.hidden = !conciertos.length;
  }
  function pintar() {
    var l = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
    var idioma = MESES[l] ? l : 'es';
    var vienen = AGENDA.filter(function (c) { return c.fecha >= hoy; }).sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });
    var fueron = AGENDA.filter(function (c) { return c.fecha < hoy; }).sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
    llenar(proximos, vienen, idioma);
    llenar(pasados, fueron, idioma);
    document.getElementById('agendaVacia').hidden = vienen.length > 0;
    document.getElementById('agendaAnteriores').hidden = !fueron.length;
  }
  pintar();
  /* quien llega con un enlace a …#agenda (desde el mail) cae directo en la agenda, ya dibujada */
  if (location.hash === '#agenda') window.addEventListener('load', function () {
    document.getElementById('agenda').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  /* si la persona cambia el idioma de la página, la agenda cambia con ella */
  new MutationObserver(pintar).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
