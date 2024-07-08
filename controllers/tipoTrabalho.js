const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const TipoTrabalho = require("../models/TipoTrabalho");
const sanitizeHtml = require('sanitize-html');

const getAllTiposTrabalho = async (req, res) => {
    const tipoTrabalho = await TipoTrabalho.find();
    res.status(StatusCodes.OK).json({ tipoTrabalho });
  };


  const createTipoTrabalho = async (req, res) => {
    try {
      let tipoTrabalho = await TipoTrabalho.create(req.body);
      tipoTrabalho = sanitizeHtml(tipoTrabalho);

      res.status(StatusCodes.CREATED).json({ tipoTrabalho });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  };

  const createTipoTrabalhoOther = async (req, res) => {
    try {
      let tipoTrabalho = await TipoTrabalho.create(req.body);
      tipoTrabalho = sanitizeHtml(tipoTrabalho);
      res.status(StatusCodes.CREATED).json({ tipoTrabalho });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  };


  const updateTipoTrabalho = async (req, res) => {
    const { id: TipoTrabalhoId } = req.params;
    TipoTrabalhoId = sanitizeHtml(TipoTrabalhoId);
    try {
      const tipoTrabalho = await TipoTrabalho.findByIdAndUpdate(
        {
          _id: TipoTrabalhoId,
        },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!tipoTrabalho) {
        throw new NotFoundError(`Não existe nenhum tipo de trabalho com id ${req.params.id}`);
      }
      res.status(StatusCodes.OK).json({ tipoTrabalho });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  };
  

  const deleteTipoTrabalho = async (req, res) => {
    let {
      params: { id: TipoTrabalhoId },
    } = req;
    TipoTrabalhoId = sanitizeHtml(TipoTrabalhoId);
    const tipoTrabalho = await TipoTrabalho.findOneAndDelete({
      _id: TipoTrabalhoId,
    });
    if (!tipoTrabalho) {
      throw new NotFoundError(`Não existe nenhum tipo de trabalho com id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).send();
  };

  module.exports = {
    getAllTiposTrabalho,
    createTipoTrabalho,
    createTipoTrabalhoOther,
    deleteTipoTrabalho,
    updateTipoTrabalho,
  };