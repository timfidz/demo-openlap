// Menu des essais : une aide de démonstration pour passer d'une version de la page à l'autre et essayer les couleurs
// des vibreurs (plusieurs rouges, et les jeux de couleurs des plans du client).
// À RETIRER AVANT LA MISE EN LIGNE : ce fichier, la balise <script src="essais.js"> de chaque page, et les pages non retenues.
// Les couleurs retenues seront alors écrites dans les pages elles-mêmes, à la place de #e10600 et du noir des blocs.
/* global location, document -- script de navigateur */
(function () {
  // Numérotés pour le client, sans nom, pour ne pas l'orienter : 1 épurée, 2 barrières, 3 plein écran, 4 tracé libre
  var essais = [
    ['index.html', '1'],
    ['barrieres.html', '2'],
    ['grand.html', '3'],
    ['libre.html', '4']
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
    '.essais .pages { display: flex; justify-content: center; gap: 2px; }' +
    '.essais a { display: block; min-width: 30px; padding: 8px 6px; border-radius: 8px; text-align: center; font: 500 12px/1 "Inter", "Segoe UI", Arial, sans-serif;' +
    ' letter-spacing: .06em; text-decoration: none; color: #9a9aa2; white-space: nowrap; }' +
    '.essais a:hover, .essais a:focus-visible { color: #f5f5f6; background: #f5f5f614; outline: none; }' +
    '.essais a[aria-current] { color: #f5f5f6; box-shadow: inset 0 -2px 0 var(--rouge); }' +
    '.essais .rouges { display: flex; justify-content: center; gap: 1px; margin-top: 6px; padding: 5px 2px 0; border-top: 1px solid #f5f5f61f; }' +
    '.essais button { box-sizing: border-box; width: 24px; height: 24px; padding: 4px; border: 0; border-radius: 50%; background-clip: content-box !important; cursor: pointer; flex: none; }' +
    '.essais button[aria-pressed="true"] { box-shadow: inset 0 0 0 1.5px #f5f5f6; }' +
    '.essais button:focus-visible { outline: 2px solid #f5f5f6; outline-offset: 3px; }' +
    '.essais .jeux { display: grid; grid-template-columns: repeat(3, auto); justify-content: center; gap: 0 2px; padding: 0 2px 2px; }' +
    '.essais .jeux button { width: 38px; height: 24px; padding: 5px 4px; border-radius: 7px; }' +
    '.essais button.bascule { width: auto; height: auto; margin-top: 4px; padding: 7px 10px; border-radius: 8px; background: none !important;' +
    ' font: 500 11px/1 "Inter", "Segoe UI", Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #9a9aa2; }' +
    '.essais button.bascule[aria-pressed="true"] { color: #f5f5f6; box-shadow: inset 2px 0 0 var(--rouge); }' +
    '.essais .repos { display: flex; align-items: center; gap: 8px; margin-top: 6px; padding: 8px 8px 4px; border-top: 1px solid #f5f5f61f;' +
    ' font: 500 10px/1 "Inter", "Segoe UI", Arial, sans-serif; letter-spacing: .06em; color: #9a9aa2; }' +
    '.essais .repos input { width: 96px; margin: 0; accent-color: var(--rouge); cursor: pointer; }' +
    '.essais .repos span { min-width: 34px; text-align: right; }' +
    '@media (orientation: portrait) { .essais { left: 50%; top: 8px; transform: translateX(-50%); display: flex; align-items: center; padding: 4px;' +
    ' max-width: calc(100vw - 16px); overflow-x: auto; scrollbar-width: none; }' +
    ' .essais a { padding: 7px 6px; font-size: 11px; }' +
    ' .essais .rouges { width: auto; margin: 0; padding: 0 4px; border-top: 0; }' +
    ' .essais .jeux { display: flex; padding: 0 4px; }' +
    ' .essais .repos { margin: 0; padding: 0 8px; border-top: 0; } .essais .repos input { width: 70px; } }';
  document.head.appendChild(style);

  var nav = document.createElement('nav');
  nav.className = 'essais';
  nav.setAttribute('aria-label', 'Versions de la page');
  var pages = document.createElement('div');
  pages.className = 'pages';
  essais.forEach(function (essai) {
    var lien = document.createElement('a');
    lien.href = essai[0];
    lien.textContent = essai[1];
    lien.setAttribute('aria-label', 'Version ' + essai[1]);
    if (essai[0].replace(/\.html$/, '') === ici) lien.setAttribute('aria-current', 'page');
    pages.appendChild(lien);
  });
  nav.appendChild(pages);

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

  // Les traces de gomme dans les épingles (traces.js) : montrées ou non, choix retenu d'une page à l'autre
  var boutonTraces = document.createElement('button');
  boutonTraces.type = 'button';
  boutonTraces.className = 'bascule';
  boutonTraces.textContent = 'Traces';
  boutonTraces.title = 'Traces de gomme dans les épingles';
  function montrerTraces(oui) {
    // traces.js ne calcule les traces qu'à leur première apparition
    if (oui) document.dispatchEvent(new Event('traces:afficher'));
    [].forEach.call(document.querySelectorAll('.traces'), function (g) {
      g.style.display = oui ? '' : 'none';
      if (oui) g.removeAttribute('hidden'); else g.setAttribute('hidden', '');
    });
    boutonTraces.setAttribute('aria-pressed', String(oui));
  }
  boutonTraces.addEventListener('click', function () {
    var oui = boutonTraces.getAttribute('aria-pressed') !== 'true';
    ecrire('essais-traces', oui ? 'oui' : 'non');
    montrerTraces(oui);
  });
  if (document.querySelector('.traces')) nav.appendChild(boutonTraces);

  // Le trait de lumière derrière le point (#filet) : montré ou non, choix retenu d'une page à l'autre
  var boutonTrait = document.createElement('button');
  boutonTrait.type = 'button';
  boutonTrait.className = 'bascule';
  boutonTrait.textContent = 'Trait';
  boutonTrait.title = 'Le trait de lumière derrière le point';
  function montrerTrait(oui) {
    var filet = document.getElementById('filet');
    if (filet) filet.style.display = oui ? '' : 'none';
    boutonTrait.setAttribute('aria-pressed', String(oui));
  }
  boutonTrait.addEventListener('click', function () {
    var oui = boutonTrait.getAttribute('aria-pressed') !== 'true';
    ecrire('essais-trait', oui ? 'oui' : 'non');
    montrerTrait(oui);
  });
  if (document.getElementById('filet')) nav.appendChild(boutonTrait);
  // ?trait=0 dans l'adresse le retire (captures) ; sinon, le dernier choix fait, sinon montré
  montrerTrait(adresse.has('trait') ? adresse.get('trait') === '1' : lire('essais-trait') !== 'non');

  // Le curseur « liserés au repos » : de 0 (piste sombre, le rouge n'existe que dans la lumière) à 100 % (toute la piste
  // comme en pleine lumière). Il règle l'opacité de la couche .repos-liseres de la page ; la grille et le damier
  // suivent au même niveau. Le réglage n'est pas retenu d'une page à l'autre.
  var reglage = document.createElement('label');
  reglage.className = 'repos';
  var curseur = document.createElement('input');
  curseur.type = 'range'; curseur.min = '0'; curseur.max = '100'; curseur.step = '5'; curseur.value = '0';
  curseur.setAttribute('aria-label', 'Liserés au repos, en pourcentage');
  var valeur = document.createElement('span');
  reglage.appendChild(curseur); reglage.appendChild(valeur);
  // Le réglage écrit dans la page (15 % sur les quatre versions depuis le 03/10) : point de départ du curseur
  var liseres = document.querySelector('.repos-liseres');
  var reposPage = liseres ? Math.round(Number(liseres.getAttribute('opacity') || 0) * 100) : 0;
  function eclairer(pourcent) {
    pourcent = Math.max(0, Math.min(100, Math.round(pourcent / 5) * 5));
    curseur.value = String(pourcent);
    valeur.textContent = pourcent + ' %';
    [].forEach.call(document.querySelectorAll('.repos-liseres'), function (g) { g.setAttribute('opacity', String(pourcent / 100)); });
    [].forEach.call(document.querySelectorAll('.repos-marquages'), function (g) { g.setAttribute('opacity', String(pourcent / 100)); });
  }
  curseur.addEventListener('input', function () { eclairer(Number(curseur.value)); });
  nav.appendChild(reglage);
  document.body.appendChild(nav);
  // ?repos=40 dans l'adresse impose le réglage (captures) ; sinon, celui de la page (le choix n'est plus retenu d'une page à l'autre)
  eclairer(adresse.has('repos') ? Number(adresse.get('repos')) || 0 : reposPage);
  // ?traces=1 dans l'adresse les impose (captures) ; sinon, le dernier choix fait
  montrerTraces(adresse.has('traces') ? adresse.get('traces') === '1' : lire('essais-traces') === 'oui');

  // ?rouge=c8102e et ?blocs=bleu-jaune dans l'adresse imposent un choix (servent aux captures) ; sinon, le dernier choix fait
  var rougeVoulu = adresse.get('rouge') ? '#' + adresse.get('rouge').replace('#', '') : lire('essais-rouge');
  if (rouges.some(function (r) { return r[0] === rougeVoulu; })) rouge = rougeVoulu;
  var jeuVoulu = adresse.get('blocs') || lire('essais-blocs');
  jeux.forEach(function (j) { if (j[0] === jeuVoulu) jeu = j; });
  appliquer();
})();
