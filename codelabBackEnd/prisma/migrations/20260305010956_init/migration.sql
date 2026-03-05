/*
  Warnings:

  - The primary key for the `Cai` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Cai` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Categoria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Categoria` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tipoClienteId` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `ConfiguracionContable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ConfiguracionContable` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `DetalleVenta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `DetalleVenta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ventaId` on the `DetalleVenta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Establecimiento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Establecimiento` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tipoDocumentoId` on the `Establecimiento` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `sucursalId` on the `Establecimiento` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Factura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `numeroFacturaId` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ventaId` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `clienteId` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `usuarioId` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `sucursalId` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Inventario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Inventario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `sucursalId` on the `Inventario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `MovimientoInventario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MovimientoInventario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `sucursalId` on the `MovimientoInventario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `usuarioId` on the `MovimientoInventario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `NumeroFactura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `NumeroFactura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tipoDocumentoId` on the `NumeroFactura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `establecimientoId` on the `NumeroFactura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `puntoEmisionId` on the `NumeroFactura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `caiId` on the `NumeroFactura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Permiso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Permiso` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `categoriaId` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Proveedor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `PuntoEmision` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PuntoEmision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tipoDocumentoId` on the `PuntoEmision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `establecimientoId` on the `PuntoEmision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `rangoEmisionId` on the `PuntoEmision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `RangoEmision` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `RangoEmision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Rol` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Rol` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Sucursal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Sucursal` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `TipoCliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TipoCliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `TipoDocumento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TipoDocumento` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `sucursalId` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `rolId` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Venta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `clienteId` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `usuarioId` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `sucursalId` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `_ProductoProveedor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `B` on the `_ProductoProveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `_RolPermiso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `A` on the `_RolPermiso` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `B` on the `_RolPermiso` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
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
ALTER TABLE "Cai" DROP CONSTRAINT "Cai_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Cai_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "tipoClienteId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "ConfiguracionContable_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DetalleVenta" DROP CONSTRAINT "DetalleVenta_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "ventaId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Establecimiento" DROP CONSTRAINT "Establecimiento_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "tipoDocumentoId" SET DATA TYPE INTEGER,
ALTER COLUMN "sucursalId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Establecimiento_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "numeroFacturaId" SET DATA TYPE INTEGER,
ALTER COLUMN "ventaId" SET DATA TYPE INTEGER,
ALTER COLUMN "clienteId" SET DATA TYPE INTEGER,
ALTER COLUMN "usuarioId" SET DATA TYPE INTEGER,
ALTER COLUMN "sucursalId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Factura_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Inventario" DROP CONSTRAINT "Inventario_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "sucursalId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MovimientoInventario" DROP CONSTRAINT "MovimientoInventario_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "sucursalId" SET DATA TYPE INTEGER,
ALTER COLUMN "usuarioId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "NumeroFactura" DROP CONSTRAINT "NumeroFactura_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "tipoDocumentoId" SET DATA TYPE INTEGER,
ALTER COLUMN "establecimientoId" SET DATA TYPE INTEGER,
ALTER COLUMN "puntoEmisionId" SET DATA TYPE INTEGER,
ALTER COLUMN "caiId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "NumeroFactura_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "categoriaId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Proveedor" DROP CONSTRAINT "Proveedor_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PuntoEmision" DROP CONSTRAINT "PuntoEmision_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "tipoDocumentoId" SET DATA TYPE INTEGER,
ALTER COLUMN "establecimientoId" SET DATA TYPE INTEGER,
ALTER COLUMN "rangoEmisionId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "PuntoEmision_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RangoEmision" DROP CONSTRAINT "RangoEmision_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "RangoEmision_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Rol" DROP CONSTRAINT "Rol_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Rol_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Sucursal" DROP CONSTRAINT "Sucursal_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TipoCliente" DROP CONSTRAINT "TipoCliente_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "TipoCliente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TipoDocumento" DROP CONSTRAINT "TipoDocumento_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "sucursalId" SET DATA TYPE INTEGER,
ALTER COLUMN "rolId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "clienteId" SET DATA TYPE INTEGER,
ALTER COLUMN "usuarioId" SET DATA TYPE INTEGER,
ALTER COLUMN "sucursalId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Venta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_ProductoProveedor" DROP CONSTRAINT "_ProductoProveedor_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE INTEGER,
ADD CONSTRAINT "_ProductoProveedor_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_RolPermiso" DROP CONSTRAINT "_RolPermiso_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE INTEGER,
ALTER COLUMN "B" SET DATA TYPE INTEGER,
ADD CONSTRAINT "_RolPermiso_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_tipoClienteId_fkey" FOREIGN KEY ("tipoClienteId") REFERENCES "TipoCliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establecimiento" ADD CONSTRAINT "Establecimiento_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establecimiento" ADD CONSTRAINT "Establecimiento_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntoEmision" ADD CONSTRAINT "PuntoEmision_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntoEmision" ADD CONSTRAINT "PuntoEmision_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "Establecimiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntoEmision" ADD CONSTRAINT "PuntoEmision_rangoEmisionId_fkey" FOREIGN KEY ("rangoEmisionId") REFERENCES "RangoEmision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "Establecimiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_puntoEmisionId_fkey" FOREIGN KEY ("puntoEmisionId") REFERENCES "PuntoEmision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_caiId_fkey" FOREIGN KEY ("caiId") REFERENCES "Cai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_numeroFacturaId_fkey" FOREIGN KEY ("numeroFacturaId") REFERENCES "NumeroFactura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolPermiso" ADD CONSTRAINT "_RolPermiso_A_fkey" FOREIGN KEY ("A") REFERENCES "Permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolPermiso" ADD CONSTRAINT "_RolPermiso_B_fkey" FOREIGN KEY ("B") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoProveedor" ADD CONSTRAINT "_ProductoProveedor_B_fkey" FOREIGN KEY ("B") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
