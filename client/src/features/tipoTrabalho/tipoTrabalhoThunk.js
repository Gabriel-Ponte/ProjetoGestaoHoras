import { showLoading, hideLoading } from './tipoTrabalhoSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from './tipoTrabalhoSlice';


export const deleteTipoTrabalhoThunk = async (tipoTrabalhoId, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/tipoTrabalho/${tipoTrabalhoId}`);
    thunkAPI.dispatch(getTipoTrabalhoThunk());
    return resp.data.msg;
  } catch (error) {
    thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const editTipoTrabalhoThunk = async (tipoTrabalho ,thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/tipoTrabalho/${tipoTrabalho._id}`, tipoTrabalho);
    thunkAPI.dispatch(clearValues());
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
      console.log(tipoTrabalho);
      const resp = await customFetch.post('/tipoTrabalho', tTrabalho);
      thunkAPI.dispatch(clearValues());
      return resp.data.msg;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };
