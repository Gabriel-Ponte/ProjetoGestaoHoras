import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addDiasFeriasUtilizador, deleteDiasFerias, getAllFerias, getFeriasUtilizador, handleChangeFerias } from '../features/ferias/feriasSlice';
import { toast } from 'react-toastify';
import GerirHorasFeriasHeader from './GerirHorasFeriasHeader';
import GerirHorasFeriasList from './GerirHorasFeriasList';
import Loading from './Loading';
import AddFerias from './AddFerias';
import FormRowSelect from './FormRowSelect';
import Calendar from './Calendar'
import { getAllDiasUtilizador } from '../features/allDias/allDiasSlice';


const GerirHorasFerias = ({ setGerirFerias, styleButton }) => {
  const dispatch = useDispatch();

  const [listaFerias, setlistaFerias] = useState({});
  const [listaFeriasUser, setlistaFeriasUser] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [listaDias, setlistaDias] = useState({});
  const { isLoadingFerias, sort } = useSelector((store) => store.ferias);
  const [addFerias, setAddFerias] = useState(false);
  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const [getFeriados, setFeriados] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedDayCalendar, setSelectedDayCalendar] = useState();
  const [selectedUser, setSelectedUser] = useState(user?.user?.nome);
  const [selectedUserID, setSelectedUserID] = useState(user?.user?.id);
  const [selectedYear, setSelectedYear] = useState((new Date()));
  const [update, setUpdate] = useState(false);
  const [change, setChange] = useState(false);


  useEffect(() => {
    getListaFerias();
    feriadosPortugal();
    dispatch(getAllDiasUtilizador({ userNome: selectedUserID })).then((res) => {
      const listaDiasA = (typeof res.payload.diasAllUtilizador !== "undefined") ? res.payload.diasAllUtilizador : [];
      setlistaDias(listaDiasA);
    })

    getListaFeriasUser();
  }, [dispatch, change, sort, update]);

  const getListaFerias = async () => {
    try {
      const res = await dispatch(getAllFerias());

      const horasExtraArray = (res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];
  
      setlistaFerias(horasExtraArray);
    } catch (error) {
      console.error('Error Lista Ferias', error);
    }
  };
  const getListaFeriasUser = async () => {
    try {
      const res = await dispatch(getFeriasUtilizador(selectedUserID));

      const horasExtraArray = (res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];

      setlistaFeriasUser(horasExtraArray[0]);
    } catch (error) {
      console.error('Error Lista Ferias', error);
    }
  };
  const handleSort = (tipo) => {
    if (isLoadingFerias) return;
    dispatch(handleChangeFerias({ name: 'sort', value: tipo }));

  };

  const formattedListUtilizadores = useMemo(() => {
    return Array.isArray(utilizadores) ? utilizadores : [];
  }, [utilizadores]);

  const filteredUsers = useMemo(() => {
    return formattedListUtilizadores.filter((user) => user && ((user.nome !== "Admin") && user.tipo !== 8));

  }, [formattedListUtilizadores]);

  const deleteDiasFeriasConfirm = async (id) => {
    try {
      const confirmed = window.confirm("Tem a certeza que deseja os  Dias de Férias?");

      if (confirmed) {
        const result = dispatch(deleteDiasFerias(id));
        if (!result.error) {
          toast.success("Dia Apagado")
          setUpdate(!update);
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };

  const handleInsertFerias =async (values) => {
    try {
      const result = await dispatch(addDiasFeriasUtilizador(values));
      if (result) {
        toast.success("Dias adicionados!");
        setUpdate(!update);
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleChangeCalendario = useCallback ((dia, mes, ano) => {
    const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];
    setSelectedDayCalendar({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
  }, [selectedUser,selectedUserID, listaFeriasUser, selectedDates, selectedDayCalendar]);

  const handleChangeDia = ((data) => {
    const selectedData = new Date(data);
    const [selectedDia, selectedMes, selectedAno] = [selectedData.getDate(), selectedData.getMonth(), selectedData.getFullYear()];
    setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
    setSelectedDayCalendar({ dia: selectedDia, mes: selectedMes, ano: selectedAno });

  });
  const getDates = ((dates) => {
    setSelectedDates(dates)
  });
  
  const handleChangeUtilizador = ((e) => {
    const selectedID = e.target.options[e.target.selectedIndex].getAttribute('data-key');
    const { value } = e.target;
    setSelectedUserID(selectedID);
    setChange(!change);
    setSelectedUser(value);
  });


  function feriadosPortugal() {
    const date = new Date();
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
    setFeriados(feriados);

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
  const renderCalendar = useCallback(() => {
  



    const today = new Date();
    const diaSelected = selectedDay ? (selectedDay?.dia !== 0 ? selectedDay?.dia : 1) : today.getDate();
    const month = selectedDay ? selectedDay?.mes : today.getMonth();
    const year = selectedDay ? selectedDay?.ano : today.getFullYear();

    const date = new Date(year, month, diaSelected);

    return (
      <div className="row mb-12 text-center tittle">
      <div className="row ">
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <button
            type="submit"
            style={{ ...styleButton }}
            className={`btn middleButton `}
            onClick={() => setGerirFerias(false)}
          >
            Gestão de Horas Extra
          </button>
        </div>
        <div className="col-md-6">
          <button
            type="submit"
            style={{ ...styleButton }}
            className={`btn middleButton activeMainButton`}

          >
            Gestão de Férias
          </button>
        </div>

      </div>
      <div className="col-md-2"></div>
      <div className="col-md-8">
      <button
          type="submit"
          style={{ ...styleButton }}
          className={`btn middleButton `}
          onClick={() => setAddFerias(false)}
        >
              Gerir Ferias
    </button> </div>
    <div className="container mt-5">
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
          list={filteredUsers}
          handleChange={handleChangeUtilizador}
          multiple={false}
          todos={0}
        />
        <Calendar
          key={"calendar"}
          selectedDate={selectedDayCalendar}
          ferias={listaFeriasUser}
          feriados={getFeriados}
          inserting={selectedDates}
          handleChange={(dia, mes, ano) => {
            handleChangeCalendario(dia, mes, ano);
          }}
          todos={false}
          numberUsers={filteredUsers.length}
          user={selectedUser}
        />
        <AddFerias
          getDates={getDates} 
          setAddFerias={setAddFerias}
          verificaDia={handleChangeDia}
          Data={date}
          listaDias={listaDias}
          accepted={2}
          user={selectedUserID} />
      </div>
      </div>
    );
  }, [selectedUser,selectedUserID,listaFeriasUser?.length, listaFeriasUser?.length > 0 ? listaFeriasUser[0]?._id : "" , selectedDates, selectedDayCalendar]);



  if(addFerias){
  return (
      <>{renderCalendar()}</>
  )
      
}else{

  if (isLoadingFerias) {
    return (
      <div className="row mb-12 text-center tittle">
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
            <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton `}
            >
              Gestão de Horas Extra
            </button>
          </div>
          <div className="col-md-6">
            <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton activeMainButton`}
            >
              Gestão de Férias
            </button>
            
          </div></div>
        <div className="container">
          <Loading />
        </div>
      </div>
    );
  } else {
    return (
      <div className="row mb-12 text-center tittle">
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
            <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton `}
              onClick={() => setGerirFerias(false)}
            >
              Gestão de Horas Extra
            </button>
          </div>
          <div className="col-md-6">
            <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton activeMainButton`}
            >
              Gestão de Férias
            </button>
          </div>
        </div>
        <div className="col-md-2"></div>
      <div className="col-md-8">
      <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton `}
              onClick={() => setAddFerias(true)}
            >
              Adicionar Ferias
            </button>
             </div>
             <div className="col-md-2"></div>
        <div className="container">

          <div className='ferias' style={{ marginTop: "5%" }}>
            <GerirHorasFeriasHeader
              sortValue={sort}
              handleChange={handleSort}
              setSelectedYear={setSelectedYear}
              selectedYear={selectedYear}
            />
            <div className='ferias' style={{ marginTop: "25px" }}>
              {listaFerias && Object.keys(listaFerias).length > 0 && Object.values(listaFerias).map((ferias, index) => {
                const indexKey = (Object.keys(listaFerias)[index]);
                const userName = indexKey.split(",");

                const totalNumber = ferias[1].reduce((acc, numberF) => {
                  const number = numberF.Numero;
                  return acc + number;
                }, 0);
                let feriasPorDar = totalNumber - ferias[0].length;

    
                return (
                  <GerirHorasFeriasList
                    key={indexKey}
                    keyF={userName[1]}
                    userName={userName[0]}
                    totalFerias={totalNumber}
                    ferias={ferias}
                    handleInsert={handleInsertFerias}
                    feriasPorDar={feriasPorDar}
                    deleteDias={deleteDiasFeriasConfirm}
                    Ano={selectedYear.getFullYear()}
                  />
                )
              })}
            </div>
          </div>
        </div>



      </div>
    );
  }
};
}

GerirHorasFerias.propTypes = {
  setGerirFerias: PropTypes.func.isRequired,
  styleButton: PropTypes.object.isRequired,
};

export default memo(GerirHorasFerias);
