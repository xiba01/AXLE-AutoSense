import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabaseClient";

// ... (Keep existing thunks: fetchPublicDealer, fetchPublicInventory, fetchPublicCar exactly as they are) ...
// (I will not repeat the thunk code here to save space, assuming they are unchanged)
export const fetchPublicDealer = createAsyncThunk(
  "microsite/fetchDealer",
  async (dealerId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("dealers")
        .select("id, dealership_name, logo_url, primary_color, website_url")
        .eq("id", dealerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchPublicInventory = createAsyncThunk(
  "microsite/fetchInventory",
  async (dealerId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(
          `
            *,
            stories (
                id,
                generation_status
            )
        `,
        )
        .eq("dealer_id", dealerId)
        // .eq('status', 'published') // Optional: Uncomment to enforce published status
        .order("created_at", { ascending: false });

      if (error) throw error;

      const inventory = data.map((car) => ({
        ...car,
        hasStory:
          car.stories &&
          car.stories.length > 0 &&
          car.stories[0].generation_status === "complete",
        storyId:
          car.stories && car.stories.length > 0 ? car.stories[0].id : null,
      }));

      return inventory;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchPublicCar = createAsyncThunk(
  "microsite/fetchCar",
  async (carId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(
          `
            *,
            stories (
                id, 
                generation_status,
                content
            )
        `,
        )
        .eq("id", carId)
        .single();

      if (error) throw error;

      const activeStory = data.stories?.[0];
      const enrichedCar = {
        ...data,
        storyData: activeStory?.content || null,
        storyId: activeStory?.id || null,
      };

      return enrichedCar;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  currentDealer: null,
  inventory: [],
  activeCar: null,
  // --- SPLIT LOADING STATES ---
  loadingDealer: false,
  loadingInventory: false,
  loadingCar: false,
  error: null,
};

const micrositeSlice = createSlice({
  name: "microsite",
  initialState,
  reducers: {
    clearMicrosite: (state) => {
      state.currentDealer = null;
      state.inventory = [];
      state.activeCar = null;
      state.error = null;
      state.loadingDealer = false;
      state.loadingInventory = false;
      state.loadingCar = false;
    },
  },
  extraReducers: (builder) => {
    // 1. Dealer
    builder.addCase(fetchPublicDealer.pending, (state) => {
      state.loadingDealer = true;
      state.error = null;
    });
    builder.addCase(fetchPublicDealer.fulfilled, (state, action) => {
      state.loadingDealer = false;
      state.currentDealer = action.payload;
    });
    builder.addCase(fetchPublicDealer.rejected, (state, action) => {
      state.loadingDealer = false;
      state.error = action.payload;
    });

    // 2. Inventory
    builder.addCase(fetchPublicInventory.pending, (state) => {
      state.loadingInventory = true;
      state.error = null;
    });
    builder.addCase(fetchPublicInventory.fulfilled, (state, action) => {
      state.loadingInventory = false;
      state.inventory = action.payload;
    });
    builder.addCase(fetchPublicInventory.rejected, (state, action) => {
      state.loadingInventory = false;
      state.error = action.payload;
    });

    // 3. Single Car
    builder.addCase(fetchPublicCar.pending, (state) => {
      state.loadingCar = true;
      state.error = null;
      state.activeCar = null; // Clear stale data
    });
    builder.addCase(fetchPublicCar.fulfilled, (state, action) => {
      state.loadingCar = false;
      state.activeCar = action.payload;
    });
    builder.addCase(fetchPublicCar.rejected, (state, action) => {
      state.loadingCar = false;
      state.error = action.payload;
    });
  },
});

export const { clearMicrosite } = micrositeSlice.actions;
export default micrositeSlice.reducer;
