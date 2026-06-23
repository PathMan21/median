# Median - Plateforme de Gestion de Cinéma 🎬

Median est une application web moderne de gestion de réservations de cinéma, permettant aux utilisateurs de découvrir des films, de consulter les salles disponibles et de gérer leurs réservations. Les administrateurs disposent d'outils complets pour gérer le catalogue de films et le réseau de cinémas.

## 🚀 Technologies

L'application repose sur une architecture moderne "Full-stack TypeScript" :

### Frontend
- **Framework** : [Angular 19](https://angular.dev/) (Standalone Components)
- **Style** : [Tailwind CSS 4](https://tailwindcss.com/)
- **Icones** : [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular)
- **Syntaxe** : Angular 17+ Control Flow (`@if`, `@for`)

### Backend
- **Framework** : [NestJS 11](https://nestjs.com/)
- **ORM** : [Prisma 6](https://www.prisma.io/)
- **Base de données** : SQLite (par défaut pour le développement)
- **Documentation** : [Swagger UI](https://swagger.io/)

---

## 🛠️ Installation

### Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### 1. Configuration du Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate  
npm run prisma:seed    
```

### 2. Configuration du Frontend
```bash
cd frontend
npm install
```

---

## 🏃 Lancement

### Lancer le Backend (Mode Développement)
```bash
cd backend
npm run start:dev
```
Le serveur API sera accessible sur `http://localhost:3000`.
La documentation Swagger est disponible sur `http://localhost:3000/api`.

### Lancer le Frontend (Mode Développement)
```bash
cd frontend
npm run start
```
L'application sera accessible sur `http://localhost:4200`.

---

## 📂 Architecture des Dossiers

### Frontend (`frontend/src/app`)
- `core/` : Services globaux, intercepteurs, gardes et modèles de données.
- `shared/` : Composants réutilisables (Alert, Modal, Badge) et styles globaux.
- `features/` : Modules fonctionnels (Auth, Films, Cinemas, Bookings, Dashboard).

### Backend (`backend/src`)
- `films/`, `cinemas/`, `bookings/`, `auth/` : Modules NestJS structurés par domaine.
- `prisma/` : Schéma de base de données et scripts de seed.

---

## 🌟 Fonctionnalités Clés

- **Système d'Authentification** : Inscription et connexion sécurisées.
- **Gestion du Catalogue** : CRUD complet des films et cinémas (Admin).
- **Réservations en temps réel** : Réservation de places avec calcul dynamique du prix.
- **Interface Premium** : Design "Glassmorphism", animations fluides et support complet des caractères accentués.
- **Modernisation Angular** : Utilisation intensive des `signals` et de la nouvelle syntaxe de contrôle de flux.

---

## 📝 Notes de Développement
- **Migrations** : Toutes les templates ont été migrées vers la nouvelle syntaxe `@if` et `@for` pour des performances optimales.
- **Données** : Le script de seed (`backend/prisma/seed.ts`) a été corrigé pour assurer un encodage parfait des caractères spéciaux français.



<!-- CONSTRUIRE ET POUSSER LES IMAGES -->


d'abord 

`docker login`

on se connecte et une fois connecté on va se build backend et frontend
-> On va remplacer TONUSERNAME => par le username de docker hub

`cd C:\...\median\backend`
`docker build -t median-backend:latest .`
`docker tag median-backend:latest TONUSERNAME/median-backend:latest`
`docker push TONUSERNAME/median-backend:latest`

-> meme chose pour frontend

`cd C:\...\median\frontend`
`docker build -t median-front:latest .`
`docker tag median-front:latest TONUSERNAME/median-front:latest`
`docker push TONUSERNAME/median-front:latest`


Tout ça est fait pour récupérer ensuite sur azure

`https://portal.azure.com/#cloudshell/`

une fois connecté


on peux tirer sur la console azure

=> Ne pas oublier de remplacer "TONUSERNAME" par votre username dockerhub


RG="rg-median-prod"
CAE="cae-median-prod"
DOCKER_USER="TONUSERNAME"

# Backend
az containerapp create \
  -n ca-backend \
  -g $RG \
  --environment $CAE \
  --image $DOCKER_USER/median-backend:latest \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    NODE_ENV=production \
    PORT=3000 \
    JWT_SECRET=supersecretjwt2026

echo "=== Backend URL ==="
az containerapp show -n ca-backend -g $RG \
  --query "properties.configuration.ingress.fqdn" -o tsv



<!-- frontend -->

az containerapp create \
  -n ca-frontend \
  -g rg-median-prod \
  --environment cae-median-prod \
  --image TONUSERNAME/median-frontend:latest \
  --target-port 80 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 2 \
  --env-vars \
    API_URL=https://ca-backend.yellowcliff-85f30ec0.francecentral.azurecontainerapps.io

echo "=== Frontend URL ==="
az containerapp show -n ca-frontend -g rg-median-prod \
  --query "properties.configuration.ingress.fqdn" -o tsv
