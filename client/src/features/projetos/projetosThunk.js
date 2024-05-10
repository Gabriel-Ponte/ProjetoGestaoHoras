import { showLoading, hideLoading, getAllProjetos } from '../allProjetos/allProjetosSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from './projetosSlice';

export const createProjetoThunk = async (projeto, thunkAPI) => {
  try {
    const resp = await customFetch.post('/projetos', projeto);
    thunkAPI.dispatch(clearValues());
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const deleteProjetoThunk = async (thunkAPI, projetoId) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/projetos/${projetoId}`);
    thunkAPI.dispatch(getAllProjetos());
    return resp.data.msg;
  } catch (error) {
    thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const editProjetoThunk = async (url, projeto, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/projetos/${projeto._id}`, projeto);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const insertProjetoLinkThunk = async (url, projeto, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/projetos/updateLink/${projeto._id}`, projeto);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};



export const getProjetoThunk = async ( thunkAPI ,projetoId) => {
  try {
    const resp = await customFetch.get(`/projetos/${projetoId}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};


export const getProjetoAllVersoesThunk = async ( thunkAPI ,projetoId) => {
  try {
    const resp = await customFetch.get(`/projetos/todasVersoes/${projetoId}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getClientesThunk = async ( thunkAPI ,projetoId) => {
  try {
    const resp = await customFetch.get(`/projetos/clientes`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const exportProjetosThunk = async ( url, userID ,thunkAPI) => {
  try {
    const resp = await customFetch.post(`/projetos/export/` , userID);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
