import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dealerReducer from "./slices/dealerSlice";
import inventoryReducer from "./slices/inventorySlice";
import studioReducer from "./slices/studioSlice";
import micrositeReducer from "./slices/micrositeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dealer: dealerReducer,
    inventory: inventoryReducer,
    studio: studioReducer,
    microsite: micrositeReducer,
  },
});
