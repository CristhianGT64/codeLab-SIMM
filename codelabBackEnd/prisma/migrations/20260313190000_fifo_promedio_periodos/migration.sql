-- Add valuation fields to inventory movements
ALTER TABLE "MovimientoInventario"
ADD COLUMN IF NOT EXISTS "metodo_valuacion_aplicado" "MetodoValuacion",
ADD COLUMN IF NOT EXISTS "costo_unitario" DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS "costo_total" DECIMAL(12,2);

-- Create global configuration table for inventory valuation method
CREATE TABLE IF NOT EXISTS "configuracion_sistema" (
  "id" BIGSERIAL NOT NULL,
  "metodo_valuacion_inventario" "MetodoValuacion" NOT NULL,
  "moneda_funcional" VARCHAR(10) NOT NULL,
  CONSTRAINT "configuracion_sistema_pkey" PRIMARY KEY ("id")
);

-- Backfill from legacy table when available
DO $$
BEGIN
  IF to_regclass('public."ConfiguracionContable"') IS NOT NULL THEN
    INSERT INTO "configuracion_sistema" ("metodo_valuacion_inventario", "moneda_funcional")
    SELECT c."metodo_valuacion", c."moneda_funcional"
    FROM "ConfiguracionContable" c
    WHERE NOT EXISTS (SELECT 1 FROM "configuracion_sistema");
  END IF;
END $$;

-- Ensure there is always one default configuration row
INSERT INTO "configuracion_sistema" ("metodo_valuacion_inventario", "moneda_funcional")
SELECT 'FIFO'::"MetodoValuacion", 'HNL'
WHERE NOT EXISTS (SELECT 1 FROM "configuracion_sistema");

-- Create accounting periods support used to block valuation method changes
DO $$
BEGIN
  CREATE TYPE "EstadoPeriodoContable" AS ENUM ('ABIERTO', 'CERRADO');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "periodo_contable" (
  "id" BIGSERIAL NOT NULL,
  "fecha_inicio" TIMESTAMP(3) NOT NULL,
  "fecha_fin" TIMESTAMP(3) NOT NULL,
  "estado" "EstadoPeriodoContable" NOT NULL DEFAULT 'ABIERTO',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "periodo_contable_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "periodo_contable_estado_idx" ON "periodo_contable"("estado");
