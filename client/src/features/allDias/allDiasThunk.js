import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllDiasProjetoThunk = async (projetoId, userLogin, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/dia/dias/${projetoId}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllDiasUtilizadorThunk = async (utilizadorId, thunkAPI) => {
  try {

    const resp = await customFetch.get(`/dia/diasUtilizador/${utilizadorId}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllDiasProjetoUtilizadorThunk = async (utilizadorId,projeto, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/dia/diasUtilizador/${utilizadorId}/${projeto}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const exportDiasThunk = async ( url, userID ,thunkAPI) => {
  try {
    const resp = await customFetch.post(`/dia/exportDias/` , userID);
    console.log(resp, +"RESP");
    return resp.data;
  } catch (error) {
    console.log(error.response.data.msg)
    throw { error: error.response.data.msg };
  }
};
