import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import {addPagamentosUtilizadorThunk, getAllPagamentosThunk, getAllPagamentosUtilizadorResponsavelThunk, getAllPagamentosUtilizadorThunk, getPagamentosUtilizadorMesThunk } from './pagamentosThunk';


const initialState = {
    sort: '',
    tipo: '',
    isLoadingPagamentos: false,
};

export const addPagamentosUtilizador = createAsyncThunk('pagamento/addPagamentosUtilizador', addPagamentosUtilizadorThunk);


export const getAllPagamentos = createAsyncThunk(
  'pagamento/getAllPagamentos',
  async (_, thunkAPI) => {
    try {
      const data = await getAllPagamentosThunk(thunkAPI); 
      return data; 
    } catch (error) {

      console.error('Error in getAllPagamentos:', error);
      throw error; 
    }
  }
);

export const getPagamentosUtilizadorMes = createAsyncThunk(
    'pagamento/getPagamentosUtilizadorMes',
    async (values) => {
      return getPagamentosUtilizadorMesThunk('/pagamento/getPagamentosUtilizadorMes',values);
    }
);




export const getAllPagamentosUtilizadorResponsavel = createAsyncThunk(
    'pagamento/getAllPagamentosUtilizadorResponsavel',
    async (utilizador) => {
      return getAllPagamentosUtilizadorResponsavelThunk('/pagamento/getAllPagamentosUtilizadorResponsavel', utilizador);
    }
  );



  export const getAllPagamentosUtilizador = createAsyncThunk(
    'pagamento/getAllPagamentosUtilizador',
    async (data, { getState }) => {
      const id = getState().utilizador.user.user.id; // retrieve id from redux store
      return getAllPagamentosUtilizadorThunk('/pagamento/getAllPagamentosUtilizador', data, id);
    }
  );




const pagamentosSlice = createSlice({
  name: 'pagamento',
  initialState,
  reducers: {
    handleChangePagamentos: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
        diasLocation: getUserFromLocalStorage()?.location || '',
      };
    },
    setEditDia: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },

  extraReducers: (builder) => {
    builder
  
    .addCase(getAllPagamentos.pending, (state) => {
      state.isLoadingPagamentos = true;
    })
    .addCase(getAllPagamentos.fulfilled, (state) => {
      state.isLoadingPagamentos = false;
      //toast.success('Pagamento adicionado!');
    })
    .addCase(getAllPagamentos.rejected, (state, { payload }) => {
      state.isLoadingPagamentos = false;
      toast.error(payload);
    })


    .addCase(getAllPagamentosUtilizadorResponsavel.pending, (state) => {
    state.isLoadingPagamentos = true;
    })
    .addCase(getAllPagamentosUtilizadorResponsavel.fulfilled, (state) => {
    state.isLoadingPagamentos = false;
    //toast.success('Pagamento adicionado!');
    })
    .addCase(getAllPagamentosUtilizadorResponsavel.rejected, (state, { payload }) => {
    state.isLoadingPagamentos = false;
    toast.error(payload);
    })

    .addCase(getAllPagamentosUtilizador.pending, (state) => {
    state.isLoadingPagamentos = true;
    })
    .addCase(getAllPagamentosUtilizador.fulfilled, (state) => {
    state.isLoadingPagamentos = false;
    //toast.success('Pagamento adicionado!');
    })
    .addCase(getAllPagamentosUtilizador.rejected, (state, { payload }) => {
    state.isLoadingPagamentos = false;
    toast.error(payload);
    })

    .addCase(addPagamentosUtilizador.pending, (state) => {
      state.isLoadingPagamentos = true;
    })
    .addCase(addPagamentosUtilizador.fulfilled, (state) => {
      state.isLoadingPagamentos = false;
      toast.success('Pagamento adicionado!');
    })
    .addCase(addPagamentosUtilizador.rejected, (state, { payload }) => {
      state.isLoadingPagamentos = false;
      toast.error(payload);
    })


    .addCase(getPagamentosUtilizadorMes.pending, (state) => {
      state.isLoadingPagamentos = true;
    })
    .addCase(getPagamentosUtilizadorMes.fulfilled, (state , { payload }) => {
      //const dia = payload.dia;
      state.isLoadingPagamentos = false;
    })
    .addCase(getPagamentosUtilizadorMes.rejected, (state, { payload }) => {
      state.isLoadingPagamentos = false;
      //toast.error(payload);
    })


  },
});

export const { handleChangePagamentos, clearValues, setEditDia } = pagamentosSlice.actions;

export default pagamentosSlice.reducer;