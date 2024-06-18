import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/AddProjetoForm';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addPagamentosUtilizador } from '../features/pagamentos/pagamentosSlice';
import { AiOutlineClose } from 'react-icons/ai';
import { IoAddCircleOutline } from "react-icons/io5";

import Loading from './Loading';
import NumberPicker from "react-widgets/NumberPicker";


const convertToInt = (horas) => {
  try {
    let timeParts = horas?.split(':');
    // Calculate the decimal representation
    let horasNumberChange = parseInt(timeParts[0], 10) + parseFloat(timeParts[1]) / 60;
    let horasNumber = Number(horasNumberChange.toFixed(2));
    if (isNaN(horasNumber) || horasNumber <= 0 || horasNumber === null) {
      horasNumber = "0";
    }
    return horasNumber;
  } catch (error) {
    if (horas < 0) {
      return 0.0;
    } else {
      return horas;
    }

  }
}


const AddPagamentos = ({ horasExtraEsteMes, horasPorDar, selectedUser, responsableUser, month, year, handleChange }) => {

  //const { isLoading } = useSelector((store) => store.pagamentos)
  const initialState = {
    Utilizador: selectedUser,
    UtilizadorResponsavel: responsableUser,
    Mes: month,
    Ano: year,
    Horas: '',
  };

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pagamentoVisible, setPagamentoVisible] = useState(false);
  const [values, setValues] = useState(initialState);
  const [selectedMinutes, setSelectedMinutes] = useState((convertToInt(horasExtraEsteMes) >= "0" ? convertToInt(horasExtraEsteMes) : "0")); // Convert hours to minutes



  useEffect(() => {
    try {
      const time = (convertToInt(horasExtraEsteMes) >= 0 ? convertToInt(horasExtraEsteMes) : 0);
      setSelectedMinutes(time);
      setValues({ ...values, "Mes": month, "Ano": year, "Horas": time });
    }
    catch (error) {
      console.error(error)
    }
    
  }, [month, horasPorDar, year, horasExtraEsteMes, selectedUser]);



  const handleValueChange = (newValue) => {
    // Ensure the new value stays within the allowable range in minutes
    const newValueInRange = Math.min(Math.max(newValue, 0), convertToInt(horasPorDar)); // Convert hours to minutes for comparison
    const time = convertToInt(newValueInRange);
    setSelectedMinutes(time);

    setValues({ ...values, "Horas": time });
  };


  function convertToMinutes(timeString) {
    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");
        const hoursInt = parseInt(hours, 10);
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
        return timeString.toString();
      }
    }

    return "00:00";
  }


  // const displayTime = (minutes) => {
  //   const hours = Math.floor(minutes / 60);
  //   const remainingMinutes = minutes % 60;
  //   return `${hours} horas ${remainingMinutes} minutos`;
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.Utilizador || !values.UtilizadorResponsavel || !(values.Mes >= 0 && values.Mes < 12) || !values.Ano || !values.Horas) {
      const requiredFields = ['Utilizador', 'Utilizador Responsavel', 'Mes', 'Ano', 'Horas'];
      const emptyField = requiredFields.find(field => !values[field]);



      if (emptyField) {
        toast.error(`Por favor, preencha o campo obrigatório: ${emptyField}!`);
      } else {
        toast.error('Por favor, preencha todos os campos obrigatórios!');
      }
      return;
    }

    try {
      await dispatch(addPagamentosUtilizador(values));
      toast.success("Horas pagas adicionadas!");
      handleChange();

    } catch (error) {
      console.error(error);
    }
    //navigate('/');
  };

  const setVisible = async (value) => {
    try {
      setLoading(true);
      setPagamentoVisible(value)
    } catch (error) {
      console.error('Error copying hours:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Loading />;
  }




  return (
    <Wrapper>
      <div className='row'>
        {!pagamentoVisible ? (
          <div className='col-12 ' id="addProjeto">
            <button onClick={() => setVisible(true)} className='btn'>
              Adicionar Pagamento <IoAddCircleOutline />
            </button>
          </div>
        ) : (
          <div className='row  d-flex text-center '>
            <div className='col-3'></div>
            <div className='col-6 text-center  mb-4'>
              <h3 className="fw-normal">Adicionar Pagamento</h3>
              <form className='MainForm' onSubmit={handleSubmit}>
                <div className='row d-flex align-items-md-center'>

                  <div className='col-10' id="addProjeto">
                    <NumberPicker
                      value={selectedMinutes}
                      step={0.5}
                      onChange={handleValueChange}
                      format={(value) => convertToMinutes(value)} // Display time in hours and minutes
                    />
                  </div>
                  <div className='col-2 text-center' id="addProjeto">

                    <div className='col-12 text-end' id="addProjeto">
                      <button onClick={() => setVisible(false)} type='button' className='btn' style={{ margin: '5%' }}>
                        <AiOutlineClose />
                      </button>
                    </div>
                    <div className='col-12 text-end' id="addProjeto"></div>
                    <button type='submit' className="btn btn-primary">
                      Adicionar
                    </button>
                  </div>

                </div>
              </form>
            </div>
            <div className='col-3'>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};



export default AddPagamentos;

//{isLoading ? 'loading...' : 'submit'}