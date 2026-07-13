import { useState, useEffect } from 'react';
import Wrapper from '@/styles/AddProjetoForm';
import { FormRowCheckboxMultiple, FormRowCheckboxListaClientes } from '@/components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createProjeto , getClientes } from '@/features/projetos/projetosSlice';
import { listaUtilizadores, toggleSidebar} from '@/features/utilizadores/utilizadorSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader, SectionCard, FormGroup, AppInput, AppButton, LoadingState } from '@/components/ui';



const initialState = {
  Cliente: '',
  DataInicio: '',
  DataObjetivo: '',
  DataFim: '',
  Notas: '',
  OrcamentoAprovado: '',
  Nome: '',
  Tema: 'Empty',
  Acao: '',
  TipoTrabalho: '',
  Piloto: '',
  Links: '',
  LinkResumo: '',
};

const AddProjectForm = () => {
  const { t } = useTranslation('projetos');
  const [values, setValues] = useState(initialState);
  const { listaClientes } = useSelector((store) => store.projeto);
  //const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const { isLoadingU, utilizadores, listaDeUtilizadores } = useSelector((store) => store.utilizador)
  //const { isLoading } = useSelector((store) => store.projetos);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // //////////////////////////////////////////////////////////////////////////////////
  //useEffect(() => {
  //  dispatch(getTipoTrabalho()).then((res) => {
  //    setListaTipoTrabalho(Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : []);
      //setValues({ ...values, TipoTrabalho: listaTipoTrabalho });
  //  });
  //}, []);

  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(listaUtilizadores());
     
  }, [listaDeUtilizadores]);

  useEffect(() => {
    dispatch(getClientes());
     
  }, [listaClientes]);

  if (isLoadingU) {
    return <LoadingState message={t('common.loading')} />;
  }


  //const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores : [];
  const formattedListUtilizadores = Array.isArray(utilizadores) ? utilizadores.filter(user => user.email.endsWith('isqctag.pt')) : [];



  const handleChange = (e) => {
    const nome = e.target.id;
    const value = e.target.value;
    setValues({ ...values, [nome]: value });
  };

  const handleChangeFormRowSelect = (nome, selectedOptions) => {
 
    if (nome === "Piloto") {
      const strSO = selectedOptions.join(",");
      setValues({ ...values, [nome]: strSO });
    } else if (nome === "TipoTrabalho") {
      const strT = selectedOptions.join(",");
      setValues({ ...values, [nome]: strT });
    } else if (nome === "Cliente" && selectedOptions.length > 1 && selectedOptions !== null) {
      const strC = selectedOptions;
      setValues({ ...values, [nome]: strC });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.Nome || !values.Acao || !values.Cliente || !values.DataInicio || !values.DataObjetivo) {
      const requiredFields = ['Nome', 'Acao', 'Cliente', 'DataInicio', 'DataObjetivo', 'Piloto'];
      const emptyField = requiredFields.find(field => !values[field]);

      if (emptyField) {
        toast.error(
          t('toast.requiredField', {
            field: t(`fieldNames.${emptyField}`, { defaultValue: emptyField }),
          })
        );
      } else {
        toast.error(t('toast.requiredFields'));
      }
      return;
    }

    try {
      const result = await dispatch(createProjeto(values));
      if(!result.error){
        setTimeout(() => {
          dispatch(toggleSidebar(false));
          navigate('/PaginaPrincipal');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
    //navigate('/');
  };
  
  return (
    <Wrapper>
      <div className="form-page">
        <PageHeader title={t('add.title')} divider={false} />
        <SectionCard>
          <form onSubmit={handleSubmit} className="MainForm">
            <FormGroup label={t('fields.name')} htmlFor="Nome">
              <AppInput id="Nome" name="Nome" type="text" placeholder={t('fields.namePlaceholder')} value={values.Nome} onChange={handleChange} />
            </FormGroup>

            <FormGroup label={t('fields.action')} htmlFor="Acao">
              <AppInput id="Acao" name="Acao" type="text" placeholder={t('fields.action')} value={values.Acao} onChange={handleChange} />
            </FormGroup>

            <FormRowCheckboxListaClientes
              type="text"
              className="row mb-3 mt-3 text-center"
              classNameLabel='col-md-3 text-end'
              classNameInput=' checkboxRow'
              classNameResult='col-md-6 text-start'
              classNameLabelResult="col-md-6 text-start"
              id="Cliente"
              name="Cliente"
              placeholder={t('fields.client')}
              labelText={t('fields.clientLabel')}
              value={[values.Cliente]}
              list={listaClientes}
              handleChange={handleChangeFormRowSelect}
              multiple={false}
            />

            <FormGroup label={t('fields.startDate')} htmlFor="DataInicio">
              <AppInput id="DataInicio" name="DataInicio" type="date" value={values.DataInicio} onChange={handleChange} />
            </FormGroup>

            <FormGroup label={t('fields.targetDate')} htmlFor="DataObjetivo">
              <AppInput id="DataObjetivo" name="DataObjetivo" type="date" value={values.DataObjetivo} onChange={handleChange} />
            </FormGroup>

            <FormGroup label={t('fields.notes')} htmlFor="Notas">
              <AppInput id="Notas" name="Notas" type="text" placeholder={t('fields.notes')} value={values.Notas} onChange={handleChange} />
            </FormGroup>

            <FormGroup label={t('fields.linkA3')} htmlFor="Links">
              <AppInput id="Links" name="Links" type="text" placeholder={t('fields.linkA3')} value={values.Links} onChange={handleChange} />
            </FormGroup>

            <FormGroup label={t('fields.linkSummary')} htmlFor="LinkResumo">
              <AppInput id="LinkResumo" name="LinkResumo" type="text" placeholder={t('fields.linkSummary')} value={values.LinkResumo} onChange={handleChange} />
            </FormGroup>

            <FormRowCheckboxMultiple
              type="text"
              className="row mb-3 mt-3 text-center"
              classNameLabel='col-md-3 text-end'
              classNameInput=' checkboxRow'
              classNameResult='col-md-6 text-start'
              classNameLabelResult="col-md-6 text-start"
              id="piloto"
              name="Piloto"
              placeholder={t('fields.pilot')}
              labelText={t('fields.pilotLabel')}
              value={[values.Piloto]}
              list={formattedListUtilizadores}
              handleChange={handleChangeFormRowSelect}
              multiple={true}
            />

            {values.errorMessage && (
              <p style={{ color: 'var(--red-dark)' }}>{values.errorMessage}</p>
            )}

            <AppButton type="submit" fullWidth>
              {t('add.submit')}
            </AppButton>
          </form>
        </SectionCard>
      </div>
    </Wrapper>
  );
}

export default AddProjectForm;

//{isLoading ? 'loading...' : 'submit'}