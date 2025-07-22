import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import "./index.css";

// set baseURL from Vite env
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// Make sure the app is mounted only once
// Check for any duplicate React.StrictMode or duplicate mounting
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Make sure there's no second call to ReactDOM.render or createRoot
