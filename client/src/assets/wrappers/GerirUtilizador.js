import styled from 'styled-components';

const Wrapper = styled.section`
font-size: auto;
.tittle {
  margin: 5%;
  margin-top: 2%;
}
@media (max-width: 700px) {
  .listaTiposUtilizador {
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
    align-items: center;
    flex-wrap: nowrap;
    overflow-wrap: break-word;
    word-break: break-word;
  }
}
@media (min-width: 700px) {
.listaTiposUtilizador {
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
    flex-wrap: nowrap;
    overflow-wrap: break-word;
    word-break: break-word;
  }
}
  .listaTiposUtilizador > div {
    width: 70%;
    border: 1px solid black; /* Add border between grid items */
    margin-bottom:5%;
        align-items: center;
}
}
.tiposUtilizador {
  margin-top: 2%;


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
