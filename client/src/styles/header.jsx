import styled from 'styled-components';

const Wrapper = styled.section`
  .header {
    position: relative;
    width: 100%;
    background: var(--white);
    border-top: 3px solid var(--primary-500); /* brand accent */
    border-bottom: 1px solid var(--grey-200);
    box-shadow: var(--shadow-1);
  }

  .header .container {
    position: relative; /* anchor for .header-actions */
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
  }

  .imageLogo {
    display: block;
    height: 52px;
    width: auto;
    max-width: 85%;
    object-fit: contain;
  }

  /* Absolutely positioned so the logo stays optically centred. */
  .header-actions {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 700px) {
    .header .container {
      padding: 0.65rem 1rem;
    }
    .imageLogo {
      height: 40px;
    }
    .header-actions {
      right: 0.75rem;
      gap: 0.35rem;
    }
  }

  /* Very small screens: stop the controls overlapping the logo. */
  @media (max-width: 420px) {
    .header .container {
      flex-direction: column;
      gap: 0.6rem;
    }
    .header-actions {
      position: static;
      transform: none;
    }
  }
`;

export default Wrapper;
