# FaunBol API v0.2 – Contrato

Base URL: `http://localhost:3000/api` · Swagger: `http://localhost:3000/api/docs`

## Convenciones

- **Idioma**: los endpoints públicos aceptan `?lang=es|en` (o la cabecera `Accept-Language`). Si falta el texto en inglés, se devuelve el español.
- **Autenticación**: cabecera `Authorization: Bearer <accessToken>`. El token dura 8 h.
- **Errores**: siempre con esta forma:
  ```json
  { "statusCode": 403, "error": "FORBIDDEN", "message": "…", "code": "ACCOUNT_PENDING", "details": { } }
  ```
  `code` y `details` son opcionales. Los errores de validación (400) traen `message` como arreglo de strings.

## Enums

| Enum | Valores |
| --- | --- |
| `ConservationStatus` | `LC` `NT` `VU` `EN` `CR` `EW` `EX` `DD` |
| `AnimalClass` | `MAMMAL` `BIRD` `REPTILE` `AMPHIBIAN` `FISH` |
| `PopulationTrend` | `INCREASING` `STABLE` `DECREASING` `UNKNOWN` |
| `UserRole` | `ADMIN` `RESEARCHER` |
| `UserStatus` | `PENDING` `APPROVED` `REJECTED` `DISABLED` |

## Especies (públicos)

### `GET /animals`
Query: `page` (1), `limit` (12, máx. 100), `search`, `iucnStatus`, `animalClass`, `ecoregion` (code), `lang`.
```json
{
  "data": [AnimalResponse],
  "total": 10, "page": 1, "limit": 12, "totalPages": 1
}
```

### `GET /animals/stats`
```json
{ "total": 10, "byIucnStatus": { "LC": 0, "NT": 1, "VU": 3, "EN": 5, "CR": 1, "EW": 0, "EX": 0, "DD": 0 } }
```

### `GET /animals/:id`
Devuelve `AnimalResponse`; responde 404 si no existe.

**AnimalResponse**
```json
{
  "id": "uuid",
  "commonName": "Jaguar",
  "scientificName": "Panthera onca",
  "animalClass": "MAMMAL",
  "description": "texto o null",
  "iucnStatus": "NT",
  "boliviaRedBookStatus": "VU",
  "threats": "texto o null",
  "populationTrend": "DECREASING",
  "estimatedPopulation": null,
  "habitat": "Bosques tropicales…",
  "distribution": "Beni, Pando, Santa Cruz",
  "sourceReference": "UICN Lista Roja; Libro Rojo…",
  "photo": { "url": "https://…", "thumbnailUrl": "https://… (600x450)", "credit": "texto o null" },
  "ecoregions": [{ "id": "uuid", "code": "yungas", "name": "Yungas" }],
  "createdAt": "ISO", "updatedAt": "ISO"
}
```
`photo` puede ser `null`.

## Ecorregiones (públicos)

- `GET /ecoregions` → `EcoregionResponse[]`, ordenadas.
- `GET /ecoregions/:code` → `EcoregionResponse` (404 si no existe).

```json
{ "id": "uuid", "code": "puna-nortena", "name": "Puna norteña", "description": "…", "animalCount": 4 }
```

## Autenticación

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | `{ fullName, email, password (8–72), institution, requestReason? }` | 201 `UserResponse` (status `PENDING`) · 409 `EMAIL_TAKEN` |
| `POST` | `/auth/login` | `{ email, password }` | 200 `{ accessToken, user: UserResponse }` |
| `GET` | `/auth/me` | — (token) | `UserResponse` |

Errores de login:
- 401 `INVALID_CREDENTIALS`.
- 403 `ACCOUNT_PENDING`.
- 403 `ACCOUNT_REJECTED`, con `details.reason`, que puede ser null.
- 403 `ACCOUNT_DISABLED`.

Con un token inválido o vencido, cualquier ruta protegida responde 401 `INVALID_TOKEN` o `MISSING_TOKEN`. Si el rol no alcanza, responde 403 `INSUFFICIENT_ROLE`.

**UserResponse**
```json
{ "id": "uuid", "fullName": "…", "email": "…", "institution": "…", "requestReason": null,
  "role": "RESEARCHER", "status": "PENDING", "rejectionReason": null, "createdAt": "ISO" }
```

## Especies (investigador y admin)

| Método | Ruta | Rol | Notas |
| --- | --- | --- | --- |
| `GET` | `/animals/:id/full` | RESEARCHER, ADMIN | `AnimalFullResponse` (los dos idiomas, para editar) |
| `POST` | `/animals` | RESEARCHER, ADMIN | cuerpo `AnimalInput` → 201 `AnimalFullResponse`; 409 `SCIENTIFIC_NAME_TAKEN`; 400 `UNKNOWN_ECOREGION` |
| `PATCH` | `/animals/:id` | RESEARCHER, ADMIN | `AnimalInput` parcial; `null` borra un campo opcional |
| `POST` | `/animals/:id/photo` | RESEARCHER, ADMIN | `multipart/form-data`: `file` (JPG, PNG o WEBP, ≤ 5 MB) + `photoCredit?` → `AnimalFullResponse`; 400 `PHOTO_REQUIRED`, `PHOTO_INVALID_TYPE` o `PHOTO_TOO_LARGE`; 503 `STORAGE_NOT_CONFIGURED` |
| `DELETE` | `/animals/:id/photo` | RESEARCHER, ADMIN | → `AnimalFullResponse` |
| `DELETE` | `/animals/:id` | **ADMIN** | 204 (soft delete) |

**AnimalInput** (requeridos: `commonNameEs`, `scientificName`, `animalClass`, `iucnStatus`, `habitatEs`, `distribution`, `sourceReference`)
```json
{
  "commonNameEs": "Jaguar", "commonNameEn": "Jaguar",
  "scientificName": "Panthera onca", "animalClass": "MAMMAL",
  "descriptionEs": "…", "descriptionEn": "…",
  "iucnStatus": "NT", "boliviaRedBookStatus": "VU",
  "threatsEs": "…", "threatsEn": "…",
  "populationTrend": "DECREASING", "estimatedPopulation": 5000,
  "habitatEs": "…", "habitatEn": "…",
  "distribution": "Beni, Pando", "sourceReference": "…",
  "ecoregionIds": ["uuid", "uuid"]
}
```

**AnimalFullResponse**: los mismos campos base de `AnimalResponse` (`id`, `scientificName`, `animalClass`, `iucnStatus`, `boliviaRedBookStatus`, `populationTrend`, `estimatedPopulation`, `distribution`, `sourceReference`, `photo`, `createdAt`, `updatedAt`), más `commonNameEs/En`, `descriptionEs/En`, `threatsEs/En`, `habitatEs/En` y `ecoregionIds: string[]`.

## Usuarios (solo ADMIN)

| Método | Ruta | Cuerpo | Notas |
| --- | --- | --- | --- |
| `GET` | `/users?status=&role=` | — | `UserResponse[]`, los más nuevos primero |
| `PATCH` | `/users/:id/approve` | — | solo desde `PENDING`; si no, 409 `INVALID_USER_STATUS` |
| `PATCH` | `/users/:id/reject` | `{ reason? }` | solo desde `PENDING` |
| `PATCH` | `/users/:id/disable` | — | solo desde `APPROVED` |

Las cuentas de administrador no se pueden revisar: responde 403 `NOT_A_RESEARCHER`.
