import styled from 'styled-components'

const Wrapper = styled.section`
  display: grid;
  align-items: center;

  @media (max-height: 500px) {
  .MainLogin {
    width: 100%;
    height: 150%;
    overflow: auto;
    display: flex;
    position:relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin:auto;
  }
}
@media (min-height: 500px) {
  .MainLogin {
    width: 100%;
    height: 70vh;
    overflow: auto;
    display: flex;
    position:relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin:auto;
  }
}
  .title{
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    width: 100%;
    align-self: center;
    margin-bottom:2%;
  }
  
  .buttonPassword{
    width: 15%;
    display: flex;
    align-self: center;
    justify-content: end;
    align-items: top;
    justify-items: start;
    flex-wrap: nowrap;
    text-size: auto;
  }
  .buttonPassword .buttonP{
    margin-top:0;
  }



  .btn {
    margin-top: 1rem;
  }


  .loginForm {
    display: flex;
    width: 100%;
    heigth: 70%;
    margin:0;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    flex-wrap: nowrap;

    align-self: center;
    position: relative;
  }

  .formRowInput {
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-items: end;
    align-content: space-evenly;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  
  .formRow {
    display: grid;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    justify-items: center;
    align-items: center;
    overflow: auto;
    align-self: center;
    position: relative;
    grid-auto-flow: row;
    text-align: start;
  }

  .formRowLabel {
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-items: start;
    align-content: start;
    justify-content: start;
  }
`

export default Wrapper
