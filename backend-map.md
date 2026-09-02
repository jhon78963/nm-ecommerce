# Backend API Map — nm-backend-v3

> **Base URL:** `http://localhost:3000`  
> **Todos los endpoints de negocio se consumen vía:** `GET|POST|PATCH|DELETE /api/v1/<recurso>`  
> **Autenticación:** `Authorization: Bearer <access_token>` (JWT)  
> **Cabeceras de contexto** (inyectadas por el gateway, no por el cliente):
> - `x-warehouse-id` — UUID del almacén activo del usuario
> - `x-tenant-id` — UUID del tenant

---

## Índice

1. [Auth](#1-auth)
2. [Usuarios](#2-usuarios)
3. [Roles y Permisos](#3-roles-y-permisos)
4. [Almacenes (Warehouses)](#4-almacenes-warehouses)
5. [Tenants (Tiendas)](#5-tenants-tiendas)
6. [Perfil](#6-perfil)
7. [Logs de Auditoría](#7-logs-de-auditoría)
8. [Catálogo — Productos](#8-catálogo--productos)
9. [Catálogo — Tallas de Producto (product-sizes)](#9-catálogo--tallas-de-producto-product-sizes)
10. [Catálogo — Colores](#10-catálogo--colores)
11. [Catálogo — Tallas (sizes)](#11-catálogo--tallas-sizes)
12. [Catálogo — Géneros](#12-catálogo--géneros)
13. [Catálogo — Media de Productos](#13-catálogo--media-de-productos)
14. [Inventario — Stock](#14-inventario--stock)
15. [Inventario — Kardex](#15-inventario--kardex)
16. [Inventario — Compras](#16-inventario--compras)
17. [Inventario — Reconciliación](#17-inventario--reconciliación)
18. [POS — Checkout](#18-pos--checkout)
19. [POS — Ventas](#19-pos--ventas)
20. [POS — Tickets](#20-pos--tickets)
21. [POS — Configuración Fiscal](#21-pos--configuración-fiscal)
22. [Finanzas — Caja (Cashflow)](#22-finanzas--caja-cashflow)
23. [Finanzas — Vouchers de Caja](#23-finanzas--vouchers-de-caja)
24. [Finanzas — Cuenta Acumulada](#24-finanzas--cuenta-acumulada)
25. [Finanzas — Resumen Financiero](#25-finanzas--resumen-financiero)
26. [RRHH — Equipo](#26-rrhh--equipo)
27. [RRHH — Asistencia](#27-rrhh--asistencia)
28. [RRHH — Pagos / Planilla](#28-rrhh--pagos--planilla)
29. [RRHH — Clientes](#29-rrhh--clientes)
30. [RRHH — Proveedores](#30-rrhh--proveedores)
31. [Reportes — Dashboard](#31-reportes--dashboard)
32. [Reportes — Ventas](#32-reportes--ventas)
33. [Reportes — Caja (Reports)](#33-reportes--caja-reports)
34. [Reportes — IA](#34-reportes--ia)
35. [Storage — Archivos](#35-storage--archivos)
36. [Health](#36-health)
37. [Ecommerce — Colecciones PLP](#37-ecommerce--colecciones-plp)
38. [Ecommerce — Productos PLP](#38-ecommerce--productos-plp)

---

## Convenciones

| Símbolo | Significado |
|---------|-------------|
| 🔓 | Público (sin JWT) |
| 🔐 | Requiere JWT |
| 🛡️ | Requiere JWT + Rol específico |
| 👁️ | Requiere JWT + Permiso específico |
| 🔑 | Requiere `x-service-key` (interno, no cliente) |

---

## 1. Auth

**Módulo:** Autenticación  
**Servicio backend:** `auth-service` (:3001)  
**Prefijo gateway:** `/api/v1/auth`

---

### `POST /api/v1/auth/login`

**Descripción:** Iniciar sesión. Retorna access token + refresh token.

**Autenticación:** 🔓 Público  
**Rate limit:** 5 req / 60s

**Body:**
```json
{
  "username": "jperez",       // string — nombre de usuario o email
  "password": "MyS3cret!"    // string — mín. 8 caracteres
}
```

**Respuesta exitosa `200`:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Errores:** `401` credenciales incorrectas · `429` demasiados intentos

---

### `POST /api/v1/auth/refresh`

**Descripción:** Renovar access token usando el refresh token.

**Autenticación:** 🔓 Público (usa `JwtRefreshGuard` — Bearer = refresh token)

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Respuesta exitosa `200`:**
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer"
}
```

---

### `GET /api/v1/auth/me`

**Descripción:** Obtener perfil completo del usuario autenticado.

**Autenticación:** 🔐 JWT

**Respuesta exitosa `200`:**
```json
{
  "id": "uuid",
  "username": "jperez",
  "email": "j@empresa.com",
  "roles": ["Admin"],
  "warehouseId": "uuid",
  "tenantId": "uuid",
  "profile": { "name": "Juan", "avatar": "url" }
}
```

---

### `PATCH /api/v1/auth/me`

**Descripción:** Actualizar datos básicos del perfil.

**Autenticación:** 🔐 JWT

**Body:** `Record<string, unknown>` (campos opcionales del perfil)

**Respuesta exitosa `200`:** Usuario actualizado.

---

### `PATCH /api/v1/auth/change-password`

**Descripción:** Cambiar la contraseña del usuario autenticado.

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "current_password": "OldPass1!",
  "new_password": "NewPass2@"    // mín. 8, 1 mayúscula, 1 minúscula, 1 número, 1 especial
}
```

**Respuesta exitosa `204`:** Sin cuerpo.  
**Errores:** `400` contraseña actual incorrecta

---

### `POST /api/v1/auth/forgot-password`

**Descripción:** Solicitar enlace de recuperación. Siempre retorna 200 (no revela si el email existe).

**Autenticación:** 🔓 Público

**Body:**
```json
{
  "email": "usuario@empresa.com"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Si el correo existe, recibirás un enlace de recuperación." }
```

---

### `POST /api/v1/auth/reset-password`

**Descripción:** Establecer nueva contraseña con token de recuperación.

**Autenticación:** 🔓 Público

**Body:**
```json
{
  "token": "token-de-email",
  "password": "NuevaClave1!"    // mín. 8, 1 mayúscula, 1 minúscula, 1 número, 1 especial
}
```

**Respuesta exitosa `204`:** Sin cuerpo.

---

### `POST /api/v1/auth/logout`

**Descripción:** Cerrar sesión (invalida todos los refresh tokens del usuario).

**Autenticación:** 🔐 JWT

**Respuesta exitosa `204`:** Sin cuerpo.

---

## 2. Usuarios

**Módulo:** Gestión de Usuarios  
**Prefijo gateway:** `/api/v1/users`

---

### `GET /api/v1/users`

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `search` | string | Filtrar por nombre/email |
| `page` | number | Paginación (default 1) |
| `perPage` | number | Ítems por página |

**Respuesta `200`:** Lista paginada de usuarios con perfil.

---

### `GET /api/v1/users/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Usuario con perfil completo.

---

### `POST /api/v1/users`

**Autenticación:** 🔐 JWT

**Body:** `Record<string, unknown>` — campos del usuario (name, email, username, password, roles, warehouseId, etc.)

**Respuesta `201`:** Usuario creado.

---

### `PATCH /api/v1/users/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos parciales del usuario.  
**Respuesta `200`:** Usuario actualizado.

---

### `PATCH /api/v1/users/:id/password`

**Descripción:** Resetear contraseña de usuario (por admin).

**Autenticación:** 🔐 JWT  
**Body:** `{ "password": "NuevaClave1!" }`  
**Respuesta `200`:** OK.

---

### `DELETE /api/v1/users/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Soft delete confirmado.

---

## 3. Roles y Permisos

**Prefijo gateway:** `/api/v1/roles`

---

### `GET /api/v1/roles/permissions`

**Descripción:** Listar todos los permisos disponibles en el sistema.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Array de strings de permisos.

---

### `GET /api/v1/roles`

**Autenticación:** 🔐 JWT  
**Query Params:** `search`, `page`, `perPage`  
**Respuesta `200`:** Lista de roles con sus permisos.

---

### `GET /api/v1/roles/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Rol con permisos asignados.

---

### `POST /api/v1/roles`

**Autenticación:** 🔐 JWT  
**Body:** `{ "name": "Vendedor", "permissions": ["product.read", ...] }`  
**Respuesta `201`:** Rol creado.

---

### `PATCH /api/v1/roles/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos parciales del rol.  
**Respuesta `200`:** Rol actualizado.

---

### `DELETE /api/v1/roles/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** OK.

---

### `POST /api/v1/roles/:id/sync-permissions`

**Descripción:** Reemplazar permisos de un rol (sincronización completa).

**Autenticación:** 🔐 JWT

**Body:**
```json
{ "permissions": ["product.read", "sale.create"] }
```

**Respuesta `200`:** Permisos sincronizados.

---

## 4. Almacenes (Warehouses)

**Prefijo gateway:** `/api/v1/warehouses`

---

### `GET /api/v1/warehouses`

**Autenticación:** 🔐 JWT  
**Query Params:** `search`, `page`, `perPage`  
**Respuesta `200`:** Lista de almacenes del tenant.

---

### `GET /api/v1/warehouses/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Detalle del almacén.

---

### `POST /api/v1/warehouses`

**Autenticación:** 🔐 JWT  
**Body:** `{ "name": "Tienda Centro", "address": "...", ... }`  
**Respuesta `201`:** Almacén creado.

---

### `PATCH /api/v1/warehouses/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos parciales del almacén.  
**Respuesta `200`:** Almacén actualizado.

---

### `DELETE /api/v1/warehouses/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** OK.

---

## 5. Tenants (Tiendas)

**Prefijo gateway:** `/api/v1/tenants`

---

### `GET /api/v1/tenants`

**Autenticación:** 🔐 JWT  
**Query Params:** `search`, `page`, `perPage`  
**Respuesta `200`:** Lista de tenants.

---

### `GET /api/v1/tenants/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Detalle del tenant.

---

### `GET /api/v1/tenants/:id/settings`

**Descripción:** Obtener configuración de la tienda (razón social, RUC, dirección, etc.).

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Configuración del tenant.

---

### `POST /api/v1/tenants`

**Autenticación:** 🔐 JWT  
**Body:** `{ "name": "Mi Tienda", "ruc": "20...", ... }`  
**Respuesta `201`:** Tenant creado.

---

### `PATCH /api/v1/tenants/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos parciales del tenant.  
**Respuesta `200`:** Tenant actualizado.

---

### `PUT /api/v1/tenants/:id/settings`

**Descripción:** Guardar configuración completa del tenant.

**Autenticación:** 🔐 JWT  
**Body:** `Record<string, unknown>` (configuración)  
**Respuesta `200`:** Configuración guardada.

---

### `POST /api/v1/tenants/:id/logo`

**Descripción:** Subir o reemplazar logo del tenant.

**Autenticación:** 🔐 JWT  
**Content-Type:** `multipart/form-data`  
**Body:** Campo `file` con la imagen.  
**Respuesta `201`:** URL del logo subido.

---

### `DELETE /api/v1/tenants/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** OK.

---

## 6. Perfil

**Prefijo gateway:** `/api/v1/profile`

---

### `GET /api/v1/profile`

**Descripción:** Obtener perfil del usuario autenticado (alias de `GET /auth/me`).

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Usuario con perfil completo.

---

### `PUT /api/v1/profile`

**Descripción:** Actualizar perfil del usuario autenticado.

**Autenticación:** 🔐 JWT  
**Body:** Campos opcionales del perfil (name, phone, etc.)  
**Respuesta `200`:** Perfil actualizado.

---

### `POST /api/v1/profile/avatar`

**Descripción:** Subir o reemplazar foto de perfil.

**Autenticación:** 🔐 JWT  
**Content-Type:** `multipart/form-data`  
**Body:** Campo `file` con la imagen.  
**Respuesta `201`:** URL del avatar subido.

---

### `DELETE /api/v1/profile/avatar`

**Descripción:** Eliminar foto de perfil.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** OK.

---

## 7. Logs de Auditoría

**Prefijo gateway:** `/api/v1/user-action-logs`

---

### `GET /api/v1/user-action-logs`

**Descripción:** Listar acciones de los usuarios (auditoría).

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `userId` | string | Filtrar por usuario |
| `action` | string | Tipo de acción |
| `dateFrom` | string | Desde (YYYY-MM-DD) |
| `dateTo` | string | Hasta (YYYY-MM-DD) |
| `page` | number | Paginación |
| `perPage` | number | Ítems por página |

**Respuesta `200`:** Lista paginada de logs.

---

## 8. Catálogo — Productos

**Módulo:** Catálogo de Productos  
**Prefijo gateway:** `/api/v1/products`

---

### `GET /api/v1/products`

**Descripción:** Listar productos con filtros y paginación (offset-based).

**Autenticación:** 🔐 JWT + `WarehouseGuard`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `search` | string | Buscar por nombre |
| `genderId` | UUID | Filtrar por género |
| `vendorId` | UUID | Filtrar por proveedor |
| `warehouseId` | UUID | Filtrar por almacén |
| `colorId` | UUID | Filtrar por color |
| `sizeId` | UUID | Filtrar por talla |
| `lowStock` | boolean | Solo productos con stock bajo |
| `page` | number | Página (default: 1) |
| `perPage` | number | Ítems por página (default: 20, máx: 100) |
| `sortBy` | `name` \| `createdAt` | Orden (default: `name`) |

**Respuesta `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Polo Cuello Redondo",
      "barcode": "750123...",
      "genderId": "uuid",
      "isFeatured": false,
      "isOnSale": false,
      "wooStatus": "draft",
      "status": "active",
      "sizes": [{ "id": "uuid", "salePrice": 45.00, "stock": 10, "size": {...}, "colors": [...] }]
    }
  ],
  "total": 100,
  "page": 1,
  "perPage": 20
}
```

---

### `GET /api/v1/products/pos-search`

**Descripción:** Búsqueda rápida para el POS (por nombre o barcode).

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `q` | string | Texto de búsqueda (nombre o código de barras) |

**Respuesta `200`:** Array de productos con tallas, colores y stock disponible.

---

### `GET /api/v1/products/export/excel`

**Descripción:** Exportar catálogo de productos a archivo Excel.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `warehouseId` | UUID | (Opcional) almacén específico |

**Respuesta `200`:** Archivo `.xlsx` como descarga.  
**Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

---

### `GET /api/v1/products/:id/history`

**Descripción:** Historial de cambios del producto (tallas, colores, precios, stock).

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Array de eventos del historial.

---

### `GET /api/v1/products/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Producto completo con tallas, colores y stock.

---

### `POST /api/v1/products`

**Descripción:** Crear producto con tallas y colores en una transacción.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`

**Body:**
```json
{
  "name": "Polo Cuello Redondo",        // string, requerido
  "description": "...",                   // string, opcional
  "barcode": "7501234567890",             // string, opcional
  "genderId": "uuid",                     // UUID, requerido
  "vendorId": "uuid",                     // UUID, opcional
  "warehouseId": "uuid",                  // UUID, requerido
  "isFeatured": false,                    // boolean, opcional
  "isOnSale": false,                      // boolean, opcional
  "wooStatus": "draft",                   // "draft" | "publish" | "private"
  "status": "active",                     // string, opcional
  "percentageDiscount": 0,               // número, opcional
  "cashDiscount": 0,                      // entero, opcional
  "sizes": [
    {
      "sizeId": "uuid",                   // UUID, requerido
      "barcode": "...",                   // string, opcional
      "purchasePrice": 25.00,             // number, requerido
      "salePrice": 45.00,                 // number, requerido
      "minSalePrice": 38.00,              // number, opcional
      "stock": 10,                        // entero, opcional (solo si sin colores)
      "colorIds": ["uuid", "uuid"]        // array UUID, opcional
    }
  ]
}
```

**Respuesta `201`:** Producto creado con tallas y colores.

---

### `PATCH /api/v1/products/:id`

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`

**Body:** Campos opcionales de `UpdateProductDto` (todos los campos de creación excepto `sizes`).

**Respuesta `200`:** Producto actualizado.

---

### `DELETE /api/v1/products/:id`

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`  
**Respuesta `204`:** Sin cuerpo.

---

### `POST /api/v1/products/:id/sizes`

**Descripción:** Agregar talla a un producto existente.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`

**Body:**
```json
{
  "sizeId": "uuid",
  "purchasePrice": 25.00,    // opcional
  "salePrice": 45.00,        // opcional
  "minSalePrice": 38.00,     // opcional
  "stock": 10,               // opcional
  "colorIds": ["uuid"]       // opcional
}
```

**Respuesta `201`:** Talla agregada.

---

### `PATCH /api/v1/products/:id/sizes/:sizeId`

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`  
**Body:** Campos opcionales de la talla (precios, stock, barcode).  
**Respuesta `200`:** Talla actualizada.

---

### `DELETE /api/v1/products/:id/sizes/:sizeId`

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`  
**Respuesta `204`:** Sin cuerpo.

---

### `POST /api/v1/products/:id/sizes/:sizeId/colors`

**Descripción:** Agregar color a una talla de producto.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`

**Body:**
```json
{
  "colorId": "uuid",
  "initialStock": 5    // entero, opcional (default: 0)
}
```

**Respuesta `201`:** Color agregado a la talla.

---

### `DELETE /api/v1/products/:id/sizes/:sizeId/colors/:colorId`

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`  
**Respuesta `204`:** Sin cuerpo.

---

## 9. Catálogo — Tallas de Producto (product-sizes)

**Descripción:** Gestión de colores por `productSizeId` directo (usado por el frontend Angular existente).  
**Prefijo gateway:** `/api/v1/product-sizes`

---

### `POST /api/v1/product-sizes/:productSizeId/colors`

**Descripción:** Agregar color a una talla usando el `productSizeId` directo.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`

**Body:**
```json
{
  "colorId": "uuid",
  "stock": 5,           // number, opcional (alias: initialStock)
  "initialStock": 5     // number, opcional
}
```

**Respuesta `201`:** `{ "message": "Color agregado correctamente." }`

---

### `PATCH /api/v1/product-sizes/:productSizeId/colors/:colorId`

**Descripción:** Actualizar stock de un color en una talla.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`

**Body:**
```json
{
  "stock": 8    // number, opcional
}
```

**Respuesta `200`:** `{ "message": "Stock actualizado correctamente." }`

---

### `DELETE /api/v1/product-sizes/:productSizeId/colors/:colorId`

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`  
**Respuesta `204`:** Sin cuerpo.

---

## 10. Catálogo — Colores

**Prefijo gateway:** `/api/v1/colors`

---

### `GET /api/v1/colors`

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `search` | string | Buscar por nombre |
| `productId` | UUID | Solo colores usados en el producto |
| `sizeId` | UUID | Filtrar por talla (requiere `productId`) |
| `page` | number | Activa paginación |
| `limit` | number | Ítems por página |

**Respuesta `200`:** Array de colores `{ id, description, hex? }` o listado paginado.

---

### `GET /api/v1/colors/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Detalle del color.

---

### `POST /api/v1/colors`

**Autenticación:** 🔐 JWT  
**Body:** `{ "description": "Rojo", "hex": "#FF0000" }`  
**Respuesta `201`:** Color creado.

---

### `PATCH /api/v1/colors/:id`

**Autenticación:** 🔐 JWT  
**Body:** `{ "description"?: "...", "hex"?: "..." }`  
**Respuesta `200`:** Color actualizado.

---

### `DELETE /api/v1/colors/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Sin cuerpo.

---

## 11. Catálogo — Tallas (sizes)

**Prefijo gateway:** `/api/v1/sizes`

---

### `GET /api/v1/sizes`

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `sizeTypeId` | UUID | Filtrar por tipo de talla |
| `productId` | UUID | Tallas disponibles para un producto |
| `search` | string | Buscar por descripción |
| `page` | number | Activa paginación |
| `limit` | number | Ítems por página |

**Respuesta `200`:** Array de tallas `{ id, description, sizeType }` o listado paginado.

---

### `GET /api/v1/sizes/size-types`

**Descripción:** Listar tipos de talla (Numeric, Alpha, Shoe, etc.).

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Array de tipos de talla.

---

### `GET /api/v1/sizes/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Detalle de la talla.

---

### `POST /api/v1/sizes`

**Autenticación:** 🔐 JWT  
**Body:** `{ "description": "M", "sizeTypeId": "uuid" }`  
**Respuesta `201`:** Talla creada.

---

### `PATCH /api/v1/sizes/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos parciales de la talla.  
**Respuesta `200`:** Talla actualizada.

---

### `DELETE /api/v1/sizes/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Sin cuerpo.

---

## 12. Catálogo — Géneros

**Prefijo gateway:** `/api/v1/genders`

---

### `GET /api/v1/genders`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Array de géneros `{ id, description }` (Hombre, Mujer, Niño, etc.).

---

### `GET /api/v1/genders/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Detalle del género.

---

### `POST /api/v1/genders`

**Autenticación:** 🔐 JWT  
**Body:** `{ "description": "Unisex" }`  
**Respuesta `201`:** Género creado.

---

### `PATCH /api/v1/genders/:id`

**Autenticación:** 🔐 JWT  
**Body:** `{ "description"?: "..." }`  
**Respuesta `200`:** Género actualizado.

---

### `DELETE /api/v1/genders/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Sin cuerpo.

---

## 13. Catálogo — Media de Productos

**Prefijo gateway:** `/api/v1/products/:productId/media`

---

### `GET /api/v1/products/:productId/media`

**Descripción:** Listar imágenes de un producto.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Array de `{ id, url, isCover, position }`.

---

### `POST /api/v1/products/:productId/media`

**Descripción:** Subir hasta 5 imágenes para un producto.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`  
**Content-Type:** `multipart/form-data`  
**Body:** Campo(s) `file` con las imágenes.  
**Respuesta `201`:** Array de objetos media creados con URL.

---

### `DELETE /api/v1/products/:productId/media/:mediaId`

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`  
**Respuesta `200`:** OK.

---

### `POST /api/v1/products/:productId/media/:mediaId/cover`

**Descripción:** Marcar imagen como portada del producto.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`, `Vendedora`  
**Respuesta `200`:** OK.

---

## 14. Inventario — Stock

**Módulo:** Inventario  
**Prefijo gateway:** `/api/v1/inventory`

---

### `GET /api/v1/inventory/stock`

**Descripción:** Stock actual del almacén agrupado por producto + talla + color.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `productId` | UUID | Filtrar por producto específico |

**Respuesta `200`:**
```json
[
  {
    "productId": "uuid",
    "productName": "Polo Cuello Redondo",
    "productSizeId": "uuid",
    "sizeDescription": "M",
    "colorId": "uuid",
    "colorDescription": "Rojo",
    "quantity": 8
  }
]
```

---

### `POST /api/v1/inventory/adjust`

**Descripción:** Ajuste manual de stock (reconciliación física). Crea movimiento en el ledger.

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "warehouseId": "uuid",       // UUID, requerido
  "productSizeId": "uuid",     // UUID, requerido
  "colorId": "uuid",           // UUID, requerido
  "delta": -3,                 // number — positivo=entrada, negativo=salida
  "movementType": "ADJUSTMENT", // string, opcional (default: "ADJUSTMENT")
  "referenceId": "uuid",       // UUID, opcional
  "referenceType": "Sale"      // string, opcional
}
```

**Respuesta `201`:** Ajuste registrado.  
**Errores:** `400` delta inválido o entidad no encontrada

---

## 15. Inventario — Kardex

**Prefijo gateway:** `/api/v1/kardex`

---

### `GET /api/v1/kardex`

**Descripción:** Reporte Kardex paginado con historial de movimientos y saldo acumulado.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `productId` | UUID | Filtrar por producto |
| `productSizeId` | UUID | Filtrar por talla |
| `colorId` | UUID | Filtrar por color |
| `movementType` | string | `PURCHASE`, `SALE`, `ADJUSTMENT`, etc. |
| `dateFrom` | string | Desde (YYYY-MM-DD) |
| `dateTo` | string | Hasta (YYYY-MM-DD) |
| `page` | number | Página (default: 1) |
| `perPage` | number | Ítems por página (default: 50) |

**Respuesta `200`:** Lista paginada de movimientos con saldo acumulado.

---

### `GET /api/v1/kardex/snapshot/:productId`

**Descripción:** Stock actual desglosado por talla y color para un producto.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Stock actual por variante.

---

## 16. Inventario — Compras

**Prefijo gateway:** `/api/v1/purchases`

---

### `GET /api/v1/purchases`

**Descripción:** Listar compras paginadas del almacén.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `page` | number | Página (default: 1) |
| `perPage` | number | Ítems por página (default: 20) |

**Respuesta `200`:** Lista paginada de compras con proveedor y conteo de líneas.

---

### `GET /api/v1/purchases/:id`

**Descripción:** Detalle completo de una compra (cabecera + líneas + colores).

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Compra con todas sus líneas.  
**Errores:** `404` compra no encontrada

---

### `POST /api/v1/purchases`

**Descripción:** Registrar compra masiva (cabecera + líneas + ajuste de inventario en una transacción).

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "warehouseId": "uuid",          // UUID, requerido
  "vendorId": "uuid",             // UUID, opcional
  "supplierName": "...",          // string, opcional (proveedor libre)
  "currency": "PEN",              // "PEN" | "USD" (default: "PEN")
  "exchangeRate": 3.75,           // number, opcional (solo si USD)
  "notes": "...",                 // string, opcional
  "purchaseDate": "2026-08-25",   // string ISO, opcional
  "lines": [
    {
      "productId": "uuid",        // UUID, requerido
      "sizeId": "uuid",           // UUID, requerido
      "productSizeId": "uuid",    // UUID, opcional
      "purchasePrice": 20.00,     // number, requerido
      "salePrice": 45.00,         // number, opcional
      "quantity": 10,             // entero, requerido (total de la línea)
      "colorDeltas": [
        { "colorId": "uuid", "quantity": 5 }
      ]
    }
  ]
}
```

**Respuesta `201`:** Compra registrada e inventario ajustado.  
**Errores:** `400` error en colorDeltas o talla no encontrada

---

### `PATCH /api/v1/purchases/:id`

**Descripción:** Actualizar cabecera de una compra activa (no cancelada).

**Autenticación:** 🔐 JWT  
**Body:** `{ "notes"?: "...", "purchaseDate"?: "...", "vendorId"?: "uuid" }`  
**Respuesta `200`:** Cabecera actualizada.

---

### `POST /api/v1/purchases/:id/lines/bulk`

**Descripción:** Agregar líneas a una compra activa.

**Autenticación:** 🔐 JWT  
**Body:** `{ "lines": [PurchaseLineDto] }` (misma estructura que en POST)  
**Respuesta `201`:** Líneas agregadas.

---

### `PATCH /api/v1/purchases/:id/lines/:lineId`

**Descripción:** Actualizar una línea de compra activa.

**Autenticación:** 🔐 JWT  
**Body:** `{ "purchasePrice"?: number, "salePrice"?: number, "quantity"?: number }`  
**Respuesta `200`:** Línea actualizada.

---

### `DELETE /api/v1/purchases/:id/lines/:lineId`

**Descripción:** Eliminar una línea de compra activa.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** OK.

---

### `POST /api/v1/purchases/:id/cancel`

**Descripción:** Cancelar compra y revertir stock (genera movimiento OUT inmutable).

**Autenticación:** 🔐 JWT

**Body:**
```json
{ "reason": "Mercadería dañada" }    // string, requerido
```

**Respuesta `200`:** Compra cancelada y stock revertido.  
**Errores:** `400` ya cancelada · `404` no encontrada

---

## 17. Inventario — Reconciliación

**Prefijo gateway:** `/api/v1/inventory/reconciliation`

---

### `GET /api/v1/inventory/reconciliation/search`

**Descripción:** Buscar productos para reconciliación de inventario.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `q` | string | Requerido — texto de búsqueda |

**Respuesta `200`:** Array de productos con stock.

---

### `GET /api/v1/inventory/reconciliation/:productId`

**Descripción:** Obtener producto con stock detallado para reconciliación.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** `{ "product": { ...producto con tallas, colores y stock... } }`

---

### `GET /api/v1/inventory/reconciliation/:productId/pos-sales`

**Descripción:** Ventas POS del producto desde la última reconciliación.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Array de ventas relevantes.

---

### `PUT /api/v1/inventory/reconciliation/:productId`

**Descripción:** Actualizar stock de variantes del producto (reconciliación masiva).

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "variants": [
    {
      "productSizeId": "uuid",
      "colorId": "uuid",
      "quantity": 15
    }
  ]
}
```

**Respuesta `200`:** Stock actualizado.

---

### `POST /api/v1/inventory/reconciliation/:productId/product-size/:productSizeId/replace-color`

**Descripción:** Reemplazar color de una variante manteniendo el stock.

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "oldColorId": "uuid",
  "newColorId": "uuid"
}
```

**Respuesta `201`:** Color reemplazado.

---

## 18. POS — Checkout

**Módulo:** Punto de Venta  
**Prefijo gateway:** `/api/v1/checkout`

---

### `POST /api/v1/checkout`

**Descripción:** Procesar venta POS. Valida stock, descuenta inventario y genera el comprobante. Retorna la venta creada y URL del ticket.

**Autenticación:** 🛡️ Roles: `Vendedora`, `Vendedor`, `Admin`, `Super Admin` + `WarehouseGuard`

**Body:**
```json
{
  "warehouseId": "uuid",                // UUID, requerido
  "customerId": "uuid",                 // UUID, opcional
  "documentType": "TICKET",            // "BOLETA" | "FACTURA" | "TICKET" (default: TICKET)
  "items": [
    {
      "productSizeId": "uuid",          // UUID, requerido
      "colorId": "uuid",               // UUID, opcional (requerido si tiene colores)
      "quantity": 2,                    // entero >= 1
      "unitPrice": 45.00               // number >= 0
    }
  ],
  "payments": [
    {
      "method": "CASH",                 // "CASH" | "YAPE" | "PLIN" | "CARD" | "MIXED"
      "amount": 90.00,                  // number > 0
      "reference": "OP-123"            // string, opcional
    }
  ],
  "notes": "...",                        // string, opcional
  "customerRuc": "20...",               // string, requerido si FACTURA
  "customerBusinessName": "..."         // string, requerido si FACTURA
}
```

**Respuesta `201`:**
```json
{
  "sale": { "id": "uuid", "total": 90.00, "documentType": "TICKET", ... },
  "ticketUrl": "/api/v1/tickets/uuid"
}
```

**Errores:** `400` totales de pagos no coinciden · `422` stock insuficiente

---

## 19. POS — Ventas

**Prefijo gateway:** `/api/v1/sales`

---

### `GET /api/v1/sales`

**Descripción:** Listar ventas del almacén con filtros.

**Autenticación:** 🔐 JWT + `WarehouseGuard`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `page` | number | Página (default: 1) |
| `perPage` | number | Ítems por página (default: 20) |
| `dateFrom` | string | Desde (YYYY-MM-DD) |
| `dateTo` | string | Hasta (YYYY-MM-DD) |
| `documentType` | string | `BOLETA`, `FACTURA`, `TICKET` |
| `status` | string | Estado de la venta |
| `search` | string | Búsqueda por referencia |

**Respuesta `200`:** Lista paginada de ventas con ítems y pagos.

---

### `GET /api/v1/sales/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Venta completa con ítems, pagos y cliente.

---

### `POST /api/v1/sales/exchange`

**Descripción:** Registrar cambio de mercadería en una venta existente.

**Autenticación:** 🛡️ Roles: `Vendedora`, `Vendedor`, `Admin`, `Super Admin`

**Body:**
```json
{
  "saleId": "uuid",
  "returnItems": [{ "productSizeId": "uuid", "colorId": "uuid", "quantity": 1 }],
  "newItems": [{ "productSizeId": "uuid", "colorId": "uuid", "quantity": 1, "unitPrice": 45.00 }]
}
```

**Respuesta `200`:** Cambio procesado.

---

### `PATCH /api/v1/sales/:id`

**Descripción:** Actualizar venta (ítems, pagos y fecha).

**Autenticación:** 🛡️ Roles: `Vendedora`, `Vendedor`, `Admin`, `Super Admin`  
**Body:** Campos opcionales de la venta.  
**Respuesta `200`:** Venta actualizada.

---

### `DELETE /api/v1/sales/:id`

**Descripción:** Anular venta (soft delete).

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Sin cuerpo.

---

### `POST /api/v1/sales/:id/cancel`

**Descripción:** Anular venta (equivalente a DELETE, con body de razón opcional).

**Autenticación:** 🔐 JWT

**Body:**
```json
{ "reason": "Error de cobro" }    // string, opcional
```

**Respuesta `200`:** Venta anulada.

---

## 20. POS — Tickets

**Prefijo gateway:** `/api/v1/tickets`

---

### `GET /api/v1/tickets/:id`

**Descripción:** Obtener el HTML del ticket para impresión térmica (80mm).

**Autenticación:** 🔐 JWT  
**Content-Type respuesta:** `text/html; charset=utf-8`  
**Respuesta `200`:** HTML del ticket listo para imprimir.

---

## 21. POS — Configuración Fiscal

**Prefijo gateway:** `/api/v1/pos`

---

### `GET /api/v1/pos/fiscal-config`

**Descripción:** Obtener configuración de facturación electrónica del almacén (SUNAT).

**Autenticación:** 🔐 JWT + `WarehouseGuard`

**Respuesta `200`:**
```json
{
  "ruc": "20...",
  "razonSocial": "...",
  "sunatEnabled": true,
  "seriesBoleta": "B001",
  "seriesFactura": "F001"
}
```

---

## 22. Finanzas — Caja (Cashflow)

**Módulo:** Finanzas  
**Prefijo gateway:** `/api/v1/cashflow` (solo CRUD — los reportes van a report-service)

---

### `GET /api/v1/cashflow`

**Descripción:** Listar movimientos de caja con filtros.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Mes contable `YYYY-MM` |
| `type` | string | `INCOME` \| `EXPENSE` |
| `category` | string | Categoría del movimiento |
| `warehouseId` | UUID | Almacén (usa el del token si se omite) |

**Respuesta `200`:** Lista de movimientos con vouchers adjuntos.

---

### `GET /api/v1/cashflow/:id`

**Descripción:** Obtener movimiento de caja por ID (incluye vouchers).

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Movimiento con sus comprobantes adjuntos.  
**Errores:** `404` no encontrado

---

### `POST /api/v1/cashflow`

**Descripción:** Registrar ingreso o gasto de caja.

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "type": "INCOME",               // "INCOME" | "EXPENSE", requerido
  "amount": 250.00,              // number > 0, requerido
  "category": "Venta directa",   // string, requerido (máx. 100 chars)
  "paymentMethod": "CASH",       // "CASH" | "YAPE" | "PLIN" | "CARD" | "TRANSFER"
  "description": "...",           // string, opcional
  "date": "2026-08-25",          // string ISO, requerido
  "accountingMonth": "2026-08",  // string YYYY-MM, requerido
  "purchaseId": "uuid"           // UUID, opcional (vincular a compra)
}
```

**Respuesta `201`:** Movimiento creado.

---

### `PATCH /api/v1/cashflow/:id`

**Descripción:** Actualización parcial de un movimiento de caja.

**Autenticación:** 🔐 JWT  
**Body:** Campos opcionales del movimiento (cualquier campo de creación).  
**Respuesta `200`:** Movimiento actualizado.

---

### `DELETE /api/v1/cashflow/:id`

**Descripción:** Soft delete del movimiento.

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Sin cuerpo.

---

## 23. Finanzas — Vouchers de Caja

**Prefijo gateway:** `/api/v1/cashflow/:movementId/vouchers`

---

### `POST /api/v1/cashflow/:movementId/vouchers`

**Descripción:** Adjuntar comprobante(s) a un movimiento de caja.

**Autenticación:** 🔐 JWT  
**Content-Type:** `multipart/form-data`  
**Body:** Campo(s) `file` con las imágenes o PDFs.  
**Respuesta `201`:** Array de vouchers creados con URL.

---

### `DELETE /api/v1/cashflow/:movementId/vouchers/:voucherId`

**Descripción:** Eliminar un comprobante de un movimiento.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** OK.

---

## 24. Finanzas — Cuenta Acumulada

**Prefijo gateway:** `/api/v1/accumulated`

---

### `GET /api/v1/accumulated/settings`

**Descripción:** Obtener configuración de la cuenta acumulada del almacén.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Configuración de saldos iniciales.  
**Errores:** `404` cuenta no inicializada

---

### `POST /api/v1/accumulated/settings`

**Descripción:** Inicializar cuenta acumulada (una sola vez por almacén).

**Autenticación:** 🔐 JWT  
**Body:** `{ "warehouseId": "uuid", "initialBalance": 5000.00, ... }`  
**Respuesta `201`:** Cuenta inicializada.  
**Errores:** `400` ya inicializada

---

### `PATCH /api/v1/accumulated/settings`

**Descripción:** Actualizar saldos iniciales de la cuenta acumulada.

**Autenticación:** 🔐 JWT  
**Body:** Campos parciales de la configuración.  
**Respuesta `200`:** Configuración actualizada.

---

### `GET /api/v1/accumulated/preview`

**Descripción:** Vista previa del cierre de mes: saldo proyectado.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Requerido — `YYYY-MM` |

**Respuesta `200`:** Proyección del saldo al cierre del mes.

---

### `GET /api/v1/accumulated/transfers`

**Descripción:** Listar cierres de mes registrados.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Historial de transferencias de cierre de mes.

---

### `POST /api/v1/accumulated/transfers`

**Descripción:** Registrar cierre de mes con montos reales.

**Autenticación:** 🔐 JWT  
**Body:** `{ "month": "2026-08", "amount": 3500.00, ... }`  
**Respuesta `201`:** Cierre registrado.  
**Errores:** `400` ya existe un cierre para ese mes

---

## 25. Finanzas — Resumen Financiero

**Prefijo gateway:** `/api/v1/financial-summary`

---

### `GET /api/v1/financial-summary`

**Descripción:** Resumen financiero consolidado del mes (ventas, caja, acumulado, planilla).

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Mes `YYYY-MM` (default: mes actual) |

**Respuesta `200`:**
```json
{
  "month": "2026-08",
  "sales": { "total": 15000.00, "count": 120 },
  "cashflow": { "income": 5000.00, "expense": 3000.00, "balance": 2000.00 },
  "accumulated": { "balance": 25000.00 },
  "payroll": { "total": 4800.00 },
  "topExpenseCategories": [{ "category": "Alquiler", "total": 1500.00 }]
}
```

---

## 26. RRHH — Equipo

**Módulo:** Recursos Humanos  
**Prefijo gateway:** `/api/v1/teams`

---

### `GET /api/v1/teams`

**Descripción:** Listar personal del almacén con conteo de asistencias y pagos.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `search` | string | Buscar por nombre, apellido o DNI |
| `page` | number | Página (default: 1) |
| `limit` | number | Ítems por página (default: 10) |

**Respuesta `200`:**
```json
[{
  "id": "uuid",
  "dni": "12345678",
  "name": "Juan",
  "surname": "Pérez",
  "salary": 1200.00,
  "warehouseId": "uuid",
  "user": { "id": "uuid", "username": "jperez", "email": "j@nm.com" },
  "_count": { "attendances": 22, "payments": 3 }
}]
```

---

### `GET /api/v1/teams/:id`

**Descripción:** Obtener miembro del equipo con últimas 30 asistencias y 10 pagos.

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Miembro del equipo completo.

---

### `POST /api/v1/teams`

**Descripción:** Registrar nuevo miembro del equipo. El DNI debe ser único por almacén.

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "dni": "12345678",        // string 8-12 chars, requerido
  "name": "Juan",           // string, requerido
  "surname": "Pérez García", // string, requerido
  "salary": 1200.00,        // number, requerido
  "warehouseId": "uuid",    // UUID, requerido
  "userId": "uuid"          // UUID, opcional (vincular usuario del sistema)
}
```

**Respuesta `201`:** Miembro creado.  
**Errores:** `409` DNI duplicado

---

### `PATCH /api/v1/teams/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos opcionales del miembro.  
**Respuesta `200`:** Miembro actualizado.

---

### `DELETE /api/v1/teams/:id`

**Descripción:** Dar de baja (soft delete).

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Sin cuerpo.

---

## 27. RRHH — Asistencia

**Prefijo gateway:** `/api/v1/attendance`

---

### `POST /api/v1/attendance`

**Descripción:** Registrar o actualizar asistencia (upsert por teamId + fecha).

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "teamId": "uuid",                // UUID, requerido
  "date": "2026-08-25",           // string ISO date, requerido
  "status": "PUNTUAL",            // enum: PUNTUAL | TOLERANCIA | TARDE | FALTA | FALTA_INJUSTIFICADA | DESCANSO | VACACIONES | RECUPERACION | VALDEO
  "checkIn": "09:05",             // string HH:mm, opcional
  "checkOut": "18:00",            // string HH:mm, opcional
  "delayMinutes": 5,              // entero >= 0, opcional
  "notes": "..."                  // string, opcional
}
```

**Respuesta `201`:** Asistencia registrada o actualizada.

---

### `GET /api/v1/attendance/daily`

**Descripción:** Resumen de asistencia del día para el almacén.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `date` | string | Requerido — `YYYY-MM-DD` |

**Respuesta `200`:** Estado de asistencia de todos los miembros del día.

---

### `GET /api/v1/attendance/monthly`

**Descripción:** Asistencia mensual por colaborador o resumen por almacén.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Requerido — `YYYY-MM` |
| `teamId` | UUID | Opcional — si se envía, retorna registros por fecha del colaborador |

**Respuesta `200`:** Registros del mes o resumen por empleado.

---

## 28. RRHH — Pagos / Planilla

**Prefijo gateway:** `/api/v1/payments`

---

### `GET /api/v1/payments/monthly`

**Descripción:** Listar pagos del mes para el almacén.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Requerido — `YYYY-MM` |

**Respuesta `200`:** Lista de pagos del período.

---

### `GET /api/v1/payments/payroll`

**Descripción:** Vista de nómina por colaborador.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `teamId` | UUID | Requerido |
| `month` | number | Requerido (1-12) |
| `year` | number | Requerido |
| `period` | string | `full` \| `q1` \| `q2` (default: `full`) |

**Respuesta `200`:** Cálculo de nómina con asistencia y movimientos.

---

### `POST /api/v1/payments`

**Descripción:** Registrar pago al personal (salario, bono, adelanto).

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "teamId": "uuid",                  // UUID, requerido
  "type": "PAYMENT",                 // "PAYMENT" | "ADVANCE" | "DEDUCTION"
  "amount": 1200.00,                 // number > 0
  "date": "2026-08-25",             // string ISO date
  "payrollPeriod": "q2",            // string, opcional ("q1" o "q2")
  "accountingMonth": "2026-08",     // string YYYY-MM
  "paymentMethod": "CASH",          // "CASH" | "TRANSFER" | "YAPE" | "CARD"
  "cashMovementId": "uuid"          // UUID, opcional (vincular a CashMovement)
}
```

**Respuesta `201`:** Pago registrado.

---

### `PATCH /api/v1/payments/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos opcionales del pago.  
**Respuesta `200`:** Pago actualizado.

---

### `DELETE /api/v1/payments/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Sin cuerpo.

---

## 29. RRHH — Clientes

**Prefijo gateway:** `/api/v1/customers`

---

### `GET /api/v1/customers`

**Descripción:** Listar clientes del almacén.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `search` | string | Buscar por nombre o documento |
| `page` | number | Página (default: 1) |
| `limit` | number | Ítems por página |

**Respuesta `200`:** Lista paginada de clientes.

---

### `GET /api/v1/customers/pos-search`

**Descripción:** Buscar o registrar cliente por DNI/RUC para el POS. Si no existe en BD, consulta RENIEC/SUNAT y lo crea.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `q` | string | Requerido — DNI (8 dígitos) o RUC (11 dígitos) |

**Respuesta `200`:** Cliente encontrado o recién creado.  
**Errores:** `404` documento no encontrado · `503` SUNAT/RENIEC no disponible

---

### `GET /api/v1/customers/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Detalle del cliente.

---

### `POST /api/v1/customers`

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "dni": "74935446",          // string 8 dígitos, requerido
  "name": "Anali Saraeli",    // string, requerido
  "surname": "Trujillo Cardenas" // string, requerido
}
```

**Respuesta `201`:** Cliente creado.

---

### `PATCH /api/v1/customers/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos opcionales del cliente (dni, name, surname).  
**Respuesta `200`:** Cliente actualizado.

---

### `DELETE /api/v1/customers/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Soft delete.

---

## 30. RRHH — Proveedores

**Prefijo gateway:** `/api/v1/vendors`

---

### `GET /api/v1/vendors`

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `search` | string | Buscar por nombre, teléfono o dirección |
| `page` | number | Página |
| `limit` | number | Ítems por página |

**Respuesta `200`:** Lista paginada de proveedores.

---

### `GET /api/v1/vendors/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `200`:** Detalle del proveedor.

---

### `POST /api/v1/vendors`

**Autenticación:** 🔐 JWT  
**Body:** `{ "name": "Proveedor SA", "phone"?: "...", "address"?: "...", ... }`  
**Respuesta `201`:** Proveedor creado.

---

### `PATCH /api/v1/vendors/:id`

**Autenticación:** 🔐 JWT  
**Body:** Campos opcionales del proveedor.  
**Respuesta `200`:** Proveedor actualizado.

---

### `DELETE /api/v1/vendors/:id`

**Autenticación:** 🔐 JWT  
**Respuesta `204`:** Soft delete.

---

## 31. Reportes — Dashboard

**Módulo:** Reportes  
**Prefijo gateway:** `/api/v1/dashboard`

---

### `GET /api/v1/dashboard`

**Descripción:** Métricas del día y del mes para la pantalla principal del administrador.

**Autenticación:** 🔐 JWT

**Respuesta `200`:**
```json
{
  "sales": {
    "today": { "count": 12, "revenue": 540.00 },
    "month": { "count": 230, "revenue": 10350.00 }
  },
  "inventory": { "lowStockItems": 5 },
  "purchases": { "pendingThisMonth": 2 },
  "customers": { "total": 156 },
  "topProducts": [{ "productId": "uuid", "name": "...", "soldUnits": 45 }]
}
```

---

### `GET /api/v1/dashboard/metrics`

**Descripción:** Versión simplificada del dashboard (compatibilidad con frontend Angular).

**Autenticación:** 🔐 JWT

**Respuesta `200`:**
```json
{
  "todaySales": 12,
  "todaySalesAmount": 540.00,
  "todayExpenses": 0,
  "lowStockProducts": 5,
  "pendingPurchases": 2,
  "activeCustomers": 156
}
```

---

## 32. Reportes — Ventas

**Prefijo gateway:** `/api/v1/reports`

> Requiere permiso específico según el reporte.

---

### `GET /api/v1/reports/dashboard`

**Descripción:** Reporte gerencial (totales, P&L, ranking de productos, históricos).

**Autenticación:** 👁️ Permiso: `report.index`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `start_date` / `startDate` | string | Desde `YYYY-MM-DD` (default: inicio del mes) |
| `end_date` / `endDate` | string | Hasta `YYYY-MM-DD` (default: fin del mes) |

**Respuesta `200`:** Dashboard gerencial con P&L y rankings.

---

### `GET /api/v1/reports/sales/daily`

**Descripción:** Reporte diario de ventas.

**Autenticación:** 👁️ Permiso: `report.sales`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `date` | string | `YYYY-MM-DD` (default: hoy) |
| `warehouse_id` | UUID | Almacén (default: del token) |

**Respuesta `200`:** Detalle de ventas del día.

---

### `GET /api/v1/reports/sales/daily/pdf`

**Descripción:** Exportar reporte diario de ventas en PDF.

**Autenticación:** 👁️ Permiso: `report.sales`  
**Query Params:** `date`, `warehouse_id` (igual que daily)  
**Respuesta `200`:** Archivo PDF como descarga.

---

### `GET /api/v1/reports/sales/monthly`

**Descripción:** Reporte mensual de ventas.

**Autenticación:** 👁️ Permiso: `report.sales`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | `YYYY-MM` (default: mes actual) |
| `warehouse_id` | UUID | Almacén (default: del token) |

**Respuesta `200`:** Detalle de ventas del mes.

---

### `GET /api/v1/reports/sales/daily-period`

**Descripción:** Reporte de ventas por rango de fechas.

**Autenticación:** 👁️ Permiso: `report.sales`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `start_date` | string | Requerido — `YYYY-MM-DD` |
| `end_date` | string | Requerido — `YYYY-MM-DD` |
| `warehouse_id` | UUID | Almacén |

**Respuesta `200`:** Reporte del período.

---

### `GET /api/v1/reports/sales/period/pdf`

**Descripción:** Exportar reporte de período en PDF.

**Autenticación:** 👁️ Permiso: `report.sales`  
**Query Params:** `start_date`, `end_date`, `warehouse_id`  
**Respuesta `200`:** Archivo PDF como descarga.

---

### `GET /api/v1/reports/products`

**Descripción:** Inventario de productos con stock.

**Autenticación:** 👁️ Permiso: `report.products`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `warehouse_id` | UUID | Almacén (default: del token) |

**Respuesta `200`:** `{ "success": true, "data": [...productos con stock...] }`

---

### `GET /api/v1/reports/products/export/pdf`

**Descripción:** Exportar inventario de productos en PDF.

**Autenticación:** 👁️ Permiso: `report.products`  
**Query Params:** `warehouse_id`  
**Respuesta `200`:** Archivo PDF como descarga.

---

## 33. Reportes — Caja (Reports)

**Prefijo gateway:** `/api/v1/cashflow` (ruta de reportes — proxeada a report-service, no a finance-service)

> El gateway distingue: rutas que contienen `daily`, `monthly`, `admin/*` o `accumulated/*` van a report-service (:3007). El CRUD simple va a finance-service (:3005).

---

### `GET /api/v1/cashflow/daily`

**Descripción:** Reporte diario de caja.

**Autenticación:** 👁️ Permiso: `cashflow.getDaily`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `date` | string | Requerido — `YYYY-MM-DD` |
| `filters` | string | Opcional — categorías separadas por coma |

**Respuesta `200`:** Ingresos y egresos del día agrupados.

---

### `GET /api/v1/cashflow/monthly`

**Descripción:** Reporte mensual de caja.

**Autenticación:** 👁️ Permiso: `cashflow.getDaily`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Requerido — `YYYY-MM` |
| `warehouseId` | UUID | Opcional |

**Respuesta `200`:** Resumen de movimientos del mes.

---

### `GET /api/v1/cashflow/admin/monthly`

**Descripción:** Reporte mensual de gastos administrativos (todos los almacenes).

**Autenticación:** 👁️ Permiso: `cashflow.getAdminMonthlyReport`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Requerido — `YYYY-MM` |

**Respuesta `200`:** Gastos admin del mes.

---

### `GET /api/v1/cashflow/accumulated/monthly`

**Descripción:** Reporte mensual de egresos de cuenta acumulada.

**Autenticación:** 👁️ Permiso: `cashflow.getAccumulatedExpensesReport`

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `month` | string | Requerido — `YYYY-MM` |

**Respuesta `200`:** Egresos acumulados del mes.

---

## 34. Reportes — IA

**Prefijo gateway:** `/api/v1/ai`

> El motor de IA es un servicio externo Python (FastAPI). Los endpoints de predicción requieren que el AI engine esté activo.

---

### `GET /api/v1/ai/products/:productId/context`

**Descripción:** Contexto del producto para el motor de IA (historial de ventas, stock, precios).

**Autenticación:** 🔐 JWT

**Respuesta `200`:** Contexto enriquecido del producto.  
**Errores:** `503` AI Engine no disponible

---

### `POST /api/v1/ai/predict/price`

**Descripción:** Predicción de precio óptimo para un producto.

**Autenticación:** 🔐 JWT

**Body:**
```json
{ "product_id": "uuid" }
```

**Respuesta `200`:** Predicción de precio del AI Engine.  
**Errores:** `503` AI Engine no disponible

---

### `POST /api/v1/ai/predict/demand`

**Descripción:** Predicción de demanda futura para un producto.

**Autenticación:** 🔐 JWT

**Body:**
```json
{
  "product_id": "uuid",
  "horizon_days": 30    // number, opcional (default: 30)
}
```

**Respuesta `200`:** Predicción de demanda del AI Engine.  
**Errores:** `503` AI Engine no disponible

---

### `GET /api/v1/ai/reports/products-inventory`

**Descripción:** Reporte de inventario enriquecido con análisis de IA.

**Autenticación:** 🔐 JWT

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `horizon_days` | number | Horizonte de predicción (default: 30) |

**Respuesta `200`:** Inventario con predicciones de demanda.  
**Errores:** `503` AI Engine no disponible

> **Nota:** Los endpoints `/ai/predict/*` muestran `purchasePrice` solo a usuarios con rol `Admin`, `SuperAdmin` u `Owner`.

---

## 35. Storage — Archivos

**Módulo:** Almacenamiento de archivos  
**Prefijo gateway:** `/api/v1/storage`

---

### `GET /api/v1/storage/files/:context/:filename`

**Descripción:** Descargar o servir un archivo almacenado (imágenes de productos, avatares, vouchers, logos, etc.).

**Autenticación:** 🔓 Público (GET/HEAD son rutas públicas en el gateway)

**Parámetros de ruta:**
| Param | Valores válidos |
|-------|----------------|
| `context` | `products` \| `avatars` \| `vouchers` \| `tenants` \| `general` |
| `filename` | Nombre del archivo (sin path traversal) |

**Respuesta `200`:** Stream del archivo con Content-Type apropiado (image/jpeg, image/png, image/webp, application/pdf).

---

### `DELETE /api/v1/storage/files`

**Descripción:** Eliminar un archivo por su ruta lógica (uso interno).

**Autenticación:** 🔑 `x-service-key` (solo servicios internos)

**Body:**
```json
{ "path": "products/imagen.jpg" }
```

**Respuesta `200`:** `{ "success": true }`

---

## 36. Health

---

### `GET /health`

**Descripción:** Estado del gateway.

**Autenticación:** 🔓 Público  
**Respuesta `200`:** Estado del servicio gateway.

### `GET /health/services`

**Descripción:** Estado de todos los microservicios.

**Autenticación:** 🔓 Público  
**Respuesta `200`:** Estado de cada servicio (auth, catalog, inventory, pos, finance, hr, report, storage).

---

## 37. Ecommerce — Colecciones PLP

**Módulo:** Tienda online — colecciones de producto (PLP)  
**Servicio backend:** `ecommerce-service` (:3012)  
**Prefijo gateway:** `/api/v1/ecommerce/shop/collections`

---

### `GET /api/v1/ecommerce/shop/collections`

**Descripción:** Listar colecciones activas de la tienda (sidebar y rutas `/[slug]`).

**Autenticación:** 🔓 Público

**Respuesta `200`:**
```json
{
  "collections": [
    {
      "id": "ninos",
      "slug": "ninos",
      "label": "Niños",
      "description": "Ropa para niños",
      "bannerImageUrl": "/api/v1/storage/files/products/banner.jpg",
      "status": true,
      "productIds": ["uuid-1", "uuid-2"]
    }
  ]
}
```

---

### `GET /api/v1/ecommerce/shop/collections/:slug`

**Descripción:** Obtener una colección por slug.

**Autenticación:** 🔓 Público  
**Errores:** `404` colección no encontrada o inactiva

---

### `PUT /api/v1/ecommerce/shop/collections/admin`

**Descripción:** Crear o reemplazar todas las colecciones de la tienda.

**Autenticación:** 🛡️ Roles: `Admin`, `Super Admin`

**Body:**
```json
{
  "collections": [
    {
      "id": "ninos",
      "slug": "ninos",
      "label": "Niños",
      "description": "Opcional",
      "bannerImageUrl": "Opcional",
      "status": true,
      "productIds": ["uuid-1", "uuid-2", "uuid-3"]
    }
  ]
}
```

**Respuesta `200`:** Misma forma que `GET /collections` (solo activas).

---

## 38. Ecommerce — Productos PLP

**Prefijo gateway:** `/api/v1/ecommerce/shop/products`

---

### `GET /api/v1/ecommerce/shop/products`

**Descripción:** Listar productos de una colección con paginación, filtros y facetas (tallas/colores disponibles en la colección).

**Autenticación:** 🔓 Público  
**Rate limit:** 30 req / 60s

**Query Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `collectionSlug` | string | Slug de la colección (requerido) |
| `warehouseId` | UUID | Almacén del tenant (requerido) |
| `sizeIds` | string | IDs de talla separados por coma |
| `colorIds` | string | IDs de color separados por coma |
| `minPrice` | number | Precio mínimo (precio de venta mínimo del producto) |
| `maxPrice` | number | Precio máximo |
| `sort` | string | `featured` \| `price_asc` \| `price_desc` \| `newest` |
| `page` | number | Página (default: 1) |
| `perPage` | number | Ítems por página (default: 12, máx: 100) |

**Respuesta `200`:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Polo Cuello Redondo",
      "slug": "polo-cuello-redondo-abc12345",
      "imageUrl": "...",
      "galleryImageUrls": ["..."],
      "price": 45.00,
      "salePrice": 39.00,
      "discount": 13,
      "stockStatus": "in_stock",
      "ratingCount": null,
      "reviewsCount": 0
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "perPage": 12,
    "totalPages": 2
  },
  "facets": {
    "sizes": [{ "id": "uuid", "label": "L" }],
    "colors": [{ "id": "uuid", "label": "Rojo", "hex": "#FF0000" }]
  }
}
```

**Notas:**
- Las facetas (`sizes`, `colors`) se calculan a partir de **todos** los productos asignados a la colección, no del resultado filtrado.
- El filtro de precio en el frontend usa presets estáticos; el backend aplica `minPrice`/`maxPrice` sobre el precio mínimo de venta del producto.

---

## Apéndice — Cabeceras de Request

| Cabecera | Cuándo enviar | Descripción |
|----------|--------------|-------------|
| `Authorization` | Todos los endpoints 🔐 | `Bearer <access_token>` |
| `Content-Type` | POST/PATCH con body JSON | `application/json` |
| `Content-Type` | Subida de archivos | `multipart/form-data` |

## Apéndice — Estructura de Errores

Todos los errores siguen el formato:
```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Bad Request"
}
```

En errores de validación (`400`):
```json
{
  "statusCode": 400,
  "message": ["campo must be a UUID", "..."],
  "error": "Bad Request"
}
```

## Apéndice — Flujo de Autenticación

```
1. POST /api/v1/auth/login  →  { access_token, refresh_token }
2. Almacenar tokens en el cliente (cookies httpOnly recomendado)
3. Incluir en cada request:  Authorization: Bearer <access_token>
4. Si 401 →  POST /api/v1/auth/refresh  (con refresh_token como Bearer)
5. Obtener nuevo access_token y reintentar
6. POST /api/v1/auth/logout  →  invalida todos los refresh tokens
```
