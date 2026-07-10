import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 1.5rem;
  padding-bottom: 3rem;

  & > .row {
    align-items: center;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.6rem;
    margin: 0;
    text-align: left;
    color: var(--grey-900);
  }

  h2 {
    text-transform: none;
    text-align: center;
    margin-top: 2.5rem;
    color: var(--grey-500);
    font-weight: 600;
  }

  & > .row h5 {
    font-weight: 600;
    color: var(--grey-600);
    margin: 0;
  }

  @media (max-width: 768px) {
    .finalizado {
      text-align: center;
    }
  }
  @media (min-width: 768px) {
    .finalizado {
      text-align: end;
    }
  }

  .projetos {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 1rem;
  }
`;

export default Wrapper;
