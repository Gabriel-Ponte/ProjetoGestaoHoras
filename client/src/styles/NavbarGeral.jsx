import styled from 'styled-components';

const Wrapper = styled.nav`
  position: sticky;
  top: 0;
  z-index: 998;
  background: var(--white);
  border-bottom: 1px solid var(--grey-200);
  box-shadow: var(--shadow-1);

  .subheader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    min-height: 68px;
    padding: 0.5rem 1.25rem;
    background: var(--white);
  }

  .middleButton {
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  /* main nav buttons ("Adicionar Horas" / "Visualizar Horas") */
  .subheader .btn-outline-secondary {
    font-weight: 600;
    color: var(--grey-800);
    background: var(--white);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    transition: var(--transition);
  }
  .subheader .btn-outline-secondary:hover {
    background: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
  }
  .subheader .btn-outline-secondary.active {
    color: var(--white);
    background: var(--primary-500);
    border-color: var(--primary-500);
  }

  /* user chip */
  .btn-container {
    position: relative;
  }
  .divButtonUtilizador {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .divButtonUtilizador > .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: var(--grey-50);
    border: 1px solid var(--grey-200);
    border-radius: 999px;
    padding: 0.3rem 0.75rem;
    color: var(--grey-800);
    font-weight: 500;
    box-shadow: none;
    transition: var(--transition);
  }
  .divButtonUtilizador > .btn:hover {
    background: var(--primary-50);
    border-color: var(--primary-200);
    color: var(--primary-700);
  }
  .divButtonUtilizador .rounded-circle {
    object-fit: cover;
    border-radius: 50%;
  }

  .toggle-btn {
    background: transparent;
    border: none;
    font-size: 1.4rem;
    color: var(--primary-500);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  /* dropdown buttons */
  .button-30 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin: 0.15rem;
    padding: 0.4rem 0.85rem;
    background: var(--white);
    color: var(--grey-800);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    box-shadow: var(--shadow-1);
    font-family: inherit;
    font-weight: 600;
    font-size: 0.85rem;
    line-height: 1.15;
    white-space: nowrap;
    cursor: pointer;
    transition: var(--transition);
  }
  .button-30:hover {
    border-color: var(--primary-300);
    color: var(--primary-700);
    box-shadow: var(--shadow-2);
    transform: translateY(-1px);
  }
  .button-30:active {
    transform: translateY(0);
    box-shadow: var(--shadow-1);
  }
  .button-30:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  /* profile / logout dropdown -> floating card */
  .drop {
    --bs-gutter-x: 0;
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    margin: 0;
    padding: 0.4rem;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.4rem;
    background: var(--white);
    border: 1px solid var(--grey-200);
    border-radius: var(--borderRadius);
    box-shadow: var(--shadow-3);
    z-index: 999;
  }
`;

export default Wrapper;
