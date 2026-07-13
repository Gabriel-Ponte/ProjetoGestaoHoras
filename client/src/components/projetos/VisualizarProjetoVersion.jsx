import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';


const VisualizarHorasProjetoVersion = ({
    values,
    utilizadores,
  }) => {
    const { t } = useTranslation('projetos');

    return(
        <div className="col-7 left text-center" >

        {/* <div className="row mb-3">
          <div className="col-6">
            <h5>Tema</h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Tema}</p>
          </div>
        </div> */}
        <div className="row mb-3">
          <div className="col-6">
            <h5>{t('version.client')}</h5>
          </div>
          <div className="col-6 text-start">
            <p>{values?.Cliente}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              {t('version.pilots')}
            </h5>
          </div>
          <div className="col-6 text-start">
            {values?.Piloto &&
              (() => {
                //const updatedSeparatedArray = Array.isArray(values.Piloto) ? (values.Piloto.length > 0 ? values.Piloto[0].split(/[,\/]/) : []) : values.Piloto.split(/[,\/]/);
                const updatedSeparatedArray = Array.isArray(values.Piloto) ? values.Piloto.length > 0 ? values.Piloto[0].split(/[,/]/) : [] : values.Piloto.split(/[,/]/);
                if (updatedSeparatedArray && utilizadores) {
                  for (let i = 0; i < updatedSeparatedArray.length; i++) {
                    for (let a = 0; a < utilizadores.length; a++) {
                      if (updatedSeparatedArray[i] === utilizadores[a]._id) {
                        updatedSeparatedArray[i] = utilizadores[a].nome;
                      }
                    }
                  }
                }
                return (
                  <>
                    {values?.Piloto ? (
                      updatedSeparatedArray.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))
                    ) : (
                      <p>{t('version.noPilots')}</p>
                    )}
                  </>
                );
              })()}

          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              {t('version.action')}
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values?.Acao ? values.Acao : t('version.noActions')}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              {t('version.notes')}
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values?.Notas ? values.Notas : t('version.noNotes')}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              {t('version.version')}
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Versao ? values.Versao : "1"}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              {t('version.links')}
            </h5>
          </div>
          <div className="col-6 text-start">
            <p style={{ wordWrap: 'break-word' }}>{values.Links ? values.Links : t('version.noLinkA3')}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              {t('version.linkSummary')}
            </h5>
          </div>
          <div className="col-6 text-start">
            <p style={{ wordWrap: 'break-word' }}>{values.LinkResumo ? values.LinkResumo : t('version.noLinkSummary')}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              {t('version.done')}
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Finalizado === true ? t('version.yes') : t('version.no')}</p>
          </div>
        </div>
        {values.Finalizado === true ? (
          <div className="row mb-3">
            <div className="col-7 text-center">
              <h5>{t('version.result')}</h5>
            </div>
            <div className="col-5 text-start">
              <p style={{ width: "100%" }}> {values.Resultado === true ? t('version.success') : t('version.failure')}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  };


  VisualizarHorasProjetoVersion.propTypes = {
    values: PropTypes.object.isRequired,
    utilizadores: PropTypes.array.isRequired,
  }
  export default VisualizarHorasProjetoVersion;
