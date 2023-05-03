import { useState } from 'react';
import Wrapper from '../assets/wrappers/Projeto';
import { useDispatch } from 'react-redux';
import { getProjeto } from '../features/projetos/projetosSlice';
import { useNavigate } from 'react-router-dom';

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
  NumeroHorasTotal,
  Finalizado,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [verificaResultado, setVerificaResultado] = useState(1);
  

  const toggleEdit = async (idP) => {
    await dispatch(getProjeto(idP));
    window.location.reload(navigate('/PaginaEditarProjeto'));
  };

  const toggleVisualize = async (idP) => {
    await dispatch(getProjeto(idP));
    window.location.reload(navigate('/PaginaVisualizarProjeto'));
  };
  const alertaDias = new Date(DataObjetivo).getTime() - new Date().getTime();

  let dias = Math.floor(alertaDias / (1000 * 60 * 60 * 24));

  if(Finalizado === true || !DataObjetivo){
    dias = "";
  }

  return (
    <Wrapper>
      <div className={verificaResultado === 1 ? '' : verificaResultado ? 'resultadoProjetoP' : 'resultadoProjetoN'}>
      <div className="list-group-item">
        <div className="row mb-3 text-center">
        <div className="col-md-3 themed-grid-col">
            <div className="row mb-3 text-center">
              <div className="col-md-6 themed-grid-col">
                <p>{Tema}</p>
              </div>
              <div className="col-md-6 themed-grid-col">
                <p>{Nome}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 themed-grid-col">
            <div className="row mb-3 text-center">
              <div className="col-md-6 themed-grid-col">
                <p>{Acao}</p>
              </div>
              <div className="col-md-6 themed-grid-col">
                <p>{Notas}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 themed-grid-col">
            <div className="row mb-3 text-center">
              <div className="col-md-6 themed-grid-col">
              <p>{DataObjetivo ? new Date(DataObjetivo).toLocaleDateString('en-CA') : ''}</p>
              </div>
              <div className="col-md-6 themed-grid-col">
                <p>{dias}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 themed-grid-col">
            <div className="row mb-3 text-center">
              <div className='col-md-6 themed-grid-col'>
                <button
                  type='button'
                  className='btn edit-btn'
                  onClick={() => toggleEdit(_id)}
                >
                  Editar
                </button>
                </div>
                <div className='col-md-6 themed-grid-col'>
                <button
                  type='button'
                  className='btn edit-btn'
                  onClick={() => toggleVisualize(_id)}
                >
                  Visualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <hr></hr>
    </Wrapper>
  );
};
export default Projeto;
