import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUserType, listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import Wrapper from '../assets/wrappers/GerirUtilizador';
import { AiFillDelete } from 'react-icons/ai';
import FormRowSelectTipo from './FormRowSelectTipo';
import { toast } from 'react-toastify';
import Loading from './Loading';

const GerirUtilizadores = () => {
  const [initialState, setInitialState] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState({});
  const [listaDeUtilizadores, setListaUtilizadores] = useState([]);
  const dispatch = useDispatch();
  const [callUseEffect, setCallUseEffect] = useState();
  const { user, isLoading } = useSelector((store) => store.utilizador.user);

  const navigate = useNavigate();


  useEffect(() => {
    if (user && (user?.tipo === 1 )) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate('/PaginaPrincipal');
    }else if (user && user?.tipo === 3 || user?.tipo === 4){
      toast.error("Sem permissões para aceder a esta página!");
      navigate('/PaginaAdicionarHoras');
    }
  }, [user, navigate]);


  useEffect(() => {
    dispatch(listaUtilizadores()).then((res) => {
      const lista = Array.isArray(res.payload.UsersAll) ? res.payload.UsersAll : [];
      setListaUtilizadores(lista);
      setInitialState(lista)
    });
  }, [callUseEffect ,dispatch]);


  //let StringListaUtilizadores = listaUtilizadores.map(item => item.Utilizador).join(",");



  const handleConfirmDelete = async (id, nome) => {
    try {
      const confirmed = window.confirm("Tem a certeza que deseja apagar o utilizador: " + nome + "?");
      if (confirmed) {
        const result = await dispatch(deleteUser(id));
        if (!result.error) {
          setTimeout(() => {
            navigate('/PaginaPrincipal');
          }, 2000);
          return "Utilizador Apagado. Voltando para a pagina principal...";
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o utilizador.";
    }
  };

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

  const handleChangeUtilizador = (e, id) => {
    let { name, value } = e.target;
    const updatedListaUtilizador = listaDeUtilizadores.map((item, i) => {

      if(value === "Administrador"){
        value = 2;
      }else if(value === "Engenharia de Processos"){
        value = 1;
      }else if(value === "Laboratorio"){
        value = 3;
      }else if(value === "Outro"){
        value = 4;
      }else if(value === "Administrador Engenharia"){
        value = 5;
      }else if(value === "Administrador Laboratorio"){
        value = 6;
      }




      if (item._id === id) {
        if (initialState && initialState[i]._id === id && initialState[i][name] === value) {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: false,
          }));
          return { ...item, [name]: value };
        } else {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: true,
          }));
          return { ...item, [name]: value };
        }
      }
      return item;
    });

    setListaUtilizadores(updatedListaUtilizador);
  };

  if(isLoading){
    return <Loading />
  }
  return (
    <Wrapper>
      <div className={'row mb-12 text-center tittle'}>
        <h1>Gerir Utilizadores</h1>
      </div>
      <div className="listaTiposUtilizador">
        {listaDeUtilizadores.map((t, i) => {
          if (user.id !== t._id) {
            return (
              <div className="row text-center" key={i}>
                <div className="col-md-8 text-center tiposUtilizador">
                  {
                    <>
                      <p>
                        {t.nome}
                      </p>
                      <p>
                        {t.email}
                      </p>
                    </>
                  }
                  <FormRowSelectTipo
                    type="text"
                    className="form-row"
                    labelText=" "
                    id="tipo"
                    name="tipo"
                    handleChange={(e) => handleChangeUtilizador(e, t._id)}
                    placeholder="Escolha um tipo"
                    value={t.tipo}
                    list={[["Engenharia de Processos"], ["Laboratorio"] ,["Outro"] , ["Administrador"] , ["Administrador Engenharia"] , ["Administrador Laboratorio"]]}
                  />

                </div>
                <div className="col-md-4 text-center">
                  <div className='Buttons'>
                    {verificaAlterado[t._id] === true ? (
                      <button type='submit'
                        onClick={() => alterarUtilizador(t)}
                        className="btn btn-outline-primary">
                        Alterar
                      </button>
                    ) : (
                      <button type='submit'
                        onClick={() => handleConfirmDelete(t._id, t.nome)}
                        className="btn">
                        <AiFillDelete />
                      </button>

                    )
                    }
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        }
        )
        }
      </div>
    </Wrapper>
  );
};

export default GerirUtilizadores;

