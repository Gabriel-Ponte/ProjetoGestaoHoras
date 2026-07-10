import PropTypes from 'prop-types';
import PageContainer from './PageContainer';
import PageHeader from './PageHeader';

/**
 * AppLayout — the standard page scaffold used *inside* the dashboard shell
 * (SharedLayout). Gives every page the same title block + content width in one
 * line, so pages stop re-inventing their own header/spacing.
 *
 * <AppLayout title="Gestão Projetos" subtitle="43 em espera" actions={<AppButton>Novo</AppButton>}>
 *   <SectionCard>…</SectionCard>
 * </AppLayout>
 */
const AppLayout = ({ title, subtitle, actions, headerDivider = true, maxWidth, children }) => {
  const hasHeader = title || subtitle || actions;
  return (
    <PageContainer maxWidth={maxWidth}>
      {hasHeader && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={actions}
          divider={headerDivider}
        />
      )}
      {children}
    </PageContainer>
  );
};

AppLayout.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  headerDivider: PropTypes.bool,
  maxWidth: PropTypes.string,
  children: PropTypes.node,
};

export default AppLayout;
