# Plan d'action — Livrables Session 6 (LearnStudio / projet median)

> Cible de déploiement retenue : **Azure Container Apps (ACA)** + Terraform.
> Périmètre : **note maximale (100 pts)**.
> Les manifests `k8s/` sont conservés en annexe mais ne sont PLUS la cible de prod notée.

## Barème visé

| Critère | Pts | État actuel | Action |
|---|---|---|---|
| Infrastructure Terraform | /25 | ❌ Inexistant (`infra/` manquant) | Créer tout `infra/` (§1) |
| Pipeline CI/CD | /20 | ⚠️ Cassé (branche, pas de tests, infra absente) | Réparer `deploy.yml` (§2) |
| Application fonctionnelle | /25 | ⚠️ Pas de Blob upload, pas d'URL publique | Module upload Blob (§3) |
| Sécurité (Key Vault) | /15 | ❌ Secrets en clair, pas de Managed Identity | Key Vault + MI (§4) |
| Observabilité | /10 | ❌ Aucun log/alerte | Log Analytics + alerte (§5) |
| Soutenance orale | /5 | — | README + démo (§7) |
| Cloud-Native (étape 5, bonus) | — | ❌ Pas de broker | Bus de messages (§6) |

---

## §1 — Terraform `infra/` (le bloc prioritaire, /25)

Créer le dossier `infra/` avec une structure **modulaire** (valorisée par la grille).

```
infra/
├── provider.tf          # provider azurerm + backend azurerm (remote state)
├── variables.tf         # variables d'entrée (location, prefix, db creds via var sensitive)
├── outputs.tf           # URLs publiques ACA, nom ACR, endpoint Key Vault
├── main.tf              # RG + appel des modules
├── terraform.tfvars     # valeurs NON sensibles (location...) — PAS de secrets
└── modules/
    ├── network/         # (optionnel ACA) — sinon ignorer, ACA gère le réseau
    ├── registry/        # Azure Container Registry (ACR) + role assignment AcrPull
    ├── database/        # PostgreSQL Flexible Server + base + firewall
    ├── keyvault/        # Key Vault + secrets + access policy / RBAC
    ├── observability/   # Log Analytics Workspace + Application Insights + alerte
    └── containerapps/   # ACA Environment + Container App backend + frontend
```

### Détail des fichiers

**`provider.tf`**
- `terraform { required_providers { azurerm } ; backend "azurerm" {...} }` → **remote state** dans un Storage Account (critère noté). Le Storage Account du backend state se crée une fois à la main OU via un bootstrap séparé.
- `provider "azurerm" { features {} }`

**`variables.tf`**
- `location` (def: `francecentral`), `prefix` (def: `learnstudio`), `postgres_admin_login`, `postgres_admin_password` (`sensitive = true`), `tenant_id`.

**`main.tf`**
- `azurerm_resource_group` puis appels des modules en chaînant les outputs (ACR → ACA, Key Vault → ACA via secret refs).

**`modules/registry/`**
- `azurerm_container_registry` (SKU Basic, `admin_enabled = false` → on passe par Managed Identity).
- `azurerm_role_assignment` : donner `AcrPull` à l'identité managée des Container Apps.

**`modules/database/`**
- `azurerm_postgresql_flexible_server` (+ version 16, SKU B1ms) et `azurerm_postgresql_flexible_server_database` (`median-db`).
- Firewall rule « Allow Azure services ».
- La `DATABASE_URL` complète est **poussée dans Key Vault**, pas en clair.

**`modules/keyvault/`**
- `azurerm_key_vault` (RBAC ou access policies).
- `azurerm_key_vault_secret` pour : `database-url`, `jwt-secret`, `mail-password`, `storage-connection-string`.

