# Этап 1: Базовый образ для PHP
FROM php:8.2-cli AS php_base
ENV COMPOSER_ALLOW_SUPERUSER=1
# Установка расширений PHP
RUN docker-php-ext-install pdo pdo_mysql bcmath
# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install zip pdo pdo_mysql bcmath
# Копирование приложения в контейнер и установка зависимостей через Composer
WORKDIR /var/www
COPY . /var/www
# Установка и активация расширения phpredis
RUN pecl install redis && docker-php-ext-enable redis

RUN composer install --no-dev --optimize-autoloader

# Этап 2: Базовый образ для Node.js
FROM node:20 AS node_base

# Копирование данных из этапа PHP
COPY --from=php_base /var/www /var/www
WORKDIR /var/www

# Установка зависимостей Node.js и Vite
COPY package.json package-lock.json ./
RUN npm install

# Запуск Vite
CMD ["npm", "run", "dev"]

# Экспонирование портов
# 8000 для Laravel
# 3000 для Vite
EXPOSE 8000 3000
