# Rapport d'audit de sécurité — ShopVuln

**Auteur :** <ton nom>
**Date :** <date>
**Périmètre :** dépôt ShopVuln (Node.js / Express / SQLite), revue de code + tests manuels en local
**Pull request :** <lien>

## 1. Synthèse

| # | Vulnérabilité | Catégorie OWASP 2025 | Sévérité | Statut |
|---|---|---|---|---|
| 1 | … | A0X – … | Critique / Haute / Moyenne / Faible | Corrigée |
| 2 | … | … | … | Corrigée |

Résumé en 3-4 phrases : le niveau de risque global, les failles les plus graves, ce qui a été corrigé.

## 2. Détail des vulnérabilités

### Vuln 1 — <nom>

- **Localisation :** `fichier.js`, ligne X (route `METHODE /chemin`)
- **Catégorie :** A0X – <nom OWASP>
- **Sévérité :** <niveau> — justification courte (impact × facilité d'exploitation)

**Description.** Pourquoi le code est vulnérable : quelle entrée est contrôlée par l'utilisateur, où elle arrive sans contrôle.

**Preuve d'exploitation.** La requête ou la saisie qui démontre la faille, et ce qu'on observe.

```
<requête / payload>
```

**Impact.** Ce qu'un attaquant obtient concrètement (données, comptes, serveur…).

**Correction appliquée.**

```js
// avant
...
// après
...
```

Pourquoi la correction fonctionne, en une ou deux phrases.

**Vérification.** Comment tu as vérifié que l'attaque ne marche plus et que la fonctionnalité marche toujours.

---

### Vuln 2 — <nom>
(même structure)

## 3. Vulnérabilités identifiées mais non corrigées

Pour chacune : localisation, catégorie, une phrase de description, la correction recommandée.

## 4. Recommandations générales

Mesures transverses (ex. : validation centralisée des entrées, en-têtes de sécurité, gestion des secrets, journalisation).
