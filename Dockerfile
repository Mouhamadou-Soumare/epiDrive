# === Étape 1 : Builder les dépendances avec une version légère de Node.js ===
FROM node:18-bullseye AS builder

# Installer des outils de build essentiels pour des dépendances natives (comme bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json pour le cache des dépendances
COPY package*.json ./

# Installer les dépendances en production pour éviter les fichiers inutiles
RUN npm install --force --legacy-peer-deps

# Recompiler bcrypt pour la compatibilité avec l'environnement Debian
RUN npm rebuild bcrypt --build-from-source

# === Étape 2 : Copier le code source et préparer l'image finale ===
FROM node:18-alpine AS development

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances déjà installées depuis l'étape "builder"
COPY --from=builder /app/node_modules ./node_modules

# Copier le reste des fichiers de l'application
COPY . .

# Installer nodemon globalement pour le hot reload
RUN npm install -g nodemon

# Exposer le port utilisé par l'application
EXPOSE 3000

# Définir les variables d'environnement pour le hot reload
ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true

# Lancer l'application en mode développement avec nodemon
CMD ["nodemon", "-L", "npm", "run", "dev"]
