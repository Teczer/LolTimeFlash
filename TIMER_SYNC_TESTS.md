# 🧪 Guide de Tests : Synchronisation des Timers

**Date** : 19 novembre 2025  
**Statut** : ✅ MIGRATION COMPLÉTÉE - TESTS REQUIS  
**Objectif** : Valider que les timers sont maintenant synchronisés entre tous les clients

---

## 📋 Pré-requis

Avant de commencer les tests :

1. ✅ Vérifier que l'API est démarrée : `http://localhost:8888`
2. ✅ Vérifier que le frontend est démarré : `http://localhost:6333`
3. ✅ Préparer 3 devices/navigateurs :
   - Chrome Desktop (fenêtre 1)
   - Chrome Desktop (fenêtre 2)
   - Mobile (Safari/Chrome iOS/Android) OU Chrome mode mobile

---

## 🧪 Tests de Validation

### Test 1 : Synchronisation Multi-Device ⭐ CRITIQUE

**Objectif** : Vérifier que tous les clients affichent le même countdown

**Setup** :
1. Ouvrir 3 onglets/devices distincts
2. Aller sur `http://localhost:6333/lobby` sur chaque device
3. Créer un lobby sur le premier device (noter le code)
4. Rejoindre le lobby avec les 2 autres devices (même code)

**Actions** :
1. Sur le Device 1 : Cliquer sur Flash TOP
2. Observer immédiatement les 3 devices

**Validation** :
- ✅ Les 3 devices affichent `5:00` (ou `4:53`/`4:31` si items activés)
- ✅ Après 10 secondes, les 3 devices affichent `4:50` (±1s max)
- ✅ Après 1 minute, les 3 devices affichent `4:00` (±1s max)
- ✅ Après 5 minutes, le timer expire au même moment sur tous les clients

**Résultat attendu** : Synchronisation parfaite avec maximum 1 seconde de décalage

**❌ Si échec** : Les clients ont des décalages de 5-10s → La migration a échoué

---

### Test 2 : Reconnexion / Rafraîchissement

**Objectif** : Vérifier que le timer reprend correctement après reconnexion

**Setup** :
1. Ouvrir 2 onglets sur le même lobby
2. Sur Device 1 : Cliquer Flash JUNGLE (300s)
3. Attendre 30 secondes

**Actions** :
1. Sur Device 2 : Rafraîchir la page (F5 ou ⌘+R)
2. Observer le timer JUNGLE sur Device 2 après reconnexion

**Validation** :
- ✅ Le timer JUNGLE reprend à ~270s (pas 300s)
- ✅ Le timer continue de décrémenter normalement
- ✅ Device 1 et Device 2 sont synchronisés (±1s)

**Résultat attendu** : Le backend envoie le timestamp, le frontend recalcule le countdown

**❌ Si échec** : Le timer reset à 300s → L'état backend n'est pas persisté

---

### Test 3 : Toggle Items Pendant Countdown

**Objectif** : Vérifier le recalcul proportionnel du timer lors du toggle

**Setup** :
1. Ouvrir 2 onglets sur le même lobby
2. Sur Device 1 : Cliquer Flash MID (300s base)
3. Attendre 60 secondes (reste 240s)

**Actions** :
1. Sur Device 1 : Toggle Cosmic Insight (activation)
   - Cooldown max passe de 300s → 255s
   - Calcul proportionnel : 240/300 × 255 = 204s
2. Observer les 2 devices

**Validation** :
- ✅ Device 1 affiche ~204s après le toggle
- ✅ Device 2 affiche ~204s (synchronisé)
- ✅ Le timer continue de décrémenter normalement
- ✅ Pas de saut brutal du countdown

**Actions (suite)** :
1. Attendre 30 secondes (reste 174s)
2. Sur Device 1 : Toggle Lucidity Boots (activation)
   - Cooldown max passe de 255s → 231s
   - Calcul proportionnel : 174/255 × 231 = 157s

**Validation (suite)** :
- ✅ Les 2 devices affichent ~157s
- ✅ Synchronisation maintenue

**Résultat attendu** : Recalcul correct et synchronisé sur tous les clients

**❌ Si échec** : Le timer ne se recalcule pas ou se désynchronise

---

### Test 4 : Solo Mode (Pas de WebSocket)

**Objectif** : Vérifier que le solo mode fonctionne avec la nouvelle architecture

**Setup** :
1. Aller sur `http://localhost:6333/game` (solo mode)

**Actions** :
1. Cliquer Flash ADC
2. Observer le timer pendant 10 secondes

**Validation** :
- ✅ Le timer démarre à `5:00`
- ✅ Le countdown décrémente : `4:59`, `4:58`, `4:57`...
- ✅ L'icône ADC devient sombre (grayscale)
- ✅ Après 5 minutes, le timer expire et l'icône redevient normale

**Résultat attendu** : Le solo mode fonctionne identiquement au multiplayer

**❌ Si échec** : Le timer ne décrémente pas ou ne s'affiche pas

---

### Test 5 : Multiples Timers Simultanés

**Objectif** : Vérifier que plusieurs timers peuvent tourner en même temps

**Setup** :
1. Ouvrir 2 onglets sur le même lobby

**Actions** :
1. Sur Device 1 : Cliquer Flash TOP
2. Attendre 10 secondes
3. Sur Device 2 : Cliquer Flash JUNGLE
4. Attendre 10 secondes
5. Sur Device 1 : Cliquer Flash MID
6. Observer les 3 timers sur les 2 devices

