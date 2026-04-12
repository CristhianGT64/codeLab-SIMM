CREATE TYPE "TipoAjusteInventario" AS ENUM ('PERDIDA', 'DETERIORO', 'SOBRANTE');

ALTER TABLE "MovimientoInventario"
ADD COLUMN "tipo_ajuste" "TipoAjusteInventario";

CREATE INDEX "MovimientoInventario_tipo_ajuste_idx"
ON "MovimientoInventario"("tipo_ajuste");
