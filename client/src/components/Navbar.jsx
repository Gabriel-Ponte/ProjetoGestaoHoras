import Wrapper from '../assets/wrappers/Navbar';
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, clearStore } from '../features/utilizadores/utilizadorSlice';
import { getAllDiasHorasExtra, getAllDiasHorasExtraResponsavel } from '../features/allDias/allDiasSlice';

// import { GiHourglass } from 'react-icons/gi';
// import { GoDiffAdded } from 'react-icons/go';
import { handleChange } from '../features/allProjetos/allProjetosSlice';

import { handleChangePagamentos } from '../features/pagamentos/pagamentosSlice';
const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [disableAddHoras, setDisableAddHoras] = useState(false);
  const [verificaHorasExtra, setVerificaHorasExtra] = useState(false);
  const { user } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    try {
      
      dispatch(handleChangePagamentos({ name: 'tipo', value: "1" }));
      if(user?.user?.tipo === 6){

        dispatch(getAllDiasHorasExtraResponsavel()).then((res) => {
          const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
          if(horasExtraArray && horasExtraArray.length > 0){

            setVerificaHorasExtra(true)
          } else{
            setVerificaHorasExtra(false)
          }
        });
      }else if(user?.user?.tipo === 7){
        dispatch(getAllDiasHorasExtra()).then((res) => {
          const horasExtraArray = Array.isArray(res?.payload?.diasHorasExtra) ? res.payload.diasHorasExtra : [];
          if(horasExtraArray && horasExtraArray.length > 0){

            setVerificaHorasExtra(true)
          } else{
            setVerificaHorasExtra(false)
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
}, [user?.user, navigate, dispatch]);

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
    dispatch(handleChange({ name: 'tipoTrabalho', value: "" }));
    dispatch(toggleSidebar(false));
    navigate('/PaginaPrincipal');
    //window.location.reload(navigate('/PaginaPrincipal'));
  };

  const navGestaoHorasExtra = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    dispatch(handleChange({ name: 'tipoTrabalho', value: "" }));
    dispatch(toggleSidebar(false));
    navigate('/paginaGerirHorasExtra');
    //window.location.reload(navigate('/PaginaPrincipal'));
  };

  const visualizarHoras=()=>{
    setShowLogout(false);
    setDisableAddHoras(false);
    dispatch(toggleSidebar(false));
    //window.location.reload(navigate('/PaginaVisualizarHoras'));
    navigate('/PaginaVisualizarHoras');
  }

  const visualizarHorasProjetos=()=>{
    setShowLogout(false);
    setDisableAddHoras(false);
    dispatch(toggleSidebar(false));
    //window.location.reload(navigate('/PaginaVisualizarHoras'));
    navigate('/PaginaVisualizarHorasProjetos');
  }


  const addHoras = () => {
    setShowLogout(false);
    setDisableAddHoras(false);
    dispatch(toggleSidebar(false));
    navigate('/PaginaAdicionarHoras');
  };

  const styleButton = {
    fontSize: "1.5vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "inline-block",
};

  return (
    <Wrapper>
      <div className='subheader'>

        <div className='col-3 middleButton'>
        <button type='button' className='toggle-btn' onClick={toggle}>
          <FaAlignLeft />
        </button>
        </div>
        {user?.user?.tipo === 1|| user?.user?.tipo === 2 || user?.user?.tipo === 5 ?
        <div className='col-6 middleButton' >
          <button className='btn btn-light'     
          style={styleButton} type='button' onClick={returnMain}>Gestão Projetos</button>
        </div>
        : (user?.user?.tipo === 7) ? 
      <div className='col-6 middleButton' >
        <div className='col-5 middleButton' >
        <button className='btn btn-light' style={styleButton} type='button' onClick={returnMain}>Gestão Projetos</button>
        </div>
        <div className='col-6 middleButton' >
        <button className='btn btn-light'     style={{
    ...styleButton, // Spread the properties of styleButton
    backgroundColor: verificaHorasExtra ? "#A6C48A" : "" // Add or override specific styles
  }} type='button' onClick={navGestaoHorasExtra}>Gestão Horas Extra</button>
      </div>
      </div>:
      (user?.user?.tipo === 6) ? 
      <div className='col-6 middleButton' >
        <div className='col-6 middleButton' >
        <button
    className='btn btn-light'
    style={{...styleButton ,backgroundColor: verificaHorasExtra ? "#A6C48A" : ""}}
    type='button'
    onClick={navGestaoHorasExtra}>Gestão Horas Extra</button>
      </div>
      </div> :
        <div className='col-6 middleButton' >
        <h1 style={{fontSize : "250%", maxHeight: "80px" ,textTransform: 'none'}}>Gestão de Horas</h1>
      </div>
      }
      
        <div className='col-3'>
        <div className='btn-container'>
          <div className='divButtonUtilizador'>
            
          <button
            type='button'
            className='btn'
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",

              padding: "3px 10px",
              lineHeight: "normal",
            }}
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
          { (showLogout === false) ? (
          <div className='divButtonUtilizador text-center'>
            <div>
          <button 
          className='button-30'
          onClick={addHoras} 
          
          style={{   
            fontSize: "85%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block",
            lineHeight: "normal",
            width:'auto',
 
            visibility: disableAddHoras ? 'hidden' : 'visible' }} 
          disabled={disableAddHoras} >
                Adicionar Horas
          </button>
          <button 
          className='button-30'
          onClick={visualizarHoras} 
          style={{            
            fontSize: "85%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block",
            lineHeight: "normal",

            width:'auto',visibility: disableAddHoras ? 'hidden' : 'visible' }} 
          disabled={disableAddHoras} >
                Visualizar Horas
          </button>
            { (user?.user?.tipo === 2 || user?.user?.tipo === 7) && (
          <button 
          className='button-30'
          onClick={visualizarHorasProjetos} 
          style={{        
            width:'auto',
            fontSize: "85%",
              
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block",
            lineHeight: "normal",
            visibility: disableAddHoras ? 'hidden' : 'visible' }} 
            disabled={disableAddHoras} >
                Horas Projetos
          </button>
          )}
          </div>
          </div>
          ) :(
          <div className={'col-md-11'} >

            <div className='row drop'>
            <div className='col-md-1'></div>
              <div className='col-md-6 text-end' >
            <button
              type='button'
              className='button-30'
              onClick={editarPerfil}
              style={{        
                width:'auto',
                fontSize: "85%",
                overflow: "hidden",
                lineHeight: "normal" }} 
            >
              Editar Perfil
            </button>
            </div>


            <div className='col-md-4 text-start' >
            <button
              type='button'
              className='button-30'
              onClick={logout}
              style={{        
                width:'auto',
                fontSize: "85%",
                overflow: "hidden",
                backgroundColor: "#D00000",
                padding: "10px",
                lineHeight: "normal" }} 
            >
              Log out
            </button>
            </div>
            <div className='col-md-1'></div>
            </div>
            </div>
            )}
          </div>
          
        </div>
        </div>
  
    </Wrapper>
  );
};
export default Navbar;
