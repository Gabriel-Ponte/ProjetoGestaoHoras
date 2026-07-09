import styled from 'styled-components'

const Wrapper = styled.nav`
@media (max-width: 768px) {
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
  .button-Dropdown{
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

  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.1);
  .logo {
    display: flex;
    align-items: center;
    width: 100px;
  }


  .horasT {
    background-color: transparent;
    align-items: center;
    text-align: center;
    width: 30px;
    height: 30px;
    border: 2px solid black;

    box-sizing: border-box;
    pointer-events: none;
    font-size: 15px ; 
    line-height: 1;
}
  .modal {
    display: none;
    /* Other styles for the modal box */
  }
  .horasP {
    background-color: transparent;
    align-items: center;
    text-align: center;
    width: 30px;
    height: 30px;
    border: 2px solid black;
    box-sizing: border-box;
    font-size: 15px ; 
    line-height: 1;
  }

  .nav-center {
    display: flex;
    width: 90vw;
    align-items: center;
    justify-content: space-between;
  }

  .toggle-btn {
    background: transparent;
    border-color: transparent;
    font-size: 1.75rem;
    color: var(--primary-500);
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  background: var(--white);
  .btn-container {
    position: relative;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    position: relative;
    box-shadow: var(--shadow-2);
  }


  .dropdown {
    position: relative;
    left: 0;
    width: 100%;
    background: var(--primary-100);
    box-shadow: var(--shadow-2);
    padding: 0.5rem;
    text-align: center;
    visibility: hidden;
    border-radius: var(--borderRadius);
  }
  .show-dropdown {
    visibility: visible;
  }
  .dropdown-btn {
    background: transparent;
    border-color: transparent;
    color: var(--primary-500);
    letter-spacing: var(--letterSpacing);
    text-transform: capitalize;
    cursor: pointer;
  }


  
.button-30 {
  align-items: center;
  appearance: none;
  background-color: #fffff;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395A;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 80%;
  padding: 5px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;

}

.button-30:focus {
 background-color: #D6D6E7;
  box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button-30:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-30:active {
 background-color: #D6D6E7;
  box-shadow: #D6D6E7 0 3px 7px inset;
  transform: translateY(2px);
}
`
export default Wrapper
