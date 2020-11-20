import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import reduxStore from 'src/config/redux/store';
import * as serviceWorker from './serviceWorker';
import App from './App';

// redux

ReactDOM.render((
  <CookiesProvider>
    <Provider store={reduxStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
), document.getElementById('root'));

serviceWorker.unregister();
