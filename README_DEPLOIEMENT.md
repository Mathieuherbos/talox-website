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

## Éditer le contenu

- **Textes des sections communes** (hero, services, FAQ générale, pricing résumé) : directement dans `index.html`
- **Tarifs** : `tarifs.html`
- **Contenu par secteur** : chaque fichier `secteurs/[slug].html` contient un bloc clairement délimité :
  ```html
  <!-- CONTENU EDITABLE: début -->
  ...
  <!-- CONTENU EDITABLE: fin -->
  ```
  Tout ce qui est spécifique au secteur (hero, cas d'usage, FAQ) est dans ce bloc. Le header, footer et style restent identiques d'une page à l'autre.
- **Ajouter un 7e secteur** : duplique un fichier existant dans `secteurs/`, modifie le contenu dans le bloc éditable, ajoute un lien vers la nouvelle page dans la navigation (`.dropdown` du header) et le footer de **toutes** les pages, plus une entrée dans `sitemap.xml`.
- **Numéro de démo vocal réel** : dans `js/demo-chat.js`, passer `DEMO_CONFIG.mode` de `'scripted'` à `'phone'` et renseigner `DEMO_CONFIG.phone.number`.

## Ce qui n'est volontairement pas inclus dans cette V1 de la V2

- **Sélecteur FR/EN/NL** : le site actuel en avait un, cette V2 est en français uniquement pour l'instant (le brief ne demandait pas de traduire les 8 pages). A ajouter si nécessaire.
- **Vidéo de fond dans le hero** : remplacée par un dégradé CSS + démo de chat animée, en attendant un asset vidéo.
- **Vrai numéro de démo vocal** : la démo est simulée en JS (voir ci-dessus), prête à basculer sur un vrai numéro.
