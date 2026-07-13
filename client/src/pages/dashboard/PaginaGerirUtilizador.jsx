import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GerirUtilizadores } from '../../components';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { canManageUtilizadores, canAccessProjetos } from '@/utils/roles';
import { useTranslation } from 'react-i18next';

const PaginaGerirUtilizadores = () => {
  const { t } = useTranslation('auth');
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error(t('guard.notAuthenticated'));
      navigate('/LoginPage');
    } else if (!canManageUtilizadores(user.user.tipo)) {
      toast.error(t('guard.noPermission'));
      navigate(canAccessProjetos(user.user.tipo) ? '/PaginaPrincipal' : '/PaginaAdicionarHoras');
    }
  }, [user, navigate, t]);

  //{user &&  (canManageUtilizadores(user.user.tipo)) && <GerirUtilizadores />}
  return (
    <>
      {user &&  (canManageUtilizadores(user.user.tipo)) && <GerirUtilizadores />}
    </>
  );
};

export default PaginaGerirUtilizadores;
