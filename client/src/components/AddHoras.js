import React, { useEffect, useState, useCallback } from 'react';

import Wrapper from '../assets/wrappers/addDias';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos1, handleChange } from '../features/allProjetos/allProjetosSlice';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { toast } from 'react-toastify';
import { createDia, getDia, editDia } from '../features/dias/diasSlice';
import { AddHorasCopiar, AddHorasDropdown, FormRow, useFeriadosPortugal } from '../components';

import Loading from './Loading';




const initialState = {
  _id: '',
  Data: new Date().toISOString().slice(0, 10),
  NumeroHoras: '',
  Utilizador: '',
  tipoDeTrabalhoHoras: [],
  loaded: false,
  accepted: 0,
};



const ListaProjetos = () => {
  const [values, setValues] = useState(initialState);


  const [buttonClicked, setButtonClicked] = useState(false);


  const { projetos, isLoading, } = useSelector((store) => store.allProjetos);

  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.utilizador);


  const [sortedProjetos, seTSortedProjetos] = useState([])
  const [horasT, setHorasT] = useState(0);
  const [DataCopy, setDataCopy] = useState("");
  const [copyExists, setCopyExists] = useState(true);

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
  const [activeCompensacao, setActiveCompensacao] = useState(false);

  const [compensacaoID, setcompensacaoID] = useState();
  const [addHorasExtraID, setAddHorasExtraID] = useState();
  const [horasExtraTT, setHorasExtraTT] = useState(0);
  const { feriadosPortugal } = useFeriadosPortugal();

  const [constLoaded, setConstLoaded] = useState(false);

  useEffect(() => {
    dispatch(handleChange({ name: 'projetoFinalizado', value: "false" }));
    dispatch(handleChange({ name: 'DataObjetivoC', value: "true" }));
    dispatch(getAllProjetos1(""))


    dispatch(getTipoTrabalho()).then((res) => {

      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);

      const compensacao = tipoTrabalhoArray.filter(item => item.tipo === 4);
      const addHorasExtra = tipoTrabalhoArray.filter(item => item.tipo === 5);
      setAddHorasExtraID(addHorasExtra[0]?._id);
      setcompensacaoID(compensacao[0]?._id);
      setListaTrabalhoAll(tipoTrabalhoArray.filter(item => item.tipo === 1));
      setListaTrabalhoGeral(tipoTrabalhoArray.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 5)));
  
      setListaTrabalhoGeralOther(tipoTrabalhoArray.filter(item => item.tipo === 3));
    });


    setConstLoaded(true);

  }, []);


  useEffect(() => {
    if (constLoaded) {
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

    }
  }, [projetos]);


  useEffect(() => {
    if (constLoaded) {

        const timestampString = user?.user?.timestamp;
        let dateRegisterUTC = new Date()
        if (timestampString) {
          const timestamp = Date.parse(timestampString); 
          if (!isNaN(timestamp)) {
              const dateRegister = new Date(timestamp);
              dateRegisterUTC = new Date(dateRegister.toUTCString());
          } else {
              console.error("Invalid timestamp string format.");
          }
      } else {
          console.error("Timestamp string is missing or invalid.");
      }

      dispatch(getDia(values.Data, user.user.id)).then((res) => {
        const lista = res.payload.dia
        setListaDias(lista);

        const projetoGeral = (filteredProjetos.filter(item => item.Nome === "Geral"));
        let countHours = 0;


        let dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));

        if(dateRegisterUTC > dayStart){
          dayStart = dateRegisterUTC;
        }



        const startDay = dayStart.getDate();
        const startMonth = dayStart.getMonth();
        const startYear = dayStart.getFullYear();

        lista.filter(item => {
          const date = new Date(item.Data)
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
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
              currentDay >= startDay)
          ) {

            let extraHours = 0;

            for (let i = 0; i < item.tipoDeTrabalhoHoras.length; i++) {
              const projeto = item.tipoDeTrabalhoHoras[i]
              
              if (projeto.projeto === projetoGeral[0]?._id) {
                const tt = projeto.tipoTrabalho.split(',') || [];
                const ttH = projeto.horas.split(',') || [];

                for (let j = 0; j < tt.length; j++) {
                  if (tt[j] === compensacaoID) {
                    countHours -= parseFloat(ttH[j]);
                  }
                  if (tt[j] === addHorasExtraID) {
                    countHours += parseFloat(ttH[j]);
                    extraHours = parseFloat(ttH[j]);
                  }
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

          return;
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

        if(dateRegisterUTC > currentDate){
          currentDate = dateRegisterUTC;
        }

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
              while(feriadosPortugal(currentDate)) {
                currentDate.setDate(currentDate.getDate() + 1);
              }
              const itemDay = targetDate.getDate();
              const itemMonth = targetDate.getMonth();
              const itemYear = targetDate.getFullYear();

              const currentDay = currentDate.getDate();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();

              if (
                currentYear > itemYear ||
                currentMonth > itemMonth ||
                (currentMonth == itemMonth  && currentDay > itemDay)
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
            loaded: true,
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
            loaded: true,
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
    }
  }, [filteredProjetos]);



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

  }, [DataCopy, filteredProjetos]);


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
    const data = new Date(value);
    let horasExtra = 0;
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


          const projeto = listaDias[i].tipoDeTrabalhoHoras[j]
          const tt = projeto.tipoTrabalho.split(',') || [];
          const ttH = projeto.horas.split(',') || [];

          for (let h = 0; h < tt.length; h++) {
            if (tt[h] === addHorasExtraID) {
              horasExtra = ttH[h];
              setHorasExtraTT(horasExtra);
            }
          }
        }

        setValues({
          ...values,
          [name]: value,
          _id: listaDias[i]._id,
          Utilizador: user.user.login,
          NumeroHoras: listaDias[i].NumeroHoras,
          tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
          accepted: listaDias[i].accepted,
        });
        seTSortedProjetos(sSProjetos);

        setHorasT(listaDias[i].NumeroHoras);
        setVerificaChange(true);
        setVerificaDiaCalled(true);
        return;
      }
    }

    if(horasExtra === 0){
      setHorasExtraTT(0);
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
  }, [listaDias, filteredProjetos, filteredProjetos, values.Data]);

  
  useEffect(() => {
    verificaDia({ target: { name: 'Data', value: values.Data } });
  }, [verificaDia]);


  const handleDia = async (e) => {
    setButtonClicked(true);
    e.preventDefault();
    
    const date = new Date(values.Data)

    if (date.getDay() === 5) {
      if (horasT > 6) {
        values.accepted = 1;
        toast.error('Valor inserido excede as 6 Horas!');
      }
    } else {
      if (horasT > 8.5) {
        values.accepted = 1;
        toast.error('Valor inserido excede as 8 horas e 30 minutos diários!');
      }
    }
    if (horasT <= 0) {
      toast.error('Valor inserido invalido!');
      return;
    } 

    if(activeCompensacao === true){
      values.accepted = 1;
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
    const newTipoDeTrabalhoHoras = { ...values.tipoDeTrabalhoHoras };
    const horasTipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.horas?.split(',') || [];
    const tipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.tipoTrabalho?.split(',') || [];

    let horas = e;

    let timeParts = horas.split(':');
    let horasExtraTTCheck = false;
    let horasExtraNumber = horasExtraTT;
    let horasExtraBeforeValue = horasExtraTT;

    // Calculate the decimal representation
    let horasNumberChange = parseInt(timeParts[0], 10) + parseFloat(timeParts[1]) / 60;
    let horasNumber = Number(horasNumberChange.toFixed(2));
    let diff = 0;
    if (isNaN(horasNumber) || horasNumber <= 0 || horasNumber === null) {
      horasNumber = 0;
    }

    for (let h = 0; h < tipoTrabalhoArray.length; h++) {
      if (tipoTrabalhoArray[h] === addHorasExtraID) {
        horasExtraNumber = parseFloat(horasTipoTrabalhoArray[h]);
        horasExtraBeforeValue = parseFloat(horasTipoTrabalhoArray[h]);
      }
    }

    if (tipoTrabalhoArray.includes(tipoTrabalho)) {

      const index = tipoTrabalhoArray.indexOf(tipoTrabalho);
      const oldValue = Number(horasTipoTrabalhoArray[index]);
      const newValue = horasNumber;

      if (oldValue !== newValue) {
        diff = (newValue - oldValue);
        horasTipoTrabalhoArray[index] = newValue;

        newTipoDeTrabalhoHoras[projectId] = { ...newTipoDeTrabalhoHoras[projectId], horas: horasTipoTrabalhoArray.join(','), };
        newHorasT = (parseFloat(horasT) + parseFloat(diff)).toFixed(2);
      }

    } else {
      tipoTrabalhoArray.push(tipoTrabalho);
      horasTipoTrabalhoArray.push(horasNumber);
      newTipoDeTrabalhoHoras[projectId] = {
        ...newTipoDeTrabalhoHoras[projectId],
        tipoTrabalho: tipoTrabalhoArray.join(','),
        horas: horasTipoTrabalhoArray.join(',')
      };
      newHorasT = parseFloat(horasT) + parseFloat(horasNumber);
    }


    const dateAdd = new Date(values?.Data);

    const dayOfWeek = dateAdd.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFriday = dayOfWeek === 5;

    if (tipoTrabalho === compensacaoID) {
      setActiveCompensacao(true);
      if (values?.Data && ((dateAdd.getDay() === 5 && newHorasT > 6) || newHorasT > 8.5 || dateAdd.getDay() === 0 || dateAdd.getDay() === 6)) {
        toast.error('Valor inserido invalido devido ao tipo de trabalho!');
        setValues({ ...values, [horas]: "0.0" });
        return;
      }
      
      setHorasExtraAfter(parseFloat(horasExtra) - parseFloat(horasNumber))
    }


    if (tipoTrabalho === addHorasExtraID) {
      horasExtraTTCheck = true;
      horasExtraNumber = horasNumber;
      setHorasExtraTT(horasExtraNumber);
    }
 

    if (horasExtraTTCheck || horasExtraNumber > 0) {
      if ((parseFloat(newHorasT) - parseFloat(horasExtraNumber)) > 24) {
        toast.error('Valor inserido excede as 24 Horas!');
        setValues({ ...values, [horas]: "0.0" });
        return;
      }
    } else {
      if (parseFloat(newHorasT) > 24) {
        toast.error('Valor inserido excede as 24 Horas!');
        setValues({ ...values, [horas]: "0.0" });
        return;
      }
    }


    let horasExtraValue = 0;
    if (parseFloat(horasT) > parseFloat(newHorasT)) {

      let horas = (parseFloat(newHorasT) - parseFloat(horasExtraNumber));
      //let horasExtraBefore = 0;
      let horasExtraExtract = 0;
      if (tipoTrabalho === addHorasExtraID) {
        horasExtraValue = parseFloat(horasExtraAfter) + (parseFloat(horasNumber) - parseFloat(horasExtraBeforeValue));
        setHorasExtraAfter(horasExtraValue);
      }
      
      else if (isFriday && ((parseFloat(horasT) - parseFloat(horasExtraNumber))) > 6) {
        //horasExtraBefore = parseFloat(horasT) - 6;
        horasExtraExtract = parseFloat(newHorasT) - parseFloat(horasT);

        if (horas >= 6) {
          horasExtraValue = parseFloat(horasExtraAfter) + parseFloat(horasExtraExtract);
        } else {
          let sub = 6 - parseFloat(horas);
          horasExtraValue = parseFloat(horasExtraAfter) + (parseFloat(horasExtraExtract) + parseFloat(sub));
        }
        setHorasExtraAfter(horasExtraValue);

      } else if (isWeekend || feriadosPortugal(dateAdd)) {
        const horasAddExtra = parseFloat(horasT) - parseFloat(newHorasT);
        horasExtraValue = parseFloat(horasExtraAfter) - parseFloat(horasAddExtra);

        setHorasExtraAfter(horasExtraValue);
      } else if ((parseFloat(horasT) - parseFloat(horasExtraNumber)) > 8.5) {
        horasExtraExtract = parseFloat(newHorasT) - parseFloat(horasT);

        if (horas >= 8.5) {
          horasExtraValue = parseFloat(horasExtraAfter) + parseFloat(horasExtraExtract);
        } else {
          let sub = 8.5 - horas;
          horasExtraValue = parseFloat(horasExtraAfter) + (parseFloat(horasExtraExtract) + parseFloat(sub));
        }
        setHorasExtraAfter(horasExtraValue);
      }
    } else {
      let horas = (parseFloat(newHorasT)- parseFloat(horasExtraNumber));

      if (tipoTrabalho === addHorasExtraID) {
        if(horasExtraAfter > 0){
          horasExtraValue = parseFloat(horasExtraAfter) + (parseFloat(horasNumber) - parseFloat(horasExtraBeforeValue));
        }
        else{
        horasExtraValue = parseFloat(horasExtra) + (parseFloat(horasNumber) - parseFloat(horasExtraBeforeValue));
        }
        setHorasExtraAfter(horasExtraValue);
        
      } else if (isFriday && (parseFloat(newHorasT) - parseFloat(horasExtraNumber)) > 6) {
        if(horasExtraNumber > 0){
          horasExtraValue = parseFloat(horasExtraNumber) + parseFloat(horas - 6);
        }else{
          horasExtraValue = parseFloat(horasExtra) + parseFloat(newHorasT - 6);
        }
        setHorasExtraAfter(horasExtraValue);
      } else if (isWeekend || feriadosPortugal(dateAdd)) {
        horasExtraValue = parseFloat(horasExtra) + parseFloat(newHorasT);
        setHorasExtraAfter(horasExtraValue);
      } else if ((newHorasT - parseFloat(horasExtraNumber)) > 8.5) {
        if(horasExtraNumber > 0){
          horasExtraValue = parseFloat(horasExtraNumber) + parseFloat(horas -  8.5);
        }else{
          horasExtraValue = parseFloat(horasExtra) + parseFloat(newHorasT - 8.5);
        }
        setHorasExtraAfter(horasExtraValue);
      }
    }


    setValues({
      ...values,
      horas: horasNumber,
      NumeroHoras: newHorasT,
      tipoDeTrabalhoHoras: newTipoDeTrabalhoHoras
    });

    setHorasT(newHorasT);
  };


  const copiar = async (value) => {

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



  const matchFoundProjeto = new Array(sortedProjetos.length).fill(false);
  const arrayTipoTrabalho = Object.entries(values.tipoDeTrabalhoHoras).map(([key, value]) => ({ _id: key, ...value }));

  function convertToMinutes(timeString) {
    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");

        // Convert the hours to an integer
        const hoursInt = parseInt(hours, 10);
        // Convert the fraction of an hour to minutes
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


  if (!values.loaded) {
    return <Loading />;
  } else if (isLoading) {
    return <Loading />;
  } else {

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
                <AddHorasCopiar
                  copiar={copiar}
                  verificaCopiarHoras={verificaCopiarHoras}
                  copyExists={copyExists}
                  DataCopy={DataCopy}
                  verificaDiaLast={verificaDiaLast}
                  buttonClicked={buttonClicked}
                  handleDia={handleDia}
                />

              </div>
              {(() => {
                const date = new Date(values.Data);
                const dayStart = new Date(Date.UTC(2023, 11, 10, 0, 0, 0));

                const dateDay = date.getDate();
                const dateMonth = date.getMonth();
                const dateYear = date.getFullYear();

                const startDay = dayStart.getDate();
                const startMonth = dayStart.getMonth();
                const startYear = dayStart.getFullYear();
                if ((dateMonth < startMonth && dateYear <= startYear) || (dateDay <= startDay && dateMonth === startMonth)) {
                  return (
                    <div className='text-center'>
                      <p>Adicione horas extras acumuladas em <b>Geral</b> &rarr; <b>Adicionar Horas Extras</b> entre <b>01/12/2023 e 10/12/2023</b></p>
                    </div>
                  );
                }
                return <></>;
              })()}
            </div>
          </div>
          <div className="list-group mx-1 w-auto">

            <AddHorasDropdown
              sortedProjetos={sortedProjetos}
              verificaChange={verificaChange}
              listaTipoTrabalho={listaTipoTrabalho}
              values={values}
              handleHorasChange={handleHorasChange}
              convertToMinutes={convertToMinutes}
              arrayTipoTrabalho={arrayTipoTrabalho}
              matchFoundProjeto={matchFoundProjeto}
              ListaTrabalhoAll={ListaTrabalhoAll}
              ListaTrabalhoGeral={ListaTrabalhoGeral}
              ListaTrabalhoGeralOther={ListaTrabalhoGeralOther}
              setListaTipoTrabalho={setListaTipoTrabalho}
              setListaTrabalhoGeral={setListaTrabalhoGeral}
              setListaTrabalhoGeralOther={setListaTrabalhoGeralOther}
            />

            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">
                  Total de horas: {convertToMinutes((parseFloat(horasT) - parseFloat(horasExtraTT)))}
                  { values?.Data && (new Date(values.Data).getDay() === 0 || new Date(values.Data).getDay() === 6 || feriadosPortugal(new Date(values.Data)))
                  ? ""
                  : values?.Data && new Date(values.Data).getDay() === 5
                      ? " | 6:00 H"
                      : " | 8:30 H"}
                </h5>
              </div>
              
              <div className="card-body">
                <button
                  type="submit"
                  disabled={values.accepted === 2 || isLoading || buttonClicked }
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
}

export default ListaProjetos;



