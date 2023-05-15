import styled from 'styled-components';

const Wrapper = styled.article`
  background: var(--white);
  border-radius: var(--borderRadius);
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: var(--shadow-2);
  height:100%;
  max-height: 300px;
  margin-bottom: 0px;

  .listaProjetos{
    width:100%;
    display: relative;
    position: relative;
    align-items: center;
    text-align: center;
    margin: 0 auto;
  }
  .align{
    margin: auto;
  }
  .dias {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 50px;
    height: 50px;
    border: 1px solid black;
    margin: auto; 
    margin-top:auto;
  
    p {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }
  }

  hr {
    border: 1px solid #303030;
    margin:0;
    margin-top:2%;

  }
`;

export default Wrapper;

