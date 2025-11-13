# DevBook - Admin MBA

## 📚 Gestion des Classes

### Vue d'ensemble
Le système de gestion des classes permet d'organiser les étudiants en groupes et d'assigner des représentants à chaque classe.

### Tables de base de données

#### `classes`
- `id` (INTEGER, PRIMARY KEY)
- `school_id` (INTEGER, NOT NULL) - Référence vers l'école
- `code` (TEXT) - Code unique de la classe (ex: "v1-102")
- `title` (TEXT) - Nom de la classe (ex: "Classe v1-102")
- `description` (TEXT) - Description de la classe
- `created_at` (DATETIME) - Date de création

#### `membres_classes`
- `id` (INTEGER, PRIMARY KEY)
- `membre_id` (INTEGER, NOT NULL) - Référence vers le membre
- `class_id` (INTEGER, NOT NULL) - Référence vers la classe
- `school_id` (INTEGER, NOT NULL) - Référence vers l'école
- `enrollment_date` (DATETIME) - Date d'inscription
- `status` (TEXT) - Statut de l'inscription ('active', 'inactive')
- `role` (TEXT) - Rôle dans la classe ('student', 'representative')
- `created_at` (DATETIME) - Date de création
- `updated_at` (DATETIME) - Date de mise à jour

#### `class_representatives`
- `id` (INTEGER, PRIMARY KEY)
- `class_id` (INTEGER, NOT NULL) - Référence vers la classe
- `member_id` (INTEGER, NOT NULL) - Référence vers le membre représentant
- `role` (VARCHAR(50)) - Rôle du représentant ('representative')
- `status` (VARCHAR(20)) - Statut ('active', 'inactive')
- `start_date` (DATETIME) - Date de début du mandat
- `end_date` (DATETIME) - Date de fin du mandat (NULL si actif)
- `created_at` (DATETIME) - Date de création
- `updated_at` (DATETIME) - Date de mise à jour

### API Endpoints

#### Classes
- `GET /api/classes` - Liste toutes les classes avec statistiques
- `POST /api/classes` - Créer une nouvelle classe
- `GET /api/classes/:id` - Récupérer une classe spécifique
- `PUT /api/classes/:id` - Modifier une classe
- `DELETE /api/classes/:id` - Supprimer une classe

#### Représentants de classes
- `GET /api/class-representatives` - Liste des représentants
- `POST /api/class-representatives` - Assigner un représentant
- `PUT /api/class-representatives/:id` - Modifier un représentant
- `DELETE /api/class-representatives/:id` - Désassigner un représentant

### Page de gestion
- **URL**: `/classes`
- **Fonctionnalités**:
  - Liste des classes avec statistiques (nombre d'étudiants, représentant)
  - Création/modification de classes
  - Gestion des représentants
  - Recherche et filtrage
  - Suppression avec confirmation

### Statistiques affichées
- Nombre d'étudiants par classe
- Nom du représentant actuel
- Statut du représentant (actif/inactif)
- École d'appartenance

## 🎥 Gestion des Vidéos

### Vue d'ensemble
Système de gestion des vidéos avec support multilingue et associations avec programmes et speakers.

### Tables principales
- `videos` - Vidéos principales
- `video_translations` - Traductions multilingues
- `video_programs` - Association vidéos-programmes
- `video_speakers` - Association vidéos-speakers
- `video_tag_relations` - Tags des vidéos

### Fonctionnalités
- Upload de thumbnails vers R2
- Gestion multilingue (français par défaut)
- Associations avec programmes et speakers
- Système de tags

## 👥 Gestion des Membres

### Vue d'ensemble
Système complet de gestion des membres (étudiants) avec support multi-écoles et champs personnalisés.

### Tables principales
- `membres` - Informations de base des membres
- `membres_schools` - Association membres-écoles
- `membres_school_fields` - Champs personnalisés par école
- `membres_programs` - Association membres-programmes
- `membres_classes` - Association membres-classes

### Fonctionnalités
- Gestion multi-écoles
- Champs personnalisés par école
- Association avec programmes et classes
- Gestion des rôles et statuts

## 🎓 Gestion des Programmes

### Vue d'ensemble
Système de gestion des programmes de formation par école.

### Tables principales
- `programs` - Programmes de formation
- `schools` - Écoles

### Fonctionnalités
- Création/modification de programmes
- Association avec les écoles
- Gestion des descriptions et codes

## 🎤 Gestion des Speakers (Formateurs)

### Vue d'ensemble
Système de gestion des formateurs avec upload de photos vers R2.

### Tables principales
- `speakers` - Informations des formateurs
- `video_speakers` - Association vidéos-speakers

### Fonctionnalités
- Upload de photos vers R2
- Association avec les vidéos
- Gestion par école

## 🏫 Gestion des Écoles

### Vue d'ensemble
Système de gestion des écoles avec champs personnalisés.

### Tables principales
- `schools` - Écoles
- `school_field_definitions` - Définitions de champs par école

### Fonctionnalités
- Création/modification d'écoles
- Champs personnalisés configurables
- Gestion des définitions de champs

## 🔧 Configuration Technique

### R2 Storage
- **Bucket**: `mba`
- **URL statique**: `https://static.mediabuying.ac`
- **Structure**: WordPress-like (year/month/day)
- **Types de fichiers**: Images (photos speakers, thumbnails vidéos), CSS

### D1 Database
- **Nom**: `admin-mba-db`
- **Type**: SQLite
- **Relations**: Many-to-many pour la plupart des associations

### Déploiement
- **Worker**: `admin-mba`
- **Domaine**: `is.mediabuying.ac`
- **Routes**: Toutes les pages et APIs

## 📝 Notes de développement

### CSS
- Fichier local: `/styles/admin.css`
- **Important**: Re-uploader vers R2 après chaque modification
- URL R2: `https://static.mediabuying.ac/styles/admin.css`

### Authentification
- JWT tokens
- Sessions persistantes
- Redirection automatique vers login

### API Design
- RESTful endpoints
- JSON responses
- Error handling standardisé
- Authentication required pour toutes les routes

### Frontend
- Bootstrap 5
- Bootstrap Icons
- JavaScript vanilla
- Responsive design
- Modals pour les formulaires
- Confirmations pour les suppressions
