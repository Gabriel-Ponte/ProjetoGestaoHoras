import Wrapper from '../assets/wrappers/FormRowSelectTipo';

const FormRowSelectTipo = ({ labelText, name, value, handleChange, list, className}) => {

  if(value === 1 && name === "tipo"){
    value = "Funcionario";
  }else if(value === 2 && name === "tipo"){
    value = "Administrador";
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
  }
  

  const containerStyle = {
    width: value === "Compensação" || value === "Extra" ? '100%' : '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <Wrapper>
    <div className={className ? className : 'form-row text-center'} style={{ width: '100%' }}>
      {labelText !== " " &&
      <label className='form-label'>
        {labelText || name}
      </label>
      }
      
      <div className="text-center" style={containerStyle}>
      <select
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className='form-select'
        disabled={value === "Compensação" || value === "Extra"}
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

export default FormRowSelectTipo;
  