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
import Wrapper from '../assets/wrappers/NavLinks';
const NavLinks = () => {
  const {
    projetos,
    page,
    numOfPages,
  } = useSelector((store) => store.allProjetos);
  const [showProjeto, setShowProjeto] = useState(false);
  const [showProjetoV, setShowProjetoV] = useState(false);
  const dispatch = useDispatch();


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

  }, [page]);

  const setProjetosV = async (idP) => {
    try {
      await dispatch(getProjeto(idP));
      {window.location.reload(navigate('/PaginaVisualizarProjeto'))}
    } catch (error) {
      console.error(error);
    }
  };

  const setProjetosEdit = async (idP) => {
    try {
      await dispatch(getProjeto(idP));
      {window.location.reload(navigate('/PaginaEditarProjeto'))}
    } catch (error) {
      console.error(error);
    }
  };
  const toggleSidebarClose = ()=>{
    dispatch(toggleSidebar(false));
  }

  return (
    <Wrapper>
    <div className='nav-links'>
      {links.map((link) => {
        const { text, path, id, icon } = link;
        if (id === 5 || id === 6) {
          return (
            <React.Fragment key={id}>
              <button type="button" className="btn btn-link" onClick={id === 5 ? handleShowProjetos : id === 6 ? handleShowProjetosV : null} >
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
              {id === 5 && showProjeto && (
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

              {id === 6 && showProjetoV && (
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
      })}
    </div>
    </Wrapper>
  );
};
export default NavLinks;
