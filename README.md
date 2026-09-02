# NM Ecommerce

Tienda en línea de **Novedades Maritex**, construida con Next.js 16 (App Router), React 19 y Tailwind CSS 4.

Frontend del e-commerce orientado a features, integrado con el backend `nm-backend-v3` (NestJS).

## Stack

- **Next.js** 16.3.4 — App Router
- **React** 19.2
- **TypeScript** 5
- **Tailwind CSS** 4
- **lucide-react** — iconografía
- **clsx** + **tailwind-merge** — utilidades de clases

## Estructura del proyecto

```
src/
├── app/                    # Routing (pages, layouts)
├── components/
│   └── layout/             # Header global
├── features/
│   ├── cart/               # Carrito off-canvas + context
│   └── navigation/         # Top bar, menú, búsqueda, nav móvil
└── lib/                    # Utilidades compartidas
```

## Inicio rápido

### Requisitos

- Node.js 20+
- npm

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3012](http://localhost:3012).

### Producción

```bash
npm run build
npm start
```

## Scripts

| Comando        | Descripción                          |
|----------------|--------------------------------------|
| `npm run dev`  | Servidor de desarrollo (puerto 3012) |
| `npm run build`| Build de producción                  |
| `npm start`    | Servidor de producción (puerto 3012) |
| `npm run lint` | ESLint                               |

## Backend

La API se documenta en [`backend-map.md`](./backend-map.md).

- **Base URL:** `http://localhost:3000`
- **Prefijo:** `/api/v1/<recurso>`
- **Auth:** `Authorization: Bearer <access_token>`

## Convenciones

Ver [`.cursorrules`](./.cursorrules) para arquitectura, patrones y buenas prácticas del proyecto.

## Licencia

Proyecto privado — Novedades Maritex.
