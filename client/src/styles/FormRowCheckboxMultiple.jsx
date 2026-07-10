import styled from 'styled-components';

const Wrapper = styled.section`
  .form-label {
    display: inline-block;
    margin-bottom: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--grey-600);
  }

  /* scrollable list of checkbox options */
  .checkboxRow {
    max-height: 15rem;
    overflow-y: auto;
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    padding: 0.35rem 0.5rem;
    background: var(--white);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    box-sizing: border-box;
  }
  .checkboxRow .row {
    align-items: center;
    margin: 0;
    padding: 0.3rem 0.4rem;
    border-radius: 6px;
    transition: var(--transition);
  }
  .checkboxRow .row:hover {
    background: var(--primary-50);
  }
  .checkboxRow label {
    margin: 0;
    text-align: left;
    color: var(--grey-800);
    cursor: pointer;
  }

  input[type='checkbox'] {
    width: 1.1rem;
    height: 1.1rem;
    accent-color: var(--primary-500);
    cursor: pointer;
  }

  .text-end p,
  .text-center p {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: var(--grey-600);
  }

  @media (max-width: 768px) {
    .text-end,
    .text-start {
      text-align: center;
      margin: auto;
    }
  }
`;

export default Wrapper;
