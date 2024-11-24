// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import { store, persistor } from './redux/store';
import Dashboard from './components/Dashboard';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <h1>Todo</h1>
      <Dashboard />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
