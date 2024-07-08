import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FormRow } from '.';
import { useNavigate } from 'react-router-dom';
import ModalFoto from "./ModalFoto";
import Wrapper from '../assets/wrappers/AddUser';
import { updateUser, toggleSidebar } from '../features/utilizadores/utilizadorSlice';
import Loading from './Loading';

const EditarUtilizador = () => {
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
        toast.error('Por favor, preencha todos os campos obrigatórios!');
        return;
      }
      if(values.password.length < 6){
        toast.error('Password necessita ter pelo menos 6 caracteres!');
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
        <h1 className="h3 mb-4 fw-normal text-center">Editar Perfil</h1>
        <form onSubmit = {handleSubmit} className='form'>
          <div className="container">
            <FormRow
              type="text"
              id="nomeUtilizador"
              name="nome"
              labelText="Nome"
              className="form-control"
              value={values.nome}
              handleChange={handleChange}
              feedbackMessage="Nome"
            />

            <FormRow
              type="text"
              id="loginProjeto"
              name="login"
              labelText="Login"
              className="form-control"
              value={values.login}
              handleChange={handleChange}
            />

            <FormRow
              type="password"
              id="password"
              name="password"
              labelText="Password"
              className="form-control"
              value={values.password}
              handleChange={handleChange}
            />

            <FormRow
              type="text"
              id="email"
              name="email"
              labelText="Email"
              className="form-control"
              value={values.email}
              handleChange={handleChange}
              placeholder="Email"
            />

            <ModalFoto 
              type="file"
              id="fotoU"
              name="foto"
              label="Foto de Perfil"
              className="form-control"
              value={values.foto}
              handleChange = {handleChangeFoto}
            />

            <div className="form-group">
              <div id="addUtilizador">
                <button
                  type="submit"
                  disabled={isLoading || !alterado}
                  onClick={toggleMember}
                  className="w-100 btn btn-lg btn-primary"
                >
                  {isLoading ? 'Carregar...' : 'Alterar'}
                </button>
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