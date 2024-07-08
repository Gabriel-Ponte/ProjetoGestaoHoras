import Wrapper from '../assets/wrappers/NavbarGeral';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearStore } from '../features/utilizadores/utilizadorSlice';
// import { GiHourglass } from 'react-icons/gi';
// import { GoDiffAdded } from 'react-icons/go';
//import { handleChange } from '../features/allProjetos/allProjetosSlice';


const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [disableAddHoras, setDisableAddHoras] = useState(false);
  const [disableVisualizardHoras, setDisableVisualizarHoras] = useState(false);
  const { user } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleShowLogoutClick = () => {
    setShowLogout(!showLogout);
    //setDisableAddHoras(!disableAddHoras);
  };

  const editarPerfil = () => {
    setShowLogout(false);
    navigate('/PaginaEditarPerfil');
  };

  const logout = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    dispatch(clearStore('Logging out...'))
    navigate('/login');
  };

  const visualizarHoras = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    setDisableVisualizarHoras(true);

    //window.location.reload(navigate('/PaginaVisualizarHoras'));
    navigate('/PaginaVisualizarHoras');
  }

  const addHoras = () => {
    setShowLogout(false);
    setDisableAddHoras(true);
    setDisableVisualizarHoras(false);
    navigate('/PaginaAdicionarHoras');
  };
  

  return (
    <Wrapper>
      <div className='subheader'>
        <div className='col-8  '>
          <div className='row'>
            <div className='col-6 middleButton'>
              <button
                className='btn btn-outline-secondary'
                onClick={addHoras}
                disabled={disableAddHoras} >
                Adicionar Horas
              </button>

 
            </div>
            <div className='col-6 middleButton' >
              <button
                className={`btn btn-outline-secondary ${disableVisualizardHoras ? 'active' : ''}`}
                onClick={visualizarHoras}
                disabled={disableVisualizardHoras} >
                Visualizar Horas
              </button>
            </div>
          </div>
        </div>
        <div className='col-2'>
          <div className='btn-container'>
            <div className='divButtonUtilizador'>
              <button
                type='button'
                className='btn'

                onClick={handleShowLogoutClick}
              >
                {user?.user.nome}
                <img
                  src={
                    user?.user.foto
                      ?
                      URL.createObjectURL(new Blob([new Uint8Array(user?.user.foto.data.data)], { type: user?.user.foto.contentType }))
                      : <FaUserCircle />
                  }
                  alt="Imagem Perfil Utilizador"
                  width="20" height="20"
                  className="rounded-circle" style={{ backgroundColor: "#D9D9D9" }}
                />
                <FaCaretDown />
              </button>
            </div>

            <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'} >
              <div className='row drop'>
                <button
                  type='button'
                  className='dropdown-btn'
                  onClick={editarPerfil}
                >
                  Editar Perfil
                </button>
                <button
                  type='button'
                  className='dropdown-btn'
                  onClick={logout}
                >
                  logout
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default Navbar;
