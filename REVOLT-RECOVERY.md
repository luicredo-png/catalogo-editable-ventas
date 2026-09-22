# Recuperación de revoltperu.shop

## Estado verificado el 22-09-2026

- Dominio registrado en Hostinger: `revoltperu.shop` (activo hasta 09-08-2027).
- DNS administrado por Cloudflare; nameservers: `dolly.ns.cloudflare.com` y `jacob.ns.cloudflare.com`.
- Ruta activa en Cloudflare: `revoltperu.shop/*` y `www.revoltperu.shop/*`.
- Worker de producción: `revolt-peru-catalogo` (despliegue activo `bd58c078`).
- Base de datos enlazada: D1 `DB`, UUID `acd0d0c2-19b9-4431-8329-bf4a8d308626`.
- El Worker se desplegó manualmente; no tiene integración continua con GitHub.

## Para editar sin perder el sitio

1. Entrar a Cloudflare con la cuenta que administra `revoltperu.shop`.
2. Abrir **Workers & Pages → revolt-peru-catalogo → Editar código**.
3. Descargar/copiar el código del Quick Edit y guardarlo en este repositorio.
4. Conservar el binding D1 `DB` y las rutas del dominio.
5. Desplegar una nueva versión solo después de probar la vista previa.

No cambiar los nameservers en Hostinger: Cloudflare es quien publica actualmente el dominio.

