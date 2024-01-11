const { Dias, TipoTrabalhoHoras } = require("../models/Dias");
const User = require("../models/Utilizador");
const Projeto = require("../models/Projeto");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { exportExcell } = require("../exportExcellHours");



const getAllDias = async (req, res) => {
  try {

    const diasAll = await Dias.find();
    if (!diasAll.length) {
      throw new NotFoundError(`Não foram encontradas horas inseridas`);
    }

    diasAll.sort((a, b) => a.Data - b.Data);

    res.status(StatusCodes.OK).json({ diasAll });
  } catch (error) {
    // Handle the error, e.g., send an error response.
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllDiasUtilizadorTipo = async (req, res) => {
  try {

    const {
      params: { utilizador },
    } = req;


    let users = []
    console.log(utilizador)
    if (Number(utilizador) === 1) {
      users = await User.find({ tipo: { $in: [1, 5] } });
    } else if (Number(utilizador) === 2) {
      users = await User.find({ tipo: { $in: [2, 5, 6] } });
    } else if (Number(utilizador) === 3) {
      users = await User.find({ tipo: { $in: [3, 6] } });
    } else if (Number(utilizador) === 4) {
      users = await User.find({ tipo: { $in: [4, 7] } });
    }

  

    if (!users.length) {
      throw new NotFoundError(`Nenhum utilizador encontrado com o tipo ${utilizador}.`);
    }

    const userIds = users.map(user => user._id);



    const diasAllUtilizador = await Dias.find({ Utilizador: { $in: userIds } });
    
    if (!diasAllUtilizador.length) {
      throw new NotFoundError(`Não foram encontradas horas inseridas para utilizadores do tipo ${utilizador}.`);
    }

    diasAllUtilizador.sort((a, b) => a.Data - b.Data);
    res.status(StatusCodes.OK).json({ diasAllUtilizador });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getAllDiasUtilizador = async (req, res) => {
  const {
    params: { utilizador },
  } = req;
  const u1 = await User.findOne({
    nome: utilizador,
  });

  const diasAllUtilizador = await Dias.find({
    Utilizador: u1._id,
  });

  if (!diasAllUtilizador.length) {
    throw new NotFoundError(`Não foram encontradas horas inseridas para: ${u1.Nome}`);
  }
  diasAllUtilizador.sort((a, b) => a.Data - b.Data);
  res.status(StatusCodes.OK).json({ diasAllUtilizador });
};





const getAllDiasProjeto = async (req, res) => {
  const {
    params: { projeto },
  } = req;


  const diasAllProjeto = await Dias.find({ "tipoDeTrabalhoHoras.projeto": projeto });

  if (!diasAllProjeto.length) {
    throw new NotFoundError(`No Dias found`);
  }
  res.status(StatusCodes.OK).json({ diasAllProjeto });
};


const getDiasUtilizador = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const diasUtilizador = await Dias.find();
  let x = 0;
  const listaUtilizador = null;
  for (i == 0; i < diasUtilizador.length; i++) {
    if (diasUtilizador[i].Utilizador === req.user.userId) {
      listaUtilizador[x] = diasUtilizador[i];
      x++;
    }
  }
  if (!listaUtilizador) {
    throw new NotFoundError(`Utilizador não possui dias inseridos`);
  }
  res.status(StatusCodes.OK).json({ listaUtilizador });
};



const getDiasProjetoUtilizador = async (req, res) => {
  const {
    params: { projeto, utilizador },
  } = req;

  const u1 = await User.findOne({
    nome: utilizador,
  });

  const diasAllProjeto = await Dias.find({
    Utilizador:  u1._id, "tipoDeTrabalhoHoras.projeto": projeto
  });
  if (!diasAllProjeto.length) {
    throw new NotFoundError(`Utilizador ${utilizador} não possui horas inseridas neste projeto`);
  }
  res.status(StatusCodes.OK).json({ diasAllProjeto });
};


const getDia = async (req, res) => {
  try {
    const {
      params: { user: login },
    } = req;
    const dia = await Dias.find({
      Utilizador: login,
    });
    if (!dia) {
      throw new NotFoundError(`Não existem horas nesta data ${ChangeDiaData}`);
    }
    res.status(StatusCodes.OK).json({ dia });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const getDiaInf = async (req, res) => {
  try {
    const {
      params: { user: login },
    } = req;
    const dia = await Dias.find({
      Utilizador: login,
    });
    if (!dia) {
      throw new NotFoundError(`Não existem horas nesta data ${ChangeDiaData}`);
    }
    res.status(StatusCodes.OK).json({ dia });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const createDia = async (req, res) => {
  const aUtilizador = await User.findOne({
    _id: req.body.Utilizador,
  });
  const tipoDeTrabalhoHorasArray = [];
  for (let index = 0; index < Object.keys(req.body.tipoDeTrabalhoHoras).length; index++) {
    const obj = req.body.tipoDeTrabalhoHoras[Object.keys(req.body.tipoDeTrabalhoHoras)[index]];
    let tipoTrabalho = "";
    let horas = "";
    for (let key in obj) {
      if (key == "tipoTrabalho") {
        if (tipoTrabalho !== "") {
          tipoTrabalho += ",";
        }
        tipoTrabalho += obj[key];
      } else if (key == "horas") {
        if (horas !== "") {
          horas += ",";
        }
        horas += obj[key];
      }
    }
    const tipoTrabalhoHoras = await TipoTrabalhoHoras.create({
      projeto: Object.keys(req.body.tipoDeTrabalhoHoras)[index],
      tipoTrabalho: tipoTrabalho,
      horas: horas,
    });
    tipoDeTrabalhoHorasArray.push(tipoTrabalhoHoras);
  }
  const dia = await Dias.create({
    Data: req.body.Data,
    NumeroHoras: req.body.NumeroHoras,
    tipoDeTrabalhoHoras: tipoDeTrabalhoHorasArray,
    Utilizador: aUtilizador._id,
  });

  if (!aUtilizador) {
    throw new NotFoundError(`Não existe um utilizador com id ${userID}`);
  }
  res.status(StatusCodes.CREATED).json({
    dia: {
      Data: dia.Data,
      NumeroHoras: dia.NumeroHoras,
      tipoDeTrabalhoHoras: dia.tipoDeTrabalhoHoras,
      Utilizador: dia.Utilizador,
    },
  });

};



const updateDia = async (req, res) => {
  const { id } = req.params;

  const tipoDeTrabalhoHorasArray = [];
  for (let index = 0; index < Object.keys(req.body.tipoDeTrabalhoHoras).length; index++) {
    const obj = req.body.tipoDeTrabalhoHoras[Object.keys(req.body.tipoDeTrabalhoHoras)[index]];
    let tipoTrabalho = "";
    let horas = "";
    for (let key in obj) {
      if (key == "tipoTrabalho") {
        if (tipoTrabalho !== "") {
          tipoTrabalho += ",";
        }
        tipoTrabalho += obj[key];
      } else if (key == "horas") {
        if (horas !== "") {
          horas += ",";
        }
        horas += obj[key];
      }
    }
    const tipoTrabalhoHoras = await TipoTrabalhoHoras.create({
      projeto: Object.keys(req.body.tipoDeTrabalhoHoras)[index],
      tipoTrabalho: tipoTrabalho,
      horas: horas,
    });
    tipoDeTrabalhoHorasArray.push(tipoTrabalhoHoras);
  }
    const dia = await Dias.findByIdAndUpdate(
      id,
      {
        Data: req.body.Data,
        NumeroHoras: req.body.NumeroHoras,
        tipoDeTrabalhoHoras: tipoDeTrabalhoHorasArray,
      },
      { new: true, runValidators: true }
    );
 
    if (!dia) {
      throw new NotFoundError(`Não existe um dia com id ${diaId}`);
    }
    res.status(StatusCodes.OK).json({ dia });
  };


  const deleteDia = async (req, res) => {
    const { id } = req.params;
    try {
    const dia = await Dias.findById(id);
  
    if (!dia) {
      throw new NotFoundError(`Não existe um dia com id ${id}`);
    }
  
    const tipoDeTrabalhoHorasIds = dia.tipoDeTrabalhoHoras.map(item => item._id);

    const promises = tipoDeTrabalhoHorasIds.map(async tipoDeTrabalhoHoraId => {
      await TipoTrabalhoHoras.findByIdAndRemove(tipoDeTrabalhoHoraId);
    });
  
    await Promise.all(promises);

    await Dias.findByIdAndRemove(id);
  
    res.status(StatusCodes.OK).send();
  }catch (error) {
    res.status(StatusCodes.KO).send();
    console.error(error);
  }
};
  
const exportDias = async(req, res) =>{
  const { userID: userID , userTipo: userTipo} = req.body;

  const user = await User.findOne({
    _id: userID,
  });


  if(!user || user.tipo === 3 || user.tipo === 4){
    if(!user){
    throw new NotFoundError(`Não foi encontrado o utilizador com id ${userID}`);
    }else{
      throw new NotFoundError(`O utilizador ${user.nome} não possui permissões para exportar`);
    }
  }

    let tipo;
    if(userTipo){
      tipo = userTipo;
    }else{
      tipo =user.tipo;
    }

    const exp = await exportExcell(tipo);


    if(exp){
      let filePath;
      if(Number(tipo) === 2){
        filePath = process.env.EXTRACTION_FOLDER;

    } else if(Number(tipo) === 5){
      filePath = process.env.EXTRACTION_FOLDER5;

    } else if(Number(tipo) === 6){
      filePath = process.env.EXTRACTION_FOLDER6;

    } else if(Number(tipo) === 7){
      filePath = process.env.EXTRACTION_FOLDER7;
 
    }else if(Number(tipo) === 8){
      filePath = process.env.EXTRACTION_FOLDER8;
    }
    //const filename = 'SeguimentoHoras.xlsx'
    //res.download(process.env.EXTRACTION_FOLDER, filename);
    res.status(StatusCodes.OK).json(`Ficheiro exportado para: ${filePath}`);
    }else{
      throw new BadRequestError(`Ocorreu um erro ao exportar o ficheiro. Verifique se este se encontra aberto!`);
  }
}

module.exports = {
  getAllDiasProjeto,
  getAllDiasUtilizador,
  getAllDiasUtilizadorTipo,
  getAllDias,
  getDia,
  createDia,
  updateDia,
  deleteDia,
  getDiasProjetoUtilizador,
  getDiasUtilizador,
  exportDias,
};
