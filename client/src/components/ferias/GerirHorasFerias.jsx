import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addDiasFeriasUtilizador, deleteDiasFerias, getAllFerias, getFeriasUtilizador, handleChangeFerias } from '@/features/ferias/feriasSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import GerirHorasFeriasHeader from '@/components/ferias/GerirHorasFeriasHeader';
import GerirHorasFeriasList from '@/components/ferias/GerirHorasFeriasList';
import Loading from '@/components/common/Loading';
import AddFerias from '@/components/ferias/AddFerias';
import FormRowSelect from '@/components/forms/FormRowSelect';
import Calendar from '@/components/dias/Calendar'
import { getAllDiasUtilizador } from '@/features/allDias/allDiasSlice';
import { AppButton } from '@/components/ui';


const GerirHorasFerias = ({ setGerirFerias }) => {
  const { t } = useTranslation('ferias');
  const dispatch = useDispatch();

  const [listaFerias, setListaFerias] = useState({});
  const [listaFeriasUser, setListaFeriasUser] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [listaDias, setListaDias] = useState({});
  const { isLoadingFerias, sort } = useSelector((store) => store.ferias);
  const [addFerias, setAddFerias] = useState(false);
  const { user, utilizadores } = useSelector((store) => store.utilizador);
  const [listaFeriados, setListaFeriados] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedDayCalendar, setSelectedDayCalendar] = useState();
  const [selectedUser, setSelectedUser] = useState(user?.user?.nome);
  const [selectedUserID, setSelectedUserID] = useState(user?.user?.id);
  const [selectedYear, setSelectedYear] = useState(() => new Date());
  const [update, setUpdate] = useState(false);
  const [change, setChange] = useState(false);


  const memoizedIsLoading = useMemo(() => {
    return isLoadingFerias;
  }, [isLoadingFerias]);


  useEffect(() => {

    getListaFerias();
    feriadosPortugal();
    dispatch(getAllDiasUtilizador({ userNome: selectedUserID })).then((res) => {
      const listaDiasA = (typeof res.payload.diasAllUtilizador !== "undefined") ? res.payload.diasAllUtilizador : [];
      setListaDias(listaDiasA);
    })

    getListaFeriasUser();
  }, [dispatch, change, sort, update]);

  const getListaFerias = async () => {
    try {
      const res = await dispatch(getAllFerias());

      const horasExtraArray = (res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];
  
      setListaFerias(horasExtraArray);
    } catch (error) {
      console.error('Error Lista Ferias', error);
    }
  };

  const getListaFeriasUser = async () => {
    try {
      const res = await dispatch(getFeriasUtilizador(selectedUserID));
      const horasExtraArray = (res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];

      setListaFeriasUser(horasExtraArray[0]);
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
    if(user.user.nome !== "Admin"){
      return formattedListUtilizadores.filter((user) => user && ((user.nome !== "Admin") && user.tipo !== 8)).sort((a, b) => a.nome.localeCompare(b.nome));
    } else{
      return formattedListUtilizadores.filter((user) => user && (user.tipo !== 8)).sort((a, b) => a.nome.localeCompare(b.nome));
    }
 
  }, [formattedListUtilizadores]);

  const deleteDiasFeriasConfirm = async (id) => {
    try {
      const confirmed = window.confirm(t('confirm.deleteDays'));

      if (confirmed) {
        const result = dispatch(deleteDiasFerias(id));
        if (!result.error) {
          toast.success(t('toast.dayDeleted'))
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
        toast.success(t('toast.daysAdded'));
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


  const updateCalendar = (() => {
    setUpdate(!update);
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
    setListaFeriados(feriados);

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
          <AppButton variant="secondary" fullWidth onClick={() => setGerirFerias(false)}>{t('tabs.manageRequests')}</AppButton>
        </div>
        <div className="col-md-6">
          <AppButton variant="primary" fullWidth>{t('tabs.manageVacation')}</AppButton>
        </div>

      </div>
      <div className="col-md-2"></div>
      <div className="col-md-8">
      <AppButton variant="secondary" fullWidth onClick={() => setAddFerias(false)}>{t('actions.manageVacation')}</AppButton> </div>
    <div className="container mt-5">
        <FormRowSelect
          type="text"
          className="row mb-3 text-center"
          classNameLabel='col-md-3 text-end'
          classNameInput='col-md-9'
          classNameResult='col-md-6 text-start'
          id="piloto"
          name="Piloto"
          labelText={t('fields.user')}
          value={selectedUser}
          list={filteredUsers}
          handleChange={handleChangeUtilizador}
          multiple={false}
          blocked={memoizedIsLoading}
          todos={0}
        />
        <Calendar
          key={"calendar"}
          selectedDate={selectedDayCalendar}
          ferias={listaFeriasUser}
          feriados={listaFeriados}
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
          user={selectedUserID}
          updateCalendar={updateCalendar} />
  
      </div>
      
      </div>
    );
    // `t` is a dep: react-i18next hands back a new `t` on language change, and this
    // memoized subtree renders translated labels — without it they would stay stale.
  }, [selectedUser,selectedUserID,listaFeriasUser?.length, listaFeriasUser?.length > 0 ? listaFeriasUser[0]?._id : "" , selectedDates, selectedDayCalendar, memoizedIsLoading ,update, t]);



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
            <AppButton variant="secondary" fullWidth>{t('tabs.manageRequests')}</AppButton>
          </div>
          <div className="col-md-6">
            <AppButton variant="primary" fullWidth>{t('tabs.manageVacation')}</AppButton>

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
            <AppButton variant="secondary" fullWidth onClick={() => setGerirFerias(false)}>{t('tabs.manageRequests')}</AppButton>
          </div>
          <div className="col-md-6">
            <AppButton variant="primary" fullWidth>{t('tabs.manageVacation')}</AppButton>
          </div>
        </div>
        <div className="col-md-2"></div>
      <div className="col-md-8">
      <AppButton variant="secondary" fullWidth onClick={() => setAddFerias(true)}>{t('actions.addVacation')}</AppButton>
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
};

export default memo(GerirHorasFerias);
