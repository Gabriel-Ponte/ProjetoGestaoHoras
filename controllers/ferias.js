const Ferias = require("../models/Ferias");
const User = require("../models/Utilizador");
const Projeto = require("../models/Projeto");
const TipoTrabalho = require("../models/TipoTrabalho");
const { Dias } = require("../models/Dias");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const sanitizeHtml = require('sanitize-html');
const { ObjectId } = require('mongodb');
const { exportExcell } = require("../exportExcellFerias");

const isValidObjectId = (id) => {
  try{
    const check =  ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return check;
  } catch {
    return false;
  }
};

const getAllFerias = async (req, res) => {
  try {
  
    let { sort } = req.query;
    sort = sanitizeHtml(sort);

    const UsersAll = await User.find({ tipo: { $ne: "8" } }, { foto: 0, email: 0, password: 0 });

    // Retrieve necessary data in parallel
    const [projetoGeral, idFerias] = await Promise.all([
      Projeto.findOne({ Tipo: 1 }),
      TipoTrabalho.findOne({ tipo: 7 }),
    ]);

    const feriasID = idFerias._id
    let feriasArray = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    await Promise.all(
      UsersAll.map(async (utilizador) => {
        const userID = utilizador._id;
        const userName = utilizador.nome;
        if (userName !== "Admin") {


          const diasAllProjeto = await Dias.find({
            $or: [{ accepted: 0 }, { accepted: 2 }, { accepted: null }],
            "tipoDeTrabalhoHoras.projeto": projetoGeral._id,
            "tipoDeTrabalhoHoras.tipoTrabalho": feriasID,
            Utilizador: userID,
          });
          let check = false;
          let dias = [];
          try {

          dias = await Ferias.find({ Utilizador: userID })
          check = (dias?.length === 0 || !(dias.filter(dia => dia.Ano === currentYear).length > 0));
            } catch (error) {
              console.error("Error Ferias UTF?" , error)
            }
          if (check) {
            const date = userID.getTimestamp();
            const fullYear = date.getFullYear();
            let auto = 'Automático';
            auto = sanitizeHtml(auto);
            let value = 0;
            if (currentYear > fullYear) {
              value = 22;
            } else {
              const startMonth = date.getMonth();
              value = (12 - (startMonth + 1)) * 2
            }

            await Ferias.create({
              Utilizador: userID,
              UtilizadorResponsavel: auto,
              Numero: value,
              Ano: currentDate.getFullYear(),
            });
            dias = await Ferias.find({ Utilizador: userID })
          }
          
          for (let d = 0; d < dias?.length; d++) {
            try {
              const responsavelID = dias[d].UtilizadorResponsavel;
              if (isValidObjectId(responsavelID)) {
                const user = await User.findOne({
                  _id: responsavelID,
                });

                if (user) {
                  dias[d].UtilizadorResponsavel = user.nome;
                }
              }
            } catch (error) {
              console.error("Error Ferias", error)
            }
          }



          if (!feriasArray[userName + "," + userID]) {
            feriasArray[userName + "," + userID] = [];
          }
          // Assign utilizador.Nome to dias.Utilizador
          feriasArray[userName + "," + userID].push([...diasAllProjeto], [...dias]);
        }
      })
    );

    feriasArray = await sortFeriasTipo(feriasArray, sort)

    return res.status(StatusCodes.CREATED).json({ feriasArray });
  } catch (error) {
    console.error("getAllFerias", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};



const getAllFeriasGroup = async (req, res) => {
  try {
    
    let {
      params: { utilizador },
    } = req;

    utilizador = sanitizeHtml(utilizador);


    let users = []

    if (Number(utilizador) === 1) {
      users = await User.find({ tipo: { $in: [1, 5] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(utilizador) === 2) {
      users = await User.find({ tipo: { $in: [2, 5, 6] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(utilizador) === 3) {
      users = await User.find({ tipo: { $in: [3, 6] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(utilizador) === 4) {
      users = await User.find({ tipo: { $in: [4, 7] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(utilizador) === 5) {


      let userId = req?.user?.userId || null;

      users = await User.find({ responsavel: { $in: userId } }, { foto: 0, email: 0, password: 0 });
    }

    if (!users.length) {
      throw new NotFoundError(`Nenhum utilizador encontrado com o tipo ${utilizador}.`);
    }


    // Retrieve necessary data in parallel
    const [projetoGeral, idFerias] = await Promise.all([
      Projeto.findOne({ Tipo: 1 }),
      TipoTrabalho.findOne({ tipo: 7 }),
    ]);

    const feriasID = idFerias._id
    let feriasArray = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const userIds = users.map(user => user._id);

    const diasAllProjeto = await Dias.find({
      $or: [{ accepted: 0 }, { accepted: 2 }, { accepted: null }],
      "tipoDeTrabalhoHoras.projeto": projetoGeral._id,
      "tipoDeTrabalhoHoras.tipoTrabalho": feriasID,
       Utilizador: { $in: userIds }
    });

    await Promise.all(
      users.map(async (utilizador) => {
        const userID = utilizador?._id?.toString();;
        const userName = utilizador.nome;
        if (userName !== "Admin") {

          const insertedFeriasUser = (diasAllProjeto.filter(dia => dia.Utilizador === userID));
          let dias = [];
          try {
              dias = await Ferias.find({ Utilizador: userID })
            } catch (error) {
              console.error("Error Ferias UTF-8?" , error)
            }
          for (let d = 0; d < dias?.length; d++) {
            try {
              const responsavelID = dias[d].UtilizadorResponsavel;
              if (isValidObjectId(responsavelID)) {
                const user = await User.findOne({
                  _id: responsavelID,
                });

                if (user) {
                  dias[d].UtilizadorResponsavel = user.nome;
                }
              }
            } catch (error) {
              console.error("Error Ferias", error)
            }
          }
          if (!feriasArray[userName + "," + userID]) {
            feriasArray[userName + "," + userID] = [];
          }
          // Assign utilizador.Nome to dias.Utilizador
          feriasArray[userName + "," + userID].push([...insertedFeriasUser], [...dias]);
        }
      })
    );


    return res.status(StatusCodes.CREATED).json({ feriasArray });
  } catch (error) {
    console.error("getAllFeriasGroup", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};
const getFeriasUtilizador = async (req, res) => {
  try {
    let { id } = req.params;
    id = sanitizeHtml(id);
    
    if(!isValidObjectId(id)){
      throw new NotFoundError(`Não foram encontradas horas inseridas`);
    }

    const user = await User.findById(id);


    if (!user) {
      throw new NotFoundError(`Não foi encontrado utilizador`);
    }

    // Retrieve necessary data in parallel
    const [projetoGeral, idFerias] = await Promise.all([
      Projeto.findOne({ Tipo: 1 }),
      TipoTrabalho.findOne({ tipo: 7 }),
    ]);

    if (!projetoGeral || !idFerias) {
      throw new NotFoundError(`Não foi encontrado!`);
    }

    const feriasID = idFerias?._id;
    let feriasArray = [];


    const userID = user?._id;

    const diasAllProjeto = await Dias.find({
      $or: [{ accepted: 0 }, { accepted: 2 }, { accepted: null }],
      "tipoDeTrabalhoHoras.projeto": projetoGeral._id,
      "tipoDeTrabalhoHoras.tipoTrabalho": feriasID,
      Utilizador: userID,
    });

    const diasAllProjetoPorAceitar = await Dias.find({
      $or: [{ accepted: 1 }, { accepted: 8 }],
      "tipoDeTrabalhoHoras.projeto": projetoGeral._id,
      "tipoDeTrabalhoHoras.tipoTrabalho": feriasID,
      Utilizador: userID,
    });

    let dias = await Ferias.find({ Utilizador: userID });

    for (let d = 0; d < dias.length; d++) {
      try {
        const responsavelID = dias[d].UtilizadorResponsavel;
        if (isValidObjectId(responsavelID)) {
          const user = await User.findOne({
            _id: responsavelID,
          });

          if (user) {
            dias[d].UtilizadorResponsavel = user.nome;
          }
        }
      } catch (error) {
        console.error("Error Ferias", error)
      }
    }

    // Assign utilizador.Nome to dias.Utilizador
    feriasArray.push([...diasAllProjeto], [...dias], [...diasAllProjetoPorAceitar]);

    res.status(StatusCodes.OK).json({ feriasArray });
  } catch (error) {
    console.error("getFeriasUtilizador", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


const sortFeriasTipo = async (result, sort) => {
  let returnResult = {};
  if (sort === "Permitidos" || sort === "-Permitidos") {

    const itemsWithCount = await Promise.all(
      Object.values(result).map(async (item, index) => {
        let count = 0;
        for (let i = 0; i < item[1].length; i++) {
          count += item[1][i].Numero;
        }

        const identifier = Object.keys(result)[index];
        return { item, count, identifier }; // Return the item along with its count and identifier
      })
    );

    // Sort the items based on count
    itemsWithCount.sort((a, b) => {
      return sort === "Permitidos" ? b.count - a.count : a.count - b.count;
    });

    // Rebuild the returnResult object, maintaining the same structure as result
    itemsWithCount.forEach((obj) => {
      returnResult[obj.identifier] = obj.item; // Re-assign the sorted items to returnResult
    });
  } else if (sort === "Inseridos" || sort === "-Inseridos") {
    const itemsWithCount = await Promise.all(
      Object.values(result).map(async (item, index) => {
        let count = item[0].length;
        const identifier = Object.keys(result)[index];
        return { item, count, identifier }; // Return the item along with its count and identifier
      })
    );

    // Sort the items based on count
    itemsWithCount.sort((a, b) => {
      return sort === "Inseridos" ? b.count - a.count : a.count - b.count;
    });

    // Rebuild the returnResult object, maintaining the same structure as result
    itemsWithCount.forEach((obj) => {
      returnResult[obj.identifier] = obj.item; // Re-assign the sorted items to returnResult
    });

  } else if (sort === "PorDar" || sort === "-PorDar") {

    const itemsWithCount = await Promise.all(
      Object.values(result).map(async (item, index) => {
        let count = 0;
        for (let i = 0; i < item[1].length; i++) {
          count += item[1][i].Numero;
        }
        let dados = item[0].length;
        const porDar = dados - count;
        const identifier = Object.keys(result)[index];
        return { item, porDar, identifier }; // Return the item along with its count and identifier
      })
    );

    // Sort the items based on count
    itemsWithCount.sort((a, b) => {
      return sort === "PorDar" ? b.porDar - a.porDar : a.porDar - b.porDar;
    });

    // Rebuild the returnResult object, maintaining the same structure as result
    itemsWithCount.forEach((obj) => {
      returnResult[obj.identifier] = obj.item; // Re-assign the sorted items to returnResult
    });

  } else if (sort === "Utilizador" || sort === "-Utilizador") {
    const itemsWithCount = await Promise.all(
      Object.values(result).map(async (item, index) => {
        const identifier = Object.keys(result)[index];
        return { item, identifier }; // Return the item along with its count and identifier
      })
    );

    // Sort the items based on count
    itemsWithCount.sort((a, b) => {
      if (sort === "Utilizador") {
        return b.identifier.localeCompare(a.identifier); // Sort in descending order
      } else {
        return a.identifier.localeCompare(b.identifier); // Sort in ascending order
      }
    });

    // Rebuild the returnResult object, maintaining the same structure as result
    itemsWithCount.forEach((obj) => {
      returnResult[obj.identifier] = obj.item; // Re-assign the sorted items to returnResult
    });
  } else {
    returnResult = result;
  }

  return returnResult;
}


const addDiasFeriasUtilizador = async (req, res) => {
  try {
    let { id, value, year, responsavel } = req?.body;

    id = sanitizeHtml(id);
    value = sanitizeHtml(value);
    year = sanitizeHtml(year);
    responsavel = sanitizeHtml(responsavel);

    const user = await User.findOne({
      _id: id,
    });

    const userResponsavel = await User.findOne({
      _id: responsavel,
    });

    if (!user) {
      throw new NotFoundError(`Nenhum utilizador com id: ${id}`);
    } else if (!userResponsavel) {
      throw new NotFoundError(`Nenhum utilizador com id: ${responsavel}`);
    } else if (!value || !year) {
      throw new NotFoundError(`Insira todos os valores`);
    }



    await Ferias.create({
      Utilizador: id.trim(),
      UtilizadorResponsavel: responsavel.trim(),
      Numero: value,
      Ano: year,
    });

    res.status(StatusCodes.CREATED).json("Dias inseridos!");
  } catch (error) {
    console.error("addDiasFeriasUtilizador", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};



const getAllFeriasExcell = async (tipo , userId, projetoGeral, idFerias) => {
  try {


    let users = []
    if (Number(tipo) === 0) {
      users = await User.find({ tipo: { $in: [1,2,3,4, 5,6,7,9,10,11,12] } }, { foto: 0, email: 0, password: 0 });
    }
    if (Number(tipo) === 1) {
      users = await User.find({ tipo: { $in: [1, 5] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(tipo) === 2) {
      users = await User.find({ tipo: { $in: [2, 5, 6, 7] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(tipo) === 3) {
      users = await User.find({ tipo: { $in: [3, 6] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(tipo) === 4) {
      users = await User.find({ tipo: { $in: [4, 7] } }, { foto: 0, email: 0, password: 0 });
    } else if (Number(tipo) === 5) {


      users = await User.find({ responsavel: { $in: userId } }, { foto: 0, email: 0, password: 0 });
    }

    if (!users.length) {
      throw new NotFoundError(`Nenhum utilizador encontrado com o tipo ${utilizador}.`);
    }



    const feriasID = idFerias._id
    let feriasArray = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const userIds = users.map(user => user._id);

    const diasAllProjeto = await Dias.find({
      $or: [{ accepted: 0 }, { accepted: 2 }, { accepted: null }],
      "tipoDeTrabalhoHoras.projeto": projetoGeral._id,
      "tipoDeTrabalhoHoras.tipoTrabalho": feriasID,
       Utilizador: { $in: userIds }
    });

    await Promise.all(
      users.map(async (utilizador) => {
        const userID = utilizador?._id?.toString();;
        const userName = utilizador.nome;
        if (userName !== "Admin") {

          const insertedFeriasUser = (diasAllProjeto.filter(dia => dia.Utilizador === userID));
          let dias = [];
          try {
              dias = await Ferias.find({ Utilizador: userID })
            } catch (error) {
              console.error("Error Ferias UTF-8?" , error)
            }
          for (let d = 0; d < dias?.length; d++) {
            try {
              const responsavelID = dias[d].UtilizadorResponsavel;
              if (isValidObjectId(responsavelID)) {
                const user = await User.findOne({
                  _id: responsavelID,
                });

                if (user) {
                  dias[d].UtilizadorResponsavel = user.nome;
                }
              }
            } catch (error) {
              console.error("Error Ferias", error)
            }
          }
          if (!feriasArray[userName + "," + userID]) {
            feriasArray[userName + "," + userID] = [];
          }
          // Assign utilizador.Nome to dias.Utilizador
          feriasArray[userName + "," + userID].push([...insertedFeriasUser], [...dias]);
        }
      })
    );


    return feriasArray;
  } catch (error) {
    console.error("getAllFeriasExcell", error);
    return [];
  }
};


const exportFerias = async (req, res) => {
  try {
    let { userID: userID, date: date , tipo:tipo} = req.body;
    userID = sanitizeHtml(userID);
    date = sanitizeHtml(date);
    tipo = sanitizeHtml(tipo);

    console.log(tipo)
    const user = await User.findOne({
      _id: userID,
    });


    if (!user || user.tipo === 3 || user.tipo === 4) {
      if (!user) {
        throw new NotFoundError(`Não foi encontrado o utilizador com id ${userID}`);
      } else {
        throw new NotFoundError(`O utilizador ${user.nome} não possui permissões para exportar`);
      }
    }

    let exp = false

    let userId = req?.user?.userId || null;
    // Retrieve necessary data in parallel
    const [projetoGeral, idFerias] = await Promise.all([
      Projeto.findOne({ Tipo: 1 }),
      TipoTrabalho.findOne({ tipo: 7 }),
    ]);

    const listaFerias = await getAllFeriasExcell(tipo, userId, projetoGeral, idFerias);
    
    exp = await exportExcell(listaFerias ,tipo, projetoGeral, date);
 

    if (exp) {
      let filePath = exp;
      //const filename = 'SeguimentoHoras.xlsx'
      //res.download(process.env.EXTRACTION_FOLDER, filename);
      res.status(StatusCodes.OK).json(`Ficheiro exportado para: ${filePath}`);
    } else {
      throw new BadRequestError(`Ocorreu um erro ao exportar o ficheiro. Verifique se este se encontra aberto!`);
    }
  } catch (error) {
    console.error("exportDias ", error);
    throw new BadRequestError(`Ocorreu um erro ao exportar o ficheiro. Verifique se este se encontra aberto!`);
  }
}

const deleteDiasFerias = async (req, res) => {
  try {
    let { id } = req.params;

    id = sanitizeHtml(id);

    const diaFerias = await Ferias.findById(id);

    if (!diaFerias) {
      throw new NotFoundError(`Não existe um dia com id ${id}`);
    }

    await Ferias.findOneAndDelete({ _id: id });

    res.status(StatusCodes.OK).send();
  } catch (error) {
    console.error("deleteDiasFerias", error);
  }
}
module.exports = {
  getAllFerias,
  getFeriasUtilizador,
  addDiasFeriasUtilizador,
  deleteDiasFerias,
  getAllFeriasGroup,
  exportFerias,
};
