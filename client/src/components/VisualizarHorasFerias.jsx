import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Wrapper from '../assets/wrappers/VisualizarHoras';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDiasFerias, exportFerias, getAllFerias, getAllFeriasGroup, getFeriasUtilizador } from '../features/ferias/feriasSlice';
import { toast } from 'react-toastify';
import FormRowSelect from './FormRowSelect';
import CalendarFerias from './CalendarFerias'
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import DiaFerias from './DiasFerias';
import { deleteDia } from '../features/dias/diasSlice';
import DiasFeriasHeader from './DiasFeriasHeader';

const VisualizarHorasFerias = () => {

  const dispatch = useDispatch();

  const [listaFerias, setlistaFerias] = useState({});
  const [localState, setLocalState] = useState(false);
  const [listaFeriasUser, setlistaFeriasUser] = useState([]);
  const { isLoadingFerias, sort } = useSelector((store) => store.ferias);
  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const [getFeriados, setFeriados] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedDayCalendar, setSelectedDayCalendar] = useState();
  const [selectedUser, setSelectedUser] = useState("Todos");
  const [selectedUserID, setSelectedUserID] = useState(user?.user?.id);
  const [feriasPossiveis, setFeriasPossiveis] = useState(0);
  const [pedidosFerias, setPedidosFerias] = useState(0);
  const [update, setUpdate] = useState(false);
  const [change, setChange] = useState(false);
  const [buttonConfirmed, setButtonConfirmed] = useState(false);
  const [arrayData, setArrayData] = useState({});


  const memoizedIsLoading = useMemo(() => {
    return isLoadingFerias;
  }, [isLoadingFerias]);


  const color2 = useMemo(() => {
    return '#DDB892';
  })
  const color3 = useMemo(() => {
    return '#9D0208';
  })
  const color4 = useMemo(() => {
    return '#3E5C76';
  })
  const color5 = useMemo(() => {
    return '#FFBA08';
  })
  const color6 = useMemo(() => {
    return '#253ab8';
  })

  useEffect(() => {
     feriadosPortugal();
     getListaFeriasUser();
     dispatch(listaUtilizadores());

    }, [dispatch, change, sort, update]);

  const getListaFerias = async () => {
    try {
      await dispatch(getAllFerias()).then((res) => {
        const horasExtraArray = (res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];

        let listaFeriasCalendar = [];
        Object.values(horasExtraArray).map((ferias, index) => {
          const indexKey = (Object.keys(horasExtraArray)[index]);
          const userName = indexKey.split(",");
  
          const totalNumber = ferias[1].reduce((acc, numberF) => {
            const number = numberF.Numero;
            return acc + number;
          }, 0);
          // Fix the map and assignment
          ferias[0].map((feria) => {
            feria.UserName = userName[0];
          });
  
          listaFeriasCalendar.push(...ferias[0]);
        })
        console.log(listaFeriasCalendar)
        console.log(horasExtraArray)
        setlistaFeriasUser(listaFeriasCalendar);
        setlistaFerias(horasExtraArray);
      });


    } catch (error) {
      console.error('Error Lista Ferias', error);
    }
  };

  const getListaFeriasUser = async () => {
    try {
      if (selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Outro" && selectedUser !== "Administradores" && selectedUser !== "Responsavel") {

        dispatch(getFeriasUtilizador(selectedUserID)).then((res) => {
          const feriasArray = Array.isArray(res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];

          const totalNumber = feriasArray[1].reduce((acc, numberF) => {
            const number = numberF.Numero;
            return acc + number;
          }, 0);
          const feriasPorDar = totalNumber - feriasArray[0].length;
          const pedidosPorAceitar = feriasArray[2].length;

          setlistaFeriasUser(feriasArray[0]);
          setlistaFerias(feriasArray);
          handleStringFeriasStart(feriasArray);
          setFeriasPossiveis(feriasPorDar);
          setPedidosFerias(pedidosPorAceitar);
        })

      } else if (selectedUser === "Todos") {
         await getListaFerias()
      } else if (selectedUser === "Engenharia de Processos" || selectedUser === "Laboratorio" || selectedUser === "Outro" || selectedUser === "Administradores" || selectedUser === "Responsavel") {
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
        } else if (selectedUser === "Responsavel") {
          tipo = 5;
        }

        dispatch(getAllFeriasGroup({ userTipo: tipo })).then((res) => {
          const listaFerias = (res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];
          let listaFeriasCalendar = [];
          Object.values(listaFerias).map((ferias, index) => {
            const indexKey = (Object.keys(listaFerias)[index]);
            const userName = indexKey.split(",");

            const totalNumber = ferias[1].reduce((acc, numberF) => {
              const number = numberF.Numero;
              return acc + number;
            }, 0);
            // Fix the map and assignment
            ferias[0].map((feria) => {
              feria.UserName = userName[0];
            });

            listaFeriasCalendar.push(...ferias[0]);
          })
          setlistaFeriasUser(listaFeriasCalendar)
          setlistaFerias(listaFerias);
        });
      }
    } catch (error) {
      console.error('Error Lista Ferias', error);
    }
  };

  const formattedListUtilizadores = useMemo(() => {
    if (user.user.nome !== "Admin") {
      return Array.isArray(utilizadores) ? utilizadores?.filter((user) => user && ((user.nome !== "Admin") && user.tipo !== 8)).sort((a, b) => a.nome.localeCompare(b.nome)) : [];
    } else {
      return Array.isArray(utilizadores) ? utilizadores?.filter((user) => user && (user.tipo !== 8)).sort((a, b) => a.nome.localeCompare(b.nome)) : [];
    }

  }, [utilizadores]);

  const filteredUsers = useMemo(() => {
    if (user.user.nome !== "Admin") {
      return formattedListUtilizadores.filter((user) => user && ((user.nome !== "Admin") && user.tipo !== 8)).sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      return formattedListUtilizadores.filter((user) => user && (user.tipo !== 8)).sort((a, b) => a.nome.localeCompare(b.nome));
    }

  }, [formattedListUtilizadores]);

  const deleteDiasFeriasConfirm = async (id) => {
    try {
      const confirmed = window.confirm("Tem a certeza que deseja os  Dias de Férias?");

      if (confirmed) {
        const result = dispatch(deleteDiasFerias(id));
        if (!result.error) {
          toast.success("Dia Apagado")
          setUpdate(!update);
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };



  const handleChangeCalendario = useCallback((dia, mes, ano) => {
    const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];
    setSelectedDayCalendar({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
    setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
    handleStringFerias();
  }, [selectedUser, selectedUserID, listaFeriasUser, selectedDayCalendar]);


  const handleChangeUtilizador = ((e) => {
    const selectedID = e.target.options[e.target.selectedIndex].getAttribute('data-key');
    const { value } = e.target;
    setSelectedUserID(selectedID);
    setChange(!change);
    setSelectedUser(value);
    handleStringFerias();
  });


  function feriadosPortugal() {

    const date = new Date();
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



  const deleteDiaConfirm = async (id, data) => {
    try {
      const dataString = (data ? new Date(data).toLocaleDateString('en-CA') : '')
      const confirmed = window.confirm("Tem a certeza que deseja apagar o Dia: " + dataString + "?");

      if (confirmed) {
        const result = await dispatch(deleteDia(id));
        if (!result.error) {
          toast.success("Dia Apagado")
          const updatedListaFeriasUser = listaFeriasUser.filter(dia => dia._id !== id);
          // const updateAceitacao = aceitacao.filter(dia => dia._id !== id);
          // const updatedCompensacao = horasCompensacao.filter(dia => dia._id !== id);
          // const updatedCompensacaoDomingo = horasCompensacaoDomingo.filter(dia => dia._id !== id);


          // setHorasCompensacao(updatedCompensacao);
          // setHorasCompensacaoDomingo(updatedCompensacaoDomingo);
          setlistaFeriasUser(updatedListaFeriasUser);
          // setAceitacao(updateAceitacao);

          selectedDay.dia = 0;
          setSelectedDay(selectedDay)
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };

  const deleteDiaGroupConfirm = async (id, data, _id_Group) => {
    try {

      const confirmed = window.confirm("Tem a certeza que deseja o pedido de Férias?");

      if (confirmed) {
        setButtonConfirmed(true)
        const result = await dispatch(deleteDiaGroup(id));
        if (!result.error) {
          toast.success("Pedido de Férias Apagado");
          setButtonConfirmed(false);

          const updatedListaFeriasUser = listaFeriasUser.filter(dia => dia._id_Group !== _id_Group);
          // const updateAceitacao = aceitacao.filter(dia => dia._id_Group !== _id_Group);
          // const updatedCompensacao = horasCompensacao.filter(dia => dia._id_Group !== _id_Group);
          // const updatedCompensacaoDomingo = horasCompensacaoDomingo.filter(dia => dia._id_Group !== _id_Group);


          // setHorasCompensacao(updatedCompensacao);
          // setHorasCompensacaoDomingo(updatedCompensacaoDomingo);
          setlistaFeriasUser(updatedListaFeriasUser);
          
          // setAceitacao(updateAceitacao);

          if (selectedDay) {
            selectedDay.dia = 0;
          }

          setSelectedDay(selectedDay)
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };

  const handleStringFeriasStart = (async (lFerias) => {
    if (lFerias[0]?.length > 0) {

      const arrayFeriasYear = lFerias[0]?.reduce((acc, feriasYear) => {
        // Extract the year from the date
        const dataYear = new Date(feriasYear.Data).getFullYear();
        const dataMonth = new Date(feriasYear.Data).getMonth();
        // Initialize the array for this year if it doesn't exist
        if (!acc[dataYear + "+" + dataMonth]) {
          acc[dataYear + "+" + dataMonth] = [];
        }

        // Push the current feriasYear into the corresponding year array
        acc[dataYear + "+" + dataMonth].push(feriasYear);

        return acc;
      }, {});
      let arrayD = [];
      for (let i = 0; i < Object.values(arrayFeriasYear).length; i++) {
        const year = Object.keys(arrayFeriasYear)[i]
        const string = await arrayListaDias(Object.values(arrayFeriasYear)[i]);
        const numero = Object.values(arrayFeriasYear)[i].length;

        const values = {
          ano: year,
          string: string,
          numero: numero
        }
        arrayD.push(values);
      }
      setArrayData(arrayD)
    }

  });



  const handleStringFerias = useCallback(async () => {
    if (listaFerias[0]?.length > 0) {

      const arrayFeriasYear = listaFerias[0]?.reduce((acc, feriasYear) => {
        // Extract the year from the date
        const dataYear = new Date(feriasYear.Data).getFullYear();
        const dataMonth = new Date(feriasYear.Data).getMonth();
        // Initialize the array for this year if it doesn't exist
        if (!acc[dataYear + "+" + dataMonth]) {
          acc[dataYear + "+" + dataMonth] = [];
        }

        // Push the current feriasYear into the corresponding year array
        acc[dataYear + "+" + dataMonth].push(feriasYear);

        return acc;
      }, {});
      let arrayD = [];
      for (let i = 0; i < Object.values(arrayFeriasYear).length; i++) {
        const year = Object.keys(arrayFeriasYear)[i]
        const string = await arrayListaDias(Object.values(arrayFeriasYear)[i]);
        const numero = Object.values(arrayFeriasYear)[i].length;

        const values = {
          ano: year,
          string: string,
          numero: numero
        }
        arrayD.push(values);
      }
      setArrayData(arrayD)
    }

  }, [selectedUser, listaFerias, listaFerias[0]?.length]);


  const arrayListaDias = async (datesReceived) => {
    // Sort datesReceived array by date
    datesReceived.sort((a, b) => new Date(a.Data) - new Date(b.Data));

    const dates = [];
    let currentSegment = [];

    for (let i = 0; i < datesReceived.length; i++) {
      const currentDate = new Date(datesReceived[i].Data);

      // If it's the first date or it follows the previous date
      if (i === 0 || (currentSegment.length > 0 && (currentDate.getTime() - new Date(currentSegment[currentSegment.length - 1]).getTime() === 86400000))) {
        // Check if the current day is a weekday (not Saturday or Sunday)
        const dayOfWeek = currentDate.getDay();
        const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
        const isHoliday = feriadosPortugal(currentDate);

        if (isWeekday && !isHoliday) {
          currentSegment.push(new Date(currentDate));
        }
      } else {
        // If the segment has dates, finalize the current segment
        if (currentSegment.length > 0) {
          dates.push(currentSegment);
        }
        // Start a new segment
        currentSegment = [];

        // Check if the current date is valid and add it to the new segment
        const dayOfWeek = currentDate.getDay();
        const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
        const isHoliday = feriadosPortugal(currentDate);

        if (isWeekday && !isHoliday) {
          currentSegment.push(new Date(currentDate));
        }
      }
    }

    // Add the last segment if it has dates
    if (currentSegment.length > 0) {
      dates.push(currentSegment);
    }

    // Convert dates array to the desired string format
    const stringD = stringListaDias(dates);

    return stringD;
  };

  const stringListaDias = useCallback((dates) => {
    try {
      let data = "";
      if (!dates || dates.length === 0) {
        return data;
      }

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
      return data;
    }
    catch (error) {
      console.error(error)
      return "";
    }
  }, []);


  const getTipo = () => {
    let tipo = 0;
    if (selectedUser === "Todos") {
      tipo = 0;
    } else if (selectedUser === "Engenharia de Processos") {
      tipo = 1;
    } else if (selectedUser === "Administradores") {
      tipo = 2;
    }
    else if (selectedUser === "Laboratorio") {
      tipo = 3;
    } else if (selectedUser === "Outro") {
      tipo = 4;
    } else if (selectedUser === "Responsavel") {
      tipo = 5;
    }
    return tipo;
  }
  
  const handleChangeExportFerias = async() => {
    try {
      const today = new Date();

      const diaSelected = selectedDay?.dia ? (selectedDay?.dia === 0 ? 1 : selectedDay?.dia) : 1;  
      const month = selectedDay?.mes ?? today.getMonth();  
      const year = selectedDay?.ano ?? today.getFullYear();  
      
      // Create the date object based on the selected day or current date
      const date = new Date(year, month, diaSelected);
      const tipo = getTipo();
      const userID = user?.user?.id;
      console.log(tipo)
   const response = await dispatch(exportFerias({ date, userID, tipo }));
    if(response){
      setLocalState(true);
    }
  } catch (error) {
      console.error("handleChangeExportFerias" , response)
  }

  };

  const renderCalendar = useCallback(() => {
    const today = new Date();
    const diaSelected = selectedDay ? selectedDay?.dia : 0;
    const month = selectedDay ? selectedDay?.mes : today.getMonth();
    const year = selectedDay ? selectedDay?.ano : today.getFullYear();

    // const date = new Date(year, month, diaSelected);

    return (
      <Wrapper>
        <div className='mainVisualiza'>
          {((user?.user?.tipo === 7) && (
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
              <h1 className='userName'>{selectedUser}</h1>
              <div className='row'>

                <div className='col-md-6 text-center'>
                  {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro" && selectedUser !== "Responsavel") && (
                    <>
                      <hr></hr>
                      <div className='row'>
                        <div className='col-md-8 text-end'>
                          <p>Dias de Férias por reclamar:</p>
                        </div>
                        <div className='col-md-4 text-center'>
                          <p>{feriasPossiveis}</p>
                        </div>
                      </div>

                      {pedidosFerias > 0 &&
                        <>
                          <div className='row'>
                            <div className='col-md-8 text-end'>
                              <p>Dias de Férias em aceitacão:</p>
                            </div>
                            <div className='col-md-4 text-center'>
                              <p>{pedidosFerias}</p>
                            </div>


                          </div>
                          <div className='row'>
                            <div className='col-md-8 text-end'>
                              <p>Dias de Férias total:</p>
                            </div>
                            <div className='col-md-4 text-center'>
                              <p>{feriasPossiveis - pedidosFerias}</p>
                            </div>


                          </div>
                        </>
                      }
                    </>
                  )}
                </div>

              </div>
            </div>

            <div className='row'>
                    
                    <div className='col-2'>
                        <div className='row'>
                            <div className='col-9 text-end'>
                                <p style={{ margin: "auto" }}>1</p>
                            </div>
                            <div className='col-3'>
                                <p className='colored' style={{ backgroundColor: 'black' , margin: "auto"}}></p>
                            </div>
                        </div>
                         </div>
    
                        <div className='col-2'>
                        <div className='row'>
                            <div className='col-6 text-end'>
                                <p  style={{ margin: "auto" }}> 2</p>
                            </div>
                            <div className='col-6'>
                                <p className='colored' style={{ backgroundColor: color2 , margin: "auto"  }}></p>
                            </div>
                        </div>
                        </div>
    
                        <div className='col-2'>
                        <div className='row'>
                            <div className='col-9 text-end'>
                                <p  style={{ margin: "auto" }}>3</p>
                            </div>
                            <div className='col-3'>
                                <p className='colored' style={{ backgroundColor: color3, margin: "auto"  }}></p>
                            </div>
                        </div>
                        </div>
    
                        <div className='col-2'>
                        <div className='row'>
                            <div className='col-9 text-end'>
                                <p  style={{ margin: "auto" }}>4</p>
                            </div>
                            <div className='col-3'>
                                <p className='colored' style={{ backgroundColor: color4, margin: "auto"  }}></p>
                            </div>
                        </div>
                        </div>
    
                        <div className='col-2'>
                        <div className='row'>
                            <div className='col-9 text-end'>
                                <p  style={{ margin: "auto" }}>5</p>
                            </div>
                            <div className='col-3'>
                                <p className='colored' style={{ backgroundColor: color5, margin: "auto"  }}></p>
                            </div>
                        </div>
                        </div>
    
                        <div className='col-2'>
                        <div className='row'>
                            <div className='col-9 text-end'>
                                <p  style={{ margin: "auto" }}>+5</p>
                            </div>
                            <div className='col-3'>
                                <p className='colored' style={{ backgroundColor: color6, margin: "auto"  }}></p>
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
              {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro" && selectedUser !== "Responsavel") && (
                <div className='row'>
                  <div className='col-9 text-end'>
                    <p>Férias</p>
                  </div>
                  <div className='col-3'>
                    <p className='ferias'></p>
                  </div>
                </div>
              )}
              {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro" && selectedUser !== "Responsavel") && (
                <div className='row'>
                  <div className='col-9 text-end'>
                    <p>Horas Compensação</p>
                  </div>
                  <div className='col-3'>
                    <p className='horasCompensacao'></p>
                  </div>
                </div>
              )}

              {(selectedUser !== "Todos" && selectedUser !== "Engenharia de Processos" && selectedUser !== "Laboratorio" && selectedUser !== "Administradores" && selectedUser !== "Outro" && selectedUser !== "Responsavel") && (
                <>
                  <div className='row'>
                    <div className='col-9 text-end'>
                      <p>Ferias em Aceitação</p>
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
          </div>




          <div>
            {(selectedUser === "Todos" || selectedUser === "Engenharia de Processos" || selectedUser === "Laboratorio" || selectedUser === "Administradores" || selectedUser === "Outro" || selectedUser === "Responsavel") ? (
              <>

                {(() => {
                  let countUsers = 0;
                  const DiasCount = {}; // Use an object for counting

                  // Process users and their vacation data
                  const usersWithDias = filteredUsers
                    .map((user) => {
                      const filteredDias = listaFeriasUser.filter((dia) => dia.Utilizador === user._id);
                      let count = 0;
                      let dias = [];
                      filteredDias.forEach((dia) => {
                        const data = new Date(dia.Data);
                        const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                        const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();
                        const key = `${data.getDate()}|${data.getMonth()}|${data.getFullYear()}`;
                        if (isSameMonth && isSameDate) {
                          if (!DiasCount[key]) {
                            DiasCount[key] = 0;
                          }
                          DiasCount[key] += 1;
                          count += 1;
                          dias.push(dia);
                        } else if (isSameMonth) {
                          if (!DiasCount[key]) {
                            DiasCount[key] = 0;
                          }
                          DiasCount[key] += 1;
                        }
                      });

                      if (count > 0) {
                        countUsers++;
                      }
                      return { user, count, dias };
                    })
                    .sort((a, b) => b.count - a.count);

                  // Render the calendar and header
                  const renderCalendarAndHeader = () => (
                    <>
                                  {/* disabled={localState} */}
                      <button className="btn btn-success"    style={{ margin: "auto", height:"100%" }}  onClick={() => handleChangeExportFerias()}>
                            Exportar
                      </button>
                      <div className="container mt-5">
                        <CalendarFerias
                          key={"calendar"}
                          selectedDate={selectedDayCalendar}
                          ferias={listaFeriasUser}
                          feriados={getFeriados}
                          handleChange={(dia, mes, ano) => {
                            handleChangeCalendario(dia, mes, ano);
                          }}
                          DiasCount={DiasCount}
                          todos={true}
                          numberUsers={filteredUsers.length}
                          user={selectedUser}
                        />
                      </div>
                      <h1 className='text-center mt-5 mb-5'>
                        {diaSelected
                          ? `Dia Selecionado: ${diaSelected}/${month + 1}/${year}`
                          : `Mês Selecionado: ${month + 1}/${year}`}
                      </h1>
                      {(countUsers > 0) && (
                        <div className="mb-3">
                          <DiasFeriasHeader
                            color2={color2}
                            color3={color3}
                            color4={color4}
                            color5={color5}
                            color6={color6}
                          />
                        </div>
                      )}
                    </>
                  );

                  // Render DiaFerias components or a message if no vacations
                  const renderDiaFeriasComponents = () => {
                    const diaFeriasComponents = usersWithDias.map(({ user, count, dias }) => {
                      if (count > 0) {
                        // countUsers++;
                        const date = new Date(year, month, diaSelected);
                        return (
                          <DiaFerias
                            key={user._id + "todos"}
                            Dias={dias}
                            DiasCount={DiasCount}
                            Data={date}
                            NumeroDias={count}
                            Utilizador={user}
                            tipo={false}
                            diaSelected={diaSelected}
                            buttonConfirmed={buttonConfirmed}
                            
                            color2={color2}
                            color3={color3}
                            color4={color4}
                            color5={color5}
                            color6={color6}
                          />
                        );
                      }
                      return null; // Return null for users with count === 0
                    });

                    if (countUsers === 0) {
                      return (
                        <h3 className='text-center mt-5 mb-5'>
                          {diaSelected
                            ? `Sem ferias inseridas neste dia!`
                            : `Sem ferias inseridas neste mês!`}
                        </h3>
                      );
                    }

                    return diaFeriasComponents; // Return the mapped components
                  };

                  return (
                    <>
                      {renderCalendarAndHeader()}
                      {renderDiaFeriasComponents()}
                    </>
                  );
                })()}

              </>) : <>
              <div className="container mt-5">
                <CalendarFerias
                  key={"calendar"}
                  selectedDate={selectedDayCalendar}
                  ferias={listaFeriasUser}
                  feriados={getFeriados}
                  handleChange={(dia, mes, ano) => {
                    handleChangeCalendario(dia, mes, ano);
                  }}
                  todos={false}
                  numberUsers={filteredUsers.length}
                  user={selectedUser}
                />
              </div>

              <h1 className='text-center mt-5 mb-5'>
                {diaSelected
                  ? `Dia Selecionado: ${diaSelected}/${month + 1}/${year}`
                  : `Mês Selecionado: ${month + 1}/${year}`}
              </h1>


              {(() => {
                // Filter the dias based on the month and year
                const filteredDias = listaFeriasUser.filter(item => {
                  return (
                    new Date(item.Data)?.getMonth() === month &&
                    new Date(item.Data)?.getFullYear() === year
                  );
                });

                if (filteredDias.length === 0) {
                  return <h3 className='text-center mt-5 mb-5'>                  
                  {diaSelected
                    ? `Sem ferias inseridas neste dia!`
                    : `Sem ferias inseridas neste mês!`}</h3>;
                }
                if (diaSelected === 0) {
                  return (
                    <div key={selectedUser}>

                      {arrayData && Object.values(arrayData).map((feriasInsertedYear, index) => {
                        const dataYear = feriasInsertedYear.ano;
                        const numero = feriasInsertedYear.numero;
                        const stringDates = feriasInsertedYear.string;

                        if (dataYear === (year + "+" + month)) {


                          return (
                            <div className='row' key={Object.keys(arrayData)[index]} >
                              <hr></hr>
                              <div className="col-md-1 themed-grid-col">
                              </div>
                              <div className="col-md-5 themed-grid-col text-center">
                                <p>{numero}</p>
                              </div>

                              <div className="col-md-5 themed-grid-col text-center">
                                <p dangerouslySetInnerHTML={{ __html: stringDates }} />
                              </div>

                              <div className="col-md-1 themed-grid-col">
                              </div>

                            </div>
                          )
                        }
                      })}
                    </div>
                  );
                } else {
                  let count = 0;
                  let renderedDias = filteredDias.filter((dia) => {
                    const data = new Date(dia.Data);
                    const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                    const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();


                    if (isSameMonth && isSameDate) {
                      count++;
                      return true; // Keep dia in filtered array
                    }
                    return false; // Exclude dia if not matching
                  }).map((dia, idx) => {
                    return (
                      <div key={idx + selectedUser}>
                        <DiaFerias
                          key={dia.Data + selectedUser + idx}
                          {...dia}
                          tipoUser={user.user.tipo}
                          deleteDay={deleteDiaConfirm}
                          deleteDayGroup={deleteDiaGroupConfirm}
                          buttonConfirmed={buttonConfirmed}
                          tipo={true}
                          diaSelected={diaSelected}
                        />
                      </div>
                    );
                  });

                  if (count === 0) {
                    return (
                      <h3 className="text-center mt-5 mb-5">
                        {diaSelected ? `Sem ferias inseridas neste dia!` : `Sem ferias inseridas neste mês!`}
                      </h3>
                    );
                  } else {
                    return renderedDias; // Return the filtered and rendered JSX elements
                  }

                }
              })()}
            </>}
          </div>

        </div>
      </Wrapper>
    );
  }, [selectedUser, selectedUserID, listaFeriasUser?.length, listaFeriasUser?.length > 0 ? listaFeriasUser[0]?._id : "", selectedDayCalendar, memoizedIsLoading, update, arrayData, arrayData.length, arrayData?.length > 0 ? arrayData[0]?.string : ""]);

  // console.log(arrayData)
  return (
    <>{renderCalendar()}</>
  )
}


export default memo(VisualizarHorasFerias);
