import { useEffect, useState, useCallback } from 'react';
import Wrapper from '../assets/wrappers/VisualizarHoras';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import Dia from './Dias';
import { getAllDiasUtilizador } from '../features/allDias/allDiasSlice';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { FormRowSelect } from '../components';
import Calendar from './Calendar'

const ListaHoras = () => {
  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const { dias, isLoading } = useSelector((store) => store.allDias);

  const [selectedUser, setSelectedUser] = useState(user?.user?.nome);
  const [selectedDay, setSelectedDay] = useState();
  const [getFeriados, setFeriados] = useState([]);
  const [listaDias, setListaDias] = useState([]);
  const [horasRealizadas, setHorasRealizadas] = useState(0);
  const [percentagemHoras, setPercentagemHoras] = useState(0);
  const [possibleHours, setPossibleHours] = useState(0);
  const [userNome, setUserNome] = useState(user?.user?.nome); // add state for user name
  const dispatch = useDispatch();
  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];
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

    const feriados = [];

    for (let i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
      feriados.push(
        { name: "Ano Novo", date: new Date(i, 0, 1) },
        { name: "Dia da Liberdade", date: new Date(i, 3, 25) },
        { name: "Dia do Trabalhador", date: new Date(i, 4, 1) },
        { name: "Dia de Portugal", date: new Date(i, 5, 10) },
        { name: "Assunção de Nossa Senhora", date: new Date(i, 7, 15) },
        { name: "Implantação da República", date: new Date(i, 9, 5) },
        { name: "Dia de Todos os Santos", date: new Date(i, 10, 1) },
        { name: "Restauração da Independência", date: new Date(i, 11, 1) },
        { name: "Dia da Imaculada Conceição", date: new Date(i, 11, 8) },
        { name: "Natal", date: new Date(i, 11, 25) },
        { name: "Sexta-feira Santa", date: calculateEaster(i, "SextaFeiraSanta") },
        { name: "Páscoa", date: calculateEaster(i, "DomingoPascoa") },
        { name: "Segunda-feira de Páscoa", date: calculateEaster(i, "SegundaPascoa") },
        { name: "Corpo de Deus", date: calculateCorpusChristi(i) }
      );
    }

    setFeriados(feriados);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);


  useEffect(() => {
    dispatch(getAllDiasUtilizador({ userNome: selectedUser })).then((res) => {
      setListaDias(res.payload);
    });
    setUserNome(selectedUser); // update userNome state with selected user name
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    const month = selectedDay ? selectedDay.mes : today.getMonth();
    const year = selectedDay ? selectedDay.ano : today.getFullYear();
    const weekdayCount = getWeekdayCount(month, year);
    const possibleHoursCount = weekdayCount * 8;
    let horasRealizadasCount = 0;
    if (listaDias?.diasAllUtilizador) {
      for (let i = 0; i < listaDias?.diasAllUtilizador.length; i++) {
        const data = new Date(listaDias?.diasAllUtilizador[i].Data);

        if (year === data.getFullYear() && month === data.getMonth()) {
          horasRealizadasCount += dias[i].NumeroHoras;
        }
      }
    }
    setPossibleHours(possibleHoursCount);
    setHorasRealizadas(horasRealizadasCount);
    setPercentagemHoras((horasRealizadasCount / possibleHoursCount) * 100);
    //const percentagemHoras = Math.round((horasRealizadas / possibleHours) * 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaDias, selectedDay]);


  const diaSelected = selectedDay ? selectedDay.dia : 0;
  const month = selectedDay ? selectedDay.mes : today.getMonth();
  const year = selectedDay ? selectedDay.ano : today.getFullYear();

  if (isLoading) {
    return <Loading />;
  }
  if (!dias) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <div className='mainVisualiza'>
        {(user?.user?.tipo === 2) && (
          <div className='text-center mb-5'>
            <h3 className='mb-5'>Escolha Utilizador</h3>
            <FormRowSelect
              type="text"
              className="row mb-3 text-center"
              classNameLabel='col-md-3 text-end'
              classNameInput='col-md-9'
              classNameResult='col-md-6 text-start'
              id="piloto"
              name="Piloto"
              labelText="Utilizador:"
              value={selectedUser}
              list={formattedListUtilizadores}
              handleChange={handleChangeUtilizador}
              multiple={false}
            />
          </div>
        )
        }
        <div className='row mb-3'>
          <div className='col-6'>
            <h1 className='userName'>{userNome}</h1>

            <div className='row'>
              <div className='col-md-4 text-center'>
                <p>Horas Possiveis: {possibleHours}</p>
              </div>
              <div className='col-md-4 text-center'>
                <p>Horas Realizadas: {horasRealizadas}</p>
              </div>
              <div className='col-md-4 text-center'>
                {percentagemHoras >= 0 && <p>{percentagemHoras.toFixed(1)}%</p>}
              </div>
            </div>
          </div>


          <div className='col-6 description'>
            <div className='row mb'>
              <div className='col-9 text-end'>
                <p>Fim de Semana</p>
              </div>
              <div className='col-3'>
                <p className='fimSemana'></p>
              </div>
            </div>

            <div className='row'>
              <div className='col-9 text-end'>
                <p>Feriados</p>
              </div>
              <div className='col-3'>
                <p className='feriados'></p>
              </div>
            </div>
            
            <div className='row'>
              <div className='col-9 text-end'>
                <p>8 Horas</p>
              </div>
              <div className='col-3'>
                <p className='normal'></p>
              </div>
            </div>

            <div className='row'>
              <div className='col-9 text-end'>
                <p>&gt; 8 Horas</p>
              </div>
              <div className='col-3'>
                <p className='extra'></p>
              </div>
            </div>
 
            <div className='row'>
              <div className='col-9 text-end'>
              <p>&lt; 8 Horas</p>
              </div>

              <div className='col-3'>
                <p className='menos'></p>
              </div>
            </div>

          </div>
        </div>
        {(listaDias.length > 0) ? (
          <div className='projetos'>
            <h2>Utilizador não possui horas inseridas</h2>
          </div>
        ) : (
          <>
            <div className='col-12'>
              <Calendar
                handleChange={handleChangeCalendario}
                inserted={dias}
                feriados={getFeriados}
              />
            </div>
            <hr></hr>
            <div>
              {dias.map((dia) => {
                for (let a = 0; a < dia.tipoDeTrabalhoHoras.length; a++) {
                  if (dia.tipoDeTrabalhoHoras[a].length > 0) {
                    for (let j = 0; j < dia.tipoDeTrabalhoHoras[a].length; j++) {
                    }
                  }
                }

                const data = new Date(dia.Data);
                const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                if (isSameMonth && isSameDate) {
                  return <Dia key={dia.Data} {...dia} horasPossiveis={possibleHours} />;
                }

                return null;
              })}
            </div>

            <div className='text-center'>
              {dias.filter((dia) => {
                const data = new Date(dia.Data);
                const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                return isSameMonth && isSameDate;
              }).length === 0 && diaSelected === 0 && (
                  <h2>Sem Horas inseridas neste mês</h2>
                )}

              {dias.filter((dia) => {
                const data = new Date(dia.Data);
                const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                return isSameMonth && isSameDate;
              }).length === 0 && diaSelected !== 0 && (
                  <h2>Sem Horas inseridas neste dia {diaSelected}</h2>
                )}
            </div>

          </>
        )
        }
      </div>

    </Wrapper >
  );
};

export default ListaHoras;