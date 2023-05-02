import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllDiasProjetoThunk, getAllDiasUtilizadorThunk } from './allDiasThunk';

const initialState = {
  isLoading: true,
  dias: [],
  stats: {},
};

export const getAllDias = createAsyncThunk(
  'allDias/getDias', 
  async ({ projetoId, userLogin }, thunkAPI) => {
    return getAllDiasProjetoThunk(projetoId, userLogin, thunkAPI);
  }
);

export const getAllDiasUtilizador = createAsyncThunk(
  'allDias/getDiasUtilizador',
  async ({ userNome }, thunkAPI) => {
    return getAllDiasUtilizadorThunk(userNome, thunkAPI);
  }
   );


const allDiasSlice = createSlice({
  name: 'AllDias',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearAllDiasState: (state) => initialState,
  },


  extraReducers: (builder) =>{
    builder
    .addCase(getAllDias.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllDias.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.totalDias = payload.diasAllProjeto;
    })
    .addCase(getAllDias.rejected, (state, { payload }) => {
      state.isLoading = false;
      //toast.error(payload);
    })


    .addCase(getAllDiasUtilizador.pending, (state) => {
      state.isLoading = true;
    })

    .addCase(getAllDiasUtilizador.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.dias = payload.diasAllUtilizador;
    })
    .addCase(getAllDiasUtilizador.rejected, (state, { payload }) => {
      state.isLoading = false;
      //toast.error(payload);
    })
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearAllDiasState,
} = allDiasSlice.actions;

export default allDiasSlice.reducer;
