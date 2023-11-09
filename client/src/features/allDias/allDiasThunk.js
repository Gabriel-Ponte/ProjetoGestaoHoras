import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';



export const getAllDiasThunk = async (thunkAPI) => {
  try {
    const resp = await customFetch.get(`/dia/getAllDias`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};


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
    return resp.data;
  } catch (error) {
    console.error(error.response.data.msg)
    throw { error: error.response.data.msg };
  }
};
