import { Route, Navigate, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PaginaAdicionarHoras, PaginaVisualizarHoras, SharedLayout } from './dashboard';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.utilizador);
  
  const TipoRoutes = () => {
    return (
      <Routes>
        <Route
          element={
              <SharedLayout />
          }
          >
              <Route path='paginaVisualizarHoras' element={<PaginaVisualizarHoras />} />
              <Route path='paginaAdicionarHoras' element={<PaginaAdicionarHoras />} />
        </Route>
      </Routes>
    );
  };
  

  if (user?.user?.tipo === 1 || user?.user?.tipo === 2 || user?.user?.tipo === 5) {
    return <>{children}</>;
  } else if (user?.user?.tipo === 3 || user?.user?.tipo === 4  || user?.user?.tipo === 6  || user?.user?.tipo === 7) {
    return <>{children}</>;
    //return <TipoRoutes />;
  } else {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoute;
