#!/bin/sh
envsubst < src/public/assets/config/config.json.template > src/public/assets/config/config.json
envsubst < keycloak.json.template > keycloak.json
sed -i -e "/PORT=/c PORT=$PORT" /usr/src/app/admin-panel.env
sed -i -e "/isSSL=/c isSSL=$isSSL" /usr/src/app/admin-panel.env
sed -i -e "/MONGODB_URL=/c MONGODB_URL=$MONGODB_URL" /usr/src/app/admin-panel.env
sed -i -e "/LOG_LEVEL=/c LOG_LEVEL=$LOG_LEVEL" /usr/src/app/admin-panel.env
sed -i -e "/HTTPS_KEY_PATH=/c HTTPS_KEY_PATH=$HTTPS_KEY_PATH" /usr/src/app/admin-panel.env
sed -i -e "/HTTPS_CERTIFICATE_PATH=/c HTTPS_CERTIFICATE_PATH=$HTTPS_CERTIFICATE_PATH" /usr/src/app/admin-panel.env
sed -i -e "/HTTPS_CERTIFICATE_PASSPHRASE=/c HTTPS_CERTIFICATE_PASSPHRASE=$HTTPS_CERTIFICATE_PASSPHRASE" /usr/src/app/admin-panel.env

echo "Printing scripts.bundle.js"
cat src/public/assets/config/config.json
echo "Starting Unified Admin"

exec yarn start "$@" 
