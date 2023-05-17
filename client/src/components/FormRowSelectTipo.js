import Wrapper from '../assets/wrappers/FormRowSelect';

const FormRowSelect = ({ labelText, name, value, handleChange, list, className}) => {

  if(value === 1 && name === "tipo"){
    value = "Funcionario";
  }else if(value === 2 && name === "tipo"){
    value = "Administrador";
  }

  return (
    <Wrapper>
    <div className={className ? className : 'form-row'}>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className='form-select'
      >
        {list.map((itemValue, index) => {
          
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
    </Wrapper>
  );
};

export default FormRowSelect;
  