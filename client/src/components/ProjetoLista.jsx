import { useState } from 'react';
import Wrapper from '../assets/wrappers/Projeto';
import { useDispatch } from 'react-redux';
import { getProjeto, handleChange, insertProjetoLink } from '../features/projetos/projetosSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormRowListaProjetos from './FormRowListaProjetos';
import { updateProjeto } from '../features/projetos/projetosSlice';
import { FcCheckmark } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import PropTypes from 'prop-types';


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
  LinkResumo,
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
    LinkResumo,
    NumeroHorasTotal,
    Finalizado,
    finalizado,
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
    Piloto,
    Links,
    LinkResumo,
    NumeroHorasTotal,
    Finalizado,
    finalizado,
    handleAlterado
  });

  //const [verificaResultado, setVerificaResultado] = useState(1);
  const [verificaAlterado, setVerificaAlterado] = useState(false);
  const [addLink, setAddLink] = useState(0);

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

    let alreadyChanged = "true";
    if (nome === "Acao") {
      if (values["Notas"] === initialState["Notas"] && values["Cliente"] === initialState["Cliente"] && values["Nome"] === initialState["Nome"]) {
        alreadyChanged = "false";
      }
    } else if (nome === "Notas") {
      if (values["Acao"] === initialState["Acao"] && values["Cliente"] === initialState["Cliente"] && values["Nome"] === initialState["Nome"]) {
        alreadyChanged = "false";
      }
    } else if (nome === "Cliente") {
      if (values["Acao"] === initialState["Acao"] && values["Notas"] === initialState["Notas"] && values["Nome"] === initialState["Nome"]) {
        alreadyChanged = "false";
      }
    } else if (nome === "Nome") {
      if (values["Acao"] === initialState["Acao"] && values["Cliente"] === initialState["Cliente"] && values["Notas"] === initialState["Notas"]) {
        alreadyChanged = "false";
      }
    }
    if (nome !== "Links" && nome !== "LinkResumo") {
      if ((initialState[nome] === value && alreadyChanged === "false")) {
        handleAlterado(false);
        setVerificaAlterado(false);
      } else {
        if (verificaAlterado === false) {
          handleAlterado(true);
        }
        setVerificaAlterado(true);
      }
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

    if (outputDateString === value) {
      handleAlterado(false);
      setVerificaAlterado(false);
    } else {
      if (verificaAlterado === false) {
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


  // const toggleAddHoras = async (idP) => {
  //   await dispatch(getProjeto(idP));
  //   window.location.reload(navigate('/PaginaAdicionarHorasProjeto'));
  // };


  const toggleAddLinkA3 = async () => {
    setAddLink(1);
  };

  const toggleAddLinkResumo = async () => {
    setAddLink(2);
  };
  const toggleCloseAddLink = async () => {
    if (addLink === 1) {
      setValues({ ...values, Links: initialState.Links });
    } else if (addLink === 2) {
      setValues({ ...values, LinkResumo: initialState.LinkResumo });
    }

    setAddLink(0);
  };

  const toggleAddLinkDB = async (e) => {
    setAddLink(false);
    e.preventDefault();
    if (addLink === 1 && !values.Links) {
      toast.error('Por favor, insira o Link!');
      return;
    } else if (addLink === 2 && !values.LinkResumo) {
      toast.error('Por favor, insira o Link!');
      return;
    }
    try {
      const result = await dispatch(insertProjetoLink(values));
      if (!result.error) {
        setAddLink(0)
      }
    } catch (error) {
      toast.error('Erro ao atualizar!');
      console.error(error);
    }

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
    StringResultado = <FcCheckmark className='reactIcon' />;
  } else (
    StringResultado = <IoMdClose className='reactIcon' />
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

  //const PilotosList = Array.isArray(values.Piloto) ? (values.Piloto.length > 0 ? values.Piloto[0].split(/[,\/]/) : []) : values.Piloto.split(/[,\/]/);
  const PilotosList = Array.isArray(values.Piloto) ? values.Piloto.length > 0 ? values.Piloto[0].split(/[,/]/) : [] : values.Piloto.split(/[,/]/);
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
    }
  }

  return (
    <Wrapper>
      {/* <div className={verificaResultado === 1 ? '' : verificaResultado ? 'resultadoProjetoP' : 'resultadoProjetoN'}> */}
      <div className='resultadoProjetoP'>
        <div className="listaProjetos">
          <div className="row ">


            <div className="col-md-3 themed-grid-col">
              <div className="row text-center">
                <div className="col-md-6 themed-grid-col">
                  {finalizado === true ? (
                    <div className='Cliente'>
                      <h6>{values.Cliente}</h6>
                    </div>
                  ) : (
                    <FormRowListaProjetos
                      type="textarea"
                      id={"ClienteProjeto " + _id}
                      name="Cliente"
                      value={values.Cliente}
                      handleChange={handleChangeProjeto}
                    />
                  )}
                </div>
                <div className="col-md-6 themed-grid-col">
                  {finalizado === true ? (
                    <p style={{ 
                      wordBreak: 'break-word',  // Breaks long words
                      whiteSpace: 'normal',     // Ensures wrapping
                      overflowWrap: 'anywhere'  // Allows breaking at any point
                    }}>{values.Nome}</p>
                  ) : (
                    <FormRowListaProjetos
                      type="textarea"
                      id={"NomeProjeto " + _id}
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
                  ) : (
                    <FormRowListaProjetos
                      type="textarea"
                      id={"AcaoProjeto " + _id}
                      name="Acao"
                      classNameInput="form__field"
                      value={values.Acao}
                      handleChange={handleChangeProjeto}
                    />
                  )
                  }
                </div>
                <div className="col-md-5 text-start themed-grid-col">

                  {finalizado === true ? (
                    <>
                      <p>{values.Notas}</p>
                    </>
                  ) : (
                    <FormRowListaProjetos
                      type="textarea"
                      id={"NotasProjeto " + _id}
                      name="Notas"
                      classNameInput="form__field"
                      value={values.Notas}
                      handleChange={handleChangeProjeto}

                    />
                  )
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
                        id={"DataObjetivoProjeto " + _id}
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
                  addLink === 1 ? (
                    <>
                      <div className='col-md-12 text-end'>
                        <button
                          type='button'
                          className='btn btn-outline-danger'
                          onClick={toggleCloseAddLink}
                        >
                          <IoMdClose />
                        </button>
                      </div>
                      <div className='row text-center'>
                        <FormRowListaProjetos
                          type="textarea"
                          id={"LinkA3 " + _id}
                          name="Links"
                          classNameInput="form__field"
                          value={values.Links}
                          handleChange={handleChangeProjeto}
                        />
                      </div>
                      <div className='row mb-2 text-center'>
                        <button
                          type='button'
                          className='btn btn-outline-primary'
                          onClick={toggleAddLinkDB}
                        >
                          Inserir
                        </button>
                      </div>
                    </>
                  ) : addLink === 2 ? (
                    <>
                      <div className='col-md-12 text-end'>
                        <button
                          type='button'
                          className='btn btn-outline-danger'
                          onClick={toggleCloseAddLink}
                        >
                          <IoMdClose />
                        </button>
                      </div>
                      <div className='row text-center'>
                        <FormRowListaProjetos
                          type="textarea"
                          id={"LinkResumo " + _id}
                          name="LinkResumo"
                          classNameInput="form__field"
                          value={values.LinkResumo}
                          handleChange={handleChangeProjeto}
                        />
                      </div>
                      <div className='row mb-2 text-center'>
                        <button
                          type='button'
                          className='btn btn-outline-success'
                          onClick={toggleAddLinkDB}
                        >
                          Inserir
                        </button>
                      </div>
                    </>
                  ) : (
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
                          {
                            values.Links === "" ? (
                              <div className='row mb-2 text-center'>
                                <button
                                  type='button'
                                  className='btn btn-outline-success buttonProjetoLinks'
                                  onClick={() => toggleAddLinkA3()}
                                >
                                  Adicionar Link A3
                                </button>
                              </div>
                            ) : (
                              <div className='row mb-2 text-center'>
                                <a href={values.Links} className='btn btn-outline-link buttonProjeto' target="_blank" rel="noreferrer" > Abrir A3</a>
                              </div>
                            )
                          }
                          {
                            values.LinkResumo === "" ? (
                              <div className='row mb-2 text-center'>
                                <button
                                  type='button'
                                  className='btn btn-outline-success buttonProjetoLinks'
                                  onClick={() => toggleAddLinkResumo()}
                                >
                                  Adicionar Link Resumo
                                </button>
                              </div>
                            ) : (
                              <div className='row mb-2 text-center'>
                                <a href={values.LinkResumo} className='btn btn-outline-link buttonProjeto' target="_blank" rel="noreferrer"> Abrir Resumo</a>
                              </div>
                            )
                          }

                          {/* {finalizado !== true && (
                      <div className='row  text-center'>
                        <button
                          type='button'
                          className='btn btn-outline-success buttonProjeto'
                          onClick={() => toggleAddHoras(_id)}
                        >
                          Adicionar Horas
                        </button>
                      </div>
                      )} */}
                        </>
                      ))
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


Projeto.propTypes = {
  _id: PropTypes.string.isRequired,
  Cliente: PropTypes.string.isRequired,
  DataInicio: PropTypes.string,
  DataObjetivo: PropTypes.string,
  DataFim: PropTypes.string,
  Notas: PropTypes.string.isRequired,
  OrcamentoAprovado: PropTypes.string,
  Resultado: PropTypes.bool.isRequired,
  Nome: PropTypes.string.isRequired,
  Tema: PropTypes.string.isRequired,
  Acao: PropTypes.string.isRequired,
  TipoTrabalho: PropTypes.string.isRequired,
  Piloto: PropTypes.string.isRequired,
  Links: PropTypes.string.isRequired,
  LinkResumo: PropTypes.string.isRequired,
  NumeroHorasTotal: PropTypes.string,
  Finalizado: PropTypes.bool.isRequired,
  finalizado: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired
  ]).isRequired,
  utilizadores: PropTypes.array.isRequired,
  handleAlterado: PropTypes.func.isRequired,
}
export default Projeto;
