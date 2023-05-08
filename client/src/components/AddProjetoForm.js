import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/AddProjetoForm';
import { FormRow, FormRowSelect, } from '../components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createProjeto } from '../features/projetos/projetosSlice';
import { getTipoTrabalho, createTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';



const initialState = {
  Cliente: '',
  DataInicio: '',
  DataObjetivo: '',
  DataFim: '',
  Notas: '',
  OrcamentoAprovado: '',
  Nome: '',
  Tema: '',
  Acao: '',
  TipoTrabalho: '',
  Piloto: '',
  Links: '',
};

const AddProjectForm = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading } = useSelector((store) => store.projeto);
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const { isLoadingU, utilizadores, listaDeUtilizadores } = useSelector((store) => store.utilizador)
  //const { isLoading } = useSelector((store) => store.projetos);


  const dispatch = useDispatch();
  const navigate = useNavigate();


  // //////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
      setListaTipoTrabalho(Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : []);
      //setValues({ ...values, TipoTrabalho: listaTipoTrabalho });
    });
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(listaUtilizadores());
  }, [listaDeUtilizadores]);

  if (isLoadingU) {
    return <Loading />;
  }


  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];

  const handleLista = (e) => {
    dispatch(createTipoTrabalho(e));
  }

  const handleChange = (e) => {
    const nome = e.target.id;
    const value = e.target.value;
    setValues({ ...values, [nome]: value });
  };

  const handleChangeFormRowSelect = (nome, selectedOptions) => {
    if (nome === "Piloto") {
      const strSO = selectedOptions.join(",");
      setValues({ ...values, [nome]: strSO });
    } else if (nome === "TipoTrabalho") {
      const strT = selectedOptions.join(",");
      setValues({ ...values, [nome]: strT });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.Nome || !values.Tema || !values.Acao) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    try {
      const result = await dispatch(createProjeto(values));
      if(!result.error){
        setTimeout(() => {
          setValues(initialState);
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    }

  
    //navigate('/');
  };

  const toggleMember = () => {
    setValues({ ...values });
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit} className='MainForm'>
        <div className='form'>
          <FormRow
            type="text"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="nomeProjeto"
            name="Nome"
            placeholder="projeto"
            value={values.Nome}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="temaProjeto"
            name="Tema"
            placeholder="Tema"
            value={values.Tema}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="Acao"
            name="Acao"
            placeholder="Ação"
            value={values.Acao}
            handleChange={handleChange}
          />


          <FormRowSelect
            type="text"
            className="formRow" classNameLabel='formRowLabel' classNameInput='formRowInput'
            id="tiposTrabalhoProjeto"
            name="TipoTrabalho"
            placeholder="Tipos de Trabalho"
            labelText = "Tipos de Trabalho"
            value={[values.TipoTrabalho]}
            list={listaTipoTrabalho}
            handleChange={handleChangeFormRowSelect}
            handleLista={handleLista}
            multiple={true}
          />
          
          <FormRow
            type="date"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="dataInicial"
            name="DataInicio"
            placeholder="Data Inicial"
            value={values.DataInicio}
            handleChange={handleChange}
          />

          <FormRow
            type="date"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="dataObjetivo"
            name="DataObjetivo"
            placeholder="Data Objetivo"
            value={values.DataObjetivo}
            handleChange={handleChange}
          />

          <FormRow
            type="text"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="Notas"
            name="Notas"
            placeholder="Notas"
            value={values.Notas}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="Links"
            name="Links"
            placeholder="Links"
            value={values.Links}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            className="form-row" classNameLabel='form-label' classNameInput='form-input'
            id="Cliente"
            name="Cliente"
            placeholder="Cliente Projeto"
            value={values.Cliente}
            handleChange={handleChange}
          />

          <FormRowSelect
            type="text"
            className="formRow" classNameLabel='formRowLabel' classNameInput='formRowInput'
            id="piloto"
            name="Piloto"
            placeholder="Piloto"
            labelText = "Piloto"
            value={[values.Piloto]}
            list={formattedListUtilizadores}
            handleChange={handleChangeFormRowSelect}
            multiple={true}
          />

          <div id="addProjeto">
            <button type='submit' onClick={toggleMember} className="w-100 btn btn-lg btn-primary">
              Adicionar
            </button>
          </div>
          <div style={{ color: 'red' }}>{values.errorMessage}</div>
        </div>
      </form>
    </Wrapper>
  );
}

export default AddProjectForm;

//{isLoading ? 'loading...' : 'submit'}