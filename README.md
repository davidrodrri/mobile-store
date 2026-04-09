# Mobile Store App (Catálogo y carrito)

Aplicación web para **visualizar, buscar y gestionar** un catálogo de teléfonos móviles, con **vista de listado**, **vista de detalle** y **carrito persistente**.

## Stack y requisitos

- **Frontend**: React (con **Next.js** / App Router), TypeScript, Styled Components
- **Backend**: Node 18 (la app consume una **API REST externa**; no implementa backend propio)
- **Testing**: Jest + Testing Library
- **Lint/format**: ESLint (vía `next lint`) + Prettier
- **Fuente**: `Helvetica, Arial, sans-serif` (configurada en `src/app/globals.css`)

## Funcionalidades principales

- **Listado de teléfonos**
  - Cuadrícula con tarjetas (imagen, nombre, marca, precio base)
  - Carga inicial de **20** productos
  - Buscador en tiempo real con **filtrado por API** y contador de resultados
- **Detalle de teléfono**
  - Imagen grande que cambia con el color seleccionado
  - Selectores de almacenamiento y color
  - Precio actualizado según almacenamiento
  - Botón **"Añadir"** habilitado solo al seleccionar color y almacenamiento
  - Sección de **productos similares**
- **Carrito**
  - Persistencia en **localStorage**
  - Eliminar producto individual
  - Total de compra
  - Botón de continuar comprando

## Configuración (variables de entorno)

Crea un archivo `.env` en la raíz (o usa el existente) con:

```bash
API_BASE_URL=https://prueba-tecnica-api-tienda-moviles.onrender.com
API_KEY=87909682e6cd74208f41a6ef39fe4191
```

Todas las peticiones a la API se autentican con el header **`x-api-key`**.

## Instalación

Requisitos:
- Node.js **18+**
- npm (recomendado)

Instala dependencias:

```bash
npm install
```

## Ejecución

### Modo desarrollo

Sirve la app en modo desarrollo:

```bash
npm run dev
```

Abre `http://localhost:3000`.

### Modo producción

Compila y sirve el build optimizado:

```bash
npm run build
npm run start
```

## Scripts útiles

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`
- **Tests**: `npm run test`
- **Formato**: `npm run format`

## Arquitectura y estructura del proyecto

Estructura (resumen):

- `src/app/`
  - `page.tsx`: Home (SSR/Server Component) con carga inicial de productos
  - `product/[id]/page.tsx`: Detalle de producto (SSR/Server Component)
  - `cart/page.tsx`: Página de carrito
  - `api/products/route.ts`: Endpoint interno para búsquedas (proxy a la API externa)
  - `layout.tsx`: Layout global con `AppHeader`
  - `globals.css`: estilos globales (incluye la fuente)
- `src/features/`
  - `landing/`: pantalla de listado + buscador
  - `product-detail/`: componentes de detalle (selectores, specs, similares)
  - `cart/`: vista del carrito
- `src/components/`
  - `layout/AppHeader.tsx`: navegación (home + contador carrito)
  - `products/ProductCard.tsx`: tarjeta de producto
  - `ui/`: componentes UI reutilizables
- `src/lib/`
  - `cart.ts`: utilidades de carrito + persistencia en `localStorage`

### Capa de datos y API

- **Carga inicial (Home y Detalle)**: se hace desde Server Components (`src/app/page.tsx`, `src/app/product/[id]/page.tsx`) con `fetch` y header `x-api-key`.
- **Búsqueda**: el buscador llama a `GET /api/products?search=...` (route handler en `src/app/api/products/route.ts`), que reenvía la petición a la API externa y devuelve una lista deduplicada.

### Estado del carrito

- Persistencia: `localStorage` (clave `cart`).
- Sincronización UI: evento custom `cartchange` + evento `storage` para reflejar cambios entre pestañas.

> Nota: el enunciado se comenta usar **React Context API** para el carrito, una mejora sería encapsular `readCart/addToCart/removeFromCart` en un `CartProvider` y consumirlo desde `AppHeader` y `Cart`.

## Accesibilidad

- Imágenes con `alt` significativo en listado/detalle.
- Controles de selección (color/almacenamiento) con `aria-label`, `role="group"` y `aria-pressed`.
- Contador de resultados con `aria-live="polite"`.

## Responsive

Las vistas incluyen media queries (principalmente `@media (max-width: 1080px)` y `@media (max-width: 736px)`) para adaptar:
- Grid del listado
- Layout del detalle (columna en móvil)
- Layout del carrito

## Pruebas

Ejecutar test suite:

```bash
npm run test
```

Incluye pruebas de componentes (selectores) y utilidades (carrito).

### Tests end-to-end (E2E)

Se incluye suite E2E con **Playwright** (flujos principales en navegador).

Instalar navegadores (una vez):

```bash
npm run playwright:install
```

Ejecutar E2E:

```bash
npm run test:e2e
```

Modo UI:

```bash
npm run test:e2e:ui
```

> Nota: los E2E arrancan (o reutilizan) `npm run dev` en `http://127.0.0.1:3000`.

## Calidad de código

- Formateo con Prettier: `npm run format`
- Linter con Next/ESLint: `npm run lint`

## Despliegue (opcional)

La app puede desplegarse en plataformas compatibles con Next.js. Asegurar de tener configuradas las variables `API_BASE_URL` y `API_KEY` en el entorno del despliegue.

## Limitaciones y mejoras

- **Context API**: migrar el estado del carrito a un `CartContext` (manteniendo persistencia en `localStorage`) para cumplir el requisito de “gestión de estado con Context”. (Por tema de tiempo no he podido implementarlo)
- **Testing**: aumentar cobertura y añadir pruebas de integración/E2E de flujos principales (búsqueda → detalle → añadir al carrito → checkout).
