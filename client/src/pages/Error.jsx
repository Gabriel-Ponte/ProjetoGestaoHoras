import { useNavigate } from 'react-router-dom';
import Wrapper from '@/styles/ErrorPage';
import { Header, Footer } from '../components';
import { ErrorState } from '@/components/ui';

const Error = () => {
  const navigate = useNavigate();
  return (
    <Wrapper className='full-page'>
      <Header />
      <ErrorState
        title='Página não encontrada'
        message='Não foi possível encontrar a página que procura.'
        onRetry={() => navigate('/PaginaPrincipal')}
        retryLabel='Voltar à Página Principal'
      />
      <Footer />
    </Wrapper>
  );
};
export default Error;
