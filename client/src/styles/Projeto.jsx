import styled from 'styled-components';

const Wrapper = styled.article`
  /* ---- mobile ---- */
  @media (max-width: 767px) {
    position: relative;
    width: 100%;
    background: var(--white);
    border-radius: var(--borderRadius);
    box-shadow: var(--shadow-2);
    margin-bottom: 0;

    .dias {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-width: 3.5rem;
      min-height: 2.5rem;
      padding: 0.35rem 0.5rem;
      border-radius: var(--borderRadius);
      margin: 0.5rem auto;

      p {
        font-size: 0.9rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
      }
    }
    hr {
      border: none;
      border-top: 1px solid var(--grey-200);
      margin: 0.5rem 0 0;
    }
    .buttonProjeto,
    .buttonProjetoLinks {
      font-size: 0.9rem;
      margin: 0.5rem auto 0;
      width: 60vw;
    }
    .reactIcon {
      font-size: 1.4rem;
    }
    h5 {
      font-size: 0.85rem;
    }
  }

  /* ---- desktop ---- */
  @media (min-width: 767px) {
    position: relative;
    width: 100%;
    background: var(--white);
    border: 1px solid var(--grey-200);
    border-radius: var(--borderRadius);
    display: grid;
    grid-template-rows: 1fr auto;
    box-shadow: var(--shadow-1);
    height: 100%;
    margin-bottom: 0;
    transition: var(--transition);

    &:hover {
      box-shadow: var(--shadow-2);
      border-color: var(--grey-300);
    }

    .listaProjetos {
      width: 100%;
      position: relative;
      align-items: center;
      text-align: center;
      margin: 0 auto;
    }
    .align {
      margin: auto;
    }
    .dias {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-width: 3.25rem;
      min-height: 2.25rem;
      padding: 0.3rem 0.45rem;
      border-radius: var(--borderRadius);
      margin: auto;

      p {
        font-size: 0.85rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
      }
      hr {
        border: none;
        border-top: 1px solid var(--grey-200);
        margin: 0;
      }
    }
    h5 {
      font-size: 0.95rem;
      text-align: center;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .buttonProjeto {
      margin: auto;
      width: 80%;
      font-size: 0.9rem;
      padding: 0;
    }
    .buttonProjetoLinks {
      margin: auto;
      width: 80%;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  .piloto {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

export default Wrapper;
