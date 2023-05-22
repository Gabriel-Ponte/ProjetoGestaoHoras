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
      toast.error('Please fill out all fields');
      return;
    }
    const result = await dispatch(loginUser({ email, password }));
    if (result.payload.user) {
        console.log(user);
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


  return (
    <Wrapper className='full-page'>
      <Header />
      <div className="MainLogin">
      <h1>Gestão Horas</h1>
      <form className='loginForm' onSubmit={onSubmit}>
        <h3>{'Login'}</h3>
        {/* email field */}
        <FormRow className="formRow" classNameLabel='formRowLabel' classNameInput='formRowInput'
        type='email' name='email' value={values.email} handleChange={handleChange} />
        {/* password field */}
        <FormRow className="formRow" classNameLabel='formRowLabel' classNameInput='formRowInput' 
        type='password' name='password' value={values.password} handleChange={handleChange} />
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'loading...' : 'submit'}
        </button>
      </form>
      </div>
      <Footer />
    </Wrapper>
  );
}

export default Login;
