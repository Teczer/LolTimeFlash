# Utilisez une image Node.js en tant que base
FROM node:20.9.0-alpine
# Définissez le répertoire de travail
WORKDIR /app
RUN npm install --global pnpm

# Copiez le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN pnpm install --no-frozen-lockfile
RUN pnpm install next

# Copiez le reste des fichiers de l'application
COPY . .

# Construisez l'application Next.js
RUN pnpm run build

# Exposez le port sur lequel l'application sera en cours d'exécution
EXPOSE 6444

# Démarrez l'application
CMD ["pnpm", "start", "--", "-p", "6444"]
