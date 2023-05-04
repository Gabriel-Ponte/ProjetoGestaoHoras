import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage, addProjetoToLocalStorage, 
   getProjetoFromLocalStorage, removeProjetoFromLocalStorage} from '../../utils/localStorage';

import { createProjetoThunk, deleteProjetoThunk, editProjetoThunk , getProjetoThunk} from './projetosThunk';


const initialState = {
  isLoading: false,
  projeto: getProjetoFromLocalStorage(),
};

export const createProjeto = createAsyncThunk('projeto/createProjeto', createProjetoThunk);

export const deleteProjeto = createAsyncThunk('projeto/deleteProjeto', deleteProjetoThunk);

export const updateProjeto = createAsyncThunk(
  'projeto/updateProjeto',
  async (projeto, thunkAPI) => {
    return editProjetoThunk('/projeto/editProjeto', projeto, thunkAPI);
  });

export const getProjeto = createAsyncThunk(
  'projeto/getProjeto',
  async (id) => {
    return getProjetoThunk('/projeto/getProjeto', id);
  }
);

export const getProjetoList = createAsyncThunk(
  'projeto/getProjetoList',
  async (id) => {
    return getProjetoThunk('/projeto/getProjeto', id);
  }
);

const projetoSlice = createSlice({
  name: 'projeto',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
      console.log(state.projeto);
    },
    clearValues: (state, { payload }) => {
      state.projeto = null;
      removeProjetoFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
    setEditProjeto: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },


  extraReducers: (builder) =>{

    builder
    .addCase(createProjeto.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createProjeto.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Projeto Created');
    })
    .addCase(createProjeto.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })
    .addCase(deleteProjeto.fulfilled, (state, { payload }) => {
      toast.success(payload);
    })
    .addCase(deleteProjeto.rejected, (state, { payload }) => {
      toast.error(payload);
    })
    .addCase(updateProjeto.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateProjeto.fulfilled, (state,  { payload }) => {
      state.isLoading = false;
      const projeto = payload;
      addProjetoToLocalStorage(projeto);
      toast.success('Projeto Modified...');
    })
    .addCase(updateProjeto.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })
    
    .addCase(getProjeto.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getProjeto.fulfilled, (state , { payload }) => {
      const projeto = payload;
      state.isLoading = false;
      addProjetoToLocalStorage(projeto)
    })
    .addCase(getProjeto.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })

    .addCase(getProjetoList.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getProjetoList.fulfilled, (state , { payload }) => {
      const projeto = payload;
      state.projeto = projeto;
      state.isLoading = false;
    })
    .addCase(getProjetoList.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })
  },
});

export const { handleChange, clearValues, setEditProjeto } = projetoSlice.actions;

export default projetoSlice.reducer;