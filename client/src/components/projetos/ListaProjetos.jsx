import { useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import Projeto from '@/components/projetos/ProjetoLista';
import Wrapper from '@/styles/ProjetossContainer';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '@/components/common/Loading';
import { getAllProjetos } from '@/features/allProjetos/allProjetosSlice';
import PageBtnContainer from '@/components/layout/PageBtnContainer';
import ListaProjetosHeader from '@/components/projetos/ListaProjetosHeader';
import { handleChange } from '@/features/allProjetos/allProjetosSlice';
import { listaUtilizadores } from '@/features/utilizadores/utilizadorSlice';
import { EmptyState } from '@/components/ui';

const ListaProjetos = () => {

  const { t } = useTranslation('projetos');

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
  const { utilizadores } = useSelector((store) => store.utilizador);

  const [verificaAlterado, setVerificaAlterado] = useState(0);

  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores.filter(user => user.email.endsWith('isqctag.pt')) : [];
 
  useEffect(() => {
    dispatch(getAllProjetos());
  }, [page, search, searchStatus, searchType, sort, projetoFinalizado, DataObjetivoC, dispatch]);
  
  useEffect(() => {
    dispatch(listaUtilizadores());
  }, [dispatch]);
  if (isLoading) {
    return <Loading />;
  }

  const handleAlterado = (alterado) => {
    let alt;
      if(alterado === true){
        alt = verificaAlterado + 1;
        setVerificaAlterado(alt);
      }else{
        alt = verificaAlterado - 1;
        setVerificaAlterado(alt);
      }
  };

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

  // The "<n> projeto(s) <estado> encontrado(s)" sentence is one key per state, so
  // each language can pluralise/agree it in its own way.
  const foundKey =
    projetoFinalizado === true
      ? 'list.foundFinished'
      : DataObjetivoC === true
        ? 'list.foundOngoing'
        : 'list.foundWaiting';

  /* Page header, shared by the empty and populated states.
     The two filters used to be FormRowCheckbox with classNameLabel="col-md-11" and
     classNameInput="col-md-1" — so each label sat 91% of the row away from the
     checkbox it belonged to. They are now compact <label>+<input> pairs, which also
     makes the label itself clickable. */
  const header = (
    <div className="projetos-header">
      <div className="projetos-header-titles">
        <h1>{t('list.title')}</h1>
        <p className="projetos-count">{t(foundKey, { count: totalProjetos })}</p>
      </div>

      <div className="projetos-filters">
        <label className="projetos-filter" htmlFor="Finalizado">
          <input
            id="Finalizado"
            name="Finalizado"
            type="checkbox"
            checked={projetoFinalizado === true}
            onChange={handleChangeCheckbox}
          />
          <span>{t('fields.finished')}</span>
        </label>

        {projetoFinalizado !== true && (
          <label className="projetos-filter" htmlFor="DataObjetivoC">
            <input
              id="DataObjetivoC"
              name="DataObjetivoC"
              type="checkbox"
              checked={DataObjetivoC === true}
              onChange={handleChangeCheckboxDataObjetivo}
            />
            <span>{t('list.hasTargetDate')}</span>
          </label>
        )}
      </div>
    </div>
  );

  if (projetos.length === 0) {
    return (
      <Wrapper>
        {header}

        <EmptyState
          title={t('list.emptyTitle')}
          message={t('list.emptyMessage')}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {header}

      <div className='projetos'>
        <ListaProjetosHeader
          sortValue={sort}
          handleChange={handleSort}
          finalizado={projetoFinalizado}
          utilizadores={formattedListUtilizadores}
        />
        
        {projetos.filter(projeto => projeto.Nome !== "Geral").map(projeto => {
          return <Projeto
            key={projeto._id}
            {...projeto}
            finalizado={projetoFinalizado}
            utilizadores={formattedListUtilizadores}
            handleAlterado={handleAlterado}
          />;
        })}
      </div>
      {verificaAlterado > 0 && (
         <div className='text-center mt-3'>
        <p><b>{t('list.pendingChanges', { count: verificaAlterado })}</b></p>
      </div>
      )}
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default ListaProjetos;
