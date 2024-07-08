import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllDiasProjetoThunk, getAllDiasUtilizadorThunk ,getAllDiasThunk,getAllDiasProjetoUtilizadorThunk ,exportDiasThunk, getAllDiasUtilizadorTipoThunk, getAllDiasHorasExtraThunk, acceptDiasHorasExtraThunk, declineDiasHorasExtraThunk, getAllDiasHorasExtraDeclinedThunk, getAllDiasHorasExtraAcceptedThunk} from './allDiasThunk';

const initialState = {
  sort:'',
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

export const getAllDiasHorasExtra = createAsyncThunk(
  '/dia/getAllDiasHorasExtra', 
  async (_, thunkAPI) => {
    return getAllDiasHorasExtraThunk(thunkAPI);
  }
);

export const getAllDiasHorasExtraAccepted = createAsyncThunk(
  '/dia/getAllDiasHorasExtraAccepted', 
  async (_, thunkAPI) => {
    return getAllDiasHorasExtraAcceptedThunk(thunkAPI);
  }
);

export const getAllDiasHorasExtraDeclined = createAsyncThunk(
  '/dia/getAllDiasHorasExtraDeclined', 
  async (_, thunkAPI) => {
    return getAllDiasHorasExtraDeclinedThunk(thunkAPI);
  }
);

export const getAllDiasUtilizador = createAsyncThunk(
  '/dia/diasUtilizador/',
  async ({ userNome }, thunkAPI) => {
    return getAllDiasUtilizadorThunk(userNome, thunkAPI);
  }
);

   export const getAllDiasUtilizadorTipo = createAsyncThunk(
    '/dia/diasUtilizadorTipo/',
    async ({ userTipo }, thunkAPI) => {
      return getAllDiasUtilizadorTipoThunk(userTipo, thunkAPI);
      }
    );

  export const getAllDiasProjetoUtilizador = createAsyncThunk(
    '/dia/diasUtilizadorProjeto/',
    async ({ projetoId, selectedUser }, thunkAPI) => {
      return getAllDiasProjetoUtilizadorThunk(selectedUser, projetoId, thunkAPI);
    }
  );

  export const acceptDiasHorasExtra = createAsyncThunk('dias/acceptDiasHorasExtra', acceptDiasHorasExtraThunk);

  export const declineDiasHorasExtra = createAsyncThunk('dias/declineDiasHorasExtra', declineDiasHorasExtraThunk);


  export const exportDia = createAsyncThunk(
    'dia/exportDias/',
    async ({ userID, userTipo }, thunkAPI) => {
      return exportDiasThunk(thunkAPI, userID, userTipo);
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
    handleChangeDias: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearAllDiasState: () => initialState,
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
    .addCase(getAllDias.rejected, (state) => {
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
    .addCase(getAllDiasUtilizador.rejected, (state) => {
      state.isLoading = false;
      //toast.error(payload);
    })


    .addCase(getAllDiasUtilizadorTipo.pending, (state) => {
      state.isLoading = true;
    })

    .addCase(getAllDiasUtilizadorTipo.fulfilled, (state, { payload }) => {
      state.dias = payload.diasAllUtilizador;
      state.isLoading = false;

    })
    .addCase(getAllDiasUtilizadorTipo.rejected, (state) => {
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
    .addCase(getAllDiasProjetoUtilizador.rejected, (state) => {
      state.isLoading = false;
      //toast.error(payload);
    })

    .addCase(exportDia.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(exportDia.fulfilled, (state , { payload }) => {
      state.isLoading = false;
      if (payload && payload.error) {
        toast.error(payload.error);
      }else{
        toast.success(payload);
      }

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
    .addCase(getAllDiasTodos.rejected, (state) => {
      state.isLoading = false;
    })
    

    .addCase(getAllDiasHorasExtra.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllDiasHorasExtra.fulfilled, (state , { payload }) => {
      state.isLoading = false;
      toast.success(payload);
    })
    .addCase(getAllDiasHorasExtra.rejected, (state) => {
      state.isLoading = false;
    })



    
    .addCase(getAllDiasHorasExtraAccepted.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllDiasHorasExtraAccepted.fulfilled, (state , { payload }) => {
      state.isLoading = false;
      toast.success(payload);
    })
    .addCase(getAllDiasHorasExtraAccepted.rejected, (state) => {
      state.isLoading = false;
    })

    
    .addCase(getAllDiasHorasExtraDeclined.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllDiasHorasExtraDeclined.fulfilled, (state , { payload }) => {
      state.isLoading = false;
      toast.success(payload);
    })
    .addCase(getAllDiasHorasExtraDeclined.rejected, (state) => {
      state.isLoading = false;
    })

    .addCase(acceptDiasHorasExtra.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(acceptDiasHorasExtra.fulfilled, (state) => {
      toast.success("Horas Extra aceites!");
      state.isLoading = false;
    })
    
    .addCase(acceptDiasHorasExtra.rejected, (state) => {
      toast.error("Ocorreu um Erro ao aceitar as Horas Extra!");
      state.isLoading = false;
    })

    .addCase(declineDiasHorasExtra.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(declineDiasHorasExtra.fulfilled, (state) => {
      toast.success("Horas Extra recusadas!");
      state.isLoading = false;
    })
    .addCase(declineDiasHorasExtra.rejected, (state) => {
      toast.error("Ocorreu um Erro ao aceitar as Horas Extra!");
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
