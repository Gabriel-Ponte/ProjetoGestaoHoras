import { AddHoras, AddHorasGeral } from '../../components';
import { useSelector } from 'react-redux';
import { canAccessProjetos, addsHorasGeral } from '@/utils/roles';

const PaginaAdicionarHoras = () => {
  const { user } = useSelector((store) => store.utilizador);
  const tipo = user.user.tipo;

  if (canAccessProjetos(tipo)) {
    return <AddHoras />;
  } else if (addsHorasGeral(tipo)) {
    return <AddHorasGeral />;
  }
};
export default PaginaAdicionarHoras;