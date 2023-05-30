import Wrapper from '../assets/wrappers/FormRowSelect';

const FormRow = ({ type, name, value, handleChange, labelText, className, classNameLabel, classNameInput, required }) => {
  // Calculate the content size
  const contentSize = value ? value.length : 0; // Assuming the value is a string
  // Calculate the input size based on content size
  let inputSize = "auto";
  let textSize = "100%";  
  if (contentSize > 30) {
    inputSize = 70;
    if(contentSize > 60){
    inputSize = 100;
    }
    if (contentSize < 60){
      inputSize = 70;
    }
    if(contentSize >100){
      textSize = "70%"
    }
    if(contentSize >150){
      textSize = "60%"
    }
  }


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
              className={"form-input"}
              name={name}
              value={value}
              onChange={handleChange}
              style={{ width: inputSize + '%' , fontSize: textSize}} // Set the width dynamically
              required={required ? true : undefined} />
          </div>
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className='form-input'
            style={{ width: inputSize + '%', fontSize: textSize}} // Set the width dynamically
            required={required ? true : undefined} />
            
        )}
        <br></br>
      </div>
    </Wrapper>
  );
};

export default FormRow;
