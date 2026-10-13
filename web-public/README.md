# FaunBol · Sitio público

Catálogo educativo y bilingüe (español/inglés) de la fauna amenazada de Bolivia.
Proyecto universitario de la materia **Tecnologías Web 2**.

Consume la API de `../backend` (contrato en `../docs/API.md`), solo los endpoints públicos.

## Tecnologías

- Vite + React + TypeScript (modo estricto)
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens con `@theme` en `src/index.css`)
- React Router · TanStack Query · i18next / react-i18next

## Cómo ejecutar

```bash
npm install
cp .env.example .env   # opcional: por defecto usa http://localhost:3000/api
npm run dev            # http://localhost:5173
```

Variable de entorno:

| Variable       | Por defecto                 | Descripción             |
| -------------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de la API REST |

Otros scripts: `npm run build` (compilación de producción en `dist/`), `npm run preview`, `npm run lint`.

Si la API no está disponible, el sitio muestra mensajes de error con un botón «Reintentar».

## Rutas

| Ruta             | Página                                                        |
| ---------------- | ------------------------------------------------------------- |
| `/`              | Inicio: portada, estadísticas y especies destacadas           |
| `/especies`      | Catálogo con búsqueda, filtros y paginación (en la URL)       |
| `/especies/:id`  | Ficha de la especie                                           |
| `/ecorregiones`  | Las 12 ecorregiones de Bolivia                                |
| `/acerca`        | Acerca del proyecto, categorías UICN, fuentes y aviso         |

Ejemplo de enlace directo: `/especies?ecoregion=yungas&iucnStatus=EN&page=2`.

## Estructura

```
src/
├── api/          cliente HTTP tipado, tipos del contrato y hooks de TanStack Query
├── components/   componentes reutilizables (Header, Footer, IucnChip, AnimalCard…)
├── i18n/         configuración de i18next y traducciones es.json / en.json
├── lib/          utilidades (colores UICN, título del documento, almacenamiento…)
├── pages/        una página por ruta
├── App.tsx       definición de rutas
├── main.tsx      punto de entrada
└── index.css     Tailwind + tokens de diseño ("guía de campo")
```

El idioma elegido (ES | EN) se guarda en `localStorage`; por defecto, español.
Todas las peticiones envían `lang` con el idioma actual.

## Aviso

FaunBol es un proyecto exclusivamente educativo. Las ubicaciones se muestran de forma
general (departamentos y ecorregiones), nunca exacta. No debe usarse para cazar ni
comercializar fauna silvestre.
