import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/Dias';
import { useDispatch } from 'react-redux';
import { getProjetoList } from '../features/projetos/projetosSlice';
import { AiFillDelete } from 'react-icons/ai';
import { deleteDia } from '../features/dias/diasSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dia = ({ _id, Data, NumeroHoras, Utilizador, tipoDeTrabalhoHoras, horasPossiveis, listaTT }) => {

  const dispatch = useDispatch();
  const [projeto, setProjeto] = useState([]);
  const [horasTotal, sethorasTotal] = useState([]);
  const navigate = useNavigate();
  let horasT = 0;


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

  
  const deleteDiaConfirm = async (id ,data) => {
    try {
      const dataString = (data ? new Date(data).toLocaleDateString('en-CA') : '')

      const confirmed = window.confirm("Tem a certeza que deseja apagar o Dia: "+ dataString +"?");

      if (confirmed) {
        const result = await dispatch(deleteDia(id));
        if (!result.error) {
          toast.success("Dia Apagado")
            setTimeout(() => {
              window.location.href = '/PaginaVisualizarHoras';
            }, 1000);
          ;
        }
      }
    } catch (error) {
      console.log(error);
      return "Ocorreu um erro ao apagar o Tipo de Trabalho.";
    }
  };
  

  return (
    <Wrapper>
      <div key={_id}>
        <div className='dias'>
          <div className="list-group-item" >
            <div className="row text-center">
              <div className="col-md-3 themed-grid-col">
                <h3>{Data ? new Date(Data).toLocaleDateString('en-CA') : ''}</h3>
              </div>
              <div>
                <button type='submit'
                  onClick={() => deleteDiaConfirm(_id , Data)}
                  className="btn">
                  <AiFillDelete />
                </button>

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
                          if(listaTT){
                          for (let i = 0; i < listaTT.length; i++) {
                            
                            if (trabalho === listaTT[i]._id) {
                              return <p key={index}>{listaTT[i].TipoTrabalho.trim()}</p>;
                              counter++;
                            }
                          }}
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
