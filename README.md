# EpiDrive

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
$ git clone https://github.com/Mouhamadou-Soumare/epiDrive.git

# Accédez à la racine du projet
$ cd epidrive

# Installez les dépendances
$ npm install
```

### Configuration du fichier .env

Avant de lancer l'application, configurez le fichier `.env` avec vos variables d'environnement :

```env
MYSQL_USER="user"
MYSQL_PASSWORD="password"
MYSQL_ROOT_PASSWORD="rootpassword"
DATABASE_URL=""
SHADOW_DATABASE_URL=""
RESEND_API_KEY=""
RESEND_EMAIL_TO=""
RESEND_EMAIL_FROM="onboarding@resend.dev"
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_BASE_URL="http://localhost:3000/"
CHATGPT_API_KEY=""
NEXTAUTH_SECRET="secret"
NEXTAUTH_URL="http://localhost:3000"
BACKOFFICE_SECRET_PATH=""
```

### Initialisation de la Base de Données

```bash
# Configurez Docker pour démarrer les services
$ docker-compose up -d

# Se rendre sur le container MySQL et créer une base de données shadow
$ mysql -h db -u root -p

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

---

Des tests unitaires peuvent être générés automatiquement pour les scripts situés dans src/app/api grâce à un script personnalisé. Voici comment les générer :

```bash
# Générer les fichiers de test pour les routes API
$ npm run generate-tests
```

Les fichiers de test incluent une couverture initiale des cas standards et edge cases.

## Workflow CI/CD

Un pipeline GitHub Actions est configuré pour :

- Installer les dépendances.
- Exécuter les tests unitaires.
- Générer des rapports de couverture.

### Workflow de base

