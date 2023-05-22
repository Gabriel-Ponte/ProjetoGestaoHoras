import Wrapper from '../assets/wrappers/FormRowSelect';

const FormRowSelect = ({ labelText, name, value, handleChange, list, className}) => {

  if(value === 1 && name === "tipo"){
    value = "Funcionario";
  }else if(value === 2 && name === "tipo"){
    value = "Administrador";
  }

  return (
    <Wrapper>
    <div className={className ? className : 'form-row text-center'} style={{ width: '100%' }}>
      {labelText !== " " &&
      <label className='form-label'>
        {labelText || name}
      </label>
      }
      
      <div className="text-center" style={{ width: '75%', marginLeft: 'auto' , marginRight:'auto'}}>
      <select
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className='form-select '

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

export default FormRowSelect;
  