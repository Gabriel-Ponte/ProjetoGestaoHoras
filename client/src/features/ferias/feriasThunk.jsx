import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from './feriasSlice';



export const getAllFeriasThunk = async (thunkAPI) => {
  try {
    const { sort } = thunkAPI.getState().ferias || {}; 
    let url= `/ferias/getAllFerias?sort=${sort}`

    const resp = await customFetch.get(url);
    return resp.data;

  } catch (error) {
    console.error(error);
    //return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const getFeriasUtilizadorThunk = async (diasFeriasId, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/ferias/${diasFeriasId}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const addDiasFeriasUtilizadorThunk = async (ferias, thunkAPI) => {
  try {
    const resp = await customFetch.post('/ferias/addDiasFeriasUtilizador', ferias);
    thunkAPI.dispatch(clearValues());
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const deleteDiasFeriasThunk = async (diasFeriasId, thunkAPI) => {
  try {
    const resp = await customFetch.delete(`/ferias/${diasFeriasId}`);
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

