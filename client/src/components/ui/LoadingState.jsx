import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * LoadingState — consistent spinner + optional message.
 * `inline` keeps it compact (inside a card/table); default fills its area.
 */
const spin = keyframes`to { transform: rotate(360deg); }`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  color: var(--grey-500);
  min-height: ${(p) => (p.$inline ? 'auto' : '40vh')};
  padding: ${(p) => (p.$inline ? '1rem' : '2rem')};

  .spinner {
    width: ${(p) => p.$size}px;
    height: ${(p) => p.$size}px;
    border: ${(p) => Math.max(2, Math.round(p.$size / 12))}px solid var(--grey-200);
    border-top-color: var(--primary-500);
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
  p {
    margin: 0;
    font-size: 0.92rem;
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner { animation-duration: 2s; }
  }
`;

const LoadingState = ({ message = 'A carregar…', inline = false, size = 44 }) => (
  <Wrap $inline={inline} $size={size} role="status" aria-live="polite">
    <span className="spinner" aria-hidden="true" />
    {message && <p>{message}</p>}
  </Wrap>
);

LoadingState.propTypes = {
  message: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.number,
};

export default LoadingState;
