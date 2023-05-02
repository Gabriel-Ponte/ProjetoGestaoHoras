import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearAllDiasState } from '../allDias/allDiasSlice';
import { clearAllProjetosState } from '../allProjetos/allProjetosSlice';
import { clearValues } from '../projetos/projetosSlice';
import { logoutUser } from './utilizadorSlice';



export const showAllUtilizadores = async (_, thunkAPI) => {
    try {
      const resp = await customFetch.get('/utilizador');
      return resp.data;
    } catch (error) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }
  };
  
export const registerUserThunk = async (url, user, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, user);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const loginUserThunk = async (url, user, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, user);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};


export const updateUserThunk = async (url, user, thunkAPI) => {
  try {
    const resp = await customFetch.patch(url, user);
    return resp.data;

  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const clearStoreThunk = async (message, thunkAPI) => {
  try {
    //thunkAPI.dispatch(clearAllProjetosState());
    //thunkAPI.dispatch(clearAllDiasState());
    thunkAPI.dispatch(clearValues());
    thunkAPI.dispatch(logoutUser(message));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};


/*
class CriarUtilizador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      utilizador: 'NomeUser',
      selectTipo: '',
      nome: '',
      password: '',
      email: '',
      foto: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    // TODO: Handle form submission
  }


*/
 