const { analyzeCar } = require("./src/services/ai/analystAgent");

// This is the EXACT output you got from the Ingestion Agent in Part 1
const mockIngestionOutput = {
  identity: {
    vin: "UNKNOWN_VIN",
    make: "Dacia",
    model: "Duster",
    trim: "1.5 Blue dCi (115 Hp) 4WD",
    year: 2022,
    body_type: "SUV",
    generation: "Duster II (facelift 2022)",
    series: "Duster II (facelift 2022) SUV",
  },
  visual_directives: {
    image_prompt_color: "Phytonic Blue Metallic, glossy finish",
    body_shape_prompt: "2022 Dacia Duster SUV",
    interior_prompt: "Dacia modern cockpit, premium interior",
  },
  normalized_specs: {
    performance: {
      hp: 115,
      torque_nm: 260,
      zero_to_sixty_sec: 10.2,
      top_speed_kmh: 175,
      drivetrain: "AWD",
      transmission: "6 gears, manual transmission",
      engine_cylinders: 4,
    },
    efficiency: {
      fuel_combined_l_100km: null,
      tank_capacity_l: 50,
      range_km: null,
      is_electric: false,
      emission_standard: "Diesel",
    },
    dimensions: {
      trunk_capacity_l: 1444,
      seats: 5,
      length_mm: 4341,
      weight_kg: 1439,
    },
    safety: {
      airbags: 8,
      assist_systems: ["ABS", "Traction Control"],
    },
  },
  derived_intelligence: {
    vehicle_state: {
      is_new: false,
      is_low_mileage: true,
      mileage_category: "Low",
    },
    classification: {
      is_sport_car: false,
      is_family_car: true,
      is_eco_car: false,
    },
    badges_to_suggest: ["critair_1", "low_mileage"],
  },
  certifications: [
    {
      badge_id: "critair_1",
      label: "Crit'Air 1",
      category: "Regulatory",
      icon: "check-circle",
      color: "purple",
      evidence: "Euro 5/6 Standard",
    },
    {
      badge_id: "low_mileage",
      label: "Low Mileage",
      category: "Luxury",
      icon: "clock",
      color: "blue",
      evidence: "Below Market Avg",
    },
  ],
  raw_api_dump: {
    id: 151690,
    make: "Dacia",
    model: "Duster",
    generation: "Duster II (facelift 2022)",
    series: "Duster II (facelift 2022) SUV",
    trim: "1.5 Blue dCi (115 Hp) 4WD",
    bodyType: "SUV",
    numberOfSeats: "5",
    lengthMm: "4341 mm",
    widthMm: "1804 mm",
    heightMm: "1682 mm",
    wheelbaseMm: "2676 mm",
    frontTrackMm: "1563 mm",
    rearTrackMm: "1580 mm",
    curbWeightKg: "1439 kg",
    groundClearanceMm: "214 mm",
    trailerLoadWithBreaksKg: "1500 kg",
    payloadKg: "506 kg",
    fullWeightKg: "1945 kg",
    cargoVolumeM3: "1444 l",
    maximumTorqueNM: "260 Nm @ 1750-2750 rpm.",
    cylinderLayout: "Inline",
    numberOfCylinders: "4",
    valvesPerCylinder: "2",
    boostType: "Turbocharger, Intercooler",
    enginePlacement: "Front, Transverse",
    capacityCm3: "1461 cm3",
    engineHp: "115 Hp @ 3750 rpm.",
    driveWheels: "All wheel drive (4x4)",
    numberOfGears: "6 gears, manual transmission",
    fuelTankCapacityL: "50 l",
    acceleration0To100KmPerHS: "10.2 sec",
    maxSpeedKmPerH: "175 km/h",
    fuelGrade: "Diesel",
    rearBrakes: "Drum, 9 mm",
    frontBrakes: "Ventilated discs, 280 mm",
    steeringType: "Steering rack and pinion",
    numberOfDoors: "5",
  },
};

async function run() {
  try {
    const report = await analyzeCar(mockIngestionOutput);
    console.log("\n------ FINAL REPORT ------");
    console.log(JSON.stringify(report, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();
