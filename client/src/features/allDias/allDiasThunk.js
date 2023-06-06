import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllDiasProjetoThunk = async (projetoId, userLogin, thunkAPI) => {
  const { page, search, searchStatus, searchType, sort } =
    thunkAPI.getState().allDias;
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
