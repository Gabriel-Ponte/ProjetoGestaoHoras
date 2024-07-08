import { useEffect,useMemo, useState, useLayoutEffect } from 'react';
import Wrapper from '../assets/wrappers/VisualizarHoras';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import Dia from './Dias';
import DiaTodos from './DiasTodos';
import { getAllDiasUtilizador, getAllDiasTodos, getAllDiasUtilizadorTipo } from '../features/allDias/allDiasSlice';
import { deleteDia } from '../features/dias/diasSlice';
import { getAllPagamentosUtilizador } from '../features/pagamentos/pagamentosSlice';
import { toast } from 'react-toastify';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { AddPagamentos, FormRowSelect } from '../components';
import { getFeriadosPortugalDate } from '../components/FeriadosPortugal';
import Calendar from './Calendar'
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';



const ListaHoras = () => {
  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const { dias } = useSelector((store) => store.allDias);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(user?.user?.nome);
  const [selectedUserID, setSelectedUserID] = useState(user?.user?.id)
  const [selectedDay, setSelectedDay] = useState();
  const [getFeriados, setFeriados] = useState([]);
  const [listaDias, setListaDias] = useState([]);
  const [listaDiasT, setListaDiasT] = useState([]);
  const [addHorasExtraIDS, setAddHorasExtraID] = useState([]);
  const [listaPagamentos, setListaPagamentos] = useState([]);

  const [listaTipoTrabalho, setListaTipoTrabalho] = useState(null);
  const [horasRealizadas, setHorasRealizadas] = useState(0);
  const [percentagemHoras, setPercentagemHoras] = useState(0);
  const [possibleHoursTodos, setPossibleHoursTodos] = useState(0);
  const [possibleHours, setPossibleHours] = useState(0);
  const [ferias, setFerias] = useState([]);
  const [aceitacao, setAceitacao] = useState([]);

  const [horasExtra, setHorasExtra] = useState(null);
  const [horasExtraMensal, setHorasExtraMensal] = useState(null);
  const [horasExtraAteMes, setHorasExtraAteMes] = useState(null);
  const [horasExtraAceitar, setHorasExtraAceitar] = useState(null);


  const [totalHorasPagas, setTotalHorasPagas] = useState(null);
  const [horasExtraPagasAteMes, setHorasExtraPagasAteMes] = useState(null);
  const [horasPagasMes, setHorasPagasMes] = useState(null);
  const [changePagamento, setChangePagamento] = useState(false)

  const [horasCompensacao, setHorasCompensacao] = useState([]);
  const [horasCompensacaoDomingo, setHorasCompensacaoDomingo] = useState([]);
  const [idCompensacao, setIDCompencacao] = useState(null)
  const [userNome, setUserNome] = useState(user?.user?.nome);
  // const [triggerEffect, setTriggerEffect] = useState(true);
  const [change, setChange] = useState(false);

  const dispatch = useDispatch();

  //const formattedListUtilizadores1 = Array.isArray(utilizadores) ? utilizadores : [];
  //const today = new Date();

  const today = useMemo(() => {
    return new Date();;
  }, []);

  const formattedListUtilizadores = useMemo(() => {
    return Array.isArray(utilizadores) ? utilizadores : [];
  }, [utilizadores]);


  function getPossibleHoursCount(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // number of days in the month
    let count = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const isHoliday = feriadosPortugal(date); // Check if the date is a Portuguese holiday
      if (date >= today) {
        break;
      }
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
        if (dayOfWeek === 5) {
          count += 6;
        } else {
          count += 8.5;
        }
      }
    }



    return count;
  }

  function feriadosPortugal(date) {
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
    setFeriados(feriados);
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


  
  const handleChangeCalendario = ((dia, mes, ano) => {
    const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];

    setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
  });


  const handleChangePagamento = (() => {
    setChangePagamento(!changePagamento);
  });

  const handleChangeUtilizador = ((e) => {

    const selectedID = e.target.options[e.target.selectedIndex].getAttribute('data-key');
    //const selectedValue = e.target.value;

    const { value } = e.target;

    setChange(!change);
    setSelectedUserID(selectedID);
    setSelectedUser(value);
    // setSelectedDay({ dia: 0, mes: today.getMonth(), ano: today.getFullYear() });
  });

  useEffect(() => {
    //const day = selectedDay ? selectedDay : today;
    let pagamentosUtilizadorArray = [];
  if (selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Outro" && selectedUser !== "Administradores") {
    dispatch(getAllPagamentosUtilizador({ selectedUserID })).then((res) => {
      pagamentosUtilizadorArray = Array.isArray(res?.payload?.pagamentosAllUtilizador) ? res.payload.pagamentosAllUtilizador : [];
      setListaPagamentos(pagamentosUtilizadorArray)
    })
  }

    dispatch(listaUtilizadores());
    let tipoTrabalhoArray = [];

    dispatch(getTipoTrabalho()).then((res) => {
      tipoTrabalhoArray = Array.isArray(res?.payload?.tipoTrabalho) ? res?.payload?.tipoTrabalho : [];

      setUserNome(selectedUser); // Update userNome state with the selected user name
      if (selectedUser === "Todos") {
        dispatch(getAllDiasTodos()).then((res) => {
          const listaDiasA = (typeof res.payload.diasAll !== "undefined") ? res.payload.diasAll : [];

          setListaDiasT(listaDiasA);
          // Remove the matching ferias from listaDias
          if (listaDiasA) {
            const updatedListaDias = listaDiasA.filter((dia) => {
              for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
                const aListaDias = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',').filter((tipo, index) => {
                  const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                  return horasArray && horasArray[index] > 0;
                });
                return aListaDias;
              }
              return null;
            })
            if (!arrayEquals(listaDias, updatedListaDias)) {
              setListaDias(updatedListaDias);
            }
          }
          setListaTipoTrabalho(tipoTrabalhoArray);
        });

      } else if (selectedUser === "Engenharia de Processos" || selectedUser === "Laboratorio" || selectedUser === "Outro" || selectedUser === "Administradores") {
        let tipo = 0;

        if (selectedUser === "Engenharia de Processos") {
          tipo = 1;
        } else if (selectedUser === "Administradores") {
          tipo = 2;
        }
        else if (selectedUser === "Laboratorio") {
          tipo = 3;
        } else if (selectedUser === "Outro") {
          tipo = 4;
        }

        dispatch(getAllDiasUtilizadorTipo({ userTipo: tipo })).then((res) => {
          const listaDiasA = (typeof res.payload.diasAllUtilizador !== "undefined") ? res.payload.diasAllUtilizador : [];

          setListaDiasT(listaDiasA);
          // Remove the matching ferias from listaDias
          if (listaDiasA) {
            const updatedListaDias = listaDiasA.filter((dia) => {
              for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
                const aListaDias = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',').filter((tipo, index) => {
                  const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                  return horasArray && horasArray[index] > 0;
                });
                return aListaDias;
              }
              return null;
            })
            if (!arrayEquals(listaDias, updatedListaDias)) {
              setListaDias(updatedListaDias);
            }
          }
          setListaTipoTrabalho(tipoTrabalhoArray);
        });
      } else {


        dispatch(getAllDiasUtilizador({ userNome: selectedUser })).then((res) => {
          const listaDiasA = (typeof res.payload.diasAllUtilizador !== "undefined") ? res.payload.diasAllUtilizador : [];
          const idFerias = tipoTrabalhoArray.find((tipo) => tipo.TipoTrabalho === "Ferias")?._id;
          const idCompensacao = tipoTrabalhoArray.find((tipo) => tipo.tipo === 4)?._id;
          const addHorasExtraID = tipoTrabalhoArray.find((tipo) => tipo.tipo === 5)?._id;

          setAddHorasExtraID(addHorasExtraID);
          setIDCompencacao(idCompensacao)
          setListaDiasT(listaDiasA);

          let countHours = 0;
          //let countHoursCompencacao = 0;
          const dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));

          const startDay = dayStart.getDate();
          const startMonth = dayStart.getMonth();
          const startYear = dayStart.getFullYear();

          listaDiasA.filter(item => item.accepted !== 1).map(item => {
            const date = new Date(item.Data)
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isFriday = dayOfWeek === 5;


            const currentDay = date.getDate();
            const currentMonth = date.getMonth();
            const currentYear = date.getFullYear();
            if (
              currentYear > startYear ||
              (currentYear === startYear && currentMonth > startMonth) ||
              (
                currentYear === startYear &&
                currentMonth === startMonth &&
                currentDay >= startDay)
            ) {
              let extraHours = 0;
              for (let i = 0; i < item.tipoDeTrabalhoHoras.length; i++) {
                const projeto = item.tipoDeTrabalhoHoras[i]

                const tt = projeto.tipoTrabalho.split(',') || [];
                const ttH = projeto.horas.split(',') || [];
                for (let j = 0; j < tt.length; j++) {
                  if (tt[j] === idCompensacao) {
                    countHours -= ttH[j];

                  //countHoursCompencacao += parseFloat(ttH[j]);
                  }

                  if (tt[j] === addHorasExtraID) {
                    countHours += parseFloat(ttH[j]);
                    extraHours = parseFloat(ttH[j]);
                  }
                }
              }
              if (feriadosPortugal(date) && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 0) {
                countHours += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));
                return true;
              }

              if (isWeekend && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 0) {
                countHours += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));

                return true;
              }
              if (isFriday && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 6) {
                countHours += (parseFloat(item.NumeroHoras - 6) - parseFloat(extraHours));
                return true;
              }
              if (!isFriday && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 8.5) {
                countHours += (parseFloat(item.NumeroHoras - 8.5) - parseFloat(extraHours));
                return true;
              }
              return false;
            }
            return false;
          });

          let pagamentosCount = 0;
          for (let k = 0; k < pagamentosUtilizadorArray.length; k++) {
            const count = pagamentosUtilizadorArray[k].Horas;
            pagamentosCount += parseFloat(count);
          }

          const valueHE = parseFloat(countHours) - parseFloat(pagamentosCount);
          //setHorasCompencacao(countHoursCompencacao);
          setHorasExtra(convertToMinutes(valueHE))
          setTotalHorasPagas(pagamentosCount);

          if (idFerias && dias) {
            // Filter the dias array to get the matching ferias and update the state
            const updatedFerias = dias.filter((dia) => {
              for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
                const tiposTrabalho = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',')
                  .filter((tipo, index) => {
                    const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                    return horasArray && horasArray[index] > 0;
                  });

                return tiposTrabalho.includes(idFerias);
              }
              return null;
            });
            if (!arrayEquals(ferias, updatedFerias)) {
              setFerias(updatedFerias);
            }

            // Remove the matching ferias from listaDias
            if (listaDiasA) {
              const updatedListaDias = listaDiasA.filter((dia) => {
                for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
                  const aListaDias = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',').filter((tipo, index) => {

                    const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                    return horasArray && horasArray[index] > 0;
                  });

                  return !aListaDias.includes(idFerias);
                }
                return null;
              })

              if (!arrayEquals(listaDias, updatedListaDias)) {
                setListaDias(updatedListaDias);
              }
            }
            setListaTipoTrabalho(tipoTrabalhoArray);
          }
          

          if(idCompensacao && dias){
            // Filter the dias array to get the matching Compensacao and update the state
            const updatedCompensacao = dias.filter((dia) => {
              for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
                const tiposTrabalho = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',')
                  .filter((tipo, index) => {
                    const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                    return horasArray && horasArray[index] > 0;
                  });

                return tiposTrabalho.includes(idCompensacao);
              }
              return null;
            });
            if (!arrayEquals(ferias, updatedCompensacao)) {
              setHorasCompensacao(updatedCompensacao);
            }

            // Remove the matching ferias from listaDias
            if (listaDiasA) {
              const updatedListaDias = listaDiasA.filter((dia) => {
                for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
                  const aListaDias = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',').filter((tipo, index) => {

                    const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                    return horasArray && horasArray[index] > 0;
                  });

                  return !aListaDias.includes(idFerias);
                }
                return null;
              })

              if (!arrayEquals(listaDias, updatedListaDias)) {
                setListaDias(updatedListaDias);
              }
            }
            setListaTipoTrabalho(tipoTrabalhoArray);
          }

          ////////////////////////////

          if (dias) {
            // Filter the dias array to get the matching aceitacao and update the state
            const updatedAceitacao = dias.filter((dia) => {
              if (dia.accepted === 1 || dia.accepted === 4) {
                return dia;
              }
              return null;
            });


            if (!arrayEquals(aceitacao, updatedAceitacao)) {
              setAceitacao(updatedAceitacao);
            }



            const updatedCompensacaoDomingo = dias.filter((dia) => {
              if (dia.accepted === 5) {
                return dia;
              }
              return null;
            });


            if (!arrayEquals(horasCompensacaoDomingo, updatedCompensacaoDomingo)) {
              setHorasCompensacaoDomingo(updatedCompensacaoDomingo);
            }

            // Remove the matching aceitacao from listaDias
            // if (listaDiasA) {
            //   const updatedListaDias = listaDiasA.filter((dia) => {
            //     if (dia.accepted !== 1) {
            //       return dia;
            //     }

            //     for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
            //       const aListaDias = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',').filter((tipo, index) => {

            //         const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
            //         return horasArray && horasArray[index] > 0;
            //       });

            //       return !aListaDias.includes(idFerias);
            //     }
            //     return null;
            //   })

            //   // if (!arrayEquals(listaDias, updatedListaDias)) {
            //   //   //setListaDias(updatedListaDias);
            //   // }
            // }

          }
        });
      }
    });
   
  }, [selectedUser, horasExtra, listaDias, listaDias.length,  aceitacao, changePagamento, dispatch]);

  //  }, [selectedUser, listaDias[0], horasExtra, listaTipoTrabalho?.length, ferias[0], aceitacao[0], changePagamento, dispatch]);
  
  function arrayEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i]._id_D !== b[i]._id_D) return false;
    }
    return true;
  }


  useEffect(() => {
    const month = selectedDay ? selectedDay?.mes : today.getMonth();
    const year = selectedDay ? selectedDay?.ano : today.getFullYear();
    let possibleHoursCount = getPossibleHoursCount(month, year);
    let horasRealizadasCount = 0;

    let filteredUsers = formattedListUtilizadores.filter((user) => user && user.nome !== "Admin");

    if (selectedUser === "Engenharia de Processos") {
      filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 1 || user.tipo === 5));
    } else if (selectedUser === "Administradores") {
      filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 2 || user.tipo === 5 || user.tipo === 6 || user.tipo === 7));
    } else if (selectedUser === "Laboratorio") {
      filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 3 || user.tipo === 6));
    } else if (selectedUser === "Outro") {
      filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 4 || user.tipo === 7));
    }

    if (selectedUser === "Todos" || selectedUser === "Engenharia de Processos" || selectedUser === "Administradores" || selectedUser === "Laboratorio" || selectedUser === "Outro") {
      setPossibleHoursTodos(possibleHoursCount)
      possibleHoursCount = possibleHoursCount * (filteredUsers.length)
    }


    if (listaDiasT) {
      for (let i = 0; i < listaDiasT.length; i++) {
        const data = new Date(listaDiasT[i].Data);
        if (year === data.getFullYear() && month === data.getMonth()) {
          horasRealizadasCount += listaDiasT[i].NumeroHoras;
          for (let h = 0; h < listaDiasT[i].tipoDeTrabalhoHoras.length; h++) {
            const projeto = listaDiasT[i].tipoDeTrabalhoHoras[h]
            const tt = projeto.tipoTrabalho.split(',') || [];
            const ttH = projeto.horas.split(',') || [];

            for (let j = 0; j < tt.length; j++) {
              if (tt[j] === addHorasExtraIDS) {
                horasRealizadasCount -= ttH[j]
              }
            }
          }
        }
      }

      let countHoursMonth = 0;
      let countHoursUntilMonth = 0;
      let countHoursAccept = 0;
      const dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));

      const startDay = dayStart.getDate();
      const startMonth = dayStart.getMonth();
      const startYear = dayStart.getFullYear();

      listaDiasT.filter(item => ((new Date(item.Data)).getMonth() <= month - 1 && (new Date(item.Data)).getFullYear() === year) || ((new Date(item.Data)).getFullYear() < year)).forEach(item => {
        const date = new Date(item.Data)
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isFriday = dayOfWeek === 5;


        const currentDay = date.getDate();
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
        if (
          currentYear > startYear ||
          (currentYear === startYear && currentMonth > startMonth) ||
          (
            currentYear === startYear &&
            currentMonth === startMonth &&
            currentDay >= startDay)
        ) {
          let extraHours = 0;
          for (let i = 0; i < item.tipoDeTrabalhoHoras.length; i++) {
            const projeto = item.tipoDeTrabalhoHoras[i]

            const tt = projeto.tipoTrabalho.split(',') || [];
            const ttH = projeto.horas.split(',') || [];
            for (let j = 0; j < tt.length; j++) {
              if (tt[j] === idCompensacao) {
                countHoursUntilMonth -= ttH[j];
              }

              if (tt[j] === addHorasExtraIDS) {
                countHoursUntilMonth += parseFloat(ttH[j]);
                extraHours = parseFloat(ttH[j]);
              }
            }
          }
          if (feriadosPortugal(date) && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 0) {
            countHoursUntilMonth += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));
            return true;
          }

          if (isWeekend && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 0) {
            countHoursUntilMonth += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));

            return true;
          }
          if (isFriday && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 6) {
            countHoursUntilMonth += (parseFloat(item.NumeroHoras - 6) - parseFloat(extraHours));
            return true;
          }
          if (!isFriday && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 8.5) {
            countHoursUntilMonth += (parseFloat(item.NumeroHoras - 8.5) - parseFloat(extraHours));
            return true;
          }
          return false;
        }
        return false;
      });

      let pagamentosAteMesCount = 0;

      listaPagamentos.filter(item => (item.Mes <= month - 1 && item.Ano === year) || (item.Ano < year)).forEach(item => {
        const count = parseFloat(item.Horas);
        pagamentosAteMesCount += count;
      });


      listaDiasT.filter(item => ((new Date(item.Data)).getMonth() === month && (new Date(item.Data)).getFullYear() === year)).forEach(item => {
        const date = new Date(item.Data)
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isFriday = dayOfWeek === 5;


        const currentDay = date.getDate();
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
        if (
          currentYear > startYear ||
          (currentYear === startYear && currentMonth > startMonth) ||
          (
            currentYear === startYear &&
            currentMonth === startMonth &&
            currentDay >= startDay)
        ) {
          let extraHours = 0;
          for (let i = 0; i < item.tipoDeTrabalhoHoras.length; i++) {
            const projeto = item.tipoDeTrabalhoHoras[i]

            const tt = projeto.tipoTrabalho.split(',') || [];
            const ttH = projeto.horas.split(',') || [];
            for (let j = 0; j < tt.length; j++) {
              if (tt[j] === idCompensacao) {
                if (item.accepted === 1) {
                  countHoursAccept -= ttH[j];
                } else {
                  countHoursMonth -= ttH[j];
                }
              }

              if (tt[j] === addHorasExtraIDS) {
                if (item.accepted === 1) {
                  countHoursAccept -= (parseFloat(item.NumeroHoras) - parseFloat(extraHours));
                } else {
                  countHoursMonth += parseFloat(ttH[j]);
                  extraHours = parseFloat(ttH[j]);
                }

              }
            }
          }
          if (feriadosPortugal(date) && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 0) {
            if (item.accepted === 1) {
              countHoursAccept += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));
            } else {
              countHoursMonth += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));
            }

            return true;
          }

          if (isWeekend && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 0) {
            if (item.accepted === 1) {
              countHoursAccept += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));
            } else {
              countHoursMonth += (parseFloat(item.NumeroHoras) - parseFloat(extraHours));
            }
            return true;
          }
          if (isFriday && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 6) {
            if (item.accepted === 1) {
              countHoursAccept += (parseFloat(item.NumeroHoras - 6) - parseFloat(extraHours));
            } else {
              countHoursMonth += (parseFloat(item.NumeroHoras - 6) - parseFloat(extraHours));
            }
            return true;
          }
          if (!isFriday && (parseFloat(item.NumeroHoras) - parseFloat(extraHours)) > 8.5) {
            if (item.accepted === 1) {
              countHoursAccept += (parseFloat(item.NumeroHoras - 8.5) - parseFloat(extraHours));
            } else {
              countHoursMonth += (parseFloat(item.NumeroHoras - 8.5) - parseFloat(extraHours));
            }
            return true;
          }
          return false;
        }
        return false;
      });


      let pagamentosMesCount = 0;
      listaPagamentos.filter(item => item.Mes === month && item.Ano === year)
        .forEach(item => {
          const count = parseFloat(item.Horas);
          pagamentosMesCount += count;
        });



      const extraAteMes = parseFloat(countHoursUntilMonth) - parseFloat(pagamentosAteMesCount);
      const extraMes = parseFloat(countHoursMonth) - parseFloat(pagamentosMesCount);


      setHorasPagasMes(pagamentosMesCount);
      setHorasExtraPagasAteMes(pagamentosAteMesCount);


      setHorasExtraAteMes(extraAteMes);
      setHorasExtraMensal(extraMes);


      setHorasExtraAceitar(countHoursAccept);

    }



    setPercentagemHoras((horasRealizadasCount / possibleHoursCount) * 100);
    setPossibleHours(possibleHoursCount);
    setHorasRealizadas(horasRealizadasCount);

     
  }, [listaPagamentos, listaDias, listaDias.length, selectedDay, percentagemHoras, horasRealizadas, selectedUser]);


  useLayoutEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 750);

   
  }, [selectedUser,aceitacao, ferias[0], listaDias]);


  const diaSelected = selectedDay ? selectedDay?.dia : 0;
  const month = selectedDay ? selectedDay.mes : today.getMonth();
  const year = selectedDay ? selectedDay.ano : today.getFullYear();

  let filteredUsers = formattedListUtilizadores.filter((user) => user && user.nome !== "Admin");

  if (selectedUser === "Engenharia de Processos") {
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 1 || user.tipo === 5));
  } else if (selectedUser === "Administradores") {
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 2 || user.tipo === 5 || user.tipo === 6 || user.tipo === 7));
  } else if (selectedUser === "Laboratorio") {
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 3 || user.tipo === 6));
  } else if (selectedUser === "Outro") {
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 4 || user.tipo === 7));
  }


  
  const deleteDiaConfirm = async (id ,data) => {
    try {
      const dataString = (data ? new Date(data).toLocaleDateString('en-CA') : '')
      const confirmed = window.confirm("Tem a certeza que deseja apagar o Dia: "+ dataString +"?");

      if (confirmed) {
        const result = await dispatch(deleteDia(id));
        if (!result.error) {
          toast.success("Dia Apagado")
          const updatedListaDias = listaDias.filter(dia => dia._id !== id);
          const updateAceitacao = aceitacao.filter(dia => dia._id !== id);
          const updatedFerias = ferias.filter(dia => dia._id !== id);          
          
          
          setFerias(updatedFerias);
          setAceitacao(updateAceitacao);
          setListaDias(updatedListaDias);


          selectedDay.dia = 0;
          setSelectedDay(selectedDay)
            // setTimeout(() => {
            //   window.location.href = '/PaginaVisualizarHoras';
            // }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };
  
  function convertToMinutes(timeString) {

    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");
        const hoursInt = parseInt(hours, 10);
        minutes = parseInt(minutes) < 10 ? `${minutes}0` : minutes;

        if (!minutes) {
          minutes = 0;
        }

        let formattedMinutes = Math.round(minutes * 60) / 100;
        if (formattedMinutes === 60) {
          formattedMinutes = 0;
        }
        // Use String.padStart to format hours and minutes with leading zeros
        const formattedHours = hoursInt.toString().padStart(2, "0");
        formattedMinutes = formattedMinutes.toString().padStart(2, '0');

        const positive = (timeString < 0) ? "" : ""
        const formattedTime = `${positive}${formattedHours}:${formattedMinutes}`;

        return formattedTime;
      } catch (error) {
        console.error(error)
        return timeString;
      }
    }
    return timeString;
  }

  function parseDurationToHours(duration) {
    try {
      const [hours, minutes] = duration.split(':').map(parseFloat);
      return hours + (minutes / 60);
    } catch {
      return duration;
    }
  }

  // //Change to refresh
  if (loading || !dias || !listaTipoTrabalho) {
    return <Loading />;
  }

  let checkFound = false;
  let count = 0;
 

  return (
    <Wrapper>
      <div className='mainVisualiza'>
        {((user?.user?.tipo === 2 || user?.user?.tipo === 5 || user?.user?.tipo === 6 || user?.user?.tipo === 7) && (
          <div className='text-center mb-5'>
            <h3 className='mb-5'>Escolha Utilizador</h3>

            {(() => {
              let filteredUsers = formattedListUtilizadores;

              if (user?.user?.tipo === 5) {
                filteredUsers = formattedListUtilizadores.filter((user) => user && (user.tipo === 1 || user.tipo === 5));

              } else if (user?.user?.tipo === 6) {
                filteredUsers = formattedListUtilizadores.filter((user) => user && (user.tipo === 3 || user.tipo === 6));
              } //else if (user?.user?.tipo === 7) {
              //filteredUsers = formattedListUtilizadores.filter((user) => user && (user.tipo === 4 ));
              //}

              return (
                <FormRowSelect
                  type="text"
                  className="row mb-3 text-center"
                  classNameLabel='col-md-3 text-end'
                  classNameInput='col-md-9'
                  classNameResult='col-md-6 text-start'
                  id="piloto"
                  name="Piloto"
                  labelText="Utilizador:"
                  value={selectedUser}
                  list={filteredUsers}
                  handleChange={handleChangeUtilizador}
                  multiple={false}
                  todos={user?.user?.tipo}
                />
              );
            })()}
          </div>
        ))}
        <div className='row mb-3'>
          <div className='col-10'>
            <h1 className='userName'>{userNome}</h1>
            <div className='row'>
              <div className='col-md-4 text-center'>
                <div className='row'>
                  <p>Horas Possiveis: {convertToMinutes(possibleHours)}</p>
                </div>

                <div className='row'>
                  <p>Horas Realizadas: {convertToMinutes(horasRealizadas)}</p>
                </div>

                <div className='row'>
                  {percentagemHoras >= 0 && percentagemHoras !== Infinity && <p>{percentagemHoras.toFixed(1)}%</p>}
                </div>
              </div>

              {//////////////////////////////
              }
              <div className='col-md-4 text-center'>

                <div className='row'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
                    <p>Horas extra até este mês: {convertToMinutes(horasExtraAteMes)}</p>
                  )}
                </div>

                <div className='row'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (parseDurationToHours(horasExtraMensal) !== 0) && (
                    <p>Horas extra este mês: {convertToMinutes(horasExtraMensal)}</p>
                  )}
                </div>

                <div className='row'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
                    <p>Total horas extra por dar: {horasExtra}</p>
                  )}
                </div>

                <div className='row'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
                    <p>Horas extra por aceitar: {convertToMinutes(horasExtraAceitar)}</p>
                  )}
                </div>




              </div>


              {//////////////////////////////
              }

              <div className='col-md-4 text-center'>

                <div className='row'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
                    <p>Total horas pagas: {convertToMinutes(totalHorasPagas)}</p>
                  )}
                </div>

                <div className='row'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
                    <p>Horas extra pagas até este mês: {convertToMinutes(horasExtraPagasAteMes)}</p>
                  )}
                </div>

                <div className='row'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
                    <p>Horas Extra pagas este mês: {convertToMinutes(horasPagasMes)}</p>
                  )}
                </div>


              </div>
            </div>


          </div>


          <div className='col-2 description'>
            <div className='row mb'>
              <div className='col-9 text-end'>
                <p>Fim de Semana</p>
              </div>
              <div className='col-3'>
                <p className='fimSemana'></p>
              </div>
            </div>

            <div className='row'>
              <div className='col-9 text-end'>
                <p>Feriados</p>
              </div>
              <div className='col-3'>
                <p className='feriados'></p>
              </div>
            </div>
            {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
            <div className='row'>
              <div className='col-9 text-end'>
                <p>Férias</p>
              </div>
              <div className='col-3'>
                <p className='ferias'></p>
              </div>
            </div>
            )}
            {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
            <div className='row'>
              <div className='col-9 text-end'>
                <p>Horas Compensação</p>
              </div>
              <div className='col-3'>
                <p className='horasCompensacao'></p>
              </div>
            </div>
            )}
            <div className='row'>
              <div className='col-9 text-end'>
                <p>Horário Completo</p>
              </div>
              <div className='col-3'>
                <p className='normal'></p>
              </div>
            </div>

            <div className='row'>
              <div className='col-9 text-end'>
                <p>Horas extra</p>
              </div>
              <div className='col-3'>
                <p className='extra'></p>
              </div>
            </div>


            <div className='row'>
              <div className='col-9 text-end'>
                <p>Horário Incompleto</p>
              </div>

              <div className='col-3'>
                <p className='menos'></p>
              </div>
            </div>
            {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && (
              <>
              <div className='row'>
                <div className='col-9 text-end'>
                  <p>Horas em Aceitação</p>
                </div>
                <div className='col-3'>
                  <p className='filtro'></p>
                </div>
              </div>


              <div className='row'>
              <div className='col-9 text-end'>
                <p>Compensação Domingo</p>
              </div>
              <div className='col-3'>
                <p className='compensDomingo'></p>
              </div>
              </div>
             
              </>
            )}
          </div>
          {(user?.user?.tipo === 7) && parseDurationToHours(horasExtra) > 0 && (selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro") && 
            <AddPagamentos
              horasExtraEsteMes={horasExtraMensal}
              horasPorDar={horasExtra}
              selectedUser={selectedUserID}
              responsableUser={user?.user?.id}
              month={selectedDay ? selectedDay.mes : today.getMonth()}
              year={selectedDay ? selectedDay.ano : today.getFullYear()}
              handleChange={handleChangePagamento}
            />
          }
        </div>
        {(listaDias && listaDias.length < 1) ? (
          <>
            {(selectedUser === "Todos" || selectedUser === "Engenharia de Processos" || selectedUser === "Administradores" || selectedUser === "Laboratorio" || selectedUser === "Outro") ? (
              <div className='projetos'>
                <h2>Grupo não possui horas inseridas</h2>
              </div>
            ) : (
              <div className='projetos'>
                <h2>Utilizador não possui horas inseridas</h2>
              </div>
            )}
          </>
        ) : (

          <>

            {(selectedUser === "Todos" || selectedUser === "Engenharia de Processos" || selectedUser === "Administradores" || selectedUser === "Laboratorio" || selectedUser === "Outro") ? (
              <div key={"todos"}>
                <div className='col-12' key={"divMainTodos"}>
                  <Calendar
                    key={"calendarTodos"}
                    handleChange={handleChangeCalendario}
                    inserted={listaDias}
                    feriados={getFeriados}
                    ferias={ferias}
                    aceitacao={aceitacao}
                    todos={true}
                    numberUsers={filteredUsers.length}
                    horasExtraID={addHorasExtraIDS}
                    selectedDate={selectedDay}
                  />
                </div>
                <hr key={"hrTodos"}></hr>



                <div className='text-center'  key={"text_centerTodos"}>
                  {listaDiasT.filter((dia) => {
                    const data = new Date(dia.Data);
                    const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                    const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();
                    if (isSameDate && isSameMonth) {
                      checkFound = true
                    }
                    return isSameMonth && isSameDate;
                  }).length === 0 && diaSelected === 0 && (
                      <h2>Sem Horas inseridas neste mês</h2>
                    )}

                  {listaDiasT.filter((dia) => {
                    const data = new Date(dia.Data);
                    const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                    const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();
                    if (isSameDate && isSameMonth) {
                      checkFound = true
                    }
                    return isSameMonth && isSameDate;
                  }).length === 0 && diaSelected !== 0 && (
                      <h2>Sem Horas inseridas neste dia {diaSelected}</h2>
                    )}

                  {filteredUsers.map((user) => {
                    const filteredDias = listaDiasT.filter((dia) => dia.Utilizador === user._id);

                    let count = 0;
                    let dias = [];

                    if (filteredDias && filteredDias.length > 0) {
                      filteredDias.map((dia) => {
                        const data = new Date(dia.Data);
                        const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                        const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                        if (isSameMonth && isSameDate) {
                          count += parseFloat(dia.NumeroHoras);

                          for (let j = 0; j < dia.tipoDeTrabalhoHoras.length; j++) {
                            const projeto = dia.tipoDeTrabalhoHoras[j]
                            const tt = projeto.tipoTrabalho.split(',') || [];
                            const ttH = projeto.horas.split(',') || [];

                            for (let h = 0; h < tt.length; h++) {
                              if (tt[h] === addHorasExtraIDS) {
                                count -= parseFloat(ttH[h]);
                              }
                            }
                          }
                        }

                        return null;
                      });
                    }
                    return { user, count, dias };
                  })
                    .sort((a, b) => b.count - a.count)
                    .map(({ user, count, dias }) => {
                      if (checkFound) {
                        return <DiaTodos
                          key={user._id + "todos"}
                          Dias={dias}
                          horasPossiveis={possibleHoursTodos}
                          NumeroHoras={count}
                          Utilizador={user}
                          diaSelected={diaSelected}
                        />
                      }
                      else {
                        return null
                      }
                    })
                  }
                </div>

              </div>
            ) : (




              <div key={"utilizadorSeleccionado"}>
                <div className='col-12'>
                  <Calendar
                    handleChange={handleChangeCalendario}
                    inserted={listaDias}
                    feriados={getFeriados}
                    ferias={ferias}
                    compensacao ={horasCompensacao}
                    compensacaoDomingo = {horasCompensacaoDomingo}
                    aceitacao={aceitacao}
                    horasExtraID={addHorasExtraIDS}
                    selectedDate={selectedDay}
                  />
                </div>
                <hr></hr>

                <div className='text-center'>

                  {
                    (() => {
                      
                      let isFeriado = false;

                      const selectedDay = dias.find((dia) => {
                        const data = new Date(dia.Data);
                        const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                        const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();
                        return isSameMonth && isSameDate;
                      });

                      if (diaSelected !== 0) {
                        const dataCompare = new Date (year,month,diaSelected ,0 ,0 ,0)
                        isFeriado = getFeriadosPortugalDate(dataCompare);
                      } else {
                        isFeriado = false;
                      }


                      if (selectedDay) {
                  
                        return (
                          <div>
                            {isFeriado && 
                              <h4>{isFeriado}</h4>
                            }

                          </div>
                        );
                      } else if (diaSelected === 0) {
                        return (
                          <div>
                            <h2>Sem Horas inseridas neste mês</h2>
                          </div>
                        );
                      } else if (diaSelected !== 0 || diaSelected !== "0") {
                        return (
                          <div>
                            {isFeriado && 
                              <h4>{isFeriado}</h4>
                            }
                            <h2>Sem Horas inseridas neste dia {diaSelected}</h2>
                          </div>
                        );
                      }

                    })()
                  }
                </div>
                

                <div>
                  {dias.map((dia) => {
                    // for (let a = 0; a < dia.tipoDeTrabalhoHoras.length; a++) {
                    //   if (dia.tipoDeTrabalhoHoras[a].length > 0) {
                    //     for (let j = 0; j < dia.tipoDeTrabalhoHoras[a].length; j++) {
                    //     }
                    //   }
                    // }


                    const data = new Date(dia.Data);
                    const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                    const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                    if (isSameMonth && isSameDate) {
                      count++;
                      return (
                        <div key={count + selectedUser}>
                          {/* <Dia key={dia.Data + selectedUser + count} {...dia} horasPossiveis={possibleHours} listaTT={listaTipoTrabalho} deleteDay={deleteDiaConfirm}/> */}
                          <Dia key={dia.Data + selectedUser + count} {...dia} listaTT={listaTipoTrabalho} tipoUser={user.user.tipo} deleteDay={deleteDiaConfirm}/>
                        </div>
                      );
                    }
                    return null;
                  })}

                </div>



              </div>
            )}
          </>
        )

        }
      </div>
    </Wrapper >
  );


};


export default ListaHoras;