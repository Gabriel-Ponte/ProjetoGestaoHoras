import styled from 'styled-components';

const Wrapper = styled.section`

.tittle {
  margin: 5%;
  margin-top: 2%;
}
@media (max-width: 768px) {
  .ttLabel{
    text-align:center;
  }
  .ttInput{
    text-align:center;
  }

}

@media (min-width: 768px) {
  .ttLabel{
    text-align:end;
  }
  .ttInput{
    text-align:start;
  }
}

@media (max-width: 850px) {
  .listaTiposTrabalho {
    display: grid;
    align-content: space-evenly;
    width: 100%;
    grid-auto-flow: row;
    justify-items: center;
    font-size: auto;
    line-height: auto;
    text-align: center;
    align-items: center;
  }
  .novoTrabalho{
    font-size: auto;
    align-self: stretch;
    font-size: auto;
    text-align: center;
    align-items: center;
    justify-items: center;
    margin: auto;
  }
}
@media (min-width: 850px) {
.listaTiposTrabalho {
    display: grid;
    gap: 5px;
    flex-direction: row;
    align-content: space-evenly;
    width: 100%;
    align-items: end;
    grid-auto-flow: row;
    justify-items: center;
    align-self: stretch;
    gap: 2px;
    font-size: auto;
    line-height: auto;
    text-align: center;
    direction: ltr;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 3%;
    grid-auto-rows: minmax(1fr, auto);
    align-items: center;
  }
}
  .listaTiposTrabalho > div {
    width: 60%;
    border: 1px solid black; /* Add border between grid items */
    margin-bottom:5%;
    align-items: center;
}

.tiposTrabalho {
  margin-top: 2%;
}

.novoTrabalho{
    font-size: auto;
}




.ButtonsTest {
  padding: 15px 25px;
  border: unset;
  border-radius: 15px;
  color: #212121;
  z-index: 1;
  background: #EEEEEE;
  position: relative;
  font-weight: 1000;
  font-size: 17px;
  -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  transition: color 250ms; /* Change to transition only color */
  overflow: hidden;
}

.ButtonsTest::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  border-radius: 15px;
  background-color: #D0D6B3;
  z-index: -1;

  transition: width 250ms; /* Transition only the width */
}


.ButtonsTest:hover::before {
  width: 100%;
}

.active {
  background-color: #D0D6B3;
}

.activeMainButton {
    background-color: #BBC2E2;
}

.middleButton {
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    max-heigth:70px;
    background-color:green,
    
}

.middleButton:hover {
  background-color: #BBC2E2;
  color: #e8e8e8;
}



.ButtonsTestSecondary {
  padding: 10px 20px;
  border: unset;
  border-radius: 5px;
  color: #212121;
  z-index: 1;
 background-color: #FFFFFF;
  position: relative;
  font-weight: 1000;
  font-size: 17px;
  transition: color 250ms; /* Change to transition only color */
  overflow: hidden;
}

.ButtonsTestSecondary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  border-radius: 5px;
  background-color: #454545;
  z-index: -1;
  -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  transition: width 250ms; /* Transition only the width */
}

.ButtonsTestSecondary:hover {
  color: #e8e8e8;
}

.ButtonsTestSecondary:hover::before {
  width: 100%;
}

.activeSecondary {
  background-color: #454545;
  color: #e8e8e8;
}


.Buttons {
  display: inline;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  margin-top: auto;
  margin-bottom: auto;
  width: 100%;
  height: 100%;
}


.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}


`;

export default Wrapper;
