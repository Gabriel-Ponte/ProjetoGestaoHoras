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


export const getAllDiasUtilizadorTipoThunk = async (utilizadorTipo, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/dia/diasUtilizadorTipo/${utilizadorTipo}`);
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

export const exportDiasThunk = async ( url, userID ,userTipo ,thunkAPI) => {
  try {
    const resp = await customFetch.post(`/dia/exportDias/` , { userID, userTipo });
    return resp.data;
  } catch (error) {
    console.error(error.response.data.msg)
    return { error: error.response.data.msg };
  }
};
