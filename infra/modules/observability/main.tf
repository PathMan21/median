variable "prefix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "alert_email" { type = string }

resource "azurerm_log_analytics_workspace" "law" {
  name                = "${var.prefix}-law"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appi" {
  name                = "${var.prefix}-appi"
  location            = var.location
  resource_group_name = var.resource_group_name
  workspace_id        = azurerm_log_analytics_workspace.law.id
  application_type    = "web"
}

resource "azurerm_monitor_action_group" "main" {
  name                = "${var.prefix}-ag"
  resource_group_name = var.resource_group_name
  short_name          = "lsalerts"

  email_receiver {
    name          = "team"
    email_address = var.alert_email
  }
}

output "log_analytics_workspace_id" { value = azurerm_log_analytics_workspace.law.id }
output "action_group_id" { value = azurerm_monitor_action_group.main.id }

output "app_insights_connection_string" {
  value     = azurerm_application_insights.appi.connection_string
  sensitive = true
}
