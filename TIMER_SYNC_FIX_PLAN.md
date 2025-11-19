# 🔧 Plan de Correction : Synchronisation des Timers

**Date** : 19 novembre 2025  
**Statut** : 🔴 BUG CRITIQUE EN PRODUCTION  
**Impact** : Décalages de 5-10s entre devices/clients sur les timers Flash

---

## 📊 Diagnostic du Problème

### ❌ Architecture Actuelle (Défectueuse)

**Backend (NestJS)** : ✅ Stocke correctement des **timestamps absolus**

```typescript
// apps/api/src/game/game.service.ts ligne 29
const endsAt: number = Date.now() + cooldown * 1000
room.roles[role].isFlashed = endsAt // Ex: 1700000000000 (timestamp ms)
```

**Frontend (Next.js)** : ❌ Convertit en countdown puis décrémente localement

```typescript
// 1️⃣ apps/web/features/game/screens/game-multiplayer.screen.tsx ligne 60
const countdown = timestampToCountdown(backendRoleData.isFlashed)
isFlashedValue = countdown > 0 ? countdown : false // Ex: 300 (secondes)

// 2️⃣ apps/web/features/game/hooks/use-game-timer.hook.ts ligne 24
const newValue = roleData.isFlashed - 1 // ❌ DÉCRÉMENT LOCAL (source du bug)
```

### 🐛 Pourquoi ça crée des décalages ?

1. **Conversion timestamp → countdown** : Chaque client convertit une fois, puis perd la référence temporelle absolue
2. **Décrémentation locale** : Chaque client décrémente son propre compteur indépendamment
3. **Intervals non synchronisés** : `setInterval(1000)` n'est pas précis (peut être 997ms ou 1003ms)
4. **Latence réseau** : Les clients reçoivent les updates à des moments différents
5. **Horloges système** : Légères différences entre devices (quelques ms)

**Résultat** : Après 5 minutes, les timers peuvent diverger de 5-10 secondes entre clients.

---

## ✅ Solution : Architecture Timestamp-Based

### Principe

**Backend** : Continue de stocker des timestamps (déjà correct)  
**Frontend** : Stocke AUSSI des timestamps et calcule dynamiquement le countdown à chaque tick

### Flux de Données Corrigé

```
Backend (NestJS)
    ↓
    endsAt: 1700000300000 (timestamp ms)
    ↓
Frontend (Next.js)
    ↓
    State: isFlashed = 1700000300000 (stocke le timestamp)
    ↓
    Render: countdown = Math.ceil((endsAt - Date.now()) / 1000)  ✅ CALCUL DYNAMIQUE
    ↓
    Display: 4:53 (format MM:SS)
```

**Avantages** :

- ✅ Tous les clients calculent le countdown basé sur la même référence temporelle absolue
- ✅ Pas de dérive du temps (recalcul à chaque tick basé sur `Date.now()`)
- ✅ Synchronisation automatique même avec latence réseau
- ✅ Résilience aux reconnexions (le timestamp reste valide)

---

## 🛠️ Plan de Migration

### Phase 1 : Modifier le Type `isFlashed` (Frontend)

**Fichiers concernés** :

- `apps/web/features/game/types/game.types.ts`

**Action** :

```typescript
// ❌ ANCIEN
export interface ISummonerData {
  isFlashed: false | number // number = countdown en secondes
  lucidityBoots: boolean
  cosmicInsight: boolean
  champion?: IChampionData
}

// ✅ NOUVEAU
export interface ISummonerData {
  isFlashed: false | number // number = timestamp (endsAt en ms)
  lucidityBoots: boolean
  cosmicInsight: boolean
  champion?: IChampionData
}
```

**Note** : Le type reste `false | number` mais la sémantique change (countdown → timestamp).

---

### Phase 2 : Supprimer la Conversion Timestamp → Countdown

**Fichier** : `apps/web/features/game/screens/game-multiplayer.screen.tsx`

**Ligne 56-62** : Supprimer la conversion

```typescript
// ❌ ANCIEN (ligne 56-62)
// Convert backend timestamps (endsAt) to local countdown (seconds)
let isFlashedValue: number | false = backendRoleData.isFlashed

if (typeof backendRoleData.isFlashed === 'number') {
  const countdown = timestampToCountdown(backendRoleData.isFlashed)
  isFlashedValue = countdown > 0 ? countdown : false
}

// ✅ NOUVEAU
// Store backend timestamps directly (no conversion)
const isFlashedValue: number | false = backendRoleData.isFlashed
```

**Explication** : On stocke directement le timestamp du backend au lieu de le convertir en countdown.

---

