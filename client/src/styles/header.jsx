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

  @media (max-width: 700px) {
    .header .container {
      padding: 0.65rem 1rem;
    }
    .imageLogo {
      height: 40px;
    }
  }
`;

export default Wrapper;
