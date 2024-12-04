import { AddHoras, AddHorasGeral } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTipo } from '../../features/utilizadores/utilizadorSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const PaginaAdicionarHoras = () => {
  const { user } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(getUserTipo(user?.user?.id)).then((res) => {
        const tipo = res.payload.tipo ? res.payload.tipo : "";
    })
    } else {
      // Handle the case where user is undefined (optional, depending on your use case)
      toast.error("Utilizador não autenticado!");
      navigate('/LoginPage');
    }
  }, [user, navigate]);


  if(user.user.tipo === 1 || user.user.tipo === 2 || user.user.tipo === 5 || user.user.tipo === 7){
  return (
    <>
      <AddHoras />
    </>
  );
  }else if(user.user.tipo === 3 || user.user.tipo === 4 || user.user.tipo === 6 || user.user.tipo === 9 || user.user.tipo === 10 || user.user.tipo === 11 || user.user.tipo === 12){
    return (
      <>
        <AddHorasGeral />
      </>
    );
  }
};
export default PaginaAdicionarHoras;