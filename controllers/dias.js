const { Dias, TipoTrabalhoHoras } = require("../models/Dias");
const TipoTrabalho = require("../models/TipoTrabalho");
const User = require("../models/Utilizador");
const Projeto = require("../models/Projeto");
const sgMail = require('@sendgrid/mail');

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { exportExcell } = require("../exportExcellHours");


const { exportExcellHoursProjetos } = require("../exportExcellHoursProjetos");
const { log, Console } = require("console");
const { json } = require("body-parser");

const getAllDias = async (req, res) => {
  try {

    const diasAll = await Dias.find({
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ]
    });
    
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


const getTipoValue = async (tipoTrabalhoHoras) => {
  let tipo = 1;
  for (let i = 0; i < tipoTrabalhoHoras.length; i++) {
    const tipoTrabalho = tipoTrabalhoHoras[i].tipoTrabalho;
    const tt = tipoTrabalho.split(',') || [];
    for (let j = 0; j < tt.length; j++) {
      const ttID = tt[j];
      const tipoT = await TipoTrabalho.findOne({ _id: ttID });
      if (tipoT && tipoT.tipo === 4) {
        tipo = 2;
        break;
      }
    }
    if (tipo === 2) {
      break;
    }
  }
  return tipo;
};

const compareTipoValues = (tipoA, tipoB, tipo) => {
  if (tipo === 1) {
    if (tipoA < tipoB) {
      return -1;
    } else if (tipoA > tipoB) {
      return 1;
    } else {
      return 0;
    }

  } else if (tipo === 2) {
    if (tipoA > tipoB) {
      return -1;
    }
    if (tipoA < tipoB) {
      return 1;
    } else {
      return 0;
    }
  }
};


const sortHorasExtraTipo = async (result, sort) => {
  if (sort === "Tipo" || sort === "-Tipo") {
    result = await result;

    const promises = result.map(async (item) => {

      const tipoValue = await getTipoValue(item.tipoDeTrabalhoHoras);
      return { item, tipoValue };
    });

    const sortedItems = await Promise.all(promises);


    sortedItems.sort((a, b) => {
      if (sort === "Tipo") {
        return compareTipoValues(a.tipoValue, b.tipoValue, 1)
      } else {
        return compareTipoValues(a.tipoValue, b.tipoValue, 2)
      }
    });

    result = sortedItems.map((item) => item.item)

  }
  return result;
}

const sortHorasExtra = (result, sort) => {
  if (sort === "-Horas") {
    result = result.sort((a, b) => {
      const horasA = parseFloat(a.NumeroHoras);
      const horasB = parseFloat(b.NumeroHoras);

      if (horasA > horasB) {
        return 1;
      }
      if (horasA < horasB) {
        return -1;
      }
      return 0;
    });
  } else if (sort === "Horas") {
    result = result.sort((a, b) => {
      const horasA = parseFloat(a.NumeroHoras);
      const horasB = parseFloat(b.NumeroHoras);

      if (horasA < horasB) {
        return 1;
      }
      if (horasA > horasB) {
        return -1;
      }
      return 0;
    });
  }
  return result;
}




function getFeriadosPortugalDate(date) {

  const feriados = [];

  for (let i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
    feriados.push(
      { name: "Ano Novo", date: new Date(i, 0, 1) },
      { name: "Dia da Liberdade", date: new Date(i, 3, 25) },
      { name: "Dia do Trabalhador", date: new Date(i, 4, 1) },
      { name: "Dia de Portugal", date: new Date(i, 5, 10) },
      { name: "Assunção de Nossa Senhora", date: new Date(i, 7, 15) },
      { name: "Ferias Coletivas", date: new Date(2024, 7, 16) },
      { name: "Implantação da República", date: new Date(i, 9, 5) },
      { name: "Dia de Todos os Santos", date: new Date(i, 10, 1) },
      { name: "Restauração da Independência", date: new Date(i, 11, 1) },
      { name: "Dia da Imaculada Conceição", date: new Date(i, 11, 8) },
      { name: "Feriado Municipal", date: new Date(i, 2, 12) },
      { name: "Ferias Coletivas", date: new Date(2024, 11, 24) },
      { name: "Natal", date: new Date(i, 11, 25) },
      { name: "Ferias Coletivas", date: new Date(2024, 11, 26) },
      { name: "Ferias Coletivas", date: new Date(2023, 11, 26) },
      { name: "Ferias Coletivas", date: new Date(2024, 11, 31) },
      { name: "Carnaval", date: calculateEaster(i, "Carnaval") },
      { name: "Sexta-feira Santa", date: calculateEaster(i, "SextaFeiraSanta") },
      { name: "Páscoa", date: calculateEaster(i, "DomingoPascoa") },
      { name: "Segunda-feira de Páscoa", date: new Date(2023, 3, 10) }, //{ name: "Segunda-feira de Páscoa", date: calculateEaster(i, "SegundaPascoa") },
      { name: "Corpo de Deus", date: calculateCorpusChristi(i) },
    );
  }

  for (const feriado of feriados) {
    if (
      date.getDate() === feriado.date.getDate() &&
      date.getMonth() === feriado.date.getMonth() &&
      date.getFullYear() === feriado.date.getFullYear()
    ) {
      return feriado?.name;
    }
  }
  return false;
}


function calculateEaster(year, type) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    if (type === "SextaFeiraSanta") {
      return new Date(year, month, day - 2);
    } else if (type === "DomingoPascoa") {
      return new Date(year, month, day);
    } else if (type === "SegundaPascoa") {
      return new Date(year, month, day + 1);
    } else if (type === "Carnaval") {
      return new Date(year, month, day - 47);
    }
  }

  function calculateCorpusChristi(ano) {
    const domingoPascoa = calculateEaster(ano, "DomingoPascoa");
    return new Date(ano, domingoPascoa.getMonth(), domingoPascoa.getDate() + 60);
  }


  const getAllDiasHorasExtra = async (req, res) => {
    try {
      const { sort, tipo } = req.query;
  
      // Initial query to get Dias: 1
      let result = Dias.find({ accepted: 1 });
  
      // Sorting
      if (sort) {
        if (sort === "Tipo" || sort === "-Tipo") {
          result = sortHorasExtraTipo(result, sort); 
        } else if (sort === "Horas" || sort === "-Horas") {
          result = sortHorasExtra(result, sort);
        } else {
          result = result.sort(sort);
        }
      }
  
      let diasHorasExtra = await result;
      const indicesToRemove = [];
      const indicesNotToRemove = [];
      // Process tipoDeTrabalhoHoras
      await Promise.all(
        diasHorasExtra.map(async (dia) => {
          const tt = dia.tipoDeTrabalhoHoras;
          let tipoTrT = 0;
  
          // Processing each project
          await Promise.all(
            dia.tipoDeTrabalhoHoras.map(async (projeto , index) => {
              const indexDia = diasHorasExtra.indexOf(dia);
              // Finding the project
              const foundProjeto = await Projeto.findOne({ _id: projeto.projeto });
              if (foundProjeto) {
                projeto.projeto = foundProjeto.Nome;
              }
  
              // Processing tipoTrabalho
              const tipoT = projeto.tipoTrabalho.split(",");
              for (let i = 0; i < tipoT.length; i++) {
                const ttFound = await TipoTrabalho.findOne({ _id: tipoT[i] });
                if (ttFound) {
                  tipoT[i] = ttFound.TipoTrabalho;
                  if (ttFound.tipo === 4) {
                    tipoTrT = 3;
                  }
                }
              }
              projeto.tipoTrabalho = tipoT.join(",");
  
              if ((tipo === "3" && tipoTrT !== 3) || (tipo === "2" && tipoTrT === 3)) {      
                if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) ||indicesToRemove && (indicesToRemove.includes(indexDia))) {
              } else {
                  indicesToRemove.push(indexDia);
              }
  
              } else if((tipo === "3" && tipoTrT === 3) ){
                try {
                  indicesNotToRemove.push(indexDia);
                  
                  if(indicesToRemove && indicesToRemove.includes(indexDia)){
                    indicesToRemove.remove(indexDia);
                  }
                } catch (error) {
                    console.error(error)
                } 
              }
            })
          );
  
          // Handling associated days for tipo = 1
          if (tipo === "1") {
            const date = new Date(dia?.Data);
            const dayOfWeek = date.getDay();
            const isSunday = dayOfWeek === 0;
            if (isSunday) {
              const associatedDay = await Dias.findOne({ associated: dia?._id });
              if (associatedDay) {
                const diaAssociated = {
                  _id: associatedDay?._id?.toString(),
                  _id_D: associatedDay?._id_D?.toString(),
                  Data: associatedDay?.Data?.toString(),
                  NumeroHoras: associatedDay?.NumeroHoras?.toString(),
                  tipoDeTrabalhoHoras: associatedDay?.tipoDeTrabalhoHoras,
                  Utilizador: associatedDay?.Utilizador?.toString(),
                  accepted: associatedDay?.accepted,
                  associated: associatedDay?.associated?.toString(),
                  createdAt: associatedDay?.createdAt?.toString(),
                  updatedAt: associatedDay?.updatedAt?.toString(),
                };
                dia["associated"] = JSON.stringify([diaAssociated]);
              }
            }
          }
        })
      );
  
  
      
      if (indicesToRemove && indicesToRemove.length > 0) {
        indicesToRemove.sort((a, b) => a - b);
  
        indicesToRemove.reverse().forEach((index) => {
          diasHorasExtra.splice(index, 1);
        });
      }
  
      // Handling associated days for tipo !== 1
      if (tipo !== "1") {
        await Promise.all(
          diasHorasExtra.map(async (dia) => {
            const date = new Date(dia?.Data);
            const dayOfWeek = date.getDay();
            const isSunday = dayOfWeek === 0;
            if (isSunday) {
              const associatedDay = await Dias.findOne({ associated: dia?._id });
              if (associatedDay) {
                const diaAssociated = [{
                  _id: associatedDay?._id?.toString(),
                  _id_D: associatedDay?._id_D?.toString(),
                  Data: associatedDay?.Data?.toString(),
                  NumeroHoras: associatedDay?.NumeroHoras?.toString(),
                  tipoDeTrabalhoHoras: associatedDay?.tipoDeTrabalhoHoras,
                  Utilizador: associatedDay?.Utilizador?.toString(),
                  accepted: associatedDay?.accepted,
                  associated: associatedDay?.associated?.toString(),
                  createdAt: associatedDay?.createdAt?.toString(),
                  updatedAt: associatedDay?.updatedAt?.toString(),
                }];
                dia["associated"] = JSON.stringify(diaAssociated);
              }
            }
          })
        );
      }
  
      // Sending response
      res.status(StatusCodes.OK).json({ diasHorasExtra });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };




