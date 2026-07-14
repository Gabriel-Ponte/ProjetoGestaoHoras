import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * AppInput — the standard text-like input.
 * <AppInput type="email" value={v} onChange={fn} placeholder="nome@…" invalid={!!err} />
 */
const StyledInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.75rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--grey-900);
  background: var(--white);
  border: 1px solid ${(p) => (p.$invalid ? 'var(--red-dark)' : 'var(--grey-300)')};
  border-radius: var(--borderRadius);
  transition: var(--transition);

  &::placeholder {
    color: var(--grey-400);
  }
  &:focus {
    outline: none;
    border-color: ${(p) => (p.$invalid ? 'var(--red-dark)' : 'var(--primary-500)')};
    box-shadow: 0 0 0 3px
      ${(p) => (p.$invalid ? 'rgba(165, 31, 43, 0.15)' : 'rgba(30, 90, 150, 0.18)')};
  }
  &:disabled {
    background: var(--grey-100);
    color: var(--grey-500);
    cursor: not-allowed;
  }
`;

// React 19: `ref` is an ordinary prop — forwardRef is no longer needed.
const AppInput = ({ invalid = false, type = 'text', ref, ...rest }) => {
  return <StyledInput ref={ref} type={type} $invalid={invalid} {...rest} />;
};

AppInput.propTypes = {
  invalid: PropTypes.bool,
  type: PropTypes.string,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default AppInput;
