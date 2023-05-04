import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Wrapper from '../assets/wrappers/LoginPage';
import { FormRow, FormRowSelect, } from '../components';



import "../assets/css/signin.css";
import ModalFoto from "./ModalFoto";
import { registerUser } from '../features/utilizadores/utilizadorSlice';
import Loading from './Loading';

const initialState = {
    login: '',
    password: '',
    email: '',
    foto: "DefaultUserImg",
    nome: '',
    tipo: 1,
  };

const AddUtilizador = () => {
    const [values, setValues] = useState(initialState);
    const { isLoading } = useSelector((store) => store.utilizador)

    const dispatch = useDispatch();
  

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

    const handleChangeFoto = (name ,file) => {
      console.log(file);
      //const imageUrl = URL.createObjectURL(file);
      //console.log(imageUrl);

      setValues({ ...values, [name]: file });
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    };



  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!values.login || !values.email || !values.nome) {
        toast.error('Por favor, preencha todos os campos obrigatórios!');
        return;
      }
      try {
        const result = await dispatch(registerUser(values));
        if(!result.error){
          setTimeout(() => {
            setValues(initialState);
          }, 4000);
        }
      } catch (error) {
        console.log(error);
      }
  };

  const toggleMember = e => {
    // handle form submission logic here
    setValues({ ...values });
  };

  return (
    <main style={{ marginBottom: "100px" }}>
      <div className="form-signin w-100 m-auto">
        <h1 className="h3 mb-3 fw-normal">Criar Utilizador</h1>
        <p>Preencha o formulario para criar uma conta.</p>
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
            {/* TIPO
            <FormRowSelect 
                type="text"
                className="form-control"
                id="tipo"
                name ="tipo"
                placeholder ="Escolha um tipo"
                value= {values.tipo}
                list = {[["Administrador"] , ["Funcionario"]]}
                handleChange ={handleChangeTipo}            
            />
            */}

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
                  {isLoading ? 'loading...' : 'submit'}
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