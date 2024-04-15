const Pagamentos = require("../models/Pagamentos");
const User = require("../models/Utilizador");

const { StatusCodes } = require("http-status-codes");


const getAllPagamentos = async (req, res) => {
  try {
    const { sort } = req.query;

    let result = Pagamentos.find();
    if (sort){
      if(sort === "Mes") {
        result = await result; 
        result = result.sort((a, b) => {
          const mesA = (a.Mes < 10 ? '0' : '') + a.Mes;
          const mesB = (b.Mes < 10 ? '0' : '') + b.Mes;
    
          const dataA = parseInt(`${a.Ano}${mesA}`, 10); 
          const dataB = parseInt(`${b.Ano}${mesB}`, 10); 
    
          if (dataA < dataB) {
            return -1; 
          }
          if (dataA > dataB) {
            return 1;
          }
          return 0;
        });
      }
    else if(sort === "-Mes")  {
      result = await result; 
      result = result.sort((a, b) => {
        const mesA = (a.Mes < 10 ? '0' : '') + a.Mes;
        const mesB = (b.Mes < 10 ? '0' : '') + b.Mes;
  
        const dataA = parseInt(`${a.Ano}${mesA}`, 10); 
        const dataB = parseInt(`${b.Ano}${mesB}`, 10); 
  
        if (dataA < dataB) {
          return 1; 
        }
        if (dataA > dataB) {
          return -1;
        }
        return 0;
      });
    }  else if(sort === "-Horas")  {
      result = await result; 
      result = result.sort((a, b) => {
        const horasA = parseFloat(a.Horas);
        const horasB = parseFloat(b.Horas);

  
        if (horasA > horasB) {
          return 1; 
        }
        if (horasA < horasB) {
          return -1;
        }
        return 0;
      });
    }  else if(sort === "Horas")  {
      result = await result; 
      result = result.sort((a, b) => {
        const horasA = parseFloat(a.Horas);
        const horasB = parseFloat(b.Horas);

  
        if (horasA < horasB) {
          return 1; 
        }
        if (horasA > horasB) {
          return -1;
        }
        return 0;
      });
    } else {
      result = await result.sort(sort);
    }
  } else {
      result = await result; 
      result.sort((a, b) => {
        const mesA = (a.Mes < 10 ? '0' : '') + a.Mes;
        const mesB = (b.Mes < 10 ? '0' : '') + b.Mes;
  
        const dataA = parseInt(`${a.Ano}${mesA}`, 10); 
        const dataB = parseInt(`${b.Ano}${mesB}`, 10); 
  
        if (dataA < dataB) {
          return -1; 
        }
        if (dataA > dataB) {
          return 1;
        }
        return 0;
      });
    }

    const pagamentosAll  = await result;

    if (!pagamentosAll.length) {
      throw new NotFoundError(`Não foram encontradas horas inseridas`);
    }

    res.status(StatusCodes.OK).json({ pagamentosAll });
  } catch (error) {
    console.error("error", error)
    // Handle the error, e.g., send an error response.
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllPagamentosUtilizador = async (req, res) => {
    try {

      const utilizador = req.params.id;

      const aUtilizador = await User.findOne({
        _id: utilizador,
      });

      if (!aUtilizador) {
        throw new NotFoundError(`Não existe um utilizador com id ${Utilizador}`);
      }

      const pagamentosAllUtilizador = await Pagamentos.find({ Utilizador: utilizador });

      if (!pagamentosAllUtilizador.length) {
        throw new NotFoundError(`Não foram encontradas horas inseridas`);
      }
  
      pagamentosAllUtilizador.sort((a, b) => {
        const mesA = (a.Mes < 10 ? '0' : '') + a.Mes;
        const mesB = (b.Mes < 10 ? '0' : '') + b.Mes;

        const dataA = parseInt(`${a.Ano}${mesA}`, 10); 
        const dataB = parseInt(`${b.Ano}${mesB}`, 10); 

        if (dataA < dataB) {
          return -1; 
        }
        if (dataA > dataB) {
          return 1;
        }
        return 0;
      });

      res.status(StatusCodes.OK).json({ pagamentosAllUtilizador });

    } catch (error) {
      // Handle the error, e.g., send an error response.
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };
  
  const getAllPagamentosUtilizadorResponsavel = async (req, res) => {
    try {

      const utilizador = req.params.id;

      const aUtilizador = await User.findOne({
        _id: utilizador,
      });

      if (!aUtilizador) {
        throw new NotFoundError(`Não existe um utilizador com id ${Utilizador}`);
      }

      const pagamentosAllUtilizadorResponsavel = await Pagamentos.find({ UtilizadorResponsavel: utilizador });

      if (!pagamentosAllUtilizadorResponsavel.length) {
        throw new NotFoundError(`Não foram encontradas horas inseridas`);
      }
  
      pagamentosAllUtilizadorResponsavel.sort((a, b) => {
        const mesA = (a.Mes < 10 ? '0' : '') + a.Mes;
        const mesB = (b.Mes < 10 ? '0' : '') + b.Mes;

        const dataA = parseInt(`${a.Ano}${mesA}`, 10); 
        const dataB = parseInt(`${b.Ano}${mesB}`, 10); 

        if (dataA < dataB) {
          return -1; 
        }
        if (dataA > dataB) {
          return 1;
        }
        return 0;
      });


      pagamentosAllUtilizadorResponsavel.sort((a, b) => {
        return a.Utilizador.localeCompare(b.Utilizador);
      });
      
      res.status(StatusCodes.OK).json({ pagamentosAllUtilizadorResponsavel });
      
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };



  const getPagamentosUtilizadorMes = async (req, res) => {
    try {
      
      const {selectedUserID , day} = req.body;

      const aUtilizador = await User.findOne({
        _id: selectedUserID,
      });

      if (!aUtilizador) {
        throw new NotFoundError(`Não existe um utilizador com id ${aUtilizador}`);
      }

      const data = new Date(day);

      const month = data?.getMonth(); 
      const year = data?.getFullYear();

      const pagamentos = await Pagamentos.find({ Utilizador: selectedUserID, Mes:month , Ano: year});
      if (!pagamentos?.length) {
        throw new NotFoundError(`Não foram encontradas horas inseridas`);
      }

      res.status(StatusCodes.OK).json({ pagamentos });
    } catch (error) {
      // Handle the error, e.g., send an error response.
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };

  const addPagamentosUtilizador = async (req, res) => { 
    try {

      const {Utilizador,  UtilizadorResponsavel, Mes,  Ano,  Horas} = req?.body;
      const aUtilizador = await User.findOne({
        _id: Utilizador,
      });
      const aUtilizadorResponsavel = await User.findOne({
        _id: UtilizadorResponsavel,
      });


      if (!aUtilizador) {
        throw new NotFoundError(`Não existe um utilizador com id ${Utilizador}`);
      }else if (!aUtilizadorResponsavel){
        throw new NotFoundError(`Não existe um utilizador com id ${UtilizadorResponsavel}`);
      }

      const pagamento = await Pagamentos.create({
        Utilizador: Utilizador.trim(),
        UtilizadorResponsavel: UtilizadorResponsavel.toString().trim(),
        Mes: Mes,
        Ano: Ano,
        Horas: Horas,
      });
    

      res.status(StatusCodes.CREATED).json({
        pagamento: {
          Utilizador: pagamento.Utilizador,
          UtilizadorResponavel: pagamento.UtilizadorResponsavel,
          Mes: pagamento.Mes,
          Ano: pagamento.Ano,
          Horas: pagamento.Horas,
        },
      });
    
    } catch (error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        console.error('Validation error(s):', error.message);
      } else {
        console.error('Error creating Pagamento:', error);
      }
    }
  };

module.exports = {
    getAllPagamentos,
    getAllPagamentosUtilizador,
    getAllPagamentosUtilizadorResponsavel,
    addPagamentosUtilizador,
    getPagamentosUtilizadorMes,
  };

  