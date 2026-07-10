import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FiInbox } from 'react-icons/fi';

/**
 * EmptyState — friendly "nothing here yet" placeholder with an optional action.
 * <EmptyState title="Sem projetos" message="Ainda não há projetos." action={<AppButton>Novo</AppButton>} />
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

  .empty-icon {
    display: grid;
    place-items: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    background: var(--grey-100);
    color: var(--grey-400);
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
  }
  .empty-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--grey-700);
  }
  .empty-message {
    margin: 0;
    font-size: 0.9rem;
    max-width: 42ch;
  }
  .empty-action {
    margin-top: 0.6rem;
  }
`;

const EmptyState = ({ icon, title = 'Sem resultados', message, action, inline = false }) => (
  <Wrap $inline={inline}>
    <span className="empty-icon" aria-hidden="true">{icon || <FiInbox />}</span>
    {title && <p className="empty-title">{title}</p>}
    {message && <p className="empty-message">{message}</p>}
    {action && <div className="empty-action">{action}</div>}
  </Wrap>
);

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node,
  message: PropTypes.node,
  action: PropTypes.node,
  inline: PropTypes.bool,
};

export default EmptyState;
