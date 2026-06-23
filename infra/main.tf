resource "azurerm_resource_group" "main" {
  name     = "${var.prefix}-rg"
  location = var.location
}

# Suffixe aléatoire pour les ressources à nom globalement unique (ACR, KV, Storage, PG)
resource "random_string" "suffix" {
  length  = 5
  upper   = false
  special = false
}

# Identité managée partagée par les Container Apps (pull ACR + lecture Key Vault)
resource "azurerm_user_assigned_identity" "apps" {
  name                = "${var.prefix}-apps-identity"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
}

module "observability" {
  source              = "./modules/observability"
  prefix              = var.prefix
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  alert_email         = var.alert_email
}

module "registry" {
  source                = "./modules/registry"
  prefix                = var.prefix
  suffix                = random_string.suffix.result
  location              = azurerm_resource_group.main.location
  resource_group_name   = azurerm_resource_group.main.name
  identity_principal_id = azurerm_user_assigned_identity.apps.principal_id
}

module "database" {
  source              = "./modules/database"
  prefix              = var.prefix
  suffix              = random_string.suffix.result
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  admin_login         = var.postgres_admin_login
  admin_password      = var.postgres_admin_password
}

module "storage" {
  source              = "./modules/storage"
  prefix              = var.prefix
  suffix              = random_string.suffix.result
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

module "keyvault" {
  source              = "./modules/keyvault"
  prefix              = var.prefix
  suffix              = random_string.suffix.result
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  admin_object_id     = data.azurerm_client_config.current.object_id
  reader_principal_id = azurerm_user_assigned_identity.apps.principal_id

  secrets = {
    database-url              = module.database.connection_string
    jwt-secret               = var.jwt_secret
    storage-connection-string = module.storage.connection_string
  }
}

module "containerapps" {
  source              = "./modules/containerapps"
  prefix              = var.prefix
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  log_analytics_id    = module.observability.log_analytics_workspace_id
  identity_id         = azurerm_user_assigned_identity.apps.id
  acr_login_server    = module.registry.login_server
  backend_image       = var.backend_image
  frontend_image      = var.frontend_image

  backend_secret_refs = {
    database-url              = module.keyvault.secret_ids["database-url"]
    jwt-secret                = module.keyvault.secret_ids["jwt-secret"]
    storage-connection-string = module.keyvault.secret_ids["storage-connection-string"]
  }

  # L'identité doit avoir accès au Key Vault et à l'ACR avant la création des apps
  depends_on = [module.keyvault, module.registry]
}

# Alerte d'observabilité : CPU backend élevé (>= 1 alerte exigée par la grille)
resource "azurerm_monitor_metric_alert" "backend_cpu" {
  name                = "${var.prefix}-backend-cpu-high"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [module.containerapps.backend_app_id]
  description         = "Usage CPU élevé sur le backend (> 0.8 vCPU)"
  severity            = 2
  frequency           = "PT1M"
  window_size         = "PT5M"

  criteria {
    metric_namespace = "Microsoft.App/containerApps"
    metric_name      = "UsageNanoCores"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 800000000
  }

  action {
    action_group_id = module.observability.action_group_id
  }
}
