import styled from 'styled-components'

/* Inline-editable cells for the projects list (Cliente / Nome / Ação / Notas /
   Data Objetivo / Links). Each cell is a borderless textarea that reads as plain
   text until it is focused, at which point it expands into an editor.

   This file used to contain SCSS variables ($primary, $secondary, $gray, $white)
   inside what is plain CSS — they are invalid and were silently dropped by the
   browser, so several rules (the date field's colour and bottom border, the focus
   border gradient) simply never applied. It also had
   `.form__field[name="Links"] { width: 2000%; }`. All rewritten against the design
   tokens. */
const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;

  .form__group {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    min-height: 5.5rem;
    height: 100%;
    padding: 0;
    margin: auto 0;
  }

  /* Reads as text; only reveals itself as a field on hover/focus. */
  .form__field {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0.3rem 0.4rem;
    border: 1px solid transparent;
    border-radius: var(--borderRadius);
    outline: 0;
    resize: none;
    font-family: inherit;
    font-size: 0.88rem;
    line-height: 1.4;
    color: var(--grey-700);
    background: transparent;
    text-align: center;
    white-space: pre-line;
    overflow: auto;
    overflow-wrap: break-word;
    word-break: break-word;
    transition: var(--transition);

    &::placeholder {
      color: transparent;
    }
    &:required,
    &:invalid {
      box-shadow: none;
    }
  }

  .form__field:hover {
    border-color: var(--grey-200);
    background: var(--grey-50);
  }

  /* Expands into a real editor while focused. */
  .form__field:focus {
    position: relative;
    z-index: 2;
    width: 118%;
    height: 150px;
    resize: both;
    font-weight: 500;
    color: var(--grey-900);
    background: var(--white);
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(30, 90, 150, 0.18), var(--shadow-3);
    overflow: auto;
  }

  /* Client and project name read as the row's title. */
  .form__field[name='Cliente'] {
    font-weight: 700;
    color: var(--grey-900);
  }
  .form__field[name='Nome'] {
    font-weight: 600;
    color: var(--grey-800);
  }

  /* Long-form columns read better left-aligned. */
  .form__field[name='Acao'],
  .form__field[name='Notas'] {
    text-align: left;
  }

  /* Link editors (shown inside the action column while adding a link). */
  .form__field[name='Links'],
  .form__field[name='LinkResumo'] {
    width: 100%; /* was 2000% / 120% */
    margin: 0.4rem 0;
    text-align: left;
    font-size: 0.8rem;
    background: var(--grey-100);
    border-color: var(--grey-200);
  }
  .form__field[name='Links']:focus,
  .form__field[name='LinkResumo']:focus {
    width: 100%;
    background: var(--white);
  }

  /* ---- Data Objetivo ------------------------------------------------------- */
  .form__field__date {
    width: 100%;
    max-width: 9.5rem;
    padding: 0.35rem 0.5rem;
    font-family: inherit;
    font-size: 0.82rem;
    color: var(--grey-800);
    background: var(--white);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    outline: 0;
    text-align: center;
    resize: none;
    transition: var(--transition);
  }
  .form__field__date:hover {
    border-color: var(--grey-400);
  }
  .form__field__date:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(30, 90, 150, 0.18);
  }
  /* Tint the native picker icon so it does not look like a foreign element. */
  .form__field__date::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: var(--transition);
  }
  .form__field__date::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  @media (max-width: 767px) {
    .form__group {
      min-height: auto;
      margin-bottom: 0.75rem;
    }
    .form__field:focus {
      width: 100%;
    }
    .form__field__date {
      max-width: 100%;
    }
  }
`

export default Wrapper
