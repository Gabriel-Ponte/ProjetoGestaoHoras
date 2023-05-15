import { configureStore } from '@reduxjs/toolkit';


import projetoSlice from './features/projetos/projetosSlice';
import userSlice from './features/utilizadores/utilizadorSlice';
import allProjetosSlice from './features/allProjetos/allProjetosSlice';
import allDiasSlice from './features/allDias/allDiasSlice';
import diasSlice from './features/dias/diasSlice';
import tipoTrabalhoSlice from './features/tipoTrabalho/tipoTrabalhoSlice';

export const Store = configureStore({
  reducer: {
    utilizador: userSlice,
    projeto: projetoSlice,
    dias: diasSlice,
    allProjetos: allProjetosSlice,
    allDias: allDiasSlice,
    tipoTrabalho: tipoTrabalhoSlice,
  },
});
