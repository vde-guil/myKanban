#

Pour concatener toute notre application JS dans un fichier on utilise les commandes suivantes

Faire le bundle une fois.
`npx browserify -e assets/js/app.js -o dist/bundle.js`

Ou, si on dev, ajouter un watcher qui va surveiller vos fichiers et relancer le bundle à chaque modification
`npx watchify -e assets/js/app.js -o dist/bundle.js`

Ces commandes vont concatener les differens fichiers js en un seul : `dist/bundle.js`

ca a ete rendu possible grace a browserify et au fait qu'on a explicitement declare les dependances entre nos fichiers.

le dossier `dist` est traditionnellement le dossier qui contient les ressources 'compactees' genere a partir de nos fichiers sources.

le contenu de ce fichier est ignore par git grace au fichier .gitignore.