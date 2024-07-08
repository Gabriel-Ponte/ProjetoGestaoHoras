import { memo, useMemo, useState, useEffect } from 'react';
import { FormRow } from '../components';
import { AiOutlineClose } from 'react-icons/ai';
import LoadingSmaller from './LoadingSmaller';
import PropTypes from 'prop-types'; 

const AddHorasCopiar = ({ verificaCopiarHoras, copiar, DataCopy, verificaDiaLast, handleDia, copyExists, buttonClicked }) => {
  const [loading, setLoading] = useState(false);
  const [copiarValue ,setCopiarValue] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setTimeout(() => {
              copiar(copiarValue);
              setLoading(false);
            }, 5);
          } catch (error) {
            console.error('Error copying hours:', error);
          }
        };
    if (loading) {
      fetchData();
    }
  }, [loading, copiar, copiarValue]);

  const copiarHoras = async (value) => {
    try {
      setLoading(true);
      setCopiarValue(value)
    } catch (error) {
      console.error('Error copying hours:', error);
    } finally {
      // setLoading(false);  // This should be done in the useEffect
    }
  };

  const dataCopyValue = useMemo(() => {
    return DataCopy?.DataCopy ? new Date(DataCopy.DataCopy).toLocaleDateString('en-CA') : '';
  }, [DataCopy]);

  return (
    <>
      {loading && 
      
      <div className='d-flex flex-column justify-content-center align-items-center h-100'style={{ maxHeight: '100px' }}>
        <LoadingSmaller />
      </div>} 
      {!loading && (
        <>
          {!verificaCopiarHoras ? (
            <div className='d-flex flex-column justify-content-center align-items-center h-100'>
              <button type='button' disabled={buttonClicked} className='btn btn-light' onClick={() => copiarHoras(true)}>
                Copiar Horas
              </button>
            </div>
          ) : (
            <div className='row'>
              <div className='col-8'>
                {DataCopy.DataCopy ? (
                  <FormRow
                    type="date"
                    className="dataAddHoras form__field__date"
                    classNameLabel="form-field-label"
                    id="Dia Copia"
                    name="Data a Copiar"
                    placeholder="Dia Adicionar Horas"
                    value={dataCopyValue}
                    handleChange={verificaDiaLast}
                  />
                ) : (
                  <p>Sem Horas inseridas para copiar</p>
                )}
              </div>
              <div className='col-4 d-flex flex-column justify-content-center align-items-center'>
                <button onClick={() => copiarHoras(false)} className='btn' style={{ margin: '5%' }}>
                  <AiOutlineClose />
                </button>
                <div className="col-12">
                  <button onClick={handleDia}  disabled={buttonClicked} className="btn btn-primary">
                    Copiar
                  </button>
                </div>
              </div>
              {!copyExists && (
                <div className="col-12">
                  <p>Não possui horas inseridas no dia escolhido. Ultimo dia com horas possíveis selecionado!</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};


AddHorasCopiar.propTypes = {
  verificaCopiarHoras: PropTypes.bool.isRequired,
  copiar: PropTypes.func.isRequired,
  DataCopy: PropTypes.object.isRequired,
  verificaDiaLast: PropTypes.func.isRequired,
  handleDia: PropTypes.func.isRequired,
  copyExists: PropTypes.bool.isRequired,
  buttonClicked: PropTypes.bool.isRequired,
}

export default memo(AddHorasCopiar);
