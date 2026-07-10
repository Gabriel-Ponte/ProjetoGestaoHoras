import { toast } from 'react-toastify';
import { AddUtilizador } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { canCreateUtilizador, canAccessProjetos } from '@/utils/roles';

const PaginaAdicionarUtilizador = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    } else if (!canCreateUtilizador(user.user.tipo)) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate(canAccessProjetos(user.user.tipo) ? '/PaginaPrincipal' : '/PaginaAdicionarHoras');
    }
  }, [user, navigate]);

  return (
    <>
      {user && (canCreateUtilizador(user.user.tipo)) && <AddUtilizador />}
    </>
  );
};
export default PaginaAdicionarUtilizador;