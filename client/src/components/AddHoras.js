import { useEffect, useState, useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Wrapper from '../assets/wrappers/addDias';
import { FaCaretDown } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos1, handleChange } from '../features/allProjetos/allProjetosSlice';
import { getTipoTrabalho, createTipoTrabalhoOther } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { toast } from 'react-toastify';
import { createDia, getDia, editDia } from '../features/dias/diasSlice';
import { FormRow } from '../components';
import PageBtnContainer from './PageBtnContainer';
import Loading from './Loading';
import { IoAddOutline } from 'react-icons/io5'

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
    totalProjetos,
    numOfPages,
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
  const [lastDate, setLastDate] = useState();
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);

  const [ListaTrabalhoAll, setListaTrabalhoAll] = useState([]);
  const [ListaTrabalhoGeral, setListaTrabalhoGeral] = useState([]);
  const [ListaTrabalhoGeralOther, setListaTrabalhoGeralOther] = useState([]);
  const [horasExtra, setHorasExtra] = useState(null);
  const [horasExtraAfter, setHorasExtraAfter] = useState(null);
  //const [selectedOption, setSelectedOption] = useState();
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [compensacaoID, setcompensacaoID] = useState();

  const [StringListaTrabalho, setStringListaTrabalho] = useState();
  const [StringListaTrabalhoGeral, setStringListaTrabalhoGeral] = useState();
  const [StringListaTrabalhoGeralOther, setStringListaTrabalhoGeralOther] = useState();
  const [options, setOptions] = useState();

  useEffect(() => {
    const ListaTrabalho = listaTipoTrabalho
      .filter(item => item.tipo === 1)
      .map(item => item.TipoTrabalho)
      .join(",");

    const ListaTrabalhoGeral = listaTipoTrabalho
      .filter(item => (item.tipo === 2 || item.tipo === 4))
      .map(item => item.TipoTrabalho)
      .join(",");

    const ListaTrabalhoGeralOther = listaTipoTrabalho
      .filter(item => item.tipo === 3)
      .map(item => item.TipoTrabalho)
      .join(",");

    setStringListaTrabalho(ListaTrabalho);

    setStringListaTrabalhoGeral(ListaTrabalhoGeral);

    setStringListaTrabalhoGeralOther(ListaTrabalhoGeralOther);

    setOptions(ListaTrabalhoGeralOther.split(","));
  }, [totalProjetos, listaDias]);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setDropdownOpen(true);
  };

  const handleSelectOption = (option) => {
    //setSelectedOption(option);
    setInputValue(option);
    setDropdownOpen(false);
  };

  const handleTipoTrabalho = async (e) => {
    if (inputValue && inputValue.trim() !== "") {
      const values = StringListaTrabalhoGeral.split(",");

      if (!values.map(value => value.toLowerCase()).includes(inputValue.toLowerCase())) {
        // Handle when inputValue is not already in StringListaTrabalhoGeral

        // Create a mapping to preserve the original case
        const inputValueMap = new Map();
        let originalCaseInputValue = "";
        if (!options.some(option => option.toLowerCase() === inputValue.toLowerCase())) {
          await dispatch(createTipoTrabalhoOther({ TipoTrabalho: inputValue, tipo: 3 })).then((res) => {
            
            const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [res.payload.tipoTrabalho];
            
            const updatedListaTrabalhoGeral = [...ListaTrabalhoGeral, ...tipoTrabalhoArray];
            const updatedListaTipoTrabalho = [...listaTipoTrabalho, ...tipoTrabalhoArray];
           
            setListaTipoTrabalho(updatedListaTipoTrabalho,);
            setListaTrabalhoGeral(updatedListaTrabalhoGeral);
          })
          originalCaseInputValue = inputValue;
        } else {
          options.forEach(option => inputValueMap.set(option.toLowerCase(), option));
          originalCaseInputValue = inputValueMap.get(inputValue.toLowerCase());
          // Remove originalCaseInputValue from options
          const updatedOptions = options.filter(option => option.toLowerCase() !== inputValue.toLowerCase());
          setOptions(updatedOptions);

          const normalizedInputValue = originalCaseInputValue.toLowerCase(); // or .toUpperCase()
          const tipoTrabalho = ListaTrabalhoGeralOther.filter(item => item.TipoTrabalho.toLowerCase() === normalizedInputValue);
          const updatedListaTrabalhoGeral = [...ListaTrabalhoGeral, ...tipoTrabalho];

          setListaTrabalhoGeral(updatedListaTrabalhoGeral);

          const updatedListaTrabalhoGeralOther = ListaTrabalhoGeralOther.filter(item => item.TipoTrabalho.toLowerCase() !== normalizedInputValue);
          setListaTrabalhoGeralOther(updatedListaTrabalhoGeralOther);

          // tipoTrabalhoArray.filter(item => item.tipo === 3))


          let NovaStringListaTrabalhoGeralOther = StringListaTrabalhoGeralOther.split(",");

          // Use the mapping to get the original case of inputValue
          NovaStringListaTrabalhoGeralOther = NovaStringListaTrabalhoGeralOther.filter(item => item !== originalCaseInputValue);

          setStringListaTrabalhoGeralOther(NovaStringListaTrabalhoGeralOther.join(","));

        }



        let NovaStringListaTrabalhoGeral = StringListaTrabalhoGeral.split(",");

        // Use the mapping to get the original case of inputValue

        NovaStringListaTrabalhoGeral.push(originalCaseInputValue);


        setStringListaTrabalhoGeral(NovaStringListaTrabalhoGeral.join(","));
        setInputValue("")
      } else {
        toast.error('Valor inserido não permitido!');
      }
    }
  }

  const renderOptions = () => {
    if (isDropdownOpen && options && options.length > 0) {
      return (
        <div className="options-panel">
          {options
            .filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
            .map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelectOption(option)}
                className="option"
              >
                {option}
              </div>
            ))}
        </div>
      );
    }
  };

  useEffect(() => {
    dispatch(handleChange({ name: 'projetoFinalizado', value: "false" }));
    dispatch(handleChange({ name: 'DataObjetivoC', value: "true" }));
    dispatch(getAllProjetos1(""))

    dispatch(getTipoTrabalho()).then((res) => {

      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);

      const compensacao = tipoTrabalhoArray.filter(item => item.tipo === 4)

      setcompensacaoID(compensacao[0]?._id)
      setListaTrabalhoAll(tipoTrabalhoArray.filter(item => item.tipo === 1))
      setListaTrabalhoGeral(tipoTrabalhoArray.filter(item => (item.tipo === 2 || item.tipo === 4)))
      setListaTrabalhoGeralOther(tipoTrabalhoArray.filter(item => item.tipo === 3))

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

      const projetoGeral = (filteredProjetos.filter(item => item.Nome === "Geral"));

      let countHours = 0;
      const dayStart = new Date(Date.UTC(2023, 10, 6, 0, 0, 0));

      const startDay = dayStart.getDate();
      const startMonth = dayStart.getMonth();
      const startYear = dayStart.getFullYear();

      const extraHours = lista.filter(item => {
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

            if (projeto.projeto === projetoGeral[0]?._id) {
              const tt = projeto.tipoTrabalho.split(',') || [];
              const ttH = projeto.horas.split(',') || [];

              for (let j = 0; j < tt.length; j++) {
                if (tt[j] === compensacaoID) {
                  countHours -= ttH[j];
                }
              }
            }
          }

          if (feriadosPortugal(date)) {
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
        }
      });

      setHorasExtra(countHours);
      setHorasExtraAfter(countHours);

      const firstDateWithLessThan8Hours = lista.reduceRight((acc, item) => {
        const itemDate = new Date(item.Data);
        const itemDayOfWeek = itemDate.getDay();
        if ((itemDayOfWeek !== 0 && itemDayOfWeek !== 6) && item.NumeroHoras < 6) {
          return itemDate.getTime() >= acc?.getTime ? item : acc;
        }

        if (itemDayOfWeek !== 5 && item.NumeroHoras < 8) {
          return itemDate.getTime() >= acc?.getTime ? item : acc;
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

      const todayDay = today.getDate();
      const todayMonth = today.getMonth();
      const todayYear = today.getFullYear();

      for (let i = 0; i < sortedDates.length + 1; i++) {
        if (i === sortedDates.length) {
          targetDate = today;
        } else {
          targetDate = sortedDates[i];
        }

        targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);

        while (currentDate <= targetDate) {

          if (feriadosPortugal(currentDate)) {
            currentDate.setDate(currentDate.getDate() + 1);

            const itemDay = targetDate.getDate();
            const itemMonth = targetDate.getMonth();
            const itemYear = targetDate.getFullYear();

            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            if (
              currentYear !== itemYear ||
              currentMonth !== itemMonth ||
              currentDay !== itemDay
            ) {
              break;
            }
          }

          const itemDay = targetDate.getDate();
          const itemMonth = targetDate.getMonth();
          const itemYear = targetDate.getFullYear();

          const currentDay = currentDate.getDate();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          if (
            currentYear === itemYear &&
            currentMonth === itemMonth &&
            currentDay === itemDay
          ) {

            if (
              currentYear === todayYear &&
              currentMonth === todayMonth &&
              currentDay === todayDay
            ) {
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

      if (firstDateWithLessThan8Hours === null || missingDate.getTime() < new Date(firstDateWithLessThan8Hours).getTime()) {
        setValues({
          ...values,
          Data: missingDate,
        });
      } else {
        const tipoDeTrabalhoHoras = {}
        for (let j = 0; j < firstDateWithLessThan8Hours?.tipoDeTrabalhoHoras?.length; j++) {
          const val = firstDateWithLessThan8Hours.tipoDeTrabalhoHoras[j].projeto;
          tipoDeTrabalhoHoras[val] = firstDateWithLessThan8Hours.tipoDeTrabalhoHoras[j];
        }
        setValues({
          ...values,
          Data: firstDateWithLessThan8Hours,
        });
      }

      const lastDateWithMoreThan8Hours = lista.reduceRight((acc, item) => {
        const itemDate = new Date(item.Data);
        if (
          (values?.Data && new Date(values.Data).getDay() !== 5 && (itemDate.getDay() !== 5 && item.NumeroHoras >= 8)) ||
          (values?.Data && new Date(values.Data).getDay() === 5 && (itemDate.getDay() === 5 && item.NumeroHoras >= 6))
        ) {

          if (!acc.Data) {
            return item;
          }
          const data = acc.Data;
          const date = new Date(data);

          if (!isNaN(date)) {
            if (itemDate.getTime() >= date.getTime()) {
              return item;
            }
          } else {
            if (itemDate.getTime() >= acc.Data) {
              return item;
            }
          }
        }
        return acc;
      }, new Date(null));

      setLastDate(lastDateWithMoreThan8Hours);
      setDataCopy({
        DataCopy: lastDateWithMoreThan8Hours.Data,
      });
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



    const currentDay = dataEscolhida.getDate();
    const currentMonth = dataEscolhida.getMonth();
    const currentYear = dataEscolhida.getFullYear();


    const copiaEscolhida = listaDias.reduceRight((acc, item) => {
      const itemDate = new Date(item.Data);

      const itemDay = itemDate.getDate();
      const itemMonth = itemDate.getMonth();
      const itemYear = itemDate.getFullYear();

      if (currentYear === itemYear && currentMonth === itemMonth && currentDay === itemDay) {
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
        return -1;
      } else if (nomeB === "Geral") {
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


      const itemDay = data.getDate();
      const itemMonth = data.getMonth();
      const itemYear = data.getFullYear();

      const currentDay = DataRecebida.getDate();
      const currentMonth = DataRecebida.getMonth();
      const currentYear = DataRecebida.getFullYear();

      if (
        currentYear === itemYear &&
        currentMonth === itemMonth &&
        currentDay === itemDay
      ) {
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

    const date = new Date(values.Data)

    if (date.getDay() === 5) {
      if (horasT > 6) {
        toast.error('Valor inserido excede as 6 Horas!');
      }
    } else {
      if (horasT > 8.5) {
        toast.error('Valor inserido excede as 8 horas e 30 minutos diários!');
      }
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
    let horas = e.target.value;
    // horas example 11:30   i want 11,5
    let timeParts = horas.split(':');

    // Calculate the decimal representation
    let horasNumberChange = parseInt(timeParts[0], 10) + parseFloat(timeParts[1]) / 60;
    let horasNumber = Number(horasNumberChange.toFixed(1));
    let diff = 0;
    if (isNaN(horasNumber) || horasNumber <= 0 || horasNumber === null) {
      horasNumber = 0;
    }

    if (tipoTrabalho === compensacaoID) {
      setHorasExtraAfter(horasExtra - horasNumber)
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
        diff = (newValue - oldValue);
        horasTipoTrabalhoArray[index] = newValue;

        newTipoDeTrabalhoHoras[projectId] = { ...newTipoDeTrabalhoHoras[projectId],    horas: horasTipoTrabalhoArray.join(','), };
        newHorasT = (parseFloat(horasT) + parseFloat(diff)).toFixed(1);
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
      newHorasT = parseFloat(horasT) +  parseFloat(horasNumber);
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

      if (!lastDate?.tipoDeTrabalhoHoras) {
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
        console.error(error)
        return timeString;
      }
    }
    return timeString;
  }

  return (
    <Wrapper>
      <div className="container">
        <div>
          <div className='row'>
            <div className='col-6'>
              <h3>{verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}</h3>
            </div>
            <div className='col-6 text-end'>
              <h4>{horasExtraAfter ? 'Horas extra  ' + convertToMinutes(horasExtraAfter) : ''}</h4>
            </div>
          </div>
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
                      style={{ margin: '5%' }}
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
                              (project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral).split(",").map((t, i) => {
                                const ttID = listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",");
                                let value = "";
                                if(values.tipoDeTrabalhoHoras[project._id]){
                                  const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas.split(",") : [];
                                  const valuesTTTypeArray = values.tipoDeTrabalhoHoras[project._id].tipoTrabalho ? values.tipoDeTrabalhoHoras[project._id].tipoTrabalho.split(",") : [];
                                  
                                  for(let h=0; h< valuesHorasTypeArray.length; h++){
                                    if(valuesTTTypeArray[h] === ttID){
                                      value = valuesHorasTypeArray[h];
                                    }
                                  }
                                }
                                return (
                                  <div className="row mb-3 text-center" key={"NovoDia" + i}>
                                    <div className="col-md-9 text-start themed-grid-col">
                                      <p>{t}</p>
                                    </div>
                                    <div className="col-md-3 themed-grid-col">
                                      <input
                                        type="time" 
                                        min="00:00"
                                        max="24:00"
                                        id="horas"
                                        className="horas"
                                        step="300"
                                        placeholder="00:00"
                                        value={convertToMinutes(value)}
                                        onChange={(e) =>
                                          handleHorasChange(
                                            project._id,
                                            ttID,
                                            project.Nome,
                                            e
                                          )
                                        }

                                      />
                                    </div>
                                  </div>
                                )
                              })
                            )
                            }

                            {project.Nome === "Geral" && (
                              <div className="row mb-3 text-center" key={"Other"}>
                                <div className="col-md-12 text-center themed-grid-col">


                                  <input
                                    id="autocomplete"
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Outro..."
                                    autoComplete="off"
                                  />
                                  <button
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={(e) => { handleTipoTrabalho(e) }}
                                  ><IoAddOutline /> </button>
                                  {inputValue && renderOptions()}
                                </div>
                              </div>
                            )}




                            <div key={"NewDia" + project._id}>
                              {verificaChange && values.tipoDeTrabalhoHoras.length !== 0 && Array.isArray(arrayTipoTrabalho) &&
                                arrayTipoTrabalho.map((item, ID) => {
                                  counter++;
                                  const itemTypeArray = item.tipoTrabalho ? item.tipoTrabalho.split(",") : [];
                                  const matchFound = new Array(itemTypeArray.length + 1).fill(false);

                                  if (project._id === item.projeto) {

                                    const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas.split(",") : [];

                                    matchFoundProjeto[idProjeto] = true;
                                    let counter1 = -1;
                                    return (
                                      <div key={"EditarDia" + ID}>

                                        {(project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral).split(",").map((t, i) =>
                                          itemTypeArray.map((iT, iId) => {

                                            if ((project.Nome !== "Geral" ? ListaTrabalhoAll[i]._id : ListaTrabalhoGeral[i]._id) === iT) {

                                              matchFound[i] = true;
                                              counter1++;

                                              return (
                                                <div className="row mb-3 text-center" key={"EditarDiaTTFound" + iId}>
                                                  <div className="col-md-9 text-start themed-grid-col">

                                                    <p>{t}</p>
                                                  </div>
                                                  <div className="col-md-3 themed-grid-col">
                                                    <input
                                                      type="time"  //time
                                                      min="00:00"
                                                      max="24:00"
                                                      className="horas"
                                                      step="300"
                                                      placeholder="00:00"
                                                      id={`horas-${item._id}`}
                                                      value={
                                                        valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                          ? convertToMinutes(valuesHorasTypeArray[iId])
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
                                                          type="time"
                                                          min="00:00"
                                                          max="24:00"
                                                          step="300"
                                                          placeholder="00:00"
                                                          id={`horas-${item._id}`}
                                                          className="horas"

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

                                        {project.Nome === "Geral" && StringListaTrabalhoGeralOther.length > 0 && StringListaTrabalhoGeralOther.split(",").map((t, i) =>
                                          itemTypeArray.map((iT, iId) => {

                                            if ((project.Nome === "Geral" && ListaTrabalhoGeralOther[i]._id) === iT) {
                                              matchFound[i] = true;
                                              counter1++;
                                              return (
                                                <div className="row mb-3 text-center" key={"EditarDiaTTFound" + iId}>
                                                  <div className="col-md-9 text-start themed-grid-col">
                                                    <p>{t}</p>
                                                  </div>
                                                  <div className="col-md-3 themed-grid-col">
                                                    <input
                                                      type="time"
                                                      min="00:00"
                                                      max="24:00"
                                                      step="300"
                                                      placeholder="00:00"
                                                      id={`horas-${item._id}`}
                                                      className="horas"
                                                      value={
                                                        valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                          ? convertToMinutes(valuesHorasTypeArray[iId])
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
                                            }
                                          }
                                          )
                                        )}
                                      </div>
                                    );
                                  } else {
                                    if (!matchFoundProjeto[idProjeto] && ID === arrayTipoTrabalho.length - 1) {
                                      return (
                                        <div key={"EditarDiaProjetoNotFound" + idProjeto}>
                                          {(project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral).split(",").map((t, i) => {
                                            const ttID = (listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(","))
                                            let value = "";

                                            if(values.tipoDeTrabalhoHoras[project._id]){
                                              const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas.split(",") : [];
                                              const valuesTTTypeArray = values.tipoDeTrabalhoHoras[project._id].tipoTrabalho ? values.tipoDeTrabalhoHoras[project._id].tipoTrabalho.split(",") : [];
                                              
                                              for(let h=0; h< valuesHorasTypeArray.length; h++){
                                                if(valuesTTTypeArray[h] === ttID){
                                                  value = valuesHorasTypeArray[h];
                                                }
                                              }
                                            }
                                            return (
                                              <div className="row mb-3 text-center" key={"EditarDiaProjetoNotFoundList" + i}>
                                                <div className="col-md-9 text-start themed-grid-col" >
                                                  <p>{t}</p>
                                                </div>
                                                <div className="col-md-3 themed-grid-col">
                                                  <input
                                                    type="time"  //time
                                                    min="00:00"
                                                    max="24:00"
                                                    id="horas"
                                                    className="horas"
                                                    step="300"
                                                    placeholder="00:00"


                                                    value={convertToMinutes(value)}
                                                    onChange={(e) =>
                                                      handleHorasChange(
                                                        project._id,
                                                        ttID,
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
                        <h3>{horasP[project._id] !== 0 ? convertToMinutes(horasP[project._id]) : ''}</h3>
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
              <h5 className="card-title">
                Total de horas: {convertToMinutes(horasT)}
                {values?.Data && new Date(values.Data).getDay() === 5
                  ? " | 6:00 H"
                  : values?.Data && (new Date(values.Data).getDay() === 0 || new Date(values.Data).getDay() === 6)
                    ? ""
                    : " | 8:30 H"}
              </h5>

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