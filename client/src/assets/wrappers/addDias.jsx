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

`
export default Wrapper
