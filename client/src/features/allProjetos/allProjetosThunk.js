import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllProjetosThunk = async (_, thunkAPI) => {
  if(_){
    thunkAPI.getState().allProjetos.projetoFinalizado = "F";
  }

  const { page, search, projetoFinalizado,tipoTrabalho, sort , limit , DataObjetivoC} =
  thunkAPI.getState().allProjetos;

  let updatedProjetoFinalizado = projetoFinalizado; // Declare as let

  let url= `/projetos?page=${page}&limit=${limit}&sort=${sort}&Finalizado=${updatedProjetoFinalizado}&DataObjetivo=${DataObjetivoC}`
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
    console.error(error);
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllProjetosThunkAdd = async (_, thunkAPI) => {
  let projetoFinalizado;
  if(_){
    projetoFinalizado = _
  }
  
  let url= `/projetos?page=1&limit=100000&Finalizado=${projetoFinalizado}`

  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    console.error(error);
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
