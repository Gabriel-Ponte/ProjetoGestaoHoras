import { useNavigate } from 'react-router-dom';
import { AddHorasProjeto } from '../../components';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { canAccessProjetos } from '@/utils/roles';

const PaginaAdicionarHoras = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (canAccessProjetos(user.user.tipo)) {
        // Render the component
      } else {
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
      {user && canAccessProjetos(user.user.tipo) && <AddHorasProjeto />}
    </>
  );

}
export default PaginaAdicionarHoras;