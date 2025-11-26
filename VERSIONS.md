# 🔄 LolTimeFlash - Version History

> **📌 Note** : Ce fichier centralise tout l'historique des versions du projet.  
> Pour les guidelines de versioning et MR, consultez [`AGENTS.md`](./AGENTS.md) section "Versioning & Merge Requests Guidelines".

---

## 📚 Version History

### Version 2.3.3 - November 2025 (Components Architecture Refactor)

**Refactoring** :

- ♻️ **Components Organization** : Réorganisation des composants en dossiers logiques (`game/`, `room/`, `status/`, `controls/`)
- 🔄 **Path Aliases Migration** : Migration de tous les imports relatifs vers des alias TypeScript (`@/features/game/...`)
- 📁 **Simplified Structure** : Suppression des dossiers `ui/` et `input/` inutiles

**Technical Changes** :

**Frontend** :
- Nouvelle structure : `components/game/`, `components/room/`, `components/status/`, `components/controls/`
- Migration complète des imports relatifs vers `@/features/game/...`
- Création de barrel exports (`index.ts`) pour chaque dossier
- Amélioration du support IDE (autocomplete, refactoring)

**Fichiers Modifiés** :

| Fichier                                                      | Changements                                    |
| ------------------------------------------------------------ | ---------------------------------------------- |
| `apps/web/features/game/components/game/*`                  | Déplacés depuis root, imports mis à jour     |
| `apps/web/features/game/components/room/*`                  | Déplacés depuis root, imports mis à jour     |
| `apps/web/features/game/components/status/*`                | Déplacés depuis root, imports mis à jour     |
| `apps/web/features/game/components/controls/*`              | Déplacés depuis root, imports mis à jour     |
| `apps/web/features/game/components/*.tsx`                   | Imports mis à jour vers alias                 |
| `apps/web/features/game/screens/*.tsx`                      | Imports mis à jour vers alias                 |
| `apps/web/features/game/contexts/*.tsx`                     | Imports mis à jour vers alias                 |
| `apps/web/features/game/hooks/*.ts`                         | Imports mis à jour vers alias                 |
| `apps/web/features/game/constants/*.ts`                     | Imports mis à jour vers alias                 |

**Impact** :

- ✅ Organisation améliorée (composants groupés par fonctionnalité)
- ✅ Imports cohérents (tous utilisent des alias)
- ✅ Support IDE amélioré (autocomplete, refactoring)
- ✅ Maintenabilité accrue (navigation facilitée)
- ✅ Scalabilité améliorée (ajout de composants simplifié)

---

### Version 2.3.2 - November 2025 (Username Validation & Lobby Refactor)

**New Features** :

- ✨ **Username Length Validation** : Validation stricte 3-12 caractères (backend + frontend)
- 🎨 **Visual Validation Feedback** : Indicateurs check/croix en temps réel avec feedback couleur
- 🏗️ **Lobby Architecture Refactor** : Réécriture complète en composants atomiques mémorisés
- ⚡ **Performance Improvements** : Mémorisation des composants réduit les re-renders

**Security** :

- 🔐 **Backend Validation** : Protection contre la manipulation localStorage (username > 12 chars rejeté)

**Technical Changes** :

**Backend** :
- Nouveau fichier : `apps/api/libs/shared/src/constants/username.ts` (MIN/MAX constants)
- Mise à jour : `JoinRoomDto` validation (3-12 caractères avec constantes locales)

**Frontend** :
- Nouveau composant : `UsernameValidationFeedback.component.tsx` (feedback réutilisable)
- Nouveaux composants lobby : `CreateLobbyForm`, `JoinLobbyForm`, `LobbyDivider`
- Refactoring : `app/lobby/page.tsx` (134 → 28 lignes, -78%)
- Architecture : Pattern `features/` avec barrel exports
- Mémorisation : `React.memo()` sur tous les nouveaux composants

**Fichiers Modifiés** :

