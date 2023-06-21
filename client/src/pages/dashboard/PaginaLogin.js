import { useState, useEffect } from 'react';
import { FormRow } from '../../components';
import Wrapper from '../../assets/wrappers/LoginPage';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/utilizadores/utilizadorSlice';
import { useNavigate } from 'react-router-dom';

const initialState = {
  login: '',
  password: '',
  errorMessage: '',
};

function Login(){
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const login = e.target.login;
    const value = e.target.value;

    setValues({ ...values, [login]: value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { login, password } = values;
    if (!login || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
      dispatch(loginUser({ login: login, password: password }));
      return;
  };


  const toggleMember = () => {
    setValues({ ...values });
  };
  useEffect(() => {
  if (user) {
    setTimeout(() => {
      navigate('/PaginaPrincipal');
    }, 2000);
  }
}, [user]);

return (
  <Wrapper className='full-page'>
  <form onSubmit={onSubmit}>
  <FormRow
        type="text"
        className="form-control"
        id="valorLogin"
        name="login"
        placeholder="Login"
        value={values.login}
        handleChange={handleChange}
    />
  <FormRow
        type="password"
        className="form-control"
        id="valorPassword"
        name="password"
        placeholder="Password"
        value={values.password}
        handleChange={handleChange}
    />


    <div id="loginButton">
    <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'loading...' : 'submit'}
        </button>
      <button type='button' onClick={toggleMember} className="w-100 btn btn-lg btn-primary">
        Login
      </button>
    </div>
    <div style={{ color: 'red' }}>{values.errorMessage}</div>
  </form>
  </Wrapper>
);

}

export default Login;
