import { toast } from 'react-toastify';
import { AddUtilizador } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { canCreateUtilizador, canAccessProjetos } from '@/utils/roles';
import { useTranslation } from 'react-i18next';

const PaginaAdicionarUtilizador = () => {
  const { t } = useTranslation('auth');
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error(t('guard.notAuthenticated'));
      navigate('/LoginPage');
    } else if (!canCreateUtilizador(user.user.tipo)) {
      toast.error(t('guard.noPermission'));
      navigate(canAccessProjetos(user.user.tipo) ? '/PaginaPrincipal' : '/PaginaAdicionarHoras');
    }
  }, [user, navigate, t]);

  return (
    <>
      {user && (canCreateUtilizador(user.user.tipo)) && <AddUtilizador />}
    </>
  );
};
export default PaginaAdicionarUtilizador;