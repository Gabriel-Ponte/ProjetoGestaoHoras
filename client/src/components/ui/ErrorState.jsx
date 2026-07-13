import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FiAlertTriangle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import AppButton from './AppButton';

/**
 * ErrorState — shown when something failed to load, with an optional retry.
 * <ErrorState message="Não foi possível carregar." onRetry={refetch} />
 */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.6rem;
  color: var(--grey-500);
  min-height: ${(p) => (p.$inline ? 'auto' : '38vh')};
  padding: ${(p) => (p.$inline ? '1rem' : '2.5rem 1rem')};

  .error-icon {
    display: grid;
    place-items: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    background: var(--red-light);
    color: var(--red-dark);
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
  }
  .error-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--grey-800);
  }
  .error-message {
    margin: 0;
    font-size: 0.9rem;
    max-width: 46ch;
  }
  .error-action {
    margin-top: 0.6rem;
  }
`;

const ErrorState = ({ title, message, onRetry, retryLabel, inline = false }) => {
  const { t } = useTranslation('common');
  const heading = title === undefined ? t('state.errorTitle') : title;
  const body = message === undefined ? t('state.errorMessage') : message;
  const retry = retryLabel === undefined ? t('actions.retry') : retryLabel;

  return (
    <Wrap $inline={inline} role="alert">
      <span className="error-icon" aria-hidden="true"><FiAlertTriangle /></span>
      {heading && <p className="error-title">{heading}</p>}
      {body && <p className="error-message">{body}</p>}
      {onRetry && (
        <div className="error-action">
          <AppButton variant="secondary" size="sm" onClick={onRetry}>
            {retry}
          </AppButton>
        </div>
      )}
    </Wrap>
  );
};

ErrorState.propTypes = {
  title: PropTypes.node,
  message: PropTypes.node,
  onRetry: PropTypes.func,
  retryLabel: PropTypes.string,
  inline: PropTypes.bool,
};

export default ErrorState;
