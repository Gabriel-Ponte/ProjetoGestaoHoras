import PropTypes from 'prop-types'; 

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
            <input id={name} type={type} name={name} checked={isChecked} onChange={handleChange} />
          </div>
        ) : (
          <input id={name} type={type} name={name} checked={isChecked} onChange={handleChange} className='form-input' />
        )}
        <br></br>
      </div>
    );
  };
  

  FormRowCheckbox.propTypes = {
    type: PropTypes.string,
    name : PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.bool.isRequired,
      PropTypes.string.isRequired
    ]).isRequired,
    handleChange: PropTypes.func.isRequired,
    labelText: PropTypes.string, 
    className: PropTypes.string, 
    classNameLabel: PropTypes.string, 
    classNameInput: PropTypes.string, 
  }
  export default FormRowCheckbox;
  