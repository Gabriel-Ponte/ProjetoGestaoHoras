import { useEffect, useState, useCallback } from 'react';
import Wrapper from '../assets/wrappers/VisualizarProjeto';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import { getAllDias, getAllDiasProjetoUtilizador } from '../features/allDias/allDiasSlice';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { getProjetoAllVersoes } from '../features/projetos/projetosSlice';
import { FormRowSelect } from '.';
import Calendar from './Calendar'
import VisualizarHorasProjetoVersion from './VisualizarProjetoVersion';


const VisualizarProjeto = () => {


  function createInitialState(projeto) {
    return {
      _id: projeto._id,
      Nome: projeto.Nome,
      Cliente: projeto.Cliente,
      DataInicio: projeto.DataInicio,
      DataObjetivo: projeto.DataObjetivo,
      TipoTrabalho: projeto.TipoTrabalho,
      DataFim: projeto.DataFim,
      Tema: projeto.Tema,
      Acao: projeto.Acao,
      Piloto: projeto.Piloto,
      Links: projeto.Links,
      LinkResumo: projeto.LinkResumo,
      Finalizado: projeto.Finalizado,
      Resultado: projeto.Resultado,
      Notas: projeto.Notas,
      NumeroHorasTotal: "Sem Horas Inseridas no Projeto",
      NumeroHorasTipoTrabalho: "",
      Versao: projeto.Versao,
    };
  }

  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const { projeto, isLoading } = useSelector((store) => store.projeto);

  const { dias } = useSelector((store) => store.allDias);
  const [verificaDias, setVerificaDias] = useState(0);
  const [values, setValues] = useState(null);
  const [valuesVisualizar, setValuesVisualizar] = useState(null);
  const [selectedUser, setSelectedUser] = useState(user.user.tipo === 1 ? user?.user?.nome : "Todos");
  const [selectedDay, setSelectedDay] = useState();
  const [getFeriados, setFeriados] = useState([]);
  const [listaDias, setListaDias] = useState([]);
  const [updatedListaDias, setUpdatedListaDias] = useState([]);
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const [listaVProjeto, setListaVProjeto] = useState([]);
  // const [state, setState] = useState([]);



  const dispatch = useDispatch();
  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];



  useEffect(() => {
    if (projeto) {
      const today = new Date();
      const month = selectedDay ? selectedDay.mes : today.getMonth();
      const year = selectedDay ? selectedDay.ano : today.getFullYear();
      const dayFer = new Date(year, month, 0);
      feriadosPortugal(dayFer);
      setValuesVisualizar(createInitialState(projeto.projeto));
      setValues(createInitialState(projeto.projeto));
      setUpdatedListaDias(listaDias);
      const projetoId = projeto?.projeto?._id;

      if(projeto.projeto.Versao && projeto.projeto.Versao > 1){
        dispatch(getProjetoAllVersoes(projetoId)).then((res) => {
          if (res.payload.projeto) {
            setListaVProjeto(res.payload.projeto)
          } else {
            setListaVProjeto([])
          }
        })
        .catch((error) => {
          console.error(error)
        });

      }
      if (selectedUser !== "Todos") {
        dispatch(getAllDiasProjetoUtilizador({ projetoId, selectedUser }))
          .then((res) => {
            if (res.payload.diasAllProjeto) {
              setListaDias(res.payload.diasAllProjeto);
              setSelectedUser(selectedUser)
              setVerificaDias(1);
            } else {
              setListaDias([]);
              setSelectedUser(selectedUser)
              setVerificaDias(2);
            }
          })
          .catch((error) => {
            console.error(error)
          });
      } else {
        const userLogin = user?.user?.login;
        dispatch(getAllDias({ projetoId, userLogin }))
          .then((res) => {
            if (res.payload.diasAllProjeto) {
              setVerificaDias(1);
              setListaDias(res.payload.diasAllProjeto);
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
    }
   
  }, [selectedUser,listaDias.length, projeto, dispatch]);

  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      let verifica = false;
      for (let i = 0; i < tipoTrabalhoArray.length; i++) {
        if (tipoTrabalhoArray[i].TipoTrabalho.toLowerCase() === "outro") {
          verifica = true;
        }
      }
      if (verifica === false) {
        tipoTrabalhoArray.push({ TipoTrabalho: "Outro" })
      }
      setListaTipoTrabalho(tipoTrabalhoArray);
    });

    dispatch(listaUtilizadores());
   
  }, [selectedUser,listaDias, dispatch]);




  const handleChangeCalendario = useCallback((dia, mes, ano) => {
    const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];
    setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
     
  }, [selectedUser, listaDias]);


  const handleChangeUtilizador = useCallback((e) => {
    const { value } = e.target;
    setSelectedUser(value);
     
  }, [selectedUser, listaDias, dispatch]);

  useEffect(() => {
    if (values && listaTipoTrabalho) {
      const arrayTT = values.TipoTrabalho ? values.TipoTrabalho.split(',') : [];
      const arrayTTH = new Array(arrayTT.length).fill(0);
      if (listaDias && listaDias.length > 0) {
        let totalHours = 0;


        for (let i = 0; i < listaDias.length; i++) {
          const dia = listaDias[i];
          const data = new Date(dia.Data);
          let dataSelected = new Date();
          let condicao = null;
          let diaSelected;
          if (selectedDay && selectedDay.dia !== 0) {
            diaSelected = selectedDay ? selectedDay.dia : 0;
            const month = selectedDay.mes;
            const year = selectedDay.ano;
            dataSelected = new Date(year, month, diaSelected);
            dataSelected.setHours(data.getHours());
            condicao = dia.tipoDeTrabalhoHoras && dataSelected.getTime() === data.getTime();
      
          } else if(selectedDay && selectedDay.dia === 0){
            const month = selectedDay.mes;
            const year = selectedDay.ano;
            dataSelected = new Date(year, month);
            dataSelected.setHours(data.getHours());
            condicao = dia.tipoDeTrabalhoHoras && (dataSelected.getMonth() === data.getMonth() && dataSelected.getFullYear() === data.getFullYear());
          }else {
            condicao = dia.tipoDeTrabalhoHoras;

          }

          if (condicao) {
            for (let j = 0; j < dia.tipoDeTrabalhoHoras.length; j++) {
              const tipoDeTrabalhoHora = dia.tipoDeTrabalhoHoras[j];
              if (tipoDeTrabalhoHora.projeto === values._id) {
                const array = tipoDeTrabalhoHora.horas ? tipoDeTrabalhoHora.horas.split(',') : [];
                let values = tipoDeTrabalhoHora.tipoTrabalho ? tipoDeTrabalhoHora.tipoTrabalho.split(',') : [];
                const filteredValues = values
                  .filter(value => listaTipoTrabalho.some(item => item._id === value))
                  .map(value => {
                    const matchedItem = listaTipoTrabalho.find(item => item._id === value);
                    return matchedItem ? matchedItem.TipoTrabalho : null;
                  });

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
          setValues({
            ...values,
            NumeroHorasTotal: totalHours,
            NumeroHorasTipoTrabalho: arrayTTH,
          });
        } else {
          if(selectedDay){
            if(selectedDay?.dia !== 0){
          setValues({
            ...values,
            NumeroHorasTotal: selectedUser === "Todos" ? `Não existem horas inseridas no projeto neste dia ${selectedDay?.dia}/${selectedDay?.mes + 1}/${selectedDay?.ano}` : `${selectedUser} não possui horas inseridas no projeto neste dia ${selectedDay?.dia}/${selectedDay?.mes + 1}/${selectedDay?.ano}`,
            NumeroHorasTipoTrabalho: ""
          });
        }else {
          setValues({
            ...values,
            NumeroHorasTotal: selectedUser === "Todos" ? `Não existem horas inseridas no projeto neste mes ${selectedDay?.mes + 1}/${selectedDay?.ano}` : `${selectedUser} não possui horas inseridas no projeto neste mes ${selectedDay?.mes + 1}/${selectedDay?.ano}`,
            NumeroHorasTipoTrabalho: ""
          });
        }
        }else{
          setValues({
            ...values,
            NumeroHorasTotal: selectedUser === "Todos" ? `Não existem horas inseridas no projeto` : `${selectedUser} não possui horas inseridas no projeto!`,
            NumeroHorasTipoTrabalho: ""
          });
        }
        }
      } else {
        setValues({
          ...values,
          NumeroHorasTotal: selectedUser === "Todos" ? "Não existem horas inseridas no projeto" : `${selectedUser} não possui horas inseridas no projeto`,
          NumeroHorasTipoTrabalho: "",
        });
      }
    }

    // eslint-disable-next-line
  }, [selectedDay, selectedUser, listaDias, dispatch, setValues]);



  
  const handleChangeVersion = useCallback((event) => {

    if(event.target.value === "Atual"){
      setValuesVisualizar(values);
      // setState(1);
    }else{
      const selectedProjetoVersion = listaVProjeto.find(projetoVersion => projetoVersion.createdAt === event.target.value);

      setValuesVisualizar(createInitialState(selectedProjetoVersion));
      // setState(0);
    }

    
  }, [selectedUser, listaDias]);


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
    } else if (type === "Carnaval") {
      return new Date(year, month, day - 47);
    }
  }

  function calculateCorpusChristi(ano) {
    const domingoPascoa = calculateEaster(ano, "DomingoPascoa");
    return new Date(ano, domingoPascoa.getMonth(), domingoPascoa.getDate() + 60);
  }

  if (isLoading) {
    return <Loading />;
  }
  if (!projeto) {
    return <Loading />;
  }
  if (!dias) {
    return <Loading />;
  }
  if (!values) {
    return <Loading />;
  }
  if (listaDias === updatedListaDias) {
    return <Loading />
  }

  return (
    <Wrapper>

      <div className="mainVisualiza">

        <div className="col-12">
          <main>
            <div className="row mb-3" >

              <div className="col-12 text-center mb-5 ">
                <h1>{values.Nome}</h1>
              </div>
              {listaVProjeto && listaVProjeto.length > 0 && (
                <div className="container">
                  <h2>Seleccione uma Versão:</h2>
                  <select id="pageSelect" onChange={(event) => handleChangeVersion(event)}>

                    <option key="default" value="Atual">
                      Atual
                    </option>
  
                    {listaVProjeto.map((projetoVersion, index) => {
                      const date = new Date(projetoVersion.createdAt);
                      const day = date.getDate();
                      let month = date.getMonth() + 1; 
                      month = month < 10 ? '0' + month : month; 
                      const year = date.getFullYear();
                      const hour = date.getHours(); 
                      const min = date.getMinutes(); 
                      const sec = date.getSeconds(); 

                      const data = `${day}/${month}/${year} ${hour}:${min}:${sec}`; 
                      return (
                        <option key={index} value={projetoVersion.createdAt}>
                          {data}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              <VisualizarHorasProjetoVersion
                      values={valuesVisualizar}
                      utilizadores={utilizadores}
             />
              <div className="col-5 text-center right">

                {(user?.user?.tipo === 2) ? (
                  <div className='text-center mb-5'>
                    <h3 className='mb-5'>Escolha Utilizador</h3>
                    <FormRowSelect
                      type="text"
                      className="row mb-3 text-center"
                      classNameLabel='col-md-3 text-end'
                      classNameInput='col-md-9'
                      classNameResult='col-md-6'
                      id="piloto"
                      name="Piloto"
                      labelText="Utilizador:"
                      value={selectedUser}
                      list={formattedListUtilizadores}
                      handleChange={handleChangeUtilizador}
                      multiple={false}
                      todos={8}
                    />
                  </div>
                ) : (
                  <div className='text-center mb-5'>
                    <h3 className='mb-5'>Escolha Utilizador</h3>
                    <FormRowSelect
                      type="text"
                      className="row mb-3 text-center"
                      classNameLabel='col-md-3 text-end'
                      classNameInput='col-md-9'
                      classNameResult='col-md-6'
                      id="piloto"
                      name="Piloto"
                      labelText="Utilizador:"
                      value={selectedUser}
                      list={[user?.user]}
                      handleChange={handleChangeUtilizador}
                      multiple={false}
                      todos={8}
                    />
                  </div>
                )
                }

                <div className='col-12 description'>
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
                </div>
                <div className="col-12 mb-5 text-center">
                  {verificaDias === 1 ? (
                    <Calendar
                      handleChange={handleChangeCalendario}
                      feriados={getFeriados}
                      vProjeto={updatedListaDias}
                      inicio={values?.DataInicio}
                      objetivo={values?.DataObjetivo}
                      fim={values?.DataFim}
                    />
                  ) : verificaDias === 2 ? (
                    <Calendar
                      handleChange={handleChangeCalendario}
                      feriados={getFeriados}
                      inicio={values?.DataInicio}
                      objetivo={values?.DataObjetivo}
                      fim={values?.DataFim}
                    />
                  ) : null}
                </div>
                <div className="row mb-3 ">
                  <div className="col-3">
                    <h5>Data Inicio</h5>
                  </div>
                  <div className="col-3">
                    <p>{values.DataInicio ? new Date(values.DataInicio).toLocaleDateString('en-CA') : 'Sem data Inicial'}</p>
                  </div>

                  {values.Finalizado === true ? (
                    <>
                      <div className="col-3">
                        <h5>Data Final</h5>
                      </div>
                      <div className="col-3">
                        <p>{values.DataFim ? new Date(values.DataFim).toLocaleDateString('en-CA') : 'Sem Data Final'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-3">
                        <h5>Data Objetivo</h5>
                      </div>
                      <div className="col-3">
                        <p>{values.DataObjetivo ? new Date(values.DataObjetivo).toLocaleDateString('en-CA') : 'Sem data Objetivo'}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="row g-5">
                  {selectedDay && selectedDay?.dia !== 0 &&
                    <h5>{selectedDay?.dia}/{selectedDay?.mes + 1}/{selectedDay?.ano}</h5>}
                  <div className="col-6">
                  <h5>{selectedDay ? selectedDay?.dia === 0 ? `Numero total Horas ${selectedDay?.mes +1}/${selectedDay?.ano}` : `Numero total Horas ${selectedDay?.dia}/${selectedDay?.mes + 1}/${selectedDay?.ano}`  : `Numero Total Horas`}</h5>
                 </div>
                  <div className="col-6">
                    <p>{values.NumeroHorasTotal}</p>
                  </div>
                </div>
                {typeof values.NumeroHorasTotal === 'number' && (
                  <div className="row mb-3">
                    <div className="col-3">
                      <h5>Tipos de Trabalho</h5>
                    </div>
                    <div>
                      {listaTipoTrabalho && listaTipoTrabalho.length > 0 ? (
                        listaTipoTrabalho.map((t, i) => {

                          return (
                            values.NumeroHorasTipoTrabalho[t.TipoTrabalho] && values.NumeroHorasTipoTrabalho[t.TipoTrabalho] > 0 ? (
                              <div className="row mb-3" key={i}>
                                <div className="col-6">
                                  <p>{t.TipoTrabalho}</p>
                                </div>
                                <div className="col-6">
                                  <p>{values.NumeroHorasTipoTrabalho[t.TipoTrabalho]}</p>
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
              </div>
            </div>
          </main>
        </div>
      </div>
    </Wrapper>
  );
}

export default VisualizarProjeto;