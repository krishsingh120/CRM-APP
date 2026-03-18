import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom'

// import {BrowserRouter} from ''
import App from './App.jsx';
import store from './Redux/store.js'





ReactDOM.createRoot(document.getElementById('root')).render(
   <BrowserRouter>
        <Provider store={store}>
            <App />
            <Toaster position='top-right'/>
        </Provider>
    </BrowserRouter>

);
