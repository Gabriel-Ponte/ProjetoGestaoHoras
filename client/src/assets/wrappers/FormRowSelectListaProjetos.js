import styled from 'styled-components'

const Wrapper = styled.section`
$primary: #11998e;
$secondary: #38ef7d;
$white: #fff;
$gray: #9b9b9b;

.form__group {
    position: relative;
    padding: 0;
    margin-top: 10px;
    width: 100%;
    min-height: 100px; /* change this value based on your needs */
  }

  
.teste{
  background-color: #000000;
}

.form__field {
  font-family: inherit;
  font-size: inherit;
  padding: 1px 6px;
  resize :none;
  position: relative;
  font-family: inherit;
  width: 100%;
  height: 100%;
  border-bottom: 2px solid $gray;
  outline: 0;
  border: 0;
  font-size: 1rem;
  color: $white;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
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



.form__field__date {
  font-family: inherit;
  font-size: inherit;
  padding: 1px 6px;
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
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;
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
  min-height: 100px;
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

body {
  font-family: 'Poppins', sans-serif; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  background-color:#222222;
}
`

export default Wrapper