const getAllDiasHorasExtraAccepted = async (req, res) => {
  try {
    const { sort, tipo } = req.query;

    // Initial query to get Dias with accepted: 2
    let result = Dias.find({ accepted: 2 });

    // Sorting
    if (sort) {
      if (sort === "Tipo" || sort === "-Tipo") {
        result = sortHorasExtraTipo(result, sort); // Assuming sortHorasExtraTipo is an efficient function
      } else if (sort === "Horas" || sort === "-Horas") {
        result = sortHorasExtra(result, sort); // Assuming sortHorasExtra is an efficient function
      } else {
        result = result.sort(sort); // Mongoose sort function
      }
    }

    let diasHorasExtra = await result;
    const indicesToRemove = [];
    const indicesNotToRemove = [];
    // Process tipoDeTrabalhoHoras
    await Promise.all(
      diasHorasExtra.map(async (dia) => {
        const tt = dia.tipoDeTrabalhoHoras;
        let tipoTrT = 0;

        // Processing each project
        await Promise.all(
          dia.tipoDeTrabalhoHoras.map(async (projeto , index) => {
            const indexDia = diasHorasExtra.indexOf(dia);
            // Finding the project
            const foundProjeto = await Projeto.findOne({ _id: projeto.projeto });
            if (foundProjeto) {
              projeto.projeto = foundProjeto.Nome;
            }

            // Processing tipoTrabalho
            const tipoT = projeto.tipoTrabalho.split(",");
            for (let i = 0; i < tipoT.length; i++) {
              const ttFound = await TipoTrabalho.findOne({ _id: tipoT[i] });
              if (ttFound) {
                tipoT[i] = ttFound.TipoTrabalho;
                if (ttFound.tipo === 4) {
                  tipoTrT = 3;
                }
              }
            }
            projeto.tipoTrabalho = tipoT.join(",");

            if ((tipo === "3" && tipoTrT !== 3) || (tipo === "2" && tipoTrT === 3)) {      
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) ||indicesToRemove && (indicesToRemove.includes(indexDia))) {
            } else {
                indicesToRemove.push(indexDia);
            }

            } else if((tipo === "3" && tipoTrT === 3) ){
              try {
                indicesNotToRemove.push(indexDia);
                
                if(indicesToRemove && indicesToRemove.includes(indexDia)){
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                  console.error(error)
              } 
            }
          })
        );

        // Handling associated days for tipo = 1
        if (tipo === "1") {
          const date = new Date(dia?.Data);
          const dayOfWeek = date.getDay();
          const isSunday = dayOfWeek === 0;
          if (isSunday) {
            const associatedDay = await Dias.findOne({ associated: dia?._id });
            if (associatedDay) {
              const diaAssociated = {
                _id: associatedDay?._id?.toString(),
                _id_D: associatedDay?._id_D?.toString(),
                Data: associatedDay?.Data?.toString(),
                NumeroHoras: associatedDay?.NumeroHoras?.toString(),
                tipoDeTrabalhoHoras: associatedDay?.tipoDeTrabalhoHoras,
                Utilizador: associatedDay?.Utilizador?.toString(),
                accepted: associatedDay?.accepted,
                associated: associatedDay?.associated?.toString(),
                createdAt: associatedDay?.createdAt?.toString(),
                updatedAt: associatedDay?.updatedAt?.toString(),
              };
              dia["associated"] = JSON.stringify([diaAssociated]);
            }
          }
        }
      })
    );


    
    if (indicesToRemove && indicesToRemove.length > 0) {
      indicesToRemove.sort((a, b) => a - b);

      indicesToRemove.reverse().forEach((index) => {
        diasHorasExtra.splice(index, 1);
      });
    }

    // Handling associated days for tipo !== 1
    if (tipo !== "1") {
      await Promise.all(
        diasHorasExtra.map(async (dia) => {
          const date = new Date(dia?.Data);
          const dayOfWeek = date.getDay();
          const isSunday = dayOfWeek === 0;
          if (isSunday) {
            const associatedDay = await Dias.findOne({ associated: dia?._id });
            if (associatedDay) {
              const diaAssociated = [{
                _id: associatedDay?._id?.toString(),
                _id_D: associatedDay?._id_D?.toString(),
                Data: associatedDay?.Data?.toString(),
                NumeroHoras: associatedDay?.NumeroHoras?.toString(),
                tipoDeTrabalhoHoras: associatedDay?.tipoDeTrabalhoHoras,
                Utilizador: associatedDay?.Utilizador?.toString(),
                accepted: associatedDay?.accepted,
                associated: associatedDay?.associated?.toString(),
                createdAt: associatedDay?.createdAt?.toString(),
                updatedAt: associatedDay?.updatedAt?.toString(),
              }];
              dia["associated"] = JSON.stringify(diaAssociated);
            }
          }
        })
      );
    }

    // Sending response
    res.status(StatusCodes.OK).json({ diasHorasExtra });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllDiasHorasExtraDeclined = async (req, res) => {
  try {
    const { sort, tipo } = req.query;

    // Initial query to get Dias with accepted: 3 Declined
    let result = Dias.find({ accepted: 3 });

    // Sorting
    if (sort) {
      if (sort === "Tipo" || sort === "-Tipo") {
        result = sortHorasExtraTipo(result, sort); 
      } else if (sort === "Horas" || sort === "-Horas") {
        result = sortHorasExtra(result, sort); 
      } else {
        result = result.sort(sort); // Mongoose sort function
      }
    }

    let diasHorasExtra = await result;
    const indicesToRemove = [];
    const indicesNotToRemove = [];
    // Process tipoDeTrabalhoHoras
    await Promise.all(
      diasHorasExtra.map(async (dia) => {
        const tt = dia.tipoDeTrabalhoHoras;
        let tipoTrT = 0;

        // Processing each project
        await Promise.all(
          dia.tipoDeTrabalhoHoras.map(async (projeto , index) => {
            const indexDia = diasHorasExtra.indexOf(dia);
            // Finding the project
            const foundProjeto = await Projeto.findOne({ _id: projeto.projeto });
            if (foundProjeto) {
              projeto.projeto = foundProjeto.Nome;
            }

            // Processing tipoTrabalho
            const tipoT = projeto.tipoTrabalho.split(",");
            for (let i = 0; i < tipoT.length; i++) {
              const ttFound = await TipoTrabalho.findOne({ _id: tipoT[i] });
              if (ttFound) {
                tipoT[i] = ttFound.TipoTrabalho;
                if (ttFound.tipo === 4) {
                  tipoTrT = 3;
                }
              }
            }
            projeto.tipoTrabalho = tipoT.join(",");

            if ((tipo === "3" && tipoTrT !== 3) || (tipo === "2" && tipoTrT === 3)) {      
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) ||indicesToRemove && (indicesToRemove.includes(indexDia))) {
            } else {
                indicesToRemove.push(indexDia);
            }

            } else if((tipo === "3" && tipoTrT === 3) ){
              try {
                indicesNotToRemove.push(indexDia);
                
                if(indicesToRemove && indicesToRemove.includes(indexDia)){
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                  console.error(error)
              } 
            }
          })
        );

        // Handling associated days for tipo = 1
        if (tipo === "1") {
          const date = new Date(dia?.Data);
          const dayOfWeek = date.getDay();
          const isSunday = dayOfWeek === 0;
          if (isSunday) {
            const associatedDay = await Dias.findOne({ associated: dia?._id });
            if (associatedDay) {
              const diaAssociated = {
                _id: associatedDay?._id?.toString(),
                _id_D: associatedDay?._id_D?.toString(),
                Data: associatedDay?.Data?.toString(),
                NumeroHoras: associatedDay?.NumeroHoras?.toString(),
                tipoDeTrabalhoHoras: associatedDay?.tipoDeTrabalhoHoras,
                Utilizador: associatedDay?.Utilizador?.toString(),
                accepted: associatedDay?.accepted,
                associated: associatedDay?.associated?.toString(),
                createdAt: associatedDay?.createdAt?.toString(),
                updatedAt: associatedDay?.updatedAt?.toString(),
              };
              dia["associated"] = JSON.stringify([diaAssociated]);
            }
          }
        }
      })
    );


    
    if (indicesToRemove && indicesToRemove.length > 0) {
      indicesToRemove.sort((a, b) => a - b);

      indicesToRemove.reverse().forEach((index) => {
        diasHorasExtra.splice(index, 1);
      });
    }

    // Handling associated days for tipo !== 1
    if (tipo !== "1") {
      await Promise.all(
        diasHorasExtra.map(async (dia) => {
          const date = new Date(dia?.Data);
          const dayOfWeek = date.getDay();
          const isSunday = dayOfWeek === 0;
          if (isSunday) {
            const associatedDay = await Dias.findOne({ associated: dia?._id });
            if (associatedDay) {
              const diaAssociated = [{
                _id: associatedDay?._id?.toString(),
                _id_D: associatedDay?._id_D?.toString(),
                Data: associatedDay?.Data?.toString(),
                NumeroHoras: associatedDay?.NumeroHoras?.toString(),
                tipoDeTrabalhoHoras: associatedDay?.tipoDeTrabalhoHoras,
                Utilizador: associatedDay?.Utilizador?.toString(),
                accepted: associatedDay?.accepted,
                associated: associatedDay?.associated?.toString(),
                createdAt: associatedDay?.createdAt?.toString(),
                updatedAt: associatedDay?.updatedAt?.toString(),
              }];
              dia["associated"] = JSON.stringify(diaAssociated);
            }
          }
        })
      );
    }

    // Sending response
    res.status(StatusCodes.OK).json({ diasHorasExtra });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const acceptDiasHorasExtra = async (req, res) => {
  const { id } = req.params;

  const dia = await Dias.findByIdAndUpdate(
    id,
    {
      accepted: 2,
    },
    { new: true, runValidators: true }
  );
  const associatedDay = await Dias.findOne({ associated: id });

  if(associatedDay) {

      const idAss = associatedDay?._id;
      await Dias.findByIdAndUpdate(
        idAss,
        {
          accepted: 5,
        },
        { new: true, runValidators: true }
      );
  }
  if (!dia) {
    throw new NotFoundError(`Não existe um dia com id ${id}`);
  }
  res.status(StatusCodes.OK).json({ dia });
};


const declineDiasHorasExtra = async (req, res) => {
  const { id } = req.params;

  const diaToDecline = await Dias.findById(id);

  const tipoTrabalhoHoras = diaToDecline.tipoDeTrabalhoHoras;
  const user = await User.findOne({ _id: req.body.Utilizador });
  const email = user?.email;
  let tipo = 1;
  for (let i = 0; i < tipoTrabalhoHoras.length; i++) {
    const tipoTrabalho = tipoTrabalhoHoras[i].tipoTrabalho;

    const tt = tipoTrabalho.split(',') || [];
    for (let j = 0; j < tt.length; j++) {
      ttID = tt[j];
      const tipoT = await TipoTrabalho?.findOne({ _id: ttID });
      if (tipoT.tipo === 4) {
        tipo = 2;
      }
    }

  }
  if (!user || !email) {
    throw new NotFoundError(`Utilizador não encontrado :  ${user}`);
  }


  const dia = await Dias.findByIdAndUpdate(
    id,
    {
      accepted: 3,
    },
    { new: true, runValidators: true }
  );

  const associatedDay = await Dias.findOne({ associated: id });

  if(associatedDay) {
      const idAss = associatedDay?._id;
      await Dias.findByIdAndUpdate(
        idAss,
        {
          accepted: 6,
        },
        { new: true, runValidators: true }
      );
  }

  try {
    const data = new Date(req?.body?.Data)
    const dataDay = data.getDate();
    const dataMonth = data.getMonth() + 1;
    const dataYear = data.getFullYear();
    // Configure the email details
    let mailOptions = ""
    if (tipo === 1) {
      mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Aplicação Gestão Horas - Horas Extra Recusadas',
        html: `
          <p>Horas Extra inseridas para o dia ${dataDay}/${dataMonth}/${dataYear} foram recusadas!</p>
          <p>Por favor, reinsira as horas relativas a este dia e certifique-se de que todos os valores correspondem á realidade.</p>
          <p>Se precisar de informações adicionais ou tiver dúvidas sobre este assunto, contacte os Recursos Humanos.</p>
          <p>Agradecemos a sua compreensão e colaboração.</p>`
      };
    } else {

      mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Aplicação Gestão Horas - Compensação de Horas extra Recusada',
        html: `
          <p>Pedido de compensação de Horas Extra para o dia ${dataDay}/${dataMonth}/${dataYear} foi recusado!</p>
          <p>Por favor, reinsira as horas relativas a este dia.</p>
          <p>Se precisar de informações adicionais ou tiver dúvidas sobre este assunto, contacte os Recursos Humanos.</p>
          <p>Agradecemos a sua compreensão e colaboração.</p> `
      };
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Send the email
    //await transporter.sendMail(mailOptions);

    await sgMail.send(mailOptions);

  } catch (error) {
    console.error("Error Sending email!")
  }
  if (!dia) {
    throw new NotFoundError(`Não existe um dia com id ${id}`);
  }

  res.status(StatusCodes.OK).json({ dia });
};


const getAllDiasUtilizadorTipo = async (req, res) => {
  try {

    const {
      params: { utilizador },
    } = req;


    let users = []

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


    const diasAllUtilizador = await Dias.find({ 
       $nor: [
      { accepted: 3 },
      { accepted: 6 }
    ], Utilizador: { $in: userIds } });

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
    $nor: [
      { accepted: 3 },
      { accepted: 6 }
    ],
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


  const diasAllProjeto = await Dias.find({       $nor: [
    { accepted: 3 },
    { accepted: 6 }
  ], "tipoDeTrabalhoHoras.projeto": projeto });

  if (!diasAllProjeto.length) {
    throw new NotFoundError(`No Dias found`);
  }
  res.status(StatusCodes.OK).json({ diasAllProjeto });
};


const getDiasUtilizador = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const diasUtilizador = await Dias.find({       
    $nor: [
    { accepted: 3 },
    { accepted: 6 }
  ] });
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
    Utilizador: u1._id, "tipoDeTrabalhoHoras.projeto": projeto,      
    $nor: [
      { accepted: 3 },
      { accepted: 6 }
    ],
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
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ],
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


const getDiaID = async (req, res) => {
  try {
    const { id } = req.params;

    const dia = await Dias.findById(id);

    if (!dia) {
      throw new NotFoundError(`Dia não encontrado com o id ${id}`);
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
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ],
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
    accepted: req?.body?.accepted,
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


const createDiaDomingo = async (req, res) => {
  try {
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

  
  const findDia = await Dias.find({
    Utilizador: aUtilizador._id,
    Data: req.body.Data,
  });


  let dia = "";
  if(findDia && findDia.length > 0){
    const id = findDia[0]._id;
    dia = await Dias.findByIdAndUpdate(
      id,
      {
        Data: req.body.Data,
        NumeroHoras: req.body.NumeroHoras,
        tipoDeTrabalhoHoras: tipoDeTrabalhoHorasArray,
        accepted: req?.body?.accepted,
      },
      { new: true, runValidators: true }
    );
  
  } else{
      dia = await Dias.create({
        Data: req.body.Data,
        NumeroHoras: req.body.NumeroHoras,
        tipoDeTrabalhoHoras: tipoDeTrabalhoHorasArray,
        Utilizador: aUtilizador._id,
        accepted: req?.body?.accepted,
      });
  }

  const findProjetoGeral =  await Projeto.findOne({ Tipo: 1 });
  let idProjeto = "";

  if(!findProjetoGeral){
    const projetoGeral =  await Projeto.findOne({ Nome: "Geral" });
    idProjeto = projetoGeral?._id;
     await Projeto.findByIdAndUpdate(
      idProjeto,
      {
        Tipo: 1
      },
      { new: true, runValidators: true }
    );
  
  } else{
    idProjeto = findProjetoGeral?._id;
  }


  
  if(req?.body?.associated){
    const data = new Date(req?.body?.associated);
    const tipoDeTrabalhoHorasArrayA = [];

    const [findDiaAssociated1, findDiaAssociated2] = await Promise.all([
      Dias.find({ associated: dia?._id ,      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ]}),
      Dias.find({ Utilizador: aUtilizador._id, Data: data ,      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ] })
    ]);
    
    const findDiaAssociated = findDiaAssociated1.length > 0 ? findDiaAssociated1 : findDiaAssociated2;

    const dayOfWeek = data.getDay();
    const isFriday = dayOfWeek === 5;

    const findTT = await TipoTrabalho.findOne({
      tipo: 6,

    });
    let horasA = 8.5;
    if(isFriday) {
      horasA = 6;
    }

    const tipoTrabalhoHorasA = await TipoTrabalhoHoras.create({
      projeto: idProjeto,
      tipoTrabalho: findTT.id,
      horas: horasA,
    });

    tipoDeTrabalhoHorasArrayA.push(tipoTrabalhoHorasA);

    if(findDiaAssociated && findDiaAssociated.length > 0){

      const id = findDiaAssociated[0]?._id;


      await Dias.findByIdAndUpdate(
        id,
        {
          Data: data,
          NumeroHoras: horasA,
          tipoDeTrabalhoHoras: tipoDeTrabalhoHorasArrayA,
          accepted: 4,
          associated: dia?._id,
        }
      );

    } else{
      await Dias.create({
        Data: data,
        NumeroHoras: horasA ,
        tipoDeTrabalhoHoras: tipoDeTrabalhoHorasArrayA,
        Utilizador: aUtilizador._id,
        accepted: 4,
        associated: dia?._id,
      });

    }
  }


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
} catch (error) {
    console.error(error)
}
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
      accepted: req?.body?.accepted,
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

    const data = new Date(dia.Data);
    const dayOfWeek = data.getDay();
    const isSunday = dayOfWeek === 0;

    if(dia.accepted && (dia.accepted === 4 || dia.accepted === 5)){
      const idAss = dia.associated;

      const diaAss = await Dias.findById(idAss);

      if(diaAss){
      const tipoDeTrabalhoHorasIdsAss = diaAss.tipoDeTrabalhoHoras.map(item => item._id);

      const promises = tipoDeTrabalhoHorasIdsAss.map(async tipoDeTrabalhoHoraId => {
        await TipoTrabalhoHoras.findOneAndDelete({ _id: tipoDeTrabalhoHoraId });
      });

      await Promise.all(promises);

      await Dias.findOneAndDelete({ _id: diaAss._id });

      }

    } else if(isSunday){

      const associatedDay = await Dias.findOne({ associated: id });

      if(associatedDay){


      const tipoDeTrabalhoHorasIdsAss = associatedDay.tipoDeTrabalhoHoras.map(item => item._id);

      const promises = tipoDeTrabalhoHorasIdsAss.map(async tipoDeTrabalhoHoraId => {
        await TipoTrabalhoHoras.findOneAndDelete({ _id: tipoDeTrabalhoHoraId });
      });

      await Promise.all(promises);

      await Dias.findOneAndDelete({ _id: associatedDay._id });
    }
    } 

    const tipoDeTrabalhoHorasIds = dia.tipoDeTrabalhoHoras.map(item => item._id);

    const promises = tipoDeTrabalhoHorasIds.map(async tipoDeTrabalhoHoraId => {
      await TipoTrabalhoHoras.findOneAndDelete({ _id: tipoDeTrabalhoHoraId });
    });

    await Promise.all(promises);

    await Dias.findOneAndDelete({ _id: id });

    res.status(StatusCodes.OK).send();
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.KO).send();

  }
};

