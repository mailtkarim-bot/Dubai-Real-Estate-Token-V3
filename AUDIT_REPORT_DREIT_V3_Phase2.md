# Rapport d'Audit Sécurité Smart Contracts

**Projet :** Dubai Real Estate Investment Token (DREIT) — V3 Phase 2  
**Auteur de l'audit :** Kimi Code CLI (analyse automatisée + revue manuelle)  
**Date :** 12 juin 2026  
**Framework :** Foundry, Solidity 0.8.28, EVM Shanghai  
**Bibliothèques :** OpenZeppelin Contracts v5 / Contracts-Upgradeable v5  
**Scope :** `src/`, `script/`, `test/`, `foundry.toml`, `Makefile`, `.env.example`, `deployments/testnet.json`

---

## 1. Executive Summary

DREIT V3 Phase 2 est un token RWA (Real World Asset) de type security token inspiré d'ERC-3643 (T-REX), avec une architecture UUPS upgradeable, un `TimelockController` de 48h, et une séparation des rôles `DEFAULT_ADMIN_ROLE`, `ISSUER_ROLE` et `REGULATOR_ROLE`.

L'audit n'a pas identifié de vulnérabilité **Critical** permettant un vol direct de fonds ou une prise de contrôle totale du protocole sans compromission d'une clé privilégiée. Le code est globalement structuré, bien testé (232 tests passent), et suit les bonnes pratiques OpenZeppelin pour les proxies UUPS.

Cependant, **plusieurs findings de sévérité High et Medium ont été identifiés**, notamment :

- **H-01 — Script d'upgrade cassé :** `script/upgrade/UpgradeDREIT.s.sol` ne compile pas, bloquant le workflow d'upgrade documenté.
- **H-02 — Hooks de compliance non protégés :** `ComplianceEngine.transferred/created/destroyed` sont `external` sans contrôle d'accès. Bien que vides en Phase 2, tout module futur ajouté à ces hooks sera attaquable.
- **H-03 — Déploiement Sepolia centralisé :** le rôle Gnosis Safe/PROPOSER/EXECUTOR est détenu par le `deployer` sur Sepolia (déjà noté dans le brief, mais à corriger avant mainnet).
- **M-01 — Suppression d'identité sans vérification de solde :** si `IdentityRegistry.token` n'est pas initialisé, `deleteIdentity` ne vérifie pas le solde ni les dividendes en attente.
- **M-02 — Whitelist asymétrique :** en mode whitelist, seul le destinataire (`to`) est vérifié, pas l'émetteur (`from`).

**Recommandation générale :** corriger les findings High avant tout déploiement mainnet, puis traiter les Medium avant le lancement commercial. Un audit formel par une firme tierce (CertiK, OpenZeppelin, Trail of Bits, Hacken) reste impératif.

### Résumé par sévérité

| Sévérité | Nombre |
|----------|--------|
| Critical | 0 |
| High     | 3 |
| Medium   | 6 |
| Low      | 6 |
| Informational | 2 |

---

## 2. Méthodologie

L'audit a suivi les phases du brief :

1. **Ingestion** : lecture ligne par ligne des 21 fichiers du scope.
2. **Graphe de dépendances** : cartographie de l'héritage, des appels inter-contrats et des flux de rôles.
3. **Recherche de vulnérabilités connues** : revue des advisories OpenZeppelin 2024-2026 (UUPS, ReentrancyGuard v5, Timelock).
4. **Analyse statique manuelle** : CEI, reentrancy, delegatecall, tx.origin, casts, collisions de storage, contrôle d'accès, initialisation des proxies.
5. **Analyse dynamique / threat modeling** : simulation des scénarios admin compromis, issuer malveillant, regulator malveillant, KYC expiré, attaque d'upgrade, manipulation des dividendes.
6. **Exécution des tests** : `forge test` (232/232 passent), `forge coverage`.
7. **Vérification du bytecode déployé** : comparaison du runtime bytecode local avec Sepolia.

---

## 3. Tableau des Findings

