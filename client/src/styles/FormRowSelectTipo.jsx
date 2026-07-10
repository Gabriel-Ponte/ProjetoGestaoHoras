import styled from 'styled-components';

const Wrapper = styled.section`
  .form-select {
    width: 100%;
    padding: 0.5rem 0.7rem;
    font-family: inherit;
    font-size: 0.95rem;
    color: var(--grey-900);
    background: var(--white);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    cursor: pointer;
    transition: var(--transition);
    white-space: normal;
  }
  .form-select:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(30, 90, 150, 0.18);
  }
  .form-select:disabled {
    background: var(--grey-100);
    color: var(--grey-500);
    cursor: not-allowed;
  }

  .form-label {
    display: inline-block;
    margin-bottom: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--grey-600);
  }

  @media (max-width: 767px) {
    .text-end,
    .text-start {
      text-align: center;
      margin: auto;
    }
  }
`;

export default Wrapper;
