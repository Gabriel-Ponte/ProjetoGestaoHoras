const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const TipoTrabalho = require("../models/TipoTrabalho");


const getAllTiposTrabalho = async (req, res) => {
    const tipoTrabalho = await TipoTrabalho.find();
    res.status(StatusCodes.OK).json({ tipoTrabalho });
  };


  const createTipoTrabalho = async (req, res) => {
    try {
      console.log(req.body);
      const tipoTrabalho = await TipoTrabalho.create(req.body);
      console.log(tipoTrabalho);
      res.status(StatusCodes.CREATED).json({ tipoTrabalho });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  };


  module.exports = {
    getAllTiposTrabalho,
    createTipoTrabalho,
  };