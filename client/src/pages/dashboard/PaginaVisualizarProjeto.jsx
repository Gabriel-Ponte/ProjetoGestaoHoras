import { useSelector } from 'react-redux';
import { VisualizarProjeto } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


const PaginaAdicionarUtilizador = () => {
  

  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!(user.user.tipo === 2 || user.user.tipo === 1 || user.user.tipo === 5 || user.user.tipo === 7)) {
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
     {user && (user.user.tipo === 2 || user.user.tipo === 1 || user.user.tipo === 5 || user.user.tipo === 7) && <VisualizarProjeto />}
    </>
  );
};
export default PaginaAdicionarUtilizador;