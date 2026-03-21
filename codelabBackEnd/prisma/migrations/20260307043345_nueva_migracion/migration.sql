-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "unidad_medida" DROP NOT NULL,
ALTER COLUMN "categoriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_tipoClienteId_fkey" FOREIGN KEY ("tipoClienteId") REFERENCES "TipoCliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoProveedor" ADD CONSTRAINT "_ProductoProveedor_B_fkey" FOREIGN KEY ("B") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
