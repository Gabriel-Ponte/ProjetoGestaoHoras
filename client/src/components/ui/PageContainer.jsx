import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * PageContainer — constrains page content to a comfortable width and adds
 * consistent horizontal padding. Wrap the body of any page in this.
 */
const Container = styled.div`
  width: 100%;
  max-width: ${(p) => p.$maxWidth || 'var(--max-width)'};
  margin: 0 auto;
  padding: 0 1.25rem;

  display: flex;
  flex-direction: column;
  gap: ${(p) => p.$gap || '1.5rem'};
`;

const PageContainer = ({ children, maxWidth, gap, className }) => (
  <Container $maxWidth={maxWidth} $gap={gap} className={className}>
    {children}
  </Container>
);

PageContainer.propTypes = {
  children: PropTypes.node,
  maxWidth: PropTypes.string,
  gap: PropTypes.string,
  className: PropTypes.string,
};

export default PageContainer;
