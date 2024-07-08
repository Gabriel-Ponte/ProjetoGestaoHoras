import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GerirUtilizadores } from '../../components';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const PaginaGerirUtilizadores = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.user.tipo === 2 || user.user.tipo === 7) {
        // Render the component
      } else if (user.user.tipo === 1 || user.user.tipo === 5) {
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

  //{user &&  (user.user.tipo === 2 || user.user.tipo === 7) && <GerirUtilizadores />}
  return (
    <>
      {user &&  (user.user.tipo === 2) && <GerirUtilizadores />}
    </>
  );
};

export default PaginaGerirUtilizadores;
