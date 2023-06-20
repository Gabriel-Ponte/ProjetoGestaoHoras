const Projeto = require("../models/Projeto");
const User = require("../models/Utilizador");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { updateExcell } = require("../exportMongoDB")
require('dotenv').config();

const exportProjetos = async(req, res) =>{
  const { userID: userID } = req.body;
  
  const user = await User.findOne({
    _id: userID,
  });
  if(!user){
    throw new NotFoundError(`Não foi encontrado o utilizador com id ${userID}`);
  }

  if(user.tipo == 2){
    updateExcell();
    res.status(StatusCodes.OK).json(`Ficheiro exportado para ${process.env.EXCEL_EXPORT}`);
  }
  else{
    throw new NotFoundError(`O utilizador ${user.nome} não possui permissões para exportar`);
  }
}

const getAllProjetos = async (req, res) => {
  const { search, Finalizado, tipoTrabalho, sort ,DataObjetivo} = req.query;
  const queryObject = {
  };

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  if (tipoTrabalho && tipoTrabalho === "true") {
    queryObject.TipoTrabalho = { $exists: true, $ne: "" };
  }

  if (Finalizado ==="false" || Finalizado ==="true") {
    queryObject.Finalizado = Finalizado;
  }


  if (DataObjetivo === "false") {
    queryObject.DataObjetivo = null;
  } else if (DataObjetivo === "true") {
    queryObject.DataObjetivo = { $ne: null };
  }

  let result;

  if(queryObject){
    result = Projeto.find(queryObject);
  }else{
    result = Projeto.find();
  }
  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  if (sort) {
    result = await result.sort(sort);
  }
  const filter = queryObject || {};
  const projetos = await result;
  const totalProjetos = await Projeto.countDocuments(filter);
  const numOfPages = Math.ceil(totalProjetos / limit);
  res.status(StatusCodes.OK).json({ projetos, totalProjetos, numOfPages });
};


const getProjeto = async (req, res) => {

  const { id: projetoId } = req.params;
  const projeto = await Projeto.findOne({
    _id: projetoId,
  });
  if (!projeto) {
    throw new NotFoundError(`Não existe um projeto com id ${projetoId}`);
  }
  res.status(StatusCodes.OK).json({ projeto });
};


const getTipoTrabalhoProjeto = async (req, res) => {
  const { tipoTrabalho: tipoTrabalho } = req.params;
  const projeto = await Projeto.find({
    _id: projetoId,
  });
  if (!projeto) {
    throw new NotFoundError(`Não existe um projeto com id ${projetoId}`);
  }
  res.status(StatusCodes.OK).json({ projeto });
};


const createProjeto = async (req, res) => {
  const projeto = await Projeto.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ projeto });
};


const updateProjeto = async (req, res) => {
  const {
    Nome,
    Tema,
    Cliente,
    Acao,
    DataInicio,
    DataObjetivo,
    DataFim,
    TipoTrabalho,
    Piloto,
    Notas,
    Links
  } = req.body;
  const { id: projetoId } = req.params;
  try {
    if (Nome === "" || Tema === "" || Cliente === "" || DataInicio === "") {
      throw new BadRequestError("Nome, Tema, Cliente, DataInicio precisam ser preenchidos");
    }
    const projeto = await Projeto.findByIdAndUpdate(
      {
        _id: projetoId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!projeto) {
      throw new NotFoundError(`Não existe um projeto com id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ projeto });
  } catch (error) {
    console.log(error);
  }
};



const deleteProjeto = async (req, res) => {
  const {
    params: { id: projetoId },
  } = req;

  const projeto = await Projeto.findByIdAndRemove({
    _id: projetoId,
  });
  if (!projeto) {
    throw new NotFoundError(`Não existe um projeto com id ${projetoId}`);
  }
  res.status(StatusCodes.OK).send();
};


module.exports = {
  getAllProjetos,
  getProjeto,
  createProjeto,
  updateProjeto,
  deleteProjeto,
  exportProjetos,
};
