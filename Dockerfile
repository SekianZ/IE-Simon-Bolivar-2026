# Usa una imagen base de PHP con Apache
FROM php:7.4-apache

RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd mysqli pdo pdo_mysql


# Copia los archivos del proyecto a la carpeta de Apache en el contenedor
COPY . /var/www/html/

# Habilitar mod_rewrite en Apache (opcional, si usas URLs amigables)
RUN a2enmod rewrite

# Exponer el puerto 80 para acceder al contenedor
EXPOSE 80
CMD ["apache2-foreground"]