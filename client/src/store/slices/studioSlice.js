import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabaseClient";

// ------------------------------------------------------------------
// 1. ASYNC THUNK: FETCH STUDIO DATA (CARS + STORIES)
// ------------------------------------------------------------------
export const fetchStudioData = createAsyncThunk(
  "studio/fetchData",
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (!user) return rejectWithValue("User not authenticated");

    try {
      // Fetch Cars AND their associated Stories in one request (Left Join)
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

      // Transform data for easier UI consumption
      const studioItems = data.map((car) => {
        // Check if there is a story array and if it has items
        const activeStory =
          car.stories && car.stories.length > 0 ? car.stories[0] : null;

        return {
          ...car,
          story: activeStory, // Attach the story object directly
          hasStory: !!activeStory, // Boolean flag for easy filtering
          storyStatus: activeStory ? activeStory.generation_status : "none",
        };
      });

      return studioItems;
    } catch (error) {
      console.error("Studio Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  },
);

// ------------------------------------------------------------------
// 2. THE SLICE
// ------------------------------------------------------------------
const initialState = {
  items: [], // The full list of cars with story metadata
  stats: {
    total: 0,
    unexplored: 0,
    showroom: 0,
  },
  loading: false,
  error: null,
};

const studioSlice = createSlice({
  name: "studio",
  initialState,
  reducers: {
    // We might add reducers later to handle "Story Created" events instantly
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudioData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudioData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;

        // Calculate Stats automatically
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
