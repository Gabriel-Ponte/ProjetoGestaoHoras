import Wrapper from '@/styles/FormRowListaTipoTrabalho';
import { useEffect } from 'react';
import PropTypes from 'prop-types'; 


const FormRow = ({ type, name, value, handleChange, classNameInput, keyGet }) => {
  const id = `myTextarea${type}${name}${value}`;

  useEffect(() => {
    const textarea = document.getElementById(id);
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
  }, [id]);

  return (
    <Wrapper>
      <div className={/*className ? className :*/ 'form__group field'} key={keyGet}>
        {type === 'textarea' ? (
          <textarea
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className={classNameInput ? classNameInput : 'form__field refresh'}
          />

        ) : (
          <input
            id={id}
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
  labelText: PropTypes.string,
  classNameInput: PropTypes.string,
  keyGet: PropTypes.string.isRequired,
}


export default FormRow;
