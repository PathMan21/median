# Guide de déploiement — median

Tout le déploiement est automatisé via **GitHub Actions** + **Terraform**.
Un `git push` (merge) sur `master` suffit à déployer. Ce document décrit le setup complet.

## 1. Prérequis (une seule fois)

### Souscription Azure
- Une souscription avec des droits **Owner** (ou Contributor + User Access Administrator),
  car Terraform crée des attributions de rôles.
- Région utilisée : **France Central**.

### Bootstrap du remote state Terraform
Le state est stocké dans un Storage Account Azure (créé manuellement une seule fois) :

```bash
az group create -n tfstate-rg -l francecentral
az storage account create -n <nom_unique_state> -g tfstate-rg -l francecentral --sku Standard_LRS
az storage container create -n tfstate --account-name <nom_unique_state> --auth-mode login
```

### Service principal OIDC (pour GitHub Actions)
Authentification **sans mot de passe** (OIDC + federated credential) :

```bash
APP_ID=$(az ad app create --display-name "github-median-cicd" --query appId -o tsv)
az ad sp create --id $APP_ID
SUB=<subscription_id>
az role assignment create --assignee $APP_ID --role "Contributor" --scope /subscriptions/$SUB
az role assignment create --assignee $APP_ID --role "User Access Administrator" --scope /subscriptions/$SUB
```

Puis créer la federated credential liée au dépôt (branche `master`) :

```bash
az ad app federated-credential create --id $APP_ID --parameters '{
  "name": "github-master",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:<owner>/<repo>:ref:refs/heads/master",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

## 2. Secrets GitHub Actions

À configurer dans **Settings → Secrets and variables → Actions** :

| Secret | Description |
|---|---|
| `AZURE_CLIENT_ID` | appId du service principal |
| `AZURE_TENANT_ID` | ID du tenant Azure AD |
| `AZURE_SUBSCRIPTION_ID` | ID de la souscription |
| `TFSTATE_RG` | `tfstate-rg` |
| `TFSTATE_SA` | nom du Storage Account de state |
| `TFSTATE_CONTAINER` | `tfstate` |
| `POSTGRES_ADMIN_PASSWORD` | mot de passe admin PostgreSQL (8+ car., maj/min/chiffre/spécial) |
| `JWT_SECRET` | secret de signature JWT (`openssl rand -hex 32`) |

## 3. Déploiement automatique (CI/CD)

Le workflow [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml) s'exécute en 4 étapes :

1. **test** — `npm ci` (cache), `prisma generate`, lint backend + frontend, tests, build frontend
2. **infra** — `terraform plan` + `apply` (crée/met à jour toute l'infra Azure)
3. **build-push** — build des images Docker (cache GHA) + push vers l'ACR
4. **deploy** — `az containerapp update` sur les nouvelles images, puis **affiche les URLs publiques**

Sur une **Pull Request**, seul le job `test` tourne (pas de déploiement).
Sur **push/merge `master`**, le pipeline complet s'exécute.

> Les URLs publiques (frontend, backend, Swagger) sont affichées dans le **résumé du run** GitHub Actions.

## 4. Déploiement manuel (optionnel)

```bash
cd infra
export TF_VAR_postgres_admin_password="..." TF_VAR_jwt_secret="$(openssl rand -hex 32)"
terraform init \
  -backend-config="resource_group_name=tfstate-rg" \
  -backend-config="storage_account_name=<nom_unique_state>" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=median.tfstate"
terraform apply
terraform output frontend_url backend_url
```

## 5. Initialiser les données (une fois, après le 1er déploiement)

```bash
az containerapp exec -n median-backend -g median-rg --command "/bin/sh"
# puis dans le conteneur :
npx ts-node --transpile-only --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

Le seed crée des films, cinémas et des comptes de démo (voir [EXPLOITATION.md](EXPLOITATION.md)).

## Workflow Git
- Branche `master` **protégée** : Pull Request obligatoire, 1 review, check `test` vert.
- Le merge d'une PR sur `master` déclenche le déploiement.
