import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dealerReducer from "./slices/dealerSlice"; // <--- Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dealer: dealerReducer, // <--- Add to store
  },
});
