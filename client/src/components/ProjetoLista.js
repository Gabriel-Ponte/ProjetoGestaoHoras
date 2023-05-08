import { useState } from 'react';
import Wrapper from '../assets/wrappers/Projeto';
import { useDispatch } from 'react-redux';
import { getProjeto, handleChange } from '../features/projetos/projetosSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormRowListaProjetos from './FormRowListaProjetos';
import { updateProjeto } from '../features/projetos/projetosSlice';

const Projeto = ({
  _id,
  Cliente,
  DataInicio,
  DataObjetivo,
  DataFim,
  Notas,
  OrcamentoAprovado,
  Resultado,
  Nome,
  Tema,
  Acao,
  TipoTrabalho,
  Piloto,
  Links,
  NumeroHorasTotal,
  Finalizado,
  finalizado
}) => {

  const initialState = {
    _id,
    Cliente,
    DataInicio,
    DataObjetivo,
    DataFim,
    Notas,
    OrcamentoAprovado,
    Resultado,
    Nome,
    Tema,
    Acao,
    TipoTrabalho,
    Piloto,
    Links,
    NumeroHorasTotal,
    Finalizado,
    finalizado
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    _id,
    Cliente,
    DataInicio,
    DataObjetivo,
    DataFim,
    Notas,
    OrcamentoAprovado,
    Resultado,
    Nome,
    Tema,
    Acao,
    TipoTrabalho,
    Piloto,
    Links,
    NumeroHorasTotal,
    Finalizado,
    finalizado
  });
  const [verificaResultado, setVerificaResultado] = useState(1);
  const [verificaAlterado, setVerificaAlterado] = useState(false);

  const toggleEdit = async (idP) => {
    const projeto = await dispatch(getProjeto(idP));
    if (projeto.payload.projeto) {
      await dispatch(handleChange({ name: 'projeto', value: projeto.payload.projeto }));
      //navigate('/PaginaEditarProjeto');
      window.location.reload(navigate('/PaginaEditarProjeto'));
    } else {
      toast.error("Não foi possivel carregar o projeto");
    }

  };
  const handleChangeProjeto = (e) => {

    const nome = e.target.name;
    const value = e.target.value;

    console.log(value);
    console.log(initialState[nome]);
    if(initialState[nome] === value){
      setVerificaAlterado(false);
    }else{
      setVerificaAlterado(true);
    }
    setValues({ ...values, [nome]: value });

  };

  const handleChangeDateProjeto = (e) => {
    const nome = e.target.name;
    const value = e.target.value;

    const inputDateString = initialState[nome];
    const dateObject = new Date(inputDateString);
    const year = dateObject.getUTCFullYear();
    const month = dateObject.getUTCMonth() + 1;
    const day = dateObject.getUTCDate();
    const outputDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if(outputDateString === value){
      setVerificaAlterado(false);
    }else{
      setVerificaAlterado(true);
    }
    setValues({ ...values, [nome]: value });
  };

  const toggleVisualize = async (idP) => {
    await dispatch(getProjeto(idP));
    window.location.reload(navigate('/PaginaVisualizarProjeto'));
  };


  const toggleAddHoras = async (idP) => {
    await dispatch(getProjeto(idP));
    window.location.reload(navigate('/PaginaAdicionarHorasProjeto'));
  };
  const alertaDias = new Date(values.DataObjetivo).getTime() - new Date().getTime();

  let dias = Math.floor(alertaDias / (1000 * 60 * 60 * 24) + 1);

  if (Finalizado === true || !DataObjetivo) {
    dias = "";
  }
  let StringResultado;
  if (Resultado === true) {
    StringResultado = "Sucesso";
  } else (
    StringResultado = "Insucesso"
  )

  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault();
    if (!values.Nome || !values.Tema || !values.DataObjetivo || !values.Acao) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    try {
      const result = await dispatch(updateProjeto(values));
      if (!result.error) {
        setVerificaAlterado(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function getRedShade(dias) {
    if (dias < -100) {
      return '#81171B'; // Dark red
    } else if (dias < -50) {
      return '#941B0C'; // Medium red
    } else {
      return '#C75146'; // Light red
    }
  }
  
  function getGreenShade(dias) {
    if (dias > 20) {
      return '#344E41'; // Dark green
    } else if (dias > 10) {
      return '#588157'; // Medium green
    } else {
      return '#A3B18A'; // Light green
    }
  }
  
  return (
    <Wrapper>
      <div className={verificaResultado === 1 ? '' : verificaResultado ? 'resultadoProjetoP' : 'resultadoProjetoN'}>
        <div className="list-group-item">
          <div className="row mb-3 text-center">
            <div className="col-md-4 themed-grid-col">
              <div className="row mb-3 text-center">
                <div className="col-md-6 themed-grid-col">
                {finalizado === true ? (
                  <p>{values.Tema}</p>
                ):(
                  <FormRowListaProjetos
                    type="textarea"
                    id="TemaProjeto"
                    name="Tema"
                    //label="Login"
                    //className="form-control"
                    value={values.Tema}
                    handleChange={handleChangeProjeto}
                  />
                )}
                </div>
                <div className="col-md-6 themed-grid-col">
                {finalizado === true ? (
                  <p>{values.Nome}</p>
                ):(
                <FormRowListaProjetos
                    type="textarea"
                    id="NomeProjeto"
                    name="Nome"
                    //label="Login"
                    //className="form-control"
                    value={values.Nome}
                    handleChange={handleChangeProjeto}
                  />
                )
                }
                </div>
              </div>
            </div>
            <div className="col-md-4 themed-grid-col">
              <div className="row mb-3 text-center">
                <div className="col-md-6 themed-grid-col">
                {finalizado === true ? (
                  <p>{values.Acao}</p>
                ):(
                  <FormRowListaProjetos
                  type="textarea"
                  id="AcaoProjeto"
                  name="Acao"
                  //label="Login"
                  //className="form-control"
                  value={values.Acao}
                  handleChange={handleChangeProjeto}
                />
                )
              }
                </div>
                <div className="col-md-6 themed-grid-col">
                {finalizado === true ? (
                  <p>{values.Notas}</p>
                ):
                (                
                <FormRowListaProjetos
                  type="textarea"
                  id="NotasProjeto"
                  name="Notas"
                  //label="Login"
                  //className="form-control"
                  value={values.Notas}
                  handleChange={handleChangeProjeto}
                />)
                  }
                </div>
              </div>
            </div>
            <div className="col-md-3 themed-grid-col">
              <div className="row mb-3 text-center">
                {finalizado === true ? (
                  <>
                    <div className="col-md-6 themed-grid-col">
                      <p>{DataFim ? new Date(DataFim).toLocaleDateString('en-CA') : ''}</p>
                    </div>
                    <div className="col-md-6 themed-grid-col">
                      <p>{StringResultado}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-6 themed-grid-col">
                    <FormRowListaProjetos
                    type="Date"
                    id="DataObjetivoProjeto"
                    name="DataObjetivo"
                    //label="Login"
                    //className="form-control"
                    value={values.DataObjetivo ? new Date(values.DataObjetivo).toLocaleDateString('en-CA') : ''}
                    handleChange={handleChangeDateProjeto}
                  />
                  {
                 //<p>{DataObjetivo ? new Date(DataObjetivo).toLocaleDateString('en-CA') : ''}</p>
                  }
                   </div>
                   <div className="col-md-6">
                    <div className="col-md-6 dias  text-center" style={{ backgroundColor: dias < 0 ? getRedShade(dias) : getGreenShade(dias) }}>
                    <p>{dias}</p>
                  </div>
                  </div>
                  </>

                )
                }
              </div>
            </div>
            
            <div className="col-md-1 themed-grid-col">
            {
              verificaAlterado === true ? (
                <>
                  <div className="row mb-3 text-center">
                  </div> 
                  <div className='row mb-3 text-center'>
                    <div className='col-md-12 themed-grid-col'>
                      <button
                        type='button'
                        className='btn sbmt-btn'
                        onClick={handleSubmit}
                      >
                        Alterar
                      </button>
                    </div>
                  </div>
                  
                  </>
              ) :
                (
                  <>
                      <div className='row mb-3 text-center'>
                        <button
                          type='button'
                          className='btn edit-btn'
                          onClick={() => toggleEdit(_id)}
                        >
                          Editar
                        </button>
                      </div>
                      <div className='row mb-3 text-center'>
                        <button
                          type='button'
                          className='btn edit-btn'
                          onClick={() => toggleVisualize(_id)}
                        >
                          Visualizar
                        </button>
                      </div>
   
                      {finalizado !== true && (
                      <div className='row mb-3 text-center'>
                        <button
                          type='button'
                          className='btn edit-btn'
                          onClick={() => toggleAddHoras(_id)}
                        >
                          Adicionar Horas
                        </button>
                      </div>
                      )}
                  </>
                )
            }
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
    </Wrapper>
  );
};
export default Projeto;
