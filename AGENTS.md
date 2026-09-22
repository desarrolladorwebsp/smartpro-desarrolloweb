<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Subpágina del servicio Desarrollo Web

Este sitio es una **subpágina satélite de SmartPro**, no un proyecto independiente. Vende un solo
servicio (Desarrollo Web) y todo lo comercial vive en SmartPro:

| Dato | Dónde vive | Cómo llega aquí |
| --- | --- | --- |
| Planes, precios, prestaciones | Catálogo de SmartPro | `GET /api/v1/catalog` |
| Proyectos del portafolio | SmartPro | `GET /api/v1/portfolio` |
| Pagos (Webpay y Mercado Pago) | SmartPro | `POST /api/v1/checkout/sessions` |
| Ventas y comprobantes | SmartPro | se registran solos al aprobarse el pago |
| Clientes potenciales | CRM de SmartPro | `POST /api/v1/leads` |

El repositorio de SmartPro está en `../../smartpro` y su guía de la API en
`../../smartpro/docs/api/README.md`. El contrato completo y siempre al día:
`GET /api/v1/openapi`.

## Reglas que no se rompen

1. **No escribas precios, planes ni proyectos en el código.** Si un precio está mal, se corrige en el
   panel de SmartPro. `lib/site-content.ts` es solo identidad del sitio: marca, contacto, navegación.
2. **La clave secreta es solo del servidor.** `lib/smartpro.ts` importa `node:crypto` y firma cada
   llamada. Si lo importas desde un componente con `"use client"`, la clave termina en el navegador.
3. **El navegador nunca manda montos.** Manda el id del plan; el precio lo pone el catálogo al crear
   la sesión de pago. No agregues campos de precio al cuerpo de `/api/checkout`.
4. **Todo POST a SmartPro lleva `idempotencyKey`.** Sin eso, un reintento puede cobrar dos veces.
   Usa `crypto.randomUUID()`.
5. **El resultado del pago se consulta, no se cree.** El parámetro `status` de la URL de retorno solo
   elige qué pantalla mostrar; la verdad sale de `getCheckoutSession(orderId)`.
6. **El webhook se verifica antes de leerse**, con el texto crudo del cuerpo. Volver a serializar el
   JSON invalida la firma.

## Mapa del código

| Archivo | Para qué |
| --- | --- |
| `lib/smartpro.ts` | Cliente firmado de la API. Tipos del contrato. Verificación de webhooks. |
| `lib/catalog.ts` | Traduce el catálogo al contenido del sitio y decide qué plan se puede pagar en línea. |
| `lib/catalog-server.ts` | Carga tolerante a fallos para las páginas públicas. |
| `lib/checkout.ts` | Validación del comprador, compartida por navegador y servidor. |
| `lib/site-url.ts` | URL pública del sitio y URL de retorno del pago. |
| `app/api/checkout/route.ts` | Inicia el pago y devuelve la redirección a la pasarela. |
| `app/api/contact/route.ts` | Formulario de contacto al CRM, con respaldo a WhatsApp. |
| `app/api/smartpro/webhook/route.ts` | Avisos de SmartPro cuando cambia el estado de un pago. |
| `app/pago/resultado/page.tsx` | Pantalla de resultado, con el estado consultado en vivo. |

## Planes que no se cobran en línea

Un plan que se cotiza o que publica un precio "desde" tiene `purchasable: false`: su alcance se
define conversando, así que su tarjeta muestra "Solicitar cotización" y lleva al formulario, no a la
pasarela. El servidor lo vuelve a comprobar en `/api/checkout` por si alguien fuerza el id.

## Desarrollo local

Este sitio corre en el **3100**, que es el puerto autorizado en la credencial. Cambiar de puerto
exige actualizar la credencial en SmartPro:

```bash
npm run api:client -- update desarrollo-web --origins ... --return-urls ...
```

SmartPro toma el primer puerto libre desde el 3000. Apunta `SMARTPRO_API_URL` al que informe su
consola y arráncalo con el mismo valor en `APP_URL`, porque de ahí salen las URLs absolutas de las
imágenes del catálogo:

```bash
$env:APP_URL="http://localhost:3002"; $env:NEXT_PUBLIC_APP_URL="http://localhost:3002"; npx next dev -p 3002
```

Mercado Pago exige que SmartPro tenga una URL pública HTTPS, así que en local solo se puede probar
Webpay (ambiente de integración de Transbank).

### Si la API responde 401 con la credencial correcta

Una variable de entorno exportada en la terminal **pisa a `.env.local`**: Next da prioridad al
entorno real del proceso. Si quedó un `SMARTPRO_SECRET_KEY` viejo en la sesión, el sitio firma con
ese y SmartPro responde `invalid_credentials` aunque el archivo esté bien. Límpialo y vuelve a
levantar el servidor:

```bash
Remove-Item Env:SMARTPRO_SECRET_KEY, Env:SMARTPRO_API_URL, Env:SMARTPRO_WEBHOOK_SECRET -ErrorAction SilentlyContinue
npm run dev
```

## Categorías nuevas

Las soluciones que ve el visitante se arman cruzando las categorías del catálogo con el texto
editorial de `SOLUTION_COPY` en `lib/catalog.ts`. Si SmartPro publica una categoría nueva, no
aparece hasta que se le escriba ahí su descripción. Es a propósito: evita mostrar una sección sin
texto de venta.
