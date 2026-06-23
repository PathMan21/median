variable "prefix" { type = string }
variable "suffix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "tenant_id" { type = string }
variable "admin_object_id" { type = string }
variable "reader_principal_id" { type = string }
variable "secrets" {
  type      = map(string)
  sensitive = true
}

resource "azurerm_key_vault" "kv" {
  name                       = "${var.prefix}-kv-${var.suffix}"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  tenant_id                  = var.tenant_id
  sku_name                   = "standard"
  purge_protection_enabled   = false
  soft_delete_retention_days = 7
}

# L'opérateur Terraform (CI ou dev) peut écrire/lire les secrets.
# Access policies => application immédiate (pas de délai de propagation RBAC).
resource "azurerm_key_vault_access_policy" "admin" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = var.tenant_id
  object_id    = var.admin_object_id

  secret_permissions = ["Get", "List", "Set", "Delete", "Purge", "Recover"]
}

# L'identité managée des Container Apps peut lire les secrets
resource "azurerm_key_vault_access_policy" "reader" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = var.tenant_id
  object_id    = var.reader_principal_id

  secret_permissions = ["Get", "List"]
}

resource "azurerm_key_vault_secret" "this" {
  for_each     = var.secrets
  name         = each.key
  value        = each.value
  key_vault_id = azurerm_key_vault.kv.id

  depends_on = [azurerm_key_vault_access_policy.admin]
}

output "key_vault_id" { value = azurerm_key_vault.kv.id }
output "key_vault_uri" { value = azurerm_key_vault.kv.vault_uri }

output "secret_ids" {
  value = { for k, s in azurerm_key_vault_secret.this : k => s.versionless_id }
}
