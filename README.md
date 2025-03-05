# 📌 Projet de Recherche Collaboratif

## 📖 Description
Cette plateforme web permet de centraliser et gérer des projets de recherche collaboratifs. Elle est destinée aux chercheurs, institutions et partenaires industriels pour soumettre, consulter et suivre l’évolution des projets, tout en facilitant la collaboration en temps réel à l'aide d'un chat et de notifications.

## 🚀 Fonctionnalités principales
- **Gestion des utilisateurs** : Inscription et authentification des chercheurs, administrateurs et partenaires industriels.
- **Gestion des projets** : Création, suivi des statuts (soumis, en cours, terminé), et ajout des membres de l’équipe.
- **Suivi des étapes** : Timeline des livrables, jalons et états du projet.
- **Collaboration en ligne** : Chat, partage de fichiers et suivi des versions de documents.
- **Notifications** : Alertes pour échéances, nouvelles tâches et messages.
- **Tableau de bord administrateur** : Statistiques et gestion des utilisateurs.
- **Application mobile** : Consultation des projets sur smartphone après authentification.

## 🛠️ Technologies utilisées
| Composant | Technologie |
|-----------|------------|
| Frontend | React |
| Backend  | Nest.js |
| Mobile   | React Native |
| Base de données | PostgreSQL |
| Hébergement | AWS |

## 🏗️ Architecture du projet
*(Ajouter un schéma de l’architecture globale, MCD de la base de données, et les interactions principales entre les composants)*
**Architecture Globale de l'application**
![Schéma de l’architecture](assets/images/architecture.png)
**Modèle conceptuel de données**
![Schéma de l’architecture](docs/img/architecture.png)



## 📦 Installation & Déploiement

### 🔧 Pré-requis
- **Node.js** (pour le frontend et mobile)
- **PHP & Symfony** (pour le backend)
- **PostgreSQL** (base de données)

### 📥 Installation locale
```bash
# Cloner le dépôt
git clone <URL_DU_REPO>
cd projet_recherche

# Backend
cd backend
composer install
symfony serve

# Frontend
cd frontend
npm install
npm start

# Mobile
cd mobile
npm install
npm run android # ou npm run ios
```

### ☁️ Déploiement sur serveur
*(Expliquer la procédure de déploiement sur AWS et l’accès à l’application)*

## 📊 Suivi du projet
- **Méthodologie** : Agile (sprints, backlog, revues)
- **Outils** : Jira/Trello, GitHub, Docker, CI/CD

## 📅 Calendrier du projet
| Date | Événement |
|------|----------|
| 14/10/24 | Lancement du projet |
| 21/11/24 | Réunion client |
| 30/01/25 | Réunion technique |
| 07/03/25 | Recettage |

## 📄 Documentation
*(Inclure des liens vers des guides d'utilisation, API, et manuels techniques)*

## 👥 Équipe projet
- **Product Owner** : [Nom]
- **Développeurs** : [Nom 1], [Nom 2], [Nom 3]
- **Designer UX/UI** : [Nom]

## 📝 Licence
*(Ajouter la licence du projet, par exemple MIT, GPL, etc.)*
