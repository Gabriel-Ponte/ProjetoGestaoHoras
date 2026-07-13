import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAllDiasHorasExtra, acceptDiasHorasExtra, declineDiasHorasExtra, getAllDiasHorasExtraAccepted, getAllDiasHorasExtraDeclined, getAllDiasHorasExtraDeclinedResponsavel, getAllDiasHorasExtraAcceptedResponsavel, getAllDiasHorasExtraResponsavel, acceptMultipleDiasHorasExtra, declineMultipleDiasHorasExtra } from '@/features/allDias/allDiasSlice';
import Wrapper from '@/styles/GerirHorasExtra';
import FormRowListaHorasExtra from '@/components/forms/FormRowListaHorasExtra';
import { listaUtilizadores } from '@/features/utilizadores/utilizadorSlice';
import { getAllPagamentos, handleChangePagamentos } from '@/features/pagamentos/pagamentosSlice';
import { FcCheckmark } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { AppButton, LoadingState, EmptyState } from '@/components/ui';
import { isHorasExtraFullManager } from '@/utils/roles';
import FormRowListaHorasExtraPagas from '@/components/forms/FormRowListaHorasExtraPagas';
import FormRowListaHorasExtraPagasHeader from '@/components/forms/FormRowListaHorasExtraPagasHeader';
import GerirHorasFerias from '@/components/ferias/GerirHorasFerias';


