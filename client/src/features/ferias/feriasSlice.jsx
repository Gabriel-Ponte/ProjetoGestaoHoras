import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import {addDiasFeriasUtilizadorThunk, deleteDiasFeriasThunk, exportFeriasThunk, getAllFeriasGroupThunk, getAllFeriasThunk, getFeriasUtilizadorThunk } from './feriasThunk';

const initialState = {
    sort: '-Utilizador',
    tipo: '',
    isLoadingFerias: false,
};


export const getAllFerias = createAsyncThunk(
  'ferias/getAllFerias',
  async (_, thunkAPI) => {
    try {
      const data = await getAllFeriasThunk(thunkAPI); 
      return data; 
    } catch (error) {

      console.error('Error in getAllFerias:', error);
      throw error; 
    }
  }
);

export const getFeriasUtilizador = createAsyncThunk(
  'ferias/getFeriasUtilizador',
  async (diasFeriasId, thunkAPI) => {
    try {
      const data = await getFeriasUtilizadorThunk(diasFeriasId, thunkAPI); 
      return data; 
    } catch (error) {

      console.error('Error in getFeriasUtilizador:', error);
      throw error; 
    }
  }
);

export const getAllFeriasGroup = createAsyncThunk(
  '/dia/feriasGroup', 
  async ({ userTipo }, thunkAPI) => {
    return getAllFeriasGroupThunk(userTipo, thunkAPI);
  }
);

export const exportFerias = createAsyncThunk(
  'ferias/exportFerias/',
  async ({ date, userID, tipo }, thunkAPI) => {
    return exportFeriasThunk(thunkAPI, date, userID, tipo);
  }
  );



export const addDiasFeriasUtilizador = createAsyncThunk('ferias/addDiasFeriasUtilizador', addDiasFeriasUtilizadorThunk);
export const deleteDiasFerias = createAsyncThunk('ferias/deleteDiasFerias', deleteDiasFeriasThunk);


const feriasSlice = createSlice({
  name: 'ferias',
  initialState,
  reducers: {
    handleChangeFerias: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
        diasLocation: getUserFromLocalStorage()?.location || '',
      };
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase(getAllFerias.pending, (state) => {
      state.isLoadingFerias = true;
    })
    .addCase(getAllFerias.fulfilled, (state) => {
      state.isLoadingFerias = false;
      //toast.success('Pagamento adicionado!');
    })
    .addCase(getAllFerias.rejected, (state, { payload }) => {
      state.isLoadingFerias = false;
      toast.error(payload);
    })

    //addDiasFeriasUtilizador
    .addCase(addDiasFeriasUtilizador.pending, (state) => {
      state.isLoadingFerias = true;
    })
    .addCase(addDiasFeriasUtilizador.fulfilled, (state) => {
      state.isLoadingFerias = false;
      //toast.success('Pagamento adicionado!');
    })
    .addCase(addDiasFeriasUtilizador.rejected, (state, { payload }) => {
      state.isLoadingFerias = false;
      toast.error(payload);
    })

    //deleteDiasFerias
    .addCase(deleteDiasFerias.pending, (state) => {
      state.isLoadingFerias = true;
    })
    .addCase(deleteDiasFerias.fulfilled, (state) => {
      state.isLoadingFerias = false;
      //toast.success('Pagamento adicionado!');
    })
    .addCase(deleteDiasFerias.rejected, (state, { payload }) => {
      state.isLoadingFerias = false;
      toast.error(payload);
    })

    //getFeriasUtilizador
    .addCase(getFeriasUtilizador.pending, (state) => {
      state.isLoadingFerias = true;
    })
    .addCase(getFeriasUtilizador.fulfilled, (state) => {
      state.isLoadingFerias = false;
      // toast.success('Ferias Obtidas!');
    })
    .addCase(getFeriasUtilizador.rejected, (state, { payload }) => {
      state.isLoadingFerias = false;
      toast.error(payload);
    })

    //getAllFeriasGroup
    .addCase(getAllFeriasGroup.pending, (state) => {
      state.isLoadingFerias = true;
    })
    .addCase(getAllFeriasGroup.fulfilled, (state) => {
      state.isLoadingFerias = false;
      // toast.success('Ferias Obtidas!');
    })
    .addCase(getAllFeriasGroup.rejected, (state, { payload }) => {
      state.isLoadingFerias = false;
      toast.error(payload);
    })

    
        //exportFerias
        .addCase(exportFerias.pending, (state) => {
          state.isLoadingFerias = true;
        })
        .addCase(exportFerias.fulfilled, (state , { payload }) => {
          state.isLoading = false;
          if (payload && payload.error) {
            toast.error(payload.error);
          }else{
            toast.success(payload);
          }
        })
        .addCase(exportFerias.rejected, (state, { payload }) => {
          state.isLoading = false;
          if (payload && payload.error) {
            toast.error(payload.error);
          }else{
            toast.error("Erro ao exportar ficheiro. Verifique se está aberto!");
          }
        })
  },
});

export const { handleChangeFerias, clearValues, setEditDia } = feriasSlice.actions;

export default feriasSlice.reducer;