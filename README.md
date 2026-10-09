# FaunBol API

API REST **educativa y de conservación** sobre fauna boliviana en peligro de extinción.

> ⚠️ Este proyecto es con fines educativos y de conservación. **No** debe usarse para caza.
> Por eso la distribución de cada especie se registra solo a nivel general (departamentos), nunca con ubicaciones exactas ni coordenadas.

**Fuentes oficiales**
- **UICN / IUCN**: Unión Internacional para la Conservación de la Naturaleza, Lista Roja ([iucnredlist.org](https://www.iucnredlist.org)).
- **Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia**: Ministerio de Medio Ambiente y Agua (MMAyA).

## Stack

- NestJS 12 + TypeScript
- PostgreSQL + TypeORM (con migraciones)
- Swagger (OpenAPI)

## Puesta en marcha

1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Crear la base de datos** (una sola vez), con psql o pgAdmin, usando el script `database/create-database.sql`:
   ```sql
   CREATE DATABASE animales_extincion_db;
   ```
3. **Configurar variables de entorno**: copia `.env.example` a `.env` (si no existe) y completa `DB_PASSWORD`.
4. **Crear las tablas**
   ```bash
   npm run migration:run
   ```
5. **Cargar datos iniciales** (10 especies bolivianas; se puede ejecutar varias veces sin duplicar)
   ```bash
   npm run seed
   ```
6. **Levantar la API**
   ```bash
   npm run start:dev
   ```

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs

> ⚠️ Las categorías de conservación del seed (`src/database/seeds/animals.seed-data.ts`) deben **verificarse** en la Lista Roja de la UICN y en el Libro Rojo de Bolivia antes de presentar el proyecto, porque las evaluaciones se actualizan periódicamente.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/animals` | Registrar un animal |
| `GET` | `/api/animals` | Listar (paginado, con búsqueda y filtros) |
| `GET` | `/api/animals/:id` | Obtener un animal |
| `PATCH` | `/api/animals/:id` | Actualizar parcialmente |
| `DELETE` | `/api/animals/:id` | Eliminar (soft delete) |

Parámetros de `GET /api/animals`: `page` (por defecto 1), `limit` (por defecto 10, máximo 100), `search` (nombre común o científico), `iucnStatus` y `animalClass`.

Respuestas de error: `400` (datos inválidos o id que no es UUID), `404` (no encontrado), `409` (nombre científico duplicado).

### Categorías de conservación (UICN y Libro Rojo de Bolivia)

| Sigla | Significado |
|---|---|
| `LC` | Preocupación menor |
| `NT` | Casi amenazado |
| `VU` | Vulnerable |
| `EN` | En peligro |
| `CR` | En peligro crítico |
| `EW` | Extinto en estado silvestre |
| `EX` | Extinto |
| `DD` | Datos insuficientes |

## Migraciones

Al cambiar una entidad, genera una nueva migración y aplícala:

```bash
npm run migration:generate -- src/database/migrations/NombreDelCambio
npm run migration:run
```

Otros comandos: `npm run migration:revert` (deshace la última) y `npm run migration:show` (estado).

## Estructura

```
src/
├── animals/
│   ├── dto/            # create, update, query y respuesta paginada
│   ├── entities/       # entidad Animal (tabla animals)
│   ├── enums/          # categorías UICN, clase, tendencia poblacional
│   ├── animals.controller.ts
│   ├── animals.service.ts
│   └── animals.module.ts
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── data-source.ts  # conexión compartida por la app, el CLI y el seed
├── app.module.ts
└── main.ts             # prefijo /api, validación, CORS y Swagger
```
