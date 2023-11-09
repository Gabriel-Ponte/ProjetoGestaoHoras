import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  addProjetoToLocalStorage,
  getProjetoFromLocalStorage, removeProjetoFromLocalStorage
} from '../../utils/localStorage';

import { 
  createProjetoThunk, 
  deleteProjetoThunk, 
  editProjetoThunk, 
  getProjetoThunk,
  getClientesThunk,
  exportProjetosThunk
} from './projetosThunk';


const initialState = {
  isLoading: false,
  projeto: getProjetoFromLocalStorage(),
};


export const exportProjeto = createAsyncThunk(
  'projeto/export/',
  async (id ,thunkAPI) => {
    return exportProjetosThunk(thunkAPI, id);
  }
  );

export const createProjeto = createAsyncThunk(
  'projeto/createProjeto',
   createProjetoThunk
   );

export const deleteProjeto = createAsyncThunk(
  'projeto/deleteProjeto',
  async (id ,thunkAPI) => {
    return deleteProjetoThunk(thunkAPI, id);
  }
);

export const updateProjeto = createAsyncThunk(
  'projeto/updateProjeto',
  async (projeto, thunkAPI) => {
    return editProjetoThunk('/projeto/editProjeto', projeto, thunkAPI);
  });

export const getProjeto = createAsyncThunk(
  'projeto/getProjeto',
  async (id , thunkAPI) => {
    return getProjetoThunk('/projeto/getProjeto', id);
  }
);

export const getClientes = createAsyncThunk(
  'projeto/getClientes',
  async (id , thunkAPI) => {
    return getClientesThunk('/projeto/getClientes');
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


  extraReducers: (builder) => {

    builder
      .addCase(createProjeto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProjeto.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Projeto Inserido');
      })
      .addCase(createProjeto.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(deleteProjeto.fulfilled, (state, { payload }) => {
        toast.success("Projeto Apagado");
      })
      .addCase(deleteProjeto.rejected, (state, { payload }) => {
        toast.error(payload);
      })
      .addCase(updateProjeto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProjeto.fulfilled, (state, { payload }) => {
        const projeto = payload;
        addProjetoToLocalStorage(projeto);
        state.isLoading = false;
        toast.success('Projeto alterado!');
      })
      .addCase(updateProjeto.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      .addCase(getProjeto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjeto.fulfilled, (state, { payload }) => {
        const projeto = payload;
        addProjetoToLocalStorage(projeto)
        state.isLoading = false;
      })
      .addCase(getProjeto.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      .addCase(getProjetoList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjetoList.fulfilled, (state, { payload }) => {
        const projeto = payload;
        state.projeto = projeto;
        state.isLoading = false;
      })
      .addCase(getProjetoList.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      
      
      .addCase(getClientes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClientes.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.listaClientes = payload;
        //toast.success(payload);
      })
      .addCase(getClientes.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      
      .addCase(exportProjeto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exportProjeto.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        toast.success(payload);
      })
      .addCase(exportProjeto.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

  },
});

export const { handleChange, clearValues, setEditProjeto } = projetoSlice.actions;

export default projetoSlice.reducer;