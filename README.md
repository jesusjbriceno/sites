# sites

Monorepo de minisitios estáticos personales. **Una carpeta por dominio.**

```
sites/
├─ briceno-mora.es/          # sitio estático (index.html + assets + media)
├─ briceno-online.com/
├─ docker/                   # stack nginx que sirve TODOS los sitios
│  ├─ nginx.conf
│  └─ conf.d/
│     ├─ 00-default.conf     # host desconocido -> 404 | /healthz
│     ├─ briceno-mora.es.conf
│     └─ briceno-online.com.conf
└─ Dockerfile                # imagen única con todos los sitios
```

## Cómo funciona el despliegue

Un **solo contenedor nginx** sirve todos los dominios. Traefik (Coolify) enruta
por cabecera `Host` y nginx elige el `server block` correspondiente:

```
Internet → Traefik (Coolify) → nginx → /sites/<dominio>/
```

Ventaja: un sitio nuevo no añade contenedores. Coste: comparten contenedor
(suficiente para sitios estáticos de relleno).

## Añadir un sitio nuevo (3 pasos)

1. Crear la carpeta `<dominio>/` con su `index.html` y recursos.
2. Copiar un `server block` en `docker/conf.d/<dominio>.conf` (cambiando
   `server_name` y `root`) y añadir el `COPY` correspondiente en el `Dockerfile`.
3. En Coolify: añadir el dominio al servicio y desplegar.

## Probar en local antes de subir

```bash
docker build -t sites-test .
docker run -d --name sites-test -p 8888:80 sites-test
curl -s -H "Host: briceno-online.com" http://127.0.0.1:8888/ | head
docker rm -f sites-test
```

## Detalles

- Los ficheros de vídeo/imagen se sirven con caché de 30 días; el HTML no se
  cachea (`docker/nginx.conf`).
- `/healthz` responde `ok` (lo usa el HEALTHCHECK del contenedor).
- Un host no configurado devuelve 404, nunca el contenido de otro sitio.
