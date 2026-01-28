import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dealerReducer from "./slices/dealerSlice";
import inventoryReducer from "./slices/inventorySlice";
import studioReducer from "./slices/studioSlice"; // <--- Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dealer: dealerReducer,
    inventory: inventoryReducer,
    studio: studioReducer, // <--- Add
  },
});
