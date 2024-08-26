import Wrapper from '../assets/wrappers/FormRowListaTipoTrabalho';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types'; 

//import { useSelector, useDispatch } from 'react-redux';
//import LoadingSmaller from './LoadingSmaller';

const FormRowListaHorasExtra = ({ type, value, tipoHoras, utilizadores, changed }) => {
  const id = `myTextarea${type}${value}`;
  const [initialDate, setInitialDate] = useState([]);
  const [initialName, setName] = useState([]);
  //const [feriados, setFeriados] = useState([]);
  const [horasExtra, setHorasExtra] = useState([]);
  const [compensacao, setCompensacao] = useState(false);
  const [ferias, setFerias] = useState(false);
  const [associated, setAssociated] = useState([])
  const [tipo, setTipo] = useState([]);

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
    //setFeriados(feriados);
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

  const toLocalDate = (dateStr) => {
    const date = new Date(dateStr);
    // Reset the time to midnight and set to local timezone
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };


  const verificaListaDias = useCallback((datesReceived) => {
    datesReceived.sort((a, b) => new Date(a.Data) - new Date(b.Data));
    const startDate = new Date(datesReceived[0].Data);
    const endDate = new Date(datesReceived[datesReceived.length -1].Data);

    const dates = [];

    // Create a date instance for iterating
    let currentDate = new Date(startDate);
    let count = 0;
    while (toLocalDate(currentDate) <= toLocalDate(endDate)) {
      // Check if the current day is a weekday (not Saturday or Sunday)
      const dayOfWeek = currentDate.getDay();

      if(!dates[count]){
        dates[count] = [];
      }
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !feriadosPortugal(currentDate) && (datesReceived.some(item => (new Date (item.Data)).getDate() === currentDate.getDate())) ) {
        // Check if the current date is already in listaDias
        dates[count].push(new Date(currentDate));
    } else{
      if(dates[count]?.length > 0){
        count++;
      }

    }

  
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
   }
    return dates;
  }, []);


  //let data = new Date()

  useEffect(() => {

    if(value?.length > 0){
      const dates = verificaListaDias(value);
      setHorasExtra(value.length);
      setTipo("Férias");
      setFerias(true);

      if (utilizadores && utilizadores.length > 0) {
        utilizadores.filter((user) => {
          if (user._id === value[0]?.Utilizador) {
            setName(user?.nome);
          }
          return false;
        })
      }

        let data = "";
        try {
  
        if(dates.length > 0){
          for(let i = 0; i< dates.length; i++){
            const startDate = new Date(dates[i][0]);
            const endDate = new Date(dates[i][dates[i].length - 1]);


            const dataDay = startDate.getDate();
            const dataMonth = startDate.getMonth() + 1;
            const dataYear = startDate.getFullYear();

            const dataDayEnd = endDate.getDate();
            const dataMonthEnd = endDate.getMonth() + 1;
            const dataYearEnd = endDate.getFullYear();

            if(dates[i].length > 1){

              data += dataDay + "/" + dataMonth + "/" + dataYear + " || " + dataDayEnd + "/" + dataMonthEnd + "/" + dataYearEnd + '<br />';

            } else{
     
              data += dataDay + "/" + dataMonth + "/" + dataYear + '<br />' ;
            }

          }


          
        } else{
          const fullData = new Date(dates[0])

          const dataDay = fullData.getDate();
          const dataMonth = fullData.getMonth() + 1;
          const dataYear = fullData.getFullYear();

          data = dataDay + "/" + dataMonth + "/" + dataYear;
        }
      } catch (error) {
            console.error(error)
      }

        setInitialDate(data)
      
    } else{

  

    const fullData = new Date(value?.Data)
    const dataDay = fullData.getDate();
    const dataMonth = fullData.getMonth() + 1;
    const dataYear = fullData.getFullYear();


    let countF = 0;
    let countC = 0;
    const dayOfWeek = fullData.getDay();

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isDomingo = dayOfWeek === 0;
    const isFriday = dayOfWeek === 5;

    if (feriadosPortugal(fullData)) {
      setHorasExtra(value?.NumeroHoras);
      setCompensacao(false);
      setTipo("Feriado");

    } else if (isWeekend) {
      setHorasExtra(value?.NumeroHoras);
      setCompensacao(false);

      if (isDomingo) {
        setTipo("Domingo");
      } else {
        setTipo("Fim semana");
      }

    } else if (isFriday && (parseFloat(value?.NumeroHoras) > 6)) {
      const horasExtraVal = parseFloat(value?.NumeroHoras) - 6;
      setHorasExtra(horasExtraVal);
      setCompensacao(false);
      setTipo("Sexta-Feira");

    } else if (!isFriday && (parseFloat(value?.NumeroHoras) > 8.5)) {
      const horasExtraVal = parseFloat(value?.NumeroHoras) - parseFloat(8.5);
      setHorasExtra(horasExtraVal);
      setCompensacao(false);
      setTipo("Semana");

    } else {

      ///////////////////////////////////////////////// Alterar para ID do tipo de Trabalho mas está a receber o Nome da Base de Dados ////////////////////////////////////////////////////////
      let count = 0;
  
      for (let j = 0; j < value?.tipoDeTrabalhoHoras?.length; j++) {
        const tt = value.tipoDeTrabalhoHoras[j];
        const tipoT = tt.tipoTrabalho.split(',');
        const hours = tt.horas.split(',');

        for (let g = 0; g < tipoT.length; g++) {
          if (tipoT[g].trim() === "Compensação de Horas Extra") {
            count += hours[g];
            countC++;
            setCompensacao(true);
          } else if ( tipoT[g].trim() === "Ferias"){
            countF++;
            setFerias(true);
          }
        }
      }
      if (count === 0) {
        count = value?.NumeroHoras;
      }
      if(countF > 0){
        setHorasExtra(1);
        setTipo("Férias");
      } else{
        setHorasExtra("-" + count);
        setTipo("");
      }


    }

    if(countC === 0){
      setCompensacao(false);
    }
    if(countF === 0){
      setFerias(false);
    }

    const substring = '"';
    const found = value?.associated?.includes(substring);
    if (value?.associated && value?.associated?.length > 0 && found) {
      try {
        const jsonObject = JSON.parse(value?.associated);
        for (let i = 0; i < jsonObject.length; i++) {

          const assData = new Date(jsonObject[i].Data);
          const assDay = assData.getDate();
          const assMonth = assData.getMonth() + 1;
          const assYear = assData.getFullYear();

          const assNewData = assDay + "/" + assMonth + "/" + assYear;

          jsonObject[i].Data = assNewData;
        }


        setAssociated(jsonObject);

      } catch (error) {
        console.error(error)
      }
    } else{
      setAssociated([]);
    }

    if (utilizadores && utilizadores.length > 0) {
      utilizadores.filter((user) => {
        if (user._id === value?.Utilizador) {
          setName(user?.nome);
        }
        return false;
      })


    }


    const data = dataDay + "/" + dataMonth + "/" + dataYear
    setInitialDate(data)
  }
  }, [id, changed, horasExtra, initialName, initialDate, compensacao, tipo]);


  function convertToMinutes(timeString) {

    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");
        const hoursInt = parseInt(hours, 10) ? parseInt(hours, 10) : "";
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
    return " — ";
  }


  return (
    <Wrapper>
      <div className="row mb-3" >
        <div className={"col-md-2 text-center"}>
          <p>{initialName}</p>
        </div>
        <div className={tipo === "Férias" ? "col-md-4 text-center" : "col-md-2 text-center"}>
          <p dangerouslySetInnerHTML={{ __html: initialDate }} />
        </div>
        <div className="col-md-1 text-center">
          <p>{tipo === "Férias"  ? " — " :convertToMinutes(value?.NumeroHoras)}</p>
        </div>
        <div className="col-md-2 text-center" >
          {tipo === "Férias"  ? 
          (<p style={{ backgroundColor: compensacao ? "#E8FCCF" : ferias ? "#B7B5E4" : "" }}>{horasExtra}</p>)
           :(
          <p style={{ backgroundColor: compensacao ? "#E8FCCF" : ferias ? "#B7B5E4" : "" }}>{convertToMinutes(horasExtra)}</p>
        )}
        </div>
        {(tipoHoras !== 3) && (
          <div className="col-md-1 text-center" >
            <p>{tipo}</p>
          </div>
        )}
        {tipo !== "Férias" && 
        <div className={tipoHoras !== 3 ?  "col-md-4 text-center" : "col-md-5 text-center"}>
          {value?.tipoDeTrabalhoHoras?.map((t, index) => {
            const project = t.projeto;
            const tipoT = t.tipoTrabalho.split(',');
            const hours = t.horas.split(',');
            return (
              <div key={`${index}`} className='row' >
                <div className='col-md-12'>
                  <h5>{project.trim()}</h5>
                </div>
                {tipoT.map((tt, j) => (
                  <div key={`${index}_${j}`} className='row'>
                    <div className='col-md-8'>
                      <p>{tt.trim()}</p>
                    </div>
                    <div className='col-md-4 text-center'>
                      <p>{convertToMinutes(hours[j].trim())}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        }
      </div>

      {associated && associated.length > 0 && associated.map((diaAss, i) => (
        <div key={diaAss + "_" + i}>
          <div className="row mb-3" >
            <div className={"col-md-2 text-center"}>
            </div>
            <div className="col-md-2 text-center">
              <p>{diaAss.Data}</p>
            </div>
            <div className="col-md-1 text-center">
              <p>{convertToMinutes(diaAss?.NumeroHoras)}</p>
            </div>
            <div className="col-md-2 text-center"></div>
            <div className="col-md-2 text-start" >
              <p>Compensação Domingo </p>
            </div>

          </div>
        </div>
      ))
      }
    </Wrapper>
  );
};

FormRowListaHorasExtra.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired
  ]).isRequired,
  tipoHoras: PropTypes.number.isRequired,
  handleChange: PropTypes.func,
  utilizadores: PropTypes.array.isRequired,
  changed: PropTypes.bool.isRequired,
}


export default FormRowListaHorasExtra;
