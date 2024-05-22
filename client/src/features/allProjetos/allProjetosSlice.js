import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllProjetosThunk, getAllProjetosThunkAdd } from './allProjetosThunk';

const initialFiltersState = {
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: '-Cliente',
  projetoFinalizado: 'false',
  DataObjetivoC: 'true',
  tipoTrabalho:'',
  limit:'1000',
};

const initialState = {
  isLoading: true,
  projetos: [],
  totalProjetos: 0,
  numOfPages: 1,
  page: 1,

  stats: {},
  ...initialFiltersState,
};


export const getAllProjetos = createAsyncThunk(
  'allProjetos/getProjetos', getAllProjetosThunk  );

export const getAllProjetos1 = createAsyncThunk(
  'allProjetos/getAllProjetos1', async (sort, { rejectWithValue }) => {
    try {
      const getAllP = getAllProjetosThunkAdd(sort);

      return getAllP;
    }
    catch (error) {
      console.error(error)
      return rejectWithValue(error.response.data);
    }
  }
)
const allProjetosSlice = createSlice({

  name: 'allProjetos',
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
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    changePage: (state, { payload }) => {
      state.page = payload;
    },
    clearAllProjetosState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjetos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProjetos.fulfilled, (state, { payload }) => {
  
        state.isLoading = false;
        state.projetos = payload.projetos;
        state.numOfPages = payload.numOfPages;
        state.totalProjetos = payload.totalProjetos;
      })
      .addCase(getAllProjetos.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      .addCase(getAllProjetos1.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProjetos1.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.projetos = payload.projetos;
        state.numOfPages = payload.numOfPages;
        state.totalProjetos = payload.totalProjetos;
      })
      .addCase(getAllProjetos1.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  changePage,
  clearAllProjetosState,
} = allProjetosSlice.actions;

export default allProjetosSlice.reducer;
