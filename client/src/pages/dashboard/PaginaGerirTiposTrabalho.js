import { toast } from 'react-toastify';
import { GerirTipoTrabalho } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';




const PaginaGerirTipoTrabalho = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.user.tipo === 2 || user.user.tipo ===  5|| user.user.tipo === 6 || user.user.tipo === 7) {
        // Render the component
      } else if (user.user.tipo === 1) {
        toast.error("Sem permissões para aceder a esta página!");
        navigate('/PaginaPrincipal');
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
    {user && (user.user.tipo === 2 || user.user.tipo ===  5|| user.user.tipo === 6 || user.user.tipo === 7) && <GerirTipoTrabalho />}
 
    </>
  );
};
export default PaginaGerirTipoTrabalho;