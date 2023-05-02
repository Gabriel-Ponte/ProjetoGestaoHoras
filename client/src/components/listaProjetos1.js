import React, { useState, useEffect } from "react";
import Wrapper from '../assets/wrappers/ProjetossContainer';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import ListaProjetosHeader from './ListaProjetosHeader.js';
import { getAllProjetos } from '../features/allProjetos/allProjetosSlice';
import { getProjeto } from '../features/projetos/projetosSlice';
import PageBtnContainer from './PageBtnContainer';
import { useNavigate } from 'react-router-dom';
import { handleChange, clearFilters } from '../features/allProjetos/allProjetosSlice';

const ListaProjetos = () => {
  const {
    projetos,
    isLoading,
    page,
    totalProjetos,
    numOfPages,
    search,
    searchStatus,
    searchType,
    sort,
  } = useSelector((store) => store.allProjetos);
  
  const [values, setValues] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProjetos());
  }, [page, search, sort]);
  
  const handleSort = (tipo) => {
    if (isLoading) return;
    dispatch(handleChange({ name: 'sort', value: tipo }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearFilters());
  };

  if (isLoading) {
    return <Loading />;
  }

  if (projetos.length === 0) {
    return (
      <Wrapper>
        <h2>Sem projetos para apresentar</h2>
      </Wrapper>
    );
  }

  const toggleEdit = async (idP) => {
    await dispatch(getProjeto(idP));
    window.location.reload(navigate('/PaginaEditarProjeto'));
  };

  const toggleVisualize = async (idP) => {
    await dispatch(getProjeto(idP));
    window.location.reload(navigate('/PaginaVisualizarProjeto'));
  };

  return (
    <div className="container">
      <div className="list-group mx-1 w-auto">
        <ListaProjetosHeader
          sortValue={sort}
          handleChange={handleSort}
        />

        {projetos.map(project => (
          <div className="list-group-item" key={project._id}>
            <div className="row mb-3 text-center">
              <div className="col-md-3 themed-grid-col">
                <p>{project.Nome}</p>
              </div>
              <div className="col-md-3 themed-grid-col">
                <p>{project.Tema}</p>
              </div>
              <div className="col-md-3 themed-grid-col">
                <div className="row mb-3 text-center">
                  <div className="col-md-6 themed-grid-col">
                    <p>{project.Cliente}</p>
                  </div>
                  <div className="col-md-6 themed-grid-col">
                    <p>{project.Acao}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 themed-grid-col">
                <div className="row mb-3 text-center">
                  <div className="col-md-6 themed-grid-col">
                    <p>{project.DataObjetivo ? new Date(project.DataObjetivo).toLocaleDateString('en-CA') : ''}</p>
                  </div>
                  <div className="col-md-3 themed-grid-col">
                    <button type="submit" name="VisualizarButton"
                      className="btn btn-primary"
                      onClick={() => toggleEdit(project._id)}> Editar </button>
                  </div>
                  <div className="col-md-3 themed-grid-col">
                    <button type="submit" name="VisualizarButton"
                      className="btn btn-primary"
                      onClick={() => toggleVisualize(project._id)}> Visualizar </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <PageBtnContainer/>
      </div>
    </div>
  );
}

export default ListaProjetos;