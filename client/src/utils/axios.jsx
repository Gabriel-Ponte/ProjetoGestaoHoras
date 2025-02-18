import axios from 'axios';
import { clearStore } from '../features/utilizadores/utilizadorSlice';
import { getUserFromLocalStorage } from './localStorage';
//import { rejectWithValue } from '@reduxjs/toolkit';

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_FOLDER_URL,
});

customFetch.interceptors.request.use((config) => {
  try {
    const utilizador = getUserFromLocalStorage();
    if (utilizador && utilizador.user && utilizador.user.token) {
      config.headers['Authorization'] = `Bearer ${utilizador.user.token}`;
    }

    config.headers['Content-Type'] = 'application/json; charset=utf-8';
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

  const errorFinal = error.response?.data?.error ?? error.response?.data?.msg ?? 'Ocorreu um erro!';
  return thunkAPI.rejectWithValue(errorFinal);
};

export default customFetch;
