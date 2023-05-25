import styled from 'styled-components'

const Wrapper = styled.section`
  display: grid;
  align-items: center;

  .MainLogin {
    width: 100%;
    display: flex;
    align-self: baseline;
    position: relative;
    overflow: visible;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    flex-wrap: nowrap;
    height: 100%;
  }

  .buttonPassword{
    width: 15%;
    display: flex;
    align-self: center;
    justify-content: end;
    align-items: top;
    justify-items: start;
    flex-wrap: nowrap;
  }
  .buttonPassword .buttonP{
    margin-top:0;
  }
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }

  h3 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }

  .loginForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    align-content: space-between;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
    align-self: center;
    position: relative;
    margin: 10% 0%;
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
