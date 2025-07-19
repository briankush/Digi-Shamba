import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import "./index.css";

// Set axios base URL from Vite env
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
