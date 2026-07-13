import { useNavigate } from 'react-router-dom';
import Wrapper from '@/styles/ErrorPage';
import { Header, Footer } from '../components';
import { ErrorState } from '@/components/ui';
import { useTranslation } from 'react-i18next';

const Error = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  return (
    <Wrapper className='full-page'>
      <Header />
      <ErrorState
        title={t('notFound.title')}
        message={t('notFound.message')}
        onRetry={() => navigate('/PaginaPrincipal')}
        retryLabel={t('notFound.retry')}
      />
      <Footer />
    </Wrapper>
  );
};
export default Error;
