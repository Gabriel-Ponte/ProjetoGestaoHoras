import { toast } from 'react-toastify';
import { GerirTipoTrabalho } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { canManageTiposTrabalho, canAccessProjetos } from '@/utils/roles';

const PaginaGerirTipoTrabalho = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    } else if (!canManageTiposTrabalho(user.user.tipo)) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate(canAccessProjetos(user.user.tipo) ? '/PaginaPrincipal' : '/PaginaAdicionarHoras');
    }
  }, [user, navigate]);


  return (
    <>
    {user && (canManageTiposTrabalho(user.user.tipo)) && <GerirTipoTrabalho />}
 
    </>
  );
};
export default PaginaGerirTipoTrabalho;