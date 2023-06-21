import styled from 'styled-components';

const Wrapper = styled.main`

align-items: center;
justify-content: center;
box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.1);
z-index: 9998;
height:100%;
width:101%;
padding:0px;



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

  .buttonHeader{
    font-weight: bold;
    align-items: center;
    margin:0;
    font-size: 1.2vw;
    }

  @media (min-width: 768px) {
    position: sticky;
    top: 85px;
    .buttonHeader{
      font-weight: bold;
      align-items: center;
      margin:0;
      font-size: 1.2vw;
      }
    }
  @media (min-width: 1500px) {
  .buttonHeader{
    font-weight: bold;
    align-items: center;
    margin:0;
    font-size: 130%;
    }
  }


  `;

export default Wrapper;