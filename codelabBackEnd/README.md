# codelabBackEnd - Prisma migraciones y semillas

## Respuesta corta a tu duda
No. Si agregas datos manualmente en la base, tus archivos de semilla NO se actualizan solos.

Los archivos semilla son codigo estatico en el repositorio. Solo cambian cuando tu los editas.

## Como funciona el flujo
1. Migraciones
- Definen estructura: tablas, columnas, indices, llaves foraneas.
- Fuente de verdad: carpeta prisma/migrations.

2. Semillas
- Definen datos iniciales o demo.
- En este proyecto se ejecutan con prisma/seed.js.
- Se apoyan en:
  - prisma/seed_required_tables.sql
  - prisma/seed_business_tables.sql

## Comandos disponibles
- npm run db:migrate:status
  - Verifica sincronizacion entre schema y migraciones.

- npm run db:reset
  - Reinicia base de desarrollo y reaplica migraciones.
  - Elimina todos los datos.

- npm run db:seed:base
  - Ejecuta solo la semilla base.

- npm run db:seed:business
  - Ejecuta solo la semilla de negocio.

- npm run db:seed
  - Ejecuta base y luego negocio.

- npm run db:rebuild
  - Hace reset y luego seed completo.

- npm run dev:bootstrap
  - Hace rebuild y luego levanta el backend.

## Orden recomendado
1. npm install
2. npm run db:rebuild
3. npm run db:migrate:status
4. npm run start

## Cuando debes actualizar semillas
Debes editar los archivos de semilla cuando:
1. Quieres que nuevos datos queden versionados para todo el equipo.
2. Cambias el modelo y necesitas datos compatibles con nuevas columnas.
3. Necesitas que el entorno local se reconstruya siempre igual.

No necesitas editar semillas cuando:
1. Solo estas probando datos temporales en local.
2. Esos datos no deben vivir en el repositorio.

## Tip practico
Si insertas datos nuevos y quieres conservarlos como seed:
1. Copia esos registros a los SQL de seed (o a seed.js).
2. Manten INSERT idempotentes con ON CONFLICT.
3. Vuelve a correr npm run db:seed para validar.
