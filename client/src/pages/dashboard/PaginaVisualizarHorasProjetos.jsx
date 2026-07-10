import { useSelector } from 'react-redux';
import { VisualizarHorasProjeto } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { canAccessProjetos } from '@/utils/roles';

const PaginaVisualizarHorasProjetos = () => {
  
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (!canAccessProjetos(user.user.tipo)) {
        toast.error("Sem permissões para aceder a esta página!");
        navigate('/PaginaAdicionarHoras');
      }
    } else {
      // Handle the case where user is undefined (optional, depending on your use case)
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    }
  }, [user, navigate]);


  return (
    <>
     {user && canAccessProjetos(user.user.tipo) && <VisualizarHorasProjeto />}
    </>
  );
};
export default PaginaVisualizarHorasProjetos;