**`modules/observability/`**
- `azurerm_log_analytics_workspace` (relié à l'env ACA).
- `azurerm_application_insights` (workspace-based).
- **`azurerm_monitor_metric_alert`** : ≥ 1 alerte (ex : CPU > 80 % sur la Container App backend, ou nb requêtes 5xx) → satisfait « au moins 1 alerte ».

**`modules/containerapps/`**
- `azurerm_container_app_environment` (lié au Log Analytics).
- `azurerm_container_app` backend :
  - `identity { type = "SystemAssigned" }` → **Managed Identity** (critère /15).
  - `secret` référencés depuis Key Vault via `key_vault_secret_id` + `identity`.
  - `env` : `DATABASE_URL`, `JWT_SECRET`, etc. pointant vers les secrets.
  - `ingress` externe sur port 3000, `target_port`, `external_enabled = true` → **URL publique**.
  - `registry { server = acr ; identity = "SystemAssigned" }`.
- `azurerm_container_app` frontend (port 80, ingress externe).

**`outputs.tf`**
- `backend_url`, `frontend_url` (FQDN ACA), `acr_login_server`, `key_vault_uri`.

> ⚠️ Sans Terraform, le pipeline actuel échoue à l'étape `terraform init` (dossier `infra/` absent). C'est donc le **point de déblocage n°1**.

---

## §2 — Réparer le pipeline CI/CD `.github/workflows/deploy.yml` (/20)

Problèmes actuels et corrections :

1. **Trigger** : `branches: [main]` → la branche est `master`. ⇒ Passer à `master` (ou renommer la branche, ou `[main, master]`).
2. **Pas de tests** : la grille exige `build → test → push → deploy`. Ajouter un job/étape :
   - `npm ci` puis `npm run test` (backend) et `npm run build` (frontend) **avant** le build Docker.
   - Faire échouer le pipeline si les tests échouent.
3. **Terraform** : ajouter `terraform plan` avant `apply`, et fournir les variables sensibles via secrets GitHub (`TF_VAR_postgres_admin_password`, etc.).
4. **Managed Identity / OIDC** : déjà en `azure/login` OIDC (bien) — vérifier que le service principal a les droits `Contributor` + `User Access Administrator` (pour les role assignments Terraform).
5. **Ordre logique** : `test → terraform apply → build/push images → containerapp update`. Actuellement build/push se fait avant Terraform alors que l'ACR doit exister d'abord → réordonner.
6. **Secrets GitHub** à déclarer : `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `ACR_NAME`, `RESOURCE_GROUP`, `BACKEND_APP_NAME`, `FRONTEND_APP_NAME`, + `TF_VAR_*`.

Structure cible des jobs :
```
jobs:
  test:        # npm ci + test backend + build frontend
  infra:       # needs: test — terraform init/plan/apply
  build-push:  # needs: infra — docker build + push ACR (via az acr login OIDC)
  deploy:      # needs: build-push — az containerapp update (backend + frontend)
```

---

## §3 — Application : upload de fichiers vers Blob (/25)

La grille note « Blob upload accessibles en prod ». Aucune référence S3/Blob aujourd'hui.

**Point d'accroche idéal** : `Film.posterUrl` (upload d'affiche de film) — le modèle existe déjà dans `schema.prisma`.

À créer côté backend (`backend/src/`) :
- `storage/storage.module.ts` + `storage.service.ts` utilisant `@azure/storage-blob` (SDK Azure) OU API S3-compatible (`@aws-sdk/client-s3` pointant LocalStack en dev / Blob en prod).
- Endpoint `POST /films/:id/poster` (multipart, `@nestjs/platform-express` + Multer) → upload vers le container Blob, récupère l'URL, met à jour `posterUrl`.
- Variable d'env `STORAGE_CONNECTION_STRING` (depuis Key Vault en prod, LocalStack en dev).
- Frontend : champ d'upload dans le formulaire d'admin film.

Dev local : ajouter **LocalStack** (ou Azurite) au `docker-compose` (cf. §6).

---

## §4 — Sécurité : Key Vault + Managed Identity + 0 secret hardcodé (/15)

1. **Key Vault** créé en Terraform (§1) avec les secrets : `database-url`, `jwt-secret`, `mail-password`, `storage-connection-string`.
2. **Managed Identity** : `identity { type = "SystemAssigned" }` sur les Container Apps + accès Key Vault (RBAC `Key Vault Secrets User`) + `AcrPull` sur l'ACR. ⇒ Plus aucun mot de passe ACR ni connection string dans le pipeline.
3. **Nettoyage des secrets en clair** :
   - `backend/docker-compose.yml` : `myuser/mypassword` → OK pour le **dev local uniquement**, mais déplacer dans un `.env` non commité + `.env.example`.
   - `k8s/postgres/secrets.yaml` : `postgres/postgres` en clair → ce dossier sort du périmètre prod ; le documenter comme « legacy / dev k8s » ou le retirer.
   - Vérifier qu'aucun `JWT_SECRET` / `DATABASE_URL` n'est en dur dans `backend/src`.
4. Ajouter/compléter `.gitignore` : `*.tfstate*`, `.terraform/`, `.env`, `terraform.tfvars` si sensible.

---

## §5 — Observabilité (/10)

- **Log Analytics Workspace** créé en Terraform et **rattaché à l'environnement ACA** (logs stdout/stderr des conteneurs → conforme 12-Factor).
- **Application Insights** (workspace-based) pour le backend NestJS (optionnel mais propre).
- **≥ 1 alerte** : `azurerm_monitor_metric_alert` (ex : CPU backend > 80 % pendant 5 min, ou taux de 5xx) avec un `action_group` (email). ⇒ Coche « au moins 1 alerte configurée ».

---

## §6 — Cloud-Native / Étape 5 : bus de messages (bonus, étape attendue)

- Ajouter **NATS** (ou BullMQ + Redis) : à l'inscription d'un utilisateur (`status: pending` → vérification email existante), publier un événement `user.registered`.
- Un listener NestJS consomme l'événement → envoie l'email (le module `mail` existe déjà) et/ou met à jour des stats. Découplage async.
- Dev local : ajouter `nats` au `docker-compose`.

---

## §7 — docker-compose complet + README + démo

**`docker-compose.yml` (racine)** — aujourd'hui il n'y en a qu'un partiel dans `backend/`. Créer un compose racine qui orchestre tout le dev local :
- `postgres`, `backend`, `frontend`, `localstack` (ou `azurite`) pour le Blob, `nats` (si §6).
- Credentials via `.env` (pas en dur).

**`README.md`** — compléter avec les exigences de la grille (slide 14) :
- **Diagramme d'architecture** (Mermaid : Frontend Angular → Backend NestJS → Postgres / Blob / NATS / Key Vault, le tout sur ACA).
- **Guide de déploiement** (terraform init/plan/apply + secrets GitHub + déclenchement pipeline).
- **Membres de l'équipe**.
- Corriger l'incohérence : le README dit « SQLite » alors que `schema.prisma` est en **PostgreSQL**.

**Soutenance** : prévoir la **démo live** (push d'un commit → pipeline → déploiement ACA → URL publique accessible).

---

## Ordre d'exécution recommandé

1. **`infra/` Terraform** (débloque tout le reste) — §1
2. **Réparer `deploy.yml`** (branche + tests + ordre) — §2
3. **Key Vault + Managed Identity** (intégré à §1) — §4
4. **Blob upload** (code backend + frontend) — §3
5. **Observabilité** (alerte) — §5
6. **docker-compose racine + README + diagramme** — §7
7. **Bus de messages** (bonus) — §6

## Checklist « règles incontournables » (slide 14)

- [ ] Aucun secret hardcodé (Key Vault + Managed Identity)
- [ ] Toute l'infra via Terraform (zéro clic portail)
- [ ] ≥ 1 pipeline CI/CD GitHub Actions fonctionnel
- [ ] URL publique Azure accessible
- [ ] README : architecture + guide déploiement + équipe
- [ ] Démo live possible à la soutenance
