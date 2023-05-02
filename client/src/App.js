import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error, Login, ProtectedRoute } from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  PaginaAdicionarUtilizador,
  PaginaPrincipal,
  PaginaPrincipal1,
  PaginaAdicionarProjeto,
  SharedLayout,
  PaginaEditarPerfil,
  PaginaAdicionarHoras,
  PaginaVisualizarProjeto,
  PaginaEditarProjeto,
  PaginaVisualizarHoras,
} from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route path='paginaPrincipal' element={<PaginaPrincipal />} />
          <Route path='paginaPrincipal1' element={<PaginaPrincipal1 />} />
          <Route path='paginaAdicionarUtilizador' element={<PaginaAdicionarUtilizador />} />
          <Route path='paginaAdicionarProjeto' element={<PaginaAdicionarProjeto />} />
          <Route path='paginaEditarPerfil' element={<PaginaEditarPerfil />} />
          <Route path='paginaAdicionarHoras' element={<PaginaAdicionarHoras />} />
          <Route path='paginaVisualizarProjeto' element={<PaginaVisualizarProjeto />} />
          <Route path='paginaEditarProjeto' element={<PaginaEditarProjeto />} />
          <Route path='paginaVisualizarHoras' element={<PaginaVisualizarHoras />} />
        </Route>

        
        <Route path='login' element={<Login />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer position='top-center' />
    </BrowserRouter>
  );
}

export default App;
