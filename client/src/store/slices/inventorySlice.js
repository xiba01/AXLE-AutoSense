import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabaseClient";

// ------------------------------------------------------------------
// 1. ASYNC THUNK: FETCH INVENTORY
// ------------------------------------------------------------------
export const fetchInventory = createAsyncThunk(
  "inventory/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// ------------------------------------------------------------------
// 2. ASYNC THUNK: ADD CAR (Uploads Images + Saves DB Row)
// ------------------------------------------------------------------
export const addCar = createAsyncThunk(
  "inventory/add",
  async ({ formData, specsList, photos }, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    console.log("🚨 ATTEMPTING SAVE");
    console.log("User Object:", user);
    console.log("User ID:", user?.id);

    if (!user || !user.id) {
      console.error("❌ No User ID found in Redux!");
      return rejectWithValue("User not authenticated or ID missing");
    }

    try {
      // A. UPLOAD PHOTOS (If any)
      const photoUrls = [];

      if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i];
          const fileExt = file.name.split(".").pop();
          // Path: dealer_id/vin/timestamp_index.ext
          const filePath = `${user.id}/${formData.vin}/${Date.now()}_${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("car_photos")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("car_photos").getPublicUrl(filePath);

          photoUrls.push(publicUrl);
        }
      }

      // B. PREPARE DB ROW
      // We convert the dynamic specs array back into a JSON object for storage
      // giving us a "Golden Record" of the car's tech data.
      const technicalData = specsList.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      const newCar = {
        dealer_id: user.id,
        vin: formData.vin,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year) || 2024,
        trim: formData.trim,
        price: parseFloat(formData.price) || 0,
        mileage: parseInt(formData.mileage) || 0,
        currency: formData.currency,
        photos: photoUrls || [],
        status: "draft",

        color: formData.color,
        condition: formData.condition,

        specs_raw: {
          ...technicalData,
          // We keep them in specs_raw too for the AI to read easily later
          color_name: formData.color,
          condition: formData.condition,
        },
      };

      console.log("📦 Payload sending to Supabase:", newCar);

      // C. INSERT INTO SUPABASE
      const { data, error } = await supabase
        .from("cars")
        .insert(newCar)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Add Car Failed:", error);
      return rejectWithValue(error.message);
    }
  },
);

// ------------------------------------------------------------------
// 3. ASYNC THUNK: DELETE CAR
// ------------------------------------------------------------------
export const deleteCar = createAsyncThunk(
  "inventory/delete",
  async (carId, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("cars").delete().eq("id", carId);

      if (error) throw error;
      return carId; // Return ID to remove from local state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// ------------------------------------------------------------------
// 4. ASYNC THUNK: UPDATE CAR
// ------------------------------------------------------------------
export const updateCar = createAsyncThunk(
  "inventory/update",
  async (
    { carId, formData, specsList, photos, existingPhotos },
    { getState, rejectWithValue },
  ) => {
    const { user } = getState().auth;
    if (!user) return rejectWithValue("User not authenticated");

    try {
      // A. HANDLE NEW PHOTOS
      const newPhotoUrls = [];
      if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i];
          const fileExt = file.name.split(".").pop();
          const filePath = `${user.id}/${formData.vin}/${Date.now()}_new_${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("car_photos")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("car_photos").getPublicUrl(filePath);

          newPhotoUrls.push(publicUrl);
        }
      }

      // Merge existing (kept) photos with new uploads
      const finalPhotoArray = [...(existingPhotos || []), ...newPhotoUrls];

      // B. PREPARE SPECS JSON
      const technicalData = specsList.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      const updates = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        trim: formData.trim,
        price: parseFloat(formData.price) || 0,
        mileage: parseInt(formData.mileage) || 0,

        condition: formData.condition,
        color: formData.color,

        photos: finalPhotoArray,
        specs_raw: {
          ...technicalData,
          color_name: formData.color,
          condition: formData.condition,
        },
        updated_at: new Date().toISOString(),
      };

      // C. UPDATE SUPABASE
      const { data, error } = await supabase
        .from("cars")
        .update(updates)
        .eq("id", carId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// ------------------------------------------------------------------
// 4. THE SLICE
// ------------------------------------------------------------------
const initialState = {
  list: [],
  loading: false,
  uploading: false, // Specific loading state for the heavy addCar process
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchInventory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInventory.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchInventory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add
    builder.addCase(addCar.pending, (state) => {
      state.uploading = true;
      state.error = null;
    });
    builder.addCase(addCar.fulfilled, (state, action) => {
      state.uploading = false;
      state.list.unshift(action.payload); // Add new car to top of list
    });
    builder.addCase(addCar.rejected, (state, action) => {
      state.uploading = false;
      state.error = action.payload;
    });
    // Delete
    builder.addCase(deleteCar.fulfilled, (state, action) => {
      state.list = state.list.filter((car) => car.id !== action.payload);
    });
    builder.addCase(updateCar.fulfilled, (state, action) => {
      const index = state.list.findIndex((car) => car.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload; // Replace the old car with the updated one
      }
      state.uploading = false;
    });
    builder.addCase(updateCar.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(updateCar.rejected, (state) => {
      state.uploading = false;
    });
  },
});

export default inventorySlice.reducer;
