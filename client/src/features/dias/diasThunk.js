import { showLoading, hideLoading } from '../allDias/allDiasSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { getAllDias } from '../allDias/allDiasSlice';
import { clearValues } from './diasSlice';


export const deleteDiaThunk = async (diaId, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    //console.log(diaId)
    const resp = await customFetch.delete(`/dia/${diaId}`);
    thunkAPI.dispatch(getAllDias());
    return resp.data.msg;
  } catch (error) {
    thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const editDiaThunk = async (dia ,thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/dia/${dia._id}`, dia);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const createDiaThunk = async (dia, thunkAPI) => {
  try {
    const resp = await customFetch.post('/dia', dia);
    thunkAPI.dispatch(clearValues());
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const getDiaThunk = async ( thunkAPI , data, utilizador ) => {
  try {
    const resp = await customFetch.get(`/dia/${utilizador}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};