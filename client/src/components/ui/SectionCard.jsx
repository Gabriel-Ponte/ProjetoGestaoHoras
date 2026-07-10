import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * SectionCard — a titled surface for grouping content (forms, tables, panels).
 *
 * <SectionCard title="Dados do projeto" actions={<AppButton size="sm">Editar</AppButton>}>
 *   …
 * </SectionCard>
 */
const Card = styled.section`
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: 10px;
  box-shadow: var(--shadow-1);
  overflow: hidden;

  .section-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--grey-200);
  }
  .section-card-titles {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .section-card-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--grey-900);
  }
  .section-card-subtitle {
    margin: 0;
    font-size: 0.85rem;
    color: var(--grey-500);
  }
  .section-card-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .section-card-body {
    padding: ${(p) => (p.$noPadding ? '0' : '1.25rem')};
  }
  .section-card-footer {
    padding: 0.85rem 1.25rem;
    border-top: 1px solid var(--grey-200);
    background: var(--grey-50);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`;

const SectionCard = ({
  title,
  subtitle,
  actions,
  footer,
  noPadding = false,
  children,
  className,
  ...rest
}) => {
  const hasHead = title || subtitle || actions;
  return (
    <Card $noPadding={noPadding} className={className} {...rest}>
      {hasHead && (
        <div className="section-card-head">
          <div className="section-card-titles">
            {title && <h2 className="section-card-title">{title}</h2>}
            {subtitle && <p className="section-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="section-card-actions">{actions}</div>}
        </div>
      )}
      <div className="section-card-body">{children}</div>
      {footer && <div className="section-card-footer">{footer}</div>}
    </Card>
  );
};

SectionCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  footer: PropTypes.node,
  noPadding: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default SectionCard;
