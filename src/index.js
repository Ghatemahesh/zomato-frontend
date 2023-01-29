import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./../src/css/bootstrap-1.css"
import {BrowserRouter} from "react-router-dom"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);

