import invoiceTypeService from '../services/invoiceTypeService.js';

export const create = async (req, res, next) => {
  try {

    const invoiceType = await invoiceTypeService.create(req.body);

    res.status(201).json(invoiceType);

  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {

    const invoiceTypes = await invoiceTypeService.getAll();

    res.json(invoiceTypes);

  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {

    const invoiceType = await invoiceTypeService.getById(req.params.id);

    res.json(invoiceType);

  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {

    const invoiceType = await invoiceTypeService.update(
      req.params.id,
      req.body
    );

    res.json(invoiceType);

  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {

    const invoiceType = await invoiceTypeService.updateStatus(
      req.params.id,
      req.body.disponible
    );

    res.json(invoiceType);

  } catch (error) {
    next(error);
  }
};