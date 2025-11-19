# 🎮 Guide de Configuration - Riot API

## ✅ Migration Complétée : Next.js → NestJS

L'API Riot a été **migrée avec succès** de Next.js vers NestJS pour une meilleure architecture backend centralisée.

---

## 🔧 Configuration Rapide

### 1. Obtenir votre clé API Riot

1. Allez sur : **https://developer.riotgames.com/**
2. Connectez-vous avec votre compte Riot Games
3. Dans "Development API Key", cliquez sur **"REGENERATE API KEY"**
4. Copiez la clé (format : `RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

⚠️ **Important** : La clé de développement expire après **24 heures**.

---

### 2. Configurer le fichier `.env` (racine du projet)

Éditez le fichier `.env` à la **racine du projet** :

```bash
# Ouvrez le fichier
nano .env

# Ou avec votre éditeur préféré
code .env
```

**Ajoutez votre clé Riot** :

```bash
# Riot API Configuration
RIOT_API_KEY=RGAPI-votre-vraie-cle-ici
```

**Exemple complet du `.env`** :

```bash
# API Configuration
API_PORT=8888
LOG_LEVEL=debug

# Frontend Configuration
WEB_PORT=6333

# Socket.IO URL
NEXT_PUBLIC_SOCKET_PORT=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NODE_ENV=development

# Riot API Configuration
RIOT_API_KEY=RGAPI-a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

### 3. Lancer l'application

```bash
# Terminal 1 : Backend NestJS
cd apps/api
pnpm dev
# ✅ Backend lancé sur http://localhost:3001

# Terminal 2 : Frontend Next.js
cd apps/web
pnpm dev
# ✅ Frontend lancé sur http://localhost:6333
```

---

## 🧪 Tester la Fonctionnalité

### Prérequis
- ✅ Backend NestJS lancé (`apps/api`)
- ✅ Frontend Next.js lancé (`apps/web`)
- ✅ Clé API Riot configurée dans `.env`
- ✅ Vous êtes **en partie en cours** (pas en file d'attente)

### Étapes de Test

1. **Ouvrez l'app** : http://localhost:6333/game
2. **Entrez votre pseudo LoL** (ex : "Faker")
3. **Sélectionnez votre région** (ex : "KR", "EUW", "NA")
4. **Cliquez sur "Fetch Live Game"**

**Résultat attendu** :
- ✅ Toast : "Success - Live game data fetched successfully!"
- ✅ Les icônes de champions remplacent les rôles génériques
- ✅ Les noms des joueurs adverses s'affichent
- ✅ Cosmic Insight est automatiquement activé (si détecté)

---

## 🏗️ Architecture Technique

### Avant (Next.js API)
```
Frontend → /api/riot/live-game (Next.js) → Riot API
```

### Après (NestJS Backend) ✅
```
Frontend → http://localhost:3001/riot/live-game (NestJS) → Riot API
```

### Endpoints NestJS

**POST** `/riot/live-game`

**Request Body** :
```json
{
  "summonerName": "Faker",
  "region": "kr"
}
```

**Response** :
```json
{
  "success": true,
  "data": {
    "allies": [...],
    "enemies": [
      {
        "championId": 266,
        "championName": "Aatrox",
        "championIconUrl": "https://ddragon.leagueoflegends.com/cdn/.../Aatrox.png",
        "summonerName": "EnemyPlayer1"
      }
    ],
    "gameStartTime": 1700000000000
  }
}
```

---

## 📂 Structure des Fichiers

### Backend (NestJS)
```
apps/api/src/
├── riot/
│   ├── riot.module.ts          # Module Riot
│   ├── riot.controller.ts      # Controller HTTP
│   └── riot.service.ts         # Logique métier
├── shared/types/
│   └── riot-api.types.ts       # Types TypeScript
└── app.module.ts               # Import RiotModule + ConfigModule
```

### Frontend (Next.js)
```
apps/web/
└── lib/
    └── riot-api.service.ts     # Service pour appeler le backend NestJS
```

### Configuration
```
.env                            # Variables d'environnement (RIOT_API_KEY ici)
.env.example                    # Template avec documentation
```

---

## 🔍 Vérification

### Vérifier que le backend charge bien la clé API

Lancez le backend et cherchez ce log :

```bash
cd apps/api
pnpm dev
```

**Si la clé est configurée** :
```
✅ Pas de warning "RIOT_API_KEY not found"
```

**Si la clé est manquante** :
```
⚠️  RIOT_API_KEY not found in environment variables. Live game feature will not work.
```

### Tester l'endpoint directement (curl)

```bash
curl -X POST http://localhost:3001/riot/live-game \
  -H "Content-Type: application/json" \
  -d '{
    "summonerName": "VotrePseudo",
    "region": "euw1"
  }'
```

**Réponse attendue** :
```json
{
  "success": true,
  "data": { ... }
}
```

---

## ❌ Dépannage

### Erreur : "Riot API key not configured"
- ✅ Vérifiez que `RIOT_API_KEY` est dans le `.env` à la **racine du projet**
- ✅ Relancez le backend NestJS (`pnpm dev` dans `apps/api`)
- ✅ Vérifiez qu'il n'y a pas de typo (format : `RGAPI-...`)

### Erreur : "Summoner not found"
- ✅ Vérifiez l'orthographe du pseudo
- ✅ Vérifiez que la région est correcte (EUW, NA, KR, etc.)
- ✅ Le pseudo est sensible à la casse

### Erreur : "No active game found"
- ✅ Vous devez être **en partie en cours** (pas en lobby, pas en queue)
- ✅ La partie doit avoir démarré (après champion select)

### Erreur : "Failed to fetch live game data"
- ✅ Vérifiez que le backend NestJS est lancé (`http://localhost:3001`)
- ✅ Vérifiez les logs du backend pour plus de détails
- ✅ Vérifiez votre connexion internet

### Clé API expirée (après 24h)
1. Retournez sur https://developer.riotgames.com/
2. Cliquez sur "REGENERATE API KEY"
3. Copiez la nouvelle clé
4. Mettez à jour le `.env`
5. Relancez le backend

---

## 🚀 Avantages de l'Architecture NestJS

✅ **Sécurité** : La clé API n'est jamais exposée au client  
✅ **Centralisation** : Toute la logique backend au même endroit  
✅ **Scalabilité** : Facile d'ajouter d'autres endpoints Riot  
✅ **Logs & Monitoring** : Intégré au système existant (Winston)  
✅ **Réutilisabilité** : Le service Riot peut être utilisé ailleurs  
✅ **Type Safety** : TypeScript strict sur frontend et backend  

---

## 📝 Changelog

### Version 0.4.1 (19 Nov 2024) - Migration NestJS
- ✅ Migration de Next.js API Route vers NestJS
- ✅ Ajout de `@nestjs/config` pour gestion des env vars
- ✅ ConfigModule configuré pour lire `.env` racine
- ✅ Suppression de `apps/web/app/api/riot/`
- ✅ Mise à jour de `.env.example` avec `RIOT_API_KEY`
- ✅ Frontend appelle maintenant `http://localhost:3001/riot/live-game`

---

## 📚 Ressources

- **Riot Developer Portal** : https://developer.riotgames.com/
- **Documentation API** : https://developer.riotgames.com/apis
- **Data Dragon** : https://developer.riotgames.com/docs/lol#data-dragon
- **NestJS Config** : https://docs.nestjs.com/techniques/configuration

---

**Dernière mise à jour** : 19 Novembre 2024  
**Version** : 0.4.1  
**Status** : ✅ Migration Complétée