### Phase 3 : Réécrire `useGameTimer` (Calcul Dynamique)

**Fichier** : `apps/web/features/game/hooks/use-game-timer.hook.ts`

**Réécriture complète** :

```typescript
import { useEffect } from 'react'
import type { IGameData, IRoleData } from '../types/game.types'

interface IUseGameTimerOptions {
  gameState: IGameData
  setGameState: React.Dispatch<React.SetStateAction<IGameData>>
}

/**
 * ✅ NEW APPROACH: Calculate countdown dynamically based on timestamps
 * No more local decrement (prevents time drift)
 */
export const useGameTimer = (options: IUseGameTimerOptions): void => {
  const { gameState, setGameState } = options

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      setGameState((prevState) => {
        const updatedRoles = { ...prevState.roles } as IRoleData
        let hasChanges = false

        // Check all active timers and update expired ones
        for (const key in updatedRoles) {
          const roleKey = key as keyof IRoleData
          const roleData = updatedRoles[roleKey]

          // If Flash is on cooldown (isFlashed is a timestamp)
          if (typeof roleData.isFlashed === 'number') {
            const endsAt = roleData.isFlashed
            const remainingMs = endsAt - now

            // If timer expired, set Flash to available
            if (remainingMs <= 0) {
              updatedRoles[roleKey] = {
                ...roleData,
                isFlashed: false,
              }
              hasChanges = true
            }
            // Otherwise, timer is still running (no state change needed)
            // The render will calculate the countdown dynamically
          }
        }

        return hasChanges ? { ...prevState, roles: updatedRoles } : prevState
      })
    }, 100) // Check every 100ms for smoother expiration (not 1000ms)

    return () => clearInterval(interval)
  }, [setGameState])
}
```

**Changements clés** :

1. **Pas de décrémentation** : On ne modifie plus `isFlashed`
2. **Calcul dynamique** : `remainingMs = endsAt - now`
3. **Update uniquement si expiré** : `if (remainingMs <= 0)` → set à `false`
4. **Interval plus rapide** : 100ms au lieu de 1000ms pour détecter l'expiration rapidement

---

### Phase 4 : Créer une Fonction Helper `getRemainingTime`

**Fichier** : `apps/web/features/game/hooks/use-flash-cooldown.hook.ts`

**Ajouter cette fonction** :

```typescript
/**
 * ✅ NEW: Get remaining time for a Flash cooldown (timestamp-based)
 * @param isFlashed - Flash status (false or endsAt timestamp)
 * @returns Remaining seconds (or 0 if not on cooldown)
 */
export const getRemainingTime = (isFlashed: false | number): number => {
  if (isFlashed === false) return 0

  const now = Date.now()
  const remainingMs = Math.max(0, isFlashed - now)
  return Math.ceil(remainingMs / 1000)
}
```

**Usage** : Utiliser cette fonction partout où on affiche le countdown.

---

### Phase 5 : Mettre à Jour les Composants d'Affichage

**Fichier** : `apps/web/features/game/components/role-card.component.tsx`

**Modifier l'affichage du timer** :

```typescript
// ❌ ANCIEN
const countdown = typeof data.isFlashed === 'number' ? data.isFlashed : 0
const formattedTime = formatCooldown(countdown)

// ✅ NOUVEAU
import {
  getRemainingTime,
  formatCooldown,
} from '../hooks/use-flash-cooldown.hook'

const remainingSeconds = getRemainingTime(data.isFlashed)
const formattedTime = formatCooldown(remainingSeconds)
```

**Note** : Tous les composants qui affichent le timer doivent utiliser `getRemainingTime()`.

---

### Phase 6 : Modifier le Context `useFlash` (Solo Mode)

**Fichier** : `apps/web/features/game/contexts/game.context.tsx`

**Ligne 44-71** : Modifier `useFlash` pour stocker un timestamp

```typescript
// ❌ ANCIEN (ligne 50-63)
const useFlash = useCallback(
  (role: TRole) => {
    setGameState((prev) => {
      const roleData = prev.roles[role]

      // Calculate cooldown based on items
      const cooldown = calculateFlashCooldown({
        lucidityBoots: roleData.lucidityBoots,
        cosmicInsight: roleData.cosmicInsight,
      })

      return {
        ...prev,
        roles: {
          ...prev.roles,
          [role]: {
            ...roleData,
            isFlashed: cooldown, // ❌ Stocke un countdown
          },
        },
      }
    })

    // Play audio
    audio.play()
  },
  [audio]
)

// ✅ NOUVEAU
const useFlash = useCallback(
  (role: TRole) => {
    setGameState((prev) => {
      const roleData = prev.roles[role]

      // Calculate cooldown based on items (in seconds)
      const cooldownSeconds = calculateFlashCooldown({
        lucidityBoots: roleData.lucidityBoots,
        cosmicInsight: roleData.cosmicInsight,
      })

      // Convert to timestamp (endsAt = now + cooldown)
      const endsAt = Date.now() + cooldownSeconds * 1000

      return {
        ...prev,
        roles: {
          ...prev.roles,
          [role]: {
            ...roleData,
            isFlashed: endsAt, // ✅ Stocke un timestamp
          },
        },
      }
    })

    // Play audio
    audio.play()
  },
  [audio]
)
```

