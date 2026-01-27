import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabaseClient";

// --- Async Thunk: Fetch Profile from DB ---
export const fetchDealerProfile = createAsyncThunk(
  "dealer/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("dealers")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  profile: null, // Stores { id, dealership_name, logo_url, primary_color, subscription_tier }
  loading: false,
  error: null,
};

const dealerSlice = createSlice({
  name: "dealer",
  initialState,
  reducers: {
    // Call this after a successful payment to update UI instantly
    updateSubscription: (state, action) => {
      if (state.profile) {
        state.profile.subscription_tier = action.payload; // 'free' or 'pro'
      }
    },
    // Call this after branding setup
    updateBranding: (state, action) => {
      if (state.profile) {
        state.profile.dealership_name = action.payload.name;
        state.profile.primary_color = action.payload.color;
        state.profile.logo_url = action.payload.logo;
      }
    },
    // Clear data on logout
    clearDealerData: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchDealerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateSubscription, updateBranding, clearDealerData } =
  dealerSlice.actions;
export default dealerSlice.reducer;
