import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUserType, listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import Wrapper from '../assets/wrappers/GerirTipoTrabalho';
import { AiFillDelete } from 'react-icons/ai';
import FormRowSelectTipo from './FormRowSelectTipo';
import { toast } from 'react-toastify';

const GerirUtilizadores = () => {
  const [initialState, setInitialState] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState({});
  const [listaDeUtilizadores, setListaUtilizadores] = useState([]);
  const dispatch = useDispatch();
  const [callUseEffect, setCallUseEffect] = useState();
  const { user , isLoading} = useSelector((store) => store.utilizador.user);

  const navigate = useNavigate();


  useEffect(() => {
    if (user && user?.tipo === 1) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate('/PaginaPrincipal');
    }
  }, [user, navigate]);


  useEffect(() => {
    dispatch(listaUtilizadores()).then((res) => {
      const lista = Array.isArray(res.payload.UsersAll) ? res.payload.UsersAll : [];
      setListaUtilizadores(lista);
      setInitialState(lista)
    });
  }, [callUseEffect]);


  //let StringListaUtilizadores = listaUtilizadores.map(item => item.Utilizador).join(",");



const handleConfirmDelete = async (id , nome) => {
  try {
    const confirmed = window.confirm("Tem a certeza que deseja apagar o utilizador: " + nome+ "?");
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
    console.log(error);
    return "Ocorreu um erro ao apagar o utilizador.";
  }
};

  const alterarUtilizador = async (utilizador) => {
    try {
      console.log(utilizador)
      const result = await dispatch(updateUserType(utilizador));
      if (!result.error) {
        setVerificaAlterado(false);
        setCallUseEffect(!callUseEffect);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeUtilizador = (e, id) => {
    let { name, value } = e.target;
    console.log(value ,name);
    const updatedListaTipoTrabalho = listaDeUtilizadores.map((item, i) => {
    if(value === "Administrador"){
        value = 2;
    }else if(value =="Funcionario"){
        value = 1;
    }
      if (item._id === id) {
        if (initialState && initialState[i]._id === id && initialState[i][name] === value) {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: false,
          }));
          console.log(value)
          return { ...item, [name]: value };
        } else {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: true,
          }));
          console.log(value)
          return { ...item, [name]: value };
        }
      }
      return item;
    });

    setListaUtilizadores(updatedListaTipoTrabalho);
  };

  return (
    <Wrapper>
      <div className={'row mb-12 text-center tittle'}>
        <h1>Utilizadores</h1>
      </div>
      <div className="listaTiposTrabalho">
      {listaDeUtilizadores.map((t, i) => {
          if (user.id !== t._id) {
          return(
          <div className="row text-center" key={i}>
            <div className="col-md-6 text-center tiposTrabalho">
              {
                <p>
                  {t.nome}
                </p>
              }
              <FormRowSelectTipo
                type="text"
                className="form-control"
                id="tipo"
                name ="tipo"
                handleChange={(e) => handleChangeUtilizador(e, t._id)}   
                placeholder ="Escolha um tipo"
                value= {t.tipo}
                list = {[["Funcionario"], ["Administrador"] ]}
      
            />
            </div>
            <div className="col-md-6 text-center">
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

