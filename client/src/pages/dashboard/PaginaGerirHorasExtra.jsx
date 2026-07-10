import { useNavigate } from 'react-router-dom';
import { GerirHorasExtra } from '../../components';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ROLE, canManageHorasExtra } from '@/utils/roles';

const PaginaGerirHorasExtra = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();
  const tipo = user?.user?.tipo;
  const allowed = canManageHorasExtra(tipo);

  useEffect(() => {
    if (!user) {
      toast.error('Utilizador não autenticado!');
      navigate('/LoginPage');
      return;
    }
    if (!allowed) {
      toast.error('Sem permissões para aceder a esta página!');
      navigate(tipo === ROLE.ENG_PROCESSOS ? '/PaginaPrincipal' : '/PaginaAdicionarHoras');
    }
  }, [user, allowed, tipo, navigate]);

  return allowed ? <GerirHorasExtra /> : null;
};
export default PaginaGerirHorasExtra;
