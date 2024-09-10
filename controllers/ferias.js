const Ferias = require("../models/Ferias");
const User = require("../models/Utilizador");
const Projeto = require("../models/Projeto");
const TipoTrabalho = require("../models/TipoTrabalho");
const { Dias } = require("../models/Dias");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const sanitizeHtml = require('sanitize-html');
const { ObjectId } = require('mongodb');


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
};
