terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # Remote state stocké dans un Storage Account Azure (critère noté).
  # Le Storage Account + le container "tfstate" doivent exister AVANT le premier
  # `terraform init` (étape bootstrap, cf. README). Les valeurs sont fournies via
  # `-backend-config` dans le pipeline pour ne rien committer de sensible.
  backend "azurerm" {
    # resource_group_name  = "tfstate-rg"
    # storage_account_name = "stmediantfstate"
    # container_name       = "tfstate"
    # key                  = "median.tfstate"
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}

provider "random" {}

data "azurerm_client_config" "current" {}
