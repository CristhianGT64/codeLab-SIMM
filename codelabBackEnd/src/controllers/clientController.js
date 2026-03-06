import clientService from "../services/clientService.js";

const createClient = async (req, res, next) => {
  try {

    const client = await clientService.createClient(req.body);

    res.status(201).json({
      success: true,
      data: client
    });

  } catch (error) {
    next(error);
  }
};

const getAllClients = async (req, res, next) => {
  try {

    const { search } = req.query;

    const clients = await clientService.getClients(search);

    res.json({
      success: true,
      data: clients
    });

  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {

    const { id } = req.params;

    const client = await clientService.updateClient(id, req.body);

    res.json({
      success: true,
      data: client
    });

  } catch (error) {
    next(error);
  }
};

export default {
  createClient,
  getAllClients,
  updateClient
};