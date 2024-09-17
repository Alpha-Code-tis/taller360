#!/bin/bash

if [ ! -f /app/vendor/autoload.php ]; 
then
  echo "Instalando dependencias de Composer..."
  composer install
fi
composer update
if [ ! -f /app/.env ]; then
  echo "Creando archivo .env ..."
  cp /app/.env.example /app/.env
  php artisan key:generate
fi 

exec php artisan serve --host=0.0.0.0 --port=8000

