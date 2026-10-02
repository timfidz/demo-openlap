// Menu des essais : une aide de démonstration pour passer d'une version de la page à l'autre et essayer les couleurs
// des vibreurs (plusieurs rouges, et les jeux de couleurs des plans du client).
// À RETIRER AVANT LA MISE EN LIGNE : ce fichier, la balise <script src="essais.js"> de chaque page, et les pages non retenues.
// Les couleurs retenues seront alors écrites dans les pages elles-mêmes, à la place de #e10600 et du noir des blocs.
/* global location, document -- script de navigateur */
(function () {
  var essais = [
    ['index.html', 'Épurée'],
    ['barrieres.html', 'Barrières'],
    ['grand.html', 'Plein écran'],
    ['libre.html', 'Tracé libre']
  ];
  // Les rouges à comparer ; le premier est celui écrit dans les pages
  var rouges = [
    ['#e10600', 'Vif (actuel)'],
    ['#cf1020', 'Rosso'],
    ['#c8102e', 'Carmin'],
    ['#b5121b', 'Laqué'],
    ['#a50f2d', 'Cramoisi']
  ];
  var ORIGINE = rouges[0][0];
  // Les jeux de couleurs : [nom, libellé, couleur de fond du vibreur, couleur de ses blocs].
  // « rouge » = le rouge choisi au-dessus ; « noir » = le noir écrit dans la page ; « fond » = la même couleur que le fond (trait uni).
  // Les quatre derniers reprennent les plans envoyés par le client.
  var jeux = [
    ['noir', 'Rouge et noir', 'rouge', 'noir'],
    ['blanc', 'Rouge et blanc', 'rouge', '#f5f5f6'],
    ['uni', 'Rouge uni', 'rouge', 'fond'],
    ['bleu', 'Rouge et bleu', 'rouge', '#1c5cff'],
    ['bleu-jaune', 'Bleu et jaune', '#1c4fd8', '#ffe033']
  ];
  // Selon l'hébergeur, l'adresse se termine par « grand.html », « grand » ou rien du tout (page d'accueil)
  var ici = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  var adresse = new URLSearchParams(location.search);
  function lire(cle) { try { return localStorage.getItem(cle); } catch (e) { return null; } }
  function ecrire(cle, valeur) { try { localStorage.setItem(cle, valeur); } catch (e) { /* stockage refusé : le choix ne vaut que pour cette page */ } }

  var style = document.createElement('style');
  style.textContent =
    '.essais { --rouge: ' + ORIGINE + '; position: fixed; left: 12px; top: 50%; transform: translateY(-50%); z-index: 20; display: grid; gap: 2px;' +
    ' padding: 8px 6px; border: 1px solid #f5f5f61f; border-radius: 12px; background: #050506cc; }' +
    '.essais a { display: block; padding: 7px 10px; border-radius: 8px; font: 500 11px/1 "Inter", "Segoe UI", Arial, sans-serif;' +
    ' letter-spacing: .12em; text-transform: uppercase; text-decoration: none; color: #9a9aa2; white-space: nowrap; }' +
    '.essais a:hover, .essais a:focus-visible { color: #f5f5f6; background: #f5f5f614; outline: none; }' +
    '.essais a[aria-current] { color: #f5f5f6; box-shadow: inset 2px 0 0 var(--rouge); }' +
    '.essais .rouges { display: flex; justify-content: center; gap: 1px; margin-top: 6px; padding: 5px 2px 0; border-top: 1px solid #f5f5f61f; }' +
    '.essais button { box-sizing: border-box; width: 24px; height: 24px; padding: 4px; border: 0; border-radius: 50%; background-clip: content-box !important; cursor: pointer; flex: none; }' +
    '.essais button[aria-pressed="true"] { box-shadow: inset 0 0 0 1.5px #f5f5f6; }' +
    '.essais button:focus-visible { outline: 2px solid #f5f5f6; outline-offset: 3px; }' +
    '.essais .jeux { display: grid; grid-template-columns: repeat(3, auto); justify-content: center; gap: 0 2px; padding: 0 2px 2px; }' +
    '.essais .jeux button { width: 38px; height: 24px; padding: 5px 4px; border-radius: 7px; }' +
    '@media (orientation: portrait) { .essais { left: 50%; top: 8px; transform: translateX(-50%); display: flex; align-items: center; padding: 4px;' +
    ' max-width: calc(100vw - 16px); overflow-x: auto; scrollbar-width: none; }' +
    ' .essais a { padding: 7px 8px; font-size: 10px; letter-spacing: .06em; }' +
    ' .essais a[aria-current] { box-shadow: inset 0 -2px 0 var(--rouge); }' +
    ' .essais .rouges { width: auto; margin: 0; padding: 0 4px; border-top: 0; }' +
    ' .essais .jeux { display: flex; padding: 0 4px; } }';
  document.head.appendChild(style);

  var nav = document.createElement('nav');
  nav.className = 'essais';
  nav.setAttribute('aria-label', 'Versions de la page');
  essais.forEach(function (essai) {
    var lien = document.createElement('a');
    lien.href = essai[0];
    lien.textContent = essai[1];
    if (essai[0].replace(/\.html$/, '') === ici) lien.setAttribute('aria-current', 'page');
    nav.appendChild(lien);
  });

  // Dans les pages, chaque vibreur est fait de deux traits superposés : un trait continu (le fond), et des blocs par-dessus
  var fonds = document.querySelectorAll('[stroke="' + ORIGINE + '"]');
  var blocs = document.querySelectorAll('[stroke-dasharray][stroke="#050506"], [stroke-dasharray][stroke="#141416"]');
  [].forEach.call(blocs, function (t) { t.dataset.noir = t.getAttribute('stroke'); });

  var rouge = ORIGINE, jeu = jeux[0];
  var pastilles = document.createElement('div');
  pastilles.className = 'rouges';
  pastilles.setAttribute('role', 'group');
  pastilles.setAttribute('aria-label', 'Rouge des vibreurs');
  var boutonsJeux = document.createElement('div');
  boutonsJeux.className = 'jeux';
  boutonsJeux.setAttribute('role', 'group');
  boutonsJeux.setAttribute('aria-label', 'Couleurs des vibreurs');

  function appliquer() {
    var fond = jeu[2] === 'rouge' ? rouge : jeu[2];
    [].forEach.call(fonds, function (t) { t.setAttribute('stroke', fond); });
    [].forEach.call(blocs, function (t) { t.setAttribute('stroke', jeu[3] === 'noir' ? t.dataset.noir : jeu[3] === 'fond' ? fond : jeu[3]); });
    nav.style.setProperty('--rouge', rouge);
    [].forEach.call(pastilles.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.couleur === rouge)); });
    [].forEach.call(boutonsJeux.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.jeu === jeu[0])); });
  }

  // Les pastilles de rouge : le choix est retenu d'une page à l'autre
  rouges.forEach(function (r) {
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.couleur = r[0];
    b.style.background = r[0];
    b.title = r[1] + ' ' + r[0];
    b.setAttribute('aria-label', r[1]);
    b.addEventListener('click', function () { rouge = r[0]; ecrire('essais-rouge', rouge); appliquer(); });
    pastilles.appendChild(b);
  });
  nav.appendChild(pastilles);

  // Les boutons des jeux de couleurs : moitié fond, moitié blocs
  jeux.forEach(function (j) {
    var b = document.createElement('button');
    var fond = j[2] === 'rouge' ? 'var(--rouge)' : j[2];
    // sur le bouton, le noir est éclairci pour se détacher du fond du menu
    var bloc = j[3] === 'noir' ? '#34343a' : j[3] === 'fond' ? fond : j[3];
    b.type = 'button';
    b.dataset.jeu = j[0];
    b.style.background = 'linear-gradient(90deg, ' + fond + ' 50%, ' + bloc + ' 50%)';
    b.title = j[1];
    b.setAttribute('aria-label', j[1]);
    b.addEventListener('click', function () { jeu = j; ecrire('essais-blocs', jeu[0]); appliquer(); });
    boutonsJeux.appendChild(b);
  });
  nav.appendChild(boutonsJeux);
  document.body.appendChild(nav);

  // ?rouge=c8102e et ?blocs=bleu-jaune dans l'adresse imposent un choix (servent aux captures) ; sinon, le dernier choix fait
  var rougeVoulu = adresse.get('rouge') ? '#' + adresse.get('rouge').replace('#', '') : lire('essais-rouge');
  if (rouges.some(function (r) { return r[0] === rougeVoulu; })) rouge = rougeVoulu;
  var jeuVoulu = adresse.get('blocs') || lire('essais-blocs');
  jeux.forEach(function (j) { if (j[0] === jeuVoulu) jeu = j; });
  appliquer();
})();
