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
    if (result.payload.user) {
        setTimeout(() => {
        window.location.reload(navigate('/PaginaPrincipal'));
        }, 2000);
        return;
    } else {
      return;
    }
  };

  useEffect(() => {
    if (user) {
        navigate('/PaginaPrincipal');
    }
  }, [user]);

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
