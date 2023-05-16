const FormRowSelect = ({ labelText, name, value, handleChange, list }) => {

  if(value === 1 && name === "tipo"){
    value = "Funcionario";
  }else if(value === 2 && name === "tipo"){
    value = "Administrador";
  }

  return (
    <div className='form-row'>
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
  );
};

export default FormRowSelect;
  