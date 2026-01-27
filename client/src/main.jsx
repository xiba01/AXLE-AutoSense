import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <--- 1. Import this
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

document.documentElement.classList.remove("dark");
localStorage.setItem("theme", "light");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 2. Wrap App in BrowserRouter */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
