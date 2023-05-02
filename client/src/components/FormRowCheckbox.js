const FormRowCheckbox = ({ type, name, value, handleChange, labelText, className, classNameLabel, classNameInput }) => {
    const isChecked = value === true || value === 'true';
    return (
      <div className={className ? className : 'form-row'}>
        {classNameLabel !== null ? (
          <div className={classNameLabel ? classNameLabel : 'form-label'}>{labelText || name}</div>
        ) : (
          <label htmlFor={name} className='form-label'>
            {labelText || name}
          </label>
        )}
        {classNameInput !== null ? (
          <div className={classNameInput ? classNameInput : 'form-input'}>
            <input id={name} type='checkbox' name={name} checked={isChecked} onChange={handleChange} />
          </div>
        ) : (
          <input id={name} type='checkbox' name={name} checked={isChecked} onChange={handleChange} className='form-input' />
        )}
        <br></br>
      </div>
    );
  };
  
  export default FormRowCheckbox;
  