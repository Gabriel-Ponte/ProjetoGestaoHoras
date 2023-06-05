import styled from 'styled-components';

const Wrapper = styled.section`

  @media (min-width: 768px) {

    hr {
        border: 5px solid #303030;
        margin:0;
        margin-top:2%;
        margin-bottom:5%;
      }
    .hrP{
        border: 1px solid #303030;
        margin:1vw;
    }
  }
  @media (max-width: 768px) {
    .mainVisualiza {
      overflow: auto;
      overflow-x: hidden;
    }
    .userName{
        align-self:center;
        text-align:center;
    }

    hr {
        border: 5px solid #303030;
        margin:0;
        margin-top:2%;
        margin-bottom:5%;
    }
    .hrP{
        border: 1px solid #303030;
        margin:5vw;
    }
  }


`;

export default Wrapper;