| Fichier                                                    | Changements                                  |
| ---------------------------------------------------------- | -------------------------------------------- |
| `apps/api/libs/shared/src/constants/username.ts`           | **Created** - Constantes longueur username   |
| `apps/api/src/game/dto/join-room.dto.ts`                   | Validation 3-12 caractères                   |
| `apps/web/features/settings/components/username-validation-feedback.component.tsx` | **Created** - Composant feedback |
| `apps/web/features/lobby/components/create-lobby-form.component.tsx` | **Created** - Form création            |
| `apps/web/features/lobby/components/join-lobby-form.component.tsx` | **Created** - Form join                  |
| `apps/web/features/lobby/components/lobby-divider.component.tsx` | **Created** - Divider mémorisé           |
| `apps/web/features/lobby/components/index.ts`              | **Created** - Barrel exports                 |
| `apps/web/app/lobby/page.tsx`                              | **Refactored** - Réduction de 78%            |
| `features/settings/components/username-input-modal.component.tsx` | Intégration feedback validation      |
| `app/settings/page.tsx`                                    | Intégration feedback validation              |

**Impact** :

- ✅ Sécurité renforcée (validation backend)
- ✅ UX améliorée (feedback visuel instantané)
- ✅ Architecture propre (composants atomiques)
- ✅ Performance optimisée (mémorisation)
- ✅ Maintenabilité accrue (code -78% sur lobby)

---

### Version 2.3.1 - November 2025 (Username Storage Refactor)

**Refactoring & Optimization** :

- ♻️ **Username Storage Simplification** : Suppression de `username.store.ts` (Zustand) au profit de `localStorage` direct
- ⚡ **useState Optimization** : Initialisation directe depuis `localStorage` dans `useState` (suppression des `useEffect` redondants)
- 🏗️ **Architecture Cleanup** : Simplification de 3 fichiers (`username-provider`, `settings/page`, `game/[roomId]/page`)

**Documentation** :

- 📝 **VERSIONS.md** : Création d'un fichier dédié pour l'historique des versions
- 📝 **AGENTS.md** : Cleanup (suppression "Known Issues", version history déplacée, ajout guidelines MR)

**Fichiers Modifiés** :

| Fichier                                                    | Changements                                  |
| ---------------------------------------------------------- | -------------------------------------------- |
| `apps/web/app/store/username.store.ts`                     | **Deleted** (remplacé par localStorage)      |
| `apps/web/components/providers/username-provider.component.tsx` | Zustand → useState + localStorage           |
| `apps/web/features/settings/components/username-input-modal.component.tsx` | Zustand → localStorage direct               |
| `apps/web/app/settings/page.tsx`                           | useEffect → useState init                    |
| `apps/web/app/game/[roomId]/page.tsx`                      | Zustand → useState + localStorage            |
| `AGENTS.md`                                                | Cleanup + ajout guidelines MR                |
| `VERSIONS.md`                                              | **Created** - Historique des versions        |

**Impact** :

- ✅ Réduction de ~40 lignes de code (suppression store + useEffect inutiles)
- ✅ Performance légèrement améliorée (moins de re-renders)
- ✅ Code plus simple et maintenable

---

### Version 2.3.0 - November 2025 (Timer Calibration Controls & UX Polish)

**New Features - Timer Calibration & Visual Enhancements** :

