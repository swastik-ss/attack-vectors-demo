# Unsafe examples demo site.
#
# The site is plain HTML, CSS and JavaScript with no build step, so the image only has to place
# the files behind a web server. Nothing is compiled, transpiled or installed.

FROM nginx:stable-alpine

# Static file server config, replacing the stock default.conf.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# The project folder is the web root, so every page keeps the relative asset paths and the
# data-root attribute it was written with and works at any sub path.
COPY . /usr/share/nginx/html

# The deployment files are not part of the site.
RUN rm -rf /usr/share/nginx/html/docker

EXPOSE 80

# The base image already ends with CMD ["nginx", "-g", "daemon off;"], nothing to override.
