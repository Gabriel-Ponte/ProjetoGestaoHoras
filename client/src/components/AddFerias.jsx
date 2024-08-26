import { memo, useState, useEffect, useCallback } from 'react';
import { FormRow, useFeriadosPortugal } from '../components';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarFerias } from '../features/dias/diasSlice';



const AddFerias = ({ setAddFerias, verificaDia, Data, listaDias, projetos, accepted }) => {


  const { feriadosPortugal } = useFeriadosPortugal();
  const [fimFerias, setFimFerias] = useState(Data);
  const [selectedDates, setSelectedDates] = useState([]);
  const [stringDates, setStringDates] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.utilizador);

  useEffect(() => {
    verificaListaDias(Data, Data);
    
  }, []);

  const verificaData = useCallback((e) => {
    const inData = new Date(e?.target?.value);
    const fData = new Date(fimFerias);
    e.target.name = "Data";
    if (inData > fData) {
      setFimFerias(e?.target?.value)
      verificaListaDias(e?.target?.value, e?.target?.value);
      verificaDia(e);


    } else {
      verificaListaDias(e?.target?.value, fimFerias);
      verificaDia(e);
    }


  }, [listaDias?.length, Data, fimFerias, projetos]);



  const toLocalDate = (dateStr) => {
    const date = new Date(dateStr);
    // Reset the time to midnight and set to local timezone
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };


  const verificaListaDias = useCallback((dateInicio, dateFim) => {

    const startDate = new Date(dateInicio);
    const endDate = new Date(dateFim);
    const dates = [];

    // Create a date instance for iterating
    let currentDate = new Date(startDate);

    while (toLocalDate(currentDate) <= toLocalDate(endDate)) {
      // Check if the current day is a weekday (not Saturday or Sunday)
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !feriadosPortugal(currentDate)) {
        // Check if the current date is already in listaDias
        const isDateInList = listaDias.some(item =>
          toLocalDate(item.Data).toDateString() === currentDate.toDateString()
        );


        if (!isDateInList) {
          // Add the current date to the list if it's not already there
          dates.push(new Date(currentDate));
        }
      }


      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setSelectedDates(dates);
    arrayListaDias(dates);

    return dates;
  }, [Data]);

  const arrayListaDias = async (datesReceived) => {
    datesReceived.sort((a, b) => new Date(a) - new Date(b));
    const startDate = new Date(datesReceived[0]);
    const endDate = new Date(datesReceived[datesReceived.length -1]);
  
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
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !feriadosPortugal(currentDate) && (datesReceived.some(item => (new Date (item)).getDate() === currentDate.getDate())) ) {
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

   const stringD = stringListaDias(dates);
   setStringDates(stringD);
   return dates;
  };

  const stringListaDias = useCallback((dates) => {
    try {
      let data = "";
      if(!dates || dates.length === 0){
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
  }, [Data]);

  const verificaFim = useCallback((e) => {
    const { value } = e.target;
    e.target.name = "Data";
    const inData = new Date(Data);
    const fData = new Date(value);

    if (fData < inData) {

      verificaDia(e)
    }

    setFimFerias(value)
    verificaListaDias(Data, value)

    for (let i = 0; i < listaDias.length; i++) {
      const DataRecebida = new Date(listaDias[i].Data);

      const itemDay = fData.getDate();
      const itemMonth = fData.getMonth();
      const itemYear = fData.getFullYear();

      const currentDay = DataRecebida.getDate();
      const currentMonth = DataRecebida.getMonth();
      const currentYear = DataRecebida.getFullYear();

      if (
        currentYear === itemYear &&
        currentMonth === itemMonth &&
        currentDay === itemDay
      ) {
        const tipoDeTrabalhoHoras = {};


        for (let j = 0; j < listaDias[i].tipoDeTrabalhoHoras.length; j++) {
          const val = listaDias[i].tipoDeTrabalhoHoras[j].projeto;

          tipoDeTrabalhoHoras[val] = listaDias[i].tipoDeTrabalhoHoras[j];


          const projeto = listaDias[i].tipoDeTrabalhoHoras[j]
          const tt = projeto.tipoTrabalho.split(',') || [];
          const ttH = projeto.horas.split(',') || [];

        }
        return;
      }
    }
    return;

  }, [listaDias?.length, Data, fimFerias, projetos]);


  const handleInsertFerias = async (e) => {
    setButtonClicked(true);
    e.preventDefault();


    if (selectedDates.length === 0) {
      toast.error('Dias inserido invalidos!');
      setButtonClicked(false);
      return;
    }


    const values = {
      Utilizador: user?.user?.id,
      Dias: selectedDates,
      accepted: accepted,
    }

    await dispatch(adicionarFerias(values));

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };


  return (
    <div className="container">
      <div className='row'>
        <div className='col-4'>
          <h3>Adicionar Ferias</h3>
        </div>
        <div className='col-4  d-flex flex-column justify-content-center align-items-center'>
          <button
            type="submit"
            onClick={(e) => { setAddFerias(false) }}
            disabled={buttonClicked}
            className='button-30'
            style={{
              fontSize: "95%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
              lineHeight: "normal",
              width: 'auto'
            }}
          >
            Adicionar Dias
          </button>
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
            name="Inicio"
            placeholder="Dia Adicionar Horas"
            value={Data ? new Date(Data).toLocaleDateString('en-CA') : ''}
            handleChange={verificaData}
          />
        </div>

        <div className='col-6 text-center'>
          <FormRow
            type="date"
            className="dataFimFerias"
            classNameInputDate="form__field__date"
            classNameLabel="form-field-label"
            id="fimFerias"
            name="Fim"
            value={fimFerias ? new Date(fimFerias).toLocaleDateString('en-CA') : ''}
            handleChange={verificaFim}
          />
        </div>
      </div>

      <div className="card text-center">
        <div className="card-body">
          {stringDates ? (
            <>
            <h4>{selectedDates.length === 1 ? "Dia": "Dias"}</h4>
            <p dangerouslySetInnerHTML={{ __html: stringDates }} />
            </>
          ) : (
            <p>Dias escolhidos inválidos!</p>
          )}


        </div>
        </div>
      <div className="card text-center">
        <div className="card-body">
          <h5 className="card-title">
            Total de dias: {selectedDates.length}
          </h5>
        </div>

        <div className="card-body">
          <button
            type="submit"
            disabled={buttonClicked}
            onClick={(e) => { handleInsertFerias(e) }}
            className="w-100 btn btn-lg btn-primary"
          >
            {'Inserir Férias'}
          </button>
        </div>
      </div>
    </div>
  );
};


AddFerias.propTypes = {
  setAddFerias: PropTypes.func.isRequired,
  verificaDia: PropTypes.func.isRequired,
  Data: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired
  ]).isRequired,
  listaDias: PropTypes.array.isRequired,
  projetos: PropTypes.array.isRequired,
  accepted: PropTypes.number.isRequired,
}



export default memo(AddFerias);
