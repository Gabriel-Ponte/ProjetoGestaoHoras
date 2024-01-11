import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import links from '../utils/links';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos } from '../features/allProjetos/allProjetosSlice';
import { getProjeto } from '../features/projetos/projetosSlice';
import PageBtnContainer from './PageBtnContainer';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../features/utilizadores/utilizadorSlice';
import { exportProjeto } from '../features/projetos/projetosSlice';
import Wrapper from '../assets/wrappers/NavLinks';
import NavLinksModalBox from './NavLinksModalBox'
import { exportDia } from '../features/allDias/allDiasSlice';

const NavLinks = () => {
  const {
    projetos,
    page,
    numOfPages,
  } = useSelector((store) => store.allProjetos);
  const [showProjeto, setShowProjeto] = useState(false);
  const [showProjetoV, setShowProjetoV] = useState(false);
  const [localState, setLocalState] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.utilizador.user);
  const navigate = useNavigate();
  const handleShowProjetos = () => {
    setShowProjeto(!showProjeto);
    if (showProjeto === false) {
      setShowProjetoV(false);
    }
  };

  const handleShowProjetosV = () => {
    setShowProjetoV(!showProjetoV);
    if (showProjetoV === false) {
      setShowProjeto(false);
    }
  };

  useEffect(() => {
    dispatch(getAllProjetos());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const setProjetosV = async (idP) => {
    try {
      await dispatch(getProjeto(idP));
      window.location.reload(navigate('/PaginaVisualizarProjeto'))
    } catch (error) {
      console.error(error);
    }
  };

  const setProjetosEdit = async (idP) => {
    try {
      await dispatch(getProjeto(idP));
      window.location.reload(navigate('/PaginaEditarProjeto'))
    } catch (error) {
      console.error(error);
    }
  };
  const toggleSidebarClose = ()=>{
      
     dispatch(toggleSidebar(false));
  }

  const changeLocalState = ()=>{
     setLocalState(true)
  }
  const handleCloseModal = ()=>{
   setLocalState(false);
   dispatch(toggleSidebar(false));
}
  

  const handleChangeExportProjetos = () => {
    dispatch(exportProjeto({ userID: user.id }));
  };

  const handleChangeExportHoras = (tipo) => {
    setLocalState(false);
    dispatch(toggleSidebar(false));

    if(Number(tipo)){
      dispatch(exportDia({ userID: user.id, userTipo: tipo }));
    }else{
      dispatch(exportDia({ userID: user.id, userTipo: user?.tipo }));
    }

  };

  return (
    <Wrapper>
    <div className='nav-links'>
      {links.map((link) => {

        const { text, path, id, icon } = link;
        if(user.tipo === 1 && (id === 2 || id === 3 || id === 4 || id === 8 || id === 9)){
          return null;
        }

        if((user.tipo === 6 || user.tipo === 7) && (id === 5 || id === 6 || id === 7 || id === 8 )){
          return null;
        }

        if(user.tipo !== 2 && id === 3){
          return null;
        }
        if(id === 8){
          return (
            <React.Fragment key={id}>
          <button style={{ marginTop: '5%' }}
              onClick={handleChangeExportProjetos}
            >

          <NavLink
            className={({ isActive }) => {
              return isActive ? "nav-link active" : "nav-link";
            }}
            onClick={toggleSidebarClose}
            key={id}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
            </button>


          </React.Fragment>
          
          )
      }

      if(id === 9){
        if(user.tipo === 2){
          return (
    
        <React.Fragment key={id}>


          {localState && <NavLinksModalBox 
          handleExport={handleChangeExportHoras}
          handleClose={handleCloseModal}
          state={localState} />}

          <button style={{ marginTop: '5%' }}
            
            >


          <NavLink

  
            className={({ isActive }) => {
              return isActive ? "nav-link active" : "nav-link";
            }}
            onClick={changeLocalState}
            key={id}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
            </button>
  
  
          </React.Fragment>
          
          )
        }else{
        return (
          <React.Fragment key={id}>
        <button style={{ marginTop: '5%' }}

            onClick={handleChangeExportHoras}
          >

        <NavLink
          

          className={({ isActive }) => {
            return isActive ? "nav-link active" : "nav-link";
          }}
          onClick={toggleSidebarClose}
          key={id}
        >
          <span className="icon">{icon}</span>
          {text}
        </NavLink>
          </button>


        </React.Fragment>
        
        )
    }
  }

        if (id === 6 || id === 7) {
          return (
            <React.Fragment key={id}>
              <button type="button" 
              className="btn btn-link" 
              onClick={id === 6 ? handleShowProjetos : id === 7 ? handleShowProjetosV : null} >
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "nav-link active" : "nav-link";
                  }}
                >
                  <span className="icon">{icon}</span>
                  {text}
                  <AiOutlineArrowDown />
                </NavLink>


              </button>
              {id === 6 && showProjeto && (
                <div className="projetos" style={{ textAlign: "right", marginLeft:"100px"}}>
                  {projetos.map((projeto) => (
                    <div key={"projeto-" + projeto._id}>
                      <NavLink
                        
                        //to={path}
                        className={({ isActive }) => {
                          return isActive ? "nav-link active" : "nav-link";
                        }}
                        onClick={() => setProjetosEdit(projeto._id)}
                        key={"projeto-" + projeto._id}
                      >
                        {projeto.Nome}
                      </NavLink>
                    </div>
                  ))}
                {numOfPages > 1 && <PageBtnContainer small="true" />}
                </div>
              )}

              {id === 7 && showProjetoV && (
                <div className="projetos" style={{ textAlign: "right", marginLeft:"100px"}}>
                  {projetos.map((projeto) => (
                    <div key={"V-" + projeto._id}>
                      <NavLink
                       //

                        //to={path}
                        className={({ isActive }) => {
                          return isActive ? "nav-link active" : "nav-link";
                        }}
                        onClick={() => setProjetosV(projeto._id)}
                        key={"V-" + projeto._id}
                      >
                        {projeto.Nome}
                      </NavLink>
                    </div>
                  ))}
                  {numOfPages > 1 && <PageBtnContainer small="true" />}
                </div>
              )}
            </React.Fragment>
          );
        }
        else {
          return (
            <NavLink
            
              to={path}
              className={({ isActive }) => {
                return isActive ? "nav-link active" : "nav-link";
              }}
              onClick={toggleSidebarClose}
              key={id}
            >
              <span className="icon">{icon}</span>
              {text}
            </NavLink>
          );
        }

      }

      )
      }

    </div>
    </Wrapper>
  );
};
export default NavLinks;
