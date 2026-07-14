import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 1.5rem;
  padding-bottom: 3rem;

  /* ---- Page header ---------------------------------------------------------
     Title + count on the left, filters on the right. The filters used to be
     Bootstrap rows whose label spanned col-md-11 and whose checkbox sat in
     col-md-1, which pushed each label 91% of the width away from its own box. */
  .projetos-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--grey-200);
  }

  .projetos-header-titles {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    text-align: left;
    letter-spacing: -0.01em;
    color: var(--grey-900);
  }

  .projetos-count {
    margin: 0;
    font-size: 0.92rem;
    color: var(--grey-500);
  }

  .projetos-filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }

  /* The whole chip is the label, so clicking the text toggles the box. */
  .projetos-filter {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--grey-200);
    border-radius: 999px;
    background: var(--white);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--grey-700);
    cursor: pointer;
    user-select: none;
    transition: var(--transition);
  }
  .projetos-filter:hover {
    border-color: var(--primary-300);
    color: var(--primary-700);
  }
  .projetos-filter input {
    margin: 0;
    cursor: pointer;
  }
  .projetos-filter:has(input:checked) {
    background: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
    font-weight: 600;
  }

  h2 {
    text-transform: none;
    text-align: center;
    margin-top: 2.5rem;
    color: var(--grey-500);
    font-weight: 600;
  }

  .projetos {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.75rem;
  }

  @media (max-width: 768px) {
    .projetos-header {
      align-items: flex-start;
    }
  }
`;

export default Wrapper;
