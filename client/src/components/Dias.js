import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/Dias';
import { useDispatch } from 'react-redux';
import { getProjetoList } from '../features/projetos/projetosSlice';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';

const Dia = ({ _id, Data, NumeroHoras, Utilizador, tipoDeTrabalhoHoras, horasPossiveis }) => {

  const dispatch = useDispatch();
  const [projeto, setProjeto] = useState([]);
  const [horasTotal, sethorasTotal] = useState([]);
  let horasT = 0;

  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");

  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
        const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
        setListaTipoTrabalho(tipoTrabalhoArray);
    });
  }, []);

  useEffect(() => {
    const projetoList = tipoDeTrabalhoHoras.map(({ tipoTrabalho, horas, projeto }) => {
      horasT += Number(horas);
      const horasArray = horas.split(',') || [];
      const tipoTrabalhoArray = tipoTrabalho.split(',') || [];
  
      for (let a = horasArray.length - 1; a >= 0; a--) {
        if (horasArray[a] == 0) {
          tipoTrabalhoArray.splice(a, 1);
          horasArray.splice(a, 1);
        }
      }
  
      if (tipoTrabalhoArray.length === 0) {
        return null;
      }
  
      tipoTrabalho = tipoTrabalhoArray.join(",");
      horas = horasArray.join(",");
  
      return dispatch(getProjetoList(projeto)).then((res) => ({
        tipoTrabalho,
        horas,
        projeto: res.payload.projeto,
      }));
    }) // Filter out any null values
  
    sethorasTotal(horasT);
  
    Promise.all(projetoList).then((projetoArray) => {
      const filteredProjetoArray = projetoArray.filter((projeto) => projeto !== null);
      setProjeto(filteredProjetoArray);
    });
  }, [tipoDeTrabalhoHoras, dispatch]);

  return (
    <Wrapper>
      <div key={_id}>
        <div className='dias'>
          <div className="list-group-item" >
            <div className="row text-center">
              <div className="col-md-3 themed-grid-col">
                <h3>{Data ? new Date(Data).toLocaleDateString('en-CA') : ''}</h3>
              </div>
            </div>

            <div className="row text-center">
              <div className="col-md-3 themed-grid-col">
                <h4>{NumeroHoras}</h4>
              </div>
              <div className="col-md-9 themed-grid-col">
                {projeto.map(({ tipoTrabalho, horas, projeto }) => (
                  <div className="row text-center" key={projeto._id}>
                    <hr className='hrP'></hr>
                    <div className="col-md-6 themed-grid-col projeto">
                      <h4>{projeto.Nome}</h4>
                    </div>
                    <div className="col-md-6 themed-grid-col">
                      <div className="row text-center">
                        <div className="col-md-6 themed-grid-col">

                        {tipoTrabalho.split(',').map((trabalho, index) => {
                          let counter = 0;
                          for (let i = 0; i < listaTipoTrabalho.length; i++) {
                            if (trabalho === listaTipoTrabalho[i]._id) {
                              return <p key={index}>{listaTipoTrabalho[i].TipoTrabalho.trim()}</p>;
                              counter++;
                            }
                          }
                          if (counter === 0) {
                            return <p key={index}>Tipo de Trabalho Apagado</p>;
                          }
                        })}
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
      </div>

    </Wrapper>

  );
};

export default Dia;
