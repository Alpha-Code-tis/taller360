FROM bitnami/laravel:10.2.4-debian-11-r3
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]