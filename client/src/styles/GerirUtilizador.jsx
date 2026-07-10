import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .listaTiposUtilizador {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 700px) {
    .listaTiposUtilizador {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 1100px) {
    .listaTiposUtilizador {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .user-card {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    background: var(--white);
    border: 1px solid var(--grey-200);
    border-radius: 10px;
    box-shadow: var(--shadow-1);
    padding: 1rem;
    transition: var(--transition);
  }
  .user-card:hover {
    box-shadow: var(--shadow-2);
    border-color: var(--grey-300);
  }

  .user-card-info {
    text-align: center;
  }
  .user-name {
    margin: 0;
    font-weight: 600;
    color: var(--grey-900);
  }
  .user-email {
    margin: 0;
    font-size: 0.85rem;
    color: var(--grey-500);
    word-break: break-word;
  }

  .user-actions {
    display: flex;
    justify-content: flex-end;
    min-height: 2rem;
  }
`;

export default Wrapper;
