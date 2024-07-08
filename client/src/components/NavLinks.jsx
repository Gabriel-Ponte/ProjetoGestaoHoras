import { Fragment,useState } from 'react';
import { NavLink } from 'react-router-dom';
import links from '../utils/links';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
//import { getAllProjetos, getAllProjetos1 } from '../features/allProjetos/allProjetosSlice';
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

  // useEffect(() => {
  //   //dispatch(getAllProjetos1());
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [page]);

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


  const getFilteredProjetos = () => {
    const dateP = new Date();
    const currentDay = dateP.getDate();
    const currentMonth = dateP.getMonth();
    const currentYear = dateP.getFullYear();
    
    const filteredP = projetos.filter((p) => {

      const dataI = new Date(p.DataInicio);
      if (p.DataFim) {
        const dataF = new Date(p.DataFim);

        const endDay = dataF.getDate();
        const endMonth = dataF.getMonth();
        const endYear = dataF.getFullYear();

       if (
          currentYear > endYear || (currentYear === endYear && currentMonth > endMonth) ||
          (
            currentYear === endYear &&
            currentMonth === endMonth &&
            currentDay > endDay)
        ) {
          return false;
        }
      } else if (p.Finalizado) {
        return false;
      }

      const startDay = dataI.getDate();
      const startMonth = dataI.getMonth();
      const startYear = dataI.getFullYear();

      if (
        currentYear < startYear || (currentYear === startYear && currentMonth < startMonth) ||
        (
          currentYear === startYear &&
          currentMonth === startMonth &&
          currentDay < startDay)
      ) {
        return false;
      }

      return true;
    });

    return filteredP;
  };
  

  return (
    <Wrapper>
    <div className='nav-links'>
      {links.map((link) => {

        const { text, path, id, icon } = link;
        if(user.tipo === 1 && (id === 2 || id === 3 || id === 4 || id === 8 || id === 9)){
          return null;
        }

        //if((user.tipo === 6 || user.tipo === 7) && (id === 5 || id === 6 || id === 7 || id === 8 || id === 9 )){

        if((user.tipo === 6) && (id === 5 || id === 6 || id === 7 || id === 8 || id === 9 )){
          return null;
        }
        //if(user.tipo !== 7 && user.tipo !== 2 && id === 3){
        if(user.tipo !== 2 && id === 3){
          return null;
        }
        if(id === 8){
          return (
            <Fragment key={id}>
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


          </Fragment>
          
          )
      }
      
      if(id === 9){
        if(user.tipo === 2 || user?.tipo === 7){
          return (
    
        <Fragment key={id}>


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
  
  
          </Fragment>
          
          )
        }else{
        return (
          <Fragment key={id}>
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


        </Fragment>
        
        )
    }
  }

        if (id === 6 || id === 7) {
          return (
            <Fragment key={id}>
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

                  {getFilteredProjetos().map((projeto) => (
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
                  {getFilteredProjetos().map((projeto) => (
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
            </Fragment>
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
