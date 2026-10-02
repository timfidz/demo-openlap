// Menu des essais : une aide de démonstration pour passer d'une version de la page à l'autre et essayer plusieurs rouges.
// À RETIRER AVANT LA MISE EN LIGNE : ce fichier, la balise <script src="essais.js"> de chaque page, et les pages non retenues.
// Le rouge retenu sera alors écrit dans les pages elles-mêmes, à la place de #e10600.
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
  // Selon l'hébergeur, l'adresse se termine par « grand.html », « grand » ou rien du tout (page d'accueil)
  var ici = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  var style = document.createElement('style');
  style.textContent =
    '.essais { --rouge: ' + ORIGINE + '; position: fixed; left: 12px; top: 50%; transform: translateY(-50%); z-index: 20; display: grid; gap: 2px;' +
    ' padding: 8px 6px; border: 1px solid #f5f5f61f; border-radius: 12px; background: #050506cc; }' +
    '.essais a { display: block; padding: 7px 10px; border-radius: 8px; font: 500 11px/1 "Inter", "Segoe UI", Arial, sans-serif;' +
    ' letter-spacing: .12em; text-transform: uppercase; text-decoration: none; color: #9a9aa2; white-space: nowrap; }' +
    '.essais a:hover, .essais a:focus-visible { color: #f5f5f6; background: #f5f5f614; outline: none; }' +
    '.essais a[aria-current] { color: #f5f5f6; box-shadow: inset 2px 0 0 var(--rouge); }' +
    '.essais .rouges { display: flex; justify-content: center; gap: 7px; margin-top: 6px; padding: 9px 4px 3px; border-top: 1px solid #f5f5f61f; }' +
    '.essais button { width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; cursor: pointer; }' +
    '.essais button[aria-pressed="true"] { box-shadow: 0 0 0 2px #050506, 0 0 0 3.5px #f5f5f6; }' +
    '.essais button:focus-visible { outline: 2px solid #f5f5f6; outline-offset: 3px; }' +
    '@media (orientation: portrait) { .essais { left: 50%; top: 8px; transform: translateX(-50%); display: flex; flex-wrap: wrap; justify-content: center; padding: 4px; }' +
    ' .essais a { padding: 7px 8px; font-size: 10px; letter-spacing: .06em; }' +
    ' .essais a[aria-current] { box-shadow: inset 0 -2px 0 var(--rouge); }' +
    ' .essais .rouges { width: 100%; margin-top: 2px; padding: 7px 4px 4px; } }';
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

  // Les pastilles de couleur : le rouge choisi remplace celui des pages, et il est retenu d'une page à l'autre
  var traits = document.querySelectorAll('[stroke="' + ORIGINE + '"]');
  var pastilles = document.createElement('div');
  pastilles.className = 'rouges';
  pastilles.setAttribute('role', 'group');
  pastilles.setAttribute('aria-label', 'Rouge des vibreurs');
  function appliquer(couleur) {
    for (var i = 0; i < traits.length; i++) traits[i].setAttribute('stroke', couleur);
    nav.style.setProperty('--rouge', couleur);
    [].forEach.call(pastilles.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.couleur === couleur)); });
  }
  function retenir(couleur) { try { localStorage.setItem('essais-rouge', couleur); } catch (e) { /* stockage refusé : le choix ne vaut que pour cette page */ } }
  function retenu() { try { return localStorage.getItem('essais-rouge'); } catch (e) { return null; } }
  rouges.forEach(function (rouge) {
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.couleur = rouge[0];
    b.style.background = rouge[0];
    b.title = rouge[1] + ' ' + rouge[0];
    b.setAttribute('aria-label', rouge[1]);
    b.addEventListener('click', function () { appliquer(rouge[0]); retenir(rouge[0]); });
    pastilles.appendChild(b);
  });
  nav.appendChild(pastilles);
  document.body.appendChild(nav);

  // ?rouge=c8102e dans l'adresse impose une couleur (sert aux captures) ; sinon, le dernier choix
  var impose = new URLSearchParams(location.search).get('rouge');
  var choix = impose ? '#' + impose.replace('#', '') : retenu();
  var connus = rouges.map(function (r) { return r[0]; });
  appliquer(connus.indexOf(choix) >= 0 ? choix : ORIGINE);
})();
