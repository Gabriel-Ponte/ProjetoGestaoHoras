import { useNavigate } from 'react-router-dom';
import { ListaProjetos } from '../../components';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';




const AllProjetos = () => {
  const { user } = useSelector((store) => store.utilizador);
  const navigate = useNavigate();
  useEffect(() => {
    
    if (!user) {
      // if (user.user.tipo === 1 || user.user.tipo === 2 || user.user.tipo === 5 || user.user.tipo === 7) {

      // }
      // Handle the case where user is undefined (optional, depending on your use case)
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    } else if(user?.user?.tipo === 8){
      toast.error("Utilizador Inativo!");
      navigate('/LoginPage');

    }
  }, [user, navigate]);
  if(user && (user.user.tipo === 1 || user.user.tipo === 2 || user.user.tipo === 5 || user.user.tipo === 7)){
    return (
      <>
        <ListaProjetos />
      </>
  );
}else {
  toast.error("Utilizador sem permissões!");
  navigate('/LoginPage');
}
};
export default AllProjetos;
