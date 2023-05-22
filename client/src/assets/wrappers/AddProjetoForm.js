import styled from 'styled-components'

const Wrapper = styled.section`
  align-items: center;

  /* width */
  ::-webkit-scrollbar {
    width: 20px;
  }
  
  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: red;
    border-radius: 10px;
  }

  .MainForm {
    width: 100%;
    display: inline-block;;
    align-self: baseline;
    position: relative;
    overflow: visible;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    flex-wrap: nowrap;
  }

  .form {
    text-align:center;
    align-items: center;
    max-width: 100%;
    min-width: 50%;
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
