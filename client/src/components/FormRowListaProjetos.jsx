import Wrapper from '../assets/wrappers/FormRowSelectListaProjetos';
import { useEffect } from 'react';
import PropTypes from 'prop-types'; 


const FormRow = ({ type, name, value, handleChange, className, classNameInput, id }) => {
  const idF = `${id}`;

  useEffect(() => {
    const textarea = document.getElementById(idF);
    if (textarea) {
      textarea.addEventListener('focusout', () => {
        textarea.style.width = '';
        textarea.style.height = '';
      });
    }
  }, [idF]);

  return (
    <Wrapper>
      <div className={className ? className : 'form__group field'}>
        {type === 'textarea' ? (
          <textarea
            id={idF}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className={classNameInput ? classNameInput : 'form__field refresh'}
          />
        ) : (
          <input
            id={idF}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className={classNameInput ? classNameInput : 'form__field'}
          />
        )}
      </div>
    </Wrapper>
  );
};

FormRow.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  classNameInput: PropTypes.string,
  id: PropTypes.string.isRequired,
}


export default FormRow;
