import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .listaTiposTrabalho {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 700px) {
    .listaTiposTrabalho {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 1100px) {
    .listaTiposTrabalho {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .tt-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: var(--white);
    border: 1px solid var(--grey-200);
    border-radius: 10px;
    box-shadow: var(--shadow-1);
    padding: 1rem;
    transition: var(--transition);
  }
  .tt-card:hover {
    box-shadow: var(--shadow-2);
    border-color: var(--grey-300);
  }

  .tt-card-fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  .tiposTrabalho {
    margin-top: 0.25rem;
  }

  .tt-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    min-height: 2rem;
  }

  .tt-add {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .tt-add > *:first-child {
    flex: 1;
    min-width: 220px;
  }
`;

export default Wrapper;
