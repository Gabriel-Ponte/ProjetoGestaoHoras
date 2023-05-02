import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllDiasProjetoThunk = async (projetoId, userLogin, thunkAPI) => {
  const { page, search, searchStatus, searchType, sort } =
    thunkAPI.getState().allDias;
 /*
  let url = `/dias?status=${searchStatus}&projetosType=${searchType}&sort=${sort}&page=${page}`;
  if (search) {
    url = url + `&search=${search}`;
  }
  */
  try {
    const resp = await customFetch.get(`/dia/dias/${projetoId}`);
    //console.log(resp.data);
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
