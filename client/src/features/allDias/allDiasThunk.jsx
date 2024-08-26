import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';



export const getAllDiasThunk = async (thunkAPI) => {
  try {
    const resp = await customFetch.get(`/dia/getAllDias`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};


export const getAllDiasHorasExtraThunk = async (thunkAPI) => {
  try {
    
    const { sort, tipo } = thunkAPI.getState().pagamentos || {}; 

    let url= `/dia/getAllDiasHorasExtra?sort=${sort}&tipo=${tipo}`
    const resp = await customFetch.get(url);

    return resp?.data;

    // const resp = await customFetch.get(`/dia/getAllDiasHorasExtra`);
    // return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllDiasHorasExtraAcceptedThunk = async (thunkAPI) => {
  try {
    const { sort , tipo } = thunkAPI.getState().pagamentos || {}; 
    let url= `/dia/getAllDiasHorasExtraAccepted?sort=${sort}&tipo=${tipo}`
    const resp = await customFetch.get(url);
    return resp.data;

    // const resp = await customFetch.get(`/dia/getAllDiasHorasExtraAccepted`);
    // return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllDiasHorasExtraDeclinedThunk = async (thunkAPI) => {
  try {
    const { sort ,tipo } = thunkAPI.getState().pagamentos || {}; 
    let url= `/dia/getAllDiasHorasExtraDeclined?sort=${sort}&tipo=${tipo}`
    const resp = await customFetch.get(url);
    return resp.data;

    // const resp = await customFetch.get(`/dia/getAllDiasHorasExtraDeclined`);
    // return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};


export const getAllDiasHorasExtraResponsavelThunk = async (thunkAPI) => {
  try {
    const { sort, tipo } = thunkAPI.getState().pagamentos || {}; 
    const user = thunkAPI.getState().utilizador?.user?.user?.id || {}; 
    let url= `/dia/getAllDiasHorasExtraResponsavel?sort=${sort}&tipo=${tipo}&user=${user}`
    const resp = await customFetch.get(url);

    return resp?.data;

    // const resp = await customFetch.get(`/dia/getAllDiasHorasExtra`);
    // return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllDiasHorasExtraAcceptedResponsavelThunk = async (thunkAPI) => {
  try {
    const { sort , tipo } = thunkAPI.getState().pagamentos || {}; 
    const user = thunkAPI.getState().utilizador?.user?.user?.id || {}; 
    let url= `/dia/getAllDiasHorasExtraAcceptedResponsavel?sort=${sort}&tipo=${tipo}&user=${user}`
    const resp = await customFetch.get(url);
    return resp.data;

    // const resp = await customFetch.get(`/dia/getAllDiasHorasExtraAccepted`);
    // return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getAllDiasHorasExtraDeclinedResponsavelThunk = async (thunkAPI) => {
  try {
    const { sort ,tipo } = thunkAPI.getState().pagamentos || {}; 
    const user = thunkAPI.getState().utilizador?.user?.user?.id || {}; 
    let url= `/dia/getAllDiasHorasExtraDeclinedResponsavel?sort=${sort}&tipo=${tipo}&user=${user}`
    const resp = await customFetch.get(url);
    return resp.data;

    // const resp = await customFetch.get(`/dia/getAllDiasHorasExtraDeclined`);
    // return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};



export const declineDiasHorasExtraThunk = async (value, thunkAPI) => {
  try {
    //const resp = await customFetch.delete(`/dia/${diaId}`);
    const resp = await customFetch.patch(`/dia/declineDiaHorasExtra/${value._id}` ,value);
    //thunkAPI.dispatch(getAllDias());
    return resp.data.msg;
  } catch (error) {
    //thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const acceptDiasHorasExtraThunk = async (value, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/dia/acceptDiaHorasExtra/${value._id}`, value);
    //thunkAPI.dispatch(clearValues());
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};


export const declineMultipleDiasHorasExtraThunk = async (value, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/dia/declineMultipleDiaHorasExtra/${value[0]._id}` ,value);
    return resp.data.msg;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const acceptMultipleDiasHorasExtraThunk = async (value, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/dia/acceptMultipleDiaHorasExtra/${value[0]._id}`, value);
    return resp.data.msg;
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

export const exportDiasThunk = async ( url, userID ,userTipo) => {
  try {
    const resp = await customFetch.post(`/dia/exportDias/` , { userID, userTipo });
    return resp.data;
  } catch (error) {
    console.error(error.response.data.msg)
    return { error: error.response.data.msg };
  }
};
