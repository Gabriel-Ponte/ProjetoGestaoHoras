import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FormRow, FormRowCheckbox, FormRowCheckboxMultiple } from '.';

import { useNavigate } from 'react-router-dom';
import { updateProjeto } from '../features/projetos/projetosSlice';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import Loading from './Loading';
import { listaUtilizadores, toggleSidebar } from '../features/utilizadores/utilizadorSlice';
import DeleteFromDB from "./DeleteFromDB";

function VisualizarProjeto() {
  const { projeto, isLoading } = useSelector((store) => store.projeto);
  const { utilizadores, listaDeUtilizadores } = useSelector((store) => store.utilizador);
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listaUtilizadores());
   
  }, [listaDeUtilizadores, projeto, isLoading]);
  
  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores.filter(user => user.email.endsWith('isqctag.pt')) : [];
  const [values, setValues] = useState(null);

  // //////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
      setListaTipoTrabalho(Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : []);
    });
   
  }, []);


  let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");

  useEffect(() => {
    if (projeto) {
      if (projeto.projeto) {
        const initialState = {
          _id: projeto.projeto._id,
          Nome: projeto.projeto.Nome,
          Cliente: projeto.projeto.Cliente,
          DataInicio: projeto.projeto.DataInicio,
          DataObjetivo: projeto.projeto.DataObjetivo,
          DataFim: projeto.projeto.DataFim,
          Tema: projeto.projeto.Tema,
          Acao: projeto.projeto.Acao,
          TipoTrabalho: StringListaTrabalho,
          Piloto: projeto.projeto.Piloto,
          Links: projeto.projeto.Links,
          LinkResumo: projeto.projeto.LinkResumo,
          Finalizado: projeto.projeto.Finalizado,
          NumeroHorasTotal: projeto.projeto.NumeroHorasTotal,
          Resultado: projeto.projeto.Resultado,
          Notas: projeto.projeto.Notas,
        };
        setValues(initialState);

      } else {
        const initialState = {
          _id: projeto._id,
          Nome: projeto.Nome,
          Cliente: projeto.Cliente,
          DataInicio: projeto.DataInicio,
          DataObjetivo: projeto.DataObjetivo,
          DataFim: projeto.DataFim,
          Tema: projeto.Tema,
          Acao: projeto.Acao,
          TipoTrabalho: StringListaTrabalho,
          Piloto: projeto.Piloto,
          Links: projeto.Links,
          LinkResumo: projeto.LinkResumo,
          Finalizado: projeto.Finalizado,
          NumeroHorasTotal: projeto.NumeroHorasTotal,
          Resultado: projeto.Resultado,
          Notas: projeto.Notas,
        };
        setValues(initialState);
      }
    }
   
  }, [projeto, listaTipoTrabalho]);


  useEffect(() => {
    if (projeto !== null) {
      setValues(projeto.projeto);
    }
  }, [projeto]);

  const handleSubmitPiloto = async () =>{
    try {
      const result = await dispatch(updateProjeto(values));
      if (!result.error) {
        setTimeout(() => {
          dispatch(toggleSidebar(false));
          navigate('/PaginaEditarProjeto');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  
  const handleSubmit = async () => {
    if (!values.Nome || !values.Cliente || !values.DataInicio || !values.DataObjetivo || !values.Tema || !values.Piloto) {
      const requiredFields = ['Nome', 'Cliente', 'DataInicio', 'DataObjetivo', 'Tema', 'Piloto'];
      const emptyField = requiredFields.find(field => !values[field]);

      if (emptyField) {
        toast.error(`Por favor, preencha o campo obrigatório: ${emptyField}!`);
      } else {
        toast.error('Por favor, preencha todos os campos obrigatórios!');
      }
      return;
    }

    if (values.Finalizado === true && !values.DataFim) {
      values.DataFim = new Date().toISOString().slice(0, 10);
      //toast.error('Por favor insira a Data Final do Projeto!');
      //return;
    }
    if (!values.Finalizado) 
      {
      try{
        values.Resultado = false;
        values.DataFim = "";
      }catch{
        await setValues({ ...values, Resultado: false , DataFim: "" });
      }
      }
 
    try {
      const result = await dispatch(updateProjeto(values));
      if (!result.error) {
        setTimeout(() => {
          dispatch(toggleSidebar(false));
          navigate('/PaginaPrincipal');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeFormRowSelect = async(nome, selectedOptions) => {
    if (nome === "Piloto") {
      const strSO = selectedOptions.join(",");
      try{
          await setValues({ ...values, [nome]: strSO });
          values.Piloto = strSO;
        }
      catch{
          await setValues({ ...values, [nome]: strSO });
      }
      return true;
    } else if (nome === "TipoTrabalho") {
      const strT = selectedOptions.join(",");
      await setValues({ ...values, [nome]: strT });
    }
  }

  const handleChange = (e) => {
    const target = e.target;
    if (target.type === "checkbox") {

      const valueC = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      /////////////////////////////////////////////////////

      setValues({ ...values, [name]: valueC });
      return;
    }

    if (target.name === "DataFim"){
      const dataInicio  = new Date(values.DataInicio);
      const dataFim  = new Date(target.value);

      if (dataInicio > dataFim) {
        toast.error("Data Final não pode ser antes da data inicial")
        return;
      }
    }
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  if (isLoading) {
    return <Loading />;
  }

  const toggleMember = () => {
    // handle form submission logic here
    setValues({ ...values });
  };

  if (values === null || typeof values === 'undefined') {
    return <Loading />;
  }


  return (

    <div className="bg-light">
      <div className="container">
        <main>
          <div className="form m-auto">
            <h1 className="h3 mb-4 fw-normal text-center">Editar Projeto</h1>
            <form onSubmit={handleSubmit} className='form'>
              <div className="row mb-3 text-center" style={{ marginTop: '3%', textAlign: 'center' }}>
                <div className="container">
                  <FormRow
                    type="text"
                    id="nomeProjeto"
                    name="Nome"
                    label="Nome"
                    labelText = "Nome"
                    className="form-control"
                    
                    value={values.Nome}
                    handleChange={handleChange}
                    feedbackMessage="Nome"
                  />
                  {/* <FormRow
                    type="text"
                    id="temaProjeto"
                    name="Tema"
                    label="Tema"
                    labelText = "Tema"
                    className="form-control"
                    value={values.Tema}
                    handleChange={handleChange}
                    feedbackMessage="Tema"
                  /> */}
                  <FormRow
                    type="text"
                    id="nomeCliente"
                    name="Cliente"
                    label="Cliente"
                    labelText = "Cliente"
                    className="form-control"
                    value={values.Cliente}
                    handleChange={handleChange}

                  />
                  <div className="form-control">
                  <FormRow
                    type="date"
                    id="dataI"
                    name="DataInicio"
                    label="Data Inicio"
                    labelText = "Data Inicio"
                    className="row mb-3 mt-3 text-center" 
                    classNameLabel='col-md-6 text-end' 
                    classNameInput='col-md-6 text-start'
                    value={values.DataInicio ? new Date(values.DataInicio).toLocaleDateString('en-CA') : ''}
                    handleChange={handleChange}
                  />
                  </div>

                  <div className="form-control">
                  <FormRow
                    type="date"
                    id="dataO"
                    name="DataObjetivo"
                    label="Data Objetivo"
                    labelText = "Data Objetivo"
                    className="row mb-3 mt-3 text-center" 
                    classNameLabel='col-md-6 text-end' 
                    classNameInput='col-md-6 text-start'
                    value={values.DataObjetivo ? new Date(values.DataObjetivo).toLocaleDateString('en-CA') : ''}
                    handleChange={handleChange}
                  />
                  </div>
                  {
                  /*
                  <FormRowSelect
                    type="text"
                    className="formRow" classNameLabel='formRowLabel' classNameInput='formRowInput'
                    id="tiposTrabalhoProjeto"
                    name="TipoTrabalho"
                    labelText="Tipos de Trabalho"
                    placeholder="Tipos de Trabalho"
                    value={[values.TipoTrabalho]}
                    list={listaTipoTrabalho}
                    handleChange={handleChangeFormRowSelect}
                    handleLista={handleLista}
                    multiple={true}
                  />
                  */}

                  <FormRow
                    type="text"
                    className="form-control"
                    id="Acao"
                    name="Acao"
                    placeholder="Ação"
                    labelText = "Ação"
                    value={values.Acao}
                    handleChange={handleChange}
                  />

                  <FormRow
                    type="text"
                    className="form-control"
                    id="Notas"
                    name="Notas"
                    labelText = "Notas"
                    placeholder="Notas"
                    value={values.Notas}
                    handleChange={handleChange}
                  />


                  <FormRow
                    type="text"
                    className="form-control"
                    id="Links"
                    name="Links"
                    labelText = "Link A3"
                    placeholder="Links"
                    value={values.Links}
                    handleChange={handleChange}
                  />

                <FormRow
                    type="text"
                    className="form-control"
                    id="LinkResumo"
                    name="LinkResumo"
                    labelText = "Link Resumo"
                    placeholder="LinkResumo"
                    value={values.LinkResumo}
                    handleChange={handleChange}
                  />      
                  <div className="form-control">

                  <FormRowCheckboxMultiple
                    type="text"
                    className="row mb-3 mt-3 text-center" 
                    classNameLabel='col-md-3 text-end' 
                    classNameInput=' checkboxRow'
                    classNameResult='col-md-6 text-start'
                    classNameLabelResult="col-md-6 text-start"
                    id="piloto"
                    name="Piloto"
                    labelText = "Piloto:"
                    placeholder="Piloto"
                    value={values.Piloto}
                    list={formattedListUtilizadores}
                    multiple={true}
                    handleChange={handleChangeFormRowSelect}
                    handleChangeSubmit={handleSubmitPiloto}
                  />
                  </div>
                  <FormRowCheckbox
                    type="checkbox"
                    className="form-control"
                    id="Finalizado"
                    name="Finalizado"
                    placeholder="Finalizado"
                    value={values.Finalizado}
                    handleChange={handleChange}
                  />

                  {values.Finalizado === true && (
                    <div>
                      <FormRowCheckbox
                        type="checkbox"
                        className="form-control"
                        id="Resultado"
                        name="Resultado"
                        placeholder="Resultado"
                        value={values.Resultado}
                        handleChange={handleChange}
                      />
                      <FormRow
                        type="date"
                        className="form-control"
                        id="dataFinal"
                        name="DataFim"
                        placeholder="Data Final Projeto"
                        value={values.DataFim ? new Date(values.DataFim).toLocaleDateString('en-CA') : new Date().toISOString().slice(0, 10)}
                        handleChange={handleChange}
                      />
                    </div>
                  )}

                </div>
              </div>
              <div id="addProjeto">
                <button type='submit' disabled={isLoading} onClick={toggleMember} className="w-100 btn btn-lg btn-primary">
                  {isLoading ? 'loading...' : 'submit'}
                </button>


              </div>
              <div style={{ color: 'red' }}>{values.errorMessage}</div>

            </form>
          </div>
          <div className="text-end">
          <DeleteFromDB id={values._id} name={values.Nome} isLoading={isLoading} type="Projeto"/>
          </div>
        </main>
      </div>
    </div>
  );
}

export default VisualizarProjeto;
