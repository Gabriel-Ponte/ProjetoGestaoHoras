import styled from 'styled-components';

const Wrapper = styled.section`
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: var(--white);
    border-top: 1px solid var(--grey-200);
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.06);
  }

  .footer-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0.6rem 1.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.35rem 1.25rem;
    color: var(--grey-600);
    font-size: var(--small-text);
  }

  .footer-item {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--grey-600);
    text-decoration: none;
    white-space: nowrap;
    transition: var(--transition);
  }

  a.footer-item:hover {
    color: var(--primary-600);
  }

  .footer-item svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }

  .footer-sep {
    color: var(--grey-300);
    user-select: none;
  }

  @media (max-width: 600px) {
    .footer-inner {
      gap: 0.2rem 0.9rem;
      padding: 0.5rem 1rem;
      font-size: var(--extra-small-text);
    }
    .footer-sep {
      display: none;
    }
  }
`;

export default Wrapper;
