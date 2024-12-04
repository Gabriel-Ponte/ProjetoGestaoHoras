import { useState, useEffect, useCallback, memo } from 'react';
import Wrapper from '../assets/wrappers/Dias';
import { useDispatch } from 'react-redux';
import { getProjetoList } from '../features/projetos/projetosSlice';
import { AiFillDelete } from 'react-icons/ai';
import { getDiaID } from '../features/dias/diasSlice';
import PropTypes from 'prop-types'; 
import LoadingSmaller from './LoadingSmaller';
const Dia = ({ _id, Data, NumeroHoras, _id_Group, Utilizador, tipoDeTrabalhoHoras, associated, listaTT, accepted, tipoUser, deleteDay , deleteDayGroup, buttonConfirmed}) => {
  const dispatch = useDispatch();
  const [projeto, setProjeto] = useState([]);
  const [diaAssociated, setDiaAssociated] = useState(null);

  const fetchAssociatedDay = useCallback(async () => {
    if (associated) {
      try {
        const res = await dispatch(getDiaID({ associated }));
        const data = res?.payload?.dia?.Data; 
        setDiaAssociated(data);
      } catch (error) {
        console.error("Error fetching associated day", error);
      }
    }
  }, [associated, dispatch]);

  const fetchProjetoList = useCallback(async () => {
    const projetoListPromises = tipoDeTrabalhoHoras.map(async ({ tipoTrabalho, horas, projeto }) => {
      const horasArray = horas.split(',') || [];
      const tipoTrabalhoArray = tipoTrabalho.split(',') || [];

      const filteredHorasArray = horasArray.filter(hora => hora !== "0");
      const filteredTipoTrabalhoArray = tipoTrabalhoArray.slice(0, filteredHorasArray.length);

      if (filteredTipoTrabalhoArray.length === 0) {
        return null;
      }

      try {
        const res = await dispatch(getProjetoList(projeto));
        return {
          tipoTrabalho: filteredTipoTrabalhoArray.join(","),
          horas: filteredHorasArray.join(","),
          projeto: res?.payload?.projeto,
        };
      } catch (error) {
        console.error("Error fetching projeto list", error);
        return null;
      }
    });

    const projetoArray = await Promise.all(projetoListPromises);
    setProjeto(projetoArray.filter(item => item !== null));
  }, [dispatch, tipoDeTrabalhoHoras]);

  useEffect(() => {
    fetchAssociatedDay();
    fetchProjetoList();
  }, [fetchAssociatedDay, fetchProjetoList]);

  const deleteDiaConfirm = useCallback(async (id, data) => {
    try {
      await deleteDay(id, data);
    } catch (error) {
      console.error("Error deleting day", error);
    }
  }, [deleteDay]);


  const deleteDiaGroupConfirm = useCallback(async (id, data, _id_Group) => {
    try {
      await deleteDayGroup(id, data, _id_Group);
    } catch (error) {
      console.error("Error deleting férias", error);
    }
  }, [deleteDayGroup]);
  const convertToMinutes = useCallback((timeString) => {
    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");
        const hoursInt = parseInt(hours, 10);
        minutes = parseInt(minutes) < 10 ? `${minutes}0` : minutes || "00";
        let formattedMinutes = Math.round(minutes * 60 / 100);

        if (formattedMinutes === 60) {
          formattedMinutes = "00";
        } else {
          formattedMinutes = formattedMinutes.toString().padStart(2, '0');
        }

        const formattedHours = hoursInt.toString().padStart(2, "0");
        return `${formattedHours}:${formattedMinutes}`;
      } catch (error) {
        console.error("Error converting to minutes", error);
        return timeString;
      }
    }
    return timeString;
  }, []);

  return (
    <Wrapper>
       <div key={`${_id}-${Utilizador}`}>
        <div className='dias'>
          <div className="list-group-item">
            <div className="row text-center">
              <div className="col-md-3 themed-grid-col">
                <h3>{Data ? new Date(Data).toLocaleDateString('en-CA') : ''}</h3>
              </div>
              {(tipoUser === 7 || (accepted !== 2 && accepted !== 3 && accepted !== 5 && accepted !== 7)) && (
                <div className='row'>
                <div className='col-md-6 text-end'>
                  <button type='submit' onClick={() => deleteDiaConfirm(_id, Data)} disabled={buttonConfirmed} className="btn">
                    <AiFillDelete />
                  </button>
                </div>

              {(accepted !== 2 && accepted !== 3 && accepted !== 5 && accepted !== 7 && _id_Group && _id_Group !== 0 ) ?
                <div className='col-md-6'>
                  {buttonConfirmed ? (
                  <div className="spinner-border text-danger" role="status">
                    <span className="sr-only"></span>
                  </div>
                  ): (
                  <button type='submit' onClick={() => deleteDiaGroupConfirm(_id, Data, _id_Group)} disabled={buttonConfirmed} className="btn btn-danger">
                    Apagar Pedido
                  </button>
                  )}
                </div>
                :<div className='col-md-6'> </div>
              }
              </div>
              )}
            </div>
            <div className="row text-center">
              <div className="col-md-3 themed-grid-col">
                <h4>{convertToMinutes(NumeroHoras)}</h4>
              </div>
              <div className="col-md-9 themed-grid-col">
                {projeto.map(({ tipoTrabalho, horas, projeto }) => (
                  <div className="row text-center" key={projeto?._id}>
                    <hr className='hrP' />
                    <div className="col-md-6 themed-grid-col projeto">
                      <h4>{projeto?.Nome}</h4>
                    </div>
                    <div className="col-md-6 themed-grid-col">
                      <div className="row text-center">
                        <div className="col-md-6 themed-grid-col">
                          {tipoTrabalho.split(',').map((trabalho, index) => {
                            const matchingTT = listaTT?.find(item => item?._id === trabalho);
                            return (
                              <p key={index}>
                                {matchingTT ? matchingTT.TipoTrabalho.trim() : 'Tipo de Trabalho Apagado'} 
                                {(accepted === 5 || accepted === 4) && diaAssociated ? ` ${new Date(diaAssociated).toLocaleDateString('en-CA')}` : ''}
                              </p>
                            );
                          })}
                        </div>
                        <div className="col-md-6 themed-grid-col">
                          {horas.split(',').map((hora, index) => (
                            <p key={index}>{convertToMinutes(hora)}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

Dia.propTypes = {
  _id: PropTypes.string.isRequired,
  Data: PropTypes.string.isRequired,
  NumeroHoras: PropTypes.number.isRequired,
  Utilizador: PropTypes.string.isRequired,
  tipoDeTrabalhoHoras: PropTypes.array.isRequired,
  associated: PropTypes.string,
  listaTT: PropTypes.array.isRequired,
  accepted: PropTypes.number.isRequired,
  tipoUser: PropTypes.number.isRequired,
  deleteDay: PropTypes.func.isRequired,
  deleteDayGroup: PropTypes.func.isRequired,
  buttonConfirmed: PropTypes.bool.isRequired,
};

export default memo(Dia);
