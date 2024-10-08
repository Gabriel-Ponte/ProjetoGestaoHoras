import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiasHorasExtra, acceptDiasHorasExtra, declineDiasHorasExtra, getAllDiasHorasExtraAccepted, getAllDiasHorasExtraDeclined, getAllDiasHorasExtraDeclinedResponsavel, getAllDiasHorasExtraAcceptedResponsavel, getAllDiasHorasExtraResponsavel, acceptMultipleDiasHorasExtra, declineMultipleDiasHorasExtra } from '../features/allDias/allDiasSlice';
import Wrapper from '../assets/wrappers/GerirHorasExtra';
import FormRowListaHorasExtra from './FormRowListaHorasExtra';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { getAllPagamentos, handleChangePagamentos } from '../features/pagamentos/pagamentosSlice';
import { FcCheckmark } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import FormRowListaHorasExtraPagas from './FormRowListaHorasExtraPagas';
import FormRowListaHorasExtraPagasHeader from './FormRowListaHorasExtraPagasHeader';
import LoadingSmaller from './LoadingSmaller';
import GerirHorasFerias from './GerirHorasFerias';


const GerirHorasExtra = () => {

  const dispatch = useDispatch();

  const [listaHorasExtra, setListaHorasExtra] = useState([]);
  const [listaPagamentos, setListaPagamentos] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState(0);
  const [verificaTipo, setVerificaTipo] = useState(2);
  const [gerirFerias, setGerirFerias] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { isLoadingPagamentos, sort } = useSelector((store) => store.pagamentos);
  const { isLoading } = useSelector((store) => store.allDias);

  const [callUseEffect, setCallUseEffect] = useState(false);
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

    if (user?.user?.tipo === 7) {
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
    } else {
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
      await dispatch(getAllDiasHorasExtra()).then((res) => {
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
      await dispatch(getAllDiasHorasExtraResponsavel()).then((res) => {
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
      await dispatch(getAllDiasHorasExtraAcceptedResponsavel()).then((res) => {
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
      await dispatch(getAllDiasHorasExtraDeclinedResponsavel()).then((res) => {
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
      await dispatch(getAllDiasHorasExtraAccepted()).then((res) => {
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
      await dispatch(getAllDiasHorasExtraDeclined()).then((res) => {
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
      await dispatch(getAllPagamentos()).then((res) => {
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

      let name = "";
      let nameCompare = value?.Utilizador ? value?.Utilizador : (value[0]?.Utilizador ? value[0]?.Utilizador : "");

      if (utilizadores && utilizadores.length > 0) {
        utilizadores.filter((user) => {
          if (user?._id === nameCompare) {
            name = user?.nome;
          }
          return false;
        })
      }
      if (value?.length > 0) {
        if (value?.length === 1) {


          const data = new Date(value[0]?.Data);

          const dia = data.getDate();
          const mes = data.getMonth() + 1;
          const ano = data.getFullYear();
          const confirmed = window.confirm("Tem a certeza que deseja recusar o dia: " + dia + "/" + mes + "/" + ano + " a " + name + "?");
          if (confirmed) {
            const result = await dispatch(declineDiasHorasExtra(value[0]));
            if (!result.error) {
              setCallUseEffect(!callUseEffect);
            }
          }
        } else {
          const confirmed = window.confirm("Tem a certeza que deseja recusar o pedido a " + name + "?");
          if (confirmed) {
            const result = await dispatch(declineMultipleDiasHorasExtra(value));
            if (!result.error) {
              setCallUseEffect(!callUseEffect);
            }
          }
        }
      } else {
        const data = new Date(value?.Data);

        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();

        const confirmed = window.confirm("Tem a certeza que deseja recusar o dia: " + dia + "/" + mes + "/" + ano + " a " + name + "?");
        if (confirmed) {
          const result = await dispatch(declineDiasHorasExtra(value));
          if (!result.error) {
            setCallUseEffect(!callUseEffect);
          }
        }
      }

    } catch {
      return "Ocorreu um erro ao recusar o Dia.";
    }
  };

  const acceptDiaHorasExtra = async (id) => {
    try {
      if (id?.length > 0) {
        if (id?.length === 1) {
          const result = await dispatch(acceptDiasHorasExtra(id[0]));
          if (!result.error) {
            setCallUseEffect(!callUseEffect);
          }
        } else {
          const result = await dispatch(acceptMultipleDiasHorasExtra(id));
          if (!result.error) {
            setCallUseEffect(!callUseEffect);
          }
        }

      } else {
        const result = await dispatch(acceptDiasHorasExtra(id));
        if (!result.error) {
          setCallUseEffect(!callUseEffect);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeSort = async (tipo) => {
    if (verificaAlterado === 3) {
      if (isLoading || isLoadingPagamentos) return;
      await dispatch(handleChangePagamentos({ name: 'sort', value: tipo }));
    } else {
      await dispatch(handleChangePagamentos({ name: 'sort', value: tipo }));
    }
    setCallUseEffect(!callUseEffect);
  };


  const handleChangeTipo = async (tipo) => {
    await dispatch(handleChangePagamentos({ name: 'tipo', value: tipo }));
    setVerificaTipo(tipo);
    setCallUseEffect(!callUseEffect);
  };

  const handleChangeButtonClicked = (async (tipo) => {
    if (user?.user?.tipo === 6) {
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

  const styleButton = {
    fontSize: "2.0rem", /* This is typically 40px */
    fontWeight: "650",  /* Light font weight */
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "inline-block",
    lineHeight: 'normal',
 
  };


  const handleData = useCallback((t, i) => {
    return (
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
  }, [utilizadores, verificaTipo, verificaAlterado, listaHorasExtra]);




  if (!gerirFerias) {
    return (
      <Wrapper>
        <div className={'row mb-12 text-center tittle'}>
          {user?.user?.tipo === 7 &&
            <>
              <div className='col-md-6'>
              <button
                  type="submit"
                  style={{ ...styleButton }}
                  className={`btn middleButton activeMainButton`}
                  
                >
                    Gestão de Pedidos
                </button>
          
              </div>
              <div className='col-md-6  d-flex flex-column justify-content-center align-items-center' >
                <button
                  type="submit"
                  style={{ ...styleButton }}
                  className={`btn middleButton `}
                  onClick={(e) => { setGerirFerias(true) }}
                >
                  Gestão de Férias
                </button>
              </div>
            </>}
          {user?.user?.tipo === 6 && <h1>Gestão de Horas Extra Responsável</h1>}
        </div>
        <div className="col-md-12 mb-4 text-center ">
          <div className="row">
            <div className={user?.user?.tipo === 7 ? "col-md-3" : "col-md-4"}>
              <button type='button'
                className={`btn ButtonsTest ${verificaAlterado === 0 ? 'active' : ''}`}
                disabled={isLoading || isLoadingPagamentos}

                onClick={() => handleChangeButtonClicked(0)}>
                Pedidos por Aceitar
              </button>
            </div>
            <div className={user?.user?.tipo === 7 ? "col-md-3" : "col-md-4"}>
              <button type='button'
                className={`btn ButtonsTest ${verificaAlterado === 1 ? 'active' : ''}`}
                disabled={isLoading || isLoadingPagamentos}
                onClick={() => handleChangeButtonClicked(1)}>
                Pedidos Aceites
              </button>
            </div>
            <div className={user?.user?.tipo === 7 ? "col-md-3" : "col-md-4"}>
              <button type='button'
                className={`btn ButtonsTest ${verificaAlterado === 2 ? 'active' : ''}`}
                disabled={isLoading || isLoadingPagamentos}
                onClick={() => handleChangeButtonClicked(2)}>
                Pedidos Recusados
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
                            className={`btn ButtonsTestSecondary ${(verificaTipo === 1 || verificaTipo === 5) ? 'activeSecondary' : ''}`}
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

              {((verificaAlterado === 3) ? (listaPagamentos && listaPagamentos.length > 0) : (listaHorasExtra && listaHorasExtra.length > 0)) ? (
                <div>

                  <FormRowListaHorasExtraPagasHeader
                    sortValue={sort}
                    pagas={verificaAlterado}
                    tipoHoras={verificaTipo}
                    handleChange={handleChangeSort} />

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

                  {verificaAlterado !== 3 && listaHorasExtra.map((t, i) => {
                    if (t.length > 0) {
                      if (t[0]._id_Group === 0) {
                        // Process each item in the array `t`
                        return t.map((item, index) => handleData(item, `${i} ${index}`));
                      } else {
                        // Handle case when `_id_Group` is not 0
                        return handleData(t, i);
                      }
                    } else {
                      // Handle case when `t` is an empty array or undefined
                      return handleData(t, i);
                    }
                  })}

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
                          ) : (verificaTipo === 3 || verificaTipo === 7) ?
                            <h1>Sem Pedidos de Compensação de Horas Extra</h1>
                            : (verificaTipo === 4) &&
                            <h1>Sem Pedidos de Férias</h1>
                          }
                        </div>
                      ) : verificaAlterado === 1 ? (
                        <div>
                          {(verificaTipo === 1) ? (
                            <h1>Sem Pedidos de Horas Extra Aceites!</h1>
                          ) : (verificaTipo === 2) ? (
                            <h1>Sem Pedidos de Horas Extra Realizadas Aceites!</h1>
                          ) : (verificaTipo === 3) ?
                            <h1>Sem Pedidos de Compensação de Horas Extra Aceites!</h1>
                            : (verificaTipo === 4) &&
                            <h1>Sem Pedidos de Férias Aceites!</h1>
                          }
                        </div>
                      ) : verificaAlterado === 2 ? (
                        <div>
                          {(verificaTipo === 1) ? (
                            <h1>Sem Pedidos de Horas Extra Recusados!</h1>
                          ) : (verificaTipo === 2) ? (
                            <h1>Sem Pedidos de Horas Extra Realizadas Recusados!</h1>
                          ) : (verificaTipo === 3) ?
                            <h1>Sem Pedidos de Compensação de Horas Extra Recusados!</h1>
                            : (verificaTipo === 4) &&
                            <h1>Sem Pedidos de Férias Recusados!</h1>
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
  } else {
    return (
      <Wrapper>
        <GerirHorasFerias
          setGerirFerias={setGerirFerias}
          accepted={1}
          styleButton={styleButton}
        />
      </Wrapper>
    )
  }
};

export default GerirHorasExtra;