/*
  Warnings:

  - The primary key for the `Cai` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Cai` table. All the data in the column will be lost.
  - You are about to drop the column `caiId` on the `NumeroFactura` table. All the data in the column will be lost.
  - You are about to drop the column `establecimientoId` on the `NumeroFactura` table. All the data in the column will be lost.
  - You are about to drop the column `puntoEmisionId` on the `NumeroFactura` table. All the data in the column will be lost.
  - You are about to drop the column `tipoDocumentoId` on the `NumeroFactura` table. All the data in the column will be lost.
  - You are about to drop the column `usado` on the `NumeroFactura` table. All the data in the column will be lost.
  - The primary key for the `RangoEmision` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fin` on the `RangoEmision` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `RangoEmision` table. All the data in the column will be lost.
  - You are about to drop the column `inicio` on the `RangoEmision` table. All the data in the column will be lost.
  - You are about to drop the `ConfiguracionContable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Establecimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Factura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PuntoEmision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoDocumento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductoProveedor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_tipo_documento,id_establecimiento,id_punto_emision,correlativo]` on the table `NumeroFactura` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inicio_rango]` on the table `RangoEmision` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[final_rango]` on the table `RangoEmision` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_cai]` on the table `RangoEmision` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fecha_inicio` on table `Cai` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_fin` on table `Cai` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fecha_movimiento` to the `MovimientoInventario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_resultante` to the `MovimientoInventario` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `MovimientoInventario` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_cai` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_establecimiento` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_punto_emision` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tipo_documento` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `final_rango` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cai` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicio_rango` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPeriodoContable" AS ENUM ('ABIERTO', 'CERRADO');

-- CreateEnum
CREATE TYPE "MotivoSalidaInventario" AS ENUM ('VENTA', 'DANIO', 'CONSUMO_INTERNO', 'AJUSTE', 'OTRO');

-- CreateEnum
CREATE TYPE "SubtipoEntradaInventario" AS ENUM ('PRODUCTO_NUEVO', 'REABASTECIMIENTO');

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductoProveedor" DROP CONSTRAINT "_ProductoProveedor_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductoProveedor" DROP CONSTRAINT "_ProductoProveedor_B_fkey";

-- DropIndex
DROP INDEX "NumeroFactura_tipoDocumentoId_establecimientoId_puntoEmisio_key";

-- AlterTable
ALTER TABLE "Cai" DROP CONSTRAINT "Cai_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_cai" BIGSERIAL NOT NULL,
ALTER COLUMN "fecha_inicio" SET NOT NULL,
ALTER COLUMN "fecha_fin" SET NOT NULL,
ADD CONSTRAINT "Cai_pkey" PRIMARY KEY ("id_cai");

-- AlterTable
ALTER TABLE "MovimientoInventario" ADD COLUMN     "costo_total" DECIMAL(12,2),
ADD COLUMN     "costo_unitario" DECIMAL(10,2),
ADD COLUMN     "detalle_motivo" VARCHAR(255),
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'completado',
ADD COLUMN     "fecha_movimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "metodo_valuacion_aplicado" "MetodoValuacion",
ADD COLUMN     "motivo_salida" "MotivoSalidaInventario",
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "proveedorId" BIGINT,
ADD COLUMN     "stock_resultante" INTEGER NOT NULL,
ADD COLUMN     "subtipo_entrada" "SubtipoEntradaInventario",
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
CREATE SEQUENCE numerofactura_correlativo_seq;
ALTER TABLE "NumeroFactura" DROP COLUMN "caiId",
DROP COLUMN "establecimientoId",
DROP COLUMN "puntoEmisionId",
DROP COLUMN "tipoDocumentoId",
DROP COLUMN "usado",
ADD COLUMN     "id_cai" BIGINT NOT NULL,
ADD COLUMN     "id_establecimiento" BIGINT NOT NULL,
ADD COLUMN     "id_punto_emision" BIGINT NOT NULL,
ADD COLUMN     "id_tipo_documento" BIGINT NOT NULL,
ALTER COLUMN "correlativo" SET DEFAULT nextval('numerofactura_correlativo_seq');
ALTER SEQUENCE numerofactura_correlativo_seq OWNED BY "NumeroFactura"."correlativo";

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RangoEmision" DROP CONSTRAINT "RangoEmision_pkey",
DROP COLUMN "fin",
DROP COLUMN "id",
DROP COLUMN "inicio",
ADD COLUMN     "final_rango" BIGINT NOT NULL,
ADD COLUMN     "id_cai" BIGINT NOT NULL,
ADD COLUMN     "id_rango_emision" BIGSERIAL NOT NULL,
ADD COLUMN     "inicio_rango" BIGINT NOT NULL,
ADD CONSTRAINT "RangoEmision_pkey" PRIMARY KEY ("id_rango_emision");

-- DropTable
DROP TABLE "ConfiguracionContable";

-- DropTable
DROP TABLE "Establecimiento";

-- DropTable
DROP TABLE "Factura";

-- DropTable
DROP TABLE "PuntoEmision";

-- DropTable
DROP TABLE "TipoDocumento";

-- DropTable
DROP TABLE "_ProductoProveedor";

-- CreateTable
CREATE TABLE "producto_proveedor" (
    "productoId" BIGINT NOT NULL,
    "proveedorId" BIGINT NOT NULL,

    CONSTRAINT "producto_proveedor_pkey" PRIMARY KEY ("productoId","proveedorId")
);

-- CreateTable
CREATE TABLE "TiposDocumentos" (
    "id_tipo_documento" BIGSERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "disponible" BOOLEAN NOT NULL,

    CONSTRAINT "TiposDocumentos_pkey" PRIMARY KEY ("id_tipo_documento")
);

-- CreateTable
CREATE TABLE "Establecimientos" (
    "id_establecimiento" BIGSERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "sucursalId" BIGINT NOT NULL,
    "disponible" BOOLEAN NOT NULL,

    CONSTRAINT "Establecimientos_pkey" PRIMARY KEY ("id_establecimiento")
);

-- CreateTable
CREATE TABLE "establecimiento_tipo_documeto" (
    "id_establecimiento_tipo_documento" BIGSERIAL NOT NULL,
    "id_establecimiento" BIGINT NOT NULL,
    "id_tipo_documento" BIGINT NOT NULL,

    CONSTRAINT "establecimiento_tipo_documeto_pkey" PRIMARY KEY ("id_establecimiento_tipo_documento")
);

-- CreateTable
CREATE TABLE "PuntosEmision" (
    "id_punto_emision" BIGSERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "id_tipo_documento" BIGINT NOT NULL,
    "id_establecimiento" BIGINT NOT NULL,
    "id_rango_emision" BIGINT NOT NULL,
    "disponible" BOOLEAN NOT NULL,

    CONSTRAINT "PuntosEmision_pkey" PRIMARY KEY ("id_punto_emision")
);

-- CreateTable
CREATE TABLE "Facturas" (
    "id" BIGSERIAL NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuesto" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "numero_formateado" VARCHAR(50),
    "ventaId" BIGINT,
    "clienteId" BIGINT,
    "usuarioId" BIGINT,
    "sucursalId" BIGINT,

    CONSTRAINT "Facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_sistema" (
    "id" BIGSERIAL NOT NULL,
    "metodo_valuacion_inventario" "MetodoValuacion" NOT NULL,
    "moneda_funcional" VARCHAR(10) NOT NULL,

    CONSTRAINT "configuracion_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodo_contable" (
    "id" BIGSERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoPeriodoContable" NOT NULL DEFAULT 'ABIERTO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "periodo_contable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "producto_proveedor_proveedorId_idx" ON "producto_proveedor"("proveedorId");

-- CreateIndex
CREATE UNIQUE INDEX "TiposDocumentos_numero_key" ON "TiposDocumentos"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "TiposDocumentos_nombre_key" ON "TiposDocumentos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "establecimiento_tipo_documeto_id_establecimiento_id_tipo_do_key" ON "establecimiento_tipo_documeto"("id_establecimiento", "id_tipo_documento");

-- CreateIndex
CREATE UNIQUE INDEX "PuntosEmision_id_tipo_documento_id_establecimiento_id_punto_key" ON "PuntosEmision"("id_tipo_documento", "id_establecimiento", "id_punto_emision");

-- CreateIndex
CREATE UNIQUE INDEX "PuntosEmision_numero_id_establecimiento_id_tipo_documento_key" ON "PuntosEmision"("numero", "id_establecimiento", "id_tipo_documento");

-- CreateIndex
CREATE UNIQUE INDEX "Facturas_numero_formateado_key" ON "Facturas"("numero_formateado");

-- CreateIndex
CREATE UNIQUE INDEX "Facturas_ventaId_key" ON "Facturas"("ventaId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_fecha_movimiento_idx" ON "MovimientoInventario"("fecha_movimiento");

-- CreateIndex
CREATE INDEX "MovimientoInventario_productoId_idx" ON "MovimientoInventario"("productoId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_proveedorId_idx" ON "MovimientoInventario"("proveedorId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_sucursalId_idx" ON "MovimientoInventario"("sucursalId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_usuarioId_idx" ON "MovimientoInventario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "NumeroFactura_id_tipo_documento_id_establecimiento_id_punto_key" ON "NumeroFactura"("id_tipo_documento", "id_establecimiento", "id_punto_emision", "correlativo");

-- CreateIndex
CREATE UNIQUE INDEX "RangoEmision_inicio_rango_key" ON "RangoEmision"("inicio_rango");

-- CreateIndex
CREATE UNIQUE INDEX "RangoEmision_final_rango_key" ON "RangoEmision"("final_rango");

-- CreateIndex
CREATE UNIQUE INDEX "RangoEmision_id_cai_key" ON "RangoEmision"("id_cai");

-- AddForeignKey
ALTER TABLE "producto_proveedor" ADD CONSTRAINT "producto_proveedor_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_proveedor" ADD CONSTRAINT "producto_proveedor_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establecimientos" ADD CONSTRAINT "Establecimientos_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establecimiento_tipo_documeto" ADD CONSTRAINT "establecimiento_tipo_documeto_id_establecimiento_fkey" FOREIGN KEY ("id_establecimiento") REFERENCES "Establecimientos"("id_establecimiento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establecimiento_tipo_documeto" ADD CONSTRAINT "establecimiento_tipo_documeto_id_tipo_documento_fkey" FOREIGN KEY ("id_tipo_documento") REFERENCES "TiposDocumentos"("id_tipo_documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangoEmision" ADD CONSTRAINT "RangoEmision_id_cai_fkey" FOREIGN KEY ("id_cai") REFERENCES "Cai"("id_cai") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntosEmision" ADD CONSTRAINT "PuntosEmision_id_rango_emision_fkey" FOREIGN KEY ("id_rango_emision") REFERENCES "RangoEmision"("id_rango_emision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntosEmision" ADD CONSTRAINT "PuntosEmision_id_establecimiento_id_tipo_documento_fkey" FOREIGN KEY ("id_establecimiento", "id_tipo_documento") REFERENCES "establecimiento_tipo_documeto"("id_establecimiento", "id_tipo_documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_id_cai_fkey" FOREIGN KEY ("id_cai") REFERENCES "Cai"("id_cai") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_id_tipo_documento_id_establecimiento_id_punt_fkey" FOREIGN KEY ("id_tipo_documento", "id_establecimiento", "id_punto_emision") REFERENCES "PuntosEmision"("id_tipo_documento", "id_establecimiento", "id_punto_emision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_numero_formateado_fkey" FOREIGN KEY ("numero_formateado") REFERENCES "NumeroFactura"("numero_formateado") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
