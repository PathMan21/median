variable "prefix" { type = string }
variable "suffix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }

resource "azurerm_storage_account" "sa" {
  name                            = "${replace(var.prefix, "-", "")}st${var.suffix}"
  resource_group_name             = var.resource_group_name
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = true
}

# Container Blob pour les médias (affiches de films, documents...)
resource "azurerm_storage_container" "media" {
  name                  = "media"
  storage_account_name  = azurerm_storage_account.sa.name
  container_access_type = "blob"
}

output "account_name" { value = azurerm_storage_account.sa.name }
output "container_name" { value = azurerm_storage_container.media.name }

output "connection_string" {
  value     = azurerm_storage_account.sa.primary_connection_string
  sensitive = true
}
