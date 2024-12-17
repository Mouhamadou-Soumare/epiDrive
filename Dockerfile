FROM node:18-bullseye AS builder

# Installer les outils nécessaires, y compris OpenSSL et libssl-dev
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm install --legacy-peer-deps --force

# Recompiler bcrypt et autres dépendances natives
RUN npm rebuild bcrypt --build-from-source

# Copier les fichiers de l'application
COPY . .

# Générer Prisma Client (Prisma nécessite OpenSSL à ce stade)
RUN npx prisma generate

# Définir les variables d'environnement par défaut
ENV NODE_ENV=development

# Exposer le port utilisé par l'application
EXPOSE 3000

# Lancer l'application en mode développement
CMD ["npm", "run", "dev"]
