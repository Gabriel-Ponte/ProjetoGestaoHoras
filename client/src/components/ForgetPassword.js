import React, { useState } from 'react';
import { resetPassword} from "../features/utilizadores/utilizadorSlice";
import { useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/LoginPage';
import { FormRow, Header, Footer } from '../components';
import { useDispatch } from 'react-redux';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const result = await dispatch(resetPassword(email));
      if(!result.error){
        setMessage(`Um email para resetar a password foi enviado para ${email}`);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }else{   
      setMessage(result.payload);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVoltar = ()=>{
        navigate('/PaginaVisualizarProjeto');
  }
  return (
    <Wrapper >
        <Header />
    <div className='MainLogin'>
        
      <h2 className='mt-5 title'>Repor Password</h2>

      <form className='loginForm' onSubmit={handleSubmit}>
        <p>Insira o Email associado á sua conta!</p>
      {message && <p className='mb-2'>{message}</p>}

      <FormRow 
      className="row mb-3 text-center" 
      classNameLabel='col-md-3 text-end' 
      classNameInput='col-md-9'
      type='email' 
      name='email' 
      labelText='Email:' 
      value={email} 
      handleChange={handleEmailChange} 
      required="True"
      />
  
      <button type='submit' className='btn btn-outline-primary'>
              Reset Password
      </button>
        <button type="button" className='btn btn-outline-secondary' onClick={handleVoltar}>Voltar</button>
      </form>
    </div>
    <Footer/>
    </Wrapper>
  );
};

export default ForgetPassword;
