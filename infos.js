// Deuxième bouton de la page : affiche par-dessus le circuit le texte écrit par le client (page privée /admin,
// champs « bouton2 » et « presentation » ; sans texte, le bouton et la fenêtre sont retirés de la page au moment où
// elle est servie, voir functions/index.js). Le circuit continue de tourner derrière, assombri et flouté.
// Fermeture : bouton Fermer, touche Échap, ou clic à côté du texte.
//
// Mode « glisse » (fenêtre avec la classe glisse : plein écran et tracé libre) : pas de voile ; le nom et la phrase
// montent, les boutons descendent, puis le texte apparaît en fondu dans l'espace libéré, la piste s'atténue ; l'inverse
// à la fermeture, le texte d'abord. S'il n'y a pas la place (petit écran, long texte), retour au voile (classe serre).
/* global document, location, window -- script de navigateur */
(function () {
  var bouton = document.querySelector('[data-infos]');
  var fenetre = document.getElementById('infos');
  if (!bouton || !fenetre) return;
  // Navigateur trop ancien pour la fenêtre native : pas de bouton plutôt qu'un bouton sans effet
  if (typeof fenetre.showModal !== 'function') { bouton.hidden = true; return; }
  var glisse = fenetre.classList.contains('glisse');
  var MARGE = 44;       // entre le texte et ce qui l'entoure, en px
  var MOUVEMENT = 28;   // déplacement minimal du haut et du bas, en px

  // Ce qui est au-dessus du milieu de l'écran monte, ce qui est en dessous descend : la même règle sert aux versions
  // où le nom est au centre (plein écran, tracé libre) et à celles où il est en haut et les boutons en bas.
  // Chaque élément s'écarte juste assez pour laisser la place au texte, ou parce que son voisin le pousse (l'écart
  // entre deux éléments proches est gardé) ; un élément loin du texte (mentions tout en bas) ne bouge pas.
  // Renvoie les déplacements [élément, px, sort] (vers le haut pour « dessus »), ou null si quelque chose sortirait de
  // l'écran. Seules les mentions légales ont le droit d'en sortir (sort = true) : poussées hors de l'écran le temps du texte.
  function pousser(liste, limite, versLeHaut, haut) {
    var faits = [], borne = limite, precedent = null;
    for (var i = 0; i < liste.length; i++) {
      var r = liste[i].getBoundingClientRect();
      if (precedent) {
        // L'écart d'origine avec le voisin déjà poussé : gardé en entier dans un même bloc (la phrase et ses boutons
        // bougent ensemble), plafonné sinon (un élément éloigné, comme les mentions en bas d'écran, n'est pas entraîné)
        var ecartOrigine = versLeHaut ? precedent.r.top - r.bottom : r.top - precedent.r.bottom;
        var ecart = precedent.e.parentElement === liste[i].parentElement ? ecartOrigine : Math.min(ecartOrigine, 40);
        borne = versLeHaut ? precedent.r.top - precedent.d - ecart : precedent.r.bottom + precedent.d + ecart;
      }
      var d = Math.max(0, versLeHaut ? r.bottom - borne : borne - r.top);
      var sort = d > 0 && (versLeHaut ? r.top - d < 12 : r.bottom + d > haut - 12);
      if (sort && !liste[i].classList.contains('pied')) return null;
      // Les mentions qui sortent vont jusqu'au bout : entièrement hors de l'écran, plutôt qu'à moitié coupées
      // (les effacer par l'opacité ne marche pas : leur animation d'apparition, gardée par « forwards », passe devant)
      if (sort) d = versLeHaut ? r.bottom + 16 : haut - r.top + 16;
      faits.push([liste[i], d, sort]);
      precedent = { e: liste[i], r: r, d: d };
    }
    return faits;
  }

  function ecarter() {
    var contenu = fenetre.querySelector('.contenu');
    var h = contenu.getBoundingClientRect().height, haut = window.innerHeight, milieu = haut / 2;
    var elements = ['.marque', '.phrase', '.boutons', '.pied'].map(function (q) { return document.querySelector(q); })
      .filter(function (e) { return e && e.getBoundingClientRect().height > 0; });
    var centreDe = function (e) { var r = e.getBoundingClientRect(); return r.top + r.height / 2; };
    // Du plus proche du texte au plus éloigné
    var dessus = elements.filter(function (e) { return centreDe(e) < milieu; }).sort(function (a, b) { return centreDe(b) - centreDe(a); });
    var dessous = elements.filter(function (e) { return centreDe(e) >= milieu; }).sort(function (a, b) { return centreDe(a) - centreDe(b); });
    var limiteHaut = milieu - h / 2 - MARGE, limiteBas = milieu + h / 2 + MARGE;
    // Au moins un petit mouvement, même quand le texte a déjà sa place : c'est lui qui montre que la page s'ouvre.
    // Le haut et le bas se règlent chacun de leur côté : le plus grand mouvement qui tient dans l'écran, au moins le
    // nécessaire ; sans la place pour le nécessaire, retour au voile.
    function groupe(liste, limite, versLeHaut) {
      if (!liste.length) return [];
      var r = liste[0].getBoundingClientRect();
      var essais = [MOUVEMENT, MOUVEMENT / 2, 0];
      for (var i = 0; i < essais.length; i++) {
        var borne = versLeHaut ? Math.min(limite, r.bottom - essais[i]) : Math.max(limite, r.top + essais[i]);
        var faits = pousser(liste, borne, versLeHaut, haut);
        if (faits) return faits;
      }
      return null;
    }
    var monte = groupe(dessus, limiteHaut, true), descend = groupe(dessous, limiteBas, false);
    if (!monte || !descend) { fenetre.classList.add('serre'); return; }
    monte.concat(descend).forEach(function (x) {
      x[0].classList.add(monte.indexOf(x) >= 0 ? 'monte' : 'descend');
      if (x[2]) x[0].classList.add('sort');
      x[0].style.setProperty('--decalage', x[1] + 'px');
    });
    document.body.classList.add('ecarte');
  }

  function ouvrir() {
    fenetre.showModal();
    if (glisse) ecarter();
  }

  function fermer() {
    if (!fenetre.open || fenetre.classList.contains('sortie')) return;
    if (!document.body.classList.contains('ecarte')) { fenetre.close(); return; }
    // Le texte s'efface d'abord (.3 s), puis le nom et les boutons se resserrent (.6 s)
    fenetre.classList.add('sortie');
    window.setTimeout(function () { document.body.classList.remove('ecarte'); }, 300);
    window.setTimeout(function () { fenetre.close(); }, 950);
  }

  bouton.addEventListener('click', ouvrir);
  fenetre.querySelector('[data-fermer]').addEventListener('click', fermer);
  // Un clic hors du texte ferme : la fenêtre couvre tout l'écran, son contenu est au centre
  fenetre.addEventListener('click', function (e) { if (e.target === fenetre) fermer(); });
  // Échap : même fermeture animée que le bouton
  fenetre.addEventListener('cancel', function (e) { e.preventDefault(); fermer(); });
  fenetre.addEventListener('close', function () {
    document.body.classList.remove('ecarte');
    fenetre.classList.remove('serre', 'sortie');
    [].forEach.call(document.querySelectorAll('.monte, .descend'), function (e) { e.classList.remove('monte', 'descend', 'sort'); e.style.removeProperty('--decalage'); });
  });
  // ?infos=1 dans l'adresse ouvre le texte au chargement : sert aux captures
  if (new URLSearchParams(location.search).get('infos') === '1') ouvrir();
})();
