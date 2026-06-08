#!/bin/sh
set -e

# Remplace le placeholder par la valeur de la variable d'environnement
# La variable API_URL doit être fournie par Kubernetes
find /usr/share/nginx/html -name "*.js" -exec \
  sed -i "s|PLACEHOLDER_API_URL|${API_URL}|g" {} \;

# Démarre Nginx en avant-plan
exec nginx -g "daemon off;"