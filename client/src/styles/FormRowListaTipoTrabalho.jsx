import styled from 'styled-components'

const Wrapper = styled.section`
.font-family {
    font-family: 'Poppins', sans-serif;
  }
  @media (max-width: 850px) {
    textarea {
      display: block;
      margin: 0 auto;
      text-align: center;
    }
  }
  @media (min-width: 850px) {
  display: inline;
  flex-direction: column;
  align-items: center;
  min-height: 130px;
  height:100%;

  .form__group {
    display: inline;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    margin-top: auto;
    margin-bottom: auto;
    width: 100%;
    height: 100%
  }
}
  
  .form__field {
    width: 100%;
    padding: 0.5rem 0.7rem;
    font-family: inherit;
    font-size: 0.95rem;
    color: var(--grey-900);
    background: var(--white);
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    resize: vertical;
    transition: var(--transition);
  }
  .form__field:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(30, 90, 150, 0.18);
  }

`

export default Wrapper