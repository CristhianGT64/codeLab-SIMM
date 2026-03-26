/*
  Warnings:

  - You are about to drop the column `created_at` on the `Venta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_tipo_documento,id_establecimiento,id_punto_emision,id_cai,correlativo]` on the table `NumeroFactura` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "EstadoVenta" ADD VALUE 'pendiente';

-- DropIndex
DROP INDEX "NumeroFactura_id_tipo_documento_id_establecimiento_id_punto_key";

-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "importeExento" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "importeGravado15" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "importeGravado18" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "isv15" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "isv18" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "fecha_emision" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MovimientoInventario" ALTER COLUMN "fecha_movimiento" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NumeroFactura" ALTER COLUMN "correlativo" DROP DEFAULT;
DROP SEQUENCE "numerofactura_correlativo_seq";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "impuestoId" BIGINT;

-- AlterTable
ALTER TABLE "Venta" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Impuesto" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tasa" DECIMAL(5,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Impuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleFactura" (
    "id" BIGSERIAL NOT NULL,
    "facturaId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tasaImpuesto" DECIMAL(5,2) NOT NULL,
    "montoImpuesto" DECIMAL(10,2) NOT NULL,
    "tipoImpuesto" TEXT NOT NULL,

    CONSTRAINT "DetalleFactura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NumeroFactura_id_tipo_documento_id_establecimiento_id_punto_key" ON "NumeroFactura"("id_tipo_documento", "id_establecimiento", "id_punto_emision", "id_cai", "correlativo");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_impuestoId_fkey" FOREIGN KEY ("impuestoId") REFERENCES "Impuesto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Facturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