**Validation** :
- ✅ TOP affiche ~290s (300 - 10)
- ✅ JUNGLE affiche ~290s (300 - 10)
- ✅ MID affiche ~300s (tout juste démarré)
- ✅ Les 2 devices affichent les mêmes valeurs (±1s)
- ✅ Tous les timers décrementent correctement

**Résultat attendu** : Gestion correcte de multiples timers simultanés

**❌ Si échec** : Les timers interfèrent entre eux ou se désynchronisent

---

### Test 6 : Cancel Flash Pendant Countdown

**Objectif** : Vérifier que l'annulation fonctionne correctement

**Setup** :
1. Ouvrir 2 onglets sur le même lobby

**Actions** :
1. Sur Device 1 : Cliquer Flash SUPPORT (démarre le timer)
2. Attendre 30 secondes (reste 270s)
3. Sur Device 1 : Re-cliquer Flash SUPPORT (annule le timer)
4. Observer les 2 devices

**Validation** :
- ✅ Le timer SUPPORT disparaît sur les 2 devices
- ✅ L'icône SUPPORT redevient normale (brightness 100%)
- ✅ Cliquer à nouveau démarre un nouveau timer à 300s

**Résultat attendu** : Annulation synchronisée sur tous les clients

**❌ Si échec** : Le timer ne s'annule pas ou reste actif sur un device

---

### Test 7 : Performance - Interval Rate

**Objectif** : Vérifier que le nouveau interval (100ms) ne cause pas de lag

**Setup** :
1. Ouvrir 1 onglet sur le lobby
2. Démarrer 5 timers (tous les roles)

**Actions** :
1. Observer les performances du navigateur (DevTools → Performance)
2. Vérifier la fluidité de l'UI pendant 1 minute

**Validation** :
- ✅ Pas de lag ou freeze de l'UI
- ✅ CPU usage normal (<10% en idle)
- ✅ Les timers décrementent de façon fluide
- ✅ Pas de memory leak (Memory profiler stable)

**Résultat attendu** : Performance identique ou meilleure qu'avant

**❌ Si échec** : Lag ou CPU élevé → Revoir l'interval rate (passer à 500ms)

---

## 📊 Checklist de Validation Finale

Avant de merger en production, valider :

- [ ] **Test 1** : Synchronisation multi-device (±1s max) ✅
- [ ] **Test 2** : Reconnexion sans reset du timer ✅
- [ ] **Test 3** : Toggle items recalcule correctement ✅
- [ ] **Test 4** : Solo mode fonctionne ✅
- [ ] **Test 5** : Multiples timers simultanés ✅
- [ ] **Test 6** : Cancel Flash fonctionne ✅
- [ ] **Test 7** : Pas de problème de performance ✅
- [ ] **Lint** : `pnpm lint` passe sans erreurs ✅
- [ ] **TypeScript** : `pnpm type-check` passe sans erreurs ✅
- [ ] **Build** : `pnpm build` réussit ✅

---

## 🐛 Debugging

### Si les timers ne se synchronisent pas

1. **Vérifier les timestamps backend** :
   ```bash
   # Ouvrir DevTools → Network → WS
   # Observer les messages `room:state`
   # Vérifier que `isFlashed` est un timestamp (ex: 1700000300000)
   ```

2. **Vérifier le calcul frontend** :
   ```javascript
   // Ajouter dans FlashButton.component.tsx
   console.log('cooldown (timestamp):', cooldown)
   console.log('remainingSeconds:', remainingSeconds)
   console.log('formatted:', formatCooldown(remainingSeconds))
   ```

3. **Vérifier l'interval timer** :
   ```javascript
   // Ajouter dans use-game-timer.hook.ts
   console.log('Checking timers at:', Date.now())
   console.log('Role data:', roleData)
   ```

### Si le timer ne décrémente pas

1. **Vérifier que `useGameTimer` est appelé** :
   ```javascript
   // Dans game.context.tsx
   console.log('useGameTimer mounted')
   ```

2. **Vérifier que `getRemainingTime` est appelé** :
   ```javascript
   // Dans flash-button.component.tsx
   console.log('getRemainingTime called with:', cooldown)
   ```

3. **Forcer un re-render** :
   - Modifier `FlashButton` pour enlever le `memo` temporairement
   - Vérifier si le countdown s'affiche correctement

---

## 📝 Rapport de Test

Une fois tous les tests passés, documenter :

**Date de test** : __________  
**Testeur** : __________  
**Environnement** : Dev / Staging / Production  
**Devices testés** :
- [ ] Chrome Desktop (Windows/Mac)
- [ ] Firefox Desktop
- [ ] Safari Desktop (Mac)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

**Résultats** :
- [ ] Tous les tests passent ✅
- [ ] Certains tests échouent ❌ (détailler ci-dessous)

**Notes supplémentaires** :
_______________________________________________________
_______________________________________________________

---

## 🚀 Déploiement

Une fois tous les tests validés :

1. **Commit les changements** :
   ```bash
   git add .
   git commit -m ":bug: fix(game): fix timer sync with timestamp-based architecture"
   ```

2. **Push en production** :
   ```bash
   git push origin main
   ```

3. **Vérifier le déploiement** :
   - Tester en production avec les mêmes tests
   - Monitorer les logs backend (Sentry, Winston)
   - Vérifier les métriques (CPU, Memory)

4. **Documenter dans AGENTS.md** :
   - Mettre à jour la section "Version History"
   - Ajouter la date de déploiement

---

**Auteur** : AI Assistant  
**Date de création** : 19 novembre 2025  
**Dernière mise à jour** : 19 novembre 2025  
**Statut** : 📋 GUIDE PRÊT - TESTS MANUELS REQUIS

