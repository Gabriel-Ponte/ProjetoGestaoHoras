const Projeto = require("../models/Projeto");
const ProjetosVersion = require("../models/ProjetosVersion");
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

const getProjetoTodasVersoes = async (req, res) => {
  try{
    console.log(req.params)
  const { id: projetoId } = req.params;
  console.log(projetoId)
  const projeto = await ProjetosVersion.find({
    _id: projetoId,
  });
  console.log(projeto)
  if (!projeto) {
    throw new NotFoundError(`Não existem versões no projeto com id ${projetoId}`);
  }
  res.status(StatusCodes.OK).json({ projeto });
} catch (error){
  console.error(error)
  throw new NotFoundError(`Não Encontrado`);
}
};


const getClientesProjeto = async (req, res) => {

  // Use the distinct method to get unique clientes from the projetos
  const uniqueClientes = await Projeto.distinct('Cliente');

  // Filter out null values from the uniqueClientes array
  const filteredClientes = uniqueClientes.filter(cliente => cliente !== "");

  res.status(StatusCodes.OK).json({ clientes: filteredClientes });
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
    DataInicio,
    Piloto,
    Acao,
    Notas
  } = req.body;

  const { id: projetoId } = req.params;
  try {
    if (Nome === "" || Tema === "" || Cliente === "" || DataInicio === "") {
      throw new BadRequestError("Nome, Tema, Cliente, DataInicio precisam ser preenchidos");
    }

    const projeto = await Projeto.findById(
      {
        _id: projetoId,
      }
    );

    let vers = projeto.Versao || 1;
    
    if(!projeto.Versao){
      projeto.Versao = vers;
    }
    if(Nome !== projeto.Nome || Tema !== projeto.Tema || Cliente !== projeto.Cliente ||  Piloto !== projeto.Piloto || Acao !== projeto.Acao || Notas !== projeto.Notas){
      await ProjetosVersion.create({ 
        id:projetoId,
        _id_P: projeto?._id_P,
        Versao: projeto?.Versao,
        Nome: projeto?.Nome,
        Tema: projeto?.Tema,
        Cliente: projeto?.Cliente,
        Acao: projeto?.Acao,
        DataInicio:projeto?.DataInicio,
        DataObjetivo: projeto?.DataObjetivo,
        DataFim:projeto?.DataFim,
        TipoTrabalho:projeto?.TipoTrabalho,
        Piloto:projeto?.Finalizado,
        Notas: projeto?.Notas,
        Links: projeto?.Links,
        LinkResumo: projeto?.LinkResumo,
        NumeroHorasTotal:projeto?.NumeroHorasTotal,
        OrçamentoAprovado: projeto?.OrçamentoAprovado,
        Finalizado: projeto?.Finalizado,
        Resultado: projeto?.Resultado
       });
       vers = vers + 1;
    }



    const projetoUpdate = await Projeto.findByIdAndUpdate(
      {
        _id: projetoId,
      },
      { Versao: vers, ...req.body },
      { new: true, runValidators: true }
    );
    if (!projetoUpdate) {
      throw new NotFoundError(`Não existe um projeto com id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ projetoUpdate });
  } catch (error) {
    console.error(error);
  }
};


const updateProjetoLink = async (req, res) => {
  const {
    Links,
    LinkResumo,
  } = req.body;

  const { id: projetoId } = req.params;
  try {
    if (Links === "" && LinkResumo === "") {
      throw new BadRequestError("Link precisa ser preenchido");
    }

    const projetoUpdate = await Projeto.findByIdAndUpdate(
      {
        _id: projetoId,
      },
      
      { Links: Links , LinkResumo: LinkResumo },
      { new: true, runValidators: true }
    );
    if (!projetoUpdate) {
      throw new NotFoundError(`Não existe um projeto com id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ projetoUpdate });
  } catch (error) {
    console.error(error);
  }
};


const deleteProjeto = async (req, res) => {
  const {
    params: { id: projetoId },
  } = req;

  const projeto = await Projeto.findOneAndDelete({
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
  getProjetoTodasVersoes,
  createProjeto,
  updateProjeto,
  updateProjetoLink,
  deleteProjeto,
  exportProjetos,
  getClientesProjeto,
};
