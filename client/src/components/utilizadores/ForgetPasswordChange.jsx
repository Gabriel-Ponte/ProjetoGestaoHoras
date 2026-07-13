import { useState } from 'react';
import { useParams } from 'react-router-dom';
// import axios from 'axios';
import { updatePassword } from '@/features/utilizadores/utilizadorSlice';
import { useDispatch } from 'react-redux';
import { FormRow, Header, Footer } from '@/components';
import Wrapper from '@/styles/LoginPage';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgetPasswordChange = () => {
  const { t } = useTranslation('auth');
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
      setMessage(t('changePassword.mismatch'));
      return;
    }
    if (password.length < 6) {
      setMessage(t('changePassword.tooShort'));
      return;
    }
    try {


      const result = await dispatch(updatePassword({ token, password }));
      if (!result.error) {
        setMessage(t('changePassword.success'));
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }
    } catch (error) {
      setMessage(t('changePassword.error'));
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <Header />
      <div className='MainLogin'>
        <h1 className='mt-5 title'>{t('changePassword.title')}</h1>
        <form className='loginForm' onSubmit={handleSubmit}>
          <p className='mb-3'>{message}</p>

          <FormRow
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            type='password'
            name='password'
            labelText={t('changePassword.newPasswordLabel')}
            value={password}
            handleChange={handlePasswordChange}
            required="True" />

          <FormRow
            className="row mb-3 text-center" 
            classNameLabel='col-md-3 text-end' 
            classNameInput='col-md-9'
            type='password'
            name='Confirmpassword'
            labelText={t('changePassword.confirmPasswordLabel')}
            value={confirmPassword}
            handleChange={handleConfirmPasswordChange}
            required="True"
          />

          <button type='submit' className='btn btn-outline-primary'>
            {t('changePassword.submit')}
          </button>
        </form>

      </div>
      <Footer />
    </Wrapper>
  );
};

export default ForgetPasswordChange;
