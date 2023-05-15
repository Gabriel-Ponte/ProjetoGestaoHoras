import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTipoTrabalho, createTipoTrabalho, deleteTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { AiFillDelete } from 'react-icons/ai';
import Wrapper from '../assets/wrappers/FormRowSelect';
import FormRowListaProjetos from './FormRowListaProjetos';

const GetTipoTrabalho = () => {
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const dispatch = useDispatch();

  let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");

  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
      setListaTipoTrabalho(Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : []);
    });
  }, []);

  const handleLista = (e) => {
    dispatch(createTipoTrabalho(e));
  }


  let separatedArray;
  if (Array.isArray(StringListaTrabalho)) {
    separatedArray = StringListaTrabalho.length > 0 ? StringListaTrabalho[0].split(/[,\/]/) : [];
  } else {
    separatedArray = StringListaTrabalho.split(/[,\/]/);
  }

  const [newOption, setNewOption] = useState(''); // state to hold new option value



  const handleNewOptionChange = (event) => {
    setNewOption(event.target.value);
  };


  const deleteTT = async (id) => {
    //console.log(id);
    await dispatch(deleteTipoTrabalho(id));

  }


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
      <div className={'form-row'}>


        <h1>Tipos de Trabalho</h1>
        {listaTipoTrabalho.map((t, i) => (
          <div className="row text-center" key={i}>
            <div className="col-md-12 text-center">
              <div className="col-md-4 text-center">
                <p >{t.TipoTrabalho}</p>

              {/*<FormRowListaProjetos
                    type="textarea"
                    id="ClienteProjeto"
                    name="Cliente"
                    value={t.TipoTrabalho}
                    handleChange={handleChangeProjeto}
                  />
              */}     
               </div>
              <div className="col-mb-4 text-center">
                <button type='submit'
                  onClick={() => deleteTT(t._id)}
                  className="btn">
                  <AiFillDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className={'row mb-12 text-center'}>
          <div className={'row mb-6 text-center'}>
            <div className={'form-row'}>
              <label htmlFor={`-new-option`} className="form-label">
                Adicionar Tipo de Trabalho:
              </label>

            </div>
          </div>
          <div className={'row mb-6 text-center'}>
            <div className={'form-row'}>
              <input
                type="text"
                id={`$-new-option`}
                value={newOption}
                onChange={handleNewOptionChange}
                className="form-input"
              />
              <button type="button" onClick={handleAddToList}>
                Adicionar
              </button>
            </div>
          </div>
        </div>

      </div>
    </Wrapper>
  );
};

export default GetTipoTrabalho;