import styled from 'styled-components'

/* This wraps the WHOLE "Adicionar Horas" page (AddHoras / AddHorasGeral).
   It used to be `styled.nav` carrying copy-pasted NAVBAR css:

       height: var(--nav-height);   // 6rem
       display: flex;
       align-items: center;
       justify-content: center;
       box-shadow: 0 1px 0 rgba(0,0,0,.1);
       background: var(--white);

   ...so the entire page was a 96px-tall, centred flex box that all of its content
   overflowed out of. That is what produced the stray white blocks, the squashed
   rows and the overlapping in the screenshot. It is now a plain block container. */
const Wrapper = styled.section`
  width: 100%;

  /* ---- Project row ---------------------------------------------------------
     Was: col-md-4 (name, right-aligned) + col-md-8 > col-md-10 that held only the
     caret, leaving roughly half of every row empty. Now the row is a flex header —
     name left, running total and toggle right — and the expanded panel spans the
     full width underneath. */
  .projeto-item {
    background: var(--white);
    border: 1px solid var(--grey-200);
    border-radius: 10px;
    box-shadow: var(--shadow-1);
    padding: 0.7rem 1rem;
    margin-bottom: 0.6rem;
    transition: var(--transition);
  }
  .projeto-item:hover {
    border-color: var(--grey-300);
    box-shadow: var(--shadow-2);
  }

  .projeto-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .projeto-nome {
    flex: 1;
    min-width: 0;
    margin: 0;
    text-align: left;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.35;
    color: var(--grey-800);
    overflow-wrap: anywhere;
  }

  .projeto-total {
    flex: none;
    min-width: 3.5rem;
    text-align: right;
    font-size: 1rem;
    font-weight: 700;
    color: var(--primary-600);
    font-variant-numeric: tabular-nums; /* digits keep a constant width */
  }

  /* ---- Controls ------------------------------------------------------------ */
  .btn-container {
    position: relative;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    position: relative;
  }

  /* Declared AFTER .btn so it wins on equal specificity. */
  .button-Dropdown {
    flex: none;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 1px solid var(--grey-200);
    border-radius: 999px;
    background: var(--grey-50);
    color: var(--grey-600);
    box-shadow: none;
    cursor: pointer;
    transition: var(--transition);
  }
  .button-Dropdown:hover {
    background: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
  }
  .button-Dropdown:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
  .button-Dropdown svg {
    transition: transform 0.2s ease;
  }
  /* The caret now points up while the panel is open. */
  .button-Dropdown[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }

  /* ---- Expanded panel ------------------------------------------------------
     Note it used to live INSIDE the col-md-10, so even when open the time pickers
     were squeezed into ~half the row. It is now a sibling of the header and gets
     the full width. */
  .dropdown {
    position: relative;
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.85rem 0.75rem;
    background: var(--grey-50);
    border: 1px solid var(--grey-200);
    border-radius: var(--borderRadius);
    text-align: center;
    visibility: hidden;
  }
  .show-dropdown {
    visibility: visible;
  }
  .dropdown-btn {
    background: transparent;
    border-color: transparent;
    color: var(--primary-500);
    letter-spacing: var(--letterSpacing);
    text-transform: capitalize;
    cursor: pointer;
  }

  /* ---- Time inputs (TimePickerClock) --------------------------------------- */
  .horasT,
  .horasP {
    background-color: transparent;
    align-items: center;
    text-align: center;
    width: 30px;
    height: 30px;
    border: 2px solid var(--grey-400);
    border-radius: 4px;
    color: var(--grey-900);
    box-sizing: border-box;
    font-size: 15px;
    line-height: 1;
  }
  .horasT {
    pointer-events: none;
  }

  /* ---- "Adicionar Férias" button ------------------------------------------- */
  .button-30 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    padding: 0.45rem 0.9rem;
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

  @media (max-width: 768px) {
    .projeto-header {
      gap: 0.6rem;
    }
    .projeto-nome {
      font-size: 0.9rem;
    }
  }
`

export default Wrapper
