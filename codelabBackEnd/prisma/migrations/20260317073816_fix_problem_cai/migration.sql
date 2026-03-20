/*
  Warnings:

  - The primary key for the `Cai` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cai` on the `Cai` table. All the data in the column will be lost.
  - You are about to drop the column `costo_total` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `costo_unitario` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_motivo` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_movimiento` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `metodo_valuacion_aplicado` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `motivo_salida` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `observaciones` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `proveedorId` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `stock_resultante` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `subtipo_entrada` on the `MovimientoInventario` table. All the data in the column will be lost.
  - You are about to drop the column `id_cai` on the `NumeroFactura` table. All the data in the column will be lost.
  - You are about to drop the column `id_establecimiento` on the `NumeroFactura` table. All the data in the column will be lost.
  - You are about to drop the column `id_punto_emision` on the `NumeroFactura` table. All the data in the column will be lost.
  - You are about to drop the column `id_tipo_documento` on the `NumeroFactura` table. All the data in the column will be lost.
  - The primary key for the `RangoEmision` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `final_rango` on the `RangoEmision` table. All the data in the column will be lost.
  - You are about to drop the column `id_cai` on the `RangoEmision` table. All the data in the column will be lost.
  - You are about to drop the column `id_rango_emision` on the `RangoEmision` table. All the data in the column will be lost.
  - You are about to drop the column `inicio_rango` on the `RangoEmision` table. All the data in the column will be lost.
  - You are about to drop the `Establecimientos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Facturas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PuntosEmision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TiposDocumentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `configuracion_sistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `establecimiento_tipo_documeto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `periodo_contable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producto_proveedor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tipoDocumentoId,establecimientoId,puntoEmisionId,correlativo]` on the table `NumeroFactura` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `establecimientoId` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntoEmisionId` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDocumentoId` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fin` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicio` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey

-- DropForeignKey
ALTER TABLE "Establecimientos" DROP CONSTRAINT "Establecimientos_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "Facturas_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "Facturas_numero_formateado_fkey";

-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "Facturas_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "Facturas_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "Facturas_ventaId_fkey";

-- DropForeignKey
ALTER TABLE "Inventario" DROP CONSTRAINT "Inventario_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_proveedorId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "NumeroFactura" DROP CONSTRAINT "NumeroFactura_id_cai_fkey";

-- DropForeignKey
ALTER TABLE "NumeroFactura" DROP CONSTRAINT "NumeroFactura_id_tipo_documento_id_establecimiento_id_punt_fkey";

-- DropForeignKey
ALTER TABLE "PuntosEmision" DROP CONSTRAINT "PuntosEmision_id_establecimiento_id_tipo_documento_fkey";

-- DropForeignKey
ALTER TABLE "PuntosEmision" DROP CONSTRAINT "PuntosEmision_id_rango_emision_fkey";

-- DropForeignKey
ALTER TABLE "RangoEmision" DROP CONSTRAINT "RangoEmision_id_cai_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "establecimiento_tipo_documeto" DROP CONSTRAINT "establecimiento_tipo_documeto_id_establecimiento_fkey";

-- DropForeignKey
ALTER TABLE "establecimiento_tipo_documeto" DROP CONSTRAINT "establecimiento_tipo_documeto_id_tipo_documento_fkey";

-- DropForeignKey
ALTER TABLE "producto_proveedor" DROP CONSTRAINT "producto_proveedor_productoId_fkey";

-- DropForeignKey
ALTER TABLE "producto_proveedor" DROP CONSTRAINT "producto_proveedor_proveedorId_fkey";

-- DropIndex
DROP INDEX "MovimientoInventario_fecha_movimiento_idx";

-- DropIndex
DROP INDEX "MovimientoInventario_productoId_idx";

-- DropIndex
DROP INDEX "MovimientoInventario_proveedorId_idx";

-- DropIndex
DROP INDEX "MovimientoInventario_sucursalId_idx";

-- DropIndex
DROP INDEX "MovimientoInventario_usuarioId_idx";

-- DropIndex
DROP INDEX "NumeroFactura_id_tipo_documento_id_establecimiento_id_punto_key";

-- DropIndex
DROP INDEX "RangoEmision_final_rango_key";

-- DropIndex
DROP INDEX "RangoEmision_id_cai_key";

-- DropIndex
DROP INDEX "RangoEmision_inicio_rango_key";

-- AlterTable
ALTER TABLE "Cai" DROP CONSTRAINT "Cai_pkey",
DROP COLUMN "id_cai",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "fecha_inicio" DROP NOT NULL,
ALTER COLUMN "fecha_fin" DROP NOT NULL,
ADD CONSTRAINT "Cai_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MovimientoInventario" DROP COLUMN "costo_total",
DROP COLUMN "costo_unitario",
DROP COLUMN "detalle_motivo",
DROP COLUMN "estado",
DROP COLUMN "fecha_movimiento",
DROP COLUMN "metodo_valuacion_aplicado",
DROP COLUMN "motivo_salida",
DROP COLUMN "observaciones",
DROP COLUMN "proveedorId",
DROP COLUMN "stock_resultante",
DROP COLUMN "subtipo_entrada",
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "NumeroFactura" DROP COLUMN "id_cai",
DROP COLUMN "id_establecimiento",
DROP COLUMN "id_punto_emision",
DROP COLUMN "id_tipo_documento",
ADD COLUMN     "caiId" BIGINT,
ADD COLUMN     "establecimientoId" BIGINT NOT NULL,
ADD COLUMN     "puntoEmisionId" BIGINT NOT NULL,
ADD COLUMN     "tipoDocumentoId" BIGINT NOT NULL,
ADD COLUMN     "usado" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "correlativo" DROP DEFAULT;
DROP SEQUENCE "numerofactura_correlativo_seq";

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RangoEmision" DROP CONSTRAINT "RangoEmision_pkey",
DROP COLUMN "final_rango",
DROP COLUMN "id_cai",
DROP COLUMN "id_rango_emision",
DROP COLUMN "inicio_rango",
ADD COLUMN     "fin" INTEGER NOT NULL,
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD COLUMN     "inicio" INTEGER NOT NULL,
ADD CONSTRAINT "RangoEmision_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Establecimientos";

-- DropTable
DROP TABLE "Facturas";

-- DropTable
DROP TABLE "PuntosEmision";

-- DropTable
DROP TABLE "TiposDocumentos";

-- DropTable
DROP TABLE "configuracion_sistema";

-- DropTable
DROP TABLE "establecimiento_tipo_documeto";

-- DropTable
DROP TABLE "periodo_contable";

-- DropTable
DROP TABLE "producto_proveedor";

-- DropEnum
DROP TYPE "EstadoPeriodoContable";

-- DropEnum
DROP TYPE "MotivoSalidaInventario";

-- DropEnum
DROP TYPE "SubtipoEntradaInventario";

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "id" BIGSERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "disponible" BOOLEAN NOT NULL,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Establecimiento" (
    "id" BIGSERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "tipoDocumentoId" BIGINT NOT NULL,
    "sucursalId" BIGINT NOT NULL,

    CONSTRAINT "Establecimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntoEmision" (
    "id" BIGSERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "tipoDocumentoId" BIGINT NOT NULL,
    "establecimientoId" BIGINT NOT NULL,
    "rangoEmisionId" BIGINT,

    CONSTRAINT "PuntoEmision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" BIGSERIAL NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuesto" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "numeroFacturaId" BIGINT NOT NULL,
    "ventaId" BIGINT,
    "clienteId" BIGINT,
    "usuarioId" BIGINT,
    "sucursalId" BIGINT,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionContable" (
    "id" BIGSERIAL NOT NULL,
    "metodo_valuacion" "MetodoValuacion" NOT NULL,
    "moneda_funcional" VARCHAR(10) NOT NULL,

    CONSTRAINT "ConfiguracionContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductoProveedor" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ProductoProveedor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_numero_key" ON "TipoDocumento"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_nombre_key" ON "TipoDocumento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Establecimiento_numero_tipoDocumentoId_key" ON "Establecimiento"("numero", "tipoDocumentoId");

-- CreateIndex
CREATE UNIQUE INDEX "PuntoEmision_numero_establecimientoId_key" ON "PuntoEmision"("numero", "establecimientoId");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numeroFacturaId_key" ON "Factura"("numeroFacturaId");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_ventaId_key" ON "Factura"("ventaId");

-- CreateIndex
CREATE INDEX "_ProductoProveedor_B_index" ON "_ProductoProveedor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "NumeroFactura_tipoDocumentoId_establecimientoId_puntoEmisio_key" ON "NumeroFactura"("tipoDocumentoId", "establecimientoId", "puntoEmisionId", "correlativo");

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoProveedor" ADD CONSTRAINT "_ProductoProveedor_A_fkey" FOREIGN KEY ("A") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoProveedor" ADD CONSTRAINT "_ProductoProveedor_B_fkey" FOREIGN KEY ("B") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
