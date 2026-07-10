import styled from 'styled-components';

/* Shared wrapper for FormRow (text inputs) and FormRowSelect (select lists).
   Styles the native controls to match the AppInput look (tokens, brand focus). */
const Wrapper = styled.section`
  input,
  select,
  textarea,
  .form-input,
  .form-select {
    width: 100%;
    padding: 0.5rem 0.7rem;
    font-family: inherit;
    font-size: 0.95rem;
    color: var(--grey-900);
    background: var(--white);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    transition: var(--transition);
  }

  input:focus,
  select:focus,
  textarea:focus,
  .form-select:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(30, 90, 150, 0.18);
  }

  input:disabled,
  select:disabled,
  .form-select:disabled {
    background: var(--grey-100);
    color: var(--grey-500);
    cursor: not-allowed;
  }

  /* multi-select list box */
  select[multiple] {
    min-height: 8rem;
    padding: 0.25rem;
  }
  select[multiple] option {
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
  }

  .form-label {
    display: inline-block;
    margin-bottom: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--grey-600);
  }

  .form-row {
    margin-bottom: 0.5rem;
  }

  /* "Nova Opção" add button (only rendered inside FormRowSelect) */
  .form-row button {
    width: auto;
    margin-top: 0.45rem;
    padding: 0.4rem 0.9rem;
    font-weight: 600;
    color: #fff;
    background: var(--primary-500);
    border: 1px solid var(--primary-500);
    border-radius: var(--borderRadius);
    cursor: pointer;
    transition: var(--transition);
  }
  .form-row button:hover {
    background: var(--primary-600);
    border-color: var(--primary-600);
  }
`;

export default Wrapper;
