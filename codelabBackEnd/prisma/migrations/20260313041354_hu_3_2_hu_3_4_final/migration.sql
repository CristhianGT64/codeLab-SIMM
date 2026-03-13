/*
  Warnings:

  - You are about to drop the column `motivo` on the `MovimientoInventario` table. All the data in the column will be lost.
  - Added the required column `fecha_movimiento` to the `MovimientoInventario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_resultante` to the `MovimientoInventario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubtipoEntradaInventario" AS ENUM ('PRODUCTO_NUEVO', 'REABASTECIMIENTO');

-- CreateEnum
CREATE TYPE "MotivoSalidaInventario" AS ENUM ('VENTA', 'DANIO', 'CONSUMO_INTERNO', 'AJUSTE', 'OTRO');

-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_usuarioId_fkey";

-- DropIndex
DROP INDEX "MovimientoInventario_created_at_idx";

-- AlterTable
ALTER TABLE "MovimientoInventario" DROP COLUMN "motivo",
ADD COLUMN     "detalle_motivo" VARCHAR(255),
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'completado',
ADD COLUMN     "fecha_movimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "motivo_salida" "MotivoSalidaInventario",
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "stock_resultante" INTEGER NOT NULL,
ADD COLUMN     "subtipo_entrada" "SubtipoEntradaInventario",
ALTER COLUMN "usuarioId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "MovimientoInventario_fecha_movimiento_idx" ON "MovimientoInventario"("fecha_movimiento");

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
