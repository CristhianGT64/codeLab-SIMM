-- AlterTable
ALTER TABLE "Establecimientos" ALTER COLUMN "disponible" SET DEFAULT true;

-- AlterTable
ALTER TABLE "TiposDocumentos" ALTER COLUMN "disponible" SET DEFAULT true;

-- AlterTable
ALTER TABLE "establecimiento_tipo_documeto" ADD COLUMN     "disponible" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "producto_proveedor" ADD CONSTRAINT "producto_proveedor_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
