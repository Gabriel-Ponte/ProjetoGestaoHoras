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
  updateUserTypeThunk,
  clearStoreThunk,
  deleteUserThunk,
  getUtilizadorThunk,
  postResetPasswordThunk,
  updateResetedPasswordThunk,
} from './utilizadorThunk';



const initialState = {
  isLoadingU: true,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
};

export const deleteUser = createAsyncThunk(
  'utilizador/deleteUtilizador',
  async (id, thunkAPI) => {
    return deleteUserThunk(thunkAPI, id);
  }
);

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

export const updateUserType = createAsyncThunk(
  'utilizador/updateUserType',
  async (user, thunkAPI) => {
    return updateUserTypeThunk('/utilizador/updateUser', user, thunkAPI);
  }
);

export const getUser = createAsyncThunk(
  'utilizador/getUser',
  async (id, thunkAPI) => {
    return getUtilizadorThunk('/utilizador/', thunkAPI, id);
  }
);


export const resetPassword = createAsyncThunk(
  'utilizador/resetPassword',
  async (thunkAPI, email) => {
    return postResetPasswordThunk('/utilizador/resetPassword/', thunkAPI, email);
  }
);

export const updatePassword = createAsyncThunk(
  'utilizador/updateResetedPassword',
  async (thunkAPI, values) => {
    return updateResetedPasswordThunk('/utilizador/updateResetedPassword/', thunkAPI, values);
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
    toggleSidebar: (state, value) => {
      if (value.payload === false || value.payload === true) {
        state.isSidebarOpen = value.payload;
      }
      else {
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


  extraReducers: (builder) => {
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
        const utilizador = payload;
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

      //Update Type
      .addCase(updateUserType.pending, (state) => {
        state.isLoadingU = true;
      })
      .addCase(updateUserType.fulfilled, (state, { payload }) => {
        state.isLoadingU = false;
        toast.success(`Utilizador atualizado!`);
      })
      .addCase(updateUserType.rejected, (state, { payload }) => {
        state.isLoadingU = false;
        toast.error(payload);
      })

      //Get User
      .addCase(getUser.pending, (state) => {
        state.isLoadingU = true;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.isLoadingU = false;
      })
      .addCase(getUser.rejected, (state, { payload }) => {
        state.isLoadingU = false;
        toast.error(payload);
      })


      //Reset password request
      .addCase(resetPassword.pending, (state) => {
        state.isLoadingU = true;
      })
      .addCase(resetPassword.fulfilled, (state, { payload }) => {
        state.isLoadingU = false;
        toast.success("Email enviado!")
      })
      .addCase(resetPassword.rejected, (state, payload) => {
        state.isLoadingU = false;
        if(payload && payload.error){
        toast.error(payload.payload);
      }else{

        toast.error("Ocorreu um erro");
      }
      })


      //Update password
      .addCase(updatePassword.pending, (state) => {
        state.isLoadingU = true;
      })
      .addCase(updatePassword.fulfilled, (state, { payload }) => {
        state.isLoadingU = false;
        if(payload.message){
          toast.success(payload.message);
        }else{
          toast.success("Password alterada com sucesso")
        }
      })
      .addCase(updatePassword.rejected, (state, { payload }) => {
        state.isLoadingU = false;
        if(payload && payload?.error){
        toast.error(payload.error);
      }else{
        toast.error("Ocorreu um erro ao tentar mudar a password");
      }
      })
      //Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoadingU = true;
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.isLoadingU = false;
        toast.success(`Utilizador Eliminado!`);
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
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
