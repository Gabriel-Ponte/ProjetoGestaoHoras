import { useEffect, useState, useCallback } from 'react';
import Wrapper from '../assets/wrappers/VisualizarHoras';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import Dia from './Dias';
import DiaTodos from './DiasTodos';
import { getAllDiasUtilizador, getAllDiasTodos, exportDia } from '../features/allDias/allDiasSlice';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { FormRowSelect } from '../components';
import Calendar from './Calendar'
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { date } from 'joi';


const ListaHoras = () => {
  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const { dias, isLoading } = useSelector((store) => store.allDias);
  const [selectedUser, setSelectedUser] = useState(user?.user?.nome);
  const [selectedDay, setSelectedDay] = useState();
  const [getFeriados, setFeriados] = useState([]);
  const [listaDias, setListaDias] = useState([]);
  const [listaDiasT, setListaDiasT] = useState([])
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState(null);
  const [horasRealizadas, setHorasRealizadas] = useState(0);
  const [percentagemHoras, setPercentagemHoras] = useState(0);
  const [possibleHoursTodos, setPossibleHoursTodos] = useState(0);
  const [possibleHours, setPossibleHours] = useState(0);
  const [ferias, setFerias] = useState([]);
  const [horasExtra, setHorasExtra] = useState(null);
  const [userNome, setUserNome] = useState(user?.user?.nome); // add state for user name
  const dispatch = useDispatch();

  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];
  const today = new Date();


  // function getWeekdayCount(month, year) {
  //   const daysInMonth = new Date(year, month + 1, 0).getDate(); // number of days in the month
  //   let count = 0;

  //   for (let day = 1; day <= daysInMonth; day++) {
  //     const date = new Date(year, month, day);
  //     const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  //     const isHoliday = feriadosPortugal(date); // Check if the date is a Portuguese holiday
  //     if (date >= today) {
  //       break;
  //     }
  //     if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
  //       count++;
  //     }
  //   }
  //   return count;
  // }

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


  const handleChangeCalendario = useCallback((dia, mes, ano) => {
    const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];
    setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
  }, []);


  const handleChangeUtilizador = useCallback((e) => {
    const { value } = e.target;
    setSelectedUser(value);
  }, []);


  const exportHoras = () => {
    dispatch(exportDia(user?.user?.id));
  };

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
                const aListaDias = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',')
                  .filter((tipo, index) => {
                    const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                    return horasArray && horasArray[index] > 0;
                  });
                return aListaDias;
              }
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
          const idCompensação = tipoTrabalhoArray.find((tipo) => tipo.tipo === 4)?._id;
          setListaDiasT(listaDiasA);

          let countHours = 0;


          const dayStart = new Date(Date.UTC(2023, 10, 6, 0, 0, 0));

          const startDay = dayStart.getDate();
          const startMonth = dayStart.getMonth();
          const startYear = dayStart.getFullYear();

          const extraHours = listaDiasA.filter(item => {
            const date = new Date(item.Data)
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 1;
            const isFriday = dayOfWeek === 5;

            
            const currentDay = date.getDate();
            const currentMonth = date.getMonth();
            const currentYear = date.getFullYear();

            if (
              currentYear > startYear ||
              currentMonth > startMonth ||
              (
              currentYear === startYear &&
              currentMonth === startMonth &&
              currentDay > startDay)
            ) {
            for (let i = 0; i < item.tipoDeTrabalhoHoras.length; i++) {
              const projeto = item.tipoDeTrabalhoHoras[i]

              const tt = projeto.tipoTrabalho.split(',') || [];
              const ttH = projeto.horas.split(',') || [];
                for (let j = 0; j < tt.length; j++) {
                  if (tt[j] === idCompensação) {
                    countHours -= ttH[j];
                  }
                }
            }
            if(feriadosPortugal(date)){
              countHours += item.NumeroHoras;
              return true;
            }

            if (isWeekend) {
              countHours += item.NumeroHoras;
              return true;
            }
            if (isFriday && item.NumeroHoras > 6) {
              countHours += item.NumeroHoras - 6;
              return true;
            }
            if (!isFriday && item.NumeroHoras > 8.5) {
              countHours += item.NumeroHoras - 8.5;
              return true;
            }
            return false;
          }});
          setHorasExtra(countHours)

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
            });
            if (!arrayEquals(ferias, updatedFerias)) {
              setFerias(updatedFerias);
            }

            // Remove the matching ferias from listaDias
            if (listaDiasA) {
              const updatedListaDias = listaDiasA.filter((dia) => {
                for (let i = 0; i < dia.tipoDeTrabalhoHoras.length; i++) {
                  const aListaDias = dia.tipoDeTrabalhoHoras[i]?.tipoTrabalho?.split(',')
                    .filter((tipo, index) => {

                      const horasArray = dia.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                      return horasArray && horasArray[index] > 0;
                    });
                  return !aListaDias.includes(idFerias);
                }
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
  }, [selectedUser, listaDias, ferias]);

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

    if (selectedUser === "Todos") {
      setPossibleHoursTodos(possibleHoursCount)
      possibleHoursCount = possibleHoursCount * (formattedListUtilizadores.length - 1)
    }


    if (listaDiasT) {
      for (let i = 0; i < listaDiasT.length; i++) {
        const data = new Date(listaDiasT[i].Data);
        if (year === data.getFullYear() && month === data.getMonth()) {
          horasRealizadasCount += listaDiasT[i].NumeroHoras;
        }
      }
    }

    setPercentagemHoras((horasRealizadasCount / possibleHoursCount) * 100);

    // if (possibleHoursCount.toString().endsWith(".5")) {
    //   // Remove the ".5" and convert it to 30 minutes
    //   const hours = parseInt(possibleHoursCount); // Extract the whole hours
    //   const minutes = 30; // Representing 30 minutes
    //   possibleHoursCount = hours + ":" + minutes + "h"
    // }


    // if (horasRealizadasCount.toString().endsWith(".5")) {
    //   // Remove the ".5" and convert it to 30 minutes
    //   const hours = parseInt(horasRealizadasCount); // Extract the whole hours
    //   const minutes = 30; // Representing 30 minutes
    //   horasRealizadasCount = hours + ":" + minutes + "h"
    // }

    setPossibleHours(possibleHoursCount);
    setHorasRealizadas(horasRealizadasCount);

    //const percentagemHoras = Math.round((horasRealizadas / possibleHours) * 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaDias, selectedDay, selectedUser]);



  const diaSelected = selectedDay ? selectedDay.dia : 0;
  const month = selectedDay ? selectedDay.mes : today.getMonth();
  const year = selectedDay ? selectedDay.ano : today.getFullYear();

  const filteredUsers = formattedListUtilizadores.filter((user) => user && user.nome !== "Admin");


  function convertToMinutes(timeString) {
    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");

        // Convert the hours to an integer
        const hoursInt = parseInt(hours, 10);
        // Convert the fraction of an hour to minutes
        if (!minutes) {
          minutes = 0;
        }
        let formattedMinutes = Math.round(minutes * 60) / 10;
        if (formattedMinutes === 60) {
          formattedMinutes = 0;
          formattedHours += 1;
        }
        // Use String.padStart to format hours and minutes with leading zeros
        const formattedHours = hoursInt.toString().padStart(2, "0");
        formattedMinutes = formattedMinutes.toString().padStart(2, '0');

        const formattedTime = `${formattedHours}:${formattedMinutes}`;

        return formattedTime;
      } catch (error) {
        console.log(error)
        console.log(timeString)
        return timeString;
      }
    }

    return timeString;
  }


  //Change to refresh
  if (isLoading) {
    return <Loading />;
  }
  if (!dias) {
    return <Loading />;
  }

  if (!listaTipoTrabalho) {
    return <Loading />;
  }

  let checkFound = false
  return (
    <Wrapper>
      <div className='mainVisualiza'>
        {(user?.user?.tipo === 2) && (
          <div className='text-center mb-5'>

            <h3 className='mb-5'>Escolha Utilizador</h3>
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
              list={formattedListUtilizadores}
              handleChange={handleChangeUtilizador}
              multiple={false}
              todos={true}
            />

          </div>

        )
        }
        <div className='row mb-3'>
          <div className='col-6'>
            <h1 className='userName'>{userNome}</h1>

            <div className='row'>
              <div className='col-md-6 text-center'>
                <p>Horas Possiveis: {convertToMinutes(possibleHours)}</p>
              </div>
              <div className='col-md-6 text-center'>
                {percentagemHoras >= 0 && <p>{percentagemHoras.toFixed(1)}%</p>}
              </div>
              <div className='col-md-6 text-center'>
                <p>Horas Realizadas: {convertToMinutes(horasRealizadas)}</p>
              </div>
              <div className='col-md-6 text-center'>
              {selectedUser !== "Todos" && horasExtra && (
                <p>Horas extra por dar: {convertToMinutes(horasExtra)}</p>
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
          <div className='projetos'>
            <h2>Utilizador não possui horas inseridas</h2>
          </div>
        ) : (
          <>


            {(selectedUser === "Todos") ? (

              <>
                <div className='col-12'>
                  <Calendar
                    handleChange={handleChangeCalendario}
                    inserted={listaDias}
                    feriados={getFeriados}
                    ferias={ferias}
                    todos={true}
                    numberUsers={filteredUsers.length}
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
                          count += dia.NumeroHoras;
                        }
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