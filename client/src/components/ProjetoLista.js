import { useState } from 'react';
import Wrapper from '../assets/wrappers/Projeto';
import { useDispatch, useSelector } from 'react-redux';
import { getProjeto, handleChange } from '../features/projetos/projetosSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormRowListaProjetos from './FormRowListaProjetos';
import { updateProjeto } from '../features/projetos/projetosSlice';
import { FcCheckmark } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';

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
  finalizado,
  utilizadores,
  handleAlterado,
}) => {

  const [initialState, setInitialState] = useState({
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
    finalizado,
    utilizadores,
    handleAlterado
  });

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
    finalizado,
    utilizadores,
    handleAlterado
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
    if(initialState[nome] === value){
      handleAlterado(false);
      setVerificaAlterado(false);
    }else{
      if(verificaAlterado === false){
      handleAlterado(true);
      }
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
      handleAlterado(false);
      setVerificaAlterado(false);
    }else{
      if(verificaAlterado === false){
        handleAlterado(true);
        }
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
  let dias;
  const alertaDias = new Date(values.DataObjetivo).getTime() - new Date().getTime();
  dias = Math.floor(alertaDias / (1000 * 60 * 60 * 24) + 1);
  if (isNaN(dias)) {
    dias = null;
  }


  if (Finalizado === true || !DataObjetivo) {
    dias = "";
  }

  let StringResultado;
  if (Resultado === true) {
    StringResultado = <FcCheckmark className='reactIcon'/>;
  } else (
    StringResultado = <IoMdClose className='reactIcon'/>
  )

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.Nome || !values.Cliente || !values.Acao) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    try {
      const result = await dispatch(updateProjeto(values));
      if (!result.error) {
        handleAlterado(false);
        setVerificaAlterado(false);
        setInitialState(values)
      }
    } catch (error) {
      toast.error('Erro ao atualizar!');
      console.error(error);
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

  const PilotosList = Array.isArray(values.Piloto) ? (values.Piloto.length > 0 ? values.Piloto[0].split(/[,\/]/) : []) : values.Piloto.split(/[,\/]/);
  const listUpdated = [...PilotosList];

  for (let a = 0; a < PilotosList.length; a++) {
    for (let i = 0; i < utilizadores.length; i++) {
      if (PilotosList[a] === utilizadores[i]._id) {
        PilotosList[a] = utilizadores[i].nome;
        break;
      }
      if (PilotosList[a] === utilizadores[i].login && utilizadores[i].login.length < 4) {
        PilotosList[a] = utilizadores[i].nome;
        listUpdated[a] = utilizadores[i]._id;
        break;
      }
    }}
  return (
    <Wrapper>
      <div className={verificaResultado === 1 ? '' : verificaResultado ? 'resultadoProjetoP' : 'resultadoProjetoN'}>
        <div className="listaProjetos">
          <div className="row ">


            <div className="col-md-3 themed-grid-col">
              <div className="row text-center">
                <div className="col-md-6 themed-grid-col">
                {finalizado === true ? (
                  <div className='Cliente'>
                  <h5>{values.Cliente}</h5>
                  </div>
                ):(
                  <FormRowListaProjetos
                    type="textarea"
                    id="ClienteProjeto"
                    name="Cliente"
                    value={values.Cliente}
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
                    value={values.Nome}
                    handleChange={handleChangeProjeto}
                  />
                )
                }
                </div>
              </div>
            </div>


            <div className="col-md-6 themed-grid-col">
              <div className="row text-center">
                <div className="col-md-5 themed-grid-col">
                {finalizado === true ? (
                  <p>{values.Acao}</p>
                ):(
                  <FormRowListaProjetos
                  type="textarea"
                  id="AcaoProjeto"
                  name="Acao"
                  classNameInput="form__field"
                  value={values.Acao}
                  handleChange={handleChangeProjeto}
                />
                )
              }
                </div>
                <div className="col-md-5 text-start themed-grid-col">
                {
                  <FormRowListaProjetos
                    type="textarea"
                    id="NotasProjeto"
                    name="Notas"
                    classNameInput="form__field"
                    value={values.Notas}
                    handleChange={handleChangeProjeto}
                  />
                  }
                </div>

                <div className="col-md-2 themed-grid-col">
                {
                  <div className='text-center piloto'>
                    {
                    PilotosList.map((part, index) => (
                      <p key={index}>{part}</p>
                    ))}
                  </div>
                }
              </div>
              </div>
            </div>

            <div className="col-md-2 themed-grid-col">
              <div className="row text-center">
                {finalizado === true ? (
                  <>
                    <div className="col-md-8 themed-grid-col">
                      <p>{DataFim ? new Date(DataFim).toLocaleDateString('en-CA') : ''}</p>
                    </div>
                    <div className="col-md-4 themed-grid-col">
                      <p>{StringResultado}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-8 themed-grid-col">
                    <FormRowListaProjetos
                    type="Date"
                    id="DataObjetivoProjeto"
                    name="DataObjetivo"
                    //label="Login"
                    classNameInput="form__field__date"
                    value={values.DataObjetivo ? new Date(values.DataObjetivo).toLocaleDateString('en-CA') : ''}
                    handleChange={handleChangeDateProjeto}
                  />
                  {
                 //<p>{DataObjetivo ? new Date(DataObjetivo).toLocaleDateString('en-CA') : ''}</p>
                  }
                   </div>
                   <div className="col-md-4 align">
                    <div className="col-md-12 dias  " style={{ backgroundColor: dias < 0 ? getRedShade(dias) : getGreenShade(dias) }}>
                    <p>{dias}</p>
                  </div>
                  </div>
                  </>
                )
                }
              </div>
            </div>
            
            <div className="col-md-1 themed-grid-col " >
            <div className="col-md-11 themed-grid-col " >
            {
              verificaAlterado === true ? (
                <><div className='row mb-2 text-center'>
                  </div>
                  <div className='row mb-2 align-items-center text-center'>
                    <div className='col-md-12 themed-grid-col'>
                      <button
                        type='button'
                        className='btn btn-outline-primary'
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
                      <div className='row mb-2 text-center'>
                        <button
                          type='button'
                          className='btn btn-outline-primary buttonProjeto'
                          onClick={() => toggleEdit(_id)}
                        >
                          Editar
                        </button>
                      </div>
                      <div className='row mb-2 text-center'>
                        <button
                          type='button'
                          className='btn btn-outline-secondary buttonProjeto'
                          onClick={() => toggleVisualize(_id)}
                        >
                          Visualizar
                        </button>
                      </div>
   
                      {finalizado !== true && (
                      <div className='row  text-center'>
                        <button
                          type='button'
                          className='btn btn-outline-success buttonProjeto'
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
          <hr></hr>
        </div>
      </div>

    </Wrapper>
  );
};
export default Projeto;
