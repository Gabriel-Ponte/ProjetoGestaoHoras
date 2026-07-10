import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * AppButton — the single, consistent button for the whole app.
 *
 * <AppButton variant="primary" size="md" onClick={...}>Guardar</AppButton>
 * <AppButton variant="danger" leftIcon={<FaTrash />} loading>A apagar…</AppButton>
 */
const spin = keyframes`to { transform: rotate(360deg); }`;

const sizes = {
  sm: css`
    padding: 0.35rem 0.75rem;
    font-size: 0.82rem;
  `,
  md: css`
    padding: 0.55rem 1.1rem;
    font-size: 0.95rem;
  `,
  lg: css`
    padding: 0.7rem 1.4rem;
    font-size: 1.05rem;
  `,
};

const variants = {
  primary: css`
    background: var(--primary-500);
    border-color: var(--primary-500);
    color: #fff;
    &:hover:not(:disabled) {
      background: var(--primary-600);
      border-color: var(--primary-600);
    }
  `,
  secondary: css`
    background: var(--white);
    border-color: var(--grey-300);
    color: var(--grey-800);
    &:hover:not(:disabled) {
      background: var(--grey-50);
      border-color: var(--primary-300);
      color: var(--primary-700);
    }
  `,
  danger: css`
    background: var(--red-dark);
    border-color: var(--red-dark);
    color: #fff;
    &:hover:not(:disabled) {
      filter: brightness(1.08);
    }
  `,
  success: css`
    background: var(--green-dark);
    border-color: var(--green-dark);
    color: #fff;
    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  `,
  ghost: css`
    background: transparent;
    border-color: transparent;
    color: var(--primary-600);
    &:hover:not(:disabled) {
      background: var(--primary-50);
    }
  `,
  link: css`
    background: transparent;
    border-color: transparent;
    color: var(--primary-600);
    padding-left: 0;
    padding-right: 0;
    &:hover:not(:disabled) {
      text-decoration: underline;
      color: var(--primary-700);
    }
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border: 1px solid transparent;
  border-radius: var(--borderRadius);
  font-family: inherit;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition);
  ${(p) => sizes[p.$size] || sizes.md}
  ${(p) => variants[p.$variant] || variants.primary}
  ${(p) => p.$fullWidth && 'width: 100%;'}

  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .app-btn-spinner {
    width: 0.9em;
    height: 0.9em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
  }
  .app-btn-icon {
    display: inline-flex;
    font-size: 1.05em;
  }
`;

const AppButton = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="app-btn-spinner" aria-hidden="true" />}
      {!loading && leftIcon && <span className="app-btn-icon">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="app-btn-icon">{rightIcon}</span>}
    </StyledButton>
  );
};

AppButton.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'ghost', 'link']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
};

export default AppButton;
