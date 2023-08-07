import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/AddProjetoForm';
import { FormRow, FormRowSelect, FormRowCheckboxMultiple, FormRowCheckboxListaClientes } from '../components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createProjeto , getClientes } from '../features/projetos/projetosSlice';
//import { getTipoTrabalho, createTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { listaUtilizadores, toggleSidebar} from '../features/utilizadores/utilizadorSlice';
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
  const { listaClientes } = useSelector((store) => store.projeto);
  //const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const { isLoadingU, utilizadores, listaDeUtilizadores } = useSelector((store) => store.utilizador)
  //const { isLoading } = useSelector((store) => store.projetos);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // //////////////////////////////////////////////////////////////////////////////////
  //useEffect(() => {
  //  dispatch(getTipoTrabalho()).then((res) => {
  //    setListaTipoTrabalho(Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : []);
      //setValues({ ...values, TipoTrabalho: listaTipoTrabalho });
  //  });
  //}, []);

  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(listaUtilizadores());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaDeUtilizadores]);

  useEffect(() => {
    dispatch(getClientes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaClientes]);

  if (isLoadingU) {
    return <Loading />;
  }


  //const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];
  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores.filter(user => user.email.endsWith('isqctag.pt')) : [];



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
    } else if (nome === "Cliente" && selectedOptions.length > 1 && selectedOptions !== null) {
      console.log(selectedOptions)
      const strC = selectedOptions;
      setValues({ ...values, [nome]: strC });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.Nome || !values.Cliente || !values.DataInicio || !values.DataObjetivo || !values.Tema) {
      const requiredFields = ['Nome', 'Cliente', 'DataInicio', 'DataObjetivo', 'Tema', 'Piloto'];
      const emptyField = requiredFields.find(field => !values[field]);

      if (emptyField) {
        toast.error(`Por favor, preencha o campo obrigatório: ${emptyField}!`);
      } else {
        toast.error('Por favor, preencha todos os campos obrigatórios!');
      }
      return;
    }

    try {
      const result = await dispatch(createProjeto(values));
      if(!result.error){
        setTimeout(() => {
          dispatch(toggleSidebar(false));
          navigate('/PaginaPrincipal');
        }, 2000);
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
      <h1 className="h3 mb-4 fw-normal text-center">Adicionar Projeto</h1>
        <div className='form'>
          
          <FormRow
            type="text"
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            id="nomeProjeto"
            name="Nome"
            labelText="Nome:"
            placeholder="projeto"
            value={values.Nome}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            id="temaProjeto"
            name="Tema"
            labelText="Tema:"
            placeholder="Tema"
            value={values.Tema}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            id="Acao"
            name="Acao"
            labelText="Ação:"
            placeholder="Ação"
            value={values.Acao}
            handleChange={handleChange}
          />

          {
          //   <FormRow
          //   type="text"
          //   className="row mb-3 text-center" 
          //   classNameLabel='col-md-3 text-end' 
          //   classNameInput='col-md-9'
          //   id="Cliente"
          //   name="Cliente"
          //   labelText="Cliente:"
          //   placeholder="Cliente Projeto"
          //   value={values.Cliente}
          //   handleChange={handleChange}
          // />
          }

          <FormRowCheckboxListaClientes
            type="text"
            className="row mb-3 mt-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput=' checkboxRow'
            classNameResult='col-md-6 text-start'
            classNameLabelResult="col-md-6 text-start"
            id="Cliente"
            name="Cliente"
            placeholder="Cliente"
            labelText = "Cliente: "
            value={[values.Cliente]}
            list={listaClientes}
            handleChange={handleChangeFormRowSelect}
            multiple={false}
          />

          <FormRow
            type="date"
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            id="dataInicial"
            name="DataInicio"
            placeholder="Data Inicial"
            labelText="Data Inicial:"
            value={values.DataInicio}
            handleChange={handleChange}
          />

          <FormRow
            type="date"
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            id="dataObjetivo"
            name="DataObjetivo"
            labelText="Data Objetivo:"
            placeholder="Data Objetivo"
            value={values.DataObjetivo}
            handleChange={handleChange}
          />

          <FormRow
            type="text"
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            id="Notas"
            name="Notas"
            labelText="Notas:"
            placeholder="Notas"
            value={values.Notas}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            id="Links"
            name="Links"
            labelText="Links:"
            placeholder="Links"
            value={values.Links}
            handleChange={handleChange}
          />


          <FormRowCheckboxMultiple
            type="text"
            className="row mb-3 mt-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput=' checkboxRow'
            classNameResult='col-md-6 text-start'
            classNameLabelResult="col-md-6 text-start"
            id="piloto"
            name="Piloto"
            placeholder="Piloto"
            labelText = "Piloto:"
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