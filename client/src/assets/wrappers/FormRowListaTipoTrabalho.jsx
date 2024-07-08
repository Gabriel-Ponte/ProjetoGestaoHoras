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
  
  .form__field{
    outline: 0;
    border: 0;
    resize :none;
  }

`

export default Wrapper