**Explication** : En solo mode aussi, on stocke un timestamp pour cohérence.

---

### Phase 7 : Modifier `toggleItem` (Recalcul Proportionnel)

**Fichier** : `apps/web/features/game/contexts/game.context.tsx`

**Ligne 88-131** : Adapter le recalcul pour les timestamps

```typescript
// ✅ NOUVEAU (logique timestamp-based)
const toggleItem = useCallback(
  (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => {
    setGameState((prev) => {
      const roleData = prev.roles[role]
      const newItemValue = !roleData[item]

      // If Flash is on cooldown, recalculate timestamp proportionally
      let newFlashValue = roleData.isFlashed
      if (typeof roleData.isFlashed === 'number') {
        const endsAt = roleData.isFlashed
        const now = Date.now()
        const remainingMs = Math.max(0, endsAt - now)

        // Calculate old and new max cooldowns (in seconds)
        const oldMaxCooldown = calculateFlashCooldown({
          lucidityBoots: roleData.lucidityBoots,
          cosmicInsight: roleData.cosmicInsight,
        })

        const newMaxCooldown = calculateFlashCooldown({
          lucidityBoots:
            item === 'lucidityBoots' ? newItemValue : roleData.lucidityBoots,
          cosmicInsight:
            item === 'cosmicInsight' ? newItemValue : roleData.cosmicInsight,
        })

        // Keep the same percentage remaining
        const percentageRemaining = remainingMs / (oldMaxCooldown * 1000)
        const newRemainingMs = percentageRemaining * newMaxCooldown * 1000

        // Recalculate new endsAt timestamp
        newFlashValue = now + newRemainingMs
      }

      return {
        ...prev,
        roles: {
          ...prev.roles,
          [role]: {
            ...roleData,
            [item]: newItemValue,
            isFlashed: newFlashValue,
          },
        },
      }
    })
  },
  []
)
```

**Changements** :

1. `remainingMs = endsAt - now` au lieu de `currentCountdown`
2. `percentageRemaining = remainingMs / (oldMaxCooldown * 1000)`
3. `newFlashValue = now + newRemainingMs` (nouveau timestamp)

---

## 🧪 Tests de Validation

### Test 1 : Synchronisation Multi-Device

**Setup** :

1. Ouvrir 3 clients (2 Chrome desktop + 1 mobile)
2. Rejoindre le même room
3. Cliquer Flash TOP sur client 1

**Validation** :

- ✅ Les 3 clients affichent exactement le même temps (±1s max)
- ✅ Pas de dérive après 5 minutes de countdown
- ✅ Le timer expire au même moment sur tous les clients

---

### Test 2 : Reconnexion

**Setup** :

1. Cliquer Flash JUNGLE (300s)
2. Attendre 30s
3. Rafraîchir la page (F5)

**Validation** :

- ✅ Le timer reprend à ~270s (pas de reset)
- ✅ Le countdown continue normalement

---

### Test 3 : Toggle Items Pendant Countdown

**Setup** :

1. Cliquer Flash MID (300s base)
2. Attendre 60s (reste 240s)
3. Toggle Cosmic Insight (300s → 255s)

**Validation** :

- ✅ Nouveau timer = 240/300 × 255 = 204s
- ✅ Tous les clients synchronisés sur 204s

---

### Test 4 : Solo Mode

**Setup** :

1. Aller sur `/game` (solo mode)
2. Cliquer Flash ADC

**Validation** :

- ✅ Le timer démarre à 5:00
- ✅ Le countdown décrémente correctement
- ✅ Expire à 0:00 et redevient disponible

---

## 📝 Checklist de Déploiement

