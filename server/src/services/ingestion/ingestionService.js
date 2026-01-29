const { v4: uuidv4 } = require("uuid");
const { createClient } = require("@supabase/supabase-js");
const { cleanNum, cleanInt, normalizeDrivetrain } = require("./normalizer");
const { collectAllBadges } = require("../badges/badgeOrchestrator");
const { CarContextSchema } = require("./schemas");
require("dotenv").config();

// Initialize Supabase (Service Role needed for backend access)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET ||
  process.env.SUPABASE_KEY;

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL is required. Check your .env file.");
}

if (!SUPABASE_SERVICE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_KEY (service role) is required. Check your .env file.",
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function buildCarContext(requestParams) {
  // 1. FIX LOGGING: Handle flat input vs nested input safely
  const logModel =
    requestParams.model || requestParams.identity?.model || "Unknown Model";
  const logVin = requestParams.vin || "UNKNOWN_VIN";

  console.log(`🕵️ Ingestion Started | Model: ${logModel} | VIN: ${logVin}`);

  let dbCar = null;
  let apiData = {}; // This will hold the specs_raw from DB

  try {
    if (requestParams.car_id) {
      // FETCH FROM DB
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", requestParams.car_id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Car not found in database");

      dbCar = data;
      apiData = data.specs_raw || {};
      console.log(
        `✅ Retrieved from DB: ${dbCar.year} ${dbCar.make} ${dbCar.model}`,
      );
    } else {
      console.warn("⚠️ No Car ID provided. Using manual input params.");
      apiData = {};
    }
  } catch (error) {
    console.error("❌ DB Fetch Error:", error.message);
    // Non-fatal, we continue with manual data
  }

  // 2. MERGE DATA SOURCES
  // FIX: Access flat properties (requestParams.make) instead of nested (requestParams.identity.make)
  const raw = {
    // Identity
    make: dbCar?.make || requestParams.make || requestParams.identity?.make,
    model: dbCar?.model || requestParams.model || requestParams.identity?.model,
    year: dbCar?.year || requestParams.year || requestParams.identity?.year,
    trim: dbCar?.trim || apiData.trim || requestParams.trim,
    vin: dbCar?.vin || requestParams.vin,

    // Specs from JSON Blob (RapidAPI data from DB)
    ...apiData,

    // Overrides
    color: dbCar?.color || requestParams.color,
    mileage: dbCar?.mileage || requestParams.mileage,
    price: dbCar?.price || requestParams.price,
  };

  // 3. NORMALIZE SPECS
  const hp = cleanInt(raw.engineHp || raw.maxPowerKw);
  const torque = cleanInt(raw.maximumTorqueNM);
  const zeroSixty = cleanNum(raw.acceleration0To100KmPerHS);

  const fuel = cleanNum(
    raw.mixedFuelConsumptionPer100KmL || raw.cityFuelPer100KmL,
  );

  const range = cleanInt(raw.electricRangeKm || raw.rangeKm);
  const seats = cleanInt(raw.numberOfSeats);
  const trunk = cleanInt(raw.maxTrunkCapacityL || raw.cargoVolumeM3);
  const transmission =
    raw.transmission || raw.transmissionStyle || raw.numberOfGears;

  // 4. DERIVE INTELLIGENCE
  const isElectric =
    cleanInt(raw.electricRangeKm) > 0 ||
    raw.fuelType === "Electric" ||
    raw.engineType === "Electric";

  const isSport = (zeroSixty !== null && zeroSixty < 6.0) || hp > 280;
  const isFamily = seats >= 5 && trunk > 400;
  const isEco = (fuel !== null && fuel < 6.0) || isElectric;

  // 5. GENERATE BADGES (Orchestrator)
  const tempContext = {
    identity: {
      make: raw.make,
      model: raw.model,
      year: cleanInt(raw.year),
      trim: raw.trim,
      series: raw.series,
    },
    normalized_specs: {
      efficiency: {
        is_electric: isElectric,
        emission_standard: raw.emissionStandards,
        fuel_combined_l_100km: fuel,
      },
      performance: {
        hp: hp,
        zero_to_sixty_sec: zeroSixty,
      },
    },
    raw_api_dump: raw,
    request_params: {
      dealer_color_input: raw.color,
      dealer_mileage_input: raw.mileage,
    },
  };

  const badges = await collectAllBadges(tempContext);

  // 6. CONSTRUCT FINAL CONTEXT OBJECT
  const context = {
    context_id: `ctx_${uuidv4()}`,
    car_id: dbCar?.id || null,
    created_at: new Date().toISOString(),

    request_params: {
      template_style: requestParams.template || "Cinematic",
      dealer_color_input: raw.color,
      dealer_mileage_input: raw.mileage,
    },

    identity: {
      vin: raw.vin,
      make: raw.make,
      model: raw.model,
      trim: raw.trim,
      year: cleanInt(raw.year),
      body_type: raw.bodyType || "Sedan",
      generation: raw.generation,
      series: raw.series,
    },

    visual_directives: {
      image_prompt_color: `${raw.color}, glossy finish`,
      body_shape_prompt: `${raw.year} ${raw.make} ${raw.model} ${raw.bodyType || ""}`,
      interior_prompt: `${raw.make} modern cockpit, premium interior`,
    },

    normalized_specs: {
      performance: {
        hp: hp,
        torque_nm: torque || null,
        zero_to_sixty_sec: zeroSixty,
        top_speed_kmh: cleanInt(raw.maxSpeedKmPerH),
        drivetrain: normalizeDrivetrain(raw.driveWheels || raw.driveType),
        transmission: transmission,
        engine_cylinders: cleanInt(
          raw.numberOfCylinders || raw.engineNumberOfCylinders,
        ),
      },
      efficiency: {
        fuel_combined_l_100km: fuel,
        tank_capacity_l: cleanInt(raw.fuelTankCapacityL),
        range_km: cleanInt(raw.rangeKm),
        is_electric: isElectric,
        emission_standard: raw.emissionStandards || raw.fuelGrade,
      },
      dimensions: {
        trunk_capacity_l: trunk || null,
        seats: seats,
        length_mm: cleanInt(raw.lengthMm),
        weight_kg: cleanInt(raw.curbWeightKg),
      },
      safety: {
        rating_text: raw.safetyAssessment,
        airbags: 8,
        assist_systems: ["ABS", "Traction Control"],
      },
    },

    derived_intelligence: {
      vehicle_state: {
        is_new: raw.mileage < 200,
        is_low_mileage: raw.mileage < 30000,
        mileage_category: raw.mileage < 30000 ? "Low" : "Average",
      },
      classification: {
        is_sport_car: isSport || false,
        is_family_car: isFamily || false,
        is_eco_car: isEco || false,
      },
      badges_to_suggest: badges.map((b) => b.id),
    },

    certifications: badges,
    raw_api_dump: apiData,
  };

  // 7. VALIDATE
  try {
    const validated = CarContextSchema.parse(context);
    console.log("✅ Context Built Successfully");
    return validated;
  } catch (err) {
    console.error("❌ Schema Validation Failed:");
    if (err.errors) {
      err.errors.forEach((e) =>
        console.error(
          `   -> Path: [${e.path.join(" > ")}] | Error: ${e.message}`,
        ),
      );
    } else {
      console.error(err);
    }
    throw new Error("Ingestion Agent produced invalid data");
  }
}

module.exports = { buildCarContext };
