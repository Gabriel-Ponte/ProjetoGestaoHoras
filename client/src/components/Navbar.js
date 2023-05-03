import Wrapper from '../assets/wrappers/Navbar';
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, clearStore } from '../features/utilizadores/utilizadorSlice';
import { GiHourglass } from 'react-icons/gi';
import { GoDiffAdded } from 'react-icons/go';



const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [disableAddHoras, setDisableAddHoras] = useState(false);
  const { user } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    dispatch(toggleSidebar());
  };


  const handleShowLogoutClick = () => {
    setShowLogout(!showLogout);
    setDisableAddHoras(!disableAddHoras);
  };

  const editarPerfil = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    //window.location.reload(navigate('/PaginaEditarPerfil'));
    navigate('/PaginaEditarPerfil');
  };

  const logout = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    dispatch(clearStore('Logging out...'))
    navigate('/login');
  };
  const returnMain = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    window.location.reload(navigate('/PaginaPrincipal'));
  };


  const visualizarHoras=()=>{
    setShowLogout(false);
    setDisableAddHoras(false);
    //window.location.reload(navigate('/PaginaVisualizarHoras'));
    navigate('/PaginaVisualizarHoras');
  }

  const addHoras = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    navigate('/PaginaAdicionarHoras');
  };
  
  return (
    <Wrapper>
      <div className='subheader'>
        <button type='button' className='toggle-btn' onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <button className='btn btn-light' style={{fontSize : "250%"}} type='button' onClick={returnMain}>Gestão Horas</button>
        </div>
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
                  : <FaUserCircle/>
              }
              alt="Imagem Perfil Utilizador"
              width="20" height="20"
              className="rounded-circle" style={{ backgroundColor: "#D9D9D9" }}
            />
            <FaCaretDown />
          </button>
          </div>
          <div className='divButtonUtilizador'>
            <div>
          <button 
          onClick={visualizarHoras} 
          style={{float: 'right', width:"20", height:"20", textAlign: "center"
          ,visibility: disableAddHoras ? 'hidden' : 'visible' }} 
          disabled={disableAddHoras} >
                <GiHourglass/>
          </button>
          <button 
          onClick={addHoras} 
          style={{float: 'right', width:"20", height:"20", textAlign: "center"
          ,visibility: disableAddHoras ? 'hidden' : 'visible' }} 
          disabled={disableAddHoras} >
                <GoDiffAdded/>
          </button>
          </div>
          </div>
          <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'} >
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
    </Wrapper>
  );
};
export default Navbar;
