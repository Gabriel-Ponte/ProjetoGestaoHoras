import { useEffect, useState } from 'react';
import Wrapper from '../assets/wrappers/VisualizarHorasProjetos';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import {  getAllDiasTodos,  getAllDias } from '../features/allDias/allDiasSlice';
import { FormRowSelect } from '.';
import Calendar from './Calendar'
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { getAllProjetos } from '../features/allProjetos/allProjetosSlice';
import DiasTodosProjetos from './DiasTodosProjetos';



const VisualizarHorasProjeto = () => {
  const { user } = useSelector((store) => store.utilizador);

  const { dias } = useSelector((store) => store.allDias);
  const { projetos } = useSelector((store) => store.allProjetos);

  const [loading, setLoading] = useState(false);
  const [projeto, setProjeto] = useState("Todos");
  const [verificaDias, setVerificaDias] = useState(0);
  const [selectedProjeto, setSelectedProjeto] = useState("Todos");
  const [selectedDay, setSelectedDay] = useState();
  const [getFeriados, setFeriados] = useState([]);
  const [listaDias, setListaDias] = useState([]);
  const [listaDiasT, setListaDiasT] = useState([]);
  const [numeroTotalHoras, setNumeroTotalHoras] = useState(0);

  const [listaProjetos, setListaProjetos] = useState([]);

  const [listaTipoTrabalho, setListaTipoTrabalho] = useState(null);


  const [projetoNome, setProjetoNome] = useState("Todos");

  const [change, setChange] = useState(false);


  const dispatch = useDispatch();

  const formatedListProjetos = Array.isArray(projetos) ? projetos : [];

  const today = new Date();

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
        { name: "Ferias Coletivas", date: new Date(i, 11, 24) },
        { name: "Natal", date: new Date(i, 11, 25) },
        { name: "Ferias Coletivas", date: new Date(i, 11, 26) },
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
        date?.getDate() === feriado.date?.getDate() &&
        date?.getMonth() === feriado.date?.getMonth()
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
    }else if (type === "Carnaval") {
      return new Date(year, month, day - 47);
    }
  }

  function calculateCorpusChristi(ano) {
    const domingoPascoa = calculateEaster(ano, "DomingoPascoa");
    return new Date(ano, domingoPascoa?.getMonth(), domingoPascoa?.getDate() + 60);
  }

  const handleChangeCalendario = ((dia, mes, ano) => {
    const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];
    setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
  });


  const handleChangeProjeto = ((e) => {

    const { value } = e.target;
    const projetoChoosen = projetos.find((projeto) => projeto._id === value);

    setChange(!change);
    setSelectedProjeto(value);
    setProjeto(projetoChoosen);
  });


  useEffect(() => {
      if (projeto && listaTipoTrabalho) {
        const arrayTT = projeto.TipoTrabalho ? projeto.TipoTrabalho.split(',') : [];
        const arrayTTH = new Array(arrayTT.length).fill(0);
        if (listaDias && listaDias.length > 0) {
          let totalHours = 0;
  
  
          for (let i = 0; i < listaDias.length; i++) {
            const dia = listaDias[i];
            //console.log(listaDias)
            const data = new Date(dia.Data);
            let dataSelected = new Date();
            let condicao = null;
            let diaSelected;
            if (selectedDay && selectedDay.dia !== 0) {
              diaSelected = selectedDay ? selectedDay.dia : 0;
              const month = selectedDay.mes;
              const year = selectedDay.ano;
              dataSelected = new Date(year, month, diaSelected);
              dataSelected.setHours(data?.getHours());
              condicao = dia.tipoDeTrabalhoHoras && dataSelected?.getTime() === data?.getTime();
        
            } else if(selectedDay && selectedDay.dia === 0){
              const month = selectedDay.mes;
              const year = selectedDay.ano;
              dataSelected = new Date(year, month);
              dataSelected.setHours(data.getHours());
              condicao = dia.tipoDeTrabalhoHoras && (dataSelected?.getMonth() === data?.getMonth() && dataSelected?.getFullYear() === data?.getFullYear());
            }else {
              condicao = dia.tipoDeTrabalhoHoras;
  
            }
            //console.log(condicao)
            if (condicao) {
              for (let j = 0; j < dia.tipoDeTrabalhoHoras.length; j++) {
                const tipoDeTrabalhoHora = dia.tipoDeTrabalhoHoras[j];
                if (tipoDeTrabalhoHora.projeto === projeto._id) {
                  const array = tipoDeTrabalhoHora.horas ? tipoDeTrabalhoHora.horas.split(',') : [];
                  //console.log(array)
                  let values = tipoDeTrabalhoHora.tipoTrabalho ? tipoDeTrabalhoHora.tipoTrabalho.split(',') : [];
                  //let horas = 0;
                  const filteredValues = values
                    .filter(value => listaTipoTrabalho.some(item => item._id === value))
                    .map(value => {
                      const matchedItem = listaTipoTrabalho.find(item => item._id === value);
                      //console.log(value)
                      return matchedItem ? matchedItem.TipoTrabalho : null;
                    });
                    //console.log(filteredValues)
                  if (array !== null) {
                
                    for (let h = 0; h < array.length; h++) {
                      const horas = Number(array[h]);
                      if (!filteredValues[h]) {
                        filteredValues[h] = "Outro";
                      }

                      totalHours += horas;
                      arrayTTH[filteredValues[h]] = (arrayTTH[filteredValues[h]] || 0) + horas;
                    }
                  }
                }
              }
            }
          }
          if (totalHours !== 0) {
            setProjeto({
              ...projeto,
              NumeroHorasTotal: totalHours,
              NumeroHorasTipoTrabalho: arrayTTH,
            });
          } else {
            if(selectedDay){
              if(selectedDay?.dia !== 0){
            setProjeto({
              ...projeto,
              NumeroHorasTotal: selectedProjeto === "Todos" ? `Não existem horas inseridas no projeto neste dia ${selectedDay?.dia}/${selectedDay?.mes + 1}/${selectedDay?.ano}` : `${projeto.Nome} não possui horas inseridas neste dia ${selectedDay?.dia}/${selectedDay?.mes + 1}/${selectedDay?.ano}`,
              NumeroHorasTipoTrabalho: ""
            });
          }else {
            setProjeto({
              ...projeto,
              NumeroHorasTotal: selectedProjeto === "Todos" ? `Não existem horas inseridas no projeto neste mes ${selectedDay?.mes + 1}/${selectedDay?.ano}` : `${projeto.Nome} não possui horas inseridas neste mes ${selectedDay?.mes + 1}/${selectedDay?.ano}`,
              NumeroHorasTipoTrabalho: ""
            });
          }
          }else{
            setProjeto({
              ...projeto,
              NumeroHorasTotal: selectedProjeto === "Todos" ? `Não existem horas inseridas no projeto` : `${projeto.Nome} não possui horas inseridas!`,
              NumeroHorasTipoTrabalho: ""
            });
          }
          }
        } else {
          setProjeto({
            ...projeto,
            NumeroHorasTotal: selectedProjeto === "Todos" ? "Não existem horas inseridas no projeto" : `${selectedProjeto} não possui horas inseridas no projeto`,
            NumeroHorasTipoTrabalho: "",
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDay, selectedProjeto, listaDias, dispatch, setProjeto]);
  
  useEffect(() => {

    let tipoTrabalhoArray = [];
    feriadosPortugal(today);
    dispatch(getAllProjetos()).then((res) => {
      setListaProjetos(res.payload.projetos);
    });


    dispatch(getTipoTrabalho()).then((res) => {
      tipoTrabalhoArray = Array.isArray(res?.payload?.tipoTrabalho) ? res?.payload?.tipoTrabalho : [];
      
      const projetoN = projeto?.Nome ?? "Todos";
      setProjetoNome(projetoN);
      if (selectedProjeto === "Todos") {
        dispatch(getAllDiasTodos()).then((res) => {
          const listaDiasA = (typeof res?.payload?.diasAll !== "undefined") ? res?.payload?.diasAll : [];
          setVerificaDias(1);
          setListaDiasT(listaDiasA);
          // Remove the matching from listaDias
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
        const projetoId = selectedProjeto;

        dispatch(getAllDias({ projetoId }))
          .then((res) => {
            let count = 0;
            if (res?.payload?.diasAllProjeto) {
              const lista = res.payload.diasAllProjeto;

              lista.forEach((projetoSel) => {
                for (let i = 0; i < projetoSel?.tipoDeTrabalhoHoras?.length; i++) {
                  if (projetoSel.tipoDeTrabalhoHoras[i].projeto === projeto._id) {
                    const horasArray = projetoSel.tipoDeTrabalhoHoras[i].horas?.split(',');
              
                    for (let g = 0; g < horasArray.length; g++) {
                      count += parseFloat(horasArray[g]);
                    }
                  }
                }
              });
          

          if(count > 0){
            setVerificaDias(1);
            setNumeroTotalHoras(count);
            setListaDias(res.payload.diasAllProjeto);
          }else{
            setNumeroTotalHoras(0);
            setListaDias([]);
            setVerificaDias(2);
          }
            } else {
              setListaDias([]);
              setVerificaDias(2);
            }
          })
          .catch((error) => {
            // Handle error if necessary
            console.error(error);
          });
      }
    });

   
  }, [selectedProjeto, dispatch]);

  // selectedProjeto, listaDias[0], listaTipoTrabalho?.length,
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
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 750);
   
  }, [selectedProjeto, listaDias.length]);


  function convertToMinutes(timeString) {
    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");

        // Convert the hours to an integer
        const hoursInt = parseInt(hours, 10) ? parseInt(hours, 10)  : 0;
        // Convert the fraction of an hour to minutes
        minutes = parseInt(minutes) < 10 ? `${minutes}0` : minutes;

        if (!minutes) {
          minutes = 0;
        }
        let formattedMinutes = Math.round(minutes * 60) / 100;
        if (formattedMinutes === 60) {
          formattedMinutes = 0;
          // formattedHours += 1;
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
  if (loading || !dias || !listaTipoTrabalho) {
    return <Loading />;
  }




  return (
    <Wrapper>
      <div className='mainVisualiza'>
        {((user?.user?.tipo === 2 || user?.user?.tipo === 5 || user?.user?.tipo === 6 || user?.user?.tipo === 7) && (
          <div className='text-center mb-5'>
            <h3 className='mb-5'>Escolha Projeto</h3>

            {(() => {

              return (
                <FormRowSelect
                  type="text"
                  className="row mb-3 text-center"
                  classNameLabel='col-md-3 text-end'
                  classNameInput='col-md-9'
                  classNameResult='col-md-6 text-start'
                  id="listaProjetos"
                  name="listaProjetos"
                  labelText="Projetos:"
                  value={selectedProjeto}
                  list={formatedListProjetos}
                  handleChange={handleChangeProjeto}
                  multiple={false}
                  todos={user?.user?.tipo}
                />
              );
            })()}
          </div>
        ))}

        <div className='row mb-3'>
          <div className='col-9 text-center'>
            <h1 className='userName'>{projetoNome}</h1>
          </div>
          <div className='col-3 description'>
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
                <p>Inserido</p>
              </div>
              <div className='col-3'>
                <p className='inserido'></p>
              </div>
            </div>
            {(selectedProjeto !== "Todos") && (
              <>
            <div className='row'>
              <div className='col-9 text-end'>
                <p>Data Inicio</p>
              </div>
              <div className='col-3'>
                <p className='dataInicio'></p>
              </div>
            </div>


            <div className='row'>
              <div className='col-9 text-end'>
                <p>Data Fim</p>
              </div>
              <div className='col-3'>
                <p className='dataFim'></p>
              </div>
            </div>

            <div className='row'>
              <div className='col-9 text-end'>
                <p>Data Objetivo</p>
              </div>
              <div className='col-3'>
                <p className='dataObjetivo'></p>
              </div>
            </div>
            </>)}
          </div>
        </div>

        {(listaDias && listaDias.length < 1) ? (
          <>
            {(selectedProjeto === "Todos") ? (
              <div className='projetos'>
                <h2>Não existem horas inseridas</h2>
              </div>
            ) : (
              <div className='projetos'>
                <h2>Projeto não possui horas inseridas</h2>
              </div>
            )}
          </>
        ) : (
          <>
          {(selectedProjeto !== "Todos") && (
            <div className="row mb-3 ">
              <div className="col-3">
                <h5>Data Inicio</h5>
              </div>
              <div className="col-3">
                <p>{projeto?.DataInicio ? new Date(projeto?.DataInicio).toLocaleDateString('en-CA') : 'Sem data Inicial'}</p>
              </div>

              {projeto?.Finalizado === true ? (
                <>
                  <div className="col-3">
                    <h5>Data Final</h5>
                  </div>
                  <div className="col-3">
                    <p>{projeto.DataFim ? new Date(projeto?.DataFim).toLocaleDateString('en-CA') : 'Sem Data Final'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-3">
                    <h5>Data Objetivo</h5>
                  </div>
                  <div className="col-3">
                    <p>{projeto.DataObjetivo ? new Date(projeto.DataObjetivo).toLocaleDateString('en-CA') : 'Sem data Objetivo'}</p>
                  </div>
                </>
              )}


              <div className='col-12 text-center'>
                <h5>Numero Total Horas : {convertToMinutes(numeroTotalHoras)}</h5>
              </div>
            </div>
              )}
            <div className='col-12'>
            {verificaDias === 1 ? (
                    <Calendar
                      handleChange={handleChangeCalendario}
                      feriados={getFeriados}
                      vProjeto={listaDias}
                      inicio={projeto?.DataInicio}
                      objetivo={projeto?.DataObjetivo}
                      fim={projeto?.DataFim}
                      selectedDate={selectedDay}
                    />
                  ) : verificaDias === 2 ? (
                    <Calendar
                      handleChange={handleChangeCalendario}
                      feriados={getFeriados}
                      inicio={projeto?.DataInicio}
                      objetivo={projeto?.DataObjetivo}
                      fim={projeto?.DataFim}
                      selectedDate={selectedDay}
                    />
                  ) : null}
            </div>

            <hr></hr>


            
            {selectedProjeto === "Todos" ? (<>
            
              {
              
              listaProjetos.map((projetoSel) => {
                    const filteredDias = listaDiasT.filter((dia) => {
                    if(dia?.tipoDeTrabalhoHoras){
                      for(let i = 0 ; i < dia?.tipoDeTrabalhoHoras.length ; i++){
                       if(dia?.tipoDeTrabalhoHoras[i].projeto === projetoSel._id){
                        return true;
                      }
                    }    
                    }
                    
                    return false;
                  })

                    let count = 0;
                    let dias = [];

                    if (filteredDias && filteredDias?.length > 0) {
                      filteredDias.map((dia) => {
                        const data = new Date(dia?.Data);
                        
                        let isSameMonth = null;
                        let isSameDate = null;
                        if(selectedDay){
                          isSameMonth = selectedDay?.mes === data?.getMonth() && selectedDay?.ano === data?.getFullYear();
  
                          isSameDate = selectedDay.dia === 0 || Number(selectedDay.dia) === data?.getDate();
                        }
  
                        if (!selectedDay || (isSameMonth && isSameDate)) {
                          for(let i = 0 ; i < dia?.tipoDeTrabalhoHoras.length ; i++){
                              if(dia?.tipoDeTrabalhoHoras[i].projeto === projetoSel._id){
                                const horasArray = dia?.tipoDeTrabalhoHoras[i]?.horas?.split(',');
                                for(let g = 0 ; g < horasArray.length; g++){
                                  count += parseFloat(horasArray[g]);
                                }
                              }
                           }
                        }
                        
                        return null;
                      });
                    }

                    return { projetoSel, count, dias };

                  }).sort((a, b) => b.count - a.count)
                    .map(({ projetoSel, count, dias }) => {
                        return <DiasTodosProjetos
                          key={projetoSel?._id}
                          dias={dias}
                          numeroHoras={count}
                          projeto={projetoSel}
                          diaSelected={selectedDay}
                        />
                    })
                  }

             </>)
            :
            (
              <>
            <div className="row g-5">
              {selectedDay && selectedDay?.dia !== 0 &&
                <h5>{selectedDay?.dia}/{selectedDay?.mes + 1}/{selectedDay?.ano}</h5>}
              <div className="col-6">
                <h5>{selectedDay ? selectedDay?.dia === 0 ? `Numero total Horas ${selectedDay?.mes + 1}/${selectedDay?.ano}` : `Numero total Horas ${selectedDay?.dia}/${selectedDay?.mes + 1}/${selectedDay?.ano}` : `Numero Total Horas`}</h5>
              </div>
              <div className="col-6">
                <p>{convertToMinutes(projeto?.NumeroHorasTotal)}</p>
              </div>
            </div>

            {typeof projeto?.NumeroHorasTotal === 'number' && (
              <div className="row mb-3">
                <div className="col-1"></div>
                <div className="col-5 mb-3">
                  <h5>Tipos de Trabalho</h5>
                </div>
                <div>
                  {listaTipoTrabalho && listaTipoTrabalho?.length > 0 ? (
                    listaTipoTrabalho.map((t, i) => {

                      return (
                        projeto?.NumeroHorasTipoTrabalho[t.TipoTrabalho] && projeto?.NumeroHorasTipoTrabalho[t.TipoTrabalho] > 0 ? (
                          <div className="row mb-3" key={i}>
                            <div className='col-2'></div>
                            <div className="col-6">
                              <p>{t.TipoTrabalho}</p>
                            </div>
                            <div className="col-4">
                              <p>{convertToMinutes(projeto?.NumeroHorasTipoTrabalho[t.TipoTrabalho])}</p>
                            </div>
                          </div>
                  
                        ) :
                          null
                      );
                    })
                  ) : (
                    <div>
                      <p>Sem Tipos de Trabalho definidos</p>
                    </div>
                  )}
                </div>
              </div>
            )} 

            </>
            )
            }
          </>
        )
        }
      </div>
    </Wrapper >
  );
};


export default VisualizarHorasProjeto;