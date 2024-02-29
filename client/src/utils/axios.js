import axios from 'axios';
import { clearStore } from '../features/utilizadores/utilizadorSlice';
import { getUserFromLocalStorage } from './localStorage';
//import { rejectWithValue } from '@reduxjs/toolkit';

const customFetch = axios.create({
  baseURL: 'http://localhost:8080/',
  //baseURL: 'http://192.168.10.49:8080/',
});

customFetch.interceptors.request.use((config) => {
  try {
    const utilizador = getUserFromLocalStorage();
    if (utilizador && utilizador.user && utilizador.user.token) {
      config.headers['Authorization'] = `Bearer ${utilizador.user.token}`;
    }
  } catch (error) {
    console.error('Erro ao obter utilizador da Local Storage:', error);
  }
  return config;
});

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue('Não autorizado! A fazer Logout...');
  }
  return thunkAPI.rejectWithValue(error.response?.data?.error || 'Ocorreu um erro!');
};

export default customFetch;
