import { useNavigate } from 'react-router-dom';
import { AddHorasProjeto } from '../../components';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { canAccessProjetos } from '@/utils/roles';
import { useTranslation } from 'react-i18next';

const PaginaAdicionarHoras = () => {
  const { t } = useTranslation('auth');
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (canAccessProjetos(user.user.tipo)) {
        // Render the component
      } else {
        toast.error(t('guard.noPermission'));
        navigate('/PaginaAdicionarHoras');
      }
    } else {
      // Handle the case where user is undefined (optional, depending on your use case)
      toast.error(t('guard.notAuthenticated'));
      navigate('/LoginPage');
    }
  }, [user, navigate, t]);

  return (
    <>
      {user && canAccessProjetos(user.user.tipo) && <AddHorasProjeto />}
    </>
  );

}
export default PaginaAdicionarHoras;