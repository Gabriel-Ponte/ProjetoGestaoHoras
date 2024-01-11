import { useNavigate } from 'react-router-dom';
import { EditarProjeto } from '../../components';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


const PaginaEditarProjeto = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.user.tipo === 1 || user.user.tipo === 2 || user.user.tipo === 5) {

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
      {user && (user.user.tipo === 1 || user.user.tipo === 2 || user.user.tipo === 5) && <EditarProjeto />}
    </>
  );
};
export default PaginaEditarProjeto;