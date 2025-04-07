import { combineReducers, configureStore } from "@reduxjs/toolkit";
import canvasSlice from "./canvasSlice";
import socketSlice from "./socketSlice";
import storage from "redux-persist/lib/storage";

const store = configureStore({
  reducer: {
    socket: socketSlice.reducer,
    canvas: canvasSlice.reducer,
  },
});

export default store;
