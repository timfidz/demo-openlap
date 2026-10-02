// Menu des essais : une aide de démonstration pour passer d'une version de la page à l'autre.
// À RETIRER AVANT LA MISE EN LIGNE : ce fichier, la balise <script src="essais.js"> de chaque page, et les pages non retenues.
/* global location, document -- script de navigateur */
(function () {
  var essais = [
    ['index.html', 'Épurée'],
    ['barrieres.html', 'Barrières'],
    ['grand.html', 'Plein écran'],
    ['libre.html', 'Tracé libre']
  ];
  // Selon l'hébergeur, l'adresse se termine par « grand.html », « grand » ou rien du tout (page d'accueil)
  var ici = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  var style = document.createElement('style');
  style.textContent =
    '.essais { position: fixed; left: 12px; top: 50%; transform: translateY(-50%); z-index: 20; display: grid; gap: 2px;' +
    ' padding: 8px 6px; border: 1px solid #f5f5f61f; border-radius: 12px; background: #050506cc; }' +
    '.essais a { display: block; padding: 7px 10px; border-radius: 8px; font: 500 11px/1 "Inter", "Segoe UI", Arial, sans-serif;' +
    ' letter-spacing: .12em; text-transform: uppercase; text-decoration: none; color: #9a9aa2; white-space: nowrap; }' +
    '.essais a:hover, .essais a:focus-visible { color: #f5f5f6; background: #f5f5f614; outline: none; }' +
    '.essais a[aria-current] { color: #f5f5f6; box-shadow: inset 2px 0 0 #e10600; }' +
    '@media (orientation: portrait) { .essais { left: 50%; top: 8px; transform: translateX(-50%); display: flex; padding: 4px; }' +
    ' .essais a { padding: 7px 8px; font-size: 10px; letter-spacing: .06em; }' +
    ' .essais a[aria-current] { box-shadow: inset 0 -2px 0 #e10600; } }';
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
  document.body.appendChild(nav);
})();
