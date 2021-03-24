import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxStore from 'src/config/redux/store';
import * as serviceWorker from './serviceWorker';
import App from './App';

const rootElement = document.getElementById('root');
const RootApp = () => (
  <Provider store={reduxStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(<RootApp />, rootElement);

/**
 * Service worker
 */
serviceWorker.register();
