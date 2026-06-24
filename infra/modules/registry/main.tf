variable "prefix" { type = string }
variable "suffix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "identity_principal_id" { type = string }

resource "azurerm_container_registry" "acr" {
  name                = "${replace(var.prefix, "-", "")}acr${var.suffix}"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false
}

# L'identité managée des Container Apps peut tirer les images
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = var.identity_principal_id
}

output "login_server" { value = azurerm_container_registry.acr.login_server }
output "acr_name" { value = azurerm_container_registry.acr.name }
output "acr_id" { value = azurerm_container_registry.acr.id }
