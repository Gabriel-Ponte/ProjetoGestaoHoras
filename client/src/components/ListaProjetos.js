import { useEffect } from 'react';
import Projeto from './ProjetoLista';
import Wrapper from '../assets/wrappers/ProjetossContainer';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import { getAllProjetos } from '../features/allProjetos/allProjetosSlice';
import PageBtnContainer from './PageBtnContainer';
import ListaProjetosHeader from './ListaProjetosHeader.js';
import { handleChange, clearFilters } from '../features/allProjetos/allProjetosSlice';
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
  } = useSelector((store) => store.allProjetos);
  const dispatch = useDispatch();
  console.log(projetoFinalizado);
  useEffect(() => {
    dispatch(getAllProjetos());
  }, [page, search, searchStatus, searchType, sort, projetoFinalizado]);

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
  const handleSort = (tipo) => {
    if (isLoading) return;
    dispatch(handleChange({ name: 'sort', value: tipo }));
  };

  const handleChangeCheckbox = (event) => {
    const finalizado = event.target.checked;
    console.log(finalizado);
    dispatch(handleChange({ name: 'projetoFinalizado', value: finalizado }));
  };


  return (
    <Wrapper>
            <div className="row mb-3 text-center">
                <div className="col-md-3 themed-grid-col">
      <h5>
        {totalProjetos} projeto{projetos.length > 1 && 's'} {projetoFinalizado === false ? " Em Curso " : " Finalizados "} encontrados  
      </h5>
      </div>
      <div className="col-md-3 themed-grid-col">
      <FormRowCheckbox
        type="checkbox"
        className="row mb-3 text-center"
        classNameLabel="col-md-3 themed-grid-col"
        classNameInput="col-md-3 themed-grid-col"
        id="Finalizado"
        name="Finalizado"
        placeholder="Finalizado"
        value={projetoFinalizado}
        handleChange={handleChangeCheckbox}
      />
      </div>
      </div>
      <div className='projetos'>
      <ListaProjetosHeader
          sortValue={sort}
          handleChange={handleSort}
        />

        {projetos.map((projeto) => {
          return <Projeto key={projeto._id} {...projeto} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default ListaProjetos;
