import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--grey-100);

  .MainLogin {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem 1rem 5.5rem; /* bottom clearance for the fixed footer */
  }

  .title {
    color: var(--primary-700);
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0 0 1.5rem;
  }

  /* the form is a centered card */
  .loginForm {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    background: var(--white);
    border: 1px solid var(--grey-200);
    border-top: 3px solid var(--primary-500);
    border-radius: 10px;
    box-shadow: var(--shadow-3);
    padding: 2rem 1.75rem 2.25rem;
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .loginForm h3 {
    text-align: center;
    color: var(--grey-900);
    margin: 0 0 1.5rem !important;
  }

  .loginForm > p {
    text-align: center;
    color: var(--grey-600);
    font-size: 0.9rem;
    margin: 0 0 1.25rem;
  }

  /* neutralise Bootstrap row gutters inside the card */
  .loginForm .row {
    --bs-gutter-x: 0;
    margin-left: 0;
    margin-right: 0;
  }
  .loginForm br {
    display: none;
  }

  /* field labels */
  .loginForm .col-md-3,
  .loginForm .form-label {
    text-align: left !important;
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--grey-500);
    margin-bottom: 0.35rem;
    padding: 0;
  }

  /* inputs (override inherited centering / inline widths) */
  .loginForm input {
    width: 100% !important;
    min-width: 0 !important;
    text-align: left !important;
    font-size: 0.95rem !important;
    padding: 0.6rem 0.75rem;
    color: var(--grey-900);
    background: var(--white);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    transition: var(--transition);
  }
  .loginForm input:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(30, 90, 150, 0.18);
  }

  /* buttons */
  .loginForm .btn {
    width: 100%;
    padding: 0.6rem 1rem;
    font-weight: 600;
    border-radius: var(--borderRadius);
    margin-top: 0.75rem;
  }
  .loginForm .btn-outline-primary {
    background: var(--primary-500);
    border-color: var(--primary-500);
    color: #fff;
  }
  .loginForm .btn-outline-primary:hover,
  .loginForm .btn-outline-primary:focus {
    background: var(--primary-600);
    border-color: var(--primary-600);
    color: #fff;
  }
  .loginForm .btn-outline-secondary {
    background: var(--white);
    border-color: var(--grey-300);
    color: var(--grey-700);
  }
  .loginForm .btn-outline-secondary:hover {
    background: var(--grey-100);
    color: var(--grey-900);
  }

  /* "Repor password" link — right-aligned, subtle */
  .loginForm .btn-link {
    width: auto;
    margin: -0.25rem 0 0.25rem auto; /* margin-left:auto -> right align in the flex row */
    padding: 0;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--primary-600);
    text-decoration: none;
  }
  .loginForm .btn-link:hover {
    text-decoration: underline;
    color: var(--primary-700);
  }

  @media (max-width: 480px) {
    .loginForm {
      padding: 1.5rem 1.25rem 1.75rem;
      box-shadow: var(--shadow-2);
    }
  }
`;

export default Wrapper;
