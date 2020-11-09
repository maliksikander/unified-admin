#!/bin/sh
envsubst < src/public/assets/config/config.json.template > src/public/assets/config/config.json
echo "Printing scripts.bundle.js"
cat src/public/assets/config/config.json
echo "Starting Unified Admin"

exec yarn start "$@" 
