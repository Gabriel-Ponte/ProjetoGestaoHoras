import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/Projeto';
import { useDispatch } from 'react-redux';
import { getProjetoList } from '../features/projetos/projetosSlice';

const Dia = ({ _id, Data, NumeroHoras, Utilizador, tipoDeTrabalhoHoras, horasPossiveis }) => {
  const dispatch = useDispatch();
  const [projeto, setProjeto] = useState([]);
  const [horasTotal, sethorasTotal] = useState([]);
  let horasT= 0;
  useEffect(() => {
    const projetoList = tipoDeTrabalhoHoras.map(({ tipoTrabalho, horas, projeto }) => {
      horasT += Number(horas);
      return dispatch(getProjetoList(projeto)).then((res) => (
        {
        tipoTrabalho,
        horas,
        projeto: res.payload.projeto,
      }
      ));
    });
    sethorasTotal(horasT);
    Promise.all(projetoList).then((projetoArray) => {
      setProjeto(projetoArray);
    });
  }, [tipoDeTrabalhoHoras, dispatch]);
  
  
  
  //console.log(horasTotal);
  //console.log(horasPossiveis);
  const percentage = Math.round(horasTotal / horasPossiveis) * 100;
  //console.log(percentage + "%");



  return (
    <Wrapper>
      <div key={_id}>
        <div className="list-group-item" >
          <div className="row mb-3 text-center">
            <div className="col-md-3 themed-grid-col">
              <h3>{Data ? new Date(Data).toLocaleDateString('en-CA') : ''}</h3>
            </div>
            </div>
            
            <div className="row mb-3 text-center">
            <div className="col-md-3 themed-grid-col">
              <h4>{NumeroHoras}</h4>
            </div>
            <div className="col-md-6 themed-grid-col">
              {projeto.map(({ tipoTrabalho, horas, projeto }) => (
                <div className="row mb-3 text-center" key={projeto._id}>
                  <div className="col-md-6 themed-grid-col">
                      <h4>{projeto.Nome}</h4>
                      </div>
                      <div className="col-md-6 themed-grid-col">
                      <div className="row mb-3 text-center">
                        <div className="col-md-6 themed-grid-col">
                          {tipoTrabalho.split(',').map((trabalho, index) => (
                            <p key={index}>{trabalho.trim()}</p>
                          ))}
                        </div>
                        <div className="col-md-6 themed-grid-col">
                          {horas.split(',').map((horas, index) => (
                            <p key={index}>{horas.trim()}</p>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
            <hr></hr>
          </div>
        </div>
      </div>

    </Wrapper>

  );
};

export default Dia;
