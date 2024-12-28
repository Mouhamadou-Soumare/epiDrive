EpiDrive
<p align="center">
  <a href="#"><img src="https://github.com/Mouhamadou-Soumare/epiDrive/blob/main/public/img/logo.png" alt="EpiDrive" width="100"></a>
</p>
<p align="center">Epidrive - Faites de vos courses un plaisir, alliant saveurs et praticité en un clic.</p>

## Comment utiliser ce projet

### Prérequis

Pour cloner et exécuter cette application, vous aurez besoin de :

- **Git** : pour cloner le dépôt.
- **Node.js (inclut npm)** : pour installer les dépendances et exécuter le projet.

### Étapes d'installation

```bash
# Clonez ce dépôt.
$ git clone https://github.com/your-username/epidrive

# Accédez à la racine du projet
$ cd epidrive

# Installez les dépendances
$ npm install
```

### Configuration du fichier .env

Avant de lancer l'application, configurez le fichier `.env` avec vos variables d'environnement :

```env
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=rootpassword
DATABASE_URL="mysql://user:password@db:3306/epidrive"
SHADOW_DATABASE_URL="mysql://root:rootpassword@db:3306/shadow_epidrive"
RESEND_API_KEY=""
```

### Initialisation de la Base de Données

```bash
# Configurez Docker pour démarrer les services
$ docker-compose up -d

# Se rendre sur le container MySQL et créer une base de données shadow
$ CREATE DATABASE shadow_epidrive;

# Appliquer les migrations Prisma
$ npx prisma migrate dev --name init

# Générer le client Prisma
$ npx prisma generate

# Insérer des données de base (seed)
$ npx prisma db seed
```

## Fonctionnalités

- **Page d'accueil** : Affiche les principales fonctionnalités et recommandations de produits.
- **Pages produits et catégories** :
  - `/categories` : Liste les catégories de produits disponibles.
  - `/category/[slug]` : Affiche les sous-catégories et produits d'une catégorie spécifique.
  - `/product/[slug]` : Détails d'un produit spécifique.
- **Boutique** : `/shop` affiche tous les produits disponibles.
- **Page de contact** : `/contact`.
- **404** : Gestion des pages non trouvées.

## Tests Unitaires

### Mise en place des tests

Pour garantir la fiabilité des fonctionnalités, des tests unitaires ont été implémentés avec Jest. Voici les commandes pour exécuter les tests :

```bash
# Lancer tous les tests unitaires
$ npm run test

# Lancer les tests avec un rapport de couverture
$ npm run test -- --coverage
```

Les tests couvrent les fonctionnalités suivantes :

- **Gestion du panier** :
  - Ajouter un produit.
  - Supprimer un produit.
  - Mettre à jour les quantités.
  - Calculer le total avec TVA.
- **Authentification** :
  - Inscription et connexion utilisateur.
  - Validation des identifiants.

### Rapport de couverture

Après exécution des tests avec couverture, un rapport est généré dans le dossier `coverage/lcov-report`. Ouvrez `index.html` pour une vue détaillée.

## Workflow CI/CD

Un pipeline GitHub Actions est configuré pour :

- Installer les dépendances.
- Exécuter les tests unitaires.
- Générer des rapports de couverture.

### Workflow de base

```yaml
name: CI Workflow

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm install

      - name: Run Unit Tests
        run: npm run test -- --coverage
```

## Développement en local

L'application utilise Docker pour exécuter les services backend :

```bash
docker-compose up -d
```

Cela démarre :

- Base de données MySQL (port 3306).
- phpMyAdmin pour la gestion visuelle (port 8080).
- Next.js (port 3000).

## Contact

Pour toute question ou suggestion, contactez-nous via :

- mouhamadou.etu@gmail.com
- choeurtis.tchounga@gmail.com
- ibrahimabarry1503@gmail.com