import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import {store} from "./redux/store";
import App from './App.js';

import './css/styles.css';
import './css/bootstrap/bootstrap.min.css';


const rootElement = document.getElementById('root');

document.title = "Conferentia";

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  rootElement
);

