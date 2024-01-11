import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error, Login, ProtectedRoute } from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  PaginaAdicionarUtilizador,
  PaginaPrincipal,
  PaginaAdicionarProjeto,
  SharedLayout,
  PaginaEditarPerfil,
  PaginaAdicionarHoras,
  PaginaAdicionarHorasProjeto,
  PaginaVisualizarProjeto,
  PaginaEditarProjeto,
  PaginaVisualizarHoras,
  PaginaGerirTipoTrabalho,
  PaginaGerirUtilizadores,
  PaginaResetPassword,
  PaginaResetPasswordChange,
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
          <Route path='' element={<PaginaPrincipal />} />
          <Route path='paginaPrincipal' element={<PaginaPrincipal />} />
          <Route path='paginaAdicionarUtilizador' element={<PaginaAdicionarUtilizador />} />
          <Route path='paginaAdicionarProjeto' element={<PaginaAdicionarProjeto />} />
          <Route path='paginaEditarPerfil' element={<PaginaEditarPerfil />} />
          <Route path='paginaAdicionarHoras' element={<PaginaAdicionarHoras />} />
          <Route path='paginaVisualizarProjeto' element={<PaginaVisualizarProjeto />} />
          <Route path='paginaEditarProjeto' element={<PaginaEditarProjeto />} />
          <Route path='paginaVisualizarHoras' element={<PaginaVisualizarHoras />} />
          <Route path='paginaAdicionarHorasProjeto' element={<PaginaAdicionarHorasProjeto />} />
          <Route path='paginaGerirTipoTrabalho' element={<PaginaGerirTipoTrabalho />} />
          <Route path='paginaGerirUtilizadores' element={<PaginaGerirUtilizadores />} />
        </Route>

        <Route path='login' element={<Login />} />
        <Route path='paginaResetPassword' element={<PaginaResetPassword />} />
        <Route path='paginaResetPasswordChange/:token' element={<PaginaResetPasswordChange />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer position='top-center' />
    </BrowserRouter>
  );
}

export default App;
