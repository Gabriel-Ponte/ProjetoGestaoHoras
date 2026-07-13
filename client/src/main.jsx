import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Store } from './Store';
import { Provider } from 'react-redux';
import Wrapper from '@/styles/indexCss';
import { ThemeProvider, MuiThemeBridge } from '@/context/ThemeContext';
import '@/i18n'; // side-effect: initialises i18next (PT / EN / ES)
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wrapper>
      <Provider store={Store}>
        <ThemeProvider>
          <MuiThemeBridge>
            <App tab="home" />
          </MuiThemeBridge>
        </ThemeProvider>
      </Provider>
    </Wrapper>
  </StrictMode>
);
