variable "prefix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "log_analytics_id" { type = string }
variable "identity_id" { type = string }
variable "acr_login_server" { type = string }
variable "backend_image" { type = string }
variable "frontend_image" { type = string }
variable "backend_secret_refs" { type = map(string) }

resource "azurerm_container_app_environment" "env" {
  name                       = "${var.prefix}-aca-env"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  log_analytics_workspace_id = var.log_analytics_id
}

resource "azurerm_container_app" "backend" {
  name                         = "${var.prefix}-backend"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity_id]
  }

  registry {
    server   = var.acr_login_server
    identity = var.identity_id
  }

  # L'image est mise à jour hors-bande par le pipeline (az containerapp update)
  lifecycle {
    ignore_changes = [template[0].container[0].image]
  }

  # Secrets injectés depuis Key Vault via l'identité managée
  dynamic "secret" {
    for_each = var.backend_secret_refs
    content {
      name                = secret.key
      key_vault_secret_id = secret.value
      identity            = var.identity_id
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    transport        = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "backend"
      image  = var.backend_image
      cpu    = 0.5
      memory = "1Gi"

      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }
      env {
        name        = "JWT_SECRET"
        secret_name = "jwt-secret"
      }
      env {
        name        = "STORAGE_CONNECTION_STRING"
        secret_name = "storage-connection-string"
      }
      env {
        name  = "PORT"
        value = "3000"
      }
    }
  }
}

resource "azurerm_container_app" "frontend" {
  name                         = "${var.prefix}-frontend"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity_id]
  }

  registry {
    server   = var.acr_login_server
    identity = var.identity_id
  }

  ingress {
    external_enabled = true
    target_port      = 80
    transport        = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  # L'image est mise à jour hors-bande par le pipeline (az containerapp update)
  lifecycle {
    ignore_changes = [template[0].container[0].image]
  }

  template {
    min_replicas = 1
    max_replicas = 2

    container {
      name   = "frontend"
      image  = var.frontend_image
      cpu    = 0.25
      memory = "0.5Gi"

      # L'entrypoint Docker remplace http://localhost:3000 par cette URL au démarrage
      env {
        name  = "API_URL"
        value = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
      }
    }
  }
}

output "backend_app_id" { value = azurerm_container_app.backend.id }
output "backend_app_name" { value = azurerm_container_app.backend.name }
output "frontend_app_name" { value = azurerm_container_app.frontend.name }
output "backend_fqdn" { value = azurerm_container_app.backend.ingress[0].fqdn }
output "frontend_fqdn" { value = azurerm_container_app.frontend.ingress[0].fqdn }
