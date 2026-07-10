import { useNavigate ,Navigate} from 'react-router-dom';
import { ListaProjetos } from '../../components';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ROLE, canAccessProjetos } from '@/utils/roles';

const AllProjetos = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();
  useEffect(() => {
    
    if (!user) {
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    } else if(user?.user?.tipo === ROLE.INATIVO){
      toast.error("Utilizador Inativo!");
      navigate('/LoginPage');

    }
  }, [user, navigate]);
  if(user && canAccessProjetos(user.user.tipo)){
    return (
      <>
        <ListaProjetos />
      </>
  );
}else if(user){
  return <Navigate to='/PaginaAdicionarHoras' />;
} else{
  navigate('/LoginPage');
}
};
export default AllProjetos;
