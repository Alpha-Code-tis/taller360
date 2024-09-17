#!/bin/bash

if [ ! -f /node_modules ]; then
  echo "Instalando dependencias de npm..."
  npm install --verbose
fi

exec npm run dev

