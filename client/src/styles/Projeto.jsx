import styled from 'styled-components';

const Wrapper = styled.article`
  position: relative;
  width: 100%;
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: 10px;
  box-shadow: var(--shadow-1);
  transition: var(--transition);

  &:hover {
    border-color: var(--grey-300);
    box-shadow: var(--shadow-2);
  }

  .listaProjetos {
    width: 100%;
    position: relative;
    align-items: center;
    text-align: center;
    margin: 0 auto;
    padding: 0.6rem 0.5rem 0;
  }

  /* The row used to end with an <hr>; the card border already separates rows. */
  hr {
    display: none;
  }

  .align {
    margin: auto;
  }

  /* ---- "Alerta dias" badge -------------------------------------------------
     The background colour is set inline from getRedShade()/getGreenShade(), so the
     text colour is fixed white to stay legible on every shade. */
  .dias {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 3.25rem;
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    margin: auto;

    p {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 700;
      color: #fff;
      font-variant-numeric: tabular-nums;
    }
  }

  .piloto {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    p {
      margin: 0 0 0.15rem;
      font-size: 0.85rem;
      color: var(--grey-600);
    }
  }

  .Cliente h6 {
    margin: 0;
    font-weight: 700;
  }

  h5,
  h6 {
    font-size: 0.95rem;
    text-align: center;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* ---- Action column -------------------------------------------------------
     Was four full-width buttons stacked vertically inside a col-md-1 (~8% of the
     row): the labels overflowed the card AND the stack made every row ~160px tall.
     Now a 2x2 grid inside a col-md-2. */
  .projeto-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4rem;
    height: 100%;
    padding: 0.25rem;
  }

  .projeto-actions-close {
    display: flex;
    justify-content: flex-end;
  }

  .projeto-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
    align-items: stretch;
  }

  /* AppButton is white-space: nowrap by design. In a narrow action column the long
     labels ("Adicionar Link Resumo") must be allowed to wrap instead of overflowing. */
  .projeto-actions-grid button {
    white-space: normal;
    text-align: center;
    line-height: 1.15;
    font-size: 0.75rem;
    padding: 0.4rem 0.45rem;
  }

  /* "Abrir A3" / "Abrir Resumo". These anchors carried \`btn btn-outline-link\`, which
     is NOT a Bootstrap class (it is btn-link) — so they rendered as unstyled text. */
  .projeto-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.4rem 0.45rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.15;
    color: var(--primary-700);
    background: var(--primary-50);
    border: 1px solid var(--primary-200);
    border-radius: var(--borderRadius);
    text-decoration: none;
    transition: var(--transition);
  }
  .projeto-link:hover {
    background: var(--primary-100);
    border-color: var(--primary-300);
    color: var(--primary-800);
    text-decoration: none;
  }
  .projeto-link:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  @media (max-width: 767px) {
    .listaProjetos {
      padding: 0.75rem;
    }
    .projeto-actions-grid {
      grid-template-columns: 1fr;
    }
    .dias {
      margin: 0.5rem auto;
    }
  }
`;

export default Wrapper;
