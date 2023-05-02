import React, { useState , useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Wrapper from '../assets/wrappers/LoginPage';
import { FormRow, FormRowSelect, } from '../components';
import { useNavigate } from 'react-router-dom';


import "../assets/css/signin.css";
import ModalFoto from "./ModalFoto";
import { updateUser } from '../features/utilizadores/utilizadorSlice';
import Loading from './Loading';

const AddUtilizador = () => {
    const { user } = useSelector((store) => store.utilizador);

    const initialState = {
      login: user.user.login,
      password: user.user.password,
      codigo: user.user.codigo,
      email: user.user.email,
      foto: user.user.foto,
      nome: user.user.nome,
      tipo: user.user.tipo,
    };

    const [values, setValues] = useState(initialState);
    const { isLoading } = useSelector((store) => store.utilizador)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let modifiedUser = user;
    if (user != null) {
      modifiedUser = user.user;
    }
  
    if (isLoading) {
      return <Loading />;
    }
    const handleChangeTipo = (e)=> {
      if(e.target.value === "Administrador"){
        e.target.value = 1;
      }else if(e.target.value =="Funcionario"){
        e.target.value = 0 
      }
      handleChange(e);
    }
    const handleChange = (e) => {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    };

    const handleChangeFoto = (name, file) => {
      setValues({
        ...values,
        [name]: { data: file, contentType: "image/png" }
      });
      console.log(values.foto);
    };

  const handleSubmit = (e) => {
      e.preventDefault();
      if (!values.login || !values.email || !values.nome || !values.password ) {
        toast.error('Por favor, preencha todos os campos obrigatórios!');
        return;
      }
      dispatch(updateUser(values));
      //navigate('/');
  };


  const toggleMember = e => {
    // handle form submission logic here
    setValues({ ...values });
  };

    console.log(values.foto)
  return (
    <main style={{ marginBottom: "100px" }}>
      <div className="form-signin w-100 m-auto">
        <h1 className="h3 mb-3 fw-normal">Editar Perfil</h1>
        <form onSubmit = {handleSubmit} className='form'>
          <div className="container">
            <FormRow
              type="text"
              id="nomeUtilizador"
              name="nome"
              label="Nome"
              className="form-control"
              value={values.nome}
              handleChange={handleChange}
              feedbackMessage="Nome"
            />

            <FormRow
              type="text"
              id="loginProjeto"
              name="login"
              label="Login"
              className="form-control"
              value={values.login}
              handleChange={handleChange}
            />

            <FormRow
              type="password"
              id="password"
              name="password"
              label="Password"
              className="form-control"
              value={values.password}
              handleChange={handleChange}
            />

            <FormRow
              type="text"
              id="email"
              name="email"
              label="Email"
              className="form-control"
              value={values.email}
              handleChange={handleChange}
              placeholder="Email"
            />

            <ModalFoto 
              type="file"
              id="fotoU"
              name="foto"
              label="Foto Perfil"
              className="form-control"
              value={values.foto}
              handleChange = {handleChangeFoto}
            />

            <div className="form-group">
              <div id="addUtilizador">
                <button
                  type="submit"
                  disabled={isLoading}
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
  );
}

export default AddUtilizador;