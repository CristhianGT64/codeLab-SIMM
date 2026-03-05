import prisma from "../infra/prisma/prismaClient.js";


const getAll = async (search = "") => {

  if (!search) {
    return prisma.cliente.findMany({
      include: {
        tipoCliente: true
      }
    });
  }

  return prisma.cliente.findMany({
    where: {
      OR: [
        {
          nombreCompleto: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          identificacion: {
            contains: search
          }
        },
        {
          telefono: {
            contains: search
          }
        }
      ]
    },
    include: {
      tipoCliente: true
    }
  });

};

const getById = async (id) => {
  return prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: { tipoCliente: true }
  });
};

const getByIdentificacion = async (identificacion) => {
  return prisma.cliente.findUnique({
    where: { identificacion }
  });
};

const create = async (data) => {
  return prisma.cliente.create({ data });
};

const update = async (id, data) => {
  return prisma.cliente.update({
    where: { id: Number(id) },
    data
  });
};

export default {
  getAll,
  getById,
  getByIdentificacion,
  create,
  update
};