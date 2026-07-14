import styled from 'styled-components';

/* Was `styled.a` — an <a> with no href wrapping the whole column header. */
const Wrapper = styled.div`
  display: block;
  width: 100%;

  /* keep the column header visible while scrolling, just under the navbar */
  position: sticky;
  top: var(--navbar-height, 90px);
  z-index: 5;

  .ListaProjetosHeader {
    width: 100%;
    background: var(--grey-100);
    border-radius: var(--borderRadius) var(--borderRadius) 0 0;
    margin: 0;
  }

  .list-group-item {
    border: none;
    background: transparent;
    padding: 0.15rem 0;
  }

  hr {
    border: none;
    border-top: 1px solid var(--grey-200);
    margin: 0;
  }

  .buttonHeader {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    width: 100%;
    padding: 0.55rem 0.25rem;
    background: transparent;
    border: none;
    box-shadow: none;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--grey-600);
    transition: var(--transition);
  }
  .buttonHeader:hover {
    color: var(--primary-600);
  }
  .buttonHeader svg {
    flex: none;
    font-size: 0.9em;
  }

  /* The "sortable but not sorted" state used to render BsArrowLeftShort — a LEFT
     arrow, which reads as "go back", not "you can sort this". It is now a neutral
     up/down sort glyph, dimmed until you hover the header. */
  .sort-idle {
    opacity: 0.3;
    transition: var(--transition);
  }
  .buttonHeader:hover .sort-idle {
    opacity: 0.75;
  }

  @media (min-width: 1500px) {
    .buttonHeader {
      font-size: 0.9rem;
    }
  }
`;

export default Wrapper;
