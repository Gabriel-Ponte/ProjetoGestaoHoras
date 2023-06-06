import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { createTipoTrabalhoThunk, 
  deleteTipoTrabalhoThunk, 
  getTipoTrabalhoThunk, 
  editTipoTrabalhoThunk 
} from './tipoTrabalhoThunk';


const initialState = {
  isLoading: false,
};

export const createTipoTrabalho = createAsyncThunk(
  'tipoTrabalho/createTipoTrabalho',
  createTipoTrabalhoThunk
  );


export const deleteTipoTrabalho = createAsyncThunk(
  'tipoTrabalho/deleteTipoTrabalho', 
  async (id, thunkAPI) => {
    return deleteTipoTrabalhoThunk(thunkAPI, id);
  }
);


export const editTipoTrabalho = createAsyncThunk(
  'tipoTrabalho/editTipoTrabalho',
  async (tipoTrabalho, thunkAPI) => {
    return editTipoTrabalhoThunk(tipoTrabalho, thunkAPI)
  });

export const getTipoTrabalho = createAsyncThunk(
  'tipoTrabalho/getTipoTrabalho',
   getTipoTrabalhoThunk
   );



const tipoTrabalhoSlice = createSlice({
  name: 'tipoTrabalho',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: (state, { payload }) => {
      state.tipoTrabalho = null;
      if (payload) {
        toast.success(payload);
      }
    },
    setEditTipoTrabalho: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },

  extraReducers: (builder) => {

    builder
      .addCase(createTipoTrabalho.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTipoTrabalho.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Tipo de Trabalho Adicionado');
      })
      .addCase(createTipoTrabalho.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(deleteTipoTrabalho.fulfilled, (state, { payload }) => {
        toast.success('Tipo de Trabalho Apagado');
      })
      .addCase(deleteTipoTrabalho.rejected, (state, { payload }) => {
        toast.error(payload);
      })
      .addCase(editTipoTrabalho.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editTipoTrabalho.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const tipoTrabalho = payload;
        toast.success('Tipo de Trabalho modificado...');
      })
      .addCase(editTipoTrabalho.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      .addCase(getTipoTrabalho.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTipoTrabalho.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(getTipoTrabalho.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

  },
});

export const { showLoading, hideLoading, handleChange, clearValues, setEditTipoTrabalho } = tipoTrabalhoSlice.actions;

export default tipoTrabalhoSlice.reducer;