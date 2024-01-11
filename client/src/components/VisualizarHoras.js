import { useEffect, useState } from 'react';
import Wrapper from '../assets/wrappers/VisualizarHoras';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import Dia from './Dias';
import DiaTodos from './DiasTodos';
import { getAllDiasUtilizador, getAllDiasTodos, getAllDiasUtilizadorTipo } from '../features/allDias/allDiasSlice';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { FormRowSelect } from '../components';
import Calendar from './Calendar'
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';


const ListaHoras = () => {
  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const { dias } = useSelector((store) => store.allDias);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(user?.user?.nome);
  const [selectedDay, setSelectedDay] = useState();
  const [getFeriados, setFeriados] = useState([]);
  const [listaDias, setListaDias] = useState([]);
  const [listaDiasT, setListaDiasT] = useState([]);
  const [addHorasExtraIDS, setAddHorasExtraID] = useState([]);

  const [listaTipoTrabalho, setListaTipoTrabalho] = useState(null);
  const [horasRealizadas, setHorasRealizadas] = useState(0);
  const [percentagemHoras, setPercentagemHoras] = useState(0);
  const [possibleHoursTodos, setPossibleHoursTodos] = useState(0);
  const [possibleHours, setPossibleHours] = useState(0);
  const [ferias, setFerias] = useState([]);

  const [horasExtra, setHorasExtra] = useState(null);
  const [horasCompencacao, setHorasCompencacao] = useState(null);

  const [userNome, setUserNome] = useState(user?.user?.nome);

  const [change, setChange] = useState(false);
  const dispatch = useDispatch();

  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];
  const today = new Date();




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
        { name: "Implantação da República", date: new Date(i, 9, 5) },
        { name: "Dia de Todos os Santos", date: new Date(i, 10, 1) },
        { name: "Restauração da Independência", date: new Date(i, 11, 1) },
        { name: "Dia da Imaculada Conceição", date: new Date(i, 11, 8) },
        { name: "Natal", date: new Date(i, 11, 25) },
        { name: "NatalGiven", date: new Date(i, 11, 26) },
        { name: "Sexta-feira Santa", date: calculateEaster(i, "SextaFeiraSanta") },
        { name: "Páscoa", date: calculateEaster(i, "DomingoPascoa") },
        { name: "Segunda-feira de Páscoa", date: calculateEaster(i, "SegundaPascoa") },
        { name: "Corpo de Deus", date: calculateCorpusChristi(i) }
      );
    }
    setFeriados(feriados);
    for (const feriado of feriados) {
      if (
        date.getDate() === feriado.date.getDate() &&
        date.getMonth() === feriado.date.getMonth()
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


  const handleChangeUtilizador = ((e) => {
    const { value } = e.target;
    setChange(!change);
    setSelectedUser(value);
  });

  useEffect(() => {
    dispatch(listaUtilizadores());
    let tipoTrabalhoArray = [];

    dispatch(getTipoTrabalho()).then((res) => {
      tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];

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

      } else if(selectedUser === "Engenharia de Processos" || selectedUser === "Laboratorio" || selectedUser === "Outro" || selectedUser === "Administradores"){
        let tipo = 0;

        if(selectedUser === "Engenharia de Processos"){
          tipo = 1;
        }else if  (selectedUser === "Administradores"){
          tipo = 2;
        }
        else if  (selectedUser === "Laboratorio"){
          tipo = 3;
        } else if( selectedUser === "Outro"){
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
      }else {
        dispatch(getAllDiasUtilizador({ userNome: selectedUser })).then((res) => {
          const listaDiasA = (typeof res.payload.diasAllUtilizador !== "undefined") ? res.payload.diasAllUtilizador : [];
          const idFerias = tipoTrabalhoArray.find((tipo) => tipo.TipoTrabalho === "Ferias")?._id;
          const idCompensação = tipoTrabalhoArray.find((tipo) => tipo.tipo === 4)?._id;
          const addHorasExtraID = tipoTrabalhoArray.find((tipo) => tipo.tipo === 5)?._id;

          setAddHorasExtraID(addHorasExtraID);
          setListaDiasT(listaDiasA);

          let countHours = 0;
          let countHoursCompencacao = 0;

          const dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));

          const startDay = dayStart.getDate();
          const startMonth = dayStart.getMonth();
          const startYear = dayStart.getFullYear();

          listaDiasA.filter(item => {
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
                  if (tt[j] === idCompensação) {
                    countHours -= ttH[j];
                    countHoursCompencacao += parseFloat(ttH[j]);
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

          setHorasCompencacao(countHoursCompencacao);
          setHorasExtra(convertToMinutes(countHours))

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
        });
      }
    });
  }, [selectedUser, listaDias, ferias, dispatch]);

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
    const month = selectedDay ? selectedDay.mes : today.getMonth();
    const year = selectedDay ? selectedDay.ano : today.getFullYear();
    let possibleHoursCount = getPossibleHoursCount(month, year);
    let horasRealizadasCount = 0;

    let filteredUsers = formattedListUtilizadores.filter((user) => user && user.nome !== "Admin");

    if (selectedUser === "Engenharia de Processos"){
      filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 1 || user.tipo === 5));
    } else if (selectedUser === "Administradores"){
      filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 2 || user.tipo === 5 || user.tipo === 6));
    } else if (selectedUser === "Laboratorio" ){
      filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 3 || user.tipo === 6));
    } else if(selectedUser === "Outro"){
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
    }

    setPercentagemHoras((horasRealizadasCount / possibleHoursCount) * 100);


    setPossibleHours(possibleHoursCount);
    setHorasRealizadas(horasRealizadasCount);


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaDias, selectedDay, percentagemHoras, horasRealizadas, selectedUser]);

  useEffect(() => {

    setLoading(true);


    setTimeout(() => {
      setLoading(false);
    }, 1);
  }, [listaDias]);

  const diaSelected = selectedDay ? selectedDay.dia : 0;
  const month = selectedDay ? selectedDay.mes : today.getMonth();
  const year = selectedDay ? selectedDay.ano : today.getFullYear();

  let filteredUsers = formattedListUtilizadores.filter((user) => user && user.nome !== "Admin");

  if (selectedUser === "Engenharia de Processos"){
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 1 || user.tipo === 5));
  } else if (selectedUser === "Administradores"){
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 2 || user.tipo === 5 || user.tipo === 6));
  } else if (selectedUser === "Laboratorio" ){
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 3 || user.tipo === 6));
  } else if(selectedUser === "Outro"){
    filteredUsers = filteredUsers.filter((user) => user && (user.tipo === 4 || user.tipo === 7));
  }

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

        const formattedTime = `${formattedHours}:${formattedMinutes}`;

        return formattedTime;
      } catch (error) {
        console.error(error)
        return timeString;
      }
    }
    return timeString;
  }

  // //Change to refresh
   if (loading   || !dias || !listaTipoTrabalho) {
     return <Loading />;
   }

  let checkFound = false


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
      } else if (user?.user?.tipo === 7) {
        filteredUsers = formattedListUtilizadores.filter((user) => user && (user.tipo === 4 || user.tipo === 7));
      }

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
          <div className='col-6'>
            <h1 className='userName'>{userNome}</h1>

            <div className='row'>
              <div className='col-md-6 text-center'>
                <p>Horas Possiveis: {convertToMinutes(possibleHours)}</p>
              </div>
              <div className='col-md-6 text-center'>
                {percentagemHoras >= 0 && percentagemHoras !== Infinity && <p>{percentagemHoras.toFixed(1)}%</p>}
              </div>
              <div className='col-md-6 text-center'>
                <p>Horas Realizadas: {convertToMinutes(horasRealizadas)}</p>
              </div>
              <div className='col-md-6 text-center'>
                {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" &&  selectedUser !== "Outro" ) && (parseFloat(horasExtra) > 0) && (
                  <p>Horas extra por dar: {horasExtra}</p>
                )}
              </div>
            </div>
          </div>


          <div className='col-6 description'>
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

            <div className='row'>
              <div className='col-9 text-end'>
                <p>Férias</p>
              </div>
              <div className='col-3'>
                <p className='ferias'></p>
              </div>
            </div>
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

          </div>
        </div>
        {(listaDias && listaDias.length < 1) ? (
          <>
          {(selectedUser === "Todos" || selectedUser === "Engenharia de Processos" || selectedUser === "Administradores" ||selectedUser === "Laboratorio" || selectedUser === "Outro" ) ? (
          <div className='projetos'>
          <h2>Grupo não possui horas inseridas</h2>
        </div>
          ):(
          <div className='projetos'>
            <h2>Utilizador não possui horas inseridas</h2>
          </div>
          )}
          </>
        ) : (
          <>

            {(selectedUser === "Todos" || selectedUser === "Engenharia de Processos" || selectedUser === "Administradores" || selectedUser === "Laboratorio" || selectedUser === "Outro") ? (
              <>
                <div className='col-12'>
                  <Calendar
                    handleChange={handleChangeCalendario}
                    inserted={listaDias}
                    feriados={getFeriados}
                    ferias={ferias}
                    todos={true}
                    numberUsers={filteredUsers.length}
                    horasExtraID={addHorasExtraIDS}
                  />
                </div>
                <hr></hr>



                <div className='text-center'>
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
                          key={user._id}
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

              </>
            ) : (




              <>
                <div className='col-12'>
                  <Calendar
                    handleChange={handleChangeCalendario}
                    inserted={listaDias}
                    feriados={getFeriados}
                    ferias={ferias}
                    horasExtraID={addHorasExtraIDS}
                  />
                </div>
                <hr></hr>
                <div>
                  {dias.map((dia) => {
                    for (let a = 0; a < dia.tipoDeTrabalhoHoras.length; a++) {
                      if (dia.tipoDeTrabalhoHoras[a].length > 0) {
                        for (let j = 0; j < dia.tipoDeTrabalhoHoras[a].length; j++) {
                        }
                      }
                    }

                    const data = new Date(dia.Data);
                    const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                    const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                    if (isSameMonth && isSameDate) {
                      return <Dia key={dia.Data} {...dia} horasPossiveis={possibleHours} listaTT={listaTipoTrabalho} />;
                    }

                    return null;
                  })}
                </div>

                <div className='text-center'>
                  {dias.filter((dia) => {
                    const data = new Date(dia.Data);
                    const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                    const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                    return isSameMonth && isSameDate;
                  }).length === 0 && diaSelected === 0 && (
                      <h2>Sem Horas inseridas neste mês</h2>
                    )}

                  {dias.filter((dia) => {
                    const data = new Date(dia.Data);
                    const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                    const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                    return isSameMonth && isSameDate;
                  }).length === 0 && diaSelected !== 0 && (
                      <h2>Sem Horas inseridas neste dia {diaSelected}</h2>
                    )}
                </div>
              </>
            )}
          </>
        )

        }
      </div>
    </Wrapper >
  );

  
};


export default ListaHoras;