#!/bin/sh
set -e

# Remplace l'URL backend dans les fichiers JS générés Angular/React
if [ -n "$API_URL" ]; then
  find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|http://localhost:3000|$API_URL|g" {} +
fi

# Lance nginx (process principal)
exec nginx -g "daemon off;"