| ID | Titre | Fichier(s) | Sévérité | Statut |
|----|-------|------------|----------|--------|
| H-01 | Le script `UpgradeDREIT.s.sol` ne compile pas | `script/upgrade/UpgradeDREIT.s.sol:30` | High | ✅ Corrigé |
| H-02 | Hooks `transferred/created/destroyed` sans contrôle d'accès | `src/compliance/ComplianceEngine.sol:106-139` | High | ✅ Corrigé |
| H-03 | Configuration Sepolia : deployer = Gnosis Safe | `script/HelperConfig.s.sol:84-95`, `deployments/testnet.json` | High | ⚠️ Code corrigé (env vars obligatoires) — redeploiement Sepolia nécessaire |
| M-01 | `deleteIdentity` contourne la vérification de solde si `token` non initialisé | `src/compliance/IdentityRegistry.sol:345-367` | Medium | ✅ Corrigé |
| M-02 | Whitelist asymétrique : seul le destinataire est vérifié | `src/compliance/ComplianceEngine.sol:75-104` | Medium | ✅ Corrigé |
| M-03 | Makefile expose la clé privée en ligne de commande | `Makefile:7,13,17,19,22` | Medium | ✅ Corrigé |
| M-04 | `setIdentityRegistry` n'exige pas un contrat | `src/compliance/ComplianceEngine.sol:183-186` | Medium | ✅ Corrigé |
| M-05 | Mauvais sélecteurs d'erreur pour taille de batch | `src/core/DubaiRealEstateToken.sol:153-193`, `src/compliance/IdentityRegistry.sol:369-409` | Medium | ✅ Corrigé |
| M-06 | `_update` appelle un moteur de compliance externe sans `nonReentrant` | `src/core/DubaiRealEstateToken.sol:378-405` | Medium | ✅ Corrigé |
| L-01 | `setToken` n'émet pas d'événement | `src/compliance/IdentityRegistry.sol:125-128` | Low | ✅ Corrigé |
| L-02 | Hooks de compliance vides : modularité non implémentée | `src/compliance/ComplianceEngine.sol:106-139, 204-218` | Low | Connu / Phase 3 |
| L-03 | Registres de trusted issuers / claim topics non utilisés | `src/compliance/IdentityRegistry.sol:30-38, 130-166` | Low | Connu |
| L-04 | `updateIdentity` permet d'attribuer le même contrat d'identité à plusieurs investisseurs | `src/compliance/IdentityRegistry.sol:307-322` | Low | ✅ Corrigé |
| L-05 | `restrictCountry` n'a pas de validation du code pays | `src/compliance/ComplianceEngine.sol:155-158` | Low | ✅ Corrigé |
| L-06 | Imports mixtes upgradeable / non-upgradeable | `src/core/DubaiRealEstateToken.sol:4-14` | Low | ✅ Corrigé (commentaire explicatif) |
| I-01 | Optimisations gas | Divers | Informational | Optionnel |
| I-02 | Complétion NatSpec / documentation | Divers | Informational | Optionnel |

---

## 4. Findings Détaillés

### H-01 — Le script `UpgradeDREIT.s.sol` ne compile pas

**Sévérité :** High  
**Fichier(s) :** `script/upgrade/UpgradeDREIT.s.sol`, ligne 30  
**Description :**
Le script tente d'obtenir le sélecteur de `DubaiRealEstateToken.upgradeToAndCall` :

```solidity
bytes memory upgradeData = abi.encodeWithSelector(
    DubaiRealEstateToken.upgradeToAndCall.selector,
    address(newImpl),
    "" // no initializer call needed for V2
);
```

`upgradeToAndCall` est hérité de `UUPSUpgradeable` et n'est pas directement visible sur le type `DubaiRealEstateToken` au moment de la compilation du script. `forge build --skip test --force` échoue avec :

```
Error (9582): Member "upgradeToAndCall" not found or not visible after argument-dependent lookup in type(contract DubaiRealEstateToken).
```

**Impact :**
Le workflow d'upgrade documenté (Phase 2) est inutilisable tel quel. Un opérateur devra reconstruire manuellement le calldata, ce qui augmente le risque d'erreur humaine lors d'une opération critique de gouvernance. Sur mainnet, cela pourrait retarder ou bloquer des corrections de sécurité.

**Preuve de concept (Foundry) :**

```bash
cd /home/noor/PROJECTS/dubai-real-estate-v2
forge build --skip test --force
```

Résultat : échec de compilation à `script/upgrade/UpgradeDREIT.s.sol:30`.

**Recommandation :**
Utiliser le sélecteur explicite ou importer `UUPSUpgradeable` :

```solidity
bytes memory upgradeData = abi.encodeWithSelector(
    bytes4(keccak256("upgradeToAndCall(address,bytes)")),
    address(newImpl),
    ""
);
```

Ou bien :

```solidity
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
// ...
bytes memory upgradeData = abi.encodeWithSelector(
    UUPSUpgradeable.upgradeToAndCall.selector,
    address(newImpl),
    ""
);
```

**Références :**
- SWC-123 (Broken access control indirect via script failure)
- OpenZeppelin UUPSUpgradeable docs

---

### H-02 — Hooks `transferred/created/destroyed` sans contrôle d'accès

**Sévérité :** High  
**Fichier(s) :** `src/compliance/ComplianceEngine.sol:106-139`  
**Description :**
Les hooks stateful du moteur de compliance sont déclarés `external override` sans aucun `onlyRole` ni vérification d'appelant :

```solidity
function transferred(address, address, uint256) external override { /* Phase 2 stub */ }
function created(address, uint256) external override { /* Phase 2 stub */ }
function destroyed(address, uint256) external override { /* Phase 2 stub */ }
```

En Phase 2, ils sont vides, donc l'impact immédiat est nul. Cependant, l'interface `IComplianceEngine` et l'architecture prévoient l'ajout de modules de compliance stateful (limites journalières, compteurs, etc.). Si un module est ajouté et que ces hooks restent non protégés, n'importe quel attaquant pourra manipuler l'état interne du moteur (par exemple incrémenter/décrémenter des compteurs à sa guise).

