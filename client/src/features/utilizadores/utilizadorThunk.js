import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from '../projetos/projetosSlice';
import { logoutUser } from './utilizadorSlice';



export const showAllUtilizadores = async (_, thunkAPI) => {
    try {
      const resp = await customFetch.get('/utilizador');
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };
  
export const registerUserThunk = async (url, user, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, user);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const updateResetedPasswordThunk = async (  thunkAPI, values ) => {
  try {
    const resp = await customFetch.post(`/inicio/updateResetedPassword/`,values);
    return resp.data;

  } catch (error) {
    console.log("ERROR Updating" , error)
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const postResetPasswordThunk = async (  url, email ,thunkAPI) => {
  try {
    const resp = await customFetch.post(`/inicio/resetPassword/${email}`);
    return resp.data;

  } catch (error) {

    return checkForUnauthorizedResponse(error ,thunkAPI);
  }
};
export const getUtilizadorThunk = async ( thunkAPI, utilizadorId ) => {
  try {
    const resp = await customFetch.get(`/utilizador/${utilizadorId}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const loginUserThunk = async (url, user, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, user);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const deleteUserThunk = async (thunkAPI, utilizadorId) => {
  try {
    const resp = await customFetch.delete(`/utilizador/${utilizadorId}`);
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const updateUserThunk = async (url, user, thunkAPI) => {
  try {
    const resp = await customFetch.patch(url, user);
    return resp.data;

  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};


export const updateUserTypeThunk = async (url, user, thunkAPI) => {
  try {
    const resp = await customFetch.patch(url, user);
    return resp.data;

  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const clearStoreThunk = async (message, thunkAPI) => {
  try {
    thunkAPI.dispatch(clearValues());
    thunkAPI.dispatch(logoutUser(message));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};
