import { AddHoras, AddHorasGeral } from '../../components';
import { useSelector } from 'react-redux';



const PaginaAdicionarHoras = () => {
  const { user } = useSelector((store) => store.utilizador);

  if(user.user.tipo === 1 || user.user.tipo === 2 || user.user.tipo === 5){
  return (
    <>
      <AddHoras />
    </>
  );
  }else if(user.user.tipo === 3 || user.user.tipo === 4 || user.user.tipo === 6 || user.user.tipo === 7 ){
    return (
      <>
        <AddHorasGeral />
      </>
    );
  }
};
export default PaginaAdicionarHoras;