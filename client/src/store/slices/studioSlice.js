import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabaseClient";

export const fetchStudioData = createAsyncThunk(
  "studio/fetchData",
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (!user) return rejectWithValue("User not authenticated");

    try {
      const { data, error } = await supabase
        .from("cars")
        .select(
          `
          *,
          stories (
            id,
            generation_status,
            content,
            created_at
          )
        `,
        )
        .eq("dealer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // --- LOGIC FIX HERE ---
      const studioItems = data.map((car) => {
        let activeStory = null;

        // 1. Handle One-to-Many (Array)
        if (Array.isArray(car.stories) && car.stories.length > 0) {
          activeStory = car.stories[0];
        }
        // 2. Handle One-to-One (Single Object) - THIS IS LIKELY YOUR CASE
        else if (car.stories && typeof car.stories === "object") {
          activeStory = car.stories;
        }

        return {
          ...car,
          story: activeStory,
          hasStory: !!activeStory, // True if story exists
          storyStatus: activeStory ? activeStory.generation_status : "none",
        };
      });

      console.log("🔥 Studio Data Fetched:", studioItems); // Debug Log
      return studioItems;
    } catch (error) {
      console.error("Studio Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  },
);

// ... Rest of the file remains the same ...
const initialState = {
  items: [],
  stats: { total: 0, unexplored: 0, showroom: 0 },
  loading: false,
  error: null,
};

const studioSlice = createSlice({
  name: "studio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudioData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudioData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Recalculate Stats
        state.stats.total = action.payload.length;
        state.stats.showroom = action.payload.filter((i) => i.hasStory).length;
        state.stats.unexplored = action.payload.filter(
          (i) => !i.hasStory,
        ).length;
      })
      .addCase(fetchStudioData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studioSlice.reducer;
