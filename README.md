# Projet de Recherche Collaboratif

## Description
Cette plateforme web permet de centraliser et gérer des projets de recherche collaboratifs. Elle est destinée aux chercheurs, institutions et partenaires industriels pour soumettre, consulter et suivre l’évolution des projets, tout en facilitant la collaboration en temps réel à l'aide d'un chat et de notifications.

## Fonctionnalités principales
- **Gestion des utilisateurs** : Inscription et authentification des chercheurs, administrateurs et partenaires industriels.
- **Gestion des projets** : Création, suivi des statuts (soumis, en cours, terminé), et ajout des membres de l’équipe.
- **Suivi des étapes** : Timeline des livrables, jalons et états du projet.
- **Collaboration en ligne** : Chat, partage de fichiers et suivi des versions de documents.
- **Notifications** : Alertes pour échéances, nouvelles tâches et messages.
- **Tableau de bord administrateur** : Statistiques et gestion des utilisateurs.
- **Application mobile** : Consultation des projets sur smartphone après authentification.

## Technologies utilisées
| Composant | Technologie |
|-----------|------------|
| Frontend | React |
| Backend  | Nest.js |
| Mobile   | React Native |
| Base de données | PostgreSQL |
| Hébergement | AWS |

## Architecture du projet

**Architecture globale de l'application**  
![Schéma de l’architecture](/resources/architecture_TaskFlow.png)

**Modèle conceptuel de données**  
![Schéma du MCD](/resources/taskflow_mcd.png)  
![Télécharger le fichier SQL](/resources/bdd_taskflow.sql)

## Installation & Déploiement

### Pré-requis
- **Node.js** (pour le frontend et mobile)
- **Nest.js** (pour le backend)
- **PostgreSQL** (base de données)

### Installation locale
```bash
# Cloner le dépôt
git clone <https://github.com/tanleg/TaskFlow.git>
cd TaskFlow

# Backend
cd backend
npm install
npm run start

# Frontend
cd frontend
npm install
npm run dev

# Mobile
cd mobile
npm install
npx expo start --clear
```

### Déploiement sur serveur

#### Démarrage
1. Lancer l'instance AWS EC2
2. Ajouter des règles sur l'instance Amazon EC2 autorisant autorisant le trafic HTTP, TCP (port 3000 et 3001), ssh et PostgreSQL pour les machines qui utiliseront l'application.

#### Lancement du Frontend
1. Modifier localement le fichier frontend/.env. Remplacer la variable d'environnement VITE_API_URL par l'adresse ip de l'instance EC2.
2. Sur la machine locale :
```bash
cd frontend
npm run build
```
3. Sur le serveur remplacer le contenu de /var/www/taskflow par le contenu du dossier frontend/dist obtenu à l'étape précédente

#### Lancement du Backend
1. Sur le serveur :
```bash
cd /var/www/backend
sudo nano .env 
```
Remplacer la variable d'environnement URL_SITE par l'adresse ip de l'instance EC2.

2. Sur le serveur:
```bash
cd /var/www/backend/dist/backend/src
sudo nano main.js
```
Ligne 11 : ajouter les adresses ip de l'instance EC2 et des machines locales.

#### Recharger l'application
1. Sur le serveur :
```bash
sudo systemctl restart apache2
pm2 restart backend
```

## Calendrier du projet
| Date | Événement |
|------|----------|
| 14/10/24 | Lancement du projet |
| 21/11/24 | Réunion client |
| 24/02/25 | Réunion technique |
| 07/03/25 | Recettage |

## Guide d'utilisation
### 1. Accéder à l'application  
#### Version Web  
1. Ouvrir un navigateur web.  
2. Aller à l'adresse suivante :  
   ```markdown
   https://adresse_ip_de_l'instance_EC2.com
3. Se connecter avec un compte existant ou créer un nouveau compte.  

#### Version Mobile  
**La version mobile est toujours en cours de développement**
1. Télécharger Expo Go depuis un mobile
2. Modifier mobile/.env. Remplacer la variable d'environnement par l'adresse ip du PC.
3. Depuis un terminal :
```bash
npx expo start --clear
```
4. Scanner le QRcode avec Expo Go

### 2. Création d'un projet  
1. Créer un projet depuis le **Dashboard**.  
2. Remplir les informations requises :  
3. Valider pour enregistrer le projet.  

### 3. Suivi des projets  
- Suivez tous vos projets en cours depuis le **Dashboard** et accédez au projet public.  
- Consultez aussi vos événements à venir depuis le **Dashboard**.
- Cliquer sur un projet pour voir ses détails, en modifier les membres et suivre son avancement via la **timeline**.  

### 4. Collaboration et communication  
- Utiliser le **chat intégré** pour échanger avec les membres de l’équipe.  
- Partager des fichiers en les déposant dans l’**espace de stockage** du projet.  
- Consultez la liste des utilisateurs en tant qu'administrateur en cliquant sur "Utilisateurs" depuis la **barre de navigation**.

### 5. Invitez des partenaires industriels
1. Depuis une  **page projet**, appuez sur "ajouter un utilisateur".
2. Cliquer sur **"invitation"**.
3. Remplir les informations nécessaires puis copier le **lien** obtenu.
4. Envoyer le lien à votre **partenaire**.

## Équipe projet
- **Le Goff Tanguy** : Product Owner et développeur Backend
- **Toullec Alexis** : Développeur Backend
- **Sacroud Riad** : Développeur Frontend