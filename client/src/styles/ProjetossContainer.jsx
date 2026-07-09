import styled from 'styled-components'

const Wrapper = styled.section`
  @media (max-width: 768px) {
    .finalizado{
      text-align: center;
    }
  }
  @media (min-width: 768px) {
    .finalizado{
      text-align: end;
    }
  }
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .projetos {
    width:100%;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
`
export default Wrapper
