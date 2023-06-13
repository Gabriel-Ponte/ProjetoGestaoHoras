import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllProjetosThunk = async (_, thunkAPI) => {
  const { page, search, projetoFinalizado,tipoTrabalho, sort , limit , DataObjetivoC} =
  thunkAPI.getState().allProjetos;
  let url= `/projetos?page=${page}&limit=${limit}&sort=${sort}&Finalizado=${projetoFinalizado}&DataObjetivo=${DataObjetivoC}`
  if (search) {
    url = url + `&search=${search}`;
  }
  if (tipoTrabalho !== null){
    url = url + `&tipoTrabalho=${tipoTrabalho}`;
  }

  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    console.log(error);
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
