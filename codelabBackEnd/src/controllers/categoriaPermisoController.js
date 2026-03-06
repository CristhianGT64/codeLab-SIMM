import prisma from "../infra/prismaClient.js";

export const createCategoria = async (req, res) => {

  try {

    const categoria = await prisma.categoriaPermiso.create({
      data: req.body
    });

    res.json(categoria);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};