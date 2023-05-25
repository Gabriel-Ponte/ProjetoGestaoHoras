import Wrapper from '../assets/wrappers/FormRowSelect';

const FormRow = ({ type, name, value, handleChange, labelText, className, classNameLabel, classNameInput , required }) => {
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
          <input id={name} type={type} className={classNameInput} name={name} value={value} onChange={handleChange}  required={required ? true : undefined}/>
        </div>
      ) : (
        <input id={name} type={type} name={name} value={value} onChange={handleChange} className='form-input'  required={required ? true : undefined}/>
      )}
      <br></br>
    </div>
    </Wrapper>
  );
};

export default FormRow;
