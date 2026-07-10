import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * FormGroup — label + control + help/error text, consistently spaced.
 *
 * <FormGroup label="Email" htmlFor="email" required error={err}>
 *   <AppInput id="email" ... />
 * </FormGroup>
 */
const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;

  .form-group-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--grey-600);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .form-group-req {
    color: var(--red-dark);
    margin-left: 0.15rem;
  }
  .form-group-help {
    font-size: 0.8rem;
    color: var(--grey-500);
  }
  .form-group-error {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--red-dark);
  }
`;

const FormGroup = ({ label, htmlFor, required, error, help, children, className }) => {
  return (
    <Group className={className}>
      {label && (
        <label className="form-group-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="form-group-req" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {help && !error && <span className="form-group-help">{help}</span>}
      {error && <span className="form-group-error" role="alert">{error}</span>}
    </Group>
  );
};

FormGroup.propTypes = {
  label: PropTypes.node,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  help: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default FormGroup;
