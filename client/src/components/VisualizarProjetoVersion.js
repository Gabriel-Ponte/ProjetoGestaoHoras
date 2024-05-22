



const VisualizarHorasProjetoVersion = ({
    values,
    utilizadores,
    estado
  }) => {
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
            <h5>Cliente</h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Cliente}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              Piloto/s
            </h5>
          </div>
          <div className="col-6 text-start">
            {values.Piloto &&
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
                    {values.Piloto ? (
                      updatedSeparatedArray.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))
                    ) : (
                      <p>Sem Pilotos</p>
                    )}
                  </>
                );
              })()}

          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              Ação
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Acao ? values.Acao : "Sem Ações"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              Notas
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Notas ? values.Notas : "Sem Notas"}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              Versão
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Versao ? values.Versao : "1"}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              Links
            </h5>
          </div>
          <div className="col-6 text-start">
            <p style={{ wordWrap: 'break-word' }}>{values.Links ? values.Links : "Sem Link A3"}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              Link Resumo
            </h5>
          </div>
          <div className="col-6 text-start">
            <p style={{ wordWrap: 'break-word' }}>{values.LinkResumo ? values.LinkResumo : "Sem Link Resumo"}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 text-center">
            <h5 className="">
              Realizado
            </h5>
          </div>
          <div className="col-6 text-start">
            <p>{values.Finalizado === true ? "Sim" : "Não"}</p>
          </div>
        </div>
        {values.Finalizado === true ? (
          <div className="row mb-3">
            <div className="col-7 text-center">
              <h5>Resultado</h5>
            </div>
            <div className="col-5 text-start">
              <p style={{ width: "100%" }}> {values.Resultado === true ? "Sucesso" : "Insucesso"}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  export default VisualizarHorasProjetoVersion;

