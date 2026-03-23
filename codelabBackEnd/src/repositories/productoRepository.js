import prisma from '../infra/prisma/prismaClient.js';

const productoRepository = {
  list() {
    return prisma.producto.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nombre: true,
        sku: true,
        costo: true,
        precioVenta: true,
        unidadMedida: true,
        imagenPath: true,
        estado: true,
        categoria: { select: { id: true, nombre: true } },
        inventarios: { select: { sucursalId: true, stockActual: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findById(id) {
    return prisma.producto.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        sku: true,
        costo: true,
        precioVenta: true,
        unidadMedida: true,
        imagenPath: true,
        estado: true,
        categoriaId: true,
        categoria: { select: { id: true, nombre: true } },
        inventarios: { select: { sucursalId: true, stockActual: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findBySku(sku) {
    return prisma.producto.findUnique({
      where: { sku },
      select: { id: true, sku: true },
    });
  },

  create(data, selectExtra = {}) {
    return prisma.producto.create({
      data,
      select: {
        id: true,
        nombre: true,
        sku: true,
        costo: true,
        precioVenta: true,
        unidadMedida: true,
        imagenPath: true,
        estado: true,
        categoria: { select: { id: true, nombre: true } },
        createdAt: true,
        updatedAt: true,
        ...selectExtra,
      },
    });
  },
  /////
  async search(query) {

    return prisma.producto.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            sku: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            categoria: {
              nombre: {
                contains: query,
                mode: "insensitive"
              }
            }
          }
        ],
        estado: "activo"
      },
      select: {
        id: true,
        nombre: true,
        sku: true,
        precioVenta: true,
        unidadMedida: true,
        imagenUrl: true,
        categoria: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      take: 10
    });

  },

  ////

  update(id, data) {
    return prisma.producto.update({
      where: { id },
      data,
      select: {
        id: true,
        nombre: true,
        sku: true,
        costo: true,
        precioVenta: true,
        unidadMedida: true,
        imagenPath: true,
        estado: true,
        categoria: { select: { id: true, nombre: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};

export default productoRepository;