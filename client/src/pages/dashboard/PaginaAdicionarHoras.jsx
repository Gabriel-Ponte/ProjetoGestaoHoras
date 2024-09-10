import { AddHoras, AddHorasGeral } from '../../components';
import { useSelector } from 'react-redux';



const PaginaAdicionarHoras = () => {
  const { user } = useSelector((store) => store.utilizador);

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