import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// import axios from 'axios';
import { updatePassword } from '../features/utilizadores/utilizadorSlice';
import { useDispatch } from 'react-redux';
import { FormRow, Header, Footer } from '../components';
import Wrapper from '../assets/wrappers/LoginPage';
import { useNavigate } from 'react-router-dom';

const ForgetPasswordChange = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords não equivalem.');
      return;
    }
    if (password.length < 6) {
      setMessage('Insira pelo menos 6 caracteres!');
      return;
    }
    try {


      const result = await dispatch(updatePassword({ token, password }));
      if (!result.error) {
        setMessage(`Password Alterada`);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }
    } catch (error) {
      setMessage('Ocorreu um erro ao mudar a password');
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <Header />
      <div className='MainLogin'>
        <h1 className='mt-5 title'>Alterar Password</h1>
        <form className='loginForm' onSubmit={handleSubmit}>
          <p className='mb-3'>{message}</p>

          <FormRow
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            type='password'
            name='password'
            labelText='Nova Password:'
            value={password}
            handleChange={handlePasswordChange}
            required="True" />

          <FormRow
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            type='password'
            name='Confirmpassword'
            labelText='Confirmar Password:'
            value={confirmPassword}
            handleChange={handleConfirmPasswordChange}
            required="True"
          />

          <button type='submit' className='btn btn-outline-primary'>
            Alterar Password
          </button>
        </form>

      </div>
      <Footer />
    </Wrapper>
  );
};

export default ForgetPasswordChange;
