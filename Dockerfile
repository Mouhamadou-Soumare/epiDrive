# Étape de développement utilisant une version légère de Node.js
FROM node:18-bullseye

# Installer des outils de build essentiels pour des dépendances natives (comme bcrypt)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour l'installation des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --force

# Recompiler bcrypt pour la compatibilité avec l'environnement Debian
RUN npm rebuild bcrypt --build-from-source

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port utilisé par l'application Next.js
EXPOSE 3000

# Définir les variables d'environnement pour le hot reload
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Installer nodemon globalement pour le hot reload
RUN npm install -g nodemon

# Lancer l'application en mode développement avec nodemon
CMD ["nodemon", "-L", "npm", "run", "dev"]