- ✨ **Timer Calibration Controls** : Ajout de boutons +2s/-2s pour recalibrer les timers en temps réel
- ⏱️ **Fake Advance** : Les timers démarrent maintenant à X:57 (3s d'avance) pour simuler le délai de réaction
- 🎨 **Zilean Abilities Icons** : Utilisation des sorts de Zilean (W/E) pour les boutons de calibration
- 🏗️ **Component Architecture** : Création de `TimerControlButton` composant réutilisable
- ✨ **Visual Effects** : Effets de désaturation/saturation avec glow coloré au hover (rouge/cyan)
- 🌐 **Assets Migration** : Migration des icônes de rôle de Cloudinary vers assets locaux

**Backend Changes** :

- Nouveau DTO : `AdjustTimerDto` pour validation des ajustements
- Nouveau service method : `adjustTimer(roomId, role, adjustment)` dans `GameService`
- Nouveau WebSocket event : `game:adjust-timer` dans `GameGateway`
- Update shared types : Ajout de `game:adjust-timer` à `ClientToServerEvents`

**Frontend Changes** :

- Nouveau composant : `TimerControlButton.component.tsx` (bouton atomique réutilisable)
- Nouveau composant : `TimerControls.component.tsx` (conteneur des boutons)
- Ajout `adjustTimer` function dans `GameContext` pour mode solo
- Ajout `emitAdjustTimer` dans `useSocket` hook pour mode multiplayer
- Intégration dans `RoleCard` avec conditional rendering (uniquement si cooldown actif)

**Visual Design** :

- État repos : `saturate-50` + `brightness-90` + `opacity-80` (garde couleur subtile)
- Hover : `saturate-100` + `brightness-110` + `opacity-100` + glow (rouge/cyan)
- Active : `scale-95` pour feedback tactile
- Glow dynamique avec `boxShadow` inline (Tailwind limitation bypass)

**Fichiers Modifiés** :

| Fichier                                                                | Changements                                        |
| ---------------------------------------------------------------------- | -------------------------------------------------- |
| `apps/api/src/game/game.service.ts`                                    | Ajout `adjustTimer` + fake advance dans `useFlash` |
| `apps/api/src/game/game.gateway.ts`                                    | Handler `game:adjust-timer`                        |
| `apps/api/src/game/dto/adjust-timer.dto.ts`                            | Nouveau DTO                                        |
| `apps/api/libs/shared/src/types/socket.types.ts`                       | Nouveau event                                      |
| `apps/web/features/game/components/timer-control-button.component.tsx` | Nouveau composant                                  |
| `apps/web/features/game/components/timer-controls.component.tsx`       | Nouveau composant                                  |
| `apps/web/features/game/components/role-card.component.tsx`            | Intégration TimerControls                          |
| `apps/web/features/game/contexts/game.context.tsx`                     | Ajout `adjustTimer` function                       |
| `apps/web/hooks/use-socket.hook.ts`                                    | Ajout `emitAdjustTimer`                            |
| `apps/web/features/game/constants/game.constants.ts`                   | Migration Cloudinary → local assets                |

**Impact** : 🟢 Feature majeure pour améliorer la précision et l'UX des timers

---

### Version 2.2.0 - November 2025 (Timer Synchronization Fix)

**Critical Bug Fix - Timestamp-Based Timer Architecture** :

- 🐛 **Fixed Timer Sync** : Résolution du bug de désynchronisation des timers entre clients (5-10s de décalage)
- ✅ **Architecture Timestamp-Based** : Migration complète vers système basé sur timestamps absolus
- ✅ **Calcul Dynamique** : Les countdowns sont maintenant calculés dynamiquement avec `Date.now()`
- ✅ **Zero Time Drift** : Plus de dérive temporelle grâce au recalcul à chaque tick
- ✅ **Multiplayer Sync** : Synchronisation parfaite entre tous les clients (±1s max)
- ✅ **Reconnection Resilience** : Les timestamps restent valides après reconnexion/refresh

**Problème Résolu** :

Avant cette version, les timers utilisaient une architecture hybride défectueuse :

- Backend : Stockait des timestamps (correct) ✅
- Frontend : Convertissait en countdown puis décrémentait localement ❌

Cela causait des décalages de 5-10 secondes entre devices après quelques minutes de jeu.

**Solution Implémentée** :

```typescript
// ❌ AVANT : Conversion + décrémentation locale
const countdown = timestampToCountdown(backendRoleData.isFlashed)
const newValue = roleData.isFlashed - 1 // Chaque client décrémente indépendamment

// ✅ APRÈS : Calcul dynamique basé sur timestamp
const isFlashedValue = backendRoleData.isFlashed // Stocke le timestamp directement
const remainingSeconds = getRemainingTime(cooldown) // Calcul avec Date.now() actuel
```

**Fichiers Modifiés** :

| Fichier                       | Changements                                  |
| ----------------------------- | -------------------------------------------- |
| `use-flash-cooldown.hook.ts`  | Ajout `getRemainingTime()` helper            |
| `use-game-timer.hook.ts`      | Réécriture complète (plus de décrémentation) |
| `game-multiplayer.screen.tsx` | Suppression conversion timestamp → countdown |
| `game.context.tsx`            | `useFlash` et `toggleItem` timestamp-based   |
| `flash-button.component.tsx`  | Calcul dynamique + tick state pour re-render |
| `role-card.component.tsx`     | Cleanup console.log                          |
| `game.types.ts`               | Documentation sémantique timestamp           |

**Testing** :

- ✅ Synchronisation multi-device validée
- ✅ Reconnexion sans reset du timer
- ✅ Toggle items recalcule correctement
- ✅ Solo mode fonctionne
- ✅ Pas de memory leak ou performance issue

**Impact** : 🟢 Bug critique résolu, application maintenant production-ready pour le multiplayer

---

### Version 2.1.1 - November 2025 (Documentation & Docker Fixes)

**Documentation Complete & Critical Fixes** :

- ✅ **Docker Fixes** : 3 bugs critiques résolus (API runtime, Web TypeScript resolution, scripts paths)
- ✅ **Documentation** : README + AGENTS.md complètement mis à jour (1638 lignes)
- ✅ **Shared Types Architecture** : Flux documenté avec diagrammes
- ✅ **Cleanup** : Suppression de 5 fichiers temporaires de migration
- ✅ **Demo Section** : README prêt pour video/GIF marketing
- ✅ **Production Ready** : Docker test suite passe complètement

**Fixes Appliqués** :

- `apps/api/Dockerfile` : CMD path fix (`dist/src/main`)
- `apps/api/package.json` : Scripts start/start:prod corrigés
- `apps/web/Dockerfile` : TypeScript resolution fix (copy apps/api/libs)

---

### Version 2.0.0 - November 2025 (NestJS Monorepo)

**Major Architecture Refactor** :

- ✅ **Backend NestJS** : Migration vers NestJS 11.0 avec architecture modulaire
- ✅ **Monorepo Library** : `apps/api/libs/shared` comme source unique de vérité
- ✅ **WebSocket Gateway** : GameGateway avec validation DTO et error handling
- ✅ **Monitoring** : Health checks, metrics, Winston logging avec rotation
- ✅ **Docker Optimisé** : Multi-stage builds, health checks, volumes persistants
- ✅ **Type Safety** : Types partagés entre API et Web (zero duplication)
- ✅ **Turborepo** : Builds parallèles et caching intelligent

**Breaking Changes** :

- API backend maintenant séparé (port 8888)
- Environment variables restructurées
- Docker Compose avec health checks requis

**Migration Path** :

1. `pnpm install` (nouvelles dépendances)
2. Mettre à jour `.env` (voir section Environment Variables)
3. `pnpm docker:test` pour vérifier Docker
4. `pnpm dev` pour développement local

---

### Version 0.3.0 - November 2024 (Phase 3.5 - Option A)

**Major Refactoring & Polish**:

- ✅ **Git Cleanup**: Supprimé 545+ fichiers inutiles (`node_modules`, `data/` 126 MB, `dist/`)
- ✅ **Components Architecture**: Réorganisation complète avec `providers/`, `layout/`, `features/`
- ✅ **TypeScript Strict**: socket.js → socket.ts, ESLint strict rules, supprimé tous les `any`
- ✅ **Error Boundaries**: Ajout React Error Boundary pour catch les crashes
- ✅ **Socket Disconnect UX**: Indicateur de connexion animé avec reconnection tracking

**Breaking Changes**:

- socket.js → socket.ts (mais backward compatible car exports/imports mis à jour)
- Components déplacés (imports automatiquement mis à jour)
- ESLint strict (0 `any`, 0 unused vars autorisés)

**Nouveaux Composants**:

1. **ErrorBoundary** (`components/error-boundary.component.tsx`)
   - Catch toutes les erreurs JavaScript
   - UI fallback user-friendly
   - Boutons "Reload Page" et "Go Home"

2. **ConnectionStatus** (`features/game/components/connection-status.component.tsx`)
   - Indicateur temps réel (Connected / Reconnecting / Connection Lost)
   - Tracking reconnect attempts
   - Animations claires (pulse, spinner)

**Architecture Improvements**:

```
apps/web/components/
├── providers/       ← NOUVEAU (query, username)
├── layout/          ← NOUVEAU (background, footer, settings)
├── ui/              ← NETTOYÉ (primitives only)
└── error-boundary   ← NOUVEAU

apps/web/features/
├── game/components/
│   └── connection-status.component.tsx  ← NOUVEAU
└── settings/components/                  ← NOUVEAU
    ├── background-selector.component.tsx
    ├── background-selector-loader.component.tsx
    └── username-input-modal.component.tsx
```

**Métriques**:

- **Git**: -545 files, -126 MB
- **TypeScript**: 100% typed (0 `any`)
- **ESLint**: 0 errors, 0 warnings
- **Error Handling**: ErrorBoundary catch crashes
- **Socket UX**: Indicateur connexion + auto-reconnect (5 attempts)

**Fichiers Supprimés**:

- `app/socket.js`
- `components/QueryProvider/`, `components/UsernameProvider/`
- `components/settingsbutton/`, `components/ui/wrapperbackground/`
- `components/ui/dialogcover/`, `components/ui/usernameinput/`
- `components/ui/use-toast.ts`
- `data/` (126 MB, 540+ fichiers)

**Détails complets**: Voir `MIGRATION_STATUS.md` Phase 3.5

---

### Version 0.2.0 - November 2024

**Major Dependency Upgrades**:

- ✅ **Next.js**: 14.1.4 → 16.0.1 (Turbopack par défaut, React Compiler intégré)
- ✅ **React**: 18 → 19.2.0 (Hooks optimisés, meilleure performance)
- ✅ **Socket.IO**: 4.7.5 → 4.8.1
- ✅ **TanStack Query**: 5.36.0 → 5.90.8
- ✅ **Zustand**: 4.5.2 → 5.0.2
- ✅ **TypeScript**: 5.x → 5.7.2
- ✅ **ESLint**: 8 → 9.17.0

**Breaking Changes**:

- Next.js 16: `fetch()` n'est plus caché par défaut (pas d'impact, on utilise des fichiers statiques)
- React 19: Hooks optimisés automatiquement (pas de changements requis)
- Zustand 5: API reste compatible (pas de changements requis)

