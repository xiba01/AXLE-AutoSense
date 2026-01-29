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
            created_at,
            deleted_at
          )
        `,
        )
        .eq("dealer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // --- LOGIC FIX: Handle Empty Arrays Correctly ---
      const studioItems = data.map((car) => {
        let activeStory = null;

        // 1. Handle One-to-Many (Array)
        if (Array.isArray(car.stories)) {
          if (car.stories.length > 0) {
            activeStory = car.stories[0];
          } else {
            activeStory = null; // Explicitly null if empty array
          }
        }
        // 2. Handle One-to-One (Single Object, not Array, not null)
        else if (car.stories && typeof car.stories === "object") {
          activeStory = car.stories;
        }

        return {
          ...car,
          story: activeStory,

          // A. Does this car have ANY story record?
          hasStoryHistory: !!activeStory,

          // B. Is the story currently in the Trash?
          isDeleted: activeStory ? !!activeStory.deleted_at : false,

          // C. Is the story live and NOT deleted?
          hasActiveStory: !!activeStory && !activeStory.deleted_at,

          storyStatus: activeStory ? activeStory.generation_status : "none",
        };
      });

      console.log("🔥 Studio Data Fetched:", studioItems);
      return studioItems;
    } catch (error) {
      console.error("Studio Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  },
);

export const softDeleteStory = createAsyncThunk(
  "studio/softDelete",
  async (storyId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", storyId)
        .select()
        .single();

      if (error) throw error;
      return storyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const restoreStory = createAsyncThunk(
  "studio/restore",
  async (storyId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .update({ deleted_at: null })
        .eq("id", storyId)
        .select()
        .single();

      if (error) throw error;
      return storyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

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
      // --- FETCH ---
      .addCase(fetchStudioData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudioData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;

        state.stats.total = action.payload.length;
        state.stats.showroom = action.payload.filter(
          (i) => i.hasActiveStory,
        ).length;
        state.stats.unexplored = action.payload.filter(
          (i) => !i.hasStoryHistory,
        ).length;
      })
      .addCase(fetchStudioData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- SOFT DELETE ---
      .addCase(softDeleteStory.fulfilled, (state, action) => {
        const carIndex = state.items.findIndex(
          (c) => c.story?.id === action.payload,
        );
        if (carIndex !== -1) {
          state.items[carIndex].hasActiveStory = false;
          state.items[carIndex].isDeleted = true;
          if (state.items[carIndex].story) {
            state.items[carIndex].story.deleted_at = new Date().toISOString();
          }
          state.stats.showroom -= 1;
        }
      })

      // --- RESTORE ---
      .addCase(restoreStory.fulfilled, (state, action) => {
        const carIndex = state.items.findIndex(
          (c) => c.story?.id === action.payload,
        );
        if (carIndex !== -1) {
          state.items[carIndex].hasActiveStory = true;
          state.items[carIndex].isDeleted = false;
          if (state.items[carIndex].story) {
            state.items[carIndex].story.deleted_at = null;
          }
          state.stats.showroom += 1;
        }
      });
  },
});

export default studioSlice.reducer;
