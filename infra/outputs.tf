output "backend_url" {
  description = "URL publique du backend (ACA)"
  value       = "https://${module.containerapps.backend_fqdn}"
}

output "frontend_url" {
  description = "URL publique du frontend (ACA)"
  value       = "https://${module.containerapps.frontend_fqdn}"
}

output "acr_login_server" {
  description = "Serveur de login de l'Azure Container Registry"
  value       = module.registry.login_server
}

output "acr_name" {
  description = "Nom de l'ACR (pour az acr login dans le pipeline)"
  value       = module.registry.acr_name
}

output "key_vault_uri" {
  description = "URI du Key Vault"
  value       = module.keyvault.key_vault_uri
}

output "resource_group" {
  description = "Nom du resource group"
  value       = azurerm_resource_group.main.name
}

output "backend_app_name" {
  description = "Nom de la Container App backend (pour az containerapp update)"
  value       = module.containerapps.backend_app_name
}

output "frontend_app_name" {
  description = "Nom de la Container App frontend (pour az containerapp update)"
  value       = module.containerapps.frontend_app_name
}
