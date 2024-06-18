import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from './pagamentosSlice';

export const addPagamentosUtilizadorThunk = async (pagamento, thunkAPI) => {
  try {
    const resp = await customFetch.post('/pagamento/addPagamentosUtilizador', pagamento);
    thunkAPI.dispatch(clearValues());
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllPagamentosThunk = async (thunkAPI) => {
  try {
    const { sort } = thunkAPI.getState().pagamentos || {}; 
    let url= `/pagamento/getAllPagamentos?sort=${sort}`
    const resp = await customFetch.get(url);
    return resp.data;

  } catch (error) {
    //return checkForUnauthorizedResponse(error, thunkAPI);
  }
};



export const getPagamentosUtilizadorMesThunk = async ( thunkAPI, values ) => {
    // const user = values.user;
    // const day = values.day;

    try {
      const resp = await customFetch.post(`/pagamento/getPagamentosUtilizadorMes`, values);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };
  

export const getAllPagamentosUtilizadorThunk = async ( thunkAPI , selectedUser ) => {
    try {
      const userId= selectedUser?.selectedUserID;
      //const userId = utilizador?.user?.user?.id;
      const resp = await customFetch.get(`/pagamento/getAllPagamentosUtilizador/${userId}`);
      return resp?.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };

  export const getAllPagamentosUtilizadorResponsavelThunk = async ( thunkAPI , utilizador ) => {
    try {
      const userId = utilizador?.user?.user?.id;
      const resp = await customFetch.get(`/pagamento/getAllPagamentosUtilizadorResponsavel/${userId}`);
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };