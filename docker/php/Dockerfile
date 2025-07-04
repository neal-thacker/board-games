FROM php:8.3-fpm

ARG UID=1000
ARG GID=1000

RUN addgroup --gid $GID appgroup \
 && adduser --disabled-password --gecos "" --uid $UID --gid $GID appuser

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libzip-dev \
    npm nodejs \
    && docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

USER appuser

WORKDIR /var/www

CMD ["php-fpm"]
