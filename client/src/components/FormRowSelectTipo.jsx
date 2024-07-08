import { memo } from 'react';
import Wrapper from '../assets/wrappers/FormRowSelectTipo';
import PropTypes from 'prop-types'; 

const FormRowSelectTipo =  ({ labelText, name, value, handleChange, list, className , keyGet}) => {
  if(value === 1 && name === "tipo"){
    value = "Engenharia de Processos";
  }else if(value === 2 && name === "tipo"){
    value = "Administrador";
  }else if(value === 3 && name === "tipo"){
    value = "Laboratorio";
  }else if(value === 4 && name === "tipo"){
    value = "Outro";
  }else if(value === 5 && name === "tipo"){
    value = "Administrador Engenharia";
  }else if(value === 6 && name === "tipo"){
    value = "Administrador Laboratorio";
  }else if(value === 7 && name === "tipo"){
    value = "Administrador Recursos Humanos";
  }

  if(value === 1 && name === "tipoT"){
    value = "Projetos";
  }else if(value === 2 && name === "tipoT"){
    value = "Geral";
  }else if(value === 3 && name === "tipoT"){
    value = "Outro";
  }else if(value === 4 && name === "tipoT"){
    value = "Compensação";
  }else if(value === 5 && name === "tipoT"){
    value = "Extra";
  }else if(value === 6 && name === "tipoT"){
    value = "Compensação Domingo";
  }
  


  const containerStyle = {
    width: value === "Compensação" || value === "Extra" ? '100%' : '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
  };
  
  const generateUniqueId = `tt-${keyGet}`;

  return (
    <Wrapper>
    <div className={className ? className : 'form-row text-center'} style={{ width: '100%' }} key={keyGet}>
      {labelText !== " " &&

      <label htmlFor={keyGet} className='form-label'>  {labelText || name} </label>
      }
      
      <div className="text-center" style={containerStyle}>
      <select
        key={generateUniqueId}
        name={name}
        id = {keyGet}
        value={value}
        onChange={handleChange}
        className='form-select'
        disabled={value === "Compensação" || value === "Extra" || value === "Compensação Domingo"}
      >
        {list.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}

      </select>
      <br></br>
      </div>
    </div>
    </Wrapper>
  );
};

FormRowSelectTipo.propTypes = {
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  list: PropTypes.array,
  className: PropTypes.string,
  keyGet: PropTypes.string,
}

export default memo(FormRowSelectTipo);
  