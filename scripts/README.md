# 🛠️ Scripts Utilitaires

Ce dossier contient des scripts bash pour gérer le monorepo LolTimeFlash.

---

## 📜 Scripts Disponibles

### 🧹 `clean.sh`

**Description** : Nettoie en profondeur tous les caches, node_modules et fichiers de build à tous les niveaux du monorepo.

**Usage** :
```bash
# Depuis la racine du projet
pnpm clean

# Ou directement
bash scripts/clean.sh
```

**Ce qui est nettoyé** :
- ✅ Root `node_modules/`, `.turbo/`, `pnpm-lock.yaml`
- ✅ Frontend (apps/web) : `node_modules/`, `.next/`, `.turbo/`, `dist/`
- ✅ Backend (apps/api) : `node_modules/`, `dist/`, `.turbo/`
- ✅ Packages (shared, eslint-config) : `node_modules/`, `dist/`
- ✅ Old Backend (BackLolTimeFlash) : `node_modules/`, `pnpm-lock.yaml`

**Quand l'utiliser** :
- 🐛 Après des erreurs de build inexpliquées
- 📦 Après avoir changé de version Node/PNPM
- 🔄 Avant de réinstaller toutes les dépendances
- 🧪 Pour un environnement propre avant de tester

---

### 🚀 `get_started.sh`

**Description** : Script d'installation et de configuration du monorepo. Installe toutes les dépendances et affiche les commandes disponibles.

**Usage** :
```bash
# Depuis la racine du projet
pnpm get_started

# Ou directement
bash scripts/get_started.sh
```

**Ce que fait le script** :
1. ✅ Vérifie que PNPM est installé (installe si nécessaire)
2. ✅ Affiche les versions Node.js et PNPM
3. ✅ Installe toutes les dépendances du workspace
4. ✅ Affiche la structure du projet
5. ✅ Liste toutes les commandes disponibles
6. ✅ Affiche les URLs des services

**Quand l'utiliser** :
- 🆕 Premier setup du projet
- 🔄 Après un `pnpm clean`
- 👥 Pour onboard un nouveau développeur
- 📖 Pour rappeler les commandes disponibles

---

## 🎯 Workflow Recommandé

### Setup Initial
```bash
git clone <repo>
cd LolTimeFlash
pnpm get_started
pnpm dev
```

### Reset Complet
```bash
pnpm clean
pnpm get_started
pnpm dev
```

### Développement Quotidien
```bash
pnpm dev              # Lance tous les services
pnpm dev:web          # Seulement le frontend
pnpm dev:api          # Seulement le backend
```

---

## 📋 Toutes les Commandes

### 🚀 Développement
| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance tous les services |
| `pnpm dev:web` | Lance seulement le frontend |
| `pnpm dev:api` | Lance seulement le backend |

### 🏗️ Build
| Commande | Description |
|----------|-------------|
| `pnpm build` | Build tous les apps |
| `pnpm build:web` | Build seulement le frontend |
| `pnpm build:api` | Build seulement le backend |

### 🔍 Qualité du Code
| Commande | Description |
|----------|-------------|
| `pnpm lint` | Lint tous les apps |
| `pnpm lint:fix` | Fix les erreurs de lint |
| `pnpm format` | Format le code avec Prettier |
| `pnpm type-check` | Vérification TypeScript |

### 🧪 Tests
| Commande | Description |
|----------|-------------|
| `pnpm test` | Lance tous les tests |

### 🧹 Maintenance
| Commande | Description |
|----------|-------------|
| `pnpm clean` | Nettoie tous les caches (script bash) |
| `pnpm get_started` | Réinstalle et affiche les infos |

---

## 🌐 URLs des Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface Next.js |
| **Backend** | http://localhost:4000 | API NestJS + Socket.IO |

---

## 💡 Tips

### Problème de dépendances
```bash
pnpm clean && pnpm get_started
```

### Build lent
```bash
# Nettoyer le cache Turbo
rm -rf .turbo apps/*/.turbo
```

### Erreur "port already in use"
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9

# Ou sur le port 4000
lsof -ti:4000 | xargs kill -9
```

---

## 📝 Notes

- Les scripts utilisent des codes couleur ANSI pour une meilleure lisibilité
- Les scripts sont compatibles bash/zsh (macOS/Linux)
- Pour Windows, utiliser WSL ou Git Bash
- Les scripts sont idempotents (peuvent être relancés sans risque)

---

**Dernière mise à jour** : 12 Novembre 2025

