import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Store } from './Store';
import { Provider } from 'react-redux';
import Wrapper from '@/styles/indexCss';
import './index.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wrapper>
      <Provider store={Store}>
        <App tab="home" />
      </Provider>
    </Wrapper>
  </StrictMode>
);
