import prisma from '../infra/prisma/prismaClient.js';

const productoSelect = {
  id: true,
  nombre: true,
  sku: true,
  costo: true,
  precioVenta: true,
  unidadMedida: true,
  stockMinimo: true,
  imagenPath: true,
  estado: true,
  categoria: { select: { id: true, nombre: true } },
  impuesto: { select: { id: true, nombre: true, tasa: true } },
  inventarios: {
    select: {
      sucursalId: true,
      stockActual: true,
      sucursal: { select: { id: true, nombre: true } },
    },
  },
  createdAt: true,
  updatedAt: true,
};

const productoRepository = {
  list() {
    return prisma.producto.findMany({
      orderBy: { id: 'desc' },
      select: productoSelect,
    });
  },

  findById(id) {
    return prisma.producto.findUnique({
      where: { id },
      select: {
        categoriaId: true,
        ...productoSelect,
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
        ...productoSelect,
        ...selectExtra,
      },
    });
  },
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
        stockMinimo: true,
        imagenUrl: true,
        categoria: {select: {id: true,nombre: true}},
        impuesto: { select: { id: true, nombre: true, tasa: true } },
        inventarios: {
          select: {
            sucursalId: true,
            stockActual: true,
          },
        },
      },
      take: 10
    });

  },


  update(id, data) {
    return prisma.producto.update({
      where: { id },
      data,
      select: productoSelect,
    });
  },
};

export default productoRepository;
