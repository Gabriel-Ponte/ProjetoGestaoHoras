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

function getWeekdayCount() {
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // number of days in the month
    let count = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
        if (date >= today) {
            break;
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
        console.log(selectedDia ,selectedMes, selectedAno)
        setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
    }, []);


    const handleChangeUtilizador = useCallback((e) => {
        console.log(e)
        const { value } = e.target;
        setSelectedUser(value);
    }, []);

    useEffect(() => {
        dispatch(listaUtilizadores());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllDiasUtilizador({ userNome: selectedUser })).then((res) => {
            setListaDias(res.payload);
        });
        setUserNome(selectedUser); // update userNome state with selected user name
    }, [dispatch, selectedUser]);

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
    const weekdayCount = getWeekdayCount();
    const possibleHours = weekdayCount * 8;


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
                <h1>{userNome}</h1>
                
                <Calendar
                    handleChange={handleChangeCalendario}
                />
                
                {dias.map((dia) => {
                    const data = new Date(dia.Data);
                    const month = selectedDay ? selectedDay.mes : today.getMonth();
                    const diaSelected = selectedDay ? selectedDay.dia : 0;
                    if (month === data.getMonth()) {
                         if (diaSelected === 0) {
                            return <Dia key={dia.Data} {...dia} horasPossiveis={possibleHours} />;
                        } else if (Number(diaSelected) === data.getDate()) {
                            return <Dia key={dia.Data} {...dia} horasPossiveis={possibleHours} />;
                        }
                    }
                })}
            </div>
        </Wrapper>
    );
};

export default ListaHoras;
