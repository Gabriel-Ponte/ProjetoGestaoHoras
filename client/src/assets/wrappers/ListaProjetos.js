import styled from 'styled-components';

const Wrapper = styled.main`
height:100%;
width:100%;
padding:0px;
.ListaProjetos {
  display: inline;
  overflow: scroll;
  grid-row-start: initial;
  align-self: center;
  border: 1px solid black;
}

hr {
  border: 1px solid #303030;
  margin:0;
}

.ListaProjetosHeader {
  background-color: #E5E5E5;
  align-self: center;
  vertical-align: baseline;
  margin:0;
}

.list {
    display: grid;
    flex-direction: row;
    justify-content: space-around;
    align-content: space-around;
    overflow: visible;
    border: 0px solid black;
    flex-wrap: wrap;
    height: 30px;
    width: 100%;
    margin: 0px;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-auto-flow: column;
    justify-items: center;
    align-self: center;
    position: fixed;
    gap: 0px 0px;
    font-size: auto;
    line-height: auto;
    text-align: center;
    direction: ltr;
  }

  .buttonListaProjetos {
    overflow: auto;
    display: flex;
    align-self: center;
    position: relative;
    flex-direction: row;
  }
  @media (min-width: 1000px) {
    .buttonHeader{
      display: flex;
      align-items: center;
      margin:0;
      font-size: 1.5vw;
      }
    }
  @media (min-width: 1500px) {
  .buttonHeader{
    display: flex;
    align-items: center;
    margin:0;
    font-size: 1vw;
    }
  }


  `;

export default Wrapper;