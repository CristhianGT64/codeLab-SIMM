/*
  Warnings:

  - You are about to drop the `_ProductoProveedor` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_at` on table `MovimientoInventario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuarioId` on table `MovimientoInventario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_ProductoProveedor" DROP CONSTRAINT "_ProductoProveedor_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductoProveedor" DROP CONSTRAINT "_ProductoProveedor_B_fkey";

-- AlterTable
ALTER TABLE "MovimientoInventario" ADD COLUMN     "motivo" VARCHAR(255),
ADD COLUMN     "proveedorId" BIGINT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "usuarioId" SET NOT NULL;

-- DropTable
DROP TABLE "_ProductoProveedor";

-- CreateTable
CREATE TABLE "producto_proveedor" (
    "productoId" BIGINT NOT NULL,
    "proveedorId" BIGINT NOT NULL,

    CONSTRAINT "producto_proveedor_pkey" PRIMARY KEY ("productoId","proveedorId")
);

-- CreateIndex
CREATE INDEX "producto_proveedor_proveedorId_idx" ON "producto_proveedor"("proveedorId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_productoId_idx" ON "MovimientoInventario"("productoId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_sucursalId_idx" ON "MovimientoInventario"("sucursalId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_usuarioId_idx" ON "MovimientoInventario"("usuarioId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_proveedorId_idx" ON "MovimientoInventario"("proveedorId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_created_at_idx" ON "MovimientoInventario"("created_at");

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_proveedor" ADD CONSTRAINT "producto_proveedor_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_proveedor" ADD CONSTRAINT "producto_proveedor_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
