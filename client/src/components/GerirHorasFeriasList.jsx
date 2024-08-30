import { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useSelector } from 'react-redux';
import { FaCaretDown } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import useFeriadosPortugal from './FeriadosPortugal';

const GerirHorasFeriasList = ({
  keyF,
  ferias,
  userName,
  handleInsert,
  totalFerias,
  feriasPorDar,
  deleteDias,
  Ano,
}) => {

  const { feriadosPortugal } = useFeriadosPortugal();
  //const [verificaResultado, setVerificaResultado] = useState(1);
  const [verificaAlterado, setVerificaAlterado] = useState(false);
  const [addDias, setAddDias] = useState("0");
  const [selectedYear, setSelectedYear] = useState((new Date()));
  const { user } = useSelector((store) => store.utilizador);
  const [showFerias, setShowFerias] = useState({});

  const [arrayDataYear, setArrayDataYear] = useState({});

  const [showFeriasSwitch, setShowFeriasSwitch] = useState({ keyF: false });
  
  const handleAddDias = (e) => {
    if (addDias <= 0 || !e) {
      toast.error("Valores Inseridos Invalidos!")
      return;
    }
    const sYear = selectedYear.getFullYear();
    const values = {
      id: e,
      responsavel: user?.user?.id,
      value: addDias,
      year: sYear,
    }
    handleInsert(values);
  };

  const handleChangeDias = (e) => {

    const value = e.target.value ? e.target.value : 0;

    if (value === 0) {
      //   handleAlterado(false);
      setVerificaAlterado(false);
    } else {
      if (verificaAlterado === false) {
        // handleAlterado(true);
      }
      setVerificaAlterado(true);
    }
    setAddDias(value);
  };


  const handleDropdownToggle = useCallback((feriasID) => {

    setShowFerias((prevShowFerias) => ({
      ...prevShowFerias,
      [feriasID]: !prevShowFerias[feriasID],
    }));

  }, [ferias]);


  const handleSwitchToggle = useCallback(async (feriasID) => {
    const arrayFeriasYear = ferias[0].reduce((acc, feriasYear) => {
      // Extract the year from the date
      const dataYear = new Date(feriasYear.Data).getFullYear();
      // Initialize the array for this year if it doesn't exist
      if (!acc[dataYear]) {
        acc[dataYear] = [];
      }
    
      // Push the current feriasYear into the corresponding year array
      acc[dataYear].push(feriasYear);
    
      return acc;
    }, {});
    let arrayD = [];
    for(let i = 0; i< Object.values(arrayFeriasYear).length ; i++){
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

    setArrayDataYear(arrayD)


    setShowFeriasSwitch((prevShowFerias) => ({
      ...prevShowFerias,
      [feriasID]: !prevShowFerias[feriasID],
    }));
  }, [ferias]);


  const deleteDiasFerias = useCallback(async (id) => {
    try {
      await deleteDias(id);
    } catch (error) {
      console.error("Error deleting day", error);
    }
  }, []);


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
  }, []);

  const totalNumber = (ferias[0].reduce((acc, numberF) => {
    let number = 0;
    const date = new Date(numberF.Data);
    if(date.getFullYear() === Ano){
      number = 1;
    }
    return acc + number;
  }, 0));

  const totalNumberMap = {};
 
