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

  .description{
    font-size:0.8rem;
  }
  .fimSemana {
    width: 10px;
    height: 10px;
    background-color: #BCB8B1;
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .inserido{
    width:10px;
    height:10px;
    background-color: #898121;
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .dataFim{
    width:10px;
    height:10px;
    background-color: #001524;
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .dataObjetivo{
    width:10px;
    height:10px;
    background-color: #81171B;
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .dataInicio{
    width:10px;
    height:10px;
    background-color: #588157;
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }

  .feriados{
    width:10px;
    height:10px;
    background-color: #c26c18;
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }

`;

export default Wrapper;