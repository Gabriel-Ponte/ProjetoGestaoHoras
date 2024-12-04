import { toast } from 'react-toastify';
import { AddUtilizador } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserTipo } from '../../features/utilizadores/utilizadorSlice';


const PaginaAdicionarUtilizador = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getUserTipo(user?.user?.id)).then((res) => {
        const tipo = res.payload.tipo ? res.payload.tipo : "";
      if (tipo === 2 || tipo === 5 || tipo === 6 || tipo === 7) {
        // Render the component
      } else if( tipo === 1){
        toast.error("Sem permissões para aceder a esta página!");
        navigate('/PaginaPrincipal');
      }else {
        toast.error("Sem permissões para aceder a esta página!");
        navigate('/PaginaAdicionarHoras');
      }
    })
    } else {
      // Handle the case where user is undefined (optional, depending on your use case)
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    }
  }, [user, navigate]);

  return (
    <>
      {user && (user.user.tipo === 2 || user.user.tipo === 5 || user.user.tipo === 6 || user.user.tipo === 7) && <AddUtilizador />}
    </>
  );
};
export default PaginaAdicionarUtilizador;