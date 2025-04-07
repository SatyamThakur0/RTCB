import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CanvasProvider from "../store/canvasContext";
import SocketProvider from "../store/socketContext";
import store from "../store/redux/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <CanvasProvider>
          <App />
        </CanvasProvider>
      </SocketProvider>
    </Provider>
  // </StrictMode>
);
