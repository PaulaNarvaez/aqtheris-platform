# Aqtheris

Application de suivi aquacole avec interface en espagnol, anglais et français. Première implémentation fonctionnelle : interface Vite, API Node.js et base SQLite locale. Ce dépôt n’est pas encore une livraison couvrant l’ensemble de la proposition, ni une installation de production.

## Démarrage

Node.js **24+** requis (module natif `node:sqlite`).

```sh
npm ci --cache /workspace/.npm-cache
npm run dev
```

L’API écoute sur `127.0.0.1:3001`, Vite sur le port 5173 et transmet `/api` à l’API. Au premier accès, créer le compte administrateur : aucun identifiant ni donnée fictive n’est préchargé. L’initialisation n’est acceptée que depuis la machine locale (le proxy Vite est local) : garder l’environnement privé pendant cette étape. Créer ensuite les comptes et attribuer leurs sites dans « Équipe ».

```sh
npm test
npm run build
npm start
```

`npm start` sert le bundle et l’API sur le port 3001. `PORT`, `HOST`, `DATA_DIR` permettent la configuration. Le serveur écoute par défaut sur la boucle locale. Derrière un reverse proxy HTTPS, définir `COOKIE_SECURE=true`. `npm run preview` sert uniquement le frontend ; utiliser `npm start` pour le fonctionnement complet.

## Fonctionnalités implémentées

- Authentification par mot de passe haché/salé scrypt, sessions HttpOnly de huit heures, limitation des tentatives de connexion.
- Administrateur, vétérinaire, laboratoire, administratif et consultation : droits d’écriture par module et autorisation par site sur l’API. Les administrateurs voient tous les sites ; les autres comptes n’accèdent qu’aux sites attribués. Les noms/emails des membres sont visibles par les membres connectés pour permettre l’affectation des tâches.
- Organisations, sites distincts, contacts, unités de production et dossiers.
- Visites et états du rapport séparés, mesures et origine de l’information, validation professionnelle enregistrée avant passage du rapport à « Validé ».
- Échantillons, envois, liens échantillon/envoi, demandes d’analyses, résultats et revues professionnelles.
- Résultats et documents immuables : correction par nouvel enregistrement lié à la version précédente. Les revues et validations sont également immuables.
- Actions avec responsable, priorité, échéance et état. Indicateurs calculés à partir des enregistrements non archivés, sans chiffres de démonstration.
- Documents privés jusqu’à 10 Mo, téléchargés uniquement après authentification et contrôle du site. Fichiers enregistrés hors du bundle public, sous identifiant généré.
- Journal avec auteur, date, anciennes et nouvelles valeurs. Contrôle de révision pour prévenir les écrasements concurrents. Archivage depuis la consultation des enregistrements modifiables.
- Recherche, fiches des sites et relations, export CSV par liste et export JSON complet administrateur incluant les pièces jointes et l’historique (sans mots de passe).
- Brouillons de formulaires dans la session du navigateur, hors fichiers et mots de passe. Ils ne remplacent pas un enregistrement serveur et sont perdus à la fermeture de la session du navigateur.

## Stockage et sauvegarde

`data/` contient la base SQLite et les pièces jointes. Ce dossier est ignoré par Git, de même que `.env` et `backups/`. Ne pas partager ni publier les données réelles dans un snapshot d’environnement sans autorisation institutionnelle.

Sauvegarde complète (contient les comptes et hachages de mots de passe : conserver dans un emplacement privé) :

```sh
node scripts/backup.js /chemin/prive/nouvelle-sauvegarde
```

Arrêter les écritures pendant la sauvegarde pour garantir un instant cohérent entre base et fichiers. Le script refuse un dossier existant ou situé à l’intérieur du dossier des données. Copier ensuite la sauvegarde vers un stockage distinct avec une politique de conservation.

Restauration : arrêter le serveur, sélectionner un **nouveau dossier inexistant**, puis :

```sh
DATA_DIR=/chemin/prive/donnees-restaurees node scripts/restore.js /chemin/prive/nouvelle-sauvegarde
DATA_DIR=/chemin/prive/donnees-restaurees npm start
```

La restauration contrôle l’intégrité SQLite, les références et la présence des documents. Les sessions sont invalidées. Le test d’intégration vérifie la reconnexion et le contenu d’un document après restauration. L’export JSON est un export portable, distinct de la sauvegarde restaurable.

## Validation

`npm test` exécute un scénario d’intégration avec fichiers/base temporaires : organisation à deux sites, visites multiples, plusieurs analyses, correction immuable, revue, action et conflit de révision, contrôle de site et de profil, téléchargement privé, journal, export, envoi, mesure, validation du rapport, redémarrage, sauvegarde et restauration. `npm run build` génère le frontend. Une vérification DOM supplémentaire a exercé l’authentification, les formulaires organisation/site et les vues principales ; il reste à réaliser une revue visuelle dans un navigateur réel.

## Écart avec le périmètre complet de la proposition

À développer avant une livraison complète : projets multiples et leurs permissions ; sélection fine des types d’information ; calendrier et heures/durées des rendez-vous ; invitations, disponibilités, annulations motivées et participants ; formulaires scientifiques validés avec les professionnels ; photographies prévisualisées ; informations temporelles structurées des contacts ; moteur de rappels idempotent ; rapports PDF ; imports historiques ; récupération/changement de mot de passe et désactivation des comptes ; gestion et recherche des archives ; tests navigateur et accessibilité complets. La liste des visites est actuellement une liste datée, pas un calendrier.

À décider avec l’institution : responsable fonctionnel, formulaires, hébergement, volume, politique de conservation, données de recherche, partage avec le registre D65-7520, OneDrive/SharePoint et éventuel mode hors connexion. Aucune intégration externe, notification ou interprétation clinique automatique n’est activée.

Pour la production : déploiement HTTPS, sauvegardes automatiques hors machine, supervision, antivirus documentaire selon la politique institutionnelle, tests de charge et revue de sécurité. SQLite convient à cette installation de développement ; évaluer PostgreSQL et un stockage d’objets privé selon le volume et l’architecture retenus.

## Langues et accès local

Le sélecteur Español / English / Français est disponible avant et après connexion. L’espagnol est la langue initiale ; le navigateur conserve le choix. Le changement ne déconnecte pas le compte et préserve les champs de connexion. Les libellés et états sont traduits à l’affichage ; les valeurs enregistrées et les textes saisis par les utilisateurs restent inchangés. Le proxy Vite conserve explicitement le Host du navigateur pour le contrôle d’origine de l’API. Les origines étrangères restent refusées.
