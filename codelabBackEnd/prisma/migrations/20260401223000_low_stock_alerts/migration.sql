-- AlterTable
ALTER TABLE "Producto"
ADD COLUMN "stock_minimo" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "alertas_inventario" (
    "id" BIGSERIAL NOT NULL,
    "producto_id" BIGINT NOT NULL,
    "inventario_id" BIGINT NOT NULL,
    "sucursal_id" BIGINT NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "mensaje" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resuelta_at" TIMESTAMP(3),

    CONSTRAINT "alertas_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alertas_inventario_inventario_id_key" ON "alertas_inventario"("inventario_id");

-- CreateIndex
CREATE INDEX "alertas_inventario_activa_idx" ON "alertas_inventario"("activa");

-- CreateIndex
CREATE INDEX "alertas_inventario_producto_id_idx" ON "alertas_inventario"("producto_id");

-- CreateIndex
CREATE INDEX "alertas_inventario_sucursal_id_idx" ON "alertas_inventario"("sucursal_id");

-- AddForeignKey
ALTER TABLE "alertas_inventario"
ADD CONSTRAINT "alertas_inventario_producto_id_fkey"
FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_inventario"
ADD CONSTRAINT "alertas_inventario_inventario_id_fkey"
FOREIGN KEY ("inventario_id") REFERENCES "Inventario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_inventario"
ADD CONSTRAINT "alertas_inventario_sucursal_id_fkey"
FOREIGN KEY ("sucursal_id") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
