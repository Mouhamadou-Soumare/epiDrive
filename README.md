<h1 align="center">
  <br>
  <a href="#"><img src="https://github.com/Mouhamadou-Soumare/epiDrive/blob/main/public/img/logo.png" alt="EpiDrive" width="100"></a>
  <br>
  EpiDrive
  <br>
</h1>

<h4 align="center">Epidrive -  Faites de vos courses un plaisir, alliant saveurs et praticité en un clic.</h4>

<br/>
<br/>


![screenshot](https://github.com/Mouhamadou-Soumare/epiDrive/blob/main/public/img/demo-epidrive.png)
<br/>
<br/>




<br/>
<br/>

<br/>
<br/>

## Comment utiliser ce projet

Pour cloner et exécuter cette application, vous aurez besoin de [Git](https://git-scm.com) et de [Node.js](https://nodejs.org/fr/download/) (qui inclut [npm](http://npmjs.com)) installés sur votre ordinateur. À partir de votre ligne de commande :

```bash
# Clonez ce dépôt.
$ git clone https://github.com/your-username/epidrive

# Accédez à la racine du projet
$ cd epidrive

# Installez les dépendances
$ npm install

# Configurez Docker pour démarrer les services
$ docker-compose up -d

# Initialisez la base de données MySQL
$ npx prisma migrate dev --name init

# Générez le client Prisma
$ npx prisma generate

# Exécutez le script de seed pour insérer des données de base
$ node seed.js

# Lancez le serveur Next.js en mode développement
$ npm run dev
```


## Fonctionnalités et pages

L'application comprend les différentes pages suivantes :

/: Page d'accueil affichant les fonctionnalités principales et recommandations de produits.
/categories: Page listant les catégories de produits disponibles.
/category/[slug]: Page détaillée d'une catégorie, avec ses sous-catégories et produits.
/product/[slug]: Page affichant les détails d'un produit spécifique.
/shop: Page listant tous les produits disponibles.
/contact: Page de contact pour les utilisateurs.
404: Page d'erreur pour les routes non trouvées.





## Configuration des variables d'environnement (.env)

Pour configurer correctement l'application, vous devez créer un fichier .env à la racine du projet. Ce fichier contiendra les variables d'environnement nécessaires pour l'exécution de l'application.

Assurez-vous de ne jamais partager ce fichier .env publiquement, car il contient des informations sensibles telles que les identifiants de la base de données.



## Migrations et initialisation de la base de données

Pour initialiser et gérer la base de données MySQL avec Prisma, suivez les étapes ci-dessous :

```bash
# Créer la base de données shadow (dans le conteneur de la base de données avec l'user root) :
$ CREATE DATABASE shadow_epidrive;

# Appliquer les migrations Prisma (dans le conteneur web) :
$ npx prisma migrate dev --name init

# Générer le client Prisma (dans le conteneur web):
$ npx prisma generate

# Insérer des données de base dans la base de données (dans le conteneur web):
$ node seed.js

# Initialisez la base de données MySQL (dans le conteneur web)
$ npx prisma migrate dev --name init

# Générez le client Prisma
$ npx prisma generate

# Exécutez le script de seed pour insérer des données de base
$ node seed.js

```

## Développer en local avec Docker

L'application utilise Docker pour la base de données et phpMyAdmin. Vous pouvez démarrer l'ensemble du projet avec la commande suivante :

```
docker-compose up -d

```
Cela lancera les services suivants :

Base de données MySQL (port 3306)
phpMyAdmin pour la gestion visuelle de la base de données (port 8080)
Next.js (port 3000)

## Contact

Pour toute question ou suggestion, veuillez nous contacter via :
- mouhamadou.etu@gmail.com
- choeurtis.tchounga@gmail.com
- ibrahimabarry1503@gmail.com