- [ ] **Phase 1** : Mettre à jour les types TypeScript
- [ ] **Phase 2** : Supprimer la conversion timestamp → countdown
- [ ] **Phase 3** : Réécrire `useGameTimer` (calcul dynamique)
- [ ] **Phase 4** : Créer `getRemainingTime` helper
- [ ] **Phase 5** : Mettre à jour tous les composants d'affichage
- [ ] **Phase 6** : Modifier `useFlash` dans le context
- [ ] **Phase 7** : Adapter `toggleItem` pour timestamps
- [ ] **Test 1** : Valider synchronisation multi-device
- [ ] **Test 2** : Valider reconnexion
- [ ] **Test 3** : Valider toggle items
- [ ] **Test 4** : Valider solo mode
- [ ] **Documentation** : Mettre à jour AGENTS.md
- [ ] **Commit** : `:bug: fix(game): fix timer sync with timestamp-based architecture`
- [ ] **Deploy** : Déployer en production

---

## 📚 Fichiers à Modifier

| Fichier                                                      | Action                              | Priorité     |
| ------------------------------------------------------------ | ----------------------------------- | ------------ |
| `apps/web/features/game/hooks/use-game-timer.hook.ts`        | Réécriture complète                 | 🔴 CRITIQUE  |
| `apps/web/features/game/screens/game-multiplayer.screen.tsx` | Supprimer conversion (ligne 56-62)  | 🔴 CRITIQUE  |
| `apps/web/features/game/hooks/use-flash-cooldown.hook.ts`    | Ajouter `getRemainingTime()`        | 🔴 CRITIQUE  |
| `apps/web/features/game/contexts/game.context.tsx`           | Modifier `useFlash` et `toggleItem` | 🔴 CRITIQUE  |
| `apps/web/features/game/components/role-card.component.tsx`  | Utiliser `getRemainingTime()`       | 🟡 IMPORTANT |
| `apps/web/features/game/types/game.types.ts`                 | Documenter sémantique timestamp     | 🟢 DOC       |

---

## 🎯 Résultat Attendu

**Avant (actuel)** :

```
Chrome 1: 4:53
Chrome 2: 4:51
Mobile:   5:00
→ Décalage de 9 secondes ❌
```

**Après (corrigé)** :

```
Chrome 1: 4:59
Chrome 2: 4:59
Mobile:   4:59
→ Synchronisé (±1s max) ✅
```

---

## 🔗 Références

- **Backend** : `apps/api/src/game/game.service.ts` (ligne 29) - Déjà timestamp-based ✅
- **Types partagés** : `apps/api/libs/shared/src/types/game.types.ts` (ligne 46-52)
- **Documentation** : AGENTS.md section "Game Mechanics"

---

**Auteur** : AI Assistant  
**Date de création** : 19 novembre 2025  
**Dernière mise à jour** : 19 novembre 2025  
**Statut** : ✅ MIGRATION COMPLÉTÉE - TESTS EN COURS

---

## ✅ Statut de la Migration

### Phases Complétées

- ✅ **Phase 1** : Types TypeScript documentés
- ✅ **Phase 2** : Conversion timestamp → countdown supprimée
- ✅ **Phase 3** : `useGameTimer` réécrit (calcul dynamique)
- ✅ **Phase 4** : Helper `getRemainingTime()` créé
- ✅ **Phase 5** : Composants d'affichage mis à jour
- ✅ **Phase 6** : `useFlash` modifié (timestamps)
- ✅ **Phase 7** : `toggleItem` adapté (timestamps)
- ✅ **Cleanup** : Console.log supprimés
- ✅ **Lint** : Pas d'erreurs ESLint
- ✅ **TypeScript** : Compilation réussie

### Fichiers Modifiés

| Fichier                       | Modifications                              | Status |
| ----------------------------- | ------------------------------------------ | ------ |
| `use-flash-cooldown.hook.ts`  | Ajout `getRemainingTime()`                 | ✅     |
| `use-game-timer.hook.ts`      | Réécriture complète (timestamp-based)      | ✅     |
| `game-multiplayer.screen.tsx` | Suppression conversion + cleanup           | ✅     |
| `game.context.tsx`            | `useFlash` + `toggleItem` timestamp-based  | ✅     |
| `flash-button.component.tsx`  | Calcul dynamique avec `getRemainingTime()` | ✅     |
| `role-card.component.tsx`     | Cleanup console.log                        | ✅     |
| `game.types.ts`               | Documentation sémantique timestamp         | ✅     |

### Tests Requis

Voir le document `TIMER_SYNC_TESTS.md` pour le guide complet des tests manuels.

**Tests critiques à valider** :

- 🧪 Test 1 : Synchronisation multi-device
- 🧪 Test 2 : Reconnexion sans reset
- 🧪 Test 3 : Toggle items
- 🧪 Test 4 : Solo mode
- 🧪 Test 5 : Multiples timers
- 🧪 Test 6 : Cancel Flash
- 🧪 Test 7 : Performance
