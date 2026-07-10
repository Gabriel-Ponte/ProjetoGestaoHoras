import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GerirUtilizadores } from '../../components';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { canManageUtilizadores, canAccessProjetos } from '@/utils/roles';

const PaginaGerirUtilizadores = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    } else if (!canManageUtilizadores(user.user.tipo)) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate(canAccessProjetos(user.user.tipo) ? '/PaginaPrincipal' : '/PaginaAdicionarHoras');
    }
  }, [user, navigate]);

  //{user &&  (canManageUtilizadores(user.user.tipo)) && <GerirUtilizadores />}
  return (
    <>
      {user &&  (canManageUtilizadores(user.user.tipo)) && <GerirUtilizadores />}
    </>
  );
};

export default PaginaGerirUtilizadores;
