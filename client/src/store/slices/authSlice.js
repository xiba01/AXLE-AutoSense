import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true, // Crucial for "Waiting for auth check" state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      state.user = action.payload?.user || null;
      state.isAuthenticated = !!action.payload?.user;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setSession, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
