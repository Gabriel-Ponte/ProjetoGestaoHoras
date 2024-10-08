import { useNavigate } from 'react-router-dom';
import { GerirHorasExtra } from '../../components';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const PaginaGerirHorasExtra = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.user.tipo === 7 || user.user.tipo === 6) {
        // Render the component
      } else if (user.user.tipo === 1 || user?.user?.tipo === 2) {
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

  if (user && (user?.user?.tipo === 7 || user?.user?.tipo === 6)) {
    return (
      <>
        {user && (user?.user?.tipo === 7 || user?.user?.tipo === 6) && <GerirHorasExtra />}
      </>
    );
  } else {
    toast.error("Utilizador sem permissões!");
    navigate('/LoginPage');
  }
};
export default PaginaGerirHorasExtra;