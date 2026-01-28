import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // We need this to give every spec a unique ID for the UI list

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST =
  import.meta.env.VITE_RAPIDAPI_HOST || "car-specs.p.rapidapi.com";

// -----------------------------------------------------------
// 1. HELPER: CamelCase to Title Case
// Converts "maxTorqueNM" -> "Max Torque NM"
// -----------------------------------------------------------
const formatLabel = (key) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// -----------------------------------------------------------
// 2. THE NORMALIZER (The Cleaning Logic)
// -----------------------------------------------------------
export const normalizeCarData = (apiData) => {
  if (!apiData) return null;

  // A. Extract Core Identity (These go into the Fixed Form inputs)
  // We remove them from the general specs list so they don't appear twice.
  const identity = {
    make: apiData.make || "",
    model: apiData.model || "",
    year: apiData.year || apiData.production_start_year || "", // API varies sometimes
    trim: apiData.trim || "",
    bodyType: apiData.bodyType || "",
    driveType: apiData.driveWheels || "",
    transmission: apiData.transmission || "",
    engineHp: apiData.engineHp || "",
  };

  // B. Define Keys to Ignore (Already in Identity or Useless)
  const ignoredKeys = [
    "id",
    // "make",
    // "model",
    // "generation",
    // "series",
    // "trim",
    // "bodyType",
    // "driveWheels",
    // "transmission",
    // "engineHp",
    // "production_start_year",
    // "production_end_year",
  ];

  // C. Flatten the rest into the Specs Array (For the Sidebar)
  const specsList = Object.entries(apiData)
    .filter(([key, value]) => {
      // Filter out ignored keys, nulls, empty strings, and "N/A"
      return (
        !ignoredKeys.includes(key) &&
        value !== null &&
        value !== "" &&
        value !== "N/A" &&
        value !== "null"
      );
    })
    .map(([key, value]) => ({
      id: uuidv4(), // Unique ID for React rendering (Drag/Drop/Delete)
      key: key, // Original API key (for DB storage if needed)
      label: formatLabel(key), // Readable Label
      value: String(value), // Ensure it's a string for Input fields
    }));

  return { identity, specsList };
};

// -----------------------------------------------------------
// 3. THE FETCHER
// -----------------------------------------------------------
export const fetchTrimSpecs = async (trimId) => {
  if (!trimId) throw new Error("Trim ID is required");

  const options = {
    method: "GET",
    url: `https://${RAPIDAPI_HOST}/v2/cars/trims/${trimId}`,
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return normalizeCarData(response.data);
  } catch (error) {
    console.error("RapidAPI Fetch Error:", error);
    throw error;
  }
};
