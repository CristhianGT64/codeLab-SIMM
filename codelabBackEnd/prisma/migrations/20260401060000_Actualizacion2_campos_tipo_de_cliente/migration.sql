-- AlterTable: agregar campo dias_credito con valor por defecto 0
ALTER TABLE "TipoCliente" ADD COLUMN IF NOT EXISTS "dias_credito" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: hacer tipoClienteId obligatorio en Cliente
ALTER TABLE "Cliente" ALTER COLUMN "tipoClienteId" SET NOT NULL;
