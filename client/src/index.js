import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Store } from './Store';
import { Provider } from 'react-redux';
import Wrapper from './assets/wrappers/indexCss';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Wrapper>
  <Provider store={Store}>
    <App tab='home' />
  </Provider>
  </Wrapper>
);