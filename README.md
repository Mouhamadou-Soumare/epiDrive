<h1 align="center">
  <br>
  <a href="#"><img src="https://github.com/Mouhamadou-Soumare/epiDrive/blob/main/public/img/logo.png" alt="epiDrive" width="100"></a>
  <br>
  EpiDrive
  <br>
</h1>

<h4 align="center">EpiDrive - Faites de vos courses un plaisir, alliant saveurs et praticité en un clic.</h4>

<br/>
<br/>

![screenshot](https://github.com/Mouhamadou-Soumare/epiDrive/blob/main/public/epidrive_demo.png)

<br/>
<br/>


**Site en production :** [EpiDrive](https://epidriveprod.rusu2228.odns.fr/)
**Tableau kanban :** [Notion](https://believed-joggers-659.notion.site/11accd89483e80e19d77f1dc809ec0d4?v=12accd89483e80658149000c9e74ea8e&pvs=4)
**Wireframe :** [Figma](https://www.figma.com/design/7wZVr5moBPdppHnSTdV6Zl/EEMI---Drive-Carrefour?node-id=176-1806&t=OFkuL1t2STlzgoxB-1)
**Diagrame UML :** [Plantuml](https://img.plantuml.biz/plantuml/png/hLRDRfj04Bxp57jCrKHgAkLG3bMGWreanw6kK_LcRM7iRW8itPyqKTBtIPx3BzR1BB26nMwa-cAO6SryytspivnBHONIUUPvK2Yc7iY4AbXpmO0yUWH_Rrdg4rQe-gMWEVZaZeha9nL7fnzEtzHscUcrovw2J0Gh5UE5JnJScpGifsk8xCGb5GYWCVrfuSI2fvgfLu4PALeAbc3yAkFKMAJYoQsLS0WhQTWO8hjMB6CI_LeuqMa9OWmXv9HbBaT9fVpDHThvtf-T6P_W6IQ3GkVaQ3ADmjdYc0GNbz7ic5m6duAlqImAvoOs4O38qa3v9CK7nNAme4zudjCYTKkC4w6qR0g5isMmM62jy9ZWSpmFus0UBA8hh1f-ZyEBA4JFDFesh_w3sUnw6ePjCm-v4NNOgGjXpLkPkXshssN5wL29ARiJb4bUEFkXgG0fdJBSiInpEXAUGioH2LkaTrrRiZEVDUOUlCQM6AvthIKj68Z1i6-jRbMm1vpdo3aPeynyqRHwWBs2_p91zcaKx1xfv_f71eSwgG_eMEKzBVrhNPkh0rNda81IxZOnm2tss8ugf18wgSnoiBjUfK9Kh0Ma3D_-qnhhSTGkASTKlkgOTP2NXiaXT64STWUiZHestsJgBN9N6YEgWy2ASlUI5LbF2cijyBLx8IGrfKC5Sr0KoQ0-kS5jSe30KRbZoY0V4xivHD7koaMTyQZiMPSqvxfGlTjhR55FhYxZQOZNGpZv74xsNmdsDVRqT7B27xlhmIVLVGHUQp01WxNYauIZ1T5xZSxxGhUFcnUl-zQeefy-jhUzJmIi1TSbUCsHDldwu-GJlMq0-eM7WRJ4ZumQv4XIQzgjZYphldWh_GvVLLlDHA1OKk52UzYy0Fw97T0OM0ywqiwbt3odkzsx_0xrpCQrWeobfqWRTqYwDf3USArGDaVHxWh6iAMvShtEQl1RKv0np3G8Q6jjtQv2UAYHnTKA4gN1yywXIAlFrxy0)


## Compte Admin DEMO en prod
- Identifiant: admindemo@epidrive.com
- Mdp : Epidrivedemo1234

---

## 🛠 **Technologies Utilisées**
- **Frontend** : Next.js (App Router, Tailwind CSS)
- **Backend** : Node.js, API Next.js
- **Base de données** : PostgreSQL
- **IA** : OpenAI / Hugging Face (analyse de texte et d’image)
- **Paiement** : Intégration Stripe
- **Déploiement** : O2Switch
- **Gestion de projet** : Méthode Agile (Scrum)

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
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_ROOT_PASSWORD=
DATABASE_URL=
SHADOW_DATABASE_URL=
RESEND_API_KEY=
RESEND_EMAIL_TO=
RESEND_EMAIL_FROM=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_BASE_URL=
CHATGPT_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
BACKOFFICE_SECRET_PATH=
```

### Initialisation de la Base de Données

```bash
# Configurez Docker pour démarrer les services
$ docker-compose up -d

# Se rendre sur le container MySQL et créer une base de données shadow
$ mysql -h db -u root -p

$ CREATE DATABASE shadow_epidrive;

## Dans le container web de docker ##
# Appliquer les migrations Prisma
$ npx prisma migrate dev --name init

# Générer le client Prisma
$ npx prisma generate

# Insérer des données de base (seed)
$ npx prisma db seed
```

## Fonctionnalités

- **Page d'accueil** : Presente l'application et recommandations de produits.
- **Authentification** :
  - `/register` : Connexion
  - `/signin` : Inscription
- **Back-office** : Backoffice de l'application
  - `/categorie` : Liste des catégories
  - `/categorie/[...slug]` : Voir la catégorie
  - `/categorie/add` : Ajouter une catégorie
  - `/categorie/update/[...slug]` : Mise à jour de la catégorie

  - `/commande` : Liste des commandes
  - `/commande/[...slug]` : Voir la commande

  - `/ingredient` : Liste des ingredients
  - `/ingredient/[...slug]` : Voir l'ingredient
  - `/ingredient/update/[...slug]` : Mise à jour un ingredient

  - `/product` : Liste des produits
  - `/product/[...slug]` : Voir un produit
  - `/product/add` : Ajouter une produit
  - `/product/update/[...slug]` : Mise à jour du produit

  - `/recette` : Liste des recettes
  - `/recette/[...slug]` : Voir une recette
  - `/recette/add` : Ajouter une recette
  - `/recette/update/[...slug]` : Mise à jour de la recette

  - `/utilisateur` : Liste des utilisateur
  - `/utilisateur/[...slug]` : Voir un utilisateur et ses commandes
- **Pages categorie** :
  - `/category` : Liste des categories
  - `/category/[...slug]` : Voir une categorie
- **Pages chatIA** :
  - `/chatIA` : Assistant IA
- **Pages checkout** :
  - `/checkout` : Formulaire de livraison
- **Pages checkout-success** :
  - `/checkout-success` : Information de la livraison
- **Pages produit** :
  - `/product/[...slug]` : Voir un produit
- **Pages profile** :
  - `/profile/orders` : Voir les commandes du client 
  - `/profile/setting` : Modifier les informations du client 
  - `/profile` : Parametre et statistique du client
- **Pages snap-and-cook** :
  - `/snap-and-cook` : Recherher les produits d'une recette à partir d'une photo
- **404** : Gestion des pages non trouvées.

## 🗂 **Matrice des Droits**

| **Fonctionnalité**                             | 🛒 **Client** | 👨‍💼 **Admin** |
|------------------------------------------------|---------------|--------------|
| **Rechercher des produits**                    | Oui           | Oui        |
| **Ajouter un produit au panier**               | Oui           | Oui        |
| **Passer une commande**                        | Oui           | Oui        |
| **Gérer les commandes (CRUD)**                 | Non           | Oui        |
| **Accéder au dashboard des statistiques**      | Non           | Oui        |
| **Accéder aux statistiques perso**             | Non           | Oui        |
| **Utiliser "SnapAndCook" (analyse image)**     | Oui           | Oui        |
| **Proposer des recettes avec l'IA**            | Oui           | Oui        |
| **Acces à l'assistant IA**                     | Oui           | Oui        |
| **Gérer les utilisateurs (CRUD)**              | Non           | Oui        |
| **Authentification et gestion de session**     | Oui           | Oui        |

---

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

Endpoints associés :

- `/api/auth/register` → Crée un nouvel utilisateur.
- `/api/auth/login` → Authentifie un utilisateur.
- `/api/auth/session` → Vérifie l’état de connexion.

### Sécurisation du Backoffice

Seuls les admins enregistrés en base de données peuvent accéder au backoffice.

Mécanismes mis en place :

- Vérification du rôle admin depuis la base de données avant affichage du backoffice.
- Middleware pour bloquer l’accès aux utilisateurs non autorisés.
- Redirection automatique vers `/` si l’utilisateur n’est pas admin.
- API sécurisée pour vérifier le rôle de l’utilisateur avant de récupérer les données du backoffice.

Endpoints associés :

- `/api/auth/check-admin` → Vérifie si l’utilisateur est admin en base de données.
- `/api/backoffice/stats` → Récupère les statistiques (nombre d’utilisateurs, commandes, produits).

## Tâches effectuées par Ibrahima

### Authentification et Sécurité

- Mise en place de NextAuth.js avec JWT pour la gestion de l'authentification.
- Sécurisation des mots de passe avec bcrypt et stockage sécurisé en base de données.
- Validation stricte des entrées utilisateur avec Zod pour éviter les injections SQL et XSS.
- Vérification du rôle ADMIN en base avant d'accorder l'accès aux routes protégées.
- Implémentation d'un système de rate limiting pour bloquer les attaques par force brute sur la connexion.
- Développement de la première itération des pages **Sign In** et **Register**.

### Sécurisation du Backoffice

- Restriction de l'accès au Backoffice uniquement aux admins.
- Ajout d’un middleware Next.js pour gérer l'authentification et les autorisations.
- Création d'une API `/api/auth/check-admin` permettant de vérifier si l’utilisateur est admin.
- Changement dynamique de l’URL du Backoffice via une variable `.env` pour plus de sécurité.
- Protection des API sensibles en bloquant les utilisateurs non connectés.
- Fusion des appels API pour optimiser les requêtes et améliorer la rapidité de chargement.

### Gestion du Profil, Paramètres et Dashboard Utilisateur

- Mise en place d'une page "Profil" dynamique, permettant aux utilisateurs de voir et modifier leurs informations.
- Modification sécurisée des informations personnelles (nom, email, mot de passe).
- Gestion de l'avatar utilisateur avec upload sécurisé d'images via Multer.
- Ajout d'un dashboard utilisateur affichant :
  - L’historique des commandes.
  - Les préférences utilisateur.
  - L’état des livraisons en temps réel.
- Mise en place des paramètres utilisateur, permettant de gérer les préférences de notifications et de sécurité.

### Optimisation des API

- Fusion des appels API pour réduire les requêtes et améliorer les performances.
- Utilisation de Prisma avec des relations optimisées pour éviter les requêtes multiples.
- Ajout de pagination et filtrage pour charger les données plus rapidement.
- Implémentation de caching pour réduire la charge sur la base de données.
- Ajout d'une gestion des erreurs améliorée pour éviter les fuites d’informations en production.

### CI/CD et Tests

- Mise en place d’un pipeline GitHub Actions pour automatiser les tests à chaque commit.
- Ajout de tests unitaires avec Jest pour valider les fonctionnalités critiques.
- Intégration de Cypress pour tester l’interface et les parcours utilisateurs.
- Automatisation du déploiement après validation des tests.

### Gestion des Uploads et Sécurisation des Images

- Configuration de Multer pour gérer l’upload des fichiers de manière sécurisée.
- Filtrage des fichiers autorisés (jpg, png, webp) et limitation à 5 Mo.
- Protection contre les scripts malveillants en bloquant les fichiers exécutables.

### Sécurité Avancée (CSRF, CORS, XSS)

- Mise en place de tokens CSRF pour protéger les requêtes critiques.
- Restriction des origines CORS pour empêcher les requêtes non autorisées.
- Activation d'une Content Security Policy (CSP) pour bloquer les scripts malveillants.
- Suppression des headers sensibles (X-Powered-By: Next.js) pour réduire l’exposition aux attaques.

### Développement du projet initial

- **Lancement du premier projet Auchan Drive** avec mise en place des bases du projet.

### Résumé des Contributions

- Contribution au développement initial et fusion avec **EpiDrive**.
- Gestion complète du profil utilisateur (modification des infos, préférences, avatar).
- Mise en place et sécurisation du dashboard utilisateur.
- Backoffice sécurisé avec middleware et vérification des rôles.
- API optimisées pour un chargement plus rapide et sécurisé.
- Authentification robuste avec NextAuth.js, bcrypt et JWT.
- Sécurité renforcée contre XSS, CSRF, SQL Injection et attaques par force brute.
- CI/CD automatisé pour le projet avec tests et déploiement sécurisé.

## Tâches effectuées par Choeurtis

### Backoffice & Gestion des Données

- Mise en place du Backoffice avec toutes les fonctionnalités essentielles
- Développement des CRUD complets pour les entités suivantes :
  - Utilisateurs
  - Produits
  - Recettes
  - Commandes
  - Catégories
  - Ingrédients
- Gestion avancée des fonctionnalités administratives

### Intégration de l’IA

- Implémentation de SnapAndCook pour l’analyse d’image et la reconnaissance des plats
- Développement de Jimmy pour la génération automatique de recettes basées sur les ingrédients détectés
- Intégration de ChatIA, un chatbot interactif pour assister les utilisateurs

### Gestion des Commandes

- Implémentation complète du workflow des commandes, incluant :
  - Ajout au panier
  - Validation de commande
  - Gestion des statuts (en attente, payé, en préparation, expédié, livré)
- Sécurisation et gestion des différentes étapes du processus

### Améliorations et Optimisation

- Mise en place et gestion des différentes fonctions du Backoffice
- Nettoyage et optimisation du code pour un meilleur maintien et évolutivité
- Gestion et optimisation des images de l’application

### Front & Backoffice

- Développement et intégration du front-office et du back-office
- Gestion des erreurs et des exceptions pour assurer une expérience utilisateur fluide

### Gestion de Projet

- Suivi des tâches et organisation sous méthodologie Agile
- Coordination avec l’équipe pour garantir un développement structuré et efficace

### Développement du projet initial

- **Lancement du premier projet Auchan Drive** avec mise en place des bases du projet.

### Résumé des Contributions

- Mise en place du **Backoffice** avec gestion complète des données.
- Développement des **CRUD** (Utilisateurs, Produits, Recettes, Commandes, Catégories, Ingrédients).
- Intégration de **SnapAndCook** (analyse d'image), **Jimmy** (génération de recettes), et **ChatIA** (chatbot).
- Gestion du **workflow des commandes** et optimisation des étapes de validation.
- Améliorations UX/UI, sécurisation et nettoyage du code.

## Tâches effectuées par Mouhamadou

### Développement et Infrastructure

- Mise en place de la première version de l'application (backend, frontend, base de données)
- Création du jeu de données complet avec images optimisées en WebP
- CRUD front-office des catégories, produits, panier...
- Implémentation des catégories et sous-catégories de produits
- Développement de 90% du frontend et création des templates d’email
- Workflow commande : Ajout au panier ➝ Validation de commande ➝ Paiement Stripe
- Corrections des sessions utilisateurs

### Intégration de l’IA

- Première itération de "Snap & Cook" : prise de photo d’un plat → détection des ingrédients → ajout automatique à la liste de courses
- Suggestion de recettes et de plats personnalisés
- Analyse avancée des ingrédients pour recommander des achats complémentaires

### Identité Visuelle & Expérience Utilisateur

- Création de l’identité visuelle du site (logo, charte graphique, branding)
- Optimisation du design UX/UI pour une navigation fluide
- Gestion de la responsivité

### Déploiement et Sécurité

- Hébergement et mise en production sur O2Switch : Configuration complète du serveur incluant gestion en SSH, déploiement de la base de données en production, résolution des bugs liés au build, et optimisation du déploiement pour assurer la stabilité et la performance de l'application.
- Implémentation de Server-Sent Events (SSE) pour des mises à jour en temps réel (suivi des commandes, notifications, statistiques)
- Respect des bonnes pratiques de Clean Code

### Gestion de projet
- Suivi des tâches et organisation sous méthodologie Agile
- Coordination avec l’équipe pour garantir un développement structuré et efficace

### Développement du projet initial

- **Lancement du premier projet Auchan Drive** avec mise en place des bases du projet.

### Résumé des Contributions

- Développement du **frontend** (90% du front réalisé).
- Implémentation de **l’IA** pour la reconnaissance d’image et suggestions de recettes.
- **Intégration Stripe** pour le paiement sécurisé.
- Mise en production sur **O2Switch** avec **SSE** pour notifications en temps réel.
- Suivi du projet avec **méthodologie Agile**.

## Contact

Pour toute question ou suggestion, contactez-nous via :

- mouhamadou.etu@gmail.com
- choeurtis.tchounga@gmail.com
- ibrahimabarry1503@gmail.com
