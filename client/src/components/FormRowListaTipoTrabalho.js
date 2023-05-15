import Wrapper from '../assets/wrappers/FormRowListaTipoTrabalho';
import React, { useEffect } from 'react';

const FormRow = ({ type, name, value, handleChange, className, classNameInput }) => {
  const id = `myTextarea${type}${name}${value}`;

  useEffect(() => {
    const textarea = document.getElementById(id);

    if (textarea) {
      textarea.addEventListener('focusout', () => {
        textarea.style.width = '';
        textarea.style.height = '';
      });
    }
  }, [id]);

  return (
    <Wrapper>
      <div className={/*className ? className :*/ 'form__group field'}>
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

export default FormRow;
