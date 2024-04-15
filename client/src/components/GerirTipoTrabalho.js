import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTipoTrabalho, createTipoTrabalho, deleteTipoTrabalho, editTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { AiFillDelete } from 'react-icons/ai';
import Wrapper from '../assets/wrappers/GerirTipoTrabalho';
import FormRowListaTipoTrabalho from './FormRowListaTipoTrabalho';
import FormRowSelectTipo from './FormRowSelectTipo';
import { toast } from 'react-toastify';

const GerirTipoTrabalho = () => {
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState({});
  const dispatch = useDispatch();
  const [callUseEffect, setCallUseEffect] = useState();
  const { user } = useSelector((store) => store.utilizador.user);

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
  //let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");


  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);
      setInitialState(tipoTrabalhoArray);
    });
  }, [callUseEffect, dispatch]);


  const handleLista = async (e) => {
    await dispatch(createTipoTrabalho(e));
    setCallUseEffect(!callUseEffect);
  }

  const deleteTT = async (id ,nome) => {
    try {
      const confirmed = window.confirm("Tem a certeza que deseja apagar o tipo de Trabalho: "+ nome +"?");
      if (confirmed) {
        const result = await dispatch(deleteTipoTrabalho(id));
        if (!result.error) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return "Tipo de Trabalho Apagado. Voltando para a pagina principal...";
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };
  
  const alterarTipoTrabalho = async (tt) => {
    if (!tt.TipoTrabalho) {
      toast.error('Por favor, não insira um tipo de trabalho vazio!');
      setVerificaAlterado(false);
      return setListaTipoTrabalho(initialState);
    }
    try {
      const result = await dispatch(editTipoTrabalho(tt));
      if (!result.error) {
        setVerificaAlterado(false);
        setCallUseEffect(!callUseEffect);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [newOption, setNewOption] = useState(''); // state to hold new option value



  const handleNewOptionChange = (event) => {
    setNewOption(event.target.value);
  };


  const handleChangeTipoTrabalho = (e, id) => {
    const value = e.target.value;
    const name = e.target.id;
    
    const updatedListaTipoTrabalho = listaTipoTrabalho.map((item, i) => {
      if (item._id === id) {
        if(name === "tipoT"){
          let valueTipo;
          if(value === "Projetos"){
            valueTipo = 1
          }else if(value === "Geral"){
            valueTipo = 2
          }else if(value === "Outro"){
            valueTipo = 3
          }else if(value === "Extra"){
            valueTipo = 5
          }else{
            valueTipo = 4
          }

          if (initialState[i]._id === id && initialState[i].tipo === valueTipo) {
            setVerificaAlterado((prevState) => ({
              ...prevState,
              [id]: false,
            }));
        } else{
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: true,
          }));
          }
          return { ...item, tipo: valueTipo };
        }
        if (initialState[i]._id === id && initialState[i].TipoTrabalho === value) {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: false,
          }));
          return { ...item, TipoTrabalho: value };
        } else {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: true,
          }));
          return { ...item, TipoTrabalho: value };
        }
      }
      return item;
    });

    setListaTipoTrabalho(updatedListaTipoTrabalho);
  };

  const handleAddToList = () => {
    if (newOption.trim() !== '') {
      const lowercaseOption = newOption.trim().toLowerCase();
      const newList = [...listaTipoTrabalho, {
        _id: listaTipoTrabalho.length + 1,
        TipoTrabalho: newOption,
        __v: 0
      }];

      if (listaTipoTrabalho.some(item => item.TipoTrabalho.toLowerCase() === lowercaseOption)) {
        alert('Este tipo de Trabalho ' + newOption + ' já existe.');
        setNewOption('');
        return;
      }
      setListaTipoTrabalho(newList);
      handleLista(newOption.trim());
      setNewOption('');
    }
  };

  return (
    <Wrapper>
      <div className={'row mb-12 text-center tittle'}>
        <h1>Tipos de Trabalho</h1>
      </div>
      <div className="listaTiposTrabalho">
        {listaTipoTrabalho.map((t, i) => (
          <div className="row text-center" key={i}>
            <div className="col-md-8 text-center tiposTrabalho">
              {
                <FormRowListaTipoTrabalho
                  type="textarea"
                  id="TipoTrabalhoProjeto"
                  name="TipoTrabalho"
                  value={t.TipoTrabalho}
                  handleChange={(e) => handleChangeTipoTrabalho(e, t._id)}
                />
                
              }
              <div className="col-md-12 text-center tiposTrabalho">
                <FormRowSelectTipo
                    type="text"
                    className="col-md-12"
                    labelText=" "
                    id="tipo"
                    name="tipoT"
                    handleChange={(e) => handleChangeTipoTrabalho(e, t._id)}
                    placeholder="Escolha um tipo"
                    value={t.tipo}
                    list={[["Projetos"], ["Geral"], ["Outro"], ["Compensação"], ["Extra"]]}
                />
                </div>
            </div>

            <div className="col-md-4 text-center">
              <div className='Buttons'>
                {verificaAlterado[t._id] === true ? (

                  <button type='submit'
                    onClick={() => alterarTipoTrabalho(t)}
                    className="btn btn-outline-primary">
                    Alterar
                  </button>

                ) : (
                  (t.tipo !== 5 && t.tipo !== 4 && t.tipo !== 6) && (
                    <button
                      type='submit'
                      onClick={() => deleteTT(t._id, t.TipoTrabalho)}
                      className="btn"
                    >
                      <AiFillDelete />
                    </button>
                  )
                )
                }
                
              </div>
            </div>
          </div>
        ))}

      </div>
        <div className={'row text-center novoTrabalho'}>
          <div className={'col-md-6 ttLabel'}>
            <div className={'form-row'}>
              <label  className="form-label">
                Adicionar Tipo de Trabalho:
              </label>
            </div>
          </div>
          <div className={'col-md-6 ttInput'}>
            <div className={'form-row'}>
              <input
                type="text"
                id={`$novoTrabalho`}
                value={newOption}
                onChange={handleNewOptionChange}
                className="form-input"
              />
              <button 
              type="button" onClick={handleAddToList}
              >
              Adicionar
              </button>
            </div>
          </div>
        </div>


    </Wrapper>
  );
};

export default GerirTipoTrabalho;