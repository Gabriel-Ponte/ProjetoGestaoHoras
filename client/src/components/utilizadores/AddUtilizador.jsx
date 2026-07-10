import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Wrapper from '@/styles/AddUser';
import { FormRowSelectTipo } from '@/components';
import ModalFoto from "@/components/utilizadores/ModalFoto";
import { listaUsersTipo, registerUser } from '@/features/utilizadores/utilizadorSlice';
import { PageHeader, SectionCard, FormGroup, AppInput, AppButton, LoadingState } from '@/components/ui';
//import DefaultUserImg from "@/assets/image/DefaultUserImg.png";

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
    const dispatch = useDispatch();



    if (isLoading) {
      return <LoadingState message="A carregar…" />;
    }
    

    useEffect(() => {
      let listTipo = []
      if(user.tipo === 2 || user.tipo === 7){
        listTipo =  [["Engenharia de Processos"], ["Laboratorio"] 
        ,["Recursos Humanos"], ["Responsavel Qualidade"], ["Gestor Financeiro"], ["Comercial"] , ["Logistica"],
         ["Administrador"], ["Administrador Engenharia"] ,["Administrador Laboratorio"], ["Administrador Recursos Humanos"]
        ];
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
      }
      // else if (user.tipo === 7){
      //   listTipo =  [["Recursos Humanos"], ["Administrador Recursos Humanos"]];
      //   setValues({ ...values, 'tipo': 4 });
      // }

      setListTipoUser(listTipo);
    }, []);


    const handleChangeTipo = (e)=> {
      const { name, value } = e.target;

      // Target 8 = Inativo
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

      else if(value === "Responsavel Qualidade"){
        target = 9;
        setValues({ ...values, [name]: 2 });
      }

      else if(value === "Gestor Financeiro"){
        target = 10;
        setValues({ ...values, [name]: 2 });
      }

      else if(value === "Comercial"){
        target = 11;
        setValues({ ...values, [name]: 2 });
      }

      else if(value === "Logistica"){
        target = 12;
        setValues({ ...values, [name]: 2 });
      }



      // ,["Responsavel Qualidade"], ["Gestor Fianceiro"], ["Comercial"] , ["Logistica"]];
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

  return (
    <Wrapper>
      <div className="form-page">
        <PageHeader
          title="Criar Utilizador"
          subtitle="Preencha o formulário para criar uma conta."
          divider={false}
        />
        <SectionCard>
          <form onSubmit={handleSubmit} className="form">
            <FormGroup label="Nome" htmlFor="nomeUtilizador">
              <AppInput
                id="nomeUtilizador"
                name="nome"
                type="text"
                value={values.nome}
                onChange={handleChange}
              />
            </FormGroup>

            {/* TIPO */}
            <FormRowSelectTipo
              type="text"
              className="form-control"
              id="tipo"
              name="tipo"
              labelText="Tipo de Utilizador"
              value={values.tipo}
              list={listTipoUser}
              handleChange={handleChangeTipo}
            />

            {/* RESPONSAVEL */}
            {values.tipo === 3 && (
              <FormRowSelectTipo
                type="text"
                className="form-control"
                id="responsavel"
                name="responsavel"
                labelText="Responsavel"
                value={values?.responsavel}
                list={listaUserTipo}
                handleChange={handleResponsavel}
              />
            )}

            <FormGroup label="Login" htmlFor="loginProjeto">
              <AppInput
                id="loginProjeto"
                name="login"
                type="text"
                value={values.login}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup label="Password" htmlFor="password">
              <AppInput
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup label="Email" htmlFor="email">
              <AppInput
                id="email"
                name="email"
                type="email"
                placeholder="nome@empresa.pt"
                value={values.email}
                onChange={handleChange}
              />
            </FormGroup>

            <ModalFoto
              type="file"
              id="fotoU"
              name="foto"
              label="Foto de Perfil"
              labelText="Foto de Perfil"
              className="form-control"
              value={values.foto}
              handleChange={handleChangeFoto}
            />

            {values.errorMessage && (
              <p style={{ color: 'var(--red-dark)' }}>{values.errorMessage}</p>
            )}

            <AppButton type="submit" fullWidth loading={isLoading} disabled={isLoading}>
              {isLoading ? 'A criar…' : 'Adicionar'}
            </AppButton>
          </form>
        </SectionCard>
      </div>
    </Wrapper>
  );
}

export default AddUtilizador;