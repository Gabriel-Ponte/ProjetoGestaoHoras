import styled from 'styled-components';

const Wrapper = styled.article`


  @media (max-width: 767px) {
    .dias {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 30%;
      min-height: 50px;
      height: 100%;
      border: 1px solid black;
      margin: auto; 
      margin-top:auto;
    
      p {
        font-size: auto;
        font-weight: bold;
        margin: 0;
      }
    }
    hr {
      border: 2px solid #303030;
      margin:0;
      margin-top:2%;
    }
    
    .buttonProjeto{
      font-size: 3vw;
      margin: auto; 
      margin-top:2%;
      width: 50vw;
    }

    .reactIcon{
      font-size: 5vw;
    }
  }

  @media (min-width: 767px) {
    background: var(--white);
    border-radius: var(--borderRadius);
    display: grid;
    grid-template-rows: 1fr auto;
    box-shadow: var(--shadow-2);
    height:100%;
    margin-bottom: 0px;
    max-height: 300px;

    .listaProjetos{
      width:100%;
      display: relative;
      position: relative;
      align-items: center;
      text-align: center;
      margin: 0 auto;
    }
    .align{
      margin: auto;
    }
    .dias {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 3vw;
      height: 3vw;
      border: 1px solid black;
      margin: auto; 
      margin-top:auto;
    
      p {
        font-size: 1vw;
        font-weight: bold;
        margin: 0;
      }

      hr {
        border: 1px solid #303030;
        margin:0;
        margin-top:2%;
      }

    }
  .buttonProjeto{
    font-size: 1vw;
  }

  .reactIcon{
    font-size: 2vw;
  }
}
`;

export default Wrapper;

