# Continuidad del Catálogo Editable

Este archivo permite reanudar el trabajo desde otra cuenta o una nueva tarea sin perder el contexto.

## Sitio principal

- Producción que debe conservarse: `https://catalogo-editable-ventas.luicredo.workers.dev`
- Administrador de ropa: `https://catalogo-editable-ventas.luicredo.workers.dev/admin?catalogo=ropa`
- Repositorio: `https://github.com/luicredo-png/catalogo-editable-ventas`
- Carpeta local actual: `work/catalogo-pro`

La dirección `*.chatgpt.site` es únicamente una copia de respaldo. Las siguientes cuentas deben continuar sobre el repositorio y el dominio `luicredo.workers.dev` indicados arriba.

## Si aparece una cuenta distinta

El enlace `austin-mckinney.chatgpt.site` pertenece a otra cuenta de Sites y no sincroniza automáticamente con Cloudflare. Para que las ediciones aparezcan en `luicredo.workers.dev`, entra en la cuenta de Cloudflare propietaria de ese dominio, abre **Workers y Pages → catálogo-editable-ventas → Despliegues** y vuelve a desplegar desde el repositorio `luicredo-png/catalogo-editable-ventas`, usando la rama `principal` (o `main` si esa cuenta la configuró así). Verifica que el proyecto conserve las vinculaciones D1 `DB` y R2 `FILES`. Después abre el administrador en el dominio `luicredo.workers.dev`; no uses el enlace `chatgpt.site` como URL de producción.

## Estado funcional

- Catálogo editable con D1, archivos en R2 y pedidos por WhatsApp.
- Administración separada en Tipos y productos, Diseño, Portada, Flyers y WhatsApp.
- Creador de flyers por capas con fondos propios, galería, colores sólidos/degradados, marcos, artículo del catálogo, texto y exportación JPG/MP4.
- La IA solamente recorta el artículo y lo entrega como PNG; no diseña el flyer.
- El recorte incluye limpieza local del fondo claro conectado a los bordes para evitar el rectángulo blanco.
- El artículo usa `object-fit: contain` y debe caber completo dentro del marco.
- La ficha inferior de modelo/WhatsApp fue eliminada del flyer; esa zona contiene únicamente el precio.
- El precio tiene selector tipográfico y control de tamaño.
- El precio incluye cuatro marcos seleccionables detrás del texto: óvalo con destellos, óvalo con flechas, círculo rojo dibujado y círculo blanco dibujado. Los marcos también se renderizan al exportar JPG/MP4.
- Estilos de texto añadidos: Spray A, Spray Scans, Restore Distressed, Firma/Graffiti y Chrome Futurista.
- Detalles decorativos añadidos: letra grande, destellos, órbita, estrella fugaz y composición chrome.

## Referencias entregadas por el usuario

Las imágenes originales de esta ronda están guardadas en `docs/flyer-references/`. No dependen de la carpeta temporal del equipo.

## Archivos principales

- `app/page.tsx`: lógica, controles, vista previa y exportación del flyer.
- `app/flyer.css`: estilos nuevos del creador de flyers.
- `app/api/ai-flyer/route.ts`: conexión con el servicio de recorte por IA.
- `app/notice.css`: estilos anteriores del administrador.
- `.openai/hosting.json`: enlaces lógicos D1/R2 y respaldo en Sites.

## Cómo reanudar

1. Abrir esta carpeta o clonar el repositorio.
2. Leer este archivo antes de modificar el sitio.
3. Ejecutar `pnpm install` si faltan dependencias.
4. Validar con `pnpm run build`.
5. Publicar los cambios en la rama `principal/main` del repositorio de GitHub para que Cloudflare actualice `luicredo.workers.dev`.
6. Nunca colocar claves, códigos de acceso ni tokens dentro de este archivo o del repositorio.
