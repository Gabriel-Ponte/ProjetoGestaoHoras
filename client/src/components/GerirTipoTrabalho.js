import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTipoTrabalho, createTipoTrabalho, deleteTipoTrabalho, editTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { AiFillDelete } from 'react-icons/ai';
import Wrapper from '../assets/wrappers/GerirTipoTrabalho';
import FormRowListaTipoTrabalho from './FormRowListaTipoTrabalho';
import { toast } from 'react-toastify';

const GetTipoTrabalho = () => {
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState({});
  const dispatch = useDispatch();
  const [callUseEffect, setCallUseEffect] = useState();


  let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");


  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);
      setInitialState(tipoTrabalhoArray)
    });
  }, [callUseEffect]);


  const handleLista = async (e) => {
    await dispatch(createTipoTrabalho(e));
    setCallUseEffect(!callUseEffect);
  }

  const deleteTT = async (id) => {
    await dispatch(deleteTipoTrabalho(id));
    setCallUseEffect(!callUseEffect);
  }

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
      console.log(error);
    }
  };

  const [newOption, setNewOption] = useState(''); // state to hold new option value



  const handleNewOptionChange = (event) => {
    setNewOption(event.target.value);
  };





  const handleChangeTipoTrabalho = (e, id) => {
    const value = e.target.value;

    const updatedListaTipoTrabalho = listaTipoTrabalho.map((item, i) => {
      if (item._id === id) {
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
            <div className="col-md-6 text-center tiposTrabalho">
              {
                <FormRowListaTipoTrabalho
                  type="textarea"
                  id="TipoTrabalhoProjeto"
                  name="TipoTrabalho"
                  value={t.TipoTrabalho}
                  handleChange={(e) => handleChangeTipoTrabalho(e, t._id)}
                />
              }
            </div>
            <div className="col-md-6 text-center">
              <div className='Buttons'>
                {verificaAlterado[t._id] === true ? (

                  <button type='submit'
                    onClick={() => alterarTipoTrabalho(t)}
                    className="btn btn-outline-primary">
                    Alterar
                  </button>

                ) : (

                  <button type='submit'
                    onClick={() => deleteTT(t._id)}
                    className="btn">
                    <AiFillDelete />
                  </button>
                )
                }
              </div>
            </div>
          </div>
        ))}

      </div>
        <div className={'row text-center novoTrabalho'}>
          <div className={'col-md-6 text-end'}>
            <div className={'form-row'}>
              <label  className="form-label">
                Adicionar Tipo de Trabalho:
              </label>
            </div>
          </div>
          <div className={'col-md-6 text-start'}>
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

export default GetTipoTrabalho;