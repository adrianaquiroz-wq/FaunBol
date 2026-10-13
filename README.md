# FaunBol

Plataforma web **educativa** sobre fauna boliviana en peligro de extinción. Tiene un catálogo público bilingüe (ES/EN) y una web administrativa donde investigadores aprobados registran especies con su foto.

> Proyecto con fines educativos y de conservación. **No** debe usarse para caza: nunca se publican ubicaciones exactas, solo departamentos y ecorregiones.

## Estructura (monorepo)

| Carpeta | Qué es | Puerto |
| --- | --- | --- |
| [`backend/`](backend/) | API REST con NestJS, PostgreSQL y TypeORM, organizada en arquitectura limpia | 3000 |
| [`web-public/`](web-public/) | Web pública con React, Vite y Tailwind | 5173 |
| [`web-admin/`](web-admin/) | Web administrativa con React, Vite y Tailwind | 5174 |
| [`docs/`](docs/) | Contrato de la API y documentación | — |

## Puesta en marcha

1. **Backend**: sigue las instrucciones de [`backend/README.md`](backend/README.md), que cubren la base de datos, el `.env`, las migraciones y el seed.
2. **Web pública**:
   ```bash
   cd web-public && npm install && npm run dev
   ```
3. **Web administrativa**:
   ```bash
   cd web-admin && npm install && npm run dev
   ```

| Servicio | URL |
| --- | --- |
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api/docs |
| Web pública | http://localhost:5173 |
| Web administrativa | http://localhost:5174 |

## Roles

| Acción | Visitante | Investigador | Admin |
| --- | --- | --- | --- |
| Ver el catálogo y las ecorregiones | Sí | Sí | Sí |
| Crear y editar especies y subir fotos | No | Sí | Sí |
| Eliminar especies | No | No | Sí |
| Aprobar, rechazar o deshabilitar investigadores | No | No | Sí |

Los investigadores se registran desde la web administrativa y quedan **pendientes** hasta que un admin los aprueba. El primer admin se crea con el seed.

## Fuentes

- **UICN / IUCN**: Lista Roja de Especies Amenazadas, en [iucnredlist.org](https://www.iucnredlist.org).
- **Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia**: MMAyA.
- **Ecorregiones de Bolivia**: Ibisch, P. L. y Mérida, G. (2003).