const exportDias = async (req, res) => {
  try {
    const { userID: userID, userTipo: userTipo } = req.body;

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

    let tipo;
    if (userTipo) {
      tipo = userTipo;
    } else {
      tipo = user.tipo;
    }
    let exp = false
    if (tipo < 9) {
      exp = await exportExcell(tipo);
    } else {
      exp = await exportExcellHoursProjetos()
    }

    if (exp) {
      let filePath;
      if (Number(tipo) === 2) {
        filePath = process.env.EXTRACTION_FOLDER;
      } else if (Number(tipo) === 5) {
        filePath = process.env.EXTRACTION_FOLDER5;
      } else if (Number(tipo) === 6) {
        filePath = process.env.EXTRACTION_FOLDER6;

      } else if (Number(tipo) === 7) {
        filePath = process.env.EXTRACTION_FOLDER7;

      } else if (Number(tipo) === 8) {
        filePath = process.env.EXTRACTION_FOLDER8;
      }
      else if (Number(tipo) === 9) {
        filePath = process.env.EXTRACTION_FOLDER_PROJETOS;
      }
      //const filename = 'SeguimentoHoras.xlsx'
      //res.download(process.env.EXTRACTION_FOLDER, filename);
      res.status(StatusCodes.OK).json(`Ficheiro exportado para: ${filePath}`);
    } else {
      throw new BadRequestError(`Ocorreu um erro ao exportar o ficheiro. Verifique se este se encontra aberto!`);
    }
  } catch (error) {
    //console.error(error)
    throw new BadRequestError(`Ocorreu um erro ao exportar o ficheiro. Verifique se este se encontra aberto!`);
  }
}

module.exports = {
  getAllDiasProjeto,
  getAllDiasHorasExtra,
  getAllDiasUtilizador,
  getAllDiasUtilizadorTipo,
  getAllDias,
  getDia,
  getDiaID,
  createDia,
  createDiaDomingo,
  updateDia,
  deleteDia,
  acceptDiasHorasExtra,
  declineDiasHorasExtra,
  getDiasProjetoUtilizador,
  getDiasUtilizador,
  exportDias,
  getAllDiasHorasExtraAccepted,
  getAllDiasHorasExtraDeclined,
};
