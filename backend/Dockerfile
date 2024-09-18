FROM bitnami/laravel:10.2.4-debian-11-r3
WORKDIR /app
COPY . .
EXPOSE 8000
CMD if [ ! -f /app/vendor/autoload.php ]; then \
    echo "Instalando dependencias de Composer..." && \
    composer install --no-interaction --prefer-dist --optimize-autoloader; \
  fi && \
  if [ ! -f /app/.env ]; then \
    echo "Copiando archivo .env ..." && \
    cp /app/.env.example /app/.env && \
    php artisan key:generate; \
  fi && \
  php artisan serve --host=0.0.0.0 --port=8000