// Calculate the total number for each item in ferias[1]
const totalNumberPossiveis = ferias[1].reduce((acc, numberF) => {
  const dataAno = numberF.Ano;
  let number = 0;
  
  // Only calculate totalNumber if the year has not been processed yet
  if (dataAno <= Ano) {
      number = numberF.Numero;
      // Calculate totalNumber for the current year if not already calculated
      if (!(dataAno in totalNumberMap)) {
          const totalNumber = ferias[0].reduce((acc, numberF) => {
              let numberYear = 0;
              const date = new Date(numberF.Data);
              
              if (date.getFullYear() < dataAno) {
                  numberYear = 1;
              }
              
              return acc + numberYear;
          }, 0);
          
          totalNumberMap[dataAno] = totalNumber; // Store the calculated totalNumber

          number -= totalNumber; // Deduct totalNumber from number
      }

  }

  return acc + number;
}, 0);



  const acepted = ferias[0].length;
  return (
    <>
      {/* <div className={verificaResultado === 1 ? '' : verificaResultado ? 'resultadoProjetoP' : 'resultadoProjetoN'}> */}
      <div className='resultadoProjetoP'>
        <div className="listaProjetos">
          <div className="row text-center" style={{margin:"auto"}}>

            <div className="col-md-2 themed-grid-col" style={{margin:"auto"}}>
              <h5 style={{margin:"auto"}}>{userName}</h5>
            </div>

            <div className="col-md-5 themed-grid-col" style={{margin:"auto"}}>
              <div className="row text-center">
                <div className="col-md-4 themed-grid-col" style={{margin:"auto"}}>
                  <p style={{margin:"auto"}}>{totalNumber}</p>
                </div>
                <div className="col-md-4 themed-grid-col" style={{margin:"auto"}}>
                  <p style={{margin:"auto"}}>{totalNumberPossiveis + Number(addDias)}</p>
                </div>
                <div className="col-md-4 themed-grid-col" style={{margin:"auto"}}>
                  <p style={{margin:"auto"}}>{feriasPorDar}</p>
                </div>
              </div>
            </div>


            <div className="col-md-1 themed-grid-col" style={{margin:"auto"}}>
              <input
                type="Number"
                style={{
                  width: '100%',
                  minWidth: '40px',
                  maxWidth: '50px',
                }}
                min="0"
                id={"AddDias " + keyF}
                name="AddDiasInput"
                value={addDias}
                onChange={handleChangeDias}
                className="form__field__date"
              />
            </div>


            <div className="col-md-2 themed-grid-col" style={{margin:"auto"}}>
            {addDias > 0 ? (
              <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  minDate={new Date('2015-01-01')} // Minimum year allowed
                  maxDate={new Date()} // Maximum year allowed
                  views={['year']} // Limits the picker to only allow year selection
                  value={selectedYear}
                  onChange={(newValue) => {
                    setSelectedYear(newValue); // Handle the year selection
                  }}

                  slotProps={{
                    popper: {
                      sx: {
                        '& .MuiPaper-root': {
                          height: '150px',
                          overflowY: 'auto',

                        },
                      },
                    },
                    textField: {
                      size: 'small',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          height: 30,
                          width: '100%',
                          minWidth: '100px',
                          maxWidth: '100px',
                        }
                      }
                    }
                  }
                  }
                />
              </LocalizationProvider>
              </>
            ) :
            (
              <>
                {ferias[1].length > 0 && (
                  <div className="col-md-12 themed-grid-col text-end">
                    <div className="row">
                      <div className="col-md-10 btn-container">
                        <button
                          type="button"
                          className="btn button-Dropdown"
                          onClick={() => handleDropdownToggle(keyF)}
                        >
                          <FaCaretDown />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            </div>


            <div className='col-md-2 text-center' style={{margin:"auto"}}>
              {addDias > 0 && (
                <button
                  type='button'
                  className='btn btn-outline-primary buttonProjeto'
                  onClick={() => handleAddDias(keyF)}
                >
                  Adicionar
                </button>
              )}
            </div>
            {addDias < 1 && showFerias[keyF] && (

              <div className={`dropdown ${showFerias[keyF] ? "show-dropdown" : "hidden-dropdown"} ${showFerias[keyF] ? "" : "d-none"}`}>


              {ferias[0].length >0 &&
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showFeriasSwitch[keyF] || false} 
                    onChange={() => handleSwitchToggle(keyF)}
                  />
                  <span className="slider round"></span>
                </label>
              }
                {!showFeriasSwitch[keyF] ? (
<<<<<<< HEAD
                  <div className='p-3' key={"key" + keyF}>
 
                  <div className='row '  >
=======
                  <div key={"key" + keyF}>
 
                  <div className='row'  >
>>>>>>> 493ca391511a8fef4d9eac4d0a749b0bb864100e
                       
                    <div className="col-md-1 themed-grid-col"></div>

                    <div className="col-md-3 themed-grid-col" style={{margin:"auto"}}>
                      <p style={{margin:"auto"}}>Responsável</p>
                    </div>

                    <div className="col-md-3 themed-grid-col" style={{margin:"auto"}}>
                      <p style={{margin:"auto"}}>Inseridos</p>
                    </div>

                    <div className="col-md-3 themed-grid-col" style={{margin:"auto"}}>
                      <p style={{margin:"auto"}}>Ano Correspondente</p>
                    </div>
                    <div className="col-md-2 themed-grid-col"></div>
                  </div>

                  {ferias[1].map((feriasYear, index) => {

                    return (
                      <div className='row' key={index}>

                        <div className="col-md-1 themed-grid-col" style={{margin:"auto"}}>

                        </div>
                        <div className="col-md-3 themed-grid-col" style={{margin:"auto"}}>
                          <p style={{margin:"auto"}}>{feriasYear.UtilizadorResponsavel}</p>
                        </div>

                        <div className="col-md-3 themed-grid-col" style={{margin:"auto"}}>
                          <p style={{margin:"auto"}}>{feriasYear.Numero}</p>
                        </div>

                        <div className="col-md-3 themed-grid-col" style={{margin:"auto"}}>
                          <p style={{margin:"auto"}}>{feriasYear.Ano}</p>
                        </div>

                        <div className="col-md-2 themed-grid-col" style={{margin:"auto"}}>
                          <button style={{margin:"auto"}} type='submit' onClick={() => deleteDiasFerias(feriasYear._id)} className="btn">
                            <AiFillDelete />
                          </button>
                        </div>
                      </div>
                    )
                  }
                  )
                  }

                </div>) : (<>

                  <div className='row p-3' >

                    <div className="col-md-1 themed-grid-col"></div>

                    <div className="col-md-3 themed-grid-col">
                      <p>Data</p>
                    </div>

                    <div className="col-md-3 themed-grid-col">
                      <p>Numero de Dias</p>
                    </div>
   
                    <div className="col-md-3 themed-grid-col">
                      Ano Correspondente
                    </div>
                    <div className="col-md-2 themed-grid-col"></div>
                  </div>

                  {arrayDataYear  && Object.values(arrayDataYear).map((feriasInsertedYear, index) => {
                    const dataYear = feriasInsertedYear.ano;
                    const numero = feriasInsertedYear.numero;
                    const stringDates = feriasInsertedYear.string;
                    return (
                      <div className='row' key={keyF + Object.keys(arrayDataYear)[index]} >
                        <hr></hr>
                        <div className="col-md-1 themed-grid-col">
                        </div>
                        <div className="col-md-3 themed-grid-col">
                            <p dangerouslySetInnerHTML={{ __html: stringDates }} />
                        </div>
                        <div className="col-md-3 themed-grid-col">
                          <p>{numero}</p>
                        </div>
                        <div className="col-md-3 themed-grid-col">
                          <p>{dataYear}</p>
                        </div>

                        <div className="col-md-2 themed-grid-col">
                        </div>
   
                      </div>
                    )
                  }
                  )
                  }
                </>)}

              </div>
            )}

          </div>
          <hr></hr>
        </div>
      </div>
    </>
  );
};


GerirHorasFeriasList.propTypes = {
  keyF: PropTypes.string.isRequired,
  ferias: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
  handleInsert: PropTypes.func.isRequired,
  deleteDias: PropTypes.func.isRequired,
}

export default memo(GerirHorasFeriasList);

