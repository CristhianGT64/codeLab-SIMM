/*
  Warnings:

  - The values [FACTURA,AJUSTE] on the enum `EnumTipoOperacionContable` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnumTipoOperacionContable_new" AS ENUM ('VENTA', 'INVENTARIO');
ALTER TABLE "ASIENTOS_CONTABLES" ALTER COLUMN "tipo_operacion" TYPE "EnumTipoOperacionContable_new" USING ("tipo_operacion"::text::"EnumTipoOperacionContable_new");
ALTER TABLE "REGLAS_CONTABLES" ALTER COLUMN "tipo_operacion" TYPE "EnumTipoOperacionContable_new" USING ("tipo_operacion"::text::"EnumTipoOperacionContable_new");
ALTER TYPE "EnumTipoOperacionContable" RENAME TO "EnumTipoOperacionContable_old";
ALTER TYPE "EnumTipoOperacionContable_new" RENAME TO "EnumTipoOperacionContable";
DROP TYPE "public"."EnumTipoOperacionContable_old";
COMMIT;
