import styled from 'styled-components'

const Wrapper = styled.nav`
  height: var(--nav-height);
  display: flex;
  align-items: center;
  position: relative;
  overflow: visible;
  overflow-wrap: break-word;
  word-break: break-word;
  

  .projetos{
    display: inline;
    overflow-y: auto;
    position: sticky;
    height: 30vh;
  }

  .show-projetos {
    visibility: visible;
  }

`
export default Wrapper
