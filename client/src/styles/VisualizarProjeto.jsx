import styled from 'styled-components';

const Wrapper = styled.section`
  height: 71vh; /* Set height to 100% of viewport height */
  width: 90vw; /* Set width to 90% of viewport width */

  @media (max-width: 1800px) {
    .mainVisualiza {
      overflow: auto;
      overflow-x: hidden;
    }
    .right {
        width: auto;
        margin: auto;
        overflow: hidden;
      }

      .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-color: rebeccapurple green;
        scrollbar-width: thin;
        width: auto;
        min-width: 60%;
        margin: auto;
        text-align:center;
    }
  }

  @media (min-width: 1800px) {
  .mainVisualiza {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden; /* Hide any overflow */
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    height:60vh;
    margin: auto;
    margin-right:2%;
    width: 40%;
}

  .right {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    height:55vh;
    width: 50%;
    margin: auto;
  }
  }

  .description{
    font-size:0.6rem;
  }
  .description .row {
    margin-bottom: -0.5em;
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
  .inserido{
    width:10px;
    height:10px;
    background-color: var(--status-project);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .dataFim{
    width:10px;
    height:10px;
    background-color: var(--status-date-end);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .dataObjetivo{
    width:10px;
    height:10px;
    background-color: var(--status-date-target);
    display: inline-block;
    vertical-align: middle;
    margin-top:auto;
    margin-bottom:auto;
  }
  .dataInicio{
    width:10px;
    height:10px;
    background-color: var(--status-date-start);
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