**Impact :**
Bypass de futures règles de compliance (limites de transfert, plafonds d'investissement, etc.), voire corruption de l'état comptable du moteur.

**Preuve de concept (conceptuel) :**
Un module futur `DailyLimitModule` pourrait implémenter `transferred(from,to,amount)` pour incrémenter un compteur. Un attaquant appelant directement `compliance.transferred(victim, attacker, 0)` pourrait fausser les statistiques ou bloquer le victim en dépassant artificiellement sa limite.

**Recommandation :**
Restreindre l'appel des hooks au `token` lié, via un modificateur `onlyToken` :

```solidity
modifier onlyToken() {
    if (msg.sender != token) revert ComplianceEngine__NotToken();
    _;
}

function transferred(address from, address to, uint256 amount) external override onlyToken { ... }
function created(address to, uint256 amount) external override onlyToken { ... }
function destroyed(address from, uint256 amount) external override onlyToken { ... }
```

Alternative : utiliser un rôle `TOKEN_ROLE` pour permettre plusieurs tokens autorisés.

**Références :**
- SWC-106 (Unprotected SELFDESTRUCT / unrestricted external call — analogie sur la logique stateful)
- OpenZeppelin AccessControl patterns

---

### H-03 — Déploiement Sepolia : deployer = Gnosis Safe

**Sévérité :** High  
**Fichier(s) :** `script/HelperConfig.s.sol:84-95`, `script/deploy/DeployPhase2.s.sol:46-49`, `deployments/testnet.json`  
**Description :**
Sur Sepolia, `HelperConfig._getSepoliaPhase2Config` utilise `vm.envOr` pour `GNOSIS_SAFE`, `ISSUER_ADDRESS` et `REGULATOR_ADDRESS`, avec comme valeur par défaut le `deployer` :

```solidity
gnosisSafe: vm.envOr("GNOSIS_SAFE", deployer),
issuer: vm.envOr("ISSUER_ADDRESS", deployer),
regulator: vm.envOr("REGULATOR_ADDRESS", deployer),
```

Le `deployments/testnet.json` confirme que `gnosisSafe == deployer == 0x9e3f...`. Le brief mentionne déjà que c'est une "configuration démo".

**Impact :**
Sur Sepolia, le `deployer` unique détient à la fois les rôles opérationnels (mint, freeze) et de gouvernance (PROPOSER/EXECUTOR du Timelock). Le Timelock de 48h est contourné car le même wallet peut proposer et exécuter immédiatement.

**Recommandation :**
Avant mainnet :
1. Définir `GNOSIS_SAFE`, `ISSUER_ADDRESS`, `REGULATOR_ADDRESS` comme obligatoires (pas de fallback sur `deployer`).
2. Sur mainnet, utiliser une vraie Gnosis Safe multisig pour `GNOSIS_SAFE`.
3. Faire vérifier la configuration post-déploiement (roles, timelock delay) via un script de sanity check.

**Références :**
- SWC-100 (Function Default Through Visibility) — analogie sur les valeurs par défaut dangereuses
- OpenZeppelin TimelockController best practices

---

### M-01 — `deleteIdentity` contourne la vérification de solde si `token` non initialisé

**Sévérité :** Medium  
**Fichier(s) :** `src/compliance/IdentityRegistry.sol:345-367`  
**Description :**
`deleteIdentity` ne vérifie le solde et les dividendes que si `token != address(0)` :

```solidity
if (token != address(0)) {
    if (IERC20(token).balanceOf(investor) > 0) { revert; }
    uint256 pending = IDividendAware(token).pendingDividendsOf(investor);
    if (pending > 0) { revert; }
}
```

Si `setToken` n'a pas été appelé (oubli de wiring), un `ISSUER_ROLE` peut supprimer l'identité d'un investisseur détenteur de tokens.

**Impact :**
Perte de la KYC pour un porteur de tokens, potentiellement bloqué ensuite par les vérifications de compliance. Le token devient inutilisable pour cet investisseur jusqu'à ré-enregistrement.

**Preuve de concept (Foundry) :**

```solidity
function test_DeleteIdentity_BypassWhenTokenNotSet() public {
    vm.prank(issuer);
    registry.registerIdentity(karim, address(mockIdentity), 784);
    // token.mint non pertinent si token non lié
    // Mais si le token est déployé et que registry.setToken n'a pas été appelé :
    vm.prank(issuer);
    registry.deleteIdentity(karim); // ne revert pas, identité supprimée
    assertFalse(registry.isVerified(karim));
}
```

**Recommandation :**
Rendre `token` obligatoire dès l'initialisation (via paramètre du `initialize`) ou ajouter une variable booléenne `tokenBound` initialisée à `true` dans le `initialize`. Alternative : faire revenir `deleteIdentity` si `token == address(0)` pour forcer le wiring préalable.

**Références :**
- SWC-110 (Insufficient gas griefing) — non direct, mais relatif à l'état partiellement initialisé
- CWE-459 (Incomplete Cleanup)

---

### M-02 — Whitelist asymétrique : seul le destinataire est vérifié

**Sévérité :** Medium  
**Fichier(s) :** `src/compliance/ComplianceEngine.sol:75-104` (ligne 101)  
**Description :**
En mode whitelist, seul `to` est vérifié :

```solidity
if (to != address(0) && whitelistEnabled && !_whitelisted[to]) return false;
```

Un expéditeur non-whitelisté peut donc envoyer des tokens à un destinataire whitelisté.

**Impact :**
Selon le modèle de compliance VARA souhaité, cela peut permettre à des comptes non approuvés de réduire leur exposition (ce qui peut être souhaité) mais aussi de perturber la traçabilité. Si l'intention est de restreindre **tous** les participants au registre whitelisté, cette règle est insuffisante.

**Recommandation :**
Clarifier la politique. Si les deux parties doivent être whitelistées :

```solidity
if (whitelistEnabled) {
    if (from != address(0) && !_whitelisted[from]) return false;
    if (to != address(0) && !_whitelisted[to]) return false;
}
```

Alternative : conserver le comportement actuel mais le documenter explicitement (whitelist = "authorized recipients only").

**Références :**
- SWC-135 (Code With No Effects) — non direct, mais relatif à une logique incomplète

---

### M-03 — Makefile expose la clé privée en ligne de commande

**Sévérité :** Medium  
**Fichier(s) :** `Makefile:7, 13, 17, 19, 22`  
**Description :**
Les cibles `deploy-local`, `deploy-sepolia`, `deploy-mainnet`, `upgrade-sepolia` passent `--private-key` directement en ligne de commande. Exemple :

```makefile
deploy-sepolia:
	@. ./.env && forge script ... --private-key $${PRIVATE_KEY} --broadcast ...
```

Sur un serveur partagé, la clé privée peut apparaître dans `ps`, `.bash_history`, ou les logs de processus.

**Impact :**
Fuite potentielle de la clé privée du deployer, conduisant à une prise de contrôle totale des contrats et des fonds.

**Recommandation :**
Utiliser un keystore Foundry (`--account`) ou un wallet matériel via `cast wallet` :

```makefile
deploy-sepolia:
	@. ./.env && forge script script/deploy/DeployPhase2.s.sol --rpc-url $${SEPOLIA_RPC_URL} --account deployer --broadcast --verify --etherscan-api-key $${ETHERSCAN_API_KEY}
```

Alternative : utiliser une variable d'environnement `ETH_FROM` avec `--unlocked` sur un nœud local sécurisé.

**Références :**
- CWE-798 (Use of Hard-coded Credentials)
- Foundry docs : `cast wallet`

---

### M-04 — `setIdentityRegistry` n'exige pas un contrat

**Sévérité :** Medium  
**Fichier(s) :** `src/compliance/ComplianceEngine.sol:183-186`  
**Description :**
`setIdentityRegistry` ne vérifie que l'adresse est non nulle :

```solidity
function setIdentityRegistry(address registry) external onlyRole(DEFAULT_ADMIN_ROLE) nonZeroAddress(registry) {
    identityRegistry = IIdentityRegistry(registry);
    emit IdentityRegistrySet(registry);
}
```

Contrairement à `DubaiRealEstateToken.setIdentityRegistry`, il n'y a pas de vérification `registry.code.length > 0`.

**Impact :**
En cas d'erreur de configuration (adresse EOA ou mauvais contrat), tous les appels à `identityRegistry.isVerified(...)` échoueront, bloquant tous les transferts et mints.

**Recommandation :**
Ajouter la vérification de code :

```solidity
if (registry.code.length == 0) revert ComplianceEngine__NotContract(registry);
```

**Références :**
- CWE-20 (Improper Input Validation)

---

### M-05 — Mauvais sélecteurs d'erreur pour taille de batch

**Sévérité :** Medium  
**Fichier(s) :** `src/core/DubaiRealEstateToken.sol:161`, `src/compliance/IdentityRegistry.sol:375, 378`  
**Description :**
- `DubaiRealEstateToken.batchMint` réutilise `DREIT__ArrayLengthMismatch` lorsque `length > 100`.
- `IdentityRegistry.batchRegisterIdentity` réutilise `IIdentityRegistry__ArrayLengthMismatch` pour `length == 0`, tailles inégales, et `length > 200`.

**Impact :**
Les frontends et outils d'analyse ne peuvent pas distinguer la cause réelle du revert, compliquant le debugging et l'UX.

**Recommandation :**
Ajouter des erreurs dédiées :

```solidity
error DREIT__BatchSizeExceeded(uint256 size);
error IIdentityRegistry__EmptyBatch();
error IIdentityRegistry__BatchSizeExceeded(uint256 size);
```

**Références :**
- SWC-123 (Broken access control) — non direct, mais relatif à la qualité des messages d'erreur

---

### M-06 — `_update` appelle un moteur de compliance externe sans `nonReentrant`

**Sévérité :** Medium  
**Fichier(s) :** `src/core/DubaiRealEstateToken.sol:378-405`  
**Description :**
La fonction `_update` (appelée par `transfer`, `transferFrom`, `mint`, `burn`) effectue un appel externe à `complianceEngine.transferred(...)` **après** la mise à jour des soldos :

```solidity
_syncDividends(from);
_syncDividends(to);
super._update(from, to, amount);
complianceEngine.transferred(from, to, amount);
```

Actuellement, `ComplianceEngine.transferred` est un no-op. Mais si le moteur est remplacé par une implémentation malveillante (via `setComplianceEngine` si l'admin est compromis), l'appel externe pourrait tenter une réentrance dans `transfer`/`transferFrom`.

**Impact :**
Bien que le pattern CEI soit respecté et qu'aucune vulnérabilité de réentrance exploitable n'ait été identifiée avec le code actuel, l'absence de garde `nonReentrant` sur les fonctions de transfert réduit la marge de sécurité face à un moteur de compliance corrompu.

**Recommandation :**
1. Défense en profondeur : ajouter `nonReentrant` aux fonctions `transfer` et `transferFrom` (nécessite de surcharger `transfer`/`transferFrom` dans `DubaiRealEstateToken`).
2. Ou, plus simplement, restreindre `setComplianceEngine` à un Timelock très long et auditer toute nouvelle implémentation.

**Références :**
- SWC-107 (Reentrancy)
- Consensys Smart Contract Best Practices — Checks-Effects-Interactions

---

### L-01 — `setToken` n'émet pas d'événement

**Sévérité :** Low  
**Fichier(s) :** `src/compliance/IdentityRegistry.sol:125-128`  
**Description :**
`setToken` est la seule fonction `set*` du contrat à ne pas émettre d'événement.

**Recommandation :**
Ajouter un événement `TokenSet(address indexed oldToken, address indexed newToken)` pour la traçabilité.

---

### L-02 — Hooks de compliance vides : modularité non implémentée

**Sévérité :** Low  
**Fichier(s) :** `src/compliance/ComplianceEngine.sol:106-139, 204-218`  
**Description :**
Les fonctions `transferred`, `created`, `destroyed`, `addModule`, `removeModule`, `getModules`, `isModuleBound` sont des stubs vides. C'est documenté comme "Phase 2 / Phase 3".

**Impact :**
Aucun module de compliance stateful (limites journalières, plafonds, compteurs) n'est actif. Cela limite la conformité réglementaire.

**Recommandation :**
Implémenter le système de modules ou retirer les stubs si non utilisés. Si conservés, documenter clairement qu'ils ne sont pas fonctionnels.

---

### L-03 — Registres de trusted issuers / claim topics non utilisés

**Sévérité :** Low  
**Fichier(s) :** `src/compliance/IdentityRegistry.sol:30-38, 130-166, 169-236`  
**Description :**
`IdentityRegistry` stocke `_trustedIssuersRegistry`, `_claimTopicsRegistry`, `_identityStorage` et une liste de `trustedIssuers`, mais ces données ne sont pas utilisées dans `isVerified`.

**Impact :**
La vérification d'identité ne repose que sur l'existence du contrat d'identité et la date d'expiration. Les fonctionnalités ERC-3643 avancées (claims signés par des trusted issuers) ne sont pas opérationnelles.

**Recommandation :**
Implémenter la logique de vérification des claims ou retirer ces registres pour alléger le contrat.

---

### L-04 — `updateIdentity` permet d'attribuer le même contrat d'identité à plusieurs investisseurs

**Sévérité :** Low  
**Fichier(s) :** `src/compliance/IdentityRegistry.sol:307-322`  
**Description :**
`updateIdentity` ne vérifie pas que le nouveau contrat d'identité n'est pas déjà utilisé par un autre investisseur.

**Impact :**
Deux investisseurs peuvent partager le même contrat d'identité, ce qui peut poser des problèmes de traçabilité KYC et de gestion des claims.

**Recommandation :**
Ajouter une vérification d'unicité ou utiliser une mapping inverse `identityContract => investor`.

---

### L-05 — `restrictCountry` n'a pas de validation du code pays

**Sévérité :** Low  
**Fichier(s) :** `src/compliance/ComplianceEngine.sol:155-158`  
**Description :**
`restrictCountry(uint16 country)` accepte n'importe quel `uint16`, y compris 0 ou des codes > 999, sans validation.

**Impact :**
Un régulateur peut restreindre le code 0 (qui est la valeur par défaut d'un mapping), bien que cela soit sans effet car `isVerified` bloque déjà les non-enregistrés. Cependant, cela peut prêter à confusion.

**Recommandation :**
Réutiliser le modificateur `validCountry` du `IdentityRegistry` ou créer un modificateur équivalent dans `ComplianceEngine`.

---

### L-06 — Imports mixtes upgradeable / non-upgradeable

**Sévérité :** Low  
**Fichier(s) :** `src/core/DubaiRealEstateToken.sol:4-14`  
**Description :**
Le contrat importe `ReentrancyGuard` depuis `@openzeppelin/contracts` alors que les autres contrats sont upgradeables.

**Impact :**
Avec OpenZeppelin v5.5.0, `ReentrancyGuard` utilise le stockage namespacé ERC-7201 (`@custom:stateless`), donc il n'y a pas de collision de storage. L'usage est techniquement correct. Cependant, cela peut prêter à confusion lors des futures audits.

**Recommandation :**
Remplacer par `ReentrancyGuardUpgradeable` pour la cohérence, ou ajouter un commentaire expliquant que `ReentrancyGuard` v5 est stateless.

---

### I-01 — Optimisations gas

**Sévérité :** Informational  
**Description :**
- `notFrozen` effectue un appel externe `complianceEngine.isFrozen(account)` à chaque utilisation. Dans `mint` et `batchMint`, cela peut être évité en combinant avec `complianceEngine.canCreate` qui vérifie déjà le gel.
- `distributeDividends` effectue plusieurs `SSTORE` successifs (`dust = 0`, `dust += ...`, `dividendPerToken += ...`, `totalPendingDividends += ...`). Certains peuvent être regroupés.
- `batchMint` et `batchRegisterIdentity` pourraient utiliser des boucles `unchecked` pour les indices, mais le gain est mineur en Solidity 0.8.28.

**Recommandation :**
Passer un audit de gas dédié avant mainnet si le coût de transaction est un critère.

---

### I-02 — Complétion NatSpec / documentation

**Sévérité :** Informational  
**Description :**
- `DubaiRealEstateTokenV2` est décrit comme "démonstration". Il faut s'assurer qu'aucune version de production ne repose sur ce contrat sans ajout de tests et de documentation.
- Les fonctions stubs du `ComplianceEngine` devraient documenter explicitement qu'elles sont intentionnellement vides en Phase 2.
- Le `Makefile` devrait documenter que `--private-key` est une approche locale/insecure.

---

## 5. Analyse de Conformité VARA

| Exigence VARA (simplifiée) | Implémentation | Statut | Commentaire |
|----------------------------|----------------|--------|-------------|
| KYC/AML obligatoire avant participation | `IdentityRegistry.isVerified` + expiry | ✅ Conforme | Vérification on-chain, expiration annuelle par défaut |
| Classification des investisseurs | `InvestorType` enum | ⚠️ Partiel | Types stockés mais non utilisés pour restreindre |
| Blocage des transferts vers jurisdictions interdites | `_restrictedCountries` | ✅ Conforme | Restriction par code pays |
| Gel des comptes (sanctions) | `freezeInvestor` / `unfreezeInvestor` | ✅ Conforme | Régulateur peut geler/dégeler |
| Transferts forcés / saisies | `forcedTransfer` / `forcedBurn` | ✅ Conforme | Régulateur peut saisir/brûler |
| Limite d'investisseurs / plafonds | Non implémenté | ❌ Non conforme | Pas de limites par investisseur ou juridiction |
| Période de détention / lock-up | Non implémenté | ❌ Non conforme | Pas de vesting ou holding period |
| Reporting / événements auditables | Événements présents | ✅ Conforme | La plupart des actions émettent des événements |
| Séparation des rôles (gouvernance/opérations) | `AccessControl` + Timelock | ✅ Conforme (si bien configuré) | Sur mainnet, exiger une Gnosis Safe réelle |
| Audit externe avant déploiement | Non réalisé | ❌ Non conforme | Disclaimer présent mais audit professionnel manquant |

### Gaps réglementaires identifiés

1. **Aucune limite de détention / plafond par investisseur.** VARA/DLD peuvent exiger des plafonds par catégorie d'investisseur ou par juridiction.
2. **Aucune période de lock-up.** Les tokens RWA immobiliers nécessitent souvent des restrictions de revente pendant une période initiale.
3. **Les types d'investisseurs (`Retail`, `Accredited`, etc.) ne sont pas utilisés.** Un investisseur `Retail` pourrait théoriquement détenir autant de tokens qu'un `Institutional`.
4. **Aucun mécanisme de reporting réglementaire automatique** (émission périodique d'événements ou snapshots).
5. **Trusted issuers / claims ERC-735 non implémentés.** La traçabilité KYC repose entièrement sur le contrat `IdentityRegistry` centralisé.

---

## 6. Architecture & Code Quality

### 6.1 Qualité du code

**Points forts :**
- Utilisation correcte d'OpenZeppelin v5 avec `Initializable`, `UUPSUpgradeable`, `AccessControlUpgradeable`.
- `constructor()` appelle `_disableInitializers()` sur toutes les implémentations, protégeant contre l'initialisation directe.
- Pattern CEI respecté dans les fonctions sensibles (`claimDividends`, `burn`, `forcedBurn`).
- NatSpSpec complet sur les contrats principaux.
- Erreurs personnalisées et événements structurés.

**Points à améliorer :**
- Scripts de déploiement/upgrade méritent une revue plus stricte (voir H-01, M-03, H-03).
- Certains modificateurs et erreurs sont réutilisés pour des cas distincts (M-05).
- La modularité du `ComplianceEngine` est uniquement un squelette (L-02).

### 6.2 Gas Optimization Report

| Opportunité | Fichier | Gain estimé | Priorité |
|-------------|---------|-------------|----------|
| Éviter double appel `complianceEngine.isFrozen` dans `mint`/`batchMint` | `DubaiRealEstateToken.sol` | ~2 100 gas/appel | Low |
| Regrouper les écritures `dust` dans `distributeDividends` | `DubaiRealEstateToken.sol` | ~5 000 gas | Low |
| Utiliser `calldata` pour les tableaux en lecture seule | divers | faible | Low |
| Remplacer `balanceOf(to) == 0` par une vérification de `lastClaimed[to]` dans `_update` | `DubaiRealEstateToken.sol` | 1 SLOAD économisé | Informational |

### 6.3 Suggestions de refactoring

1. **Extraire la logique dividende** dans une bibliothèque ou un contrat interne `_DividendTracker` pour réduire la taille de `DubaiRealEstateToken`.
2. **Implémenter un `ComplianceModuleRegistry`** réel pour remplacer les stubs.
3. **Uniformiser les vérifications de contrat** (`code.length > 0`) dans tous les setters.
4. **Ajouter un script de post-deployment sanity check** vérifiant les rôles, le timelock delay, et le wiring registry↔token↔compliance.

---

## 7. Tests & Coverage Analysis

### 7.1 Résultats des tests

```bash
forge test --summary
# 232 tests passed, 0 failed, 0 skipped
```

| Suite | Tests |
|-------|-------|
| DubaiRealEstateTokenTest | 94 |
| IdentityRegistryTest | 76 |
| ComplianceEngineTest | 46 |
| DREITUpgradeTest | 5 |
| DREITIntegrationTest | 3 |
| DubaiRealEstateTokenFuzzTest | 8 |

### 7.2 Couverture actuelle

| Contrat | Lines | Statements | Branches | Functions |
|---------|-------|------------|----------|-----------|
| DubaiRealEstateToken.sol | 95.02% | 94.16% | 90.16% | 100% |
| IdentityRegistry.sol | 97.81% | 97.59% | 89.19% | 97.30% |
| ComplianceEngine.sol | 96.25% | 98.65% | 100% | 93.10% |
| DubaiRealEstateTokenV2.sol | 100% | 100% | — | 100% |

**Objectif cible :** 95% sur toutes les métriques.

### 7.3 Scénarios de tests manquants

- Upgrade du `ComplianceEngine` et de `IdentityRegistry` (pas seulement du token).
- Tentative d'appel direct des hooks `transferred/created/destroyed` par un tiers.
- `deleteIdentity` lorsque `token` n'est pas défini.
- `batchMint` avec `length > 100` (actuellement le test de la limite n'existe pas).
- `setIdentityRegistry` avec une adresse EOA.
- Réentrance via un moteur de compliance malveillant.
- Distribution de dividendes avec `dust` important puis `sweepDust`.
- Renonciation complète du `deployer` après déploiement (test du script `DeployPhase2`).
- Upgrade via `TimelockController` pour `ComplianceEngine` et `IdentityRegistry`.

### 7.4 Invariants suggérés

1. `totalSupply == sum(balanceOf(all holders))` (déjà testé en fuzz).
2. `sum(pendingDividendsOf) <= usdc.balanceOf(token) + dust`.
3. `balanceOf(investor) > 0 => isVerified(investor)`.
4. `isFrozen(account) => isCompliant(account, *, *) == false`.
5. Seul `DEFAULT_ADMIN_ROLE` peut appeler `upgradeToAndCall`.

---

## 8. Vérification du Déploiement Sepolia

Les adresses du `deployments/testnet.json` ont été comparées au bytecode compilé localement avec `solc 0.8.28`, `optimizer_runs=200`, `via_ir=true`, `evm_version=shanghai`.

| Contrat | Adresse Sepolia | Correspondance bytecode |
|---------|-----------------|-------------------------|
| DREIT Token Impl | `0x54d3853ad3C283aC12cbfa2fF8FF0a72B27B49Be` | ✅ Identique (28 270 octets) |
| IdentityRegistry Impl | `0x9BB17957fc8A62B6c139ECcC8df56540Cdb5B200` | ⚠️ Longueur identique, différences internes mineures |
| ComplianceEngine Impl | `0xA66BcFc4AE9B856C6A9594EeC3Ad37f3c03AF8Df` | ⚠️ Longueur identique, différences internes mineures |
| DREIT Proxy | `0x8Dba9525Dd70dbfBa528cDE818373df24c09A189` | ✅ Proxy ERC1967 standard |
| IdentityRegistry Proxy | `0x92a65AE2F3fbDE6e917CFaf6A1C69FD23bA102C0` | ✅ Proxy ERC1967 standard |
| ComplianceEngine Proxy | `0x2a6847579906bAA18656b43d587C33d7521C893B` | ✅ Proxy ERC1967 standard |
| TimelockController | `0xC51AaccB820DC42D1b57B729A0Abd9700819643d` | — Non vérifié (hors scope) |

### Notes

- Le **token DREIT** correspond exactement au code source audité.
- Les implémentations **IdentityRegistry** et **ComplianceEngine** présentent des différences internes (littéraux d'adresse intégrés dans le bytecode déployé alors que le code local contient des zéros). Cela suggère une légère différence de source ou de paramètre de compilation. **Il est recommandé de redéployer ces deux implémentations depuis le code source audité avant mainnet**, ou de vérifier via Etherscan que le code source vérifié correspond ligne à ligne.
- Les proxies pointent bien vers les implémentations déclarées (slot ERC-1967 vérifié).

---

## 9. Roadmap Post-Audit

### Actions immédiates (Critical / High)

- [ ] Corriger `script/upgrade/UpgradeDREIT.s.sol` (H-01).
- [ ] Ajouter `onlyToken` sur les hooks `transferred/created/destroyed` (H-02).
- [ ] Sur Sepolia, transférer le rôle Gnosis Safe vers une vraie multisig (H-03).
- [ ] Sur mainnet, rendre `GNOSIS_SAFE`, `ISSUER_ADDRESS`, `REGULATOR_ADDRESS` obligatoires sans fallback `deployer`.

### Actions avant mainnet (Medium)

- [ ] Rendre `token` obligatoire dans `IdentityRegistry` ou bloquer `deleteIdentity` si non défini (M-01).
- [ ] Clarifier et éventuellement corriger la logique whitelist (M-02).
- [ ] Remplacer `--private-key` par `--account` / keystore dans le `Makefile` (M-03).
- [ ] Ajouter `code.length` check dans `ComplianceEngine.setIdentityRegistry` (M-04).
- [ ] Ajouter des erreurs dédiées pour les tailles de batch (M-05).
- [ ] Évaluer l'ajout de `nonReentrant` sur `transfer`/`transferFrom` (M-06).
- [ ] Redéployer IdentityRegistry et ComplianceEngine depuis le source audité si les différences de bytecode ne sont pas expliquées.

### Actions d'amélioration continue (Low / Informational)

- [ ] Ajouter un événement `TokenSet` (L-01).
- [ ] Implémenter les modules de compliance ou retirer les stubs (L-02).
- [ ] Utiliser ou retirer les registres de trusted issuers (L-03).
- [ ] Vérifier l'unicité des contrats d'identité (L-04).
- [ ] Valider les codes pays dans `restrictCountry` (L-05).
- [ ] Uniformiser les imports `ReentrancyGuard` (L-06).
- [ ] Audit de gas et refactoring de la logique dividende.
- [ ] Compléter la documentation VARA et les gaps réglementaires.
- [ ] Audit externe par une firme tierce certifiée.

---

## 10. Disclaimer

Ce rapport est une **analyse éducative et technique** réalisée par un agent IA. Il ne remplace en aucun cas un audit professionnel par une firme tierce certifiée (CertiK, OpenZeppelin, Trail of Bits, Hacken, etc.) avant tout déploiement sur mainnet ou utilisation avec des fonds réels.

Le projet DREIT est développé à des fins éducatives et de démonstration de portfolio. Les smart contracts présentés n'ont PAS été audités par une firme professionnelle tierce. Avant tout déploiement sur mainnet, un audit formel par une entreprise certifiée est **IMPÉRATIF**.

L'auteur, les contributeurs et les outils d'IA utilisés déclinent toute responsabilité en cas de perte de fonds, de non-conformité réglementaire ou de tout dommage résultant de l'utilisation de ce code.

---

## 11. Remediation Log

Les actions suivantes ont été effectuées sur le code source après la rédaction initiale de ce rapport :

| ID | Action | Fichiers modifiés | Tests ajoutés |
|----|--------|-------------------|---------------|
| H-01 | Import de `UUPSUpgradeable` et utilisation de `UUPSUpgradeable.upgradeToAndCall.selector` | `script/upgrade/UpgradeDREIT.s.sol` | — |
| H-02 | Ajout du modificateur `onlyToken` sur `transferred/created/destroyed` | `src/compliance/ComplianceEngine.sol` | `test_TransferredHook_ByToken`, `test_TransferredHook_ByNonTokenReverts`, `test_CreatedHook_ByToken`, `test_CreatedHook_ByNonTokenReverts`, `test_DestroyedHook_ByToken`, `test_DestroyedHook_ByNonTokenReverts` |
| H-03 | `GNOSIS_SAFE`, `ISSUER_ADDRESS`, `REGULATOR_ADDRESS` rendus obligatoires (pas de fallback `deployer`) | `script/HelperConfig.s.sol`, `.env.example` | — |
| M-01 | `deleteIdentity` revert désormais si `token == address(0)` | `src/compliance/IdentityRegistry.sol` | `test_DeleteIdentity_TokenNotSet` |
| M-02 | Vérification de l'expéditeur **et** du destinataire en mode whitelist | `src/compliance/ComplianceEngine.sol` | `test_IsCompliant_NonWhitelistedSenderReverts` |
| M-03 | Remplacement de `--private-key` par `--account` (keystore Foundry) dans le `Makefile` | `Makefile`, `.env.example`, `README.md` | — |
| M-04 | Vérification `registry.code.length > 0` dans `setIdentityRegistry` | `src/compliance/ComplianceEngine.sol` | `test_SetIdentityRegistry_NotContract` |
| M-05 | Ajout d'erreurs dédiées `EmptyBatch` / `BatchSizeExceeded` | `src/core/DubaiRealEstateToken.sol`, `src/compliance/IdentityRegistry.sol`, `src/interfaces/*.sol` | `test_BatchMint_EmptyBatch`, `test_BatchMint_BatchSizeExceeded` |
| M-06 | Surcharge de `transfer` et `transferFrom` avec `nonReentrant` | `src/core/DubaiRealEstateToken.sol` | — |
| L-01 | Émission de l'événement `TokenSet` dans `setToken` | `src/compliance/IdentityRegistry.sol`, `src/interfaces/IIdentityRegistry.sol` | `test_SetToken_EmitsEvent` |
| L-04 | Mapping inverse `identityContract => investor` et vérification d'unicité | `src/compliance/IdentityRegistry.sol` | `test_RegisterIdentity_DuplicateIdentityContract`, `test_UpdateIdentity_DuplicateIdentityContract` |
| L-05 | Validation du code pays (`0 < country <= 999`) dans `restrictCountry` / `unrestrictCountry` | `src/compliance/ComplianceEngine.sol` | `test_RestrictCountry_InvalidCountryCode` |
| L-06 | Commentaire expliquant l'usage de `ReentrancyGuard` non-upgradeable (stateless en OZ v5) | `src/core/DubaiRealEstateToken.sol` | — |

### Résultat des tests post-remediation

```bash
$ forge test --summary
# 244 tests passed, 0 failed, 0 skipped
```

### Actions restantes avant mainnet

1. **Redéployer sur Sepolia** avec les fixes ci-dessus pour obtenir des adresses testnet à jour.
2. **Créer une vraie Gnosis Safe** et renseigner `GNOSIS_SAFE`, `ISSUER_ADDRESS`, `REGULATOR_ADDRESS` dans `.env`.
3. **Auditer formellement** le code par une firme tierce certifiée.
4. **Implémenter les modules de compliance** (Phase 3) pour combler les gaps L-02 / L-03.

---

*Fin du rapport.*
