# Stack de minisitios estaticos: un contenedor nginx sirve todos los dominios.
# Cada sitio vive en <dominio>/ y se enruta por cabecera Host (Traefik -> nginx).
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf.d/ /etc/nginx/conf.d/

# Un COPY por sitio: explicito, para que anadir un sitio sea una linea visible.
COPY briceno-mora.es/ /sites/briceno-mora.es/
COPY briceno-online.com/ /sites/briceno-online.com/
COPY jesusjbriceno.es/ /sites/jesusjbriceno.es/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1
