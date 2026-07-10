import styled from 'styled-components';
import PropTypes from 'prop-types';
import AppInput from '@/components/ui/AppInput';

/**
 * FormRow — label + text input, in a configurable Bootstrap grid.
 *
 * The raw <input> was retired in favour of the design-system AppInput, so every
 * screen that uses FormRow now renders the same token-styled control. The public
 * API (className / classNameLabel / classNameInput grid slots) is unchanged, so
 * no consumer needed editing.
 */
const Wrapper = styled.section`
  .form-label {
    display: inline-block;
    margin-bottom: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--grey-600);
  }
  .form-row {
    margin-bottom: 0.5rem;
  }
`;

const FormRow = ({
  type,
  name,
  value,
  handleChange,
  labelText,
  className,
  classNameLabel,
  classNameInput,
  classNameInputDate,
  required,
  autocomp,
}) => {
  const input = (
    <AppInput
      id={name}
      type={type}
      className={classNameInputDate ? classNameInputDate : 'form-input'}
      name={name}
      value={value}
      onChange={handleChange}
      autoComplete={autocomp}
      required={required ? true : undefined}
    />
  );

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
          <div className={classNameInput ? classNameInput : 'form-input text-center'}>{input}</div>
        ) : (
          input
        )}
        <br />
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
};

export default FormRow;
