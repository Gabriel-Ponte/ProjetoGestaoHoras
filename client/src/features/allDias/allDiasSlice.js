import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllDiasProjetoThunk, getAllDiasUtilizadorThunk ,getAllDiasThunk,getAllDiasProjetoUtilizadorThunk ,exportDiasThunk} from './allDiasThunk';

const initialState = {
  isLoading: true,
  dias: [],
  stats: {},
};

export const getAllDias = createAsyncThunk(
  '/dia/dias/', 
  async ({ projetoId, userLogin }, thunkAPI) => {
    return getAllDiasProjetoThunk(projetoId, userLogin, thunkAPI);
  }
);


export const getAllDiasTodos = createAsyncThunk(
  '/dia/getAllDias', 
  async (thunkAPI) => {
    return getAllDiasThunk(thunkAPI);
  }
);

export const getAllDiasUtilizador = createAsyncThunk(
  '/dia/diasUtilizador/',
  async ({ userNome }, thunkAPI) => {
    return getAllDiasUtilizadorThunk(userNome, thunkAPI);
  }
   );

  export const getAllDiasProjetoUtilizador = createAsyncThunk(
    '/dia/diasUtilizadorProjeto/',
    async ({ projetoId, selectedUser }, thunkAPI) => {
      return getAllDiasProjetoUtilizadorThunk(selectedUser, projetoId, thunkAPI);
    }
  );

  export const exportDia = createAsyncThunk(
    'dia/exportDias/',
    async (id ,thunkAPI) => {
      return exportDiasThunk(thunkAPI, id);
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
      state.dias = payload.diasAllProjeto;
    })
    .addCase(getAllDias.rejected, (state, { payload }) => {
      state.isLoading = false;
      //toast.error(payload);
    })


    .addCase(getAllDiasUtilizador.pending, (state) => {
      state.isLoading = true;
    })

    .addCase(getAllDiasUtilizador.fulfilled, (state, { payload }) => {
      state.dias = payload.diasAllUtilizador;
      state.isLoading = false;

    })
    .addCase(getAllDiasUtilizador.rejected, (state, { payload }) => {
      state.isLoading = false;
      //toast.error(payload);
    })

    .addCase(getAllDiasProjetoUtilizador.pending, (state) => {
      state.isLoading = true;
    })

    .addCase(getAllDiasProjetoUtilizador.fulfilled, (state, { payload }) => {
      state.dias = payload.diasAllProjeto;
      state.isLoading = false;

    })
    .addCase(getAllDiasProjetoUtilizador.rejected, (state, { payload }) => {
      state.isLoading = false;
      //toast.error(payload);
    })

    .addCase(exportDia.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(exportDia.fulfilled, (state , { payload }) => {
      state.isLoading = false;
      toast.success(payload);
    })
    .addCase(exportDia.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload && payload.error) {
        toast.error(payload.error);
      }else{
        toast.error("Erro ao exportar ficheiro. Verifique se está aberto!");
      }
    })



    .addCase(getAllDiasTodos.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllDiasTodos.fulfilled, (state , { payload }) => {
      state.isLoading = false;
      toast.success(payload);
    })
    .addCase(getAllDiasTodos.rejected, (state, { payload }) => {
      state.isLoading = false;
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
