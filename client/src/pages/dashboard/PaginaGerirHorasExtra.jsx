import { useNavigate } from 'react-router-dom';
import { GerirHorasExtra } from '../../components';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ROLE, canManageHorasExtra } from '@/utils/roles';
import { useTranslation } from 'react-i18next';

const PaginaGerirHorasExtra = () => {
  const { t } = useTranslation('auth');
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();
  const tipo = user?.user?.tipo;
  const allowed = canManageHorasExtra(tipo);

  useEffect(() => {
    if (!user) {
      toast.error(t('guard.notAuthenticated'));
      navigate('/LoginPage');
      return;
    }
    if (!allowed) {
      toast.error(t('guard.noPermission'));
      navigate(tipo === ROLE.ENG_PROCESSOS ? '/PaginaPrincipal' : '/PaginaAdicionarHoras');
    }
  }, [user, allowed, tipo, navigate, t]);

  return allowed ? <GerirHorasExtra /> : null;
};
export default PaginaGerirHorasExtra;
