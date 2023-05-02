import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/index.css';
import App from './App';
import { Store } from './Store';
import { Provider } from 'react-redux';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={Store}>
    <App tab='home' />
  </Provider>
);