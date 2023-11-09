import { showLoading, hideLoading , clearValues } from './tipoTrabalhoSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';


export const deleteTipoTrabalhoThunk = async (thunkAPI, tipoTrabalhoId) => {

  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/tipoTrabalho/${tipoTrabalhoId}`);
    return resp.data.msg;
  } catch (error) {
    thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const editTipoTrabalhoThunk = async (tipoTrabalho ,thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/tipoTrabalho/${tipoTrabalho._id}`, tipoTrabalho);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getTipoTrabalhoThunk = async ( thunkAPI ) => {
    try {
      const resp = await customFetch.get(`/tipoTrabalho/`);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };

  export const createTipoTrabalhoThunk = async (tipoTrabalho, thunkAPI) => {
    try {

      const tTrabalho = { TipoTrabalho: tipoTrabalho };
      const resp = await customFetch.post('/tipoTrabalho', tTrabalho);
      thunkAPI.dispatch(clearValues());
      return resp.data.msg;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };


  export const createTipoTrabalhoOtherThunk = async (tipoTrabalho, thunkAPI) => {
    try {
      const tTrabalho = tipoTrabalho ;
      const resp = await customFetch.post('/tipoTrabalho/createTipoTrabalhoOther', tTrabalho);
      thunkAPI.dispatch(clearValues());
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };