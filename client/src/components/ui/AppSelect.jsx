import { forwardRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * AppSelect — the standard native select, styled to match AppInput.
 *
 * <AppSelect value={v} onChange={fn} options={[{value:'a', label:'A'}]} placeholder="Escolher…" />
 * or pass <option> children directly.
 */
const StyledSelect = styled.select`
  width: 100%;
  padding: 0.55rem 2.25rem 0.55rem 0.75rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--grey-900);
  background-color: var(--white);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  border: 1px solid ${(p) => (p.$invalid ? 'var(--red-dark)' : 'var(--grey-300)')};
  border-radius: var(--borderRadius);
  appearance: none;
  cursor: pointer;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: ${(p) => (p.$invalid ? 'var(--red-dark)' : 'var(--primary-500)')};
    box-shadow: 0 0 0 3px
      ${(p) => (p.$invalid ? 'rgba(165, 31, 43, 0.15)' : 'rgba(30, 90, 150, 0.18)')};
  }
  &:disabled {
    background-color: var(--grey-100);
    color: var(--grey-500);
    cursor: not-allowed;
  }
`;

const AppSelect = forwardRef(
  ({ invalid = false, options, placeholder, children, ...rest }, ref) => {
    return (
      <StyledSelect ref={ref} $invalid={invalid} {...rest}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label ?? o.value}
              </option>
            ))
          : children}
      </StyledSelect>
    );
  }
);

AppSelect.displayName = 'AppSelect';

AppSelect.propTypes = {
  invalid: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node,
    })
  ),
  children: PropTypes.node,
};

export default AppSelect;
