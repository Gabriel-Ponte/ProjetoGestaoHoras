import styled from 'styled-components'

const Wrapper = styled.section`


.multiselect {
    width: 200px;
  }
  
  .selectBox {
    position: relative;
  }
  
  .selectBox select {
    width: 100%;
    font-weight: bold;
  }
  
  .overSelect {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  
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
    overflow-y: scroll;  overflow-y: scroll;
    scrollbar-color: rebeccapurple green;
    scrollbar-width: thin;
  }

  .form {
    text-align:center;
    align-items: center;
    max-width: 100%;
    min-width: 70%;
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

  input {
    text-align:center;
    min-width : 50%;
    width: auto;
  }

  input[type=date] {
    font-size: 30px;
    height: 30px;
    position: relative;
    min-width : 0%;
    width : auto;
    
  }


  .formRowInput {
    min-width: 20%;
    max-width: auto;
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


    .form-select {
        font-size: auto;
        text-align: center;
        overflow: visible; /* Shows the full text on hover */
        white-space: normal; /* Allows the text to wrap if it's long */
        text-overflow: unset; /* Removes the ellipsis */
    }


    //     .form-select {
    //     font-size: auto;
    //     text-align: center;
    //     overflow: hidden; /* Ensures content doesn't overflow initially */
    //     white-space: nowrap; /* Prevents text from wrapping */
    //     text-overflow: ellipsis; /* Adds '...' to overflowing text */
    // }

    // .form-select:hover {
    //     font-size: auto; /* Adjust as needed */
    //     text-align: center;
    //     overflow: visible; /* Shows the full text on hover */
    //     white-space: normal; /* Allows the text to wrap if it's long */
    //     text-overflow: unset; /* Removes the ellipsis */
    // }
export default Wrapper
  #checkboxes {
    display: none;
    border: 1px #dadada solid;
  }
  
  #checkboxes label {
    display: block;
  }
  
  #checkboxes label:hover {
    background-color: #1e90ff;
  }

  

`

export default Wrapper