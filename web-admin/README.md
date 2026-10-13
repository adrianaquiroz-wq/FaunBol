# FaunBol Admin

Panel de administración de **FaunBol** (fauna amenazada de Bolivia). Vite + React + TypeScript, Tailwind CSS v4, React Router, TanStack Query y react-i18next (español / inglés).

## Cómo ejecutar

```bash
cd web-admin
npm install
cp .env.example .env      # opcional: ajustar la URL de la API
npm run dev               # http://localhost:5174
```

Otros comandos: `npm run build` (compila a `dist/`), `npm run preview`, `npm run lint`.

La API (NestJS, carpeta `backend/`) debe estar en ejecución. Si no responde, el panel muestra mensajes de error y botones de reintento.

## Variable de entorno

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de la API de FaunBol |

## Sesión

- `POST /auth/login` devuelve un JWT que se guarda en `localStorage` y se envía como `Authorization: Bearer <token>`.
- Al abrir la app se restaura la sesión con `GET /auth/me`.
- Cualquier respuesta 401 cierra la sesión y redirige a `/login`.
- Los investigadores se registran en `/registro`; su cuenta queda **pendiente** hasta que un administrador la apruebe.

## Roles

| Rol | Qué ve |
| --- | --- |
| **ADMIN** | Especies (listar, crear, editar, subir/quitar foto, **eliminar**) y **Usuarios** (aprobar, rechazar con motivo, deshabilitar investigadores; insignia con el número de pendientes). |
| **RESEARCHER** | Solo Especies: listar, crear, editar y gestionar fotos. No ve el menú Usuarios ni el botón "Eliminar"; las rutas `/usuarios` lo redirigen a `/especies`. |

## Rutas

- `/login`, `/registro` (públicas)
- `/especies`, `/especies/nueva`, `/especies/:id/editar`
- `/usuarios` (solo ADMIN)

## Estructura

```
src/
  api/          cliente HTTP tipado (contrato de docs/API.md)
  auth/         contexto de sesión y guardas de rutas
  components/   layout, tabla/paginación, modal, toasts, formulario de especie, fotos
  i18n/         es.json, en.json
  lib/          utilidades (errores, colores UICN, formulario)
  pages/        páginas
```
