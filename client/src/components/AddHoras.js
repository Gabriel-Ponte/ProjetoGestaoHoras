import { useEffect, useState, useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Wrapper from '../assets/wrappers/addDias';
import { FaCaretDown } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos1, handleChange } from '../features/allProjetos/allProjetosSlice';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { toast } from 'react-toastify';
import { createDia, getDia, editDia } from '../features/dias/diasSlice';
import { FormRow } from '../components';
import PageBtnContainer from './PageBtnContainer';
import Loading from './Loading';

const initialState = {
  _id: '',
  Data: new Date().toISOString().slice(0, 10),
  NumeroHoras: '',
  Utilizador: '',
  tipoDeTrabalhoHoras: [],
};

const ListaProjetos = () => {
  const [values, setValues] = useState(initialState);
  const {
    projetos,
    isLoading,
    page,
    totalProjetos,
    numOfPages,
    search,
    searchStatus,
    searchType,
    sort,
  } = useSelector((store) => store.allProjetos);

  const dispatch = useDispatch();

  const [showProjeto, setShowProjeto] = useState({});
  const [sortedProjetos, seTSortedProjetos] = useState([])
  const [horasT, setHorasT] = useState(0);
  const [DataCopy, setDataCopy] = useState("");
  const [copyExists, setCopyExists] = useState(true);
  const { user } = useSelector((store) => store.utilizador);
  const [listaDias, setListaDias] = useState([]);
  const [filteredProjetos, setFilteredProjetos] = useState([]);
  const [verificaDiaCalled, setVerificaDiaCalled] = useState(false);
  const [verificaChange, setVerificaChange] = useState(false);
  const [verificaCopiarHoras, setVerificaCopiarHoras] = useState(false);
  const [lastDate, setLastDate] = useState()
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);

  let StringListaTrabalho = listaTipoTrabalho
    .filter(item => item.tipo === 1)
    .map(item => item.TipoTrabalho)
    .join(",");

  let StringListaTrabalhoGeral = listaTipoTrabalho
    .filter(item => item.tipo === 2)
    .map(item => item.TipoTrabalho)
    .join(",");


  useEffect(() => {
    dispatch(handleChange({ name: 'projetoFinalizado', value: "false" }));
    dispatch(handleChange({ name: 'DataObjetivoC', value: "true" }));
    dispatch(getAllProjetos1( "" ))
    dispatch(getTipoTrabalho()).then((res) => {
      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);
    });
  }, [totalProjetos]);


  useEffect(() => {
    const dateP = values.Data ? new Date(values.Data) : new Date();
    const filteredP = projetos.filter((p) => {
      const dataI = new Date(p.DataInicio);
      if (p.DataFim) {
        const dataF = new Date(p.DataFim);
        if (dataF < dateP) {
          return false;
        }
      } else if (p.Finalizado) {
        return false;
      }
      if (dataI > dateP) {

        return false;
      }
      return true;
    });
    

    setFilteredProjetos(filteredP);
  }, [values.Data]);


  useEffect(() => {

    dispatch(getDia(values.Data, user.user.id)).then((res) => {
      const lista = res.payload.dia
      setListaDias(lista);

      const firstDateWithLessThan8Hours = lista.reduceRight((acc, item) => {
        const itemDate = new Date(item.Data);

        if (item.NumeroHoras < 8) {
          return itemDate >= acc ? item : acc;
        }
        return acc;
      }, null);

      const sortedDates = lista
        .map(item => new Date(item.Data))
        .sort((a, b) => a - b);

      let missingDate = null;
      let currentDate = new Date(Date.UTC(2023, 7, 1, 0, 0, 0));
      let targetDate = null;
      const date = new Date().toISOString().slice(0, 10);
      let today = new Date(date);
      for (let i = 0; i < sortedDates.length + 1; i++) {
        if (i === sortedDates.length) {
          targetDate = today;
        } else {
          targetDate = sortedDates[i];
        }
        while (currentDate.getTime() <= targetDate.getTime()) {
          if (feriadosPortugal(currentDate)) {
            currentDate.setDate(currentDate.getDate() + 1);
          }


          if (currentDate.getTime() === targetDate.getTime()) {
            if (currentDate.getTime() === today?.getTime()) {
              missingDate = new Date(currentDate.getTime());
              break;
            }

            currentDate.setDate(currentDate.getDate() + 1);
            break;
          }

          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            missingDate = new Date(currentDate.getTime());
            break;
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        if (missingDate) {
          break;
        }
      }

      if (firstDateWithLessThan8Hours === null || missingDate.getTime < new Date(firstDateWithLessThan8Hours.Data).getTime()) {
        setValues({
          ...values,
          Data: missingDate,
        });
      } else {
        const tipoDeTrabalhoHoras = {}
        for (let j = 0; j < firstDateWithLessThan8Hours.tipoDeTrabalhoHoras.length; j++) {
          const val = firstDateWithLessThan8Hours.tipoDeTrabalhoHoras[j].projeto;
          tipoDeTrabalhoHoras[val] = firstDateWithLessThan8Hours.tipoDeTrabalhoHoras[j];
        }
        setValues({
          ...values,
          Data: firstDateWithLessThan8Hours.Data,
        });
      }

      const lastDateWithMoreThan8Hours = lista.reduceRight((acc, item) => {
        const itemDate = new Date(item.Data);

        if (item.NumeroHoras >= 8) {
          return itemDate.getTime >= acc.getTime ? item : acc;
        }
        return acc;
      }, new Date(null));



      setLastDate(lastDateWithMoreThan8Hours);
      setDataCopy({
        DataCopy: lastDateWithMoreThan8Hours?.Data,
      })
    });
  }, [totalProjetos]);

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
    }
  }

  function calculateCorpusChristi(ano) {
    const domingoPascoa = calculateEaster(ano, "DomingoPascoa");
    return new Date(ano, domingoPascoa.getMonth(), domingoPascoa.getDate() + 60);
  }





  const verificaDiaLast = useCallback((e) => {
    const { value } = e.target;
    const dataEscolhida = new Date(value);
    const copiaEscolhida = listaDias.reduceRight((acc, item) => {
      const itemDate = new Date(item.Data);
      if (itemDate.getTime() === dataEscolhida.getTime()) {


        return item;
      }
      return acc;
    }, new Date(DataCopy.DataCopy));

    if (copiaEscolhida.Data) {
      const tipoDeTrabalhoHoras = {};
      let sSProjetos = sortedProjetos;
      for (let j = 0; j < copiaEscolhida.tipoDeTrabalhoHoras.length; j++) {
        const val = copiaEscolhida.tipoDeTrabalhoHoras[j].projeto;
        sSProjetos = sortedProjetos.slice().sort((a, b) => {
          if (a?._id === val && b?._id !== val) {
            return -1;
          } else if (a?._id !== val && b?._id === val) {
            return 1;
          }
          return 0;
        });
        tipoDeTrabalhoHoras[val] = copiaEscolhida.tipoDeTrabalhoHoras[j];
      }
      setValues({
        ...values,
        Utilizador: user.user.login,
        NumeroHoras: copiaEscolhida.NumeroHoras,
        tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
      });


      seTSortedProjetos(sSProjetos);
      setCopyExists(true);
      setDataCopy({
        DataCopy: copiaEscolhida?.Data,
      });
      setLastDate(copiaEscolhida);
    } else {
      setCopyExists(false);
    }


  }, [listaDias, DataCopy, filteredProjetos]);


  const verificaDia = useCallback((e) => {
    setVerificaCopiarHoras(false);

    const sProjetos = filteredProjetos.slice().sort((a, b) => {
      const pilotoAArray = a?.Piloto.split(',') || [];
      const pilotoBArray = b?.Piloto.split(',') || [];
      const nomeA = a?.Nome || [];
      const nomeB = b?.Nome || [];

      const pilotoAIncludesUser = pilotoAArray.includes(user.user.id) || pilotoAArray.includes(user.user.nome) || pilotoAArray.includes(user.user.login) || pilotoAArray.includes("Todos");
      const pilotoBIncludesUser = pilotoBArray.includes(user.user.id) || pilotoBArray.includes(user.user.nome) || pilotoBArray.includes(user.user.login) || pilotoAArray.includes("Todos");

      if (nomeA === "Geral") {
        console.log("nomeA");
        return -1;
      } else if (nomeB === "Geral") {
        console.log("nomeB");
        return 1;
      }

      if (pilotoAIncludesUser && !pilotoBIncludesUser) {
        return -1;
      } else if (!pilotoAIncludesUser && pilotoBIncludesUser) {
        return 1;
      }
      return 0;
    });



    const { name, value } = e.target;
    const data = new Date(value)

    for (let i = 0; i < listaDias.length; i++) {
      const DataRecebida = new Date(listaDias[i].Data);

      if (data.getTime() === DataRecebida.getTime()) {
        const tipoDeTrabalhoHoras = {};
        let sSProjetos = sProjetos;
        for (let j = 0; j < listaDias[i].tipoDeTrabalhoHoras.length; j++) {
          const val = listaDias[i].tipoDeTrabalhoHoras[j].projeto;
          sSProjetos = sProjetos.slice().sort((a, b) => {
            if (a?._id === val && b?._id !== val) {
              return -1;
            } else if (a?._id !== val && b?._id === val) {
              return 1;
            }
            return 0;
          });
          tipoDeTrabalhoHoras[val] = listaDias[i].tipoDeTrabalhoHoras[j];
        }

        setValues({
          ...values,
          [name]: value,
          _id: listaDias[i]._id,
          Utilizador: user.user.login,
          NumeroHoras: listaDias[i].NumeroHoras,
          tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
        });
        seTSortedProjetos(sSProjetos)
        setHorasT(listaDias[i].NumeroHoras);
        setVerificaChange(true);
        setVerificaDiaCalled(true);
        return;
      }
    }

    setValues({
      ...values,
      [name]: value,
      NumeroHoras: "",
      tipoDeTrabalhoHoras: [],
    });
    seTSortedProjetos(sProjetos)
    setHorasT(0);
    setVerificaChange(false);
    setVerificaDiaCalled(false);
    return;

  }, [listaDias, filteredProjetos]);



  useEffect(() => {
    verificaDia({ target: { name: 'Data', value: values.Data } });
  }, [listaDias, filteredProjetos]);



  const handleDropdownToggle = (projectId) => {
    setShowProjeto((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleDia = async (e) => {
    e.preventDefault();
    if (horasT > 8) {
      toast.error('Valor inserido excede as 8 Horas diarias!');
    }
    if (horasT <= 0) {
      toast.error('Valor inserido invalido!');
      return;
    }

    values.Utilizador = user.user.id;
    if (verificaDiaCalled) {
      await dispatch(editDia(values));
    } else {
      await dispatch(createDia(values));
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };





  const handleHorasChange = (projectId, tipoTrabalho, projectName, e) => {
    let newHorasT = horasT;
    let horasNumber = Number(e.target.value);
    let diff = 0;
    if (isNaN(horasNumber) || horasNumber <= 0 || horasNumber === null) {
      horasNumber = 0;
    }


    const newTipoDeTrabalhoHoras = { ...values.tipoDeTrabalhoHoras };
    const horasTipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.horas?.split(',') || [];
    const tipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.tipoTrabalho?.split(',') || [];
    let newShowProjeto = { ...showProjeto };

    if (tipoTrabalhoArray.includes(tipoTrabalho)) {

      const index = tipoTrabalhoArray.indexOf(tipoTrabalho);
      const oldValue = Number(horasTipoTrabalhoArray[index]);
      const newValue = horasNumber;

      if (oldValue !== newValue) {
        diff = newValue - oldValue;
        horasTipoTrabalhoArray[index] = newValue;

        newTipoDeTrabalhoHoras[projectId] = {
          ...newTipoDeTrabalhoHoras[projectId],
          horas: horasTipoTrabalhoArray.join(','),
        };
        newHorasT = horasT + diff;
      }

    } else {
      newShowProjeto = {
        ...newShowProjeto,
        [projectId + tipoTrabalho]: horasNumber
      };
      tipoTrabalhoArray.push(tipoTrabalho);
      horasTipoTrabalhoArray.push(horasNumber);
      newTipoDeTrabalhoHoras[projectId] = {
        ...newTipoDeTrabalhoHoras[projectId],
        tipoTrabalho: tipoTrabalhoArray.join(','),
        horas: horasTipoTrabalhoArray.join(',')
      };
      newHorasT = horasT + horasNumber;
    }
    if (newHorasT > 24) {
      toast.error('Valor inserido excede as 24 Horas!');
      setValues({ ...values, [e.target.id]: 0 });
      //setHorasT(horasT - (showProjeto[projectId + tipoTrabalho] || 0));
      return;
    }

    setValues({
      ...values,
      [e.target.id]: horasNumber,
      NumeroHoras: newHorasT,
      tipoDeTrabalhoHoras: newTipoDeTrabalhoHoras
    });

    setHorasT(newHorasT);
    setShowProjeto(newShowProjeto);
  };


  const copiar = (value) => {
    if (value === true) {
      if(!lastDate?.tipoDeTrabalhoHoras){
        toast.error("Utilizador não possui horas inseridas para copiar");
        return;
      }

      const tipoDeTrabalhoHoras = {};
      let sSProjetos = sortedProjetos;
      for (let j = 0; j < lastDate?.tipoDeTrabalhoHoras?.length; j++) {
        const val = lastDate.tipoDeTrabalhoHoras[j].projeto;

        sSProjetos = sortedProjetos.slice().sort((a, b) => {
          if (a?._id === val && b?._id !== val) {
            return -1;
          } else if (a?._id !== val && b?._id === val) {
            return 1;
          }
          return 0;
        });

        tipoDeTrabalhoHoras[val] = lastDate.tipoDeTrabalhoHoras[j];
      }
      setValues({
        ...values,
        Utilizador: user.user.login,
        NumeroHoras: lastDate.NumeroHoras,
        tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
      });
      seTSortedProjetos(sSProjetos);
      setHorasT(lastDate.NumeroHoras);
      setVerificaChange(true);
    } else {
      setVerificaChange(false);
      setValues({
        ...values,
        Utilizador: user.user.login,
        NumeroHoras: 0,
        tipoDeTrabalhoHoras: [],
      });
      setHorasT(0);
    }


    setVerificaCopiarHoras(value);
  }


  if (isLoading) {
    return <Loading />;
  }

  
  const matchFoundProjeto = new Array(sortedProjetos.length).fill(false);
  const arrayTipoTrabalho = Object.entries(values.tipoDeTrabalhoHoras).map(([key, value]) => ({ _id: key, ...value }));
  let counter = 0;

  // Initialize horasP as an object
  const horasP = [];

  // Initialize horasP with project IDs as keys and initial values of 0
  sortedProjetos.forEach(project => {
    horasP[project._id] = 0;
  });

  return (
    <Wrapper>
      <div className="container">
        <div>
          <h3>{verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}</h3>
          <div className='row'>
            <div className='col-6'>
              <FormRow
                type="date"
                className="dataAddHoras"
                classNameInputDate="form__field__date"
                classNameLabel="form-field-label"
                id="Dia"
                name="Data"
                placeholder="Dia Adicionar Horas"
                value={values.Data ? new Date(values.Data).toLocaleDateString('en-CA') : ''}
                handleChange={verificaDia}
              />
            </div>
            <div className='col-6 text-center'>

              {verificaCopiarHoras === false ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => copiar(true)}
                  >
                    Copiar Horas
                  </button>
                </div>
              ) : (
                <div className='row'>
                  <div className='col-8 '>
                    {DataCopy.DataCopy !== null && DataCopy.DataCopy !== undefined ? (
                      <div>
                        <FormRow
                          type="date"
                          className="dataAddHoras"
                          classNameInputDate="form__field__date"
                          classNameLabel="form-field-label"
                          id="Dia Copia"
                          name="Data a Copiar"
                          placeholder="Dia Adicionar Horas"
                          value={DataCopy.DataCopy ? new Date(DataCopy.DataCopy).toLocaleDateString('en-CA') : ''}
                          handleChange={verificaDiaLast}
                        />
                      </div>
                    ) : (
                      <div>
                        <p>Sem Horas inseridas para copiar</p>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }} className='col-4 text-center'>

                    <button
                      onClick={() => copiar(false)}
                      className='btn'
                      style={{ margin: '5%'}}
                    >
                      <AiOutlineClose />
                    </button>


                    <div className="col-12">
                      <button
                        onClick={(e) => { handleDia(e) }}
                        className="btn btn-primary"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>


                  {!copyExists && (
                    <div>
                      <p>Não possui horas inseridas no dia escolhido. Ultimo dia com horas possiveis selecionado!</p>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
        <div className="list-group mx-1 w-auto">
          {sortedProjetos.map((project, idProjeto) => {

            // initialize the counter
            return (
              <div className="list-group-item" key={project._id}>
                <div className="row mb-3 text-center">
                  <div className="col-md-4 text-end themed-grid-col">
                    <h5>{project.Nome}</h5>
                  </div>
                  <div className="col-md-8  themed-grid-col">
                    <div className='row'>
                      <div className="col-md-10 btn-container">
                        <button
                          type="button"
                          className="btn button-Dropdown"
                          onClick={() => handleDropdownToggle(project._id)}
                        >
                          <FaCaretDown />
                        </button>



                        <div
                          className={
                            `dropdown ${showProjeto[project._id] ? "show-dropdown" : "hidden-dropdown"}
                      ${showProjeto[project._id] ? "" : "d-none"}`}

                        >
                          <div className="row mb-3 text-center" key={"NewDia" + project._id}>
                            {!verificaChange && (
                              (project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral).split(",").map((t, i) => (

                                <div className="row mb-3 text-center" key={"NovoDia" + i}>
                                  <div className="col-md-9 text-start themed-grid-col">
                                    <p>{t} </p>
                                  </div>
                                  <div className="col-md-3 themed-grid-col">
                                    <input
                                      type="number"
                                      min="0"
                                      max="24"
                                      id="horas"
                                      className="horas"
                                      placeholder="0"
                                      value={values.tipoDeTrabalhoHoras[project.Nome]?.[t]}
                                      onChange={(e) =>
                                        handleHorasChange(
                                          project._id,
                                          listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(","),
                                          project.Nome,
                                          e
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )
                              )
                            )
                            }



                            <div key={"NewDia" + project._id}>
                              {verificaChange && values.tipoDeTrabalhoHoras.length !== 0 && Array.isArray(arrayTipoTrabalho) &&
                                arrayTipoTrabalho.map((item, ID) => {

                                  counter++;
                                  const itemTypeArray = item.tipoTrabalho ? item.tipoTrabalho.split(",") : [];
                                  const matchFound = new Array(itemTypeArray.length + 1).fill(false);

                                  if (project._id === item.projeto) {

                                    const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas.split(",") : [];
                                    // console.log(valuesHorasTypeArray)
                                    // console.log(listaTipoTrabalho)
                                    // console.log(itemTypeArray)
                                    matchFoundProjeto[idProjeto] = true;
                                    let counter1 = -1;
                                    return (
                                      <div key={"EditarDia" + ID}>

                                        {(project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral).split(",").map((t, i) =>
                                          itemTypeArray.map((iT, iId) => {
                                            if ((project.Nome !== "Geral" ? listaTipoTrabalho.filter(item => item.tipo === 1)[i]._id : listaTipoTrabalho.filter(item => item.tipo === 2)[i]._id) === iT) {

                                              matchFound[i] = true;
                                              counter1++;
                                              return (
                                                <div className="row mb-3 text-center" key={"EditarDiaTTFound" + iId}>
                                                  <div className="col-md-9 text-start themed-grid-col">

                                                    <p>{t}</p>
                                                  </div>
                                                  <div className="col-md-3 themed-grid-col">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="24"
                                                      id={`horas-${item._id}`}
                                                      className="horas"
                                                      placeholder="0"
                                                      value={
                                                        valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                          ? valuesHorasTypeArray[iId]
                                                          : []
                                                      }
                                                      onChange={(e) =>
                                                        handleHorasChange(
                                                          project._id,
                                                          listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(","),
                                                          project.Nome,
                                                          e
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            } else {
                                              if (iId === itemTypeArray.length - 1) {
                                                if (!matchFound[i]) {
                                                  return (
                                                    <div className="row mb-3 text-center" key={"EditarDiaTTNotFound" + iId}>
                                                      <div className="col-md-9 text-start themed-grid-col">
                                                        <p>{t}</p>
                                                      </div>
                                                      <div className="col-md-3 themed-grid-col">
                                                        <input
                                                          key={i}
                                                          type="number"
                                                          min="0"
                                                          max="24"
                                                          id={`horas-${item._id}`}
                                                          className="horas"
                                                          placeholder="0"
                                                          value={
                                                            isNaN(values.tipoDeTrabalhoHoras[project.Nome]?.[t])
                                                          }
                                                          onChange={(e) =>
                                                            handleHorasChange(
                                                              project._id,
                                                              listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(","),
                                                              project.Nome,
                                                              e
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              }
                                            }
                                          }
                                          )
                                        )
                                        }
                                      </div>
                                    );
                                  } else {
                                    if (!matchFoundProjeto[idProjeto] && ID === arrayTipoTrabalho.length - 1) {
                                      return (
                                        <div key={"EditarDiaProjetoNotFound" + idProjeto}>
                                          {(project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral).split(",").map((t, i) => {
                                            return (
                                              <div className="row mb-3 text-center" key={"EditarDiaProjetoNotFoundList" + i}>
                                                <div className="col-md-9 text-start themed-grid-col" >
                                                  <p>{t}</p>
                                                </div>
                                                <div className="col-md-3 themed-grid-col">
                                                  <input
                                                    type="number"
                                                    min="0"
                                                    max="24"
                                                    id="horas"
                                                    className="horas"
                                                    placeholder="0"
                                                    value={values.tipoDeTrabalhoHoras[project.Nome]?.t}
                                                    onChange={(e) =>
                                                      handleHorasChange(
                                                        project._id,
                                                        listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(","),
                                                        project.Nome,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            )
                                          }
                                          )
                                          }
                                        </div>
                                      );
                                    }
                                  }
                                }
                                )
                              }
                            </div>
                          </div>
                        </div>
                      </div>



                      <div className={`col-md-2  text-start ${showProjeto[project._id] ? "hidden-dropdown" : "show-dropdown"}`}>
                        {values.tipoDeTrabalhoHoras[project._id]?.horas && values.tipoDeTrabalhoHoras[project._id]?.horas.split(",").map((t, i) => {
                          horasP[project._id] += +t;
                          return null;
                        })}
                        <h3>{horasP[project._id] !== 0 ? horasP[project._id] : ''}</h3>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}

          {numOfPages > 1 && <PageBtnContainer />}
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total de horas: {horasT}</h5>
            </div>

            <div className="card-body">
              <button
                type="submit"
                disabled={isLoading}
                onClick={(e) => { handleDia(e) }}
                className="w-100 btn btn-lg btn-primary"
              >
                {isLoading ? 'loading...' : verificaDiaCalled ? 'Editar Dia' : 'Guardar Dia'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default ListaProjetos;