```yaml
name: CI/CD Workflow

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

env:
  MYSQL_USER: user
  MYSQL_PASSWORD: password
  MYSQL_ROOT_PASSWORD: rootpassword
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  SHADOW_DATABASE_URL: ${{ secrets.SHADOW_DATABASE_URL }}
  NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: rootpassword
          MYSQL_DATABASE: test_db
          MYSQL_USER: user
          MYSQL_PASSWORD: password
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping --silent"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm install

      - name: Generate Prisma Client
        run: npx prisma generate --schema=prisma/schema.prisma

      - name: Install Jest Environment
        run: npm install jest-environment-jsdom --save-dev

      - name: Run Unit Tests
        run: npx jest --coverage

  deploy:
    name: Deploy to FTP
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Upload files via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ftp.rusu2228.odns.fr
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          server-dir: /
          local-dir: ./
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

## Authentification et Sécurité

L’application gère l’authentification avec NextAuth.js et Prisma, et propose un système de gestion des rôles (ADMIN, USER).

### Inscription et Connexion

- Inscription utilisateur via email avec hachage de mot de passe bcrypt.
- Connexion sécurisée avec NextAuth.js (JWT-based).
- Redirection automatique des utilisateurs après connexion.
- Gestion des erreurs et validation des entrées (email, mot de passe sécurisé).

📌 Endpoints associés :

- `/api/auth/register` → Crée un nouvel utilisateur.
- `/api/auth/login` → Authentifie un utilisateur.
- `/api/auth/session` → Vérifie l’état de connexion.

### Sécurisation du Backoffice

Seuls les admins enregistrés en base de données peuvent accéder au backoffice.

📌 Mécanismes mis en place :

- Vérification du rôle admin depuis la base de données avant affichage du backoffice.
- Middleware pour bloquer l’accès aux utilisateurs non autorisés.
- Redirection automatique vers `/` si l’utilisateur n’est pas admin.
- API sécurisée pour vérifier le rôle de l’utilisateur avant de récupérer les données du backoffice.

📌 Endpoints associés :

- `/api/auth/check-admin` → Vérifie si l’utilisateur est admin en base de données.
- `/api/backoffice/stats` → Récupère les statistiques (nombre d’utilisateurs, commandes, produits).

## Tâches effectuées par Ibrahima

### 🔒 Authentification et Sécurité

- Mise en place de NextAuth.js avec JWT pour la gestion de l'authentification.
- Sécurisation des mots de passe avec bcrypt et stockage sécurisé en base de données.
- Validation stricte des entrées utilisateur avec Zod pour éviter les injections SQL et XSS.
- Vérification du rôle ADMIN en base avant d'accorder l'accès aux routes protégées.
- Implémentation d'un système de rate limiting pour bloquer les attaques par force brute sur la connexion.
- Développement de la première itération des pages **Sign In** et **Register**.

### 🛡️ Sécurisation du Backoffice

- Restriction de l'accès au Backoffice uniquement aux admins.
- Ajout d’un middleware Next.js pour gérer l'authentification et les autorisations.
- Création d'une API `/api/auth/check-admin` permettant de vérifier si l’utilisateur est admin.
- Changement dynamique de l’URL du Backoffice via une variable `.env` pour plus de sécurité.
- Protection des API sensibles en bloquant les utilisateurs non connectés.
- Fusion des appels API pour optimiser les requêtes et améliorer la rapidité de chargement.

### 👤 Gestion du Profil, Paramètres et Dashboard Utilisateur

- Mise en place d'une page "Profil" dynamique, permettant aux utilisateurs de voir et modifier leurs informations.
- Modification sécurisée des informations personnelles (nom, email, mot de passe).
- Gestion de l'avatar utilisateur avec upload sécurisé d'images via Multer.
- Ajout d'un dashboard utilisateur affichant :
  - L’historique des commandes.
  - Les préférences utilisateur.
  - L’état des livraisons en temps réel.
- Mise en place des paramètres utilisateur, permettant de gérer les préférences de notifications et de sécurité.

### 🚀 Optimisation des API

- Fusion des appels API pour réduire les requêtes et améliorer les performances.
- Utilisation de Prisma avec des relations optimisées pour éviter les requêtes multiples.
- Ajout de pagination et filtrage pour charger les données plus rapidement.
- Implémentation de caching pour réduire la charge sur la base de données.
- Ajout d'une gestion des erreurs améliorée pour éviter les fuites d’informations en production.

### ⚙️ CI/CD et Tests

- Mise en place d’un pipeline GitHub Actions pour automatiser les tests à chaque commit.
- Ajout de tests unitaires avec Jest pour valider les fonctionnalités critiques.
- Intégration de Cypress pour tester l’interface et les parcours utilisateurs.
- Automatisation du déploiement après validation des tests.

### 📦 Gestion des Uploads et Sécurisation des Images

- Configuration de Multer pour gérer l’upload des fichiers de manière sécurisée.
- Filtrage des fichiers autorisés (jpg, png, webp) et limitation à 5 Mo.
- Protection contre les scripts malveillants en bloquant les fichiers exécutables.

### 🌍 Sécurité Avancée (CSRF, CORS, XSS)

- Mise en place de tokens CSRF pour protéger les requêtes critiques.
- Restriction des origines CORS pour empêcher les requêtes non autorisées.
- Activation d'une Content Security Policy (CSP) pour bloquer les scripts malveillants.
- Suppression des headers sensibles (X-Powered-By: Next.js) pour réduire l’exposition aux attaques.

### 📌 Développement du projet initial

- **Lancement du premier projet Auchan Drive** avec mise en place des bases du projet.

### 🎯 Résumé des Contributions

- ✅ Contribution au développement initial et fusion avec **EpiDrive**.
- ✅ Gestion complète du profil utilisateur (modification des infos, préférences, avatar).
- ✅ Mise en place et sécurisation du dashboard utilisateur.
- ✅ Backoffice sécurisé avec middleware et vérification des rôles.
- ✅ API optimisées pour un chargement plus rapide et sécurisé.
- ✅ Authentification robuste avec NextAuth.js, bcrypt et JWT.
- ✅ Sécurité renforcée contre XSS, CSRF, SQL Injection et attaques par force brute.
- ✅ CI/CD automatisé pour le projet avec tests et déploiement sécurisé.

## Contact

Pour toute question ou suggestion, contactez-nous via :

- mouhamadou.etu@gmail.com
- choeurtis.tchounga@gmail.com
- ibrahimabarry1503@gmail.com
