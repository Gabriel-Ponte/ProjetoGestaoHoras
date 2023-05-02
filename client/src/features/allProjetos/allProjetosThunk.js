import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllProjetosThunk = async (_, thunkAPI) => {
  const { page, search, projetoFinalizado, searchType, sort } =
  thunkAPI.getState().allProjetos;
  console.log(projetoFinalizado)
  let url= `/projetos?page=${page}&limit=4&sort=${sort}&Finalizado=${projetoFinalizado}`
  if (search) {
    url = url + `&search=${search}`;
  }

  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    console.log(error);
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
