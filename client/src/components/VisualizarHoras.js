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
      const isHoliday = feriadosPortugal(date); // Check if the date is a Portuguese holiday
      if (date >= today) {
        break;
      }
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
        count++;
      }
    }
    return count;
  }
  
  function feriadosPortugal(date) {
    const feriados = [
      { name: "Ano Novo", date: new Date(date.getFullYear(), 0, 1) },
      { name: "Dia da Liberdade", date: new Date(date.getFullYear(), 3, 25) },    
      { name: "Dia do Trabalhador", date: new Date(date.getFullYear(), 4, 1) },     
      { name: "Dia de Portugal", date: new Date(date.getFullYear(), 5, 10) },
      { name: "Assunção de Nossa Senhora", date: new Date(date.getFullYear(), 7, 15) },
      { name: "Implantação da República", date: new Date(date.getFullYear(), 9, 5) },
      { name: "Dia de Todos os Santos", date: new Date(date.getFullYear(), 10, 1) },
      { name: "Restauração da Independencia", date: new Date(date.getFullYear(), 11, 1) },
      { name: "Dia da Imaculada Conceicao", date: new Date(date.getFullYear(), 11, 8) },
      { name: "Natal", date: new Date(date.getFullYear(), 11, 25) },

      { name: "Sexta-feira Santa", date: calculateEaster(date.getFullYear(), "SextaFeiraSanta") },
      { name: "Páscoa", date: calculateEaster(date.getFullYear(), "DomingoPascoa") },
      { name: "Segunda-feira de Páscoa", date: calculateEaster(date.getFullYear(), "SegundaPascoa") },
      { name: "Corpo de Deus", date: calculateCorpusChristi(date.getFullYear()) }
    ];
  
    for (const feriado of feriados) {
      if (
        date.getDate() === feriado.date.getDate() &&
        date.getMonth() === feriado.date.getMonth()
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
            {(user?.user?.tipo === 2) && (
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
                    )
                }
                <div>
    
                    <h1>{userNome}</h1>
                    <p>Horas Possiveis {possibleHours}</p>
                    <p>Horas Realizadas {horasRealizadas}</p>
                    {percentagemHoras >= 0 && <p>{percentagemHoras.toFixed(1)}%</p>}
                </div>
                {(!listaDias.length > 0) ? (
                    <>
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
                    }).length === 0 && diaSelected === 0 && <h2>Sem Horas inseridas neste mês</h2>}
                    {dias.filter((dia) => {
                    const data = new Date(dia.Data);
                    return month === data.getMonth() && (diaSelected === 0 || Number(diaSelected) === data.getDate());
                    }).length === 0 && diaSelected !== 0 && <h2>Sem Horas inseridas neste dia</h2>}
                </div>    
                </>            
                ) : (
                    <div className='projetos'>
                    <h2>Sem Horas inseridas</h2>
                </div>
                    
                )
                }
            </div>
            
        </Wrapper>
    );
};

export default ListaHoras;