const GerirHorasExtra = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation('extra');

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

  // Admin (tipo 2) is treated like Admin RH (tipo 7): full gestão, every tab.
  const isFullManager = isHorasExtraFullManager(user?.user?.tipo);

  useEffect(() => {
    handleChangeTipo(2);
  }, [user?.user]);

  useEffect(() => {
    dispatch(listaUtilizadores());

    if (isFullManager) {
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
          const confirmed = window.confirm(t('confirm.declineDay', { date: `${dia}/${mes}/${ano}`, name }));
          if (confirmed) {
            const result = await dispatch(declineDiasHorasExtra(value[0]));
            if (!result.error) {
              setCallUseEffect(!callUseEffect);
            }
          }
        } else {
          const confirmed = window.confirm(t('confirm.declineRequest', { name }));
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

        const confirmed = window.confirm(t('confirm.declineDay', { date: `${dia}/${mes}/${ano}`, name }));
        if (confirmed) {
          const result = await dispatch(declineDiasHorasExtra(value));
          if (!result.error) {
            setCallUseEffect(!callUseEffect);
          }
        }
      }

    } catch {
      return t('errors.declineDay');
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
          {isFullManager &&
            <>
              <div className='col-md-6'>
                <AppButton type="button" fullWidth variant="primary">
                  {t('sections.requestManagement')}
                </AppButton>
              </div>
              <div className='col-md-6'>
                <AppButton type="button" fullWidth variant="secondary"
                  onClick={() => setGerirFerias(true)}>
                  {t('sections.vacationManagement')}
                </AppButton>
              </div>
            </>}
          {user?.user?.tipo === 6 && <h1>{t('title.managerOvertime')}</h1>}
        </div>
        <div className="col-md-12 mb-4 text-center ">
          <div className="row">
            <div className={isFullManager ? "col-md-3" : "col-md-4"}>
              <AppButton type="button" fullWidth
                variant={verificaAlterado === 0 ? 'primary' : 'secondary'}
                disabled={isLoading || isLoadingPagamentos}
                onClick={() => handleChangeButtonClicked(0)}>
                {t('tabs.pending')}
              </AppButton>
            </div>
            <div className={isFullManager ? "col-md-3" : "col-md-4"}>
              <AppButton type="button" fullWidth
                variant={verificaAlterado === 1 ? 'primary' : 'secondary'}
                disabled={isLoading || isLoadingPagamentos}
                onClick={() => handleChangeButtonClicked(1)}>
                {t('tabs.accepted')}
              </AppButton>
            </div>
            <div className={isFullManager ? "col-md-3" : "col-md-4"}>
              <AppButton type="button" fullWidth
                variant={verificaAlterado === 2 ? 'primary' : 'secondary'}
                disabled={isLoading || isLoadingPagamentos}
                onClick={() => handleChangeButtonClicked(2)}>
                {t('tabs.declined')}
              </AppButton>
            </div>
            {isFullManager &&
              <div className="col-md-3">
                <AppButton type="button" fullWidth
                  variant={verificaAlterado === 3 ? 'primary' : 'secondary'}
                  disabled={isLoading || isLoadingPagamentos}
                  onClick={() => handleChangeButtonClicked(3)}>
                  {t('tabs.paidOvertime')}
                </AppButton>
              </div>
            }
          </div>
        </div>
        <>
          {isLoading || isLoadingPagamentos || !loaded ? (
            <LoadingState inline />
          ) : (
            <div className="listaGerirHorasExtra text-center">
              {((listaHorasExtra && listaHorasExtra.length > 0) || verificaTipo !== 1) &&
                <div>
                  {(verificaAlterado !== 3) &&
                    <div className='row mt-4 mb-4'>
                      <div className={`${verificaAlterado === 0 ? 'col-md-4' : 'col-md-3'}`}>
                        <AppButton type="button" size="sm" fullWidth
                          variant={(verificaTipo === 2 || verificaTipo === 6) ? 'primary' : 'secondary'}
                          disabled={isLoading || isLoadingPagamentos}
                          onClick={() => handleChangeTipo(2)}>
                          {t('filters.overtime')}
                        </AppButton>
                      </div>
                      <div className={`${verificaAlterado === 0 ? 'col-md-4' : 'col-md-3'}`}>
                        <AppButton type="button" size="sm" fullWidth
                          variant={(verificaTipo === 3 || verificaTipo === 7) ? 'primary' : 'secondary'}
                          disabled={isLoading || isLoadingPagamentos}
                          onClick={() => handleChangeTipo(3)}>
                          {t('filters.overtimeCompensation')}
                        </AppButton>
                      </div>
                      <div className={`${verificaAlterado === 0 ? 'col-md-4' : 'col-md-3'}`}>
                        <AppButton type="button" size="sm" fullWidth
                          variant={(verificaTipo === 4 || verificaTipo === 7) ? 'primary' : 'secondary'}
                          disabled={isLoading || isLoadingPagamentos}
                          onClick={() => handleChangeTipo(4)}>
                          {t('filters.vacation')}
                        </AppButton>
                      </div>
                      {(verificaAlterado !== 0) &&
                        <div className='col-md-3'>
                          <AppButton type="button" size="sm" fullWidth
                            variant={(verificaTipo === 1 || verificaTipo === 5) ? 'primary' : 'secondary'}
                            disabled={isLoading || isLoadingPagamentos}
                            onClick={() => handleChangeTipo(1)}>
                            {t('filters.allRequests')}
                          </AppButton>
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
                    <div className="mt-4 col-md-12 text-center">
                      {verificaAlterado === 0 ? (
                        <div>
                          {(verificaTipo === 1 || verificaTipo === 5) ? (
                            <EmptyState title={t('empty.noOvertimeRequests')} />
                          ) : (verificaTipo === 2 || verificaTipo === 6) ? (
                            <EmptyState title={t('empty.noWorkedOvertimeRequests')} />
                          ) : (verificaTipo === 3 || verificaTipo === 7) ?
                            <EmptyState title={t('empty.noOvertimeCompensationRequests')} />
                            : (verificaTipo === 4) &&
                            <EmptyState title={t('empty.noVacationRequests')} />
                          }
                        </div>
                      ) : verificaAlterado === 1 ? (
                        <div>
                          {(verificaTipo === 1) ? (
                            <EmptyState title={t('empty.noAcceptedOvertimeRequests')} />
                          ) : (verificaTipo === 2) ? (
                            <EmptyState title={t('empty.noAcceptedWorkedOvertimeRequests')} />
                          ) : (verificaTipo === 3) ?
                            <EmptyState title={t('empty.noAcceptedOvertimeCompensationRequests')} />
                            : (verificaTipo === 4) &&
                            <EmptyState title={t('empty.noAcceptedVacationRequests')} />
                          }
                        </div>
                      ) : verificaAlterado === 2 ? (
                        <div>
                          {(verificaTipo === 1) ? (
                            <EmptyState title={t('empty.noDeclinedOvertimeRequests')} />
                          ) : (verificaTipo === 2) ? (
                            <EmptyState title={t('empty.noDeclinedWorkedOvertimeRequests')} />
                          ) : (verificaTipo === 3) ?
                            <EmptyState title={t('empty.noDeclinedOvertimeCompensationRequests')} />
                            : (verificaTipo === 4) &&
                            <EmptyState title={t('empty.noDeclinedVacationRequests')} />
                          }
                        </div>
                      ) : (
                        <div>
                          <EmptyState title={t('empty.noPaidOvertime')} />
                        </div>
                      )}

                    </div>
                  ) : (
                    <LoadingState inline />
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