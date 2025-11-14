# Architecture - Admin MBA

## Vue d'ensemble

Plateforme d'administration pour la gestion des écoles, programmes, classes, membres et contenus pédagogiques.

## Base de données

### Table `membres`

#### Champ `is_active` - Statut des membres

Le champ `is_active` dans la table `membres` gère le statut global d'un membre dans le système.

**Valeurs possibles :**

| Valeur | Statut | Description |
|--------|--------|-------------|
| `1` | **Actif** | Membre actif, peut se connecter et accéder aux ressources (valeur par défaut) |
| `0` | **Inactif** | Membre désactivé, ne peut pas se connecter mais les données sont conservées |
| `9` | **Banni** | Membre banni, accès refusé de manière permanente, ne peut pas se connecter |

**Utilisation dans le code :**

1. **Création de membres** : Les nouveaux membres sont créés avec `is_active = 1` par défaut
2. **Comptage des membres actifs** : Seuls les membres avec `is_active = 1` sont comptés dans les statistiques
3. **Validation dans les classes** : Un membre doit avoir `is_active = 1` pour être considéré comme "actif" dans une classe
4. **Contrôle d'accès** : Les membres avec `is_active = 0` ou `is_active = 9` ne peuvent pas se connecter

**Exemple de requête SQL :**

```sql
-- Compter les membres actifs (excluant les bannis et inactifs)
SELECT COUNT(*) 
FROM membres 
WHERE is_active = 1;

-- Compter les membres bannis
SELECT COUNT(*) 
FROM membres 
WHERE is_active = 9;
```

**Important :** 
- La valeur `9` est réservée pour les membres bannis
- Cette convention doit être respectée dans tout le code qui gère les statuts
- Les membres bannis (`is_active = 9`) doivent être traités différemment des membres inactifs (`is_active = 0`)

## Structure des tables principales

### Table `membres`
- `id` : Identifiant unique
- `first_name`, `last_name` : Nom et prénom
- `email` : Email (unique)
- `phone` : Téléphone
- `password_hash` : Hash du mot de passe
- `is_active` : Statut (1=actif, 0=inactif, 9=banni)
- `last_login` : Date de dernière connexion
- `created_at`, `updated_at` : Dates de création et modification

### Table `membres_classes`
- `membre_id` : Référence vers `membres.id`
- `class_id` : Référence vers `classes.id`
- `status` : Statut dans la classe ('active' ou 'inactive')

### Table `class_representatives`
- `class_id` : Référence vers `classes.id`
- `member_id` : Référence vers `membres.id`
- `status` : Statut du représentant ('active' ou 'inactive')

## Logique de statut

### Membre actif dans une classe
Un membre est considéré comme "actif" dans une classe si :
1. `membres_classes.status = 'active'`
2. ET `membres.is_active = 1`

### Membre actif pour les statistiques
Un membre est considéré comme "actif" pour les statistiques si :
1. `membres.is_active = 1`
2. ET `membres.last_login IS NOT NULL`
3. ET `membres.last_login >= datetime('now', '-15 days')`

## API Endpoints

### `/api/members`
- `GET` : Liste des membres avec filtres
- `POST` : Créer un nouveau membre (par défaut `is_active = 1`)
- `PUT /api/members/:id` : Modifier un membre (peut changer `is_active`)

### `/api/classes`
- `GET` : Liste des classes avec statistiques
- Le comptage des membres actifs utilise `membres.is_active = 1`

### `/api/dashboard`
- Statistiques globales et par programme
- Utilise `membres.is_active = 1` pour compter les membres actifs

## Notes importantes

- Les membres bannis (`is_active = 9`) ne doivent jamais être comptés dans les statistiques
- Les membres inactifs (`is_active = 0`) peuvent être réactivés en changeant la valeur à `1`
- Les membres bannis (`is_active = 9`) nécessitent une action administrative pour être réactivés

