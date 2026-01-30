/**
 * BADGE REGISTRY
 * The Single Source of Truth for all AutoSense Certifications.
 *
 * SCHEMA DEFINITION:
 * id: Unique key (e.g. 'SAFETY_NHTSA_5')
 * label: Human readable title
 * category: 'Safety' | 'Eco' | 'Regulatory' | 'Efficiency' | 'Award' | 'Reliability' | 'Technology'
 * visuals: { image_path: 'filename.png', alt: 'description' }
 * logic_config:
 *    region: Array of ISO country codes ['US', 'FR', 'DE', 'EU'] or ['GLOBAL']
 *    group: Mutually exclusive group ID (e.g. 'NCAP_RATING'). Used to de-dupe (only show highest).
 *    rank: Priority (100 = Highest). Higher rank overrides lower rank in same group.
 */

const BADGE_REGISTRY = {
  // ===========================================================================
  // 🛡️ CATEGORY 1: SAFETY & CRASHWORTHINESS
  // ===========================================================================

  // --- USA (NHTSA) ---
  SAFETY_NHTSA_5: {
    id: "SAFETY_NHTSA_5",
    label: "NHTSA 5-Star Safety Rating",
    category: "Safety",
    retrieval_method: "API",
    visuals: {
      image_path: "safety_nhtsa_5star.png",
      alt_text: "Official NHTSA 5-Star Safety Rating Shield",
    },
    logic_config: {
      region: ["US", "CA"],
      group: "NHTSA_RATING",
      rank: 100,
    },
  },
  SAFETY_NHTSA_4: {
    id: "SAFETY_NHTSA_4",
    label: "NHTSA 4-Star Safety Rating",
    category: "Safety",
    retrieval_method: "API",
    visuals: {
      image_path: "safety_nhtsa_4star.png",
      alt_text: "NHTSA 4-Star Safety Rating",
    },
    logic_config: {
      region: ["US", "CA"],
      group: "NHTSA_RATING",
      rank: 50, // Lower rank than 5-Star
    },
  },

  // --- USA (IIHS) ---
  SAFETY_IIHS_TSP_PLUS: {
    id: "SAFETY_IIHS_TSP_PLUS",
    label: "IIHS Top Safety Pick+",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_iihs_tsp_plus.png",
      alt_text: "IIHS Top Safety Pick Plus Gold Logo",
    },
    logic_config: {
      region: ["US"],
      group: "IIHS_AWARD",
      rank: 100,
    },
  },
  SAFETY_IIHS_TSP: {
    id: "SAFETY_IIHS_TSP",
    label: "IIHS Top Safety Pick",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_iihs_tsp.png",
      alt_text: "IIHS Top Safety Pick Silver Logo",
    },
    logic_config: {
      region: ["US"],
      group: "IIHS_AWARD",
      rank: 80,
    },
  },

  // --- EUROPE (Euro NCAP) ---
  SAFETY_EURONCAP_5: {
    id: "SAFETY_EURONCAP_5",
    label: "Euro NCAP 5 Stars",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_euroncap_5.png",
      alt_text: "Euro NCAP 5-Star Rating",
    },
    logic_config: {
      region: ["EU", "UK"],
      group: "EURONCAP_RATING",
      rank: 100,
    },
  },
  SAFETY_EURONCAP_ADV: {
    id: "SAFETY_EURONCAP_ADV",
    label: "Euro NCAP Advanced",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_euroncap_advanced.png",
      alt_text: "Euro NCAP Advanced Reward for Safety Tech",
    },
    logic_config: {
      region: ["EU", "UK"],
      group: "EURONCAP_SPECIAL",
      rank: 90,
    },
  },

  // --- GLOBAL REGIONS (ANCAP, JNCAP, LATIN, ASEAN, C-NCAP) ---
  SAFETY_ANCAP_5: {
    id: "SAFETY_ANCAP_5",
    label: "ANCAP 5 Stars",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_ancap_5.png",
      alt_text: "Australasian NCAP 5-Star Rating",
    },
    logic_config: {
      region: ["AU", "NZ"],
      group: "REGIONAL_NCAP",
      rank: 100,
    },
  },
  SAFETY_JNCAP_5: {
    id: "SAFETY_JNCAP_5",
    label: "JNCAP 5 Stars",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_jncap_5.png",
      alt_text: "Japan NCAP 5-Star Rating",
    },
    logic_config: {
      region: ["JP"],
      group: "REGIONAL_NCAP",
      rank: 100,
    },
  },
  SAFETY_LATINNCAP_5: {
    id: "SAFETY_LATINNCAP_5",
    label: "Latin NCAP 5 Stars",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_latinncap_5.png",
      alt_text: "Latin NCAP 5-Star Rating",
    },
    logic_config: {
      region: ["MX", "BR", "AR", "CO"],
      group: "REGIONAL_NCAP",
      rank: 100,
    },
  },
  SAFETY_ASEANNCAP_5: {
    id: "SAFETY_ASEANNCAP_5",
    label: "ASEAN NCAP 5 Stars",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_aseanncap_5.png",
      alt_text: "ASEAN NCAP 5-Star Rating",
    },
    logic_config: {
      region: ["MY", "TH", "ID", "VN", "PH"],
      group: "REGIONAL_NCAP",
      rank: 100,
    },
  },
  SAFETY_CNCAP_5: {
    id: "SAFETY_CNCAP_5",
    label: "C-NCAP 5 Stars",
    category: "Safety",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "safety_cncap_5.png",
      alt_text: "China NCAP 5-Star Rating",
    },
    logic_config: {
      region: ["CN"],
      group: "REGIONAL_NCAP",
      rank: 100,
    },
  },

  // ===========================================================================
  // 🌿 CATEGORY 2: ENVIRONMENTAL ACCESS (REGULATORY STICKERS)
  // ===========================================================================

  // --- FRANCE (Crit'Air) ---
  ECO_CRITAIR_0: {
    id: "ECO_CRITAIR_0",
    label: "Crit'Air 0 (Electric/Hydrogen)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_critair_0.png",
      alt_text: "French Crit'Air 0 Green Sticker",
    },
    logic_config: {
      region: ["FR"],
      group: "FR_CRITAIR",
      rank: 100, // Best possible rating
    },
  },
  ECO_CRITAIR_1: {
    id: "ECO_CRITAIR_1",
    label: "Crit'Air 1 (Gas Euro 5/6)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_critair_1.png",
      alt_text: "French Crit'Air 1 Purple Sticker",
    },
    logic_config: {
      region: ["FR"],
      group: "FR_CRITAIR",
      rank: 90,
    },
  },
  ECO_CRITAIR_2: {
    id: "ECO_CRITAIR_2",
    label: "Crit'Air 2 (Diesel Euro 5/6)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_critair_2.png",
      alt_text: "French Crit'Air 2 Yellow Sticker",
    },
    logic_config: {
      region: ["FR"],
      group: "FR_CRITAIR",
      rank: 80,
    },
  },
  ECO_CRITAIR_3: {
    id: "ECO_CRITAIR_3",
    label: "Crit'Air 3 (Older Gas/Diesel)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_critair_3.png",
      alt_text: "French Crit'Air 3 Orange Sticker",
    },
    logic_config: {
      region: ["FR"],
      group: "FR_CRITAIR",
      rank: 70,
    },
  },

  // --- GERMANY (Umweltplakette) ---
  ECO_DE_UMWELT_4: {
    id: "ECO_DE_UMWELT_4",
    label: "Umweltplakette 4 (Green)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_de_umwelt_4.png",
      alt_text: "German Green Zone Sticker",
    },
    logic_config: {
      region: ["DE"],
      group: "DE_EMISSION",
      rank: 100,
    },
  },
  ECO_DE_EKENNZEICHEN: {
    id: "ECO_DE_EKENNZEICHEN",
    label: "E-Kennzeichen (EV)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_de_ekennzeichen.png",
      alt_text: "German Electric Vehicle License Badge",
    },
    logic_config: {
      region: ["DE"],
      group: "DE_EV_STATUS",
      rank: 100,
    },
  },

  // --- SPAIN (DGT) ---
  ECO_ES_DGT_0: {
    id: "ECO_ES_DGT_0",
    label: "Etiqueta 0 (Zero)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_es_dgt_0.png",
      alt_text: "Spanish DGT Zero Emissions Blue Sticker",
    },
    logic_config: {
      region: ["ES"],
      group: "ES_DGT",
      rank: 100,
    },
  },
  ECO_ES_DGT_ECO: {
    id: "ECO_ES_DGT_ECO",
    label: "Etiqueta ECO",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_es_dgt_eco.png",
      alt_text: "Spanish DGT ECO Green/Blue Sticker",
    },
    logic_config: {
      region: ["ES"],
      group: "ES_DGT",
      rank: 90,
    },
  },
  ECO_ES_DGT_C: {
    id: "ECO_ES_DGT_C",
    label: "Etiqueta C (Green)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_es_dgt_c.png",
      alt_text: "Spanish DGT C Green Sticker",
    },
    logic_config: {
      region: ["ES"],
      group: "ES_DGT",
      rank: 80,
    },
  },

  // --- UK (London TFL) ---
  ECO_UK_ULEZ: {
    id: "ECO_UK_ULEZ",
    label: "ULEZ Compliant",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_uk_ulez.png",
      alt_text: "Ultra Low Emission Zone Compliant",
    },
    logic_config: {
      region: ["UK", "GB"],
      group: "UK_EMISSION",
      rank: 100,
    },
  },

  // --- BELGIUM ---
  ECO_BE_LEZ: {
    id: "ECO_BE_LEZ",
    label: "LEZ Compliant (Belgium)",
    category: "Regulatory",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "eco_be_lez.png",
      alt_text: "Low Emission Zone Belgium",
    },
    logic_config: {
      region: ["BE"],
      group: "BE_EMISSION",
      rank: 100,
    },
  },

  // ===========================================================================
  // 🔋 CATEGORY 3: EFFICIENCY & ENERGY LABELS
  // ===========================================================================

  // --- EU ENERGY LABELS ---
  ENERGY_EU_A_PLUS: {
    id: "ENERGY_EU_A_PLUS",
    label: "EU Energy Class A+",
    category: "Eco",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "energy_eu_a_plus.png",
      alt_text: "EU Energy Efficiency Class A+",
    },
    logic_config: {
      region: ["EU", "UK"],
      group: "EU_ENERGY_LABEL",
      rank: 100,
    },
  },
  ENERGY_EU_A: {
    id: "ENERGY_EU_A",
    label: "EU Energy Class A",
    category: "Eco",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "energy_eu_a.png",
      alt_text: "EU Energy Efficiency Class A",
    },
    logic_config: {
      region: ["EU", "UK"],
      group: "EU_ENERGY_LABEL",
      rank: 90,
    },
  },
  ENERGY_EU_B: {
    id: "ENERGY_EU_B",
    label: "EU Energy Class B",
    category: "Eco",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "energy_eu_b.png",
      alt_text: "EU Energy Efficiency Class B",
    },
    logic_config: {
      region: ["EU", "UK"],
      group: "EU_ENERGY_LABEL",
      rank: 80,
    },
  },

  // --- USA (EPA) ---
  ENERGY_EPA_SMARTWAY_ELITE: {
    id: "ENERGY_EPA_SMARTWAY_ELITE",
    label: "EPA SmartWay Elite",
    category: "Eco",
    retrieval_method: "API",
    visuals: {
      image_path: "energy_epa_smartway_elite.png",
      alt_text: "EPA SmartWay Elite Certification",
    },
    logic_config: {
      region: ["US"],
      group: "EPA_RATING",
      rank: 100,
    },
  },
  ENERGY_EPA_SMARTWAY: {
    id: "ENERGY_EPA_SMARTWAY",
    label: "EPA SmartWay",
    category: "Eco",
    retrieval_method: "API",
    visuals: {
      image_path: "energy_epa_smartway.png",
      alt_text: "EPA SmartWay Certification",
    },
    logic_config: {
      region: ["US"],
      group: "EPA_RATING",
      rank: 90,
    },
  },

  // --- GREEN NCAP (EU) ---
  ENERGY_GREENNCAP_5: {
    id: "ENERGY_GREENNCAP_5",
    label: "Green NCAP 5 Stars",
    category: "Eco",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "energy_greenncap_5.png",
      alt_text: "Green NCAP 5-Star Efficiency Rating",
    },
    logic_config: {
      region: ["EU", "UK"],
      group: "GREEN_NCAP",
      rank: 100,
    },
  },

  // --- GLOBAL ---
  ENERGY_ZERO_EMISSION: {
    id: "ENERGY_ZERO_EMISSION",
    label: "Zero Emission Vehicle",
    category: "Eco",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "energy_zero_emission_generic.png",
      alt_text: "Zero Emission Vehicle Identifier",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "EMISSION_TYPE",
      rank: 100,
    },
  },

  // ===========================================================================
  // 🏆 CATEGORY 4: JOURNALISM & PRESTIGE AWARDS
  // ===========================================================================

  // --- MOTORTREND ---
  AWARD_MOTORTREND_COTY: {
    id: "AWARD_MOTORTREND_COTY",
    label: "MotorTrend Car of the Year",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_motortrend_coty.png",
      alt_text: "MotorTrend Golden Calipers Trophy",
    },
    logic_config: {
      region: ["US"],
      group: "MOTORTREND",
      rank: 100,
    },
  },
  AWARD_MOTORTREND_SUV: {
    id: "AWARD_MOTORTREND_SUV",
    label: "MotorTrend SUV of the Year",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_motortrend_suv.png",
      alt_text: "MotorTrend SUV of the Year Award",
    },
    logic_config: {
      region: ["US"],
      group: "MOTORTREND",
      rank: 100,
    },
  },

  // --- CAR AND DRIVER ---
  AWARD_CARANDDRIVER_10BEST: {
    id: "AWARD_CARANDDRIVER_10BEST",
    label: "Car and Driver 10Best",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_caranddriver_10best.png",
      alt_text: "Car and Driver 10Best Logo",
    },
    logic_config: {
      region: ["US"],
      group: "CARANDDRIVER",
      rank: 100,
    },
  },
  AWARD_CARANDDRIVER_EDITORS: {
    id: "AWARD_CARANDDRIVER_EDITORS",
    label: "Car and Driver Editors' Choice",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_caranddriver_editors.png",
      alt_text: "Car and Driver Editors' Choice Award",
    },
    logic_config: {
      region: ["US"],
      group: "CARANDDRIVER",
      rank: 90,
    },
  },

  // --- WARDS AUTO ---
  AWARD_WARDS_ENGINES: {
    id: "AWARD_WARDS_ENGINES",
    label: "Wards 10 Best Engines",
    category: "Performance",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_wards_10best_engines.png",
      alt_text: "Wards 10 Best Engines & Propulsion Systems",
    },
    logic_config: {
      region: ["US", "GLOBAL"],
      group: "WARDS_ENGINE",
      rank: 100,
    },
  },
  AWARD_WARDS_INTERIORS: {
    id: "AWARD_WARDS_INTERIORS",
    label: "Wards 10 Best Interiors",
    category: "Luxury",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_wards_10best_interiors.png",
      alt_text: "Wards 10 Best Interiors & UX",
    },
    logic_config: {
      region: ["US", "GLOBAL"],
      group: "WARDS_INTERIOR",
      rank: 100,
    },
  },

  // --- GLOBAL PRESTIGE ---
  AWARD_RED_DOT: {
    id: "AWARD_RED_DOT",
    label: "Red Dot Design Award",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_red_dot.png",
      alt_text: "Red Dot Design Award Winner",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "DESIGN_AWARD",
      rank: 100,
    },
  },
  AWARD_WCOTY: {
    id: "AWARD_WCOTY",
    label: "World Car of the Year",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_wcoty.png",
      alt_text: "World Car of the Year Trophy",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "WCOTY",
      rank: 100,
    },
  },

  // --- KELLEY BLUE BOOK (KBB) ---
  AWARD_KBB_BEST_BUY: {
    id: "AWARD_KBB_BEST_BUY",
    label: "KBB Best Buy Award",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_kbb_best_buy.png",
      alt_text: "Kelley Blue Book Best Buy Seal",
    },
    logic_config: {
      region: ["US"],
      group: "KBB_AWARD",
      rank: 100,
    },
  },
  AWARD_KBB_RESALE: {
    id: "AWARD_KBB_RESALE",
    label: "KBB Best Resale Value",
    category: "Value",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_kbb_resale.png",
      alt_text: "Kelley Blue Book Best Resale Value Award",
    },
    logic_config: {
      region: ["US"],
      group: "KBB_AWARD",
      rank: 90,
    },
  },

  // --- UK / EUROPE ---
  AWARD_WHATCAR_COTY: {
    id: "AWARD_WHATCAR_COTY",
    label: "What Car? Car of the Year",
    category: "Award",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "award_whatcar_coty.png",
      alt_text: "What Car? Car of the Year Winner",
    },
    logic_config: {
      region: ["UK", "EU"],
      group: "WHATCAR",
      rank: 100,
    },
  },

  // ===========================================================================
  // 💎 CATEGORY 5: RELIABILITY & HISTORY (USED CAR SPECIFIC)
  // ===========================================================================

  // --- J.D. POWER ---
  TRUST_JDPOWER_QUALITY: {
    id: "TRUST_JDPOWER_QUALITY",
    label: "J.D. Power Initial Quality",
    category: "Reliability",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "trust_jdpower_quality.png",
      alt_text: "J.D. Power Initial Quality Study Winner",
    },
    logic_config: {
      region: ["US"],
      group: "JDPOWER_IQS",
      rank: 100,
    },
  },
  TRUST_JDPOWER_DEPENDABILITY: {
    id: "TRUST_JDPOWER_DEPENDABILITY",
    label: "J.D. Power Dependability",
    category: "Reliability",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "trust_jdpower_dependability.png",
      alt_text: "J.D. Power Vehicle Dependability Study Winner",
    },
    logic_config: {
      region: ["US"],
      group: "JDPOWER_VDS",
      rank: 100,
    },
  },

  // --- CONSUMER REPORTS ---
  TRUST_CR_RECOMMENDED: {
    id: "TRUST_CR_RECOMMENDED",
    label: "Consumer Reports Recommended",
    category: "Reliability",
    retrieval_method: "SEARCH",
    visuals: {
      image_path: "trust_cr_recommended.png",
      alt_text: "Consumer Reports Recommended Checkmark",
    },
    logic_config: {
      region: ["US"],
      group: "CONSUMER_REPORTS",
      rank: 100,
    },
  },

  // --- CARFAX (Vehicle History) ---
  TRUST_CARFAX_1OWNER: {
    id: "TRUST_CARFAX_1OWNER",
    label: "CARFAX 1-Owner",
    category: "Reliability",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "trust_carfax_1owner.png",
      alt_text: "CARFAX 1-Owner Vehicle",
    },
    logic_config: {
      region: ["US", "CA", "EU"],
      group: "OWNERSHIP_HISTORY",
      rank: 100,
    },
  },
  TRUST_CARFAX_CLEAN: {
    id: "TRUST_CARFAX_CLEAN",
    label: "CARFAX Accident Free",
    category: "Reliability",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "trust_carfax_clean.png",
      alt_text: "CARFAX No Reported Accidents",
    },
    logic_config: {
      region: ["US", "CA", "EU"],
      group: "ACCIDENT_HISTORY",
      rank: 100,
    },
  },

  // --- AUTOCHECK ---
  TRUST_AUTOCHECK_BUYBACK: {
    id: "TRUST_AUTOCHECK_BUYBACK",
    label: "AutoCheck Buyback Protection",
    category: "Reliability",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "trust_autocheck_buyback.png",
      alt_text: "AutoCheck Buyback Protection Qualified",
    },
    logic_config: {
      region: ["US"],
      group: "VEHICLE_PROTECTION",
      rank: 100,
    },
  },

  // --- GERMAN/EU INSPECTIONS ---
  TRUST_TUEV_SUED: {
    id: "TRUST_TUEV_SUED",
    label: "TÜV SÜD Geprüft",
    category: "Reliability",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "trust_tuev_sued.png",
      alt_text: "TÜV SÜD Inspected & Certified",
    },
    logic_config: {
      region: ["DE", "EU"],
      group: "INSPECTION_DE",
      rank: 100,
    },
  },
  TRUST_DEKRA: {
    id: "TRUST_DEKRA",
    label: "DEKRA Seal of Quality",
    category: "Reliability",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "trust_dekra.png",
      alt_text: "DEKRA Used Car Seal",
    },
    logic_config: {
      region: ["DE", "EU"],
      group: "INSPECTION_EU",
      rank: 100,
    },
  },
  // ===========================================================================
  // 📱 CATEGORY 6: TECHNOLOGY ECOSYSTEMS
  // ===========================================================================

  // --- SMARTPHONE INTEGRATION ---
  TECH_APPLE_CARPLAY: {
    id: "TECH_APPLE_CARPLAY",
    label: "Apple CarPlay",
    category: "Technology",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "tech_apple_carplay.png",
      alt_text: "Apple CarPlay Integration",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "FEATURE_IOS",
      rank: 100,
    },
  },
  TECH_ANDROID_AUTO: {
    id: "TECH_ANDROID_AUTO",
    label: "Android Auto",
    category: "Technology",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "tech_android_auto.png",
      alt_text: "Android Auto Integration",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "FEATURE_ANDROID",
      rank: 100,
    },
  },

  // --- CONNECTIVITY ---
  TECH_BLUETOOTH: {
    id: "TECH_BLUETOOTH",
    label: "Bluetooth Connectivity",
    category: "Technology",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "tech_bluetooth.png",
      alt_text: "Bluetooth Wireless Technology",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "FEATURE_BT",
      rank: 100,
    },
  },

  // --- AUDIO & IMMERSION ---
  TECH_DOLBY_ATMOS: {
    id: "TECH_DOLBY_ATMOS",
    label: "Dolby Atmos Sound",
    category: "Luxury",
    retrieval_method: "LOGIC",
    visuals: {
      image_path: "tech_dolby_atmos.png",
      alt_text: "Dolby Atmos Surround Sound",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "AUDIO_TECH",
      rank: 100,
    },
  },
  TECH_PREMIUM_AUDIO: {
    id: "TECH_PREMIUM_AUDIO",
    label: "Premium Audio System",
    category: "Luxury",
    retrieval_method: "LOGIC",
    visuals: {
      // Logic Engine will replace [brand] dynamically if detected (e.g. tech_audio_bose.png)
      // Otherwise falls back to generic premium icon
      image_path: "tech_audio_generic.png",
      alt_text: "Premium Branded Audio System",
    },
    logic_config: {
      region: ["GLOBAL"],
      group: "AUDIO_BRAND",
      rank: 100,
    },
  },
};

module.exports = { BADGE_REGISTRY };