**Installation**:

```bash
# Supprimer node_modules et lock file
rm -rf node_modules pnpm-lock.yaml

# Réinstaller les dépendances
pnpm install

# Tester l'application
pnpm dev
```

**Nouveautés Next.js 16**:

- 🚀 **Turbopack** activé par défaut (build/dev plus rapide)
- 🚀 **React Compiler** intégré (mémoïsation automatique)
- 🚀 Amélioration des performances de navigation
- 🚀 Meilleure gestion du cache

---

### Version 0.1.0 - Initial Release

**Features**:

- Real-time Flash cooldown tracking
- Room-based multiplayer with Socket.IO
- Data Dragon API integration
- Customizable champion backgrounds
- Audio notifications
- Responsive design

---

## 📌 Template pour Nouvelle Version

Utilisez ce template pour ajouter une nouvelle version :

```markdown
### Version X.X.X - [Month] [Year] ([Feature Name])

**[Summary Line]** :

- ✨/🐛/📦 **[Feature/Fix Name]** : Description
- ✨/🐛/📦 **[Feature/Fix Name]** : Description

**[Backend/Frontend/Full Stack] Changes** :

- Change 1
- Change 2

**Fichiers Modifiés** :

| Fichier           | Changements |
| ----------------- | ----------- |
| `path/to/file.ts` | Description |

**Testing** (si applicable) :

- ✅ Test case 1
- ✅ Test case 2

**Impact** : 🟢/🟡/🔴 [Description de l'impact]

---
```

**Last Updated**: November 24, 2025  
**Current Version**: 2.3.0
