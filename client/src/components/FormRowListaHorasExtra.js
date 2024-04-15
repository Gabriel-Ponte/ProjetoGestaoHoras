import Wrapper from '../assets/wrappers/FormRowListaTipoTrabalho';

import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import LoadingSmaller from './LoadingSmaller';

const FormRowListaHorasExtra = ({ type, value, className, classNameInput, utilizadores, changed  }) => {
  const id = `myTextarea${type}${value}`;

  const { isLoading } = useSelector((store) => store.allDias);


  const [initialDate, setDate] = useState([]);
  const [initialName, setName] = useState([]);
  let data = new Date()

  useEffect(() => {
    const fullData = new Date(value.Data)
    console.log(fullData)
    const dataDay = fullData.getDate();
    const dataMonth = fullData.getMonth() + 1;
    const dataYear = fullData.getFullYear();

      if(utilizadores && utilizadores.length > 0){
        utilizadores.filter((user) => {
          if (user._id == value.Utilizador) {
            setName(user.nome);
          }
        })
    }


    data = dataDay + "/" + dataMonth + "/" + dataYear
    setDate(data)
   
  }, [id, changed]);



  return (
    <Wrapper>
      <div className={"row"}>
        <div className={"col-md-3 text-center"}>
            <p>{initialName}</p>
          </div>
          <div className="col-md-2 text-center">
            <p>{initialDate}</p>
          </div>
          <div className="col-md-2 text-center">
          <p>{value.NumeroHoras}</p>
      </div>
      <div className="col-md-5 text-center">
      {value?.tipoDeTrabalhoHoras?.map((t, index) => {
        const project = t.projeto;
        const tipoT = t.tipoTrabalho.split(',');
        const hours = t.horas.split(',');
        return(
        <div key={`${index}`} className='row'>
        <div className='col-md-12'>
            <h5>{project.trim()}</h5>
        </div>
        {tipoT.map((tt, j) => (
            <div key={`${index}_${j}`} className='row'>
            <div className='col-md-8'>
              <p>{tt.trim()}</p>
            </div>
            <div className='col-md-4 text-center'>
              <p>{hours[j].trim()}</p>
            </div>
            </div>
        ))}
    
      </div>
          );
      })}
    </div>
      </div>
    </Wrapper>
  );
};

export default FormRowListaHorasExtra;
