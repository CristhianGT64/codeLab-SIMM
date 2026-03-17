# Guia de migraciones Prisma

Este documento define una forma limpia y consistente de trabajar migraciones en equipo.

## Objetivo

- Mantener historial claro y auditable.
- Evitar conflictos entre ramas y ambientes.
- Reducir errores por cambios manuales en migraciones antiguas.

## Reglas del equipo

- Crear migraciones pequenas y enfocadas (una HU o cambio tecnico por migracion).
- No editar migraciones ya aplicadas en ambientes compartidos.
- Tratar `prisma/schema.prisma` como fuente de verdad.
- Separar estructura (migraciones) de datos semilla (`prisma/seed.js`).
- Si hay que corregir algo, crear una migracion nueva, no reescribir una antigua.

## Convencion de nombres

Usar nombres descriptivos en snake_case al crear la migracion.

Plantilla sugerida:

`<modulo>_<accion>_<detalle>`

Ejemplos:

- `usuario_add_username_softdelete`
- `inventario_add_movimientos`
- `security_add_role_permission_relation`
- `producto_add_imagen_archivo`

Reglas de nombre:

- Sin acentos ni caracteres especiales.
- Sin prefijo de fecha manual (Prisma ya agrega timestamp).
- Maximo 5-7 palabras.

## Flujo diario en desarrollo (local)

1. Actualizar rama y traer cambios recientes.
2. Modificar `prisma/schema.prisma`.
3. Crear migracion con nombre descriptivo:

```powershell
npx prisma migrate dev --name <nombre_migracion>
```

4. Revisar SQL generado en `prisma/migrations/*/migration.sql`.
5. Probar endpoints/casos afectados.
6. Commit de `schema.prisma` + carpeta de migracion.

Scripts npm disponibles:

```powershell
npm run db:migrate:dev
npm run db:migrate:status
npm run db:generate
```

Nota: `db:migrate:dev` es para entorno de desarrollo.

## Flujo para staging/produccion

No se usa `migrate dev` en produccion. Se usa `deploy`.

```powershell
npm run db:migrate:deploy
```

Proceso recomendado:

1. CI ejecuta build y tests.
2. Se despliega aplicacion.
3. Se ejecuta `prisma migrate deploy`.
4. Se valida salud de la app y consultas criticas.

## Cuando hacer squash de migraciones

Hacer squash solo si TODAVIA no se aplicaron en ambientes compartidos.

Casos validos:

- Rama de feature larga con demasiadas migraciones pequenas.
- Proyecto en etapa inicial sin despliegue productivo.

Evitar squash cuando ya existe historial aplicado en staging/produccion.

## Checklist antes de merge

- El nombre de migracion describe claramente el cambio.
- El SQL generado coincide con la intencion funcional.
- No se editaron migraciones historicas ya aplicadas.
- `prisma migrate status` no reporta drift inesperado.
- Seeds no mezclan cambios estructurales.

## Anti-patrones a evitar

- Una sola migracion gigante para multiples modulos.
- Renombrar o borrar carpetas de migraciones ya versionadas.
- Cambiar manualmente migraciones antiguas para "arreglar" errores.
- Ejecutar `migrate reset` fuera de desarrollo local.
