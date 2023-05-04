import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Wrapper from '../assets/wrappers/LoginPage';
import { FormRow, FormRowSelect, FormRowCheckbox} from '../components';
import { useNavigate } from 'react-router-dom';
import { updateProjeto } from '../features/projetos/projetosSlice';
import { getTipoTrabalho, createTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import Loading from './Loading';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';


function VisualizarProjeto() {
    const { projeto, isLoading } = useSelector((store) => store.projeto);
    const { utilizadores, listaDeUtilizadores } = useSelector((store) => store.utilizador)
    const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(listaUtilizadores());
      }, [listaDeUtilizadores, projeto, isLoading]);
  
    const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];
  
    const [values, setValues] = useState(null);
    // //////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        dispatch(getTipoTrabalho()).then((res) => {
          setListaTipoTrabalho(Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : []);
        });
      }, []);

    const handleLista = (e) => {
        dispatch(createTipoTrabalho(e));
      }


    useEffect(() => {
      if (projeto) {
        const initialState = {
          _id: projeto.projeto._id,
          Nome: projeto.projeto.Nome,
          Cliente: projeto.projeto.Cliente,
          DataInicio: projeto.projeto.DataInicio,
          DataObjetivo: projeto.projeto.DataObjetivo,
          DataFim: projeto.projeto.DataFim,
          Tema: projeto.projeto.Tema,
          Acao: projeto.projeto.Acao,
          TipoTrabalho: projeto.projeto.TipoTrabalho,
          Piloto: projeto.projeto.Piloto,
          Links: projeto.projeto.Links,
          Finalizado: projeto.projeto.Finalizado,
          NumeroHorasTotal: projeto.projeto.NumeroHorasTotal,
          Resultado: projeto.projeto.Resultado,
          Notas: projeto.projeto.Notas,
        };
        setValues(initialState);
      }
    }, [projeto]);

    useEffect(() => {
        if (projeto !== null) {
          setValues(projeto.projeto);
        }
      }, [projeto]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!values.Nome || !values.Cliente || !values.DataInicio 
          || !values.DataObjetivo || !values.Tema || !values.Piloto) {
          toast.error('Por favor, preencha todos os campos obrigatórios!');
          return;
      }
      if(values.Finalizado === true && !values.DataFim){
        toast.error('Por favor insira a Data Final do Projeto!');
        return;
      }
      if(!values.Finalizado){
        values.Resultado = false;
        values.DataFim = "";
      }
      console.log(values)
      //dispatch(updateProjeto(values));
      //navigate('/');
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

    const handleChange = (e) => {
        const target = e.target;
        if(target.type === "checkbox"){
            
            const valueC = target.type === 'checkbox' ? target.checked : target.value;
            const name  = target.name;

            /////////////////////////////////////////////////////

            setValues({ ...values, [name]: valueC });
            return;
        }
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    };

    if (isLoading) {
        return <div>Loading...</div>
    }

    const toggleMember = e => {
      // handle form submission logic here
      setValues({ ...values });
    };

    if (values === null) {
        if (projeto === null){
            return (
                <Wrapper>
                  <h2>Sem projeto para Editar</h2>
                </Wrapper>
              );
        }
        else{
            return null;
        }
    }

    return (

        <div className="bg-light">
            <div className="container">
                <main>
                    <div className="form m-auto">
                        <h1 className="h3 mb-3 fw-normal">Editar Projetos</h1>
                        <form onSubmit={handleSubmit} className='form'>
                            <div className="row mb-3 text-center" style={{ marginTop: '3%', textAlign: 'center' }}>
                                <div className="container">
                                    <FormRow
                                        type="text"
                                        id="nomeProjeto"
                                        name="Nome"
                                        label="Nome"
                                        className="form-control"
                                        value={values.Nome}
                                        handleChange={handleChange}
                                        feedbackMessage="Tema"
                                    />
                                    <FormRow
                                        type="text"
                                        id="temaProjeto"
                                        name="Tema"
                                        label="Tema"
                                        className="form-control"
                                        value={values.Tema}
                                        handleChange={handleChange}
                                        feedbackMessage="Tema"
                                    />
                                    <FormRow
                                        type="text"
                                        id="nomeCliente"
                                        name="Cliente"
                                        label="Cliente"
                                        className="form-control"
                                        value={values.Cliente}
                                        handleChange={handleChange}
                                        feedbackMessage="Cliente"
                                    />
                                    <FormRow
                                        type="date"
                                        id="dataI"
                                        name="DataInicio"
                                        label="Data Inicio"
                                        className="form-control"
                                        value={values.DataInicio ? new Date(values.DataInicio).toLocaleDateString('en-CA') : ''}
                                        handleChange={handleChange}
                                        feedbackMessage="Data Inicio"
                                    />
                                    <FormRow
                                        type="date"
                                        id="dataO"
                                        name="DataObjetivo"
                                        label="Data Objetivo"
                                        className="form-control"
                                        value={values.DataObjetivo ? new Date(values.DataObjetivo).toLocaleDateString('en-CA') : ''}
                                        handleChange={handleChange}
                                        feedbackMessage="Data Objetivo"
                                    />
                                    <FormRowSelect
                                        type="text"
                                        className="formRow" classNameLabel='formRowLabel' classNameInput='formRowInput'
                                        id="tiposTrabalhoProjeto"
                                        name="TipoTrabalho"
                                        labelText = "Tipos de Trabalho"
                                        placeholder="Tipos de Trabalho"
                                        value={[values.TipoTrabalho]}
                                        list={listaTipoTrabalho}
                                        handleChange={handleChangeFormRowSelect}
                                        handleLista={handleLista}
                                        multiple={true}
                                    />
                                    <FormRowSelect
                                        type="text"
                                        className="form-control"
                                        id="piloto"
                                        name="Piloto"
                                        labelText = "Piloto"
                                        placeholder="Piloto"
                                        value={values.Piloto}
                                        list={formattedListUtilizadores}
                                        multiple={true}
                                        handleChange={handleChangeFormRowSelect}
                                    />

                                    <FormRow
                                        type="text"
                                        className="form-control"
                                        id="Acao"
                                        name="Acao"
                                        placeholder="Ação"
                                        value={values.Acao}
                                        handleChange={handleChange}
                                    />

                                    <FormRow
                                        type="text"
                                        className="form-control"
                                        id="Notas"
                                        name="Notas"
                                        placeholder="Notas"
                                        value={values.Notas}
                                        handleChange={handleChange}
                                    />

                                
                                        <FormRow
                                            type="text"
                                            className="form-control"
                                            id="Links"
                                            name="Links"
                                            placeholder="Links"
                                            value={values.Links}
                                            handleChange={handleChange}
                                        />

                                       
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
                                                <div className="row mb-3">
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
                                                    value={values.DataFim ? new Date(values.DataFim).toLocaleDateString('en-CA') : ''}
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
                </main>
            </div>
        </div>
    );
}

export default VisualizarProjeto;
