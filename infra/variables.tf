variable "prefix" {
  description = "Préfixe appliqué à toutes les ressources"
  type        = string
  default     = "learnstudio"
}

variable "location" {
  description = "Région Azure"
  type        = string
  default     = "francecentral"
}

variable "postgres_admin_login" {
  description = "Login administrateur PostgreSQL"
  type        = string
  default     = "lsadmin"
}

variable "postgres_admin_password" {
  description = "Mot de passe admin PostgreSQL (fourni via TF_VAR_postgres_admin_password)"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret JWT du backend (fourni via TF_VAR_jwt_secret)"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Image conteneur backend (tag inclus). Mise à jour par le pipeline après le 1er push."
  type        = string
  default     = "mcr.microsoft.com/k8se/quickstart:latest"
}

variable "frontend_image" {
  description = "Image conteneur frontend (tag inclus). Mise à jour par le pipeline après le 1er push."
  type        = string
  default     = "mcr.microsoft.com/k8se/quickstart:latest"
}

variable "alert_email" {
  description = "Email destinataire des alertes d'observabilité"
  type        = string
  default     = "enzo.chamanier.pro@gmail.com"
}
