import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleChangeDias, getAllDiasHorasExtra, acceptDiasHorasExtra, declineDiasHorasExtra, getAllDiasHorasExtraAccepted, getAllDiasHorasExtraDeclined } from '../features/allDias/allDiasSlice';
import Wrapper from '../assets/wrappers/GerirTipoTrabalho';
import FormRowListaHorasExtra from './FormRowListaHorasExtra';
import { listaUtilizadores } from '../features/utilizadores/utilizadorSlice';
import { getAllPagamentos, handleChange } from '../features/pagamentos/pagamentosSlice';
import { FcCheckmark } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import FormRowListaHorasExtraPagas from './FormRowListaHorasExtraPagas';
import FormRowListaHorasExtraPagasHeader from './FormRowListaHorasExtraPagasHeader';

import Loading from './Loading';
import LoadingSmaller from './LoadingSmaller';


const GerirHorasExtra = () => {

  const dispatch = useDispatch();

  const [listaHorasExtra, setListaHorasExtra] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState(0);
  const [ loaded , setLoaded] = useState(false);
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
  }, [user?.user, navigate]);

  useEffect(() => {
    dispatch(listaUtilizadores());

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

  }, [callUseEffect, dispatch]);


  const listHorasExtra = async () => {
    try {
      dispatch(getAllDiasHorasExtra()).then((res) => {
        const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
        setListaHorasExtra(horasExtraArray);
        setVerificaAlterado(0);
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
        setVerificaAlterado(1)
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
        setVerificaAlterado(2);
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
        setListaHorasExtra(horasExtraArray);
        setVerificaAlterado(3);
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
          if (user?._id == value?.Utilizador) {
            name = user?.nome;
          }
        })
      }

      const confirmed = window.confirm("Tem a certeza que deseja recusar o dia: " + dia + "/" + mes + "/" + ano + " a " + name + "?");
      if (confirmed) {
        const result = await dispatch(declineDiasHorasExtra(value));
        if (!result.error) {
          setCallUseEffect(!callUseEffect);
        }
      }
    } catch (error) {
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
      if (isLoading) return;
      dispatch(handleChange({ name: 'sort', value: tipo }));
    } else {
      dispatch(handleChange({ name: 'sort', value: tipo }));
    }

    setCallUseEffect(!callUseEffect);
  };


  return (
    <Wrapper>
      <div className={'row mb-12 text-center tittle'}>
        <h1>Gestão de Horas Extra</h1>
      </div>
      <div className="col-md-12 mb-4 text-center ">
        <div className="row">
          <div className="col-md-3">
            <button type='button'
              className={`btn btn-outline-primary ${verificaAlterado === 0 ? 'active' : ''}`}
              disabled={isLoading}
              aria-checked
              onClick={() => listHorasExtra()}>
              Horas Extra por Aceitar
            </button>
          </div>
          <div className="col-md-3">
            <button type='button'
              className={`btn btn-outline-primary ${verificaAlterado === 1 ? 'active' : ''}`}
              disabled={isLoading}
              onClick={() => listAcceptedHorasExtra()}>
              Horas Extra Aceites
            </button>
          </div>
          <div className="col-md-3">
            <button type='button'
              className={`btn btn-outline-primary ${verificaAlterado === 2 ? 'active' : ''}`}
              disabled={isLoading}
              onClick={() => listDeclinedHorasExtra()}>
              Horas Extra Recusadas
            </button>
          </div>

          <div className="col-md-3">
            <button type='button'
              className={`btn btn-outline-primary ${verificaAlterado === 3 ? 'active' : ''}`}
              disabled={isLoading}
              onClick={() => listHorasExtraPagas()}>
              Horas Extra Pagas
            </button>
          </div>

        </div>
      </div>
      <>
      {isLoading ? (
              <div className='d-flex flex-column justify-content-center align-items-center h-500'style={{ maxHeight: '200px' }}>
    <LoadingSmaller />
  </div>
    ) : (
      <div className="listaGerirHorasExtra text-center">
        {(listaHorasExtra && listaHorasExtra.length > 0) &&
          <FormRowListaHorasExtraPagasHeader
            sortValue={sort}
            pagas={verificaAlterado}
            handleChange={handleChangeSort} />

        }
        {(listaHorasExtra && listaHorasExtra.length > 0) ? (

          listaHorasExtra.map((t, i) => (
            <div className="row text-center" key={i}>
              <hr></hr>
              {verificaAlterado === 3 ? (
                <div>
                  <FormRowListaHorasExtraPagas
                    type="textarea"
                    readOnly={true}
                    utilizadores={utilizadores}
                    value={t}
                    changed={callUseEffect}
                  />
                </div>
              ) : (
                <div className="row">
                  <div className={`${verificaAlterado === 0 ? "col-md-10" : "col-md-12"} text-center tiposTrabalho`}>
                    {
                      <FormRowListaHorasExtra
                        type="textarea"
                        readOnly={true}
                        utilizadores={utilizadores}
                        value={t}
                        changed={callUseEffect}
                      />
                    }
                  </div>

                  {verificaAlterado === 0 && !isLoading &&
                    <div className="col-md-2 text-center mt-4">
                      <div className="row text-center">
                        <div className='col-md-6 '>
                          <button type='button'
                            className="btn btn btn-outline-success"
                            disabled={isLoading}
                            onClick={() => acceptDiaHorasExtra(t._id)}>
                            <FcCheckmark />
                          </button>
                        </div>
                        <div className='col-md-6'>
                          <button
                            type='button'
                            disabled={isLoading}
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
              )}
            </div>

          )
          )
        ) : (

          <>
            {!isLoading && !isLoadingPagamentos && (loaded === true) ? (
              <div className="col-md-12 text-center">
                {verificaAlterado === 0 ? (
                  <div>
                    <h1>Sem Pedidos de Horas Extra</h1>
                  </div>
                ) : verificaAlterado === 1 ? (
                  <div>
                    <h1>Sem Pedidos de Horas Extra Aceites!</h1>
                  </div>
                ) : verificaAlterado === 2 ? (
                  <div>
                    <h1>Sem Pedidos de Horas Extra Recusados!</h1>
                  </div>
                ) : (
                  <div>
                    <h1>Sem Horas Extra Pagas!</h1>
                  </div>
                )}
              </div>
            ): (
              <div className='d-flex flex-column justify-content-center align-items-center h-200'style={{ maxHeight: '100px' }}>
                <LoadingSmaller/>
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