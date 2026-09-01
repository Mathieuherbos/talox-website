# Déploiement TALOX V2

Site 100% statique (HTML/CSS/JS vanilla), sans backend ni build step. Deux hébergements en parallèle sont possibles : Hostinger (production, talox.be) et GitHub Pages (preview interne pour l'équipe).

## 1. Déploiement Hostinger (production — talox.be)

### Pré-requis
- Accès FTP Hostinger (hôte, identifiant, mot de passe — disponibles dans hPanel > Fichiers > Comptes FTP)
- Un client FTP (FileZilla, Cyberduck, ou l'explorateur de fichiers intégré à hPanel)

### Étapes

1. Connecte-toi à hPanel Hostinger.
2. Va dans **Fichiers > Gestionnaire de fichiers** (ou utilise un client FTP externe avec les identifiants FTP).
3. Ouvre le dossier `public_html/`.
4. **Sauvegarde d'abord l'existant** : si le site actuel (V1) est encore en ligne, télécharge une copie de `public_html/` en local avant d'écraser quoi que ce soit.
5. Supprime le contenu actuel de `public_html/` (après sauvegarde) ou déploie dans un sous-dossier de test d'abord si tu préfères valider avant bascule.
6. Upload l'intégralité du contenu de ce dossier **à la racine de `public_html/`** :
   ```
   public_html/
     index.html
     tarifs.html
     secteurs/
     css/
     js/
     images/
     sitemap.xml
     robots.txt
   ```
   Important : uploade le *contenu* du dossier `talox-website/`, pas le dossier lui-même (sinon le site sera accessible sur `talox.be/talox-website/` au lieu de `talox.be/`).
7. Vérifie que le certificat SSL est actif (hPanel > Sécurité > SSL) pour que `https://talox.be` fonctionne sans avertissement.
8. Teste le site en ligne : navigation, formulaire de contact (ouvre le client mail), calculateur, FAQ (accordéons), responsive mobile.
9. Ajoute les vraies images manquantes dans `images/` (voir `images/README.md`) et remplace le numéro de démo vocal dans `js/demo-chat.js` (`DEMO_CONFIG`) quand il sera disponible.

### Mise à jour ultérieure

Pour toute modification (texte, prix, ajout d'un secteur) :
1. Édite les fichiers en local (voir section "Éditer le contenu" ci-dessous)
2. Re-upload uniquement les fichiers modifiés via FTP

## 2. GitHub Pages (preview interne pour l'équipe)

Le repo est déjà poussé sur `https://github.com/Mathieuherbos/talox-website`. Pour activer l'hébergement GitHub Pages (utile pour partager une preview à tes associés sans toucher au site en prod) :

1. Va sur `https://github.com/Mathieuherbos/talox-website/settings/pages`
2. Dans **Build and deployment > Source**, sélectionne **Deploy from a branch**
3. Choisis la branche `main` et le dossier `/ (root)`
4. Sauvegarde. Le site sera disponible sous quelques minutes à `https://mathieuherbos.github.io/talox-website/`

Tous les liens internes du site sont en chemins relatifs (pas de `/tarifs.html` en absolu), donc la navigation fonctionne aussi bien à la racine d'un domaine (Hostinger) que dans un sous-dossier (`mathieuherbos.github.io/talox-website/`). Aucune configuration supplémentaire nécessaire.

## Sélecteur de langue FR/EN/NL

Comme sur talox.be (V1), tout le texte traduisible porte un attribut `data-i18n="cle"` (ou `data-i18n-placeholder="cle"` pour les champs de formulaire) et reste vide dans le HTML brut. Le contenu réel vit dans un objet `window.TALOX_I18N = { fr: {...}, en: {...}, nl: {...} }` inclus dans un `<script>` en bas de chaque page. Au chargement, `js/main.js` lit la langue mémorisée (`localStorage`, clé `talox_lang`, défaut `fr`) et remplit chaque élément `[data-i18n]` avec le texte correspondant. Cliquer sur FR/EN/NL dans le header réapplique la traduction sans recharger la page.

**Important — ceci change la façon d'éditer le contenu** par rapport à une page HTML classique : le texte visible ne se modifie plus directement dans les balises, il faut éditer l'objet JSON en bas de fichier.

## Éditer le contenu

- **Éditer un texte existant** : dans le fichier concerné (`index.html`, `tarifs.html`, `secteurs/[slug].html`), cherche le `<script>` juste avant `</body>` contenant `window.TALOX_I18N = {...}`. Modifie la valeur voulue dans `fr`, `en` et `nl` (les trois, pour rester cohérent). Le HTML au-dessus n'a normalement pas besoin d'être touché, sauf pour ajouter/retirer un bloc entier.
- **Contenu par secteur** : chaque fichier `secteurs/[slug].html` a son bloc structurel délimité par :
  ```html
  <!-- CONTENU EDITABLE: début -->
  ...
  <!-- CONTENU EDITABLE: fin -->
  ```
  Ce bloc ne contient que la structure (les `data-i18n="sector.xxx"`) ; le texte réel de ce secteur est dans son propre objet `TALOX_I18N` en bas de la même page, sous la clé `sector`.
- **Ajouter un 7e secteur** : duplique un fichier existant dans `secteurs/`, adapte le bloc éditable et l'objet `sector` du `TALOX_I18N` (les 3 langues), ajoute un lien dans la navigation (`.dropdown` du header) et le footer de **toutes** les pages, plus une entrée dans `sitemap.xml`.
- **Numéro de démo vocal réel** : dans `js/demo-chat.js`, passer `DEMO_CONFIG.mode` de `'scripted'` à `'phone'` et renseigner `DEMO_CONFIG.phone.number`.
- **Formulaire de contact** : branché sur le même endpoint Formspree que la V1 (`https://formspree.io/f/xqegploo`), visible dans l'attribut `action` du `<form>` sur `index.html`. Change-le si tu veux utiliser un autre compte/endpoint.

## Ce qui a changé par rapport à la première version de cette V2

- **Identité visuelle** : alignée sur talox.be actuel plutôt que sur une palette claire inventée — fond quasi-noir `#08090f`, dégradés violets, cartes vitrées, texture de grain, vidéo en fond du hero (même source vidéo que la V1, hébergée sur Pexels).
- **FR/EN/NL** : ajouté sur les 8 pages (voir section ci-dessus), avec le même mécanisme que talox.be.
- **Formulaire** : envoie réellement les messages via Formspree au lieu d'ouvrir un client mail.
- **Bugs corrigés** : contraste texte/fond dans le formulaire, et robustesse des boutons (`flex-shrink: 0`, gradient réutilisable) pour éviter tout texte qui déborde.
