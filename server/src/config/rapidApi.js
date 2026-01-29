const axios = require("axios");
require("dotenv").config();

const rapidApiClient = axios.create({
  baseURL: `https://car-specs.p.rapidapi.com/v2`, // 👈 UPDATED TO V2
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": process.env.RAPIDAPI_HOST,
    "Content-Type": "application/json",
  },
});

const fetchFromApi = async (
  endpoint,
  params = {},
  method = "GET",
  data = null
) => {
  try {
    console.log(`📡 RapidAPI Call: [${method}] ${endpoint}`);
    const response = await rapidApiClient({
      method,
      url: endpoint,
      params,
      data,
    });
    return response.data;
  } catch (error) {
    // Log the specific API error message if available
    const apiMsg = error.response?.data?.message || error.message;
    console.error(`❌ RapidAPI Error [${endpoint}]:`, apiMsg);
    throw new Error(`External API Error: ${apiMsg}`);
  }
};

module.exports = { fetchFromApi };
