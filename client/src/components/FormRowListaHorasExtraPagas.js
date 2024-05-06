import Wrapper from '../assets/wrappers/FormRowListaTipoTrabalho';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSmaller from './LoadingSmaller';

const FormRowListaHorasExtraPagas = ({ type, value,  utilizadores, changed  }) => {
  const id = `myTextarea${type}${value}`;
  const { isLoadingPagamentos } = useSelector((store) => store.pagamentos);

  const [initialDate, setDate] = useState([]);
  const [initialName, setName] = useState([]);
  const [initialNameResponsavel, setNameResponsavel] = useState([]);
  let data = new Date()

  useEffect(() => {
      if(utilizadores && utilizadores.length > 0){
        utilizadores.filter((user) => {
          if (user._id === value.Utilizador) {
            setName(user.nome);
          }
          if(user._id === value.UtilizadorResponsavel) {
            setNameResponsavel(user.nome);
          }
        })
    }
    const mes = (value.Mes + 1)
    data =  (mes < 10 ? "0": "")  + mes + "/" + value.Ano;
    setDate(data)
  }, [id , changed, utilizadores, data]);

  if(isLoadingPagamentos){
    return (
    <div className='row'><LoadingSmaller /></div>
  );
  }
  
  return (
    <Wrapper>
      <div className={"row"}>
      <div className={"col-md-3 text-center"}>
            <p>{initialNameResponsavel}</p>
          </div>
        <div className={"col-md-3 text-center"}>
            <p>{initialName}</p>
          </div>
          <div className="col-md-3 text-center">
            <p>{initialDate}</p>
          </div>
      <div className="col-md-3 text-center">
         <p>{value.Horas}</p>  
    </div>
      </div>
    </Wrapper>
  );
};

export default FormRowListaHorasExtraPagas;
