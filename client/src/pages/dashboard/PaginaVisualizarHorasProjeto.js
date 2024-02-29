import { useSelector } from 'react-redux';
import { VisualizarHorasProjeto, VisualizarProjeto } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


const PaginaVisualizarHorasProjeto = () => {
  
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (user.user.tipo === 2 || user.user.tipo === 1 || user.user.tipo === 5) {

      } else {
        toast.error("Sem permissões para aceder a esta página!");
        navigate('/PaginaVisualizarHorasProjeto');
      }
    } else {
      // Handle the case where user is undefined (optional, depending on your use case)
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    }
  }, [user, navigate]);


  return (
    <>
     {user && (user.user.tipo === 2 || user.user.tipo === 1 || user.user.tipo === 5) && <VisualizarHorasProjeto />}
    </>
  );
};
export default PaginaVisualizarHorasProjeto;