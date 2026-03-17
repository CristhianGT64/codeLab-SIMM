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
  - You are about to drop the `CAI` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Establecimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Factura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PuntoEmision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoDocumento` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_tipo_documento,id_establecimiento,id_punto_emision,correlativo]` on the table `NumeroFactura` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inicio_rango]` on the table `RangoEmision` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[final_rango]` on the table `RangoEmision` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_cai]` on the table `RangoEmision` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fecha_inicio` on table `Cai` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_fin` on table `Cai` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_establecimiento` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_punto_emision` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tipo_documento` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `final_rango` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cai` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicio_rango` to the `RangoEmision` table without a default value. This is not possible if the table is not empty.

*/
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
CREATE SEQUENCE numerofactura_correlativo_seq;
ALTER TABLE "NumeroFactura" DROP COLUMN "caiId",
DROP COLUMN "establecimientoId",
DROP COLUMN "puntoEmisionId",
DROP COLUMN "tipoDocumentoId",
DROP COLUMN "usado",
ADD COLUMN     "id_establecimiento" BIGINT NOT NULL,
ADD COLUMN     "id_punto_emision" BIGINT NOT NULL,
ADD COLUMN     "id_tipo_documento" BIGINT NOT NULL,
ALTER COLUMN "correlativo" SET DEFAULT nextval('numerofactura_correlativo_seq');
ALTER SEQUENCE numerofactura_correlativo_seq OWNED BY "NumeroFactura"."correlativo";

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
DROP TABLE "CAI";

-- DropTable
DROP TABLE "Establecimiento";

-- DropTable
DROP TABLE "Factura";

-- DropTable
DROP TABLE "PuntoEmision";

-- DropTable
DROP TABLE "TipoDocumento";

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

-- CreateIndex
CREATE UNIQUE INDEX "TiposDocumentos_numero_key" ON "TiposDocumentos"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "TiposDocumentos_nombre_key" ON "TiposDocumentos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "establecimiento_tipo_documeto_id_establecimiento_id_tipo_do_key" ON "establecimiento_tipo_documeto"("id_establecimiento", "id_tipo_documento");

-- CreateIndex
CREATE UNIQUE INDEX "PuntosEmision_numero_id_establecimiento_id_tipo_documento_key" ON "PuntosEmision"("numero", "id_establecimiento", "id_tipo_documento");

-- CreateIndex
CREATE UNIQUE INDEX "PuntosEmision_id_tipo_documento_id_establecimiento_id_punto_key" ON "PuntosEmision"("id_tipo_documento", "id_establecimiento", "id_punto_emision");

-- CreateIndex
CREATE UNIQUE INDEX "Facturas_numero_formateado_key" ON "Facturas"("numero_formateado");

-- CreateIndex
CREATE UNIQUE INDEX "Facturas_ventaId_key" ON "Facturas"("ventaId");

-- CreateIndex
CREATE UNIQUE INDEX "NumeroFactura_id_tipo_documento_id_establecimiento_id_punto_key" ON "NumeroFactura"("id_tipo_documento", "id_establecimiento", "id_punto_emision", "correlativo");

-- CreateIndex
CREATE UNIQUE INDEX "RangoEmision_inicio_rango_key" ON "RangoEmision"("inicio_rango");

-- CreateIndex
CREATE UNIQUE INDEX "RangoEmision_final_rango_key" ON "RangoEmision"("final_rango");

-- CreateIndex
CREATE UNIQUE INDEX "RangoEmision_id_cai_key" ON "RangoEmision"("id_cai");

-- AddForeignKey
ALTER TABLE "Establecimientos" ADD CONSTRAINT "Establecimientos_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establecimiento_tipo_documeto" ADD CONSTRAINT "establecimiento_tipo_documeto_id_establecimiento_fkey" FOREIGN KEY ("id_establecimiento") REFERENCES "Establecimientos"("id_establecimiento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establecimiento_tipo_documeto" ADD CONSTRAINT "establecimiento_tipo_documeto_id_tipo_documento_fkey" FOREIGN KEY ("id_tipo_documento") REFERENCES "TiposDocumentos"("id_tipo_documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangoEmision" ADD CONSTRAINT "RangoEmision_id_cai_fkey" FOREIGN KEY ("id_cai") REFERENCES "Cai"("id_cai") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntosEmision" ADD CONSTRAINT "PuntosEmision_id_establecimiento_id_tipo_documento_fkey" FOREIGN KEY ("id_establecimiento", "id_tipo_documento") REFERENCES "establecimiento_tipo_documeto"("id_establecimiento", "id_tipo_documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntosEmision" ADD CONSTRAINT "PuntosEmision_id_rango_emision_fkey" FOREIGN KEY ("id_rango_emision") REFERENCES "RangoEmision"("id_rango_emision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_id_tipo_documento_id_establecimiento_id_punt_fkey" FOREIGN KEY ("id_tipo_documento", "id_establecimiento", "id_punto_emision") REFERENCES "PuntosEmision"("id_tipo_documento", "id_establecimiento", "id_punto_emision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_numero_formateado_fkey" FOREIGN KEY ("numero_formateado") REFERENCES "NumeroFactura"("numero_formateado") ON DELETE SET NULL ON UPDATE CASCADE;
