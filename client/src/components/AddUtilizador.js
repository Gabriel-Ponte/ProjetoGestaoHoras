import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Wrapper from '../assets/wrappers/AddUser';
import { FormRow, FormRowSelectTipo } from '../components';
import { useNavigate } from 'react-router-dom';

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
    const { user } = useSelector((store) => store.utilizador.user);
    //const { isLoading } = useSelector((store) => store.projetos);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      if (user && user.tipo === 1) {
        toast.error("Sem permissões para aceder a esta página!")
        navigate('/PaginaPrincipal');
      }
    }, [user, navigate]);
    
    if (isLoading) {
      return <Loading />;
    }

    const handleChangeTipo = (e)=> {
      const { name, value } = e.target;
      if(value === "Administrador"){
        e.target.value = 2;
        setValues({ ...values, [name]: 2 });
      }else if(value =="Funcionario"){
        e.target.value = 1;
        setValues({ ...values, [name]: 1 });
      }
    }

    const handleChangeFoto = (name ,file) => {
      console.log(file);
      //const imageUrl = URL.createObjectURL(file);
      //console.log(imageUrl);

      setValues({ ...values, [name]:  { data: file, contentType: "image/png"} });
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
    <Wrapper>
    <main style={{ marginBottom: "100px" }}>
      <div className="form-signin w-100 m-auto">
        <h1 className="h3 mb-3 fw-normal text-center">Criar Utilizador</h1>
        <p className='text-center'>Preencha o formulario para criar uma conta.</p>
        <form onSubmit = {handleSubmit} className='form'>

          <div className="container">
            <FormRow
              type="text"
              id="nomeUtilizador"
              name="nome"
              label="Nome"
              labelText="Nome"
              className="form-control"
              value={values.nome}
              handleChange={handleChange}
              feedbackMessage="Nome"
            />
            {/* TIPO */}
            <FormRowSelectTipo
                type="text"
                className="form-control"
                id="tipo"
                name ="tipo"
                labelText="Tipo de Utilizador"
                value= {values.tipo}
                list = {[["Funcionario"], ["Administrador"] ]}
                handleChange ={handleChangeTipo}            
            />


            <FormRow
              type="text"
              id="loginProjeto"
              name="login"
              label="Login"
              labelText="Login"
              className="form-control"
              value={values.login}
              handleChange={handleChange}
            />

            <FormRow
              type="password"
              id="password"
              name="password"
              label="Password"
              labelText="Password"
              className="form-control"
              value={values.password}
              handleChange={handleChange}
            />

            <FormRow
              type="text"
              id="email"
              name="email"
              label="Email"
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
              labelText="Foto de Perfil"
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
                  {isLoading ? 'Carregando...' : 'Adicionar'}
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

export default AddUtilizador;