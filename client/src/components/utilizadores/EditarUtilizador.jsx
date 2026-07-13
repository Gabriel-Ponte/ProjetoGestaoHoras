import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FormRow } from '@/components';
import { useNavigate } from 'react-router-dom';
import ModalFoto from "@/components/utilizadores/ModalFoto";
import Wrapper from '@/styles/AddUser';
import { updateUser, toggleSidebar } from '@/features/utilizadores/utilizadorSlice';
import Loading from '@/components/common/Loading';
import { AppButton } from '@/components/ui';

const EditarUtilizador = () => {
    const { t } = useTranslation('utilizadores');
    const { user } = useSelector((store) => store.utilizador);
    const initialState = {
      _id: user.user.id,
      login: user.user.login,
      password: user.user.password,
      codigo: user.user.codigo,
      email: user.user.email,
      foto: user.user.foto,
      nome: user.user.nome,
      tipo: user.user.tipo,
      estado:true,
    };

    const [values, setValues] = useState(initialState);
    const [alterado, setAlterado] = useState(false);
    const { isLoading } = useSelector((store) => store.utilizador)
    const dispatch = useDispatch();
    const navigate = useNavigate();

  
    if (isLoading) {
      return <Loading />;
    }
    /*
    const handleChangeTipo = (e)=> {
      if(e.target.value === "Administrador"){
        e.target.value = 1;
      }else if(e.target.value === "Funcionario"){
        e.target.value = 0 
      }
      handleChange(e);
    }
    */

    const handleChange = async(e) => {

      setAlterado(true);
      const { name, value } = e.target;
      if(values.foto.data.data){
        const nameFoto ="foto"
        const novaFoto = new Uint8Array(values.foto.data.data);
        await setValues({
          ...values,
          [name]: value,
          [nameFoto]: { data: novaFoto, contentType: "image/png" }
        });
      }else {
        await setValues({ ...values, [name]: value });
      }
      if (
        JSON.stringify({ ...values, [name]: value }) ===
        JSON.stringify({
          ...initialState,
          foto: { data: new Uint8Array(initialState.foto.data.data), contentType: "image/png" },
        })
      ) {
        setAlterado(false);
        return;
      }
    };

    const handleChangeFoto = (name, file) => {
      setAlterado(true);
      setValues({
        ...values,
        [name]: { data: file, contentType: "image/png" }
      });
    };

  const handleSubmit = async(e) => {
      e.preventDefault();
      if (!values.login || !values.email || !values.nome || !values.password ) {
        toast.error(t('toast.requiredFields'));
        return;
      }
      if(values.password.length < 6){
        toast.error(t('toast.passwordTooShort'));
        return;
      }

      try {
       const result = await dispatch(updateUser(values));
        if (!result.error) {
          setTimeout(() => {
            dispatch(toggleSidebar(false));
            window.location.reload(navigate('/PaginaPrincipal'));
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
  };


  const toggleMember = () => {
    setValues({ ...values });
  };


  return (
    <Wrapper>
    <main >
      <div className="form-signin w-100 m-auto" >
        <h1 className="h3 mb-4 fw-normal text-center">{t('edit.title')}</h1>
        <form onSubmit = {handleSubmit} className='form'>
          <div className="container">
            <FormRow
              type="text"
              id="nomeUtilizador"
              name="nome"
              labelText={t('form.name')}
              className="form-control"
              value={values.nome}
              handleChange={handleChange}
              feedbackMessage={t('form.name')}
            />

            <FormRow
              type="text"
              id="loginProjeto"
              name="login"
              labelText={t('form.login')}
              className="form-control"
              value={values.login}
              handleChange={handleChange}
            />

            <FormRow
              type="password"
              id="password"
              name="password"
              labelText={t('form.password')}
              className="form-control"
              value={values.password}
              handleChange={handleChange}
            />

            <FormRow
              type="text"
              id="email"
              name="email"
              labelText={t('form.email')}
              className="form-control"
              value={values.email}
              handleChange={handleChange}
              placeholder={t('form.email')}
            />

            <ModalFoto 
              type="file"
              id="fotoU"
              name="foto"
              label={t('form.profilePhoto')}
              className="form-control"
              value={values.foto}
              handleChange = {handleChangeFoto}
            />

            <div className="form-group">
              <div id="addUtilizador">
                <AppButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading || !alterado}
                  onClick={toggleMember}
                >
                  {t('edit.submit')}
                </AppButton>
              </div>
              <div style={{ color: 'red' }}>{values.errorMessage}</div>
            </div>
          </div>
        </form>
      </div>
    </main>
    </Wrapper>
  );
}

export default EditarUtilizador;