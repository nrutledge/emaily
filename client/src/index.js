import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import reactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

reactDOM.render(
    <Provider store={store}><App /></Provider>, 
    document.querySelector('#root')
);