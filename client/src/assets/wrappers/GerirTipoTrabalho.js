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
`;

export default Wrapper;
