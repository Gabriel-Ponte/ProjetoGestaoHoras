import styled from 'styled-components'

const Wrapper = styled.section`
@media (max-width: 767px) {
  .text-end {
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    text-align: center;
    align-self:center;
    width:auto;
    text-align: center;
    margin: auto;
  }

  .text-start {
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    text-align: center;
    align-self:center;
    width:auto;
    text-align: center;
    margin: auto;
  }
}


.multiselect {
    width: 200px;
  }
  
  .selectBox {
    position: relative;
  }
  
  .form-select{
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    text-align: center;
    align-self:center;
    width:50%;
    margin: auto;
    overflow-y: auto;
  
    transition: all 0.9s ease; /* Smooth transition */
}


  .form-select:focus {
      border-color: #007bff; /* Change border color */
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Add shadow effect */
      color: #000; /* Ensure text color remains visible */
  }

  .form-select::-webkit-scrollbar {
      width: 15px;

  }

  .form-select::-webkit-scrollbar-track {
      background: #f1f1f1;
  }

  .form-select::-webkit-scrollbar-thumb {
      background: #CCCCCC;
      border-radius: 10px;
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
    min-width : 70%;
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

export default Wrapper
  #checkboxes {
    display: none;
    border: 1px #dadada solid;
  }
  
  #checkboxes label {
    display: block;
  }
  
  .form-field-label {
    font-size: 200%;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    text-align: center;
    align-self:center;
    width:auto;
    text-align: center;
  }
  
  #checkboxes label:hover {
    background-color: #1e90ff;
  }

  

`

export default Wrapper