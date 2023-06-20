import { useEffect } from 'react';
import Projeto from './ProjetoLista';
import Wrapper from '../assets/wrappers/ProjetossContainer';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import { getAllProjetos } from '../features/allProjetos/allProjetosSlice';
import PageBtnContainer from './PageBtnContainer';
import ListaProjetosHeader from './ListaProjetosHeader.js';
import { handleChange } from '../features/allProjetos/allProjetosSlice';
import FormRowCheckbox from './FormRowCheckbox';


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
    projetoFinalizado,
    DataObjetivoC,
  } = useSelector((store) => store.allProjetos);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.utilizador.user);
  useEffect(() => {
    dispatch(getAllProjetos());
  }, [page, search, searchStatus, searchType, sort, projetoFinalizado, DataObjetivoC]);

  if (isLoading) {
    return <Loading />;
  }


  const handleSort = (tipo) => {
    if (isLoading) return;
    dispatch(handleChange({ name: 'sort', value: tipo }));
  };

  const handleChangeCheckbox = (event) => {
    const finalizado = event.target.checked;
    if(finalizado === true){
    dispatch(handleChange({ name: 'projetoFinalizado', value: finalizado }));
    dispatch(handleChange({ name: 'DataObjetivoC', value: null }));
    }else{
      dispatch(handleChange({ name: 'projetoFinalizado', value: finalizado }));
      dispatch(handleChange({ name: 'DataObjetivoC', value: true }));
    }

  };

  const handleChangeCheckboxDataObjetivo = (event) => {
    const DataObjetivo = event.target.checked;
    dispatch(handleChange({ name: 'DataObjetivoC', value: DataObjetivo }));
  };


  
  if (projetos.length === 0) {
    return (
      <Wrapper>
      <div className="row text-center">
        
        <div className="col-md-3 themed-grid-col">
          <h1>Gestão Projetos</h1>
        </div>

        <div className="col-md-9 finalizado themed-grid-col">
          <h5>
            {totalProjetos} projeto{projetos.length > 1 && 's'} {projetoFinalizado === true ? " Finalizados " : " Em Curso "} encontrados
          </h5>
        </div>


          <div className="col-md-12 text-end themed-grid-col">
            <FormRowCheckbox
              type="checkbox"
              className="row mb-3 text-center"
              classNameLabel="col-md-11 finalizado themed-grid-col"
              classNameInput="col-md-1 themed-grid-col"
              id="Finalizado"
              name="Finalizado"
              placeholder="Finalizado"
              value={projetoFinalizado}
              handleChange={handleChangeCheckbox}
            />
          </div>

        {projetoFinalizado !== true && (
        <div className="col-md-12 text-end themed-grid-col">
          <FormRowCheckbox
            type="checkbox"
            className="row mb-3  text-center"
            classNameLabel="col-md-11  finalizado themed-grid-col"
            classNameInput="col-md-1 themed-grid-col"
            id="DataObjetivoC"
            name="DataObjetivoC"
            labelText="Possui Data Objetivo"
            placeholder="Possui Data Objetivo"
            value={DataObjetivoC}
            handleChange={handleChangeCheckboxDataObjetivo}
          />
        </div>
        )}
      </div>

        <h2>Sem projetos para apresentar</h2>
      </Wrapper>
    );
  }
  
  return (
    <Wrapper>
      <div className="row text-center">
        
        <div className="col-md-3 themed-grid-col">
          <h1>Gestão Projetos</h1>
        </div>

        <div className="col-md-9 finalizado themed-grid-col">
          <h5>
            {totalProjetos} projeto{projetos.length > 1 && 's'} {projetoFinalizado === true ? " Finalizados " : " Em Curso "} encontrados
          </h5>
        </div>


          <div className="col-md-12 text-end themed-grid-col">
            <FormRowCheckbox
              type="checkbox"
              className="row mb-3 text-center"
              classNameLabel="col-md-11 finalizado themed-grid-col"
              classNameInput="col-md-1 themed-grid-col"
              id="Finalizado"
              name="Finalizado"
              placeholder="Finalizado"
              value={projetoFinalizado}
              handleChange={handleChangeCheckbox}
            />
          </div>

        {projetoFinalizado !== true && (
        <div className="col-md-12 text-end themed-grid-col">
          <FormRowCheckbox
            type="checkbox"
            className="row mb-3  text-center"
            classNameLabel="col-md-11  finalizado themed-grid-col"
            classNameInput="col-md-1 themed-grid-col"
            id="DataObjetivoC"
            name="DataObjetivoC"
            labelText="Possui Data Objetivo"
            placeholder="Possui Data Objetivo"
            value={DataObjetivoC}
            handleChange={handleChangeCheckboxDataObjetivo}
          />
        </div>
        )}
      </div>

      <div className='projetos'>
        <ListaProjetosHeader
          sortValue={sort}
          handleChange={handleSort}
          finalizado={projetoFinalizado}
        />

        {projetos.map((projeto) => {
          return <Projeto
            key={projeto._id}
            {...projeto}
            finalizado={projetoFinalizado}
          />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default ListaProjetos;
