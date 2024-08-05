import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiasHorasExtra, acceptDiasHorasExtra, declineDiasHorasExtra, getAllDiasHorasExtraAccepted, getAllDiasHorasExtraDeclined, getAllDiasHorasExtraDeclinedResponsavel, getAllDiasHorasExtraAcceptedResponsavel, getAllDiasHorasExtraResponsavel } from '../features/allDias/allDiasSlice';
import Wrapper from '../assets/wrappers/GerirTipoTrabalho';
import FormRowListaHorasExtra from './FormRowListaHorasExtra';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { getAllPagamentos, handleChangePagamentos } from '../features/pagamentos/pagamentosSlice';
import { FcCheckmark } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import FormRowListaHorasExtraPagas from './FormRowListaHorasExtraPagas';
import FormRowListaHorasExtraPagasHeader from './FormRowListaHorasExtraPagasHeader';
import LoadingSmaller from './LoadingSmaller';


const GerirHorasExtra = () => {

  const dispatch = useDispatch();

  const [listaHorasExtra, setListaHorasExtra] = useState([]);
  const [listaPagamentos, setListaPagamentos] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState(0);
  const [verificaTipo, setVerificaTipo] = useState(2);
  const [loaded, setLoaded] = useState(false);
  const { isLoadingPagamentos, sort } = useSelector((store) => store.pagamentos);
  const { isLoading } = useSelector((store) => store.allDias);

  const [callUseEffect, setCallUseEffect] = useState();
  const { user, utilizadores } = useSelector((store) => store.utilizador);

  const navigate = useNavigate();


  useEffect(() => {
    if (user?.user && (user?.user?.tipo === 1)) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate('/PaginaPrincipal');
    } else if ((user?.user && user?.user?.tipo === 3) || (user?.user?.tipo === 4)) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate('/PaginaAdicionarHoras');
    }


      handleChangeTipo(2);
  }, [user?.user, navigate]);

  useEffect(() => {
    dispatch(listaUtilizadores());

    if(user?.user?.tipo === 7){
      if (verificaAlterado === 0) {
        listHorasExtra()
      }
      else if (verificaAlterado === 1) {
        listAcceptedHorasExtra();
      } else if (verificaAlterado === 2) {
        listDeclinedHorasExtra();
      } else if (verificaAlterado === 3) {
        listHorasExtraPagas();
      }
    } else{
        if (verificaAlterado === 0) {
          listHorasExtraResponsavel()
        }
        else if (verificaAlterado === 1) {
          listAcceptedHorasExtraResponsavel();
        } else if (verificaAlterado === 2) {
          listDeclinedHorasExtraResponsavel();
        }
    }
  }, [callUseEffect, dispatch]);


  const listHorasExtra = async () => {
    try {
      dispatch(getAllDiasHorasExtra()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setListaHorasExtra(horasExtraArray);

        setLoaded(true);
      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };

  const listHorasExtraResponsavel = async () => {
    try {
      dispatch(getAllDiasHorasExtraResponsavel()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setListaHorasExtra(horasExtraArray);

        setLoaded(true);
      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };

  const listAcceptedHorasExtraResponsavel = async () => {
    try {
      dispatch(getAllDiasHorasExtraAcceptedResponsavel()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setListaHorasExtra(horasExtraArray);
        setLoaded(true);
      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };




  const listDeclinedHorasExtraResponsavel = async () => {
    try {
      dispatch(getAllDiasHorasExtraDeclinedResponsavel()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setListaHorasExtra(horasExtraArray);
        setLoaded(true);
      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };


  const listAcceptedHorasExtra = async () => {
    try {
      dispatch(getAllDiasHorasExtraAccepted()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setListaHorasExtra(horasExtraArray);
        setLoaded(true);
      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };


  const listDeclinedHorasExtra = async () => {
    try {
      dispatch(getAllDiasHorasExtraDeclined()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setListaHorasExtra(horasExtraArray);
        setLoaded(true);
      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };


  const listHorasExtraPagas = async () => {
    try {
      dispatch(getAllPagamentos()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.pagamentosAll) ? res?.payload?.pagamentosAll : [];
        setListaPagamentos(horasExtraArray)
        setLoaded(true);

      });
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };

  const declineDiaHorasExtra = async (value) => {
    try {
      const data = new Date(value?.Data);

      const dia = data.getDate();
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();

      let name = "";
      if (utilizadores && utilizadores.length > 0) {
        utilizadores.filter((user) => {
          if (user?._id === value?.Utilizador) {
            name = user?.nome;
          }
          return false;
        })
      }

      const confirmed = window.confirm("Tem a certeza que deseja recusar o dia: " + dia + "/" + mes + "/" + ano + " a " + name + "?");
      if (confirmed) {
        const result = await dispatch(declineDiasHorasExtra(value));
        if (!result.error) {
          setCallUseEffect(!callUseEffect);
        }
      }
    } catch {
      return "Ocorreu um erro ao recusar o Dia.";
    }
  };

  const acceptDiaHorasExtra = async (id) => {
    try {
      const result = await dispatch(acceptDiasHorasExtra(id));
      if (!result.error) {
        setCallUseEffect(!callUseEffect);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeSort = (tipo) => {
    if (verificaAlterado === 3) {
      if (isLoading || isLoadingPagamentos) return;
      dispatch(handleChangePagamentos({ name: 'sort', value: tipo }));
    } else {
      dispatch(handleChangePagamentos({ name: 'sort', value: tipo }));
    }

    setCallUseEffect(!callUseEffect);
  };


  const handleChangeTipo = (tipo) => {
    dispatch(handleChangePagamentos({ name: 'tipo', value: tipo }));
    setVerificaTipo(tipo);
    setCallUseEffect(!callUseEffect);
  };


  const handleChangeButtonClicked = (async (tipo) => {
    if(user?.user?.tipo === 6){
      if (tipo === 0) {
        handleChangeTipo(2);
        listHorasExtraResponsavel();
        setVerificaAlterado(tipo);
      } else if (tipo === 1) {
        handleChangeTipo(1);
        listAcceptedHorasExtraResponsavel();
        setVerificaAlterado(tipo);
      } else if (tipo === 2) {
        handleChangeTipo(3);
        listDeclinedHorasExtraResponsavel();
        setVerificaAlterado(tipo);
      } 
    } else {
      if (tipo === 0) {
        handleChangeTipo(2);
        listHorasExtra();
        setVerificaAlterado(tipo);
      } else if (tipo === 1) {
        handleChangeTipo(1);
        listAcceptedHorasExtra();
        setVerificaAlterado(tipo);
      } else if (tipo === 2) {
        handleChangeTipo(1);
        listDeclinedHorasExtra();
        setVerificaAlterado(tipo);
      } else if (tipo === 3) {
        await listHorasExtraPagas();
        setVerificaAlterado(tipo);
      }
  }
  });


  return (
    <Wrapper>
      <div className={'row mb-12 text-center tittle'}>
      {user?.user?.tipo === 7 && <h1>Gestão de Horas Extra</h1>}
      {user?.user?.tipo === 6 && <h1>Gestão de Horas Extra Responsável</h1>}
      </div>
      <div className="col-md-12 mb-4 text-center ">
        <div className="row">
        <div className={user?.user?.tipo === 7 ? "col-md-3" : "col-md-4"}>
            <button type='button'
              className={`btn ButtonsTest ${verificaAlterado === 0 ? 'active' : ''}`}
              disabled={isLoading || isLoadingPagamentos}

              onClick={() => handleChangeButtonClicked(0)}>
              Horas por Aceitar
            </button>
          </div>
          <div className={user?.user?.tipo === 7 ? "col-md-3" : "col-md-4"}>
            <button type='button'
              className={`btn ButtonsTest ${verificaAlterado === 1 ? 'active' : ''}`}
              disabled={isLoading || isLoadingPagamentos}
              onClick={() => handleChangeButtonClicked(1)}>
              Horas Aceites
            </button>
          </div>
          <div className={user?.user?.tipo === 7 ? "col-md-3" : "col-md-4"}>
            <button type='button'
              className={`btn ButtonsTest ${verificaAlterado === 2 ? 'active' : ''}`}
              disabled={isLoading || isLoadingPagamentos}
              onClick={() => handleChangeButtonClicked(2)}>
              Horas Recusadas
            </button>
          </div>
        {user.user.tipo === 7 &&
          <div className="col-md-3">
            <button type='button'
              className={`btn ButtonsTest ${verificaAlterado === 3 ? 'active' : ''}`}
              disabled={isLoading || isLoadingPagamentos}
              onClick={() => handleChangeButtonClicked(3)}>
              Horas Extra Pagas
            </button>
          </div>
        }
        </div>
      </div>
      <>
        {isLoading || isLoadingPagamentos || !loaded ? (
          <div className='d-flex flex-column justify-content-center align-items-center h-500' style={{ maxHeight: '200px' }}>
            <LoadingSmaller />
          </div>
        ) : (
          <div className="listaGerirHorasExtra text-center">
            {((listaHorasExtra && listaHorasExtra.length > 0) || verificaTipo !== 1) &&
              <div>
                {(verificaAlterado !== 3) &&
                  <div className='row mt-4 mb-4'>
                    <div className={`${verificaAlterado === 0 ? 'col-md-4' : 'col-md-3'}`}>
                      <button type='button'
                        className={`btn ButtonsTestSecondary ${(verificaTipo === 2 || verificaTipo === 6) ? 'activeSecondary' : ''}`}
                        disabled={isLoading || isLoadingPagamentos}
                        onClick={() => handleChangeTipo(2)}>
                        Horas Extra
                      </button>
                    </div>
                    <div className={`${verificaAlterado === 0 ? 'col-md-4' : 'col-md-3'}`}>
                      <button type='button'
                        className={`btn ButtonsTestSecondary ${(verificaTipo === 3 || verificaTipo === 7) ? 'activeSecondary' : ''}`}
                        disabled={isLoading || isLoadingPagamentos}
                        onClick={() => handleChangeTipo(3)}>
                        Compensação de Horas Extra
                      </button>
                    </div>
                    <div className={`${verificaAlterado === 0 ? 'col-md-4' : 'col-md-3'}`}>
                      <button type='button'
                        className={`btn ButtonsTestSecondary ${(verificaTipo === 4 || verificaTipo === 7) ? 'activeSecondary' : ''}`}
                        disabled={isLoading || isLoadingPagamentos}
                        onClick={() => handleChangeTipo(4)}>
                        Ferias
                      </button>
                    </div>
                    {(verificaAlterado !== 0) &&
                      <div className='col-md-3'>
                        <button type='button'
                          className={`btn ButtonsTestSecondary ${(verificaTipo === 1 || verificaTipo === 5)? 'activeSecondary' : ''}`}
                          disabled={isLoading || isLoadingPagamentos}
                          onClick={() => handleChangeTipo(1)}>
                          Todos os pedidos
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            }


            <main></main>
            {(listaHorasExtra && listaHorasExtra.length > 0) &&
              <FormRowListaHorasExtraPagasHeader
                sortValue={sort}
                pagas={verificaAlterado}
                tipoHoras={verificaTipo}
                handleChange={handleChangeSort} />
            }


            {((verificaAlterado === 3) ? (listaPagamentos && listaPagamentos.length > 0) : (listaHorasExtra && listaHorasExtra.length > 0)) ? (
              <div>
                {verificaAlterado === 3 && listaPagamentos.map((t, i) => (
                  <div className="row text-center" key={"p" + i}>
                    <hr></hr>
                    <div>

                      <FormRowListaHorasExtraPagas
                        type="textarea"
                        readOnly={true}
                        utilizadores={utilizadores}
                        value={t}
                        changed={callUseEffect}
                      />
                    </div>
                  </div>
                ))}
                {verificaAlterado !== 3 && listaHorasExtra.map((t, i) => (
                  <div className="row text-center" key={i}>
                    <hr></hr>
                    <div className="row">
                      <div className={`${verificaAlterado === 0 ? "col-md-11" : "col-md-12"} text-center tiposTrabalho`}>
                        {
                          <FormRowListaHorasExtra
                            type="textarea"
                            readOnly={true}
                            utilizadores={utilizadores}
                            value={t}
                            changed={callUseEffect}
                            tipoHoras={verificaTipo}
                          />
                        }
                      </div>

                      {verificaAlterado === 0 && !isLoading && !isLoadingPagamentos &&
                        <div className="col-md-1 text-center mt-4">
                          <div className="row text-center">
                            <div className='col-md-6 '>
                              <button type='button'
                                className="btn btn btn-outline-success"
                                disabled={isLoading || isLoadingPagamentos}
                                onClick={() => acceptDiaHorasExtra(t)}>
                                <FcCheckmark />
                              </button>
                            </div>
                            <div className='col-md-6'>
                              <button
                                type='button'
                                disabled={isLoading || isLoadingPagamentos}
                                className="btn  btn-outline-danger"
                                onClick={() => declineDiaHorasExtra(t)}
                              >
                                <IoMdClose />
                              </button>
                            </div>
                          </div>
                        </div>
                      }
                    </div>

                  </div>

                )
                )}
              </div>
            ) : (
              <>
                {!isLoading && !isLoadingPagamentos && (loaded === true) ? (
                  <div className="mt-4 col-md-12  text-center ">
                    {verificaAlterado === 0 ? (
                      <div>
                        {(verificaTipo === 1 || verificaTipo === 5) ? (
                          <h1>Sem Pedidos de Horas Extra</h1>
                        ) : (verificaTipo === 2 || verificaTipo === 6) ? (
                          <h1>Sem Pedidos de Horas Extra Realizadas!</h1>
                        ) : (verificaTipo === 3 || verificaTipo === 7) &&
                        <h1>Sem Pedidos de Compensação de Horas Extra</h1>
                        }
                      </div>
                    ) : verificaAlterado === 1 ? (
                      <div>
                        {(verificaTipo === 1) ? (
                          <h1>Sem Pedidos de Horas Extra Aceites!</h1>
                        ) : (verificaTipo === 2) ? (
                          <h1>Sem Pedidos de Horas Extra Realizadas Aceites!</h1>
                        ) : (verificaTipo === 3) &&
                        <h1>Sem Pedidos de Compensação de Horas Extra Aceites!</h1>
                        }
                      </div>
                    ) : verificaAlterado === 2 ? (
                      <div>
                        {(verificaTipo === 1) ? (
                          <h1>Sem Pedidos de Horas Extra Recusados!</h1>
                        ) : (verificaTipo === 2) ? (
                          <h1>Sem Pedidos de Horas Extra Realizadas Recusados!</h1>
                        ) : (verificaTipo === 3) &&
                        <h1>Sem Pedidos de Compensação de Horas Extra Recusados!</h1>
                        }
                      </div>
                    ) : (
                      <div>
                        <h1>Sem Horas Extra Pagas!</h1>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className='d-flex flex-column justify-content-center align-items-center h-200' style={{ maxHeight: '100px' }}>
                    <LoadingSmaller />
                  </div>
                )}
              </>
            )}
          </div>
        )} </>
    </Wrapper>
  );
};

export default GerirHorasExtra;