import { useEffect, useState, useCallback } from 'react';
import Wrapper from '../assets/wrappers/addHorasProjeto';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos, handleChange } from '../features/allProjetos/allProjetosSlice';
import { toast } from 'react-toastify';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { createDia, getDia, editDia } from '../features/dias/diasSlice';
import { FormRow, AddHorasProjetoDropdown } from '../components';
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
    const { projeto, isLoading } = useSelector((store) => store.projeto);
    const { user } = useSelector((store) => store.utilizador);

    const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);

    const { projetos, totalProjetos } = useSelector((store) => store.allProjetos);

    const dispatch = useDispatch();

    const [showProjeto, setShowProjeto] = useState({});
    const [horasT, setHorasT] = useState(0);

    const [listaDias, setListaDias] = useState([]);
    const [verificaDiaCalled, setVerificaDiaCalled] = useState(false);

    useEffect(() => {
        dispatch(handleChange({ name: 'projetoFinalizado', value: "false" }));
        dispatch(getAllProjetos({ ProjetoFinalizado: false }))
        dispatch(getTipoTrabalho()).then((res) => {
            const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
            setListaTipoTrabalho(tipoTrabalhoArray);
        });
    }, [totalProjetos]);

    useEffect(() => {
        dispatch(getDia(values.Data, user.user.id)).then((res) => {
            setListaDias(res.payload.dia);
        });
    }, []);


const verificaDia = useCallback((e) => {
    const { name, value } = e.target;
    const dia = listaDias.find((dia) => new Date(dia.Data).toISOString().slice(0, 10) === value);

    if (dia) {
      const tipoDeTrabalhoHoras = dia.tipoDeTrabalhoHoras.reduce((acc, curr) => {
        acc[curr.projeto] = curr;
        return acc;
      }, {});

      setValues({
        ...values,
        [name]: value,
        _id: dia._id,
        Utilizador: user.user.id,
        NumeroHoras: dia.NumeroHoras,
        tipoDeTrabalhoHoras,
      });

      setHorasT(dia.NumeroHoras);
      setVerificaDiaCalled(true);
    } else {
      setValues({
        ...values,
        [name]: value,
        NumeroHoras: "",
        tipoDeTrabalhoHoras: [],
      });
      setHorasT(0);
      setVerificaDiaCalled(false);
    }
  }, [listaDias, setValues, setHorasT, setVerificaDiaCalled]);


    useEffect(() => {
        verificaDia({ target: { name: 'Data', value: values.Data } });
    }, [listaDias]);



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

        let horas = e;

        let timeParts = horas.split(':');


                // Calculate the decimal representation
        let horasNumberChange = parseInt(timeParts[0], 10) + parseFloat(timeParts[1]) / 60;
        let horasNumber = Number(horasNumberChange.toFixed(2));
        let diff = 0;

        if (isNaN(horasNumber) || horasNumber <= 0 || horasNumber === null) {
            horasNumber = 0;
            //return;
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
                newHorasT = (parseFloat(horasT) + parseFloat(diff)).toFixed(2);
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
            newHorasT = parseFloat(horasT) + parseFloat(horasNumber);
        }

        if (newHorasT > 24) {
            toast.error('Valor inserido excede as 24 Horas!');
            setValues({ ...values, [projectId]: 0 });
            //setHorasT(horasT - (showProjeto[projectId + tipoTrabalho] || 0));
            return;
        }

        setValues({
            ...values,
            [projectId]: horasNumber,
            NumeroHoras: newHorasT,
            tipoDeTrabalhoHoras: newTipoDeTrabalhoHoras
        });

        setHorasT(newHorasT);
        setShowProjeto(newShowProjeto);
    };

  

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

    if (isLoading) {
        return <Loading />;
      }

      if(!values){
        return <Loading />;
      }

    if (projeto && projeto.projeto === null || typeof projeto.projeto === 'undefined'|| !projeto) {
        return <Loading />;
    }
    if(!listaDias){
        return <Loading />;
    }

    const matchFoundProjeto = new Array(projetos.length).fill(false);
    const arrayTipoTrabalho = Object.entries(values.tipoDeTrabalhoHoras).map(([key, value]) => ({ _id: key, ...value }));
    



    return (
        <Wrapper>
            <div className="container">
            <div className="list-group mx-1 w-auto">
                                <div className="row md-3 ">
                    <div className="col-md-12">
                        <h1>{verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}</h1>


                        <FormRow
                            type="date"
                            className="form-control"
                            classNameLabel="form-field-label"
                            classNameInputDate="form__field__date"
                            id="Dia"
                            name="Data"
                            placeholder="Dia Adicionar Horas"
                            value={values.Data ? new Date(values.Data).toLocaleDateString('en-CA') : ''}
                            handleChange={verificaDia}
                        />
                    </div>

                    <div className="col-md-12 text-center mt-3 mb-3"><h1>{projeto.projeto.Nome}</h1></div>
                </div>
                



                <div className="list-group mx-1 w-auto">


                <AddHorasProjetoDropdown
                    sortedProjetos={projeto}
                    verificaChange= {verificaDiaCalled}
                    listaTipoTrabalho={listaTipoTrabalho}
                    values={values}
                    handleHorasChange={handleHorasChange}
                    convertToMinutes={convertToMinutes}
                    arrayTipoTrabalho={arrayTipoTrabalho}
                    matchFoundProjeto={matchFoundProjeto}
                    ListaTrabalhoAll={listaTipoTrabalho}
                    setListaTipoTrabalho={setListaTipoTrabalho}
                    />
      
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">Total de horas diárias: {horasT} horas</h5>
                            </div>

                            <div className="card-body">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={(e) => { handleDia(e) }}
                                    className="w-100 btn btn-lg btn-primary"
                                >
                                    {isLoading ? 'loading...' : verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>

            </div>
        </Wrapper>
    );
}
export default ListaProjetos;