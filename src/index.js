// scroll bar
import 'simplebar/src/simplebar.css';
import './assets/main.css'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';


import storage2 from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { createStore } from 'redux';

import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
//  
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import allReducers from './redux/reducers';

// ----------------------------------------------------------------------





const persistConfig = {
  key: 'root',
  storage: storage2,
  stateReconciler: autoMergeLevel2,
  blacklist: ['cartManager', 'loginPage', 'searchFilter']
};
const pReducer = persistReducer(persistConfig, allReducers);

const store=createStore(pReducer)
const persistor = persistStore(store);



ReactDOM.render(
  <HelmetProvider>
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
      </PersistGate>
    </Provider>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
