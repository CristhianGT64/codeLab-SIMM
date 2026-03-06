-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_tipoClienteId_fkey";

-- DropForeignKey
ALTER TABLE "DetalleVenta" DROP CONSTRAINT "DetalleVenta_ventaId_fkey";

-- DropForeignKey
ALTER TABLE "Establecimiento" DROP CONSTRAINT "Establecimiento_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Establecimiento" DROP CONSTRAINT "Establecimiento_tipoDocumentoId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_numeroFacturaId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_ventaId_fkey";

-- DropForeignKey
ALTER TABLE "Inventario" DROP CONSTRAINT "Inventario_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "NumeroFactura" DROP CONSTRAINT "NumeroFactura_caiId_fkey";

-- DropForeignKey
ALTER TABLE "NumeroFactura" DROP CONSTRAINT "NumeroFactura_establecimientoId_fkey";

-- DropForeignKey
ALTER TABLE "NumeroFactura" DROP CONSTRAINT "NumeroFactura_puntoEmisionId_fkey";

-- DropForeignKey
ALTER TABLE "NumeroFactura" DROP CONSTRAINT "NumeroFactura_tipoDocumentoId_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "PuntoEmision" DROP CONSTRAINT "PuntoEmision_establecimientoId_fkey";

-- DropForeignKey
ALTER TABLE "PuntoEmision" DROP CONSTRAINT "PuntoEmision_rangoEmisionId_fkey";

-- DropForeignKey
ALTER TABLE "PuntoEmision" DROP CONSTRAINT "PuntoEmision_tipoDocumentoId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_rolId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductoProveedor" DROP CONSTRAINT "_ProductoProveedor_B_fkey";

-- DropForeignKey
ALTER TABLE "_RolPermiso" DROP CONSTRAINT "_RolPermiso_A_fkey";

-- DropForeignKey
ALTER TABLE "_RolPermiso" DROP CONSTRAINT "_RolPermiso_B_fkey";

-- AlterTable
ALTER TABLE "Permiso" ADD COLUMN     "categoriaId" BIGINT;

-- CreateTable
CREATE TABLE "CategoriaPermiso" (
    "id" BIGSERIAL NOT NULL,
    "nombreCategoria" VARCHAR(150) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CategoriaPermiso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaPermiso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
