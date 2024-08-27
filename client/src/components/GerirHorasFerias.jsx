import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addDiasFeriasUtilizador, deleteDiasFerias, getAllFerias, handleChangeFerias } from '../features/ferias/feriasSlice';
import { toast } from 'react-toastify';
import GerirHorasFeriasHeader from './GerirHorasFeriasHeader';
import GerirHorasFeriasList from './GerirHorasFeriasList';
import Loading from './Loading';

const GerirHorasFerias = ({ setGerirFerias, styleButton }) => {
  const dispatch = useDispatch();

  const [listaFerias, setlistaFerias] = useState({});
  const { isLoadingFerias, sort } = useSelector((store) => store.ferias);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    getListaFerias();
  }, [dispatch, sort, update]);

  const getListaFerias = async () => {
    try {
      const res = await dispatch(getAllFerias());

      const horasExtraArray = (res?.payload?.feriasArray) ? res?.payload?.feriasArray : [];

      setlistaFerias(horasExtraArray);
    } catch (error) {
      console.error('Error Lista Ferias', error);
    }
  };

  const handleSort = (tipo) => {
    if (isLoadingFerias) return;
    dispatch(handleChangeFerias({ name: 'sort', value: tipo }));

  };


  const deleteDiasFeriasConfirm = async (id) => {
    try {
      const confirmed = window.confirm("Tem a certeza que deseja os  Dias de Férias?");

      if (confirmed) {
        const result = dispatch(deleteDiasFerias(id));
        if (!result.error) {
          toast.success("Dia Apagado")
          setUpdate(!update);
        }
      }
    } catch (error) {
      console.error(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };

  const handleInsertFerias = (values) => {
    try {
      const result = dispatch(addDiasFeriasUtilizador(values));
      if (result) {
        toast.success("Dias adicionados!")
        
        setUpdate(!update);
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoadingFerias) {
    return (
      <div className="row mb-12 text-center tittle">
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
            <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton `}
            >
              Gestão de Horas Extra
            </button>
          </div>
          <div className="col-md-6">
          <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton activeMainButton`}
            >
            Gestão de Férias
          </button>
        </div></div>
        <div className="container">
          <Loading />
        </div>
      </div>
    );
  } else {
    return (
      <div className="row mb-12 text-center tittle">
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
            <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton `}
              onClick={() => setGerirFerias(false)}
            >
              Gestão de Horas Extra
            </button>
          </div>
          <div className="col-md-6">
          <button
              type="submit"
              style={{ ...styleButton }}
              className={`btn middleButton activeMainButton`}

            >
            Gestão de Férias
          </button>
          </div>
        </div>

        <div className="container">

          <div className='ferias' style={{ marginTop: "5%" }}>
            <GerirHorasFeriasHeader
              sortValue={sort}
              handleChange={handleSort}
            />
            <div className='ferias' style={{ marginTop: "25px" }}>
              {listaFerias && Object.keys(listaFerias).length > 0 && Object.values(listaFerias).map((ferias, index) => {
                const indexKey = (Object.keys(listaFerias)[index]);
                const userName = indexKey.split(",");

                const totalNumber = ferias[1].reduce((acc, numberF) => {
                  const number = numberF.Numero;
                  return acc + number;
                }, 0);
                let feriasPorDar = totalNumber - ferias[0].length;

                return (
                  <GerirHorasFeriasList
                    key={indexKey}
                    keyF={userName[1]}
                    userName={userName[0]}
                    totalFerias={totalNumber}
                    ferias={ferias}
                    handleInsert={handleInsertFerias}
                    feriasPorDar={feriasPorDar}
                    deleteDias={deleteDiasFeriasConfirm}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

GerirHorasFerias.propTypes = {
  setGerirFerias: PropTypes.func.isRequired,
  styleButton: PropTypes.object.isRequired,
};

export default memo(GerirHorasFerias);
