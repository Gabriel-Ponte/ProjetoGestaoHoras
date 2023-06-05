import styled from 'styled-components';

const Wrapper = styled.article`


  @media (max-width: 768px) {
    width: 100%;
    h3 {
        font-size: 3vw;
    }
    h4 {
        font-size: 2vw;
        overflow: hidden;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    hr {
      border: 2px solid #303030;
      margin:0;
      margin-top:3%;
    }
    
  }

  @media (min-width: 768px) {
    background: var(--white);
    border-radius: var(--borderRadius);
    display: grid;
    grid-template-rows: 1fr auto;
    box-shadow: var(--shadow-2);
    margin-bottom: 0px;
    
    h3 {
        font-size: 3vw;
    }

    h4 {
        font-size: 2vw;
        overflow: hidden;
        overflow-wrap: break-word;
        word-break: break-word;
    }
    .projeto{
        margin-bottom:2%;
    }

    .tiposTrabalho {
        display: flex;
        align-items: center;
    }


    }

}
`;

export default Wrapper;

