import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import { createDiaThunk, deleteDiaThunk, editDiaThunk , getDiaThunk} from './diasThunk';


const initialState = {
  isLoading: false,
};

export const createDia = createAsyncThunk('dias/createDia', createDiaThunk);

export const deleteDia = createAsyncThunk('dias/deleteDia', deleteDiaThunk);

export const editDia = createAsyncThunk('dias/editDia', editDiaThunk);

export const getDia = createAsyncThunk(
  'dias/getDia',
  async (data, { getState }) => {
    const id = getState().utilizador.user.user.id; // retrieve id from redux store
    return getDiaThunk('/Dias/getDias', data, id);
  }
);

const diasSlice = createSlice({
  name: 'dia',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
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
    .addCase(createDia.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createDia.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Dia Created');
    })
    .addCase(createDia.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })
    .addCase(deleteDia.fulfilled, (state, { payload }) => {
      toast.success(payload);
    })
    .addCase(deleteDia.rejected, (state, { payload }) => {
      toast.error(payload);
    })
    .addCase(editDia.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(editDia.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Dia Modified...');
    })
    .addCase(editDia.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })
    .addCase(getDia.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getDia.fulfilled, (state , { payload }) => {
      const dia = payload.dia;
      state.isLoading = false;
    })
    .addCase(getDia.rejected, (state, { payload }) => {
      state.isLoading = false;
      //toast.error(payload);
    })
  },
});

export const { handleChange, clearValues, setEditDia } = diasSlice.actions;

export default diasSlice.reducer;