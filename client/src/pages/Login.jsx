import { useState, useEffect } from 'react';
import { FormRow, Header, Footer } from '../components';
import Wrapper from '../assets/wrappers/LoginPage';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/utilizadores/utilizadorSlice';
import { useNavigate } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

function Login() {
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = values;
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
    const result = await dispatch(loginUser({ email, password }));
    if (result?.payload?.user) {
        if(result.payload.user.tipo === 3 || result.payload.user.tipo === 4 || result.payload.user.tipo === 6 || result.payload.user.tipo === 9  || result.payload.user.tipo === 10 || result.payload.user.tipo === 11 || result.payload.user.tipo === 12  ){
          setTimeout(() => {
            window.location.reload(navigate('/PaginaAdicionarHoras'));
            }, 2000);
            return;
        }else{
        setTimeout(() => {
        window.location.reload(navigate('/PaginaPrincipal'));
        }, 2000);
        return;
      }
    } else {
      toast.error('Valores inseridos incorretos!');
      return;
    }
  };

  useEffect(() => {

    if (user) {
      if(user.user.tipo === 3 || user.user.tipo === 4 || user.user.tipo === 6 || user.user.tipo === 9  || user.user.tipo === 10 || user.user.tipo === 11 || user.user.tipo === 12  ){
          navigate('/PaginaAdicionarHoras');
          return;
      }else{
        navigate('/PaginaPrincipal');
      return;
    }
    }
  }, [user, navigate]);

const handleForget =()=>{
  navigate('/PaginaResetPassword');
}
  return (
    <Wrapper className='full-page'>
      <Header />
      <div className="MainLogin">
        <h1 className='mt-5 title'>Gestão Horas</h1>
        <form className='loginForm' onSubmit={onSubmit}>
          <h3 className='mb-5'>{'Login'}</h3>
          
          {/* email field */}
          <FormRow 
          className="row mb-3 text-center" 
          classNameLabel='col-md-3 text-end' 
          classNameInput='col-md-9'
          type='email' 
          name='email' 
          labelText='Email:' 
          value={values.email} 
          autocomp='@isqctag.pt'
          handleChange={handleChange} 
          required="True"
          />
          
          {/* password field */}
          <FormRow 
          className="row mb-3 text-center" 
          classNameLabel='col-md-3 text-end' 
          classNameInput='col-md-9'
          type='password' 
          name='password' 
          autocomp='off'
          labelText='Password:' 
          value={values.password} 
          handleChange={handleChange} 
          required="True"
          />

          <div className='row'>
          <button 
          type='button' 
          className='buttonP btn btn-link' 
          onClick={handleForget} 
          disabled={isLoading}>
            {isLoading ? 'loading...' : 'Repor password'}
          </button>
          </div>
          <button type='submit' className='btn btn-outline-primary' disabled={isLoading}>
            {isLoading ? 'loading...' : 'Submeter'}
          </button>
        </form>
      </div>
      <Footer />
    </Wrapper>
  );
}

export default Login;
