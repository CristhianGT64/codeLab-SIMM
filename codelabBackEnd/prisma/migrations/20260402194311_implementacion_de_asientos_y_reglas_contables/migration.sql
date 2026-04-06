-- CreateEnum
CREATE TYPE "EnumTipoOperacionContable" AS ENUM ('VENTA', 'INVENTARIO', 'FACTURA', 'AJUSTE');

-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "id_asiento_contable" BIGINT;

-- AlterTable
ALTER TABLE "MovimientoInventario" ADD COLUMN     "id_asiento_contable" BIGINT;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "id_asiento_contable" BIGINT;

-- CreateTable
CREATE TABLE "ASIENTOS_CONTABLES" (
    "id_asiento_contable" BIGSERIAL NOT NULL,
    "uuid_asiento_contable" VARCHAR(64) NOT NULL,
    "numero_asiento" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "tipo_operacion" "EnumTipoOperacionContable" NOT NULL,
    "id_operacion_origen" BIGINT,
    "total_debe" DECIMAL(14,2) NOT NULL,
    "total_haber" DECIMAL(14,2) NOT NULL,
    "balanceado" BOOLEAN NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ASIENTOS_CONTABLES_pkey" PRIMARY KEY ("id_asiento_contable")
);

-- CreateTable
CREATE TABLE "DETALLE_ASIENTOS_CONTABLES" (
    "id_detalle_asiento_contable" BIGSERIAL NOT NULL,
    "uuid_detalle" VARCHAR(64) NOT NULL,
    "id_asiento_contable" BIGINT NOT NULL,
    "id_sub_cuenta_contable" BIGINT NOT NULL,
    "monto_debe" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "monto_haber" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "DETALLE_ASIENTOS_CONTABLES_pkey" PRIMARY KEY ("id_detalle_asiento_contable")
);

-- CreateTable
CREATE TABLE "REGLAS_CONTABLES" (
    "id_regla" BIGSERIAL NOT NULL,
    "tipo_operacion" "EnumTipoOperacionContable" NOT NULL,
    "descripcion" VARCHAR(100),
    "subcuenta_debe" BIGINT NOT NULL,
    "subcuenta_haber" BIGINT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "REGLAS_CONTABLES_pkey" PRIMARY KEY ("id_regla")
);

-- CreateIndex
CREATE UNIQUE INDEX "ASIENTOS_CONTABLES_uuid_asiento_contable_key" ON "ASIENTOS_CONTABLES"("uuid_asiento_contable");

-- CreateIndex
CREATE UNIQUE INDEX "ASIENTOS_CONTABLES_numero_asiento_key" ON "ASIENTOS_CONTABLES"("numero_asiento");

-- CreateIndex
CREATE INDEX "ASIENTOS_CONTABLES_tipo_operacion_idx" ON "ASIENTOS_CONTABLES"("tipo_operacion");

-- CreateIndex
CREATE UNIQUE INDEX "DETALLE_ASIENTOS_CONTABLES_uuid_detalle_key" ON "DETALLE_ASIENTOS_CONTABLES"("uuid_detalle");

-- CreateIndex
CREATE INDEX "DETALLE_ASIENTOS_CONTABLES_id_asiento_contable_idx" ON "DETALLE_ASIENTOS_CONTABLES"("id_asiento_contable");

-- CreateIndex
CREATE INDEX "DETALLE_ASIENTOS_CONTABLES_id_sub_cuenta_contable_idx" ON "DETALLE_ASIENTOS_CONTABLES"("id_sub_cuenta_contable");

-- CreateIndex
CREATE INDEX "REGLAS_CONTABLES_tipo_operacion_idx" ON "REGLAS_CONTABLES"("tipo_operacion");

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_id_asiento_contable_fkey" FOREIGN KEY ("id_asiento_contable") REFERENCES "ASIENTOS_CONTABLES"("id_asiento_contable") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_asiento_contable_fkey" FOREIGN KEY ("id_asiento_contable") REFERENCES "ASIENTOS_CONTABLES"("id_asiento_contable") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "Facturas_id_asiento_contable_fkey" FOREIGN KEY ("id_asiento_contable") REFERENCES "ASIENTOS_CONTABLES"("id_asiento_contable") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DETALLE_ASIENTOS_CONTABLES" ADD CONSTRAINT "DETALLE_ASIENTOS_CONTABLES_id_asiento_contable_fkey" FOREIGN KEY ("id_asiento_contable") REFERENCES "ASIENTOS_CONTABLES"("id_asiento_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DETALLE_ASIENTOS_CONTABLES" ADD CONSTRAINT "DETALLE_ASIENTOS_CONTABLES_id_sub_cuenta_contable_fkey" FOREIGN KEY ("id_sub_cuenta_contable") REFERENCES "SUB_CUENTA_CONTABLE"("id_sub_cuenta_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REGLAS_CONTABLES" ADD CONSTRAINT "REGLAS_CONTABLES_subcuenta_debe_fkey" FOREIGN KEY ("subcuenta_debe") REFERENCES "SUB_CUENTA_CONTABLE"("id_sub_cuenta_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REGLAS_CONTABLES" ADD CONSTRAINT "REGLAS_CONTABLES_subcuenta_haber_fkey" FOREIGN KEY ("subcuenta_haber") REFERENCES "SUB_CUENTA_CONTABLE"("id_sub_cuenta_contable") ON DELETE RESTRICT ON UPDATE CASCADE;
