import styled from 'styled-components';

const Wrapper = styled.section`
  height: 75vh; /* Set height to 100% of viewport height */
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
    scrollbar-color: rebeccapurple green;
    scrollbar-width: thin;
    height: 60vh;
    margin: auto;
    margin-right:2%;
    width: 40%;
}

  .right {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: rebeccapurple green;
    scrollbar-width: thin;
    height:60vh;
    width: 50%;
    margin: auto;
  }
    }

`;

export default Wrapper;