import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .projetos {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
`
export default Wrapper
