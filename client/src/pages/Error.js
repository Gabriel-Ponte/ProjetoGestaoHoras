import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/ErrorPage';
import { Header, Footer } from '../components';

const Error = () => {
  return (
    <Wrapper className='full-page'>
      <Header />
      <div>
        <h3>Pagina não encontrada</h3>
        <p>Não foi possivel encontrar a página que procura</p>
        <Link to='/PaginaPrincipal'>Voltar á página Principal</Link>
      </div>
      <Footer/>
    </Wrapper>
  );
};
export default Error;
