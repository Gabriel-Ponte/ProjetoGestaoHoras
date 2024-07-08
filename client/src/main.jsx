import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Store } from './Store';
import { Provider } from 'react-redux';
import Wrapper from './assets/wrappers/indexCss';



ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wrapper>
      <Provider store={Store}>
        <App tab="home" />
      </Provider>
    </Wrapper>
  </StrictMode>
);
