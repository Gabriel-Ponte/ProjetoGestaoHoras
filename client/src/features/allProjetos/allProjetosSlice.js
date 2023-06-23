import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllProjetosThunk } from './allProjetosThunk';

const initialFiltersState = {
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'Cliente',
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
  'allProjetos/getProjetos', getAllProjetosThunk
  );

export const getAllProjetos1 = createAsyncThunk(
  'allProjetos/getProjetos', async (sort, { rejectWithValue }) => {
    try {
      const getAllP = getAllProjetosThunk('/projetos', sort);
      return getAllP;
    }
    catch (error) {
      console.log(error)
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
