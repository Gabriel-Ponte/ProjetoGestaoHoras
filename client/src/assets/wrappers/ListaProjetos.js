import styled from 'styled-components';

const Wrapper = styled.main`

.App {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: end;
  overflow: auto;
  position: relative;
  flex-wrap: wrap;
  align-content: end;
  justify-content: start;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}


.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ListaProjetos {
  display: inline;
  overflow: scroll;
  grid-row-start: initial;
  align-self: center;
  border: 1px solid black;
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
  `;

export default Wrapper;