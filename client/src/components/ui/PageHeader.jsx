import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * PageHeader — the title block at the top of a page.
 *
 * <PageHeader title="Gestão Projetos" subtitle="43 projetos em espera"
 *   actions={<AppButton>Novo</AppButton>} />
 */
const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  padding-bottom: 1rem;
  border-bottom: ${(p) => (p.$divider ? '1px solid var(--grey-200)' : 'none')};

  .page-header-titles {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  h1 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--grey-900);
    letter-spacing: -0.01em;
  }
  .page-header-subtitle {
    margin: 0;
    color: var(--grey-500);
    font-size: 0.95rem;
  }
  .page-header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const PageHeader = ({ title, subtitle, actions, divider = true, className }) => (
  <Header $divider={divider} className={className}>
    <div className="page-header-titles">
      {title && <h1>{title}</h1>}
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="page-header-actions">{actions}</div>}
  </Header>
);

PageHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  divider: PropTypes.bool,
  className: PropTypes.string,
};

export default PageHeader;
