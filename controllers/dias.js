const { Dias, TipoTrabalhoHoras, upgradeGroup } = require("../models/Dias");
const TipoTrabalho = require("../models/TipoTrabalho");
const User = require("../models/Utilizador");
const Projeto = require("../models/Projeto");
const sgMail = require('@sendgrid/mail');

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { exportExcell } = require("../exportExcellHours");


const { exportExcellHoursProjetos } = require("../exportExcellHoursProjetos");
const sanitizeHtml = require('sanitize-html');

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
    console.error("getAllDias ", error)
    // Handle the error, e.g., send an error response.
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const getTipoValue = async (tipoTrabalhoHoras) => {
  try {
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
  } catch (error) {
    console.error("getTipoValue ", error);
    return 1;
  }
};

const compareTipoValues = (tipoA, tipoB, tipo) => {
  try {
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
  } catch (error) {
    console.error("compareTipoValues", error)
    return 0;
  }
};


const sortHorasExtraTipo = async (result, sort) => {
  try {
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
  } catch (error) {
    console.error("sortHorasExtraTipo", error)
    return result;
  }
}

const sortHorasExtra = async (result, sort) => {
  try {
    if (sort === "-Horas") {
      result = await result;
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
      result = await result;
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

  } catch (error) {
    console.error("sortHorasExtra", error);
    return result;
  }
}

const getAllDiasHorasExtra = async (req, res) => {
  try {
    let { sort, tipo } = req.query;

    let checkTipoAll = (tipo === "1");
    let checkTipo = (tipo === "3");
    let checkTipoFalse = (tipo === "2")
    let checkTipoFerias = (tipo === "4")

    sort = sanitizeHtml(sort);
    tipo = sanitizeHtml(tipo);
    // Initial query to get Dias: 1
    let result = Dias.find({
      $or: [
        { accepted: 1 },
        { accepted: 7 }
      ]
    });

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
    let indicesToRemove = [];
    let indicesNotToRemove = [];
    // Process tipoDeTrabalhoHoras
    await Promise.all(
      diasHorasExtra.map(async (dia) => {
        const tt = dia.tipoDeTrabalhoHoras;
        let tipoTrT = 0;

        // Processing each project
        await Promise.all(
          dia.tipoDeTrabalhoHoras.map(async (projeto, index) => {
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
                } else if (ttFound.tipo === 7) {
                  tipoTrT = 4;
                }
              }
            }


            projeto.tipoTrabalho = tipoT.join(",");

            if ((checkTipo && tipoTrT !== 3) || (checkTipoFerias && tipoTrT !== 4) || (checkTipoFalse && tipoTrT === 3) || (checkTipoFalse && tipoTrT === 4)) {
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) || indicesToRemove && (indicesToRemove.includes(indexDia))) {
              } else {
                indicesToRemove.push(indexDia);
              }

            } else if ((checkTipo && tipoTrT === 3)) {
              try {
                indicesNotToRemove.push(indexDia);
                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  if (indicesToRemove.length === 1) {
                    indicesToRemove = []
                  } else {
                    // indicesToRemove.remove(indexDia);
                    indicesToRemove = indicesToRemove.filter(item => item !== indexDia);
                  }

                }
              } catch (error) {
                console.error("Error 298", error)
              }
            } else if ((checkTipoFerias && tipoTrT === 4)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  // indicesToRemove.remove(indexDia);
                  indicesToRemove = indicesToRemove.filter(item => item !== indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            }
          })
        );

        // Handling associated days for tipo = 1
        if (checkTipoAll) {
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

    let groupedByIdGroup = []
    if (checkTipoFerias && diasHorasExtra && diasHorasExtra.length > 0) {
      const groupedByIdGroup = diasHorasExtra.reduce((acc, dia) => {
        const idGroup = dia._id_Group;
        if (!acc[idGroup]) {
          acc[idGroup] = [];
        }
        acc[idGroup].push(dia);
        return acc;
      }, {});

      // Convert the grouped object to an array
      diasHorasExtra = Object.values(groupedByIdGroup);
    }

    // Sending response
    res.status(StatusCodes.OK).json({ diasHorasExtra });
  } catch (error) {
    console.error("getAllDiasHorasExtra ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};






const getAllDiasHorasExtraAccepted = async (req, res) => {
  try {
    let { sort, tipo } = req.query;

    sort = sanitizeHtml(sort);
    tipo = sanitizeHtml(tipo);

    let checkTipoAll = (tipo === "1");
    let checkTipo = (tipo === "3");
    let checkTipoFalse = (tipo === "2")
    let checkTipoFerias = (tipo === "4")
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
          dia.tipoDeTrabalhoHoras.map(async (projeto, index) => {
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
                } else if (ttFound.tipo === 7) {
                  tipoTrT = 4;
                }
              }
            }
            projeto.tipoTrabalho = tipoT.join(",");

            if ((checkTipo && tipoTrT !== 3) || (checkTipoFerias && tipoTrT !== 4) || (checkTipoFalse && tipoTrT === 3) || (checkTipoFalse && tipoTrT === 4)) {
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) || indicesToRemove && (indicesToRemove.includes(indexDia))) {
              } else {
                indicesToRemove.push(indexDia);
              }

            } else if ((checkTipo && tipoTrT === 3)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            } else if ((checkTipoFerias && tipoTrT === 4)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            }
          })
        );

        // Handling associated days for tipo = 1
        if (checkTipoAll) {
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
    console.error("getAllDiasHorasExtraAccepted ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllDiasHorasExtraDeclined = async (req, res) => {
  try {
    let { sort, tipo } = req.query;
    sort = sanitizeHtml(sort);
    tipo = sanitizeHtml(tipo);


    let checkTipoAll = (tipo === "1");
    let checkTipo = (tipo === "3");
    let checkTipoFalse = (tipo === "2")
    let checkTipoFerias = (tipo === "4")


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
          dia.tipoDeTrabalhoHoras.map(async (projeto, index) => {
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
                } else if (ttFound.tipo === 7) {
                  tipoTrT = 4;
                }
              }
            }
            projeto.tipoTrabalho = tipoT.join(",");


            if ((checkTipo && tipoTrT !== 3) || (checkTipoFerias && tipoTrT !== 4) || (checkTipoFalse && tipoTrT === 3) || (checkTipoFalse && tipoTrT === 4)) {
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) || indicesToRemove && (indicesToRemove.includes(indexDia))) {
              } else {
                indicesToRemove.push(indexDia);
              }

            } else if ((tipo === "3" && tipoTrT === 3)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            } else if ((checkTipoFerias && tipoTrT === 4)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            }
          })
        );

        // Handling associated days for tipo = 1
        if (checkTipoAll) {
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
    console.error("getAllDiasHorasExtraDeclined ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllDiasHorasExtraResponsavel = async (req, res) => {
  try {
    let { sort, tipo, user } = req.query;



    sort = sanitizeHtml(sort);
    tipo = sanitizeHtml(tipo);
    user = sanitizeHtml(user);

    let checkTipoAll = (tipo === "1");
    let checkTipo = (tipo === "3");
    let checkTipoFalse = (tipo === "2");
    let checkTipoFerias = (tipo === "4");

    let diasHorasExtra = [];
    let utilizadores = await User.find({ responsavel: user });

    if (utilizadores && utilizadores.length > 0) {
      await Promise.all(utilizadores.map(async (utilizador) => {
        // Initial query to get Dias: 1
        let result = Dias.find({ accepted: 8, Utilizador: utilizador._id });

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

        let diasHorasExtraUser = await result;

        if (diasHorasExtraUser.length > 0) {
          diasHorasExtra.push(...diasHorasExtraUser);
        }
      }));
    }

    const indicesToRemove = [];
    const indicesNotToRemove = [];
    // Process tipoDeTrabalhoHoras
    await Promise.all(
      diasHorasExtra?.map(async (dia) => {
        const tt = dia.tipoDeTrabalhoHoras;
        let tipoTrT = 0;

        // Processing each project
        await Promise.all(
          dia?.tipoDeTrabalhoHoras?.map(async (projeto, index) => {
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
                } else if (ttFound.tipo === 7) {
                  tipoTrT = 4;
                }
              }
            }

            projeto.tipoTrabalho = tipoT.join(",");
            if ((checkTipo && tipoTrT !== 3) || (checkTipoFerias && tipoTrT !== 4) || (checkTipoFalse && tipoTrT === 3) || (checkTipoFalse && tipoTrT === 4)) {
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) || indicesToRemove && (indicesToRemove.includes(indexDia))) {
              } else {
                indicesToRemove.push(indexDia);
              }
            } else if ((checkTipo && tipoTrT === 3)) {
              try {
                indicesNotToRemove.push(indexDia);
                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            } else if ((checkTipoFerias && tipoTrT === 4)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            }
          })
        );

        // Handling associated days for tipo = 1
        if (checkTipoAll) {
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
        diasHorasExtra?.map(async (dia) => {
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
    console.error("getAllDiasHorasExtraResponsavel ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const getAllDiasHorasExtraAcceptedResponsavel = async (req, res) => {
  try {
    let { sort, tipo, user } = req.query;



    sort = sanitizeHtml(sort);
    tipo = sanitizeHtml(tipo);
    user = sanitizeHtml(user);


    let checkTipoAll = (tipo === "1");
    let checkTipo = (tipo === "3");
    let checkTipoFalse = (tipo === "2")
    let checkTipoFerias = (tipo === "4")

    let diasHorasExtra = [];
    let utilizadores = await User.find({ responsavel: user });

    if (utilizadores && utilizadores.length > 0) {
      await Promise.all(utilizadores.map(async (utilizador) => {
        // Initial query to get Dias with accepted: 2
        let result = Dias.find({
          Utilizador: utilizador._id,
          $or: [
            { accepted: 2 },
            { accepted: 7 }
          ]
        });
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
        let diasHorasExtraUser = await result;
        if (diasHorasExtraUser.length > 0) {
          diasHorasExtra.push(...diasHorasExtraUser);
        }
      }));
    }
    const indicesToRemove = [];
    const indicesNotToRemove = [];
    // Process tipoDeTrabalhoHoras
    await Promise.all(
      diasHorasExtra.map(async (dia) => {
        const tt = dia.tipoDeTrabalhoHoras;
        let tipoTrT = 0;

        // Processing each project
        await Promise.all(
          dia.tipoDeTrabalhoHoras.map(async (projeto, index) => {
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
                } else if (ttFound.tipo === 7) {
                  tipoTrT = 4;
                }
              }
            }
            projeto.tipoTrabalho = tipoT.join(",");

            if ((checkTipo && tipoTrT !== 3) || (checkTipoFerias && tipoTrT !== 4) || (checkTipoFalse && tipoTrT === 3) || (checkTipoFalse && tipoTrT === 4)) {
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) || indicesToRemove && (indicesToRemove.includes(indexDia))) {
              } else {
                indicesToRemove.push(indexDia);
              }

            } else if ((tipo === "3" && tipoTrT === 3)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            } else if ((checkTipoFerias && tipoTrT === 4)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            }
          })
        );

        // Handling associated days for tipo = 1
        if (checkTipoAll) {
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
    console.error("getAllDiasHorasExtraAcceptedResponsavel ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllDiasHorasExtraDeclinedResponsavel = async (req, res) => {
  try {
    let { sort, tipo, user } = req.query;




    sort = sanitizeHtml(sort);
    tipo = sanitizeHtml(tipo);
    user = sanitizeHtml(user);

    let checkTipoAll = (tipo === "1");
    let checkTipo = (tipo === "3");
    let checkTipoFalse = (tipo === "2");
    let checkTipoFerias = (tipo === "4");

    let diasHorasExtra = [];
    let utilizadores = await User.find({ responsavel: user });

    if (utilizadores && utilizadores.length > 0) {
      await Promise.all(utilizadores.map(async (utilizador) => {

        // Initial query to get Dias with accepted: 3 Declined
        let result = Dias.find({ accepted: 3, Utilizador: utilizador._id });

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

        let diasHorasExtraUser = await result;

        if (diasHorasExtraUser.length > 0) {
          diasHorasExtra.push(...diasHorasExtraUser);
        }
      }));
    }
    const indicesToRemove = [];
    const indicesNotToRemove = [];
    // Process tipoDeTrabalhoHoras
    await Promise.all(
      diasHorasExtra.map(async (dia) => {
        const tt = dia.tipoDeTrabalhoHoras;
        let tipoTrT = 0;

        // Processing each project
        await Promise.all(
          dia.tipoDeTrabalhoHoras.map(async (projeto, index) => {
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
                } else if (ttFound.tipo === 7) {
                  tipoTrT = 4;
                }
              }
            }
            projeto.tipoTrabalho = tipoT.join(",");

            if ((checkTipo && tipoTrT !== 3) || (checkTipoFerias && tipoTrT !== 4) || (checkTipoFalse && tipoTrT === 3) || (checkTipoFalse && tipoTrT === 4)) {
              if ((indicesNotToRemove && indicesNotToRemove.includes(indexDia)) || indicesToRemove && (indicesToRemove.includes(indexDia))) {
              } else {
                indicesToRemove.push(indexDia);
              }

            } else if ((checkTipo && tipoTrT === 3)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            } else if ((checkTipoFerias && tipoTrT === 4)) {
              try {
                indicesNotToRemove.push(indexDia);

                if (indicesToRemove && indicesToRemove.includes(indexDia)) {
                  indicesToRemove.remove(indexDia);
                }
              } catch (error) {
                console.error(error)
              }
            }
          })
        );

        // Handling associated days for tipo = 1
        if (checkTipoAll) {
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
    console.error("getAllDiasHorasExtraDeclinedResponsavel ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const acceptDiasHorasExtra = async (req, res) => {
  try {
    let { id } = req.params;
    id = sanitizeHtml(id);
    const diaCheck = await Dias.findById(id);
    let acceptedValue = 2;

    if (diaCheck) {

      if (diaCheck.accepted === 8) {
        acceptedValue = 7;
      } else {
        acceptedValue = 2;
      }
    }

    const dia = await Dias.findByIdAndUpdate(
      id,
      {
        accepted: acceptedValue,
      },
      { new: true, runValidators: true }
    );

    const associatedDay = await Dias.findOne({ associated: id });

    if (associatedDay) {
      const idAss = associatedDay?._id;
      await Dias.findByIdAndUpdate(
        idAss,
        {
          accepted: 5,
        },
        { new: true, runValidators: true }
      );
    }

    if (acceptedValue === 2) {
      const tipoTrabalhoHoras = diaCheck?.tipoDeTrabalhoHoras;
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
          } else if (tipoT.tipo === 7) {
            tipo = 3;
          }
        }
      }
      if (!user || !email) {
        throw new NotFoundError(`Utilizador não encontrado :  ${user}`);
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
            subject: 'Aplicação Gestão Horas - Horas Extra Aceites',
            html: `
          <p>Horas Extra inseridas para o dia ${dataDay}/${dataMonth}/${dataYear} foram aceites!</p>
          <p>Agradecemos a sua colaboração.</p>`
          };
        } else if (tipo === 2) {

          mailOptions = {
            from: process.env.EMAIL, // Sender's email address
            to: email, // Recipient's email address
            subject: 'Aplicação Gestão Horas - Compensação de Horas extra Aceites',
            html: `
          <p>Pedido de compensação de Horas Extra para o dia ${dataDay}/${dataMonth}/${dataYear} foi aceite!</p>
          <p>Agradecemos a sua colaboração.</p> `
          };
        } else {
          mailOptions = {
            from: process.env.EMAIL, // Sender's email address
            to: email, // Recipient's email address
            subject: 'Aplicação Gestão Horas - Férias Aceites',
            html: `
          <p>Pedido de Férias para o dia ${dataDay}/${dataMonth}/${dataYear} foi aceite!</p>
          <p>Agradecemos a sua colaboração.</p> `
          };
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);



        await sgMail.send(mailOptions);

      } catch (error) {
        console.error("Error Sending email!")
      }
    }
    if (!dia) {
      throw new NotFoundError(`Não existe um dia com id ${id}`);
    }
    res.status(StatusCodes.OK).json({ dia });
  } catch (error) {
    console.error("acceptDiasHorasExtra ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const declineDiasHorasExtra = async (req, res) => {
  try {
    let { id } = req.params;
    id = sanitizeHtml(id);
    const diaToDecline = await Dias.findById(id);
    const accepted = diaToDecline.accepted;

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
        } else if (tipoT.tipo === 7) {
          tipo = 3;
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

    if (associatedDay) {
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
      const utilizador = user?.nome;
      const responsavel = user?.responsavel;

      // Configure the email details
      if (accepted === 7 && user?.responsavel) {

        const userResponsavel = await User.findOne({ _id: responsavel });
        const emailResponsavel = userResponsavel?.email;
        let mailOptions = "";
        if (tipo === 1) {
          // Enviar CC ???
          mailOptions = {
            from: process.env.EMAIL, // Sender's email address
            to: emailResponsavel, // Recipient's email address
            subject: 'Aplicação Gestão Horas - (Responsável) Horas Extra Recusadas',
            html: `
            <p>Horas Extra inseridas por ${utilizador} para o dia ${dataDay}/${dataMonth}/${dataYear} foram recusadas!</p>
            <p>Se precisar de informações adicionais ou tiver dúvidas sobre este assunto, contacte os Recursos Humanos.</p>
            <p>Agradecemos a sua compreensão e colaboração.</p>`
          };
        } else if (tipo === 2) {
          mailOptions = {
            from: process.env.EMAIL, // Sender's email address
            to: emailResponsavel, // Recipient's email address
            subject: 'Aplicação Gestão Horas - (Responsável) Compensação de Horas extra Recusada',
            html: `
            <p>Pedido de compensação de Horas Extra realizado por ${utilizador} para o dia ${dataDay}/${dataMonth}/${dataYear} foi recusado!</p>
            <p>Se precisar de informações adicionais ou tiver dúvidas sobre este assunto, contacte os Recursos Humanos.</p>
            <p>Agradecemos a sua compreensão e colaboração.</p> `
          };
        } else {
          mailOptions = {
            from: process.env.EMAIL, // Sender's email address
            to: emailResponsavel, // Recipient's email address
            subject: 'Aplicação Gestão Horas - (Responsável) Férias Recusada',
            html: `
            <p>Pedido de Férias realizado por ${utilizador} para o dia ${dataDay}/${dataMonth}/${dataYear} foi recusado!</p>
            <p>Se precisar de informações adicionais ou tiver dúvidas sobre este assunto, contacte os Recursos Humanos.</p>
            <p>Agradecemos a sua compreensão e colaboração.</p> `
          };
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.send(mailOptions);
      }

      let mailOptions = "";
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
      } else if (tipo === 2) {

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
      } else {
        mailOptions = {
          from: process.env.EMAIL, // Sender's email address
          to: email, // Recipient's email address
          subject: 'Aplicação Gestão Horas - Férias Recusadas',
          html: `
          <p>Pedido de Férias para o dia ${dataDay}/${dataMonth}/${dataYear} foi recusado!</p>
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
  } catch (error) {
    console.error("declineDiasHorasExtra ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const toLocalDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    // Reset the time to midnight and set to local timezone
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  } catch (error) {
    console.error("toLocalDate ", error);
    return new Date();
  }
};



function feriadosPortugal(date) {
  try {
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
    //setFeriados(feriados);
    for (const feriado of feriados) {
      if (
        date.getDate() === feriado.date.getDate() &&
        date.getMonth() === feriado.date.getMonth() &&
        date.getFullYear() === feriado.date.getFullYear()
      ) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("feriadosPortugal ", error);
    return [];
  }
}

function calculateEaster(year, type) {
  try {
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
  } catch (error) {
    console.error("calculateEaster ", error);
    return [];
  }
}

function calculateCorpusChristi(ano) {
  try {
    const domingoPascoa = calculateEaster(ano, "DomingoPascoa");
    return new Date(ano, domingoPascoa.getMonth(), domingoPascoa.getDate() + 60);
  } catch (error) {
    console.error("calculateCorpusChristi ", error);
    return [];
  }
}


const verificaListaDias = async (datesReceived) => {
  try {
    datesReceived.sort((a, b) => new Date(a.Data) - new Date(b.Data));
    const startDate = new Date(datesReceived[0].Data);
    const endDate = new Date(datesReceived[datesReceived.length - 1].Data);

    const dates = [];

    // Create a date instance for iterating
    let currentDate = new Date(startDate);
    let count = 0;
    while (toLocalDate(currentDate) <= toLocalDate(endDate)) {
      // Check if the current day is a weekday (not Saturday or Sunday)
      const dayOfWeek = currentDate.getDay();

      if (!dates[count]) {
        dates[count] = [];
      }
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !feriadosPortugal(currentDate) && (datesReceived.some(item => (new Date(item.Data)).getDate() === currentDate.getDate()))) {
        // Check if the current date is already in listaDias
        dates[count].push(new Date(currentDate));
      } else {
        if (dates[count]?.length > 0) {
          count++;
        }

      }
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  } catch (error) {
    console.error("verificaListaDias ", error);
    return [];
  }
};

const acceptMultipleDiasHorasExtra = async (req, res) => {
  try {
    let { id } = req.params;
    id = sanitizeHtml(id);

    const idUser = req?.body?.Utilizador ? req.body.Utilizador : (req.body[0].Utilizador ? req.body[0].Utilizador : "");
    const user = await User.findOne({ _id: idUser });

    const email = user?.email;


    if (!user || !email) {
      throw new NotFoundError(`Utilizador não encontrado :  ${user}`);
    }

    const diaCheck = await Dias.findById(id);
    let acceptedValue = 2;
    let group = 0;
    if (diaCheck) {
      if (diaCheck.accepted === 8) {
        acceptedValue = 7;
      } else {
        acceptedValue = 2;
      }

      if (diaCheck._id_Group) {
        group = diaCheck._id_Group;
      }
    }

    let diasGroup = "";
    if (group !== 0) {
      diasGroup = await Dias.find({ _id_Group: group });
    }


    for (let i = 0; i < diasGroup.length; i++) {
      const idDiaGroup = diasGroup[i]._id;

      const dia = await Dias.findByIdAndUpdate(
        idDiaGroup,
        {
          accepted: acceptedValue,
        },
        { new: true, runValidators: true }
      );


      if (!dia) {
        throw new NotFoundError(`Não existe um dia com id ${id}`);
      }
    }

    try {
      if (acceptedValue === 2) {


        const dates = await verificaListaDias(diasGroup)
        let data = "";
        if (dates.length > 0) {
          for (let i = 0; i < dates.length; i++) {
            const startDate = new Date(dates[i][0]);
            const endDate = new Date(dates[i][dates[i].length - 1]);


            const dataDay = startDate.getDate();
            const dataMonth = startDate.getMonth() + 1;
            const dataYear = startDate.getFullYear();

            const dataDayEnd = endDate.getDate();
            const dataMonthEnd = endDate.getMonth() + 1;
            const dataYearEnd = endDate.getFullYear();

            if (dates[i].length > 1) {

              data += dataDay + "/" + dataMonth + "/" + dataYear + " || " + dataDayEnd + "/" + dataMonthEnd + "/" + dataYearEnd + '<br />';

            } else {

              data += dataDay + "/" + dataMonth + "/" + dataYear + '<br />';
            }

          }

        } else {
          const fullData = new Date(dates[0])

          const dataDay = fullData.getDate();
          const dataMonth = fullData.getMonth() + 1;
          const dataYear = fullData.getFullYear();

          data = dataDay + "/" + dataMonth + "/" + dataYear;
        }

        // Configure the email details
        let mailOptions = ""
        mailOptions = {
          from: process.env.EMAIL, // Sender's email address
          to: email, // Recipient's email address
          subject: 'Aplicação Gestão Horas - Férias Aceites',
          html: `
              <p>Pedido de Férias para o período: <br /> ${data} correspondente a ${diasGroup?.length} dias foi aceite!</p>
              <p>Agradecemos a sua colaboração.</p> `
        };

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);



        await sgMail.send(mailOptions);
      }
    } catch (error) {
      console.error("Error Sending email!", error)
    }




    res.status(StatusCodes.OK).json("Ferias aceites");
  } catch (error) {
    console.error("acceptMultipleDiasHorasExtra ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const declineMultipleDiasHorasExtra = async (req, res) => {
  try {

    let { id } = req.params;
    id = sanitizeHtml(id);

    const idUser = req?.body?.Utilizador ? req.body.Utilizador : (req.body[0].Utilizador ? req.body[0].Utilizador : "");

    const user = await User.findOne({ _id: idUser });
    const email = user?.email;


    if (!user || !email) {
      throw new NotFoundError(`Utilizador não encontrado :  ${user}`);
    }


    const diaCheck = await Dias.findById(id);
    let acceptedValue = 2;
    let group = 0;
    if (diaCheck) {
      if (diaCheck.accepted === 8) {
        acceptedValue = 7;
      } else {
        acceptedValue = 2;
      }

      if (diaCheck._id_Group) {
        group = diaCheck._id_Group;
      }
    }

    let diasGroup = "";
    if (group !== 0) {
      diasGroup = await Dias.find({ _id_Group: group });
    }


    const diaToDecline = await Dias.findById(id);
    const accepted = diaToDecline.accepted;

    for (let i = 0; i < diasGroup.length; i++) {
      const idDiaGroup = diasGroup[i]._id;

      const dia = await Dias.findByIdAndUpdate(

        idDiaGroup,
        {
          accepted: 3,
        },
        { new: true, runValidators: true }
      );

      if (!dia) {
        throw new NotFoundError(`Não existe um dia com id ${id}`);
      }
    }


    try {
      let data = "";
      const dates = await verificaListaDias(diasGroup)
      if (dates.length > 0) {
        for (let i = 0; i < dates.length; i++) {
          const startDate = new Date(dates[i][0]);
          const endDate = new Date(dates[i][dates[i].length - 1]);


          const dataDay = startDate.getDate();
          const dataMonth = startDate.getMonth() + 1;
          const dataYear = startDate.getFullYear();

          const dataDayEnd = endDate.getDate();
          const dataMonthEnd = endDate.getMonth() + 1;
          const dataYearEnd = endDate.getFullYear();

          if (dates[i].length > 1) {

            data += dataDay + "/" + dataMonth + "/" + dataYear + " || " + dataDayEnd + "/" + dataMonthEnd + "/" + dataYearEnd + '<br />';

          } else {

            data += dataDay + "/" + dataMonth + "/" + dataYear + '<br />';
          }
        }

      } else {
        const fullData = new Date(dates[0])

        const dataDay = fullData.getDate();
        const dataMonth = fullData.getMonth() + 1;
        const dataYear = fullData.getFullYear();

        data = dataDay + "/" + dataMonth + "/" + dataYear;
      }

      // Configure the email details
      if (accepted === 7 && user?.responsavel) {
        const userResponsavel = await User.findOne({ _id: responsavel });
        const emailResponsavel = userResponsavel?.email;
        let mailOptions = "";

        mailOptions = {
          from: process.env.EMAIL, // Sender's email address
          to: emailResponsavel, // Recipient's email address
          subject: 'Aplicação Gestão Horas - (Responsável) Férias Recusada',
          html: `
            <p>Pedido de Férias realizado por ${utilizador} para o período: <br /> ${data} correspondente a ${diasGroup?.length} dias foi recusado!</p>
            <p>Se precisar de informações adicionais ou tiver dúvidas sobre este assunto, contacte os Recursos Humanos.</p>
            <p>Agradecemos a sua compreensão e colaboração.</p> `
        };


        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.send(mailOptions);
      }
      let mailOptions = "";

      mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Aplicação Gestão Horas - Férias Recusadas',
        html: `
          <p>Pedido de Férias para o período: <br /> ${data} correspondente a ${diasGroup?.length} dias foi recusado!</p>
          <p>Por favor, reinsira as horas relativas a este período.</p>
          <p>Se precisar de informações adicionais ou tiver dúvidas sobre este assunto, contacte os Recursos Humanos.</p>
          <p>Agradecemos a sua compreensão e colaboração.</p> `
      };

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Send the email
      //await transporter.sendMail(mailOptions);

      await sgMail.send(mailOptions);

    } catch (error) {
      console.error("Error decline multiple Sending email!")
    }

    res.status(StatusCodes.OK).json("Férias recusadas");
  } catch (error) {
    console.error("declineMultipleDiasHorasExtra ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const getAllDiasUtilizadorTipo = async (req, res) => {
  try {

    let {
      params: { utilizador },
    } = req;


    utilizador = sanitizeHtml(utilizador);

    let users = []

    if (Number(utilizador) === 1) {
      users = await User.find({ tipo: { $in: [1, 5] } });
    } else if (Number(utilizador) === 2) {
      users = await User.find({ tipo: { $in: [2, 5, 6] } });
    } else if (Number(utilizador) === 3) {
      users = await User.find({ tipo: { $in: [3, 6] } });
    } else if (Number(utilizador) === 4) {
      users = await User.find({ tipo: { $in: [4, 7] } });
    } else if (Number(utilizador) === 5) {


      let userId = req?.user?.userId || null;

      users = await User.find({ responsavel: { $in: userId } });
    }



    if (!users.length) {
      throw new NotFoundError(`Nenhum utilizador encontrado com o tipo ${utilizador}.`);
    }

    const userIds = users.map(user => user._id);


    const diasAllUtilizador = await Dias.find({
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ], Utilizador: { $in: userIds }
    });

    if (!diasAllUtilizador.length) {
      throw new NotFoundError(`Não foram encontradas horas inseridas para utilizadores do tipo ${utilizador}.`);
    }

    diasAllUtilizador.sort((a, b) => a.Data - b.Data);
    res.status(StatusCodes.OK).json({ diasAllUtilizador });
  } catch (error) {
    console.error("getAllDiasUtilizadorTipo ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getAllDiasUtilizador = async (req, res) => {

  try {
    let {
      params: { utilizador },
    } = req;

    utilizador = sanitizeHtml(utilizador);
    const u1 = await User.findById(utilizador);

    if (!u1) {
      throw new NotFoundError(`Não foi encontrado nenhum utilizador!`);
    }
    const diasAllUtilizador = await Dias.find({
      Utilizador: u1?._id,
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ],
    });

    if (!diasAllUtilizador.length) {

      return res.status(StatusCodes.OK).json(diasAllUtilizador);
      //throw new NotFoundError(`Não foram encontradas horas inseridas para: ${u1.nome}`);
    }
    diasAllUtilizador.sort((a, b) => a.Data - b.Data);

    res.status(StatusCodes.OK).json({ diasAllUtilizador });
  } catch (error) {
    console.error("getAllDiasUtilizador ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};
const getAllDiasProjeto = async (req, res) => {
  try {
    let {
      params: { projeto },
    } = req;

    projeto = sanitizeHtml(projeto);

    const diasAllProjeto = await Dias.find({
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ], "tipoDeTrabalhoHoras.projeto": projeto
    });

    if (!diasAllProjeto.length) {
      throw new NotFoundError(`No Dias found`);
    }
    res.status(StatusCodes.OK).json({ diasAllProjeto });
  } catch (error) {
    console.error("getAllDiasProjeto ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getDiasUtilizador = async (req, res) => {
  try {
    let userID = req.user.userId;

    userID = sanitizeHtml(userID);

    const diasUtilizador = await Dias.find({
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ]
    });
    let x = 0;
    const listaUtilizador = null;
    for (i == 0; i < diasUtilizador.length; i++) {
      if (diasUtilizador[i].Utilizador === userID) {
        listaUtilizador[x] = diasUtilizador[i];
        x++;
      }
    }
    if (!listaUtilizador) {
      throw new NotFoundError(`Utilizador não possui dias inseridos`);
    }
    res.status(StatusCodes.OK).json({ listaUtilizador });
  } catch (error) {
    console.error("getDiasUtilizador ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getDiasProjetoUtilizador = async (req, res) => {
  try {
    let {
      params: { projeto, utilizador },
    } = req;

    projeto = sanitizeHtml(projeto);
    utilizador = sanitizeHtml(utilizador);

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
  } catch (error) {
    console.error("getDiasProjetoUtilizador ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getDia = async (req, res) => {
  try {
    let {
      params: { user: login },
    } = req;


    login = sanitizeHtml(login);


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
    console.error("getDia ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getDiaID = async (req, res) => {
  try {
    let { id } = req.params;

    id = sanitizeHtml(id);

    const dia = await Dias.findById(id);

    if (!dia) {
      throw new NotFoundError(`Dia não encontrado com o id ${id}`);
    }


    res.status(StatusCodes.OK).json({ dia });
  } catch (error) {
    console.error("getDiaID ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getDiaInf = async (req, res) => {
  try {
    let {
      params: { user: login },
    } = req;

    login = sanitizeHtml(login);

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
    console.error("getDiaInf ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const createDia = async (req, res) => {
  try {
    let idU = req.body.Utilizador;
    idU = sanitizeHtml(idU);

    const aUtilizador = await User.findOne({
      _id: idU,
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

  } catch (error) {
    console.error("createDia ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};


const adicionarFerias = async (req, res) => {
  try {
    const idU = sanitizeHtml(req.body.Utilizador);
    const DiasFerias = req.body.Dias.map(item => sanitizeHtml(item));
    const accepted = req?.body?.accepted;

    // Retrieve necessary data in parallel
    const [aUtilizador, projetoGeral, idFerias, groupID] = await Promise.all([
      User.findOne({ _id: idU }),
      Projeto.findOne({ Tipo: 1 }),
      TipoTrabalho.findOne({ tipo: 7 }),
      upgradeGroup()
    ]);

    if (!aUtilizador) {
      throw new NotFoundError(`Não existe um utilizador com id ${idU}`);
    }

    // Batch operations
    const tipoTrabalhoHorasArray = [];
    const diasToCreate = [];

    for (const dia of DiasFerias) {
      const data = new Date(dia);
      const horas = data.getDay() === 5 ? 6 : 8.5;

      // Create TipoTrabalhoHoras object
      const tipoTrabalhoHoras = {
        projeto: projetoGeral._id,
        tipoTrabalho: idFerias._id,
        horas: horas,
      };
      tipoTrabalhoHorasArray.push(tipoTrabalhoHoras);

      // Check if the day already exists
      const findDia = await Dias.findOne({
        Utilizador: aUtilizador._id,
        Data: data,
        $nor: [{ accepted: 3 }, { accepted: 6 }]
      });

      if (!findDia) {
        diasToCreate.push({
          Data: data,
          NumeroHoras: horas,
          tipoDeTrabalhoHoras: [tipoTrabalhoHoras],
          Utilizador: aUtilizador._id,
          accepted: accepted,
          _id_Group: groupID,
        });
      }
    }

    // Perform batch creation of TipoTrabalhoHoras
    if (tipoTrabalhoHorasArray.length > 0) {
      await TipoTrabalhoHoras.insertMany(tipoTrabalhoHorasArray);
    }

    // Perform batch creation of Dias
    if (diasToCreate.length > 0) {
      await Dias.insertMany(diasToCreate);
    }

    res.status(StatusCodes.CREATED).json("Ferias Inseridas");
  } catch (error) {
    console.error("adicionarFerias ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const createDiaDomingo = async (req, res) => {
  try {
    let idU = req.body.Utilizador;
    idU = sanitizeHtml(idU);
    const aUtilizador = await User.findOne({
      _id: idU,
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
      $nor: [
        { accepted: 3 },
        { accepted: 6 }
      ],
    });


    let dia = "";
    if (findDia && findDia.length > 0) {
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

    } else {
      dia = await Dias.create({
        Data: req.body.Data,
        NumeroHoras: req.body.NumeroHoras,
        tipoDeTrabalhoHoras: tipoDeTrabalhoHorasArray,
        Utilizador: aUtilizador._id,
        accepted: req?.body?.accepted,
      });
    }

    const findProjetoGeral = await Projeto.findOne({ Tipo: 1 });
    let idProjeto = "";

    if (!findProjetoGeral) {
      const projetoGeral = await Projeto.findOne({ Nome: "Geral" });
      idProjeto = projetoGeral?._id;
      await Projeto.findByIdAndUpdate(
        idProjeto,
        {
          Tipo: 1
        },
        { new: true, runValidators: true }
      );

    } else {
      idProjeto = findProjetoGeral?._id;
    }



    if (req?.body?.associated) {
      const data = new Date(req?.body?.associated);
      const tipoDeTrabalhoHorasArrayA = [];

      const [findDiaAssociated1, findDiaAssociated2] = await Promise.all([
        Dias.find({
          associated: dia?._id, $nor: [
            { accepted: 3 },
            { accepted: 6 }
          ]
        }),
        Dias.find({
          Utilizador: aUtilizador._id, Data: data, $nor: [
            { accepted: 3 },
            { accepted: 6 }
          ]
        })
      ]);

      const findDiaAssociated = findDiaAssociated1.length > 0 ? findDiaAssociated1 : findDiaAssociated2;

      const dayOfWeek = data.getDay();
      const isFriday = dayOfWeek === 5;

      const findTT = await TipoTrabalho.findOne({
        tipo: 6,

      });
      let horasA = 8.5;
      if (isFriday) {
        horasA = 6;
      }

      const tipoTrabalhoHorasA = await TipoTrabalhoHoras.create({
        projeto: idProjeto,
        tipoTrabalho: findTT.id,
        horas: horasA,
      });

      tipoDeTrabalhoHorasArrayA.push(tipoTrabalhoHorasA);

      if (findDiaAssociated && findDiaAssociated.length > 0) {

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

      } else {
        await Dias.create({
          Data: data,
          NumeroHoras: horasA,
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
    console.error("createDiaDomingo ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const updateDia = async (req, res) => {
  try {
    let { id } = req.params;
    id = sanitizeHtml(id);

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
  } catch (error) {
    console.error("updateDia ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const deleteDia = async (req, res) => {
  try {
    let { id } = req.params;
    id = sanitizeHtml(id);

    try {
      const dia = await Dias.findById(id);

      if (!dia) {
        throw new NotFoundError(`Não existe um dia com id ${id}`);
      }

      const data = new Date(dia.Data);
      const dayOfWeek = data.getDay();
      const isSunday = dayOfWeek === 0;

      if (dia.accepted && (dia.accepted === 4 || dia.accepted === 5)) {
        const idAss = dia.associated;

        const diaAss = await Dias.findById(idAss);

        if (diaAss) {
          const tipoDeTrabalhoHorasIdsAss = diaAss.tipoDeTrabalhoHoras.map(item => item._id);

          const promises = tipoDeTrabalhoHorasIdsAss.map(async tipoDeTrabalhoHoraId => {
            await TipoTrabalhoHoras.findOneAndDelete({ _id: tipoDeTrabalhoHoraId });
          });

          await Promise.all(promises);

          await Dias.findOneAndDelete({ _id: diaAss._id });

        }

      } else if (isSunday) {

        const associatedDay = await Dias.findOne({ associated: id });

        if (associatedDay) {


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
      console.error("deleteDia ",error);
      res.status(StatusCodes.KO).send();

    }
  } catch (error) {
    console.error("deleteDia ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const deleteDiaGroup = async (req, res) => {
  try {
    let { id } = req.params;
    id = sanitizeHtml(id);


    const diaCheck = await Dias.findById(id);
    let group = 0;
    if (diaCheck) {
      if (diaCheck._id_Group) {
        group = diaCheck._id_Group;
      }
    }

    let diasGroup = "";
    if (group !== 0) {
      diasGroup = await Dias.find({ _id_Group: group });
    }

    for (let i = 0; i < diasGroup.length; i++) {
      const idDiaGroup = diasGroup[i]._id;

      const dia = await Dias.findById(idDiaGroup);

      if (!dia) {
        throw new NotFoundError(`Não existe um dia com id ${idDiaGroup}`);
      }

      const data = new Date(dia.Data);
      const dayOfWeek = data.getDay();
      const isSunday = dayOfWeek === 0;

      if (dia.accepted && (dia.accepted === 4 || dia.accepted === 5)) {
        const idAss = dia.associated;

        const diaAss = await Dias.findById(idAss);

        if (diaAss) {
          const tipoDeTrabalhoHorasIdsAss = diaAss.tipoDeTrabalhoHoras.map(item => item._id);

          const promises = tipoDeTrabalhoHorasIdsAss.map(async tipoDeTrabalhoHoraId => {
            await TipoTrabalhoHoras.findOneAndDelete({ _id: tipoDeTrabalhoHoraId });
          });

          await Promise.all(promises);

          await Dias.findOneAndDelete({ _id: diaAss._id });

        }

      } else if (isSunday) {

        const associatedDay = await Dias.findOne({ associated: id });

        if (associatedDay) {


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

      await Dias.findOneAndDelete({ _id: idDiaGroup });
    }


    res.status(StatusCodes.OK).send();
  } catch (error) {
    console.error("deleteDiaGroup ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const exportDias = async (req, res) => {
  try {
    let { userID: userID, userTipo: userTipo } = req.body;

    userID = sanitizeHtml(userID);
    userTipo = sanitizeHtml(userTipo);

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
    console.error("exportDias ", error);
    throw new BadRequestError(`Ocorreu um erro ao exportar o ficheiro. Verifique se este se encontra aberto!`);
  }
}

module.exports = {
  getAllDiasProjeto,
  getAllDiasHorasExtra,
  getAllDiasHorasExtraResponsavel,
  getAllDiasUtilizador,
  getAllDiasUtilizadorTipo,
  getAllDias,
  getDia,
  getDiaID,
  createDia,
  createDiaDomingo,
  updateDia,
  deleteDia,
  deleteDiaGroup,
  acceptDiasHorasExtra,
  declineDiasHorasExtra,
  acceptMultipleDiasHorasExtra,
  declineMultipleDiasHorasExtra,
  getDiasProjetoUtilizador,
  getDiasUtilizador,
  exportDias,
  getAllDiasHorasExtraAccepted,
  getAllDiasHorasExtraDeclined,
  getAllDiasHorasExtraAcceptedResponsavel,
  getAllDiasHorasExtraDeclinedResponsavel,
  adicionarFerias,
  getDiaInf,
};
