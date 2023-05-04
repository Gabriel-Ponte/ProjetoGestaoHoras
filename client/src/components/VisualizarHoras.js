import { useEffect, useState, useCallback } from 'react';
import Wrapper from '../assets/wrappers/ProjetossContainer';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import { handleChange } from '../features/allProjetos/allProjetosSlice';
import Dia from './Dias';
import { getAllDiasUtilizador } from '../features/allDias/allDiasSlice';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { FormRowSelect } from '../components';
import Calendar from './Calendar'


const today = new Date();

function getWeekdayCount(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // number of days in the month
    let count = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (date >= today) {
            break;
        }
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
    }
    return count;
}

const ListaHoras = () => {
    const { user, utilizadores } = useSelector((store) => store.utilizador);
    const { dias, isLoading } = useSelector((store) => store.allDias);

    const [selectedUser, setSelectedUser] = useState(user?.user?.nome);
    const [selectedDay, setSelectedDay] = useState();
    const [listaDias, setListaDias] = useState([]);
    const [userNome, setUserNome] = useState(user?.user?.nome); // add state for user name
    const userId = user?.user?.id;
    const dispatch = useDispatch();
    const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];


    const handleChangeCalendario = useCallback((dia, mes, ano) => {
        const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];
        setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
    }, []);


    const handleChangeUtilizador = useCallback((e) => {
        const { value } = e.target;
        setSelectedUser(value);
    }, []);

    useEffect(() => {
        dispatch(listaUtilizadores());
    }, [selectedUser]);

    useEffect(() => {
        dispatch(getAllDiasUtilizador({ userNome: selectedUser })).then((res) => {
            setListaDias(res.payload);
        });
        setUserNome(selectedUser); // update userNome state with selected user name
    }, [selectedUser]);

    if (isLoading) {
        return <Loading />;
    }

    if (listaDias.length > 0) {
        return (
            <Wrapper>
                <div className='projetos'>
                    <div>
                        <h3>Escolha Utilizador</h3>
                        <FormRowSelect
                            type="text"
                            className="form-control"
                            id="piloto"
                            name="Piloto"
                            labelText="Utilizador"
                            multiple={false}
                            value={selectedUser}
                            list={formattedListUtilizadores}
                            handleChange={handleChangeUtilizador}
                        />
                    </div>
                    <h1>{userNome}</h1>
                    <h2>Sem Horas inseridas</h2>
                </div>
            </Wrapper>
        );
    }

    const diaSelected = selectedDay ? selectedDay.dia : 0;
    const month = selectedDay ? selectedDay.mes : today.getMonth();
    const year = selectedDay ? selectedDay.ano : today.getFullYear();
    const weekdayCount = getWeekdayCount(month, year);
    const possibleHours = weekdayCount * 8;
    let horasRealizadas = 0;

    for (let i = 0 ; i < dias.length ; i++){
        const data = new Date(dias[i].Data);

        if(year === data.getFullYear() && month === data.getMonth()){
        horasRealizadas += dias[i].NumeroHoras;
        }
    }
    const percentagemHoras = (horasRealizadas / possibleHours) * 100;
    //const percentagemHoras = Math.round((horasRealizadas / possibleHours) * 100);
    return (
        <Wrapper>
            <div className='projetos'>
                <div>
                    <h3>Escolha Utilizador</h3>
                    <FormRowSelect
                        type="text"
                        className="formRow" classNameLabel='formRowLabel' classNameInput='formRowInput'
                        id="piloto"
                        name="Piloto"
                        labelText="Utilizador"
                        value={selectedUser}
                        list={formattedListUtilizadores}
                        handleChange={handleChangeUtilizador}
                        multiple={false}
                    />
                </div>
                <div>
                    <h1>{userNome}</h1>
                    <p>Horas Possiveis {possibleHours}</p>
                    <p>Horas Realizadas {horasRealizadas}</p>
                    {percentagemHoras >= 0 && <p>{percentagemHoras.toFixed(1)}%</p>}
                </div>
                <Calendar
                    handleChange={handleChangeCalendario}
                />

                <div>
                    {dias.map((dia) => {
                        const data = new Date(dia.Data);

                        if (month === data.getMonth()) {
                            if (diaSelected === 0 || Number(diaSelected) === data.getDate()) {
                                return <Dia key={dia.Data} {...dia} horasPossiveis={possibleHours} />;
                            }
                        }
                        return null;
                    })}
                    {dias.filter((dia) => {
                        const data = new Date(dia.Data);
                        return month === data.getMonth() && (diaSelected === 0 || Number(diaSelected) === data.getDate());
                    }).length === 0 && <h2>Sem Horas inseridas neste mes</h2>}
                </div>
            </div>
        </Wrapper>
    );
};

export default ListaHoras;
