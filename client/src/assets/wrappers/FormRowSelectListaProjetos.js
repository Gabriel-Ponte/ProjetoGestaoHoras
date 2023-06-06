import styled from 'styled-components'

const Wrapper = styled.section`

  @media (min-width: 767px) {
  .form__field[name="Cliente"]  {
    font-size: 1.5vw;
    font-weight: bold;
  }

  @media (min-width: 1200px) {
    .form__field[name="Cliente"]  {
      font-size: 1.2vw;
      font-weight: bold;
    }
  }
  .font-family {
    font-family: 'Poppins', sans-serif;
  }
  
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 130px;
  height:100%;


  .form__group {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    margin-top: auto;
    margin-bottom: auto;
    min-width: 100%;
    max-width: 300%;
    height: 100%
  }
    
  .form__field {
    padding-top: auto;
    position: relative;
    display: flex;
    resize :none;
    width: 100%;
    height: 80%;
    outline: 0;
    border: 0;
    font-size: 1rem;
    background: transparent;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align:center;
    white-space: pre-line;
    overflow: auto;
    overflow-wrap: break-word;
    word-break: break-word;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1.3rem;
      cursor: text;
      top: 20px;
    }
  }
  

  .form__field:focus {
    position: relative;

    width: 120%;
    height:  150px; ;
    resize: both;
    z-index: 1;
    padding-bottom: 6px;  
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, $primary, $secondary);
    border-image-slice: 1;
    background-color: #FFFFFF;
    overflow: auto;
  }

  .form__field__date {
    font-family: inherit;
    font-size: inherit;
    resize :none;
    position: relative;
    font-family: inherit;
    width: auto;
    height: auto;
    border-bottom: 2px solid $gray;
    outline: 0;
    border: 0;
    font-size: 1rem;
    color: $white;
    background: transparent;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align:center;
    white-space: pre-line;
  
    overflow: visible;
    overflow-wrap: break-word;
    word-break: break-word;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1.3rem;
      cursor: text;
      top: 20px;
    }
  }

  /* reset input */
  .form__field{
    resize :none;
    &:required,&:invalid { box-shadow:none; }
  }




  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: $gray;
  }
}
@media (max-width: 767px) {
  .form__field[name="Cliente"]  {
    font-size: 5vw;
    font-weight: bold;
  }
  
  .font-family {
    font-family: 'Poppins', sans-serif;
  }

  align-items: center;


  .form__group {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    margin-top: 0;
    margin-bottom: 15px;
    width: 100%;
    height: 100%
  }
    
  .form__field {
    padding-top: auto;
    position: relative;
    display: flex;
    resize :none;
    width: 100%;
    height: 80%;
    outline: 0;
    border: 0;
    font-size: 1rem;
    background: transparent;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align:center;
    white-space: pre-line;
    overflow: auto;
    overflow-wrap: break-word;
    word-break: break-word;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1.3rem;
      cursor: text;
      top: 20px;
    }
  }


  
  .form__field__date {
    font-family: inherit;
    font-size: inherit;
    resize :none;
    position: relative;
    font-family: inherit;
    width: auto;
    height: auto;
    outline: 0;
    border: 0;
    font-size: 1rem;
    color: $white;
    background: transparent;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align:center;
    white-space: pre-line;
  
    overflow: visible;
    overflow-wrap: break-word;
    word-break: break-word;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1.3rem;
      cursor: text;
      top: 20px;
    }
  }

  .form__field:focus {
    position: relative;
    min-width: 100%;
    width: 120%;
    height:  150px; ;
    resize: vertical;
    z-index: 1;
    font-weight: 700;
    overflow: auto;
  }


  /* reset input */
  .form__field{
    resize :none;
    &:required,&:invalid { box-shadow:none; }
  }


  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: $gray;
  }
}



`

export default Wrapper