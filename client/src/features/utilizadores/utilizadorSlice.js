import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from '../../utils/localStorage';

import {
  showAllUtilizadores,
  loginUserThunk,
  registerUserThunk,
  updateUserThunk,
  clearStoreThunk,
} from './utilizadorThunk';



const initialState = {
  isLoadingU: true,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
};


export const registerUser = createAsyncThunk(
  'utilizador/registerUser',
  async (user, thunkAPI) => {
    const register = registerUserThunk('/utilizador/register', user, thunkAPI);
    return register;
  }
);

export const loginUser = createAsyncThunk(
  'utilizador/loginUser',
  async (user, thunkAPI) => {
    return loginUserThunk('/inicio/login', user, thunkAPI);
  }
);


export const updateUser = createAsyncThunk(
  'utilizador/updateUser',
  async (user, thunkAPI) => {
    return updateUserThunk('/utilizador/updateUser', user, thunkAPI);
  }
);

export const listaUtilizadores = createAsyncThunk(
    'utilizador/',
    async (user, thunkAPI) => {
      return showAllUtilizadores('/auth/utilizador', user, thunkAPI);
    }
  );

export const clearStore = createAsyncThunk('utilizador/clearStore', clearStoreThunk);
const userSlice = createSlice({
  name: 'utilizador',
  initialState,
  reducers: {
    toggleSidebar: (state , value) => {
      if(value.payload === false || value.payload === true){
        state.isSidebarOpen = value.payload;
      }
      else{
      state.isSidebarOpen = !state.isSidebarOpen;
      }
    },

    logoutUser: (state, { payload }) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
  },


  extraReducers: (builder) =>{
  builder
    .addCase(registerUser.pending, (state) => {
      state.isLoadingU = true;
    })
    .addCase(registerUser.fulfilled, (state, { payload }) => {
      const utilizador = payload;
      state.isLoadingU = false;
      state.utilizador = utilizador;
      toast.success(`Utilizador Inserido ${utilizador.user.login}`);
    })
    .addCase(registerUser.rejected, (state, { payload }) => {
      state.isLoadingU = false;
      toast.error(payload);
    })


    //Login
    .addCase(loginUser.pending, (state) => {
      state.isLoadingU = true;
    })
    .addCase(loginUser.fulfilled, (state, { payload }) => {
      const utilizador  = payload;
      state.isLoadingU = false;
      state.utilizador = utilizador;
      addUserToLocalStorage(utilizador);

      toast.success(`Bem vindo ${utilizador.user.login}`);
    })

    .addCase(loginUser.rejected, (state, { payload }) => {
      state.isLoadingU = false;
      toast.error(payload);
    })


    //Update
    .addCase(updateUser.pending, (state) => {
      state.isLoadingU = true;
    })
    .addCase(updateUser.fulfilled, (state, { payload }) => {
      const utilizador = payload;
      state.isLoadingU = false;
      state.utilizador = utilizador;
      addUserToLocalStorage(utilizador);
      toast.success(`Utilizador atualizado!`);
    })
    .addCase(updateUser.rejected, (state, { payload }) => {
      state.isLoadingU = false;
      toast.error(payload);
    })


    //ListaUtilizador
    .addCase(listaUtilizadores.pending, (state) => {
        //console.log("loading");
        state.isLoadingU = true;
      })
      .addCase(listaUtilizadores.fulfilled, (state, { payload }) => {
        state.isLoadingU = false;
        state.utilizadores = payload.UsersAll;
        //toast.success(`Lista Utilizador obtida!`);
      })
      .addCase(listaUtilizadores.rejected, (state, { payload }) => {
        state.isLoadingU = false;
        toast.error(payload);
      })

    .addCase(clearStore.rejected, (state, action) => {
      toast.error('There was an error..');
    })
  
  },
});


export const { toggleSidebar, logoutUser } = userSlice.actions;


export default userSlice.reducer;
