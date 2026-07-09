import styled from 'styled-components'

const Wrapper = styled.nav`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 9998;
  .logo {
    display: flex;
    align-items: center;
    width: 100px;
  }
  
  .middleButton {
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    max-heigth:70px;
  }
  

  .nav-center {
    display: flex;
    width: 90vw;
    align-items: center;
    justify-content: space-between;
  }
  .app-Button{
    display: center;
    width 100%;
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
    display: inline;
    position: absolute;
    left: 0;
    rigth: 0;
    width: 50%;
    align-items: top;
    padding: 0.5rem;
    text-align: center;
    visibility: hidden;
    z-index: 9998;
  }
  .show-dropdown {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 100%;
    left: 35%;
    width:30%;
    visibility: visible;
    background-color: #B4B4B8;
    z-index: 9998;
  }

  .dropdown-btn {
    background: transparent;
    border-color: transparent;
    width:100%;
    color: var(--primary-500);
    letter-spacing: var(--letterSpacing);
    text-transform: capitalize;
    cursor: pointer;
  }
  .logo-text {
    display: none;
    margin: 0;
  }
  @media (min-width: 992px) {
    position: sticky;
    top: 0;

    .nav-center {
      width: 90%;
    }
    .logo {
      display: none;
    }
    .logo-text {
      display: block;
    }
  }

  .subheader {
    display: flex;
    align-self: stretch;
    flex-direction: row;
    align-items: center;
    overflow: visible;
    justify-items: stretch;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: space-around;
    gap: 0px;
    position: relative;
    padding: 0px;
    font-weight: 200;
    text-align: end;
    width: 100%;
    text-transform: lowercase;
    font-style: normal;
    direction: ltr;
    font-size-adjust: inherit;
    background-color: #FFFFFF;
    opacity: 1.0;
  }

  .divButtonUtilizador {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    align-content: end;
    justify-content: space-around;
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
