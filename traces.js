// Traces de gomme dans les épingles (essai, Tim 03/10/2026 ; idée reprise des volutes du plan préféré du client).
// Calculées depuis le tracé, comme les vibreurs : les trois virages qui tournent le plus reçoivent deux fines traces
// (les deux pneus arrière) qui glissent vers l'extérieur du virage et s'effacent à la sortie. Elles sont posées dans
// le calque éclairé : invisibles dans le noir, révélées au passage de la lumière, éteintes avec la traînée.
// Masquées tant que le menu des essais ne les montre pas (classe « traces », attribut hidden).
// Si l'essai est retenu : retirer l'attribut hidden et le display: none ci-dessous, puis inclure ce fichier dans la page finale.
/* global document -- script de navigateur */
(function () {
  var trace = document.getElementById('trace');
  if (!trace) return;
  var svg = trace.ownerSVGElement;
  var NS = 'http://www.w3.org/2000/svg';
  // Le sol éclairé (le trait large du tracé dans le calque éclairé) donne la largeur de la piste.
  // Version barrières : pas de sol éclairé, les traces vont dans le calque des marquages au sol (un seul couloir de large).
  var calque = svg.querySelector('g[mask="url(#eclairage)"]');
  var sol = calque && calque.querySelector('use[href="#trace"][stroke-width]');
  var calqueSol = svg.querySelector('g[mask="url(#eclairage-sol)"]');
  var demi = (sol ? parseFloat(sol.getAttribute('stroke-width')) : 52) / 2;

  // Le groupe est posé tout de suite (vide), pour que le menu des essais le trouve ; il est rempli plus tard
  // Un gris gomme un peu plus clair que le sol : une trace plus sombre que ce sol presque noir ne se voit pas
  var groupe = document.createElementNS(NS, 'g');
  groupe.setAttribute('class', 'traces');
  groupe.setAttribute('fill', 'none');
  groupe.setAttribute('stroke', '#3a3a41');
  groupe.setAttribute('stroke-linecap', 'round');
  groupe.setAttribute('stroke-linejoin', 'round');
  groupe.setAttribute('hidden', '');
  groupe.style.display = 'none';
  if (sol) calque.insertBefore(groupe, sol.nextSibling);
  else if (calqueSol) calqueSol.insertBefore(groupe, calqueSol.firstChild);
  else if (calque) calque.insertBefore(groupe, calque.firstChild);
  else return;

  function calculer() {
    var total = trace.getTotalLength();
    // 1. Le tracé est mesuré une seule fois, un point tous les 8 unités (la mesure est la partie lente : la faire
    //    plus souvent coûtait 40 points de performance Lighthouse) ; le cap se déduit des points voisins
    var pas = 8, caps = [], points = [];
    for (var s = 0; s < total; s += pas) points.push(trace.getPointAtLength(s));
    var n = points.length;
    for (var i0 = 0; i0 < n; i0++) {
      var avant = points[(i0 - 1 + n) % n], apres = points[(i0 + 1) % n];
      caps.push(Math.atan2(apres.y - avant.y, apres.x - avant.x));
    }
    var virage = caps.map(function (c, i) {
      var d = caps[(i + 1) % n] - c;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      return d;
    });

    // 2. Les virages : suites de points qui tournent dans le même sens, à un rayon de moins de 130 unités
    var seuil = pas / 130, virages = [], debut = -1;
    for (var i = 0; i <= n; i++) {
      var v = i < n ? virage[i] : 0;
      var dedans = Math.abs(v) > seuil && (debut < 0 || Math.sign(v) === Math.sign(virage[debut]));
      if (dedans && debut < 0) debut = i;
      if (!dedans && debut >= 0) {
        var tourne = 0;
        for (var k = debut; k < i; k++) tourne += virage[k];
        virages.push({ debut: debut, fin: i, tourne: tourne });
        debut = Math.abs(v) > seuil ? i : -1;
      }
    }
    // Les épingles (plus de 140 degrés), les trois qui tournent le plus
    var retenus = virages.filter(function (v) { return Math.abs(v.tourne) > 2.45; })
      .sort(function (a, b) { return Math.abs(b.tourne) - Math.abs(a.tourne); }).slice(0, 3);

    // 3. Une trace : de l'entrée du virage (un peu avant) à la sortie (plus loin : le kart glisse encore en sortant),
    //    en quelques morceaux d'opacité croissante puis décroissante (une trace qui apparaît et s'efface)
    function marque(v, decalage, ecart, force) {
      var long = v.fin - v.debut, a = v.debut - Math.round(long * 0.15), b = v.fin + Math.round(long * 0.45);
      var dehors = -Math.sign(v.tourne);   // côté extérieur du virage
      var parMorceau = Math.max(2, Math.ceil((b - a) / 8));
      for (var m = a; m < b; m += parMorceau) {
        var d = '';
        for (var j = m; j <= Math.min(b, m + parMorceau); j++) {
          var idx = ((j % n) + n) % n, u = (j - a) / (b - a);
          // Le kart part de l'intérieur et glisse vers l'extérieur ; une légère ondulation, comme une trace réelle
          var off = dehors * (demi * (-0.6 + 1.4 * Math.pow(u, 1.5)) + decalage + Math.sin(u * 9 + decalage) * 1.2);
          off = Math.max(-(demi - 4), Math.min(demi - 4, off));
          var c = caps[idx], pt = points[idx];
          // Normale à droite du sens de marche (repère SVG, y vers le bas)
          d += (d ? 'L' : 'M') + (pt.x - Math.sin(c) * off).toFixed(1) + ' ' + (pt.y + Math.cos(c) * off).toFixed(1);
        }
        var milieu = Math.min(1, Math.max(0, (m + parMorceau / 2 - a) / (b - a)));
        var opacite = Math.pow(Math.sin(Math.PI * milieu), 0.8) * force;
        [[ecart, 0.5], [ecart * 0.4, 0.9]].forEach(function (couche) {
          var chemin = document.createElementNS(NS, 'path');
          chemin.setAttribute('d', d);
          chemin.setAttribute('stroke-width', couche[0].toFixed(1));
          chemin.setAttribute('stroke-opacity', (opacite * couche[1]).toFixed(3));
          groupe.appendChild(chemin);
        });
      }
    }
    retenus.forEach(function (v) {
      // Deux pneus arrière, espacés comme sur un kart ; un second passage plus pâle, légèrement décalé
      marque(v, 0, 6, 1);
      marque(v, -9, 6, 1);
      marque(v, 7, 4, 0.5);
      marque(v, -2, 4, 0.5);
    });
    // Où sont les traces, en part du tour (fin de chaque épingle) : sert à choisir ?fige pour les captures
    groupe.setAttribute('data-longueur', total.toFixed(0));
    groupe.setAttribute('data-virages', retenus.map(function (v) { return (v.fin * pas / total).toFixed(3); }).join(' '));
  }

  // Rien n'est calculé tant que les traces sont masquées : le menu des essais envoie « traces:afficher » quand on les
  // montre (calculées au chargement, elles coûtaient plus de 20 points de performance Lighthouse). Si l'essai est
  // retenu, mieux vaut écrire les traces calculées une fois pour toutes dans la page que les calculer à chaque visite.
  var fait = false;
  document.addEventListener('traces:afficher', function () {
    if (fait) return;
    fait = true;
    calculer();
  });
})();
