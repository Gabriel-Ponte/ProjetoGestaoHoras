import Wrapper from '@/styles/FormRowSelect';
import PropTypes from 'prop-types'; 


const FormRow = ({ type, name, value, handleChange, labelText, className, classNameLabel, classNameInput,classNameInputDate, required, autocomp }) => {
  return (
    <Wrapper>
      <div className={className ? className : 'form-row'}>
        {classNameLabel !== null ? (
          <div className={classNameLabel ? classNameLabel : 'form-label'}>{labelText || name}</div>
        ) : (
          <label htmlFor={name} className='form-label'>
            {labelText || name}
          </label>
        )}
        {classNameInput !== null ? (
          <div className={classNameInput ? classNameInput : 'form-input text-center'}>
            <input
              id={name}
              type={type}
              className={classNameInputDate ? classNameInputDate: "form-input"}
              name={name}
              value={value}
              onChange={handleChange}
              autoComplete = {autocomp}
              required={required ? true : undefined} />
          </div>
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            autoComplete = {autocomp}
            className={classNameInputDate ? classNameInputDate: 'form-input'}
            required={required ? true : undefined} />
            
        )}
        <br></br>
      </div>
    </Wrapper>
  );
};


FormRow.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  labelText: PropTypes.string,
  className: PropTypes.string.isRequired,
  classNameLabel: PropTypes.string,
  classNameInput: PropTypes.string,
  classNameInputDate: PropTypes.string,
  required: PropTypes.string,
  autocomp: PropTypes.string,
}


export default FormRow;
