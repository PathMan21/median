# Choix techniques — median

Justification des décisions d'architecture. Document de référence pour la soutenance.

## Compute : Azure Container Apps (serverless)

**Choix : Azure Container Apps (ACA)** plutôt qu'une VM ou Azure Kubernetes Service (AKS).

- **Serverless** : aucune VM à provisionner, patcher ou administrer.
- **Auto-scaling** intégré (`min_replicas`/`max_replicas`) — équivalent managé du couple Pods + HPA.
- **Facturation à l'usage** (vCPU-secondes / requêtes), pas un serveur allumé en permanence.
- **Ingress HTTPS managé** (Envoy) — pas besoin de gérer un reverse-proxy/certificats.
- AKS aurait apporté de la complexité opérationnelle inutile pour 2 services ;
  une VM nous aurait remis dans un rôle d'administrateur système (patchs, sécurité, scaling manuel).

> Le dossier `k8s/` contient une ancienne piste Kubernetes (Traefik) **non déployée**, conservée en annexe.

## Authentification : JWT local

**Choix : JWT local (NestJS + Passport)** plutôt qu'un IAM type Keycloak.

- Suffisant pour le périmètre du projet (login/register, rôles simples).
- Pas de service supplémentaire à héberger/maintenir (Keycloak = un conteneur + une base en plus).
- Le secret de signature (`JWT_SECRET`) est stocké dans **Key Vault**.

> Keycloak était une option proposée ; il aurait été pertinent pour du SSO/multi-applications,
> ce qui n'est pas le besoin ici.

## Stockage objet : Azure Blob Storage

**Choix : Azure Blob Storage** plutôt que S3 (AWS) ou MinIO.

- Même catégorie que S3 (stockage objet), mais natif Azure → un seul cloud, une seule facture, une seule identité.
- Utilisé pour les **affiches de films** (`POST /films/:id/poster`).
- En local : **Azurite** (émulateur Blob d'Azure), pour rester iso-prod.

## Secrets : Key Vault + Managed Identity

**Choix : Azure Key Vault** + **Managed Identity** (User-Assigned).

- **Aucun secret en dur** dans le code ou les images.
- Les Container Apps lisent les secrets via leur identité managée → **pas de mot de passe** à stocker.
- Secrets gérés : `database-url`, `jwt-secret`, `storage-connection-string`.

## Base de données : PostgreSQL Flexible Server

**Choix : Azure Database for PostgreSQL (Flexible Server)** managé.

- Base relationnelle managée (patchs, backups gérés par Azure).
- La `DATABASE_URL` complète (SSL requis) est stockée dans Key Vault.
- Les migrations Prisma sont appliquées automatiquement au démarrage du conteneur backend.

## IaC : Terraform modulaire

**Choix : Terraform (provider `azurerm`)** avec **remote state** dans Azure Storage.

- Structure **modulaire** : `registry`, `database`, `storage`, `keyvault`, `observability`, `containerapps`.
- Remote state partagé (state lock) → travail en équipe sans corruption.
- Toute l'infra est reproductible (zéro clic sur le portail).

## CI/CD : GitHub Actions + OIDC

**Choix : GitHub Actions** avec authentification **OIDC** (sans clé secrète stockée).

- Pipeline `test → infra → build-push → deploy`.
- **Caches** npm et Docker (builds incrémentaux).
- **Branche protégée** : PR obligatoire, review, tests verts avant merge.
- Verrou de concurrence pour éviter deux déploiements simultanés.

## Frontend : Angular servi par nginx

- Image Docker **multi-stage** : build Angular puis service des fichiers statiques par **nginx**.
- L'URL de l'API est injectée au **runtime** (variable `API_URL`) → la même image marche en local et en prod.

## Bus de messages : NATS (bonus)

- À l'inscription, un événement `user.registered` est publié sur **NATS** (traitement asynchrone / découplage).
- Implémentation **best-effort** : si NATS est absent, l'application continue de fonctionner.
