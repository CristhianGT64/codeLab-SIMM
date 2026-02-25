/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "EstadoProducto" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('completada', 'anulada');

-- CreateEnum
CREATE TYPE "TipoMovimientoInventario" AS ENUM ('entrada', 'salida');

-- CreateEnum
CREATE TYPE "MetodoValuacion" AS ENUM ('FIFO', 'PROMEDIO_PONDERADO');

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "Rol" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sucursal" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(255),
    "telefono" VARCHAR(50),
    "gerente" VARCHAR(150),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" BIGSERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'activo',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "sucursalId" BIGINT,
    "rolId" BIGINT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" VARCHAR(255),
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(50),
    "correo" VARCHAR(150),
    "direccion" VARCHAR(255),
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "costo" DECIMAL(10,2) NOT NULL,
    "precio_venta" DECIMAL(10,2) NOT NULL,
    "unidad_medida" VARCHAR(50),
    "estado" "EstadoProducto" NOT NULL DEFAULT 'activo',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "categoriaId" BIGINT,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "id" BIGSERIAL NOT NULL,
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "productoId" BIGINT NOT NULL,
    "sucursalId" BIGINT NOT NULL,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" BIGSERIAL NOT NULL,
    "tipo" "TipoMovimientoInventario" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "referencia_tipo" VARCHAR(50),
    "referencia_id" BIGINT,
    "created_at" TIMESTAMP(3),
    "productoId" BIGINT NOT NULL,
    "sucursalId" BIGINT NOT NULL,
    "usuarioId" BIGINT,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCliente" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" BIGSERIAL NOT NULL,
    "nombre_completo" VARCHAR(150),
    "identificacion" VARCHAR(50),
    "telefono" VARCHAR(50),
    "correo" VARCHAR(150),
    "direccion" VARCHAR(255),
    "tipoClienteId" BIGINT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "RangoEmision" (
    "id" BIGSERIAL NOT NULL,
    "inicio" INTEGER NOT NULL,
    "fin" INTEGER NOT NULL,

    CONSTRAINT "RangoEmision_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Cai" (
    "id" BIGSERIAL NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL,

    CONSTRAINT "Cai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NumeroFactura" (
    "id" BIGSERIAL NOT NULL,
    "numero_formateado" VARCHAR(50),
    "correlativo" INTEGER NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "tipoDocumentoId" BIGINT NOT NULL,
    "establecimientoId" BIGINT NOT NULL,
    "puntoEmisionId" BIGINT NOT NULL,
    "caiId" BIGINT,

    CONSTRAINT "NumeroFactura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" BIGSERIAL NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoVenta" NOT NULL,
    "created_at" TIMESTAMP(3),
    "clienteId" BIGINT,
    "usuarioId" BIGINT,
    "sucursalId" BIGINT,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "id" BIGSERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "ventaId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_RolPermiso" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_RolPermiso_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductoProveedor" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ProductoProveedor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_nombre_key" ON "Permiso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Inventario_productoId_sucursalId_key" ON "Inventario"("productoId", "sucursalId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_identificacion_key" ON "Cliente"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_numero_key" ON "TipoDocumento"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_nombre_key" ON "TipoDocumento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Establecimiento_numero_tipoDocumentoId_key" ON "Establecimiento"("numero", "tipoDocumentoId");

-- CreateIndex
CREATE UNIQUE INDEX "PuntoEmision_numero_establecimientoId_key" ON "PuntoEmision"("numero", "establecimientoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cai_codigo_key" ON "Cai"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "NumeroFactura_numero_formateado_key" ON "NumeroFactura"("numero_formateado");

-- CreateIndex
CREATE UNIQUE INDEX "NumeroFactura_tipoDocumentoId_establecimientoId_puntoEmisio_key" ON "NumeroFactura"("tipoDocumentoId", "establecimientoId", "puntoEmisionId", "correlativo");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numeroFacturaId_key" ON "Factura"("numeroFacturaId");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_ventaId_key" ON "Factura"("ventaId");

-- CreateIndex
CREATE INDEX "_RolPermiso_B_index" ON "_RolPermiso"("B");

-- CreateIndex
CREATE INDEX "_ProductoProveedor_B_index" ON "_ProductoProveedor"("B");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "_ProductoProveedor" ADD CONSTRAINT "_ProductoProveedor_A_fkey" FOREIGN KEY ("A") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoProveedor" ADD CONSTRAINT "_ProductoProveedor_B_fkey" FOREIGN KEY ("B") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
