import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateUserType, listaUtilizadores, listaUsersTipo } from '@/features/utilizadores/utilizadorSlice';
import Wrapper from '@/styles/GerirUtilizador';
import FormRowSelectTipo from '@/components/forms/FormRowSelectTipo';
import { PageHeader, AppButton, LoadingState } from '@/components/ui';

const GerirUtilizadores = () => {
  const { t } = useTranslation('utilizadores');
  const [initialState, setInitialState] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState({});
  const [listaDeUtilizadores, setListaUtilizadores] = useState([]);
  const dispatch = useDispatch();
  const [callUseEffect, setCallUseEffect] = useState();
  const { user, isLoading } = useSelector((store) => store.utilizador.user);

  useEffect(() => {
    dispatch(listaUtilizadores()).then((res) => {
    // const lista = Array.isArray(res.payload.UsersAll) ? res.payload.UsersAll : [];
      
    //const lista = Array.isArray(res.payload.UsersAll) ? res.payload.UsersAll?.filter((user) => user && ((user.nome !== "Admin"))).sort((a, b) => a.nome.localeCompare(b.nome)) : [];
    const lista = Array.isArray(res.payload.UsersAll) 
    ? res.payload.UsersAll
        ?.filter((user) => user && (user.nome !== "Admin"))
        .sort((a, b) => {
          const tipoA = a.tipo;
          const tipoB = b.tipo;
  
          // Special case: if tipo is 8, it goes to the end
          if (tipoA === 8) return 1;
          if (tipoB === 8) return -1;
  
          // Compare alphabetically by user name if tipo is the same
          if (tipoA === tipoB) {
            return a.nome.localeCompare(b.nome);
          }
  
          // Compare as numbers if both are numbers, otherwise as strings
          if (typeof tipoA === 'number' && typeof tipoB === 'number') {
            return tipoA - tipoB;
          } else {
            return String(tipoA).localeCompare(String(tipoB));
          }
        })
    : [];
  
      setListaUtilizadores(lista);
      setInitialState(lista)
    });
  }, [callUseEffect ,dispatch]);

  
useEffect(() => {
    let  name = "";

    const fetchResponsaveis = async (valTipo) => {
        try {
            const res = await dispatch(listaUsersTipo(valTipo));
            return Array.isArray(res?.payload?.UsersAllTipo) ? res.payload.UsersAllTipo : [];
        } catch (error) {
            console.error('Error fetching listaUsersTipo:', error);
            return [];
        }
    };

// Im here
const updateList = async (e, id) => {
  const newList = await Promise.all(listaDeUtilizadores.map(async (item, i) => {
      let valTipo = 0;

      let newValue = item.tipo;

      switch (newValue) {
          case 2:
              break;
          case 1:
              valTipo = 5;
              break;
          case 3:
              valTipo = 6;
              break;
          case 4:
              valTipo = 7;
              break;
          case 5:
              newValue = 5;
              break;
          case 6:
              newValue = 6;
              break;
          case 7:
              newValue = 7;
              break;
          default:
              break;
      }

      let listaResponsaveis = [];
      if (valTipo > 0) {
          listaResponsaveis = await fetchResponsaveis(valTipo);
      }

      const newItem = {
          ...item,
          listaResponsaveis,
          [name]: newValue,
      };

      if (newItem._id === id) {
          const isSameAsInitial = initialState && initialState[i]._id === id && initialState[i][name] === newValue;
          setVerificaAlterado((prevState) => ({
              ...prevState,
              [id]: !isSameAsInitial,
          }));
      }
      return newItem;
  }));
  setListaUtilizadores(newList);
};

updateList();
}, [initialState]);

  //let StringListaUtilizadores = listaUtilizadores.map(item => item.Utilizador).join(",");



  const alterarUtilizador = async (utilizador) => {
    try {
      const result = await dispatch(updateUserType(utilizador));
      if (!result.error) {
        setVerificaAlterado(false);
        setCallUseEffect(!callUseEffect);
      }
    } catch (error) {
      console.error(error);
    }
  };



  const fetchResponsaveis = async (valTipo) => {
      try {
          const res = await dispatch(listaUsersTipo(valTipo));
          return Array.isArray(res?.payload?.UsersAllTipo) ? res.payload.UsersAllTipo : [];
      } catch (error) {
          console.error('Error fetching listaUsersTipo:', error);
          return [];
      }
  };

  const handleChangeUtilizador = async(e, id) => {
    let { name, value } = e.target;



    const updatedListaUtilizador = await Promise.all(listaDeUtilizadores.map(async (item, i) => {
      let valTipo = 0;
      
      if (name !== "responsavel") {
        switch (value) {
          case "Administrador":
            value = 2;
            break;
          case "Engenharia de Processos":
            valTipo = 5;
            value = 1;
            break;
          case "Laboratorio":
            value = 3;
            valTipo = 6;
            break;
          case "Recursos Humanos":
            value = 4;
            valTipo = 7;
            break;
          case "Administrador Engenharia":
            value = 5;
            break;
          case "Administrador Laboratorio":
            value = 6;
            break;
          case "Administrador Recursos Humanos":
            value = 7;
            break;
          case "Inativo":
              value = 8;
              break;
          case "Responsavel Qualidade":
            value = 9;
            break;
          case "Gestor Financeiro":
            value = 10;
            break;
          case "Comercial":
            value = 11;
            break;
          case "Logistica":
            value = 12;
            break;    
          case 1:
            valTipo = 5;
            break;
          case 3:
            valTipo = 6;
            break;
          case 4:
            valTipo = 7;
            break;
          default:
            valTipo = 0;
            break;
        }
      }

      if (item._id === id) {
        const isInitialStateUnchanged = initialState && initialState[i]._id === id && initialState[i][name] === value;

        setVerificaAlterado((prevState) => ({
          ...prevState,
          [id]: !isInitialStateUnchanged,
        }));
        if (valTipo > 0) {
          item.listaResponsaveis = await fetchResponsaveis(valTipo);
          item.responsavel = item?.listaResponsaveis[0]?._id ? item?.listaResponsaveis[0]?._id : "";
          return { ...item, listaResponsaveis: await fetchResponsaveis(valTipo), [name]: value };
        }else{
          item.responsavel = "";
          return { ...item,  [name]: value };
        }
      }
      return item;
    }));
    setListaUtilizadores(updatedListaUtilizador);
  };



  if (isLoading) {
    return <LoadingState message={t('manage.loading')} />;
  }
  return (
    <Wrapper>
      <PageHeader
        title={t('manage.title')}
        subtitle={t('manage.subtitle')}
      />
      <div className="listaTiposUtilizador">
        {listaDeUtilizadores.map((utilizador, i) => {
          if (user.id === utilizador._id) return null;
          return (
            <div className="user-card" key={i}>
              <div className="user-card-info">
                <p className="user-name">{utilizador.nome}</p>
                <p className="user-email">{utilizador.email}</p>
              </div>

              <FormRowSelectTipo
                type="text"
                className="form-row"
                labelText=" "
                id="tipo"
                name="tipo"
                handleChange={(e) => handleChangeUtilizador(e, utilizador._id)}
                placeholder={t('manage.typePlaceholder')}
                value={utilizador.tipo}
                list={[["Engenharia de Processos"], ["Laboratorio"], ["Recursos Humanos"], ["Responsavel Qualidade"], ["Gestor Financeiro"], ["Comercial"], ["Logistica"], ["Administrador"], ["Administrador Engenharia"], ["Administrador Laboratorio"], ["Administrador Recursos Humanos"], ["Inativo"]]}
              />

              {utilizador.tipo === 3 && (
                <FormRowSelectTipo
                  type="text"
                  className="form-control"
                  id="responsavel"
                  name="responsavel"
                  labelText={t('form.responsible')}
                  value={utilizador.responsavel}
                  list={utilizador?.listaResponsaveis}
                  handleChange={(e) => handleChangeUtilizador(e, utilizador._id)}
                />
              )}

              <div className="user-actions">
                {verificaAlterado[utilizador._id] === true && (
                  <AppButton size="sm" onClick={() => alterarUtilizador(utilizador)}>
                    {t('manage.change')}
                  </AppButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default GerirUtilizadores;

