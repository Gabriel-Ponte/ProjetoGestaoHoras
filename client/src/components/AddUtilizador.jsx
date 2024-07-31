import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Wrapper from '../assets/wrappers/AddUser';
import { FormRow, FormRowSelect, FormRowSelectTipo } from '../components';
import { useNavigate } from 'react-router-dom';
import ModalFoto from "./ModalFoto";
import { listaUsersTipo, listaUtilizadores, registerUser } from '../features/utilizadores/utilizadorSlice';
import Loading from './Loading';
//import DefaultUserImg from "../assets/image/DefaultUserImg.png";

const  initialState = {
    login: '',
    password: '',
    email: '',
    foto: '',
    nome: '',
    tipo: 1,
    estado: true,
    responsavel: '',
  };


const AddUtilizador = () => {
    const [values, setValues] = useState(initialState);
    const { isLoading } = useSelector((store) => store.utilizador)
    const { user } = useSelector((store) => store.utilizador.user);
    const [listaUserTipo , setListaUserTipo]  = useState([]);
    const [listTipoUser , setListTipoUser]  = useState([]);
    //const { isLoading } = useSelector((store) => store.projetos);
    const navigate = useNavigate();
    const dispatch = useDispatch();



  useEffect(() => {
    if (user && (user?.tipo === 1 )) {
      toast.error("Sem permissões para aceder a esta página!");
      navigate('/PaginaPrincipal');
    }else if (user && (user?.tipo === 3 || user?.tipo === 4)){
      toast.error("Sem permissões para aceder a esta página!");
      navigate('/PaginaAdicionarHoras');
    }
  }, [user, navigate]);
    
    if (isLoading) {
      return <Loading />;
    }
    

    useEffect(() => {
      let listTipo = []
      if(user.tipo === 2){
        listTipo =  [["Engenharia de Processos"], ["Laboratorio"] ,["Recursos Humanos"] , ["Administrador"], ["Administrador Engenharia"] , ["Administrador Laboratorio"], ["Administrador Recursos Humanos"]];
        setValues({ ...values, 'tipo': 1 });
      }else if (user.tipo === 5){

        dispatch(listaUsersTipo(5)).then((res) => {
          const listaUtilizadorsTipo = Array.isArray(res?.payload?.UsersAllTipo) ? res.payload.UsersAllTipo : [];
            setListaUserTipo(listaUtilizadorsTipo)
            
            const foundUser = listaUtilizadorsTipo.find(item => item._id === user.id);
            const id0 = foundUser ? foundUser?._id : listaUtilizadorsTipo[0]?._id ? listaUtilizadorsTipo[0]?._id : '';

          setValues({ ...values,  'tipo': 1, 'responsavel': id0 });
        })

        listTipo =  [["Engenharia de Processos"], ["Administrador Engenharia"]];

      }else if (user.tipo === 6){
        dispatch(listaUsersTipo(6)).then((res) => {
          const listaUtilizadorsTipo = Array.isArray(res?.payload?.UsersAllTipo) ? res.payload.UsersAllTipo : [];
            setListaUserTipo(listaUtilizadorsTipo)
            
            const foundUser = listaUtilizadorsTipo.find(item => item._id === user.id);
            const id0 = foundUser ? foundUser?._id : listaUtilizadorsTipo[0]?._id ? listaUtilizadorsTipo[0]?._id : '';
          setValues({ ...values,  'tipo': 3, 'responsavel': id0 });
        })

        listTipo =  [["Laboratorio"], ["Administrador Laboratorio"]];
      }else if (user.tipo === 7){
        listTipo =  [["Recursos Humanos"], ["Administrador Recursos Humanos"]];
        setValues({ ...values, 'tipo': 4 });
      }

      setListTipoUser(listTipo);
    }, []);


    const handleChangeTipo = (e)=> {
      const { name, value } = e.target;


      let valTipo = 0;
      let target = 0;
      if(value === "Engenharia de Processos"){
        target = 1;
        valTipo = 5;
        setValues({ ...values, [name]: 1 });

      }else if(value === "Laboratorio"){
        target = 3;
        valTipo = 6;
        setValues({ ...values, [name]: 3 });

      }else if(value === "Recursos Humanos"){
        target = 4;
        valTipo = 7;
        setValues({ ...values, [name]: 4 });
      }else if(value === "Administrador Engenharia"){
        target = 5;
        setValues({ ...values, [name]: 5 });
      }
      else if(value === "Administrador Laboratorio"){
        target = 6;
        setValues({ ...values, [name]: 6 });
      }  else if(value === "Administrador Recursos Humanos"){
        target = 7;
        setValues({ ...values, [name]: 7 });
      }else if(value === "Administrador"){
        target = 2;
        setValues({ ...values, [name]: 2 });
      }
      if(valTipo > 0){
        dispatch(listaUsersTipo(valTipo)).then((res) => {
          const listaUtilizadorsTipo = Array.isArray(res?.payload?.UsersAllTipo) ? res.payload.UsersAllTipo : [];
           setListaUserTipo(listaUtilizadorsTipo)

           const foundUser = listaUtilizadorsTipo.find(item => item._id === user.id);
           const id0 = foundUser ? foundUser?._id : listaUtilizadorsTipo[0]?._id ? listaUtilizadorsTipo[0]?._id : '';

          setValues({ ...values, [name]: target, 'responsavel': id0 });
         })
      }else{
        setValues({ ...values, [name]: target, 'responsavel': '' });
        setListaUserTipo([])
      }
    }


    const handleResponsavel = (e)=> {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });

    }
  

    const handleChangeFoto = (name ,file) => {
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
        console.error(error);
      }
  };

  
  const toggleMember = () => {
    // handle form submission logic here
    setValues({ ...values });
  };



  return (
    <Wrapper>
    <main style={{ marginBottom: "100px" }}>
      <div className="form-signin m-auto">
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
                list = {listTipoUser}
                handleChange ={handleChangeTipo}            
            />
    
          {/*RESPONSAVEL*/}
          {values.tipo === 3 &&
            <FormRowSelectTipo
                  type="text"
                  className="form-control"
                  id="responsavel"
                  name ="responsavel"
                  labelText="Responsavel"
                  value= {values?.responsavel}
                  list = {listaUserTipo}
                  handleChange ={handleResponsavel}            
              />
          }

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
              autocomp= ""
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