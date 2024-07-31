import { useEffect, useState, useCallback } from 'react';

import Wrapper from '../assets/wrappers/addDias';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos1, handleChange } from '../features/allProjetos/allProjetosSlice';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { toast } from 'react-toastify';
import { createDia, getDia, editDia, createDiaDomingo } from '../features/dias/diasSlice';
import { AddHorasCopiar, AddHorasDropdown, AddHorasGeralDropdown, FormRow, useFeriadosPortugal } from '../components';

import Loading from './Loading';
import AddHorasDomingo from './AddHorasDomingo';


const initialState = {
  _id: '',
  Data: new Date().toISOString().slice(0, 10),
  NumeroHoras: '',
  Utilizador: '',
  tipoDeTrabalhoHoras: [],
  loaded: false,
  accepted: 0,
  associated: ''
};



const ListaProjetos = () => {
  const [values, setValues] = useState(initialState);


  const [buttonClicked, setButtonClicked] = useState(false);


  const { isLoading } = useSelector((store) => store.allProjetos);
  const [change, setChange] = useState(0);
  const [projetos, setProjetos] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.utilizador);

  const [sortedProjetos, seTSortedProjetos] = useState([]);
  //const [filteredProjetos, setFilteredProjetos] = useState([]);
  const [horasT, setHorasT] = useState(0);
  const [DataCopy, setDataCopy] = useState("");
  const [copyExists, setCopyExists] = useState(true);

  const [listaDias, setListaDias] = useState([]);

  const [verificaDiaCalled, setVerificaDiaCalled] = useState(false);
  const [verificaChange, setVerificaChange] = useState(false);
  const [verificaCopiarHoras, setVerificaCopiarHoras] = useState(false);
  const [lastDate, setLastDate] = useState();
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);

  const [ListaTrabalhoAll, setListaTrabalhoAll] = useState([]);
  const [ListaTrabalhoGeral, setListaTrabalhoGeral] = useState([]);
  const [ListaTrabalhoGeralOther, setListaTrabalhoGeralOther] = useState([]);
  // const [horasExtra, setHorasExtra] = useState(0);
  const [horasExtra] = useState(0);
  const [horasExtraAfter, setHorasExtraAfter] = useState(0);
  const [activeCompensacao, setActiveCompensacao] = useState(false);
  const [activeFerias, setActiveFerias] = useState(false);

  const [compensacaoID, setcompensacaoID] = useState();
  const [addHorasExtraID, setAddHorasExtraID] = useState();
  const [feriasID, setFeriasID] = useState();
  const [horasExtraTT, setHorasExtraTT] = useState(0);
  const { feriadosPortugal } = useFeriadosPortugal();
  const [startHorasT , setStartHorasT] = useState(values?.NumeroHoras ? values?.NumeroHoras : 0);
  const [constLoaded, setConstLoaded] = useState(false);

  const [modalBoxActive, setModalBoxActive] = useState(false);



  useEffect(() => {
    dispatch(handleChange({ name: 'projetoFinalizado', value: "false" }));
    dispatch(handleChange({ name: 'DataObjetivoC', value: "true" }));
    dispatch(getAllProjetos1("")).then((res) => {
      const projects = Array.isArray(res?.payload?.projetos) ? res?.payload?.projetos : [];
      const projetoGeral = (projects.filter(item => item?.Nome === "Geral"));

      setProjetos(projetoGeral);
    })


    dispatch(getTipoTrabalho()).then((res) => {

      const tipoTrabalhoArray = Array.isArray(res?.payload?.tipoTrabalho) ? res?.payload?.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);

      const compensacao = tipoTrabalhoArray.filter(item => item.tipo === 4);
      const addHorasExtra = tipoTrabalhoArray.filter(item => item.tipo === 5);
      const ferias = tipoTrabalhoArray.filter(item => item.tipo === 7);
      setFeriasID(ferias[0]?._id);
      setAddHorasExtraID(addHorasExtra[0]?._id);
      setcompensacaoID(compensacao[0]?._id);
      setListaTrabalhoAll(tipoTrabalhoArray.filter(item => item.tipo === 1));
      setListaTrabalhoGeral(tipoTrabalhoArray.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 5 || item.tipo === 6|| item.tipo === 7)));
  
      setListaTrabalhoGeralOther(tipoTrabalhoArray.filter(item => item.tipo === 3));

    });


    setConstLoaded(true);

  }, [dispatch]);

  useEffect(() => {

    if (constLoaded && (projetos.length > 0)) {
     
        const dateP = values.Data ? new Date(values.Data) : new Date();
        verificaProjetos(dateP);
    }
  }, [projetos.length, constLoaded]);


  useEffect(() => {
    if (constLoaded && (projetos.length > 0)) {
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

        let dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));

        if(dateRegisterUTC > dayStart){
          dayStart = dateRegisterUTC;
        }

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
                (currentMonth === itemMonth  && currentDay > itemDay)
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

  }, [projetos.length, constLoaded]);

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


      setCopyExists(true);
      setDataCopy({
        DataCopy: copiaEscolhida?.Data,
      });

      setLastDate(copiaEscolhida);

      seTSortedProjetos(sSProjetos);
    } else {

      setCopyExists(false);
    }

  }, [DataCopy]);


  const verificaDia = useCallback((e) => {
    if(constLoaded && (projetos.length > 0)){
    setVerificaCopiarHoras(false);
    const { name, value } = e.target;
    const data = new Date(value);

    const projetosF = getFilteredProjetos(data);
    const sProjetos = projetosF.slice().sort((a, b) => {
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

        if(listaDias[i].accepted === 2){
        setStartHorasT(listaDias[i].NumeroHoras);
      } else{
        setStartHorasT(0);
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

        setHorasT(listaDias[i].NumeroHoras);
        setVerificaChange(true);
        setVerificaDiaCalled(true);
        seTSortedProjetos(sSProjetos);
        return;
      }
    }

    if(horasExtra === 0){
      setHorasExtraTT(0);
    }

    setStartHorasT(0);

    setValues({
      ...values,
      [name]: value,
      NumeroHoras: "",
      accepted: 0,
      tipoDeTrabalhoHoras: [],
    });
    setHorasT(0);
    setVerificaChange(false);
    setVerificaDiaCalled(false);

    seTSortedProjetos(sProjetos)
    return;
  }
  }, [listaDias.length, values.Data, projetos]);


  const verificaProjetos = async (dateP) => {
    const currentDay = dateP.getDate();
    const currentMonth = dateP.getMonth();
    const currentYear = dateP.getFullYear();

    const filteredP = projetos.filter((p) => {
      const dataI = new Date(p.DataInicio);
      if (p.DataFim) {
        const dataF = new Date(p.DataFim);

        const endDay = dataF.getDate();
        const endMonth = dataF.getMonth();
        const endYear = dataF.getFullYear();

       if (
          currentYear > endYear || (currentYear === endYear && currentMonth > endMonth) ||
          (
            currentYear === endYear &&
            currentMonth === endMonth &&
            currentDay >= endDay)
        ) {
          return false;
        }
      } else if (p.Finalizado) {
        return false;
      }


      const startDay = dataI.getDate();
      const startMonth = dataI.getMonth();
      const startYear = dataI.getFullYear();

      if (
        currentYear < startYear || (currentYear === startYear && currentMonth < startMonth) ||
        (
          currentYear === startYear &&
          currentMonth === startMonth &&
          currentDay < startDay)
      ) {
        return false;
      }

      return true;
    });


    //setFilteredProjetos(filteredP);
    return;
  };




  const getFilteredProjetos = useCallback((dateP) => {
    const currentDay = dateP.getDate();
    const currentMonth = dateP.getMonth();
    const currentYear = dateP.getFullYear();
    const filteredP = projetos.filter((p) => {

      const dataI = new Date(p.DataInicio);
      if (p.DataFim) {
        const dataF = new Date(p.DataFim);

        const endDay = dataF.getDate();
        const endMonth = dataF.getMonth();
        const endYear = dataF.getFullYear();

       if (
          currentYear > endYear || (currentYear === endYear && currentMonth > endMonth) ||
          (
            currentYear === endYear &&
            currentMonth === endMonth &&
            currentDay > endDay)
        ) {
          return false;
        }
      } else if (p.Finalizado) {
        return false;
      }

      const startDay = dataI.getDate();
      const startMonth = dataI.getMonth();
      const startYear = dataI.getFullYear();

      if (
        currentYear < startYear || (currentYear === startYear && currentMonth < startMonth) ||
        (
          currentYear === startYear &&
          currentMonth === startMonth &&
          currentDay < startDay)
      ) {
        return false;
      }

      return true;
    });

    return filteredP;
  }, [projetos.length]);

  useEffect(() => {
    if(projetos.length > 0){
      verificaDia({ target: { name: 'Data', value: values.Data } });       
    }
  }, [DataCopy]);


  const handleCloseModal = ()=>{
    setButtonClicked(false);
    setModalBoxActive(false);
   }
  
   const handleConfirm = async  (Data)=>{
      values.accepted = 1;
      values.Utilizador = user.user.id;
      values.associated = Data
      await dispatch(createDiaDomingo(values));

      toast.error('Horas Inseridas num Domingo!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      
   }

   const checkDate = (dataChoosen)=>{
    const data = new Date(dataChoosen);
      
    const itemDay = data.getDate();
    const itemMonth = data.getMonth();
    const itemYear = data.getFullYear();


    for (let i = 0; i < listaDias.length; i++) {
      const DataRecebida = new Date(listaDias[i].Data);


      const currentDay = DataRecebida.getDate();
      const currentMonth = DataRecebida.getMonth();
      const currentYear = DataRecebida.getFullYear();


      if (
        currentYear === itemYear &&
        currentMonth === itemMonth &&
        currentDay === itemDay
      ) {      
        return true;
      } 
    }

    return false;
    
   }


   
  const handleDia = async (e) => {
    setButtonClicked(true);
    e.preventDefault();
    
    const date = new Date(values.Data)

    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let count = 0;

    if(values.accepted !== 2) {
    if (horasT <= 0) {
      toast.error('Valor inserido invalido!');
      return;
    } else if(feriadosPortugal(date)){

        count++;
        toast.error('Horas inseridas num Feriado!');
    }else if(isWeekend){

      count++;
      if(!dayOfWeek === 0 || horasT < 8)
        {
          toast.error('Horas inseridas num fim de semana!');
        }
    } else if (date.getDay() === 5) {
      if (horasT > 6) {
        count++;
        toast.error('Valor inserido excede as 6 Horas!');
      }
    } else if (horasT > 8.5) {

      count++;
      toast.error('Valor inserido excede as 8 horas e 30 minutos diárias!');
    }
    


    if(activeCompensacao === true){
        for (let key in values.tipoDeTrabalhoHoras) {
          const horasTipoTrabalhoArray = values.tipoDeTrabalhoHoras[key]?.horas?.split(',') || [];
          const tipoTrabalhoArray = values.tipoDeTrabalhoHoras[key]?.tipoTrabalho?.split(',') || [];
          for (let a = 0; a < tipoTrabalhoArray.length; a++) {
          if((tipoTrabalhoArray[a] === compensacaoID) && (horasTipoTrabalhoArray[a] > 0)){
            toast.error('Pedido de compensação de horas extra realizado!');
            count++;
          }
        }
      }
    }

    if(activeFerias === true){
      for (let key in values.tipoDeTrabalhoHoras) {
        const horasTipoTrabalhoArray = values.tipoDeTrabalhoHoras[key]?.horas?.split(',') || [];
        const tipoTrabalhoArray = values.tipoDeTrabalhoHoras[key]?.tipoTrabalho?.split(',') || [];
        for (let a = 0; a < tipoTrabalhoArray.length; a++) {
        if((tipoTrabalhoArray[a] === feriasID) && (horasTipoTrabalhoArray[a] > 0)){
          toast.error('Pedido de Ferias realizado!');
          count++;
        }
      }
    }
  }

    if(count === 0 ){
      values.accepted = 0;
    } else{
      // Laboratori Acceptance 8
      values.accepted = 8;
    } 
  }
    


    for (let key in values.tipoDeTrabalhoHoras) {
      //const tt = values.tipoDeTrabalhoHoras[key];
      const horasTipoTrabalhoArray = values.tipoDeTrabalhoHoras[key]?.horas?.split(',') || [];
      const tipoTrabalhoArray = values.tipoDeTrabalhoHoras[key]?.tipoTrabalho?.split(',') || [];
      for (let a = horasTipoTrabalhoArray.length - 1; a >= 0; a--) {
          if (horasTipoTrabalhoArray[a] <= 0) {
              horasTipoTrabalhoArray.splice(a, 1);
              tipoTrabalhoArray.splice(a, 1);
          }
      }
  
      values.tipoDeTrabalhoHoras[key].horas = horasTipoTrabalhoArray.join(',');
      values.tipoDeTrabalhoHoras[key].tipoTrabalho = tipoTrabalhoArray.join(',');
  }

  if(dayOfWeek === 0 && horasT >= 8)
    {
      setValues(values)
      setModalBoxActive(true);
    }else{
      
      values.Utilizador = user.user.id;

      if (verificaDiaCalled) {
        await dispatch(editDia(values));
      } else {
        await dispatch(createDia(values));
      }
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }



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
    const maxHoras = dateAdd.getDay() === 5 ? 6 : 8.5;
    if (tipoTrabalhoArray.find(item => item ===  compensacaoID)) {
      setActiveCompensacao(true);
      if (values?.Data && (newHorasT > maxHoras || dateAdd.getDay() === 0 || dateAdd.getDay() === 6)) {
        toast.error('Valor inserido invalido devido ao tipo de trabalho!');

        let tipoDeTrabalhoHoras = {};
        tipoDeTrabalhoHoras[projectId] = {
          horas: maxHoras.toString(),
          tipoTrabalho: compensacaoID,
        };

        setValues({
          ...values,
          Utilizador: user.user.login,
          NumeroHoras: maxHoras,
          horas: maxHoras,
          tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
        });
        setHorasT(maxHoras);

        const c =change+ 1;
        setChange(c);
        setHorasExtraAfter(horasExtraBeforeValue);
        return;
      }
      
      setHorasExtraAfter(parseFloat(horasExtra) - parseFloat(horasNumber))
    }

    if (tipoTrabalhoArray.find(item => item === feriasID)) {
      setActiveFerias(true);
      if (values?.Data && (newHorasT > maxHoras)) {
        toast.error('Valor inserido invalido devido ao tipo de trabalho!');

        let tipoDeTrabalhoHoras = {};
        tipoDeTrabalhoHoras[projectId] = {
          horas: maxHoras.toString(),
          tipoTrabalho: feriasID,
        };

        setValues({
          ...values,
          Utilizador: user.user.login,
          NumeroHoras: maxHoras,
          horas: maxHoras,
          tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
        });
        setHorasT(maxHoras);

        const c =change+ 1;
        setChange(c);
        setHorasExtraAfter(horasExtraBeforeValue);

        return;
      }
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

      setHorasT(lastDate.NumeroHoras);
      setVerificaChange(true);
      seTSortedProjetos(sSProjetos);
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
      } catch {

        return timeString;
      }
    }

    return "00:00";
  }
  
  if (!values.loaded || (sortedProjetos.length === 0) || isLoading) {
    return <Loading />;
  } else {

    return (
      <Wrapper>
        {sortedProjetos && sortedProjetos.length > 0 &&
        <div className="container">
        {modalBoxActive &&           
        <AddHorasDomingo
              handleDateChoosen={handleConfirm}
              handleClose={handleCloseModal}
              state={true} 
              dataReceived={values.Data ? new Date(values.Data).toLocaleDateString('en-CA') : ''}
              feriadosPortugal={feriadosPortugal}
              checkDate={checkDate}
          /> }

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

          <AddHorasGeralDropdown
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
            change={change}
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
                  disabled={(values.accepted === 2 && startHorasT >= 8.5) || isLoading || buttonClicked ||  (values.accepted === 4 || values.accepted === 5)}

                  onClick={(e) => { handleDia(e) }}
                  className="w-100 btn btn-lg btn-primary"
                >
                  {isLoading ? 'loading...' : verificaDiaCalled ? 'Editar Dia' : 'Guardar Dia'}
                </button>
              </div>
            </div>
          </div>
        </div>
            }
      </Wrapper>
    );
  }
}

export default ListaProjetos;



