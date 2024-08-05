import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types'; 
import { clearStore } from '../features/utilizadores/utilizadorSlice';
import { toast } from 'react-toastify';
// import { PaginaAdicionarHoras, PaginaVisualizarHoras, SharedLayout } from './dashboard';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const TipoRoutes = () => {
  //   return (
  //     <Routes>
  //       <Route
  //         element={
  //             <SharedLayout />
  //         }
  //         >
  //             <Route path='paginaVisualizarHoras' element={<PaginaVisualizarHoras />} />
  //             <Route path='paginaAdicionarHoras' element={<PaginaAdicionarHoras />} />
  //       </Route>
  //     </Routes>
  //   );
  // };
  

  if (user?.user?.tipo === 1 || user?.user?.tipo === 2 || user?.user?.tipo === 5) {
    return <>{children}</>;
  } else if (user?.user?.tipo === 3 || user?.user?.tipo === 4  || user?.user?.tipo === 6  || user?.user?.tipo === 7) {
    return <>{children}</>;
    //return <TipoRoutes />;
  } else if(user?.user?.tipo === 8){

    toast.error("Utilizador Inativo!")
    dispatch(clearStore('Utilizador Inactivo!'));
    return <Navigate to='/login' />;
    
  } else {
    return <Navigate to='/login' />;
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute;
