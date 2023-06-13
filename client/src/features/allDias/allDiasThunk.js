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
