import prisma from "../infra/prismaClient.js";

export const createCategoria = async (req, res) => {
  try {

    const categoria = await prisma.categoriaPermiso.create({
      data: req.body
    });

    res.json({
      success: true,
      data: categoria
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};