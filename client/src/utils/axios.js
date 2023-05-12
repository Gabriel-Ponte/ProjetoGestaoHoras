import axios from 'axios';
import { clearStore } from '../features/utilizadores/utilizadorSlice';
import { getUserFromLocalStorage } from './localStorage';

const customFetch = axios.create({
  //baseURL: 'http://localhost:8080/',
  baseURL: 'http://10.100.251.5:8080/',
});

customFetch.interceptors.request.use((config) => {
  try {
    const utilizador = getUserFromLocalStorage();
    if (utilizador && utilizador.user && utilizador.user.token) {
      config.headers['Authorization'] = `Bearer ${utilizador.user.token}`;
      //config.headers.common['Authorization'] = `Bearer ${utilizador.user.token}`;
    }
  } catch (error) {
    console.error('Error retrieving user from local storage:', error);
  }
  return config;
});

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    console.log(error);
    console.log(thunkAPI);
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
  }
  return thunkAPI.rejectWithValue(error.response?.data?.msg || 'An error occurred');
};

export default customFetch;
