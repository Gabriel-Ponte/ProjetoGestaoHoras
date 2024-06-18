export const addUserToLocalStorage = (user) => {
  localStorage.setItem('utilizador', JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('utilizador');
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem('utilizador');
  const user = result ? JSON.parse(result) : null;
  return user;
};


export const addProjetoToLocalStorage = (projeto) => {
  localStorage.setItem('projeto', JSON.stringify(projeto));
};

export const removeProjetoFromLocalStorage = () => {
  localStorage.removeItem('projeto');
};

export const getProjetoFromLocalStorage = () => {
  const result = localStorage.getItem('projeto');
  const user = result ? JSON.parse(result) : null;
  return user;
};