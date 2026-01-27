import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <--- Import this
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 
        HeroUI needs the useNavigate hook for its internal links to work 
        correctly with React Router, so the Router must be higher up.
      */}
      <BrowserRouter>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
