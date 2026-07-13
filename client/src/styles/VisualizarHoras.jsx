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
    background-color: var(--status-weekend);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .extra{
    width:10px;
    height:10px;
    background-color: var(--status-hours-high);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .normal{
    width:10px;
    height:10px;
    background-color: var(--status-hours);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .menos{
    width:10px;
    height:10px;
    background-color: var(--status-hours-low);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .filtro{
    width:10px;
    height:10px;
    background-color: var(--status-approval);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .compensDomingo{
    width:10px;
    height:10px;
    background-color: var(--status-compensation-sunday);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .ferias{
    width:10px;
    height:10px;
    background-color: var(--status-vacation);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }


  .horasCompensacao{
    width:10px;
    height:10px;
    background-color: var(--status-compensation);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }

  .feriados{
    width:10px;
    height:10px;
    background-color: var(--status-holiday);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }

`;

export default Wrapper;