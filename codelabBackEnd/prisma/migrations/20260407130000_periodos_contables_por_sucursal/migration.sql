ALTER TABLE "periodo_contable"
ADD COLUMN IF NOT EXISTS "sucursal_id" BIGINT,
ADD COLUMN IF NOT EXISTS "fecha_cierre" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "usuario_cierre" BIGINT;

UPDATE "periodo_contable"
SET "sucursal_id" = (
  SELECT id
  FROM "Sucursal"
  ORDER BY id ASC
  LIMIT 1
)
WHERE "sucursal_id" IS NULL;

ALTER TABLE "periodo_contable"
ALTER COLUMN "sucursal_id" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'periodo_contable_sucursal_id_fkey'
  ) THEN
    ALTER TABLE "periodo_contable"
    ADD CONSTRAINT "periodo_contable_sucursal_id_fkey"
    FOREIGN KEY ("sucursal_id") REFERENCES "Sucursal"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'periodo_contable_usuario_cierre_fkey'
  ) THEN
    ALTER TABLE "periodo_contable"
    ADD CONSTRAINT "periodo_contable_usuario_cierre_fkey"
    FOREIGN KEY ("usuario_cierre") REFERENCES "Usuario"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "periodo_contable_sucursal_id_idx"
ON "periodo_contable"("sucursal_id");

CREATE INDEX IF NOT EXISTS "periodo_contable_estado_idx"
ON "periodo_contable"("estado");

CREATE INDEX IF NOT EXISTS "periodo_contable_sucursal_id_fecha_inicio_fecha_fin_idx"
ON "periodo_contable"("sucursal_id", "fecha_inicio", "fecha_fin");
