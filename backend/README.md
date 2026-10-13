# FaunBol API (backend)

API REST de FaunBol hecha con NestJS 12, PostgreSQL, TypeORM y Swagger, organizada en **arquitectura limpia**. El contrato completo está en [`../docs/API.md`](../docs/API.md).

## Puesta en marcha

1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Crear la base de datos** (una sola vez) con [`database/create-database.sql`](database/create-database.sql):
   ```sql
   CREATE DATABASE animales_extincion_db;
   ```
3. **Configurar `.env`**: copia `.env.example` a `.env` y completa:
   - `DB_PASSWORD`: la contraseña de tu Postgres.
   - `JWT_SECRET`: un texto largo y aleatorio. Para generarlo:
     ```bash
     node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
     ```
   - `ADMIN_EMAIL` y `ADMIN_PASSWORD`: los datos del primer administrador.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`: las llaves de tu cuenta gratis de Cloudinary, en *Dashboard → API Keys*. Sin ellas la API funciona, pero subir fotos responde 503.
4. **Crear o actualizar las tablas**
   ```bash
   npm run migration:run
   ```
5. **Cargar los datos iniciales**: 12 ecorregiones, el admin y 10 especies en ES/EN. Se puede ejecutar más de una vez sin duplicar nada.
   ```bash
   npm run seed
   ```
6. **Levantar la API**
   ```bash
   npm run start:dev
   ```

Después de levantarla:
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs. Usa el botón **Authorize** con el `accessToken` de `POST /api/auth/login`.

> ⚠️ Las categorías UICN, las del Libro Rojo y las ecorregiones del seed (`src/database/seeds/`) deben **verificarse** en las fuentes oficiales antes de presentar.

## Arquitectura limpia

Cada módulo (`animals`, `ecoregions`, `users`) tiene 4 capas. Las dependencias apuntan siempre hacia el dominio:

```
animals/
├── domain/          # Entidad Animal (sin TypeORM ni Nest), enums, interfaz AnimalRepository
├── application/     # Casos de uso: CreateAnimal, UpdateAnimal, ListAnimals, UploadAnimalPhoto…
├── infrastructure/  # Entidad ORM, TypeOrmAnimalRepository (adaptador del repositorio)
├── presentation/    # Controller, DTOs con validación, respuestas para Swagger
└── animals.module.ts  # Composición: une cada puerto con su adaptador
shared/
├── domain/          # Errores de dominio, idiomas, puerto FileStorage
├── infrastructure/  # CloudinaryFileStorage (adaptador de FileStorage)
└── presentation/    # Filtro que traduce errores de dominio a HTTP y decorador de idioma
```

- **Dominio y aplicación no importan NestJS, TypeORM ni Cloudinary.** Los casos de uso son clases simples que reciben interfaces (puertos) por constructor.
- **Inversión de dependencias:** los casos de uso dependen de `AnimalRepository`, `FileStorage`, `PasswordHasher` y `TokenService`. Las implementaciones concretas (TypeORM, Cloudinary, bcrypt, JWT) se conectan en el `*.module.ts`. Cambiar Cloudinary por otro proveedor solo toca `StorageModule`.
- **Errores de dominio:** `NotFoundError`, `ConflictError`, `ForbiddenError`… no conocen HTTP. `DomainExceptionFilter` los traduce a 404, 409, 403… y agrega un `code` estable (`ACCOUNT_PENDING`, `SCIENTIFIC_NAME_TAKEN`…) para los frontends.

## Autenticación y roles

- Login con **JWT**, válido por 8 horas. Las contraseñas se guardan cifradas con **bcrypt**.
- El investigador se registra (`POST /api/auth/register`) y queda **PENDING**. El admin lo aprueba (**APPROVED**), lo rechaza con un motivo (**REJECTED**) o, más adelante, lo deshabilita (**DISABLED**).
- En cada petición se vuelve a leer al usuario desde la base, así que deshabilitarlo tiene efecto **inmediato**, sin esperar a que venza el token.
- `@Auth()` exige un token válido y `@Auth(UserRole.ADMIN)` además exige ese rol.

## Idiomas

Los textos de las especies y de las ecorregiones se guardan en español y en inglés; el inglés es opcional. Los endpoints públicos responden en el idioma de `?lang=es|en` o de `Accept-Language`, y si falta el inglés devuelven el español.

## Migraciones

```bash
npm run migration:generate -- src/database/migrations/NombreDelCambio
npm run migration:run
npm run migration:revert   # deshace la última
npm run migration:show     # estado
```
