import Wrapper from '@/styles/FormRowSelectListaProjetos';
import { useEffect } from 'react';
import PropTypes from 'prop-types'; 


const FormRow = ({ type, name, value, handleChange, className, classNameInput, id }) => {
  const idF = `${id}`;

  useEffect(() => {
    const textarea = document.getElementById(idF);
    if (!textarea) return undefined;

    // The listener MUST be removed on cleanup. This component renders once per
    // table row, so without this every re-render leaked another 'focusout'
    // listener onto the element.
    const resetSize = () => {
      textarea.style.width = '';
      textarea.style.height = '';
    };

    textarea.addEventListener('focusout', resetSize);
    return () => textarea.removeEventListener('focusout', resetSize);
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
