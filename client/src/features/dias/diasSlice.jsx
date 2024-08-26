import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import { adicionarFeriasThunk, createDiaDomingoThunk, createDiaThunk, deleteDiaGroupThunk, deleteDiaThunk, editDiaThunk ,getDiaIDThunk , getDiaThunk} from './diasThunk';


const initialState = {
  isLoading: false,
};


export const adicionarFerias = createAsyncThunk('dias/adicionarFerias', adicionarFeriasThunk);

export const createDia = createAsyncThunk('dias/createDia', createDiaThunk);

export const createDiaDomingo = createAsyncThunk('dias/createDiaDomingo', createDiaDomingoThunk);



export const deleteDia = createAsyncThunk('dias/deleteDia', deleteDiaThunk);
export const deleteDiaGroup = createAsyncThunk('dias/deleteDiaGroup', deleteDiaGroupThunk);

export const editDia = createAsyncThunk('dias/editDia', editDiaThunk);

export const getDia = createAsyncThunk(
  'dias/getDia',
  async (data, { getState }) => {
    const id = getState().utilizador.user.user.id; // retrieve id from redux store
    return getDiaThunk('/Dias/getDias', data, id);
  }
);


export const getDiaID = createAsyncThunk('dias/getDiaID', getDiaIDThunk);


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
      toast.success('Dia adicionado!');
    })
    .addCase(createDia.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })


    .addCase(createDiaDomingo.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createDiaDomingo.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Dia adicionado!');
    })
    .addCase(createDiaDomingo.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })

    .addCase(deleteDia.fulfilled, (state, { payload }) => {
      toast.success(payload);
    })
    .addCase(deleteDia.rejected, (state, { payload }) => {
      toast.error(payload);
    })

    .addCase(deleteDiaGroup.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteDiaGroup.fulfilled, (state, { payload }) => {
      toast.success(payload);
    })
    .addCase(deleteDiaGroup.rejected, (state, { payload }) => {
      toast.error(payload);
    })

    .addCase(editDia.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(editDia.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Dia alterado!');
    })
    .addCase(editDia.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })
    .addCase(getDia.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getDia.fulfilled, (state ) => {
      //const dia = payload.dia;
      state.isLoading = false;
    })
    .addCase(getDia.rejected, (state) => {
      state.isLoading = false;
      //toast.error(payload);
    })

    .addCase(adicionarFerias.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(adicionarFerias.fulfilled, (state ) => {
      //const dia = payload.dia;
      state.isLoading = false;
      toast.success('Férias inseridas!');
    })
    .addCase(adicionarFerias.rejected, (state) => {
      state.isLoading = false;
      //toast.error(payload);
    })
    
  },
});

export const { handleChange, clearValues, setEditDia } = diasSlice.actions;

export default diasSlice.reducer;