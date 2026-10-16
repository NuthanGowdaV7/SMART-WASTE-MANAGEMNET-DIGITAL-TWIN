/**
 * EcoTwin AI - Enterprise Waste Intelligence & Digital Twin Data Store
 * Dayananda Sagar University - Campus Operations Platform
 * CODE CLASH 2.0 (Problem Statement 01)
 */

const ECO_DATA = {
  campusInfo: {
    systemName: "EcoTwin Enterprise Platform",
    institution: "Dayananda Sagar University",
    campus: "Main Innovation Campus, Bengaluru",
    coordinates: "12.8942° N, 77.5684° E",
    networkProtocol: "LoRaWAN EU868 & Private 5G Mesh",
    activeNodes: 10,
    dailyWasteTargetKg: 650,
    carbonOffsetRatePerKgRecycled: 1.82 // kg CO2e per kg
  },

  // Smart Bins across Campus
  bins: [
    {
      id: "BIN-01",
      name: "Food Court North - Station 1",
      zone: "Cafeteria Complex",
      category: "Organic / Wet Food",
      colorTag: "#059669", // Fresh emerald
      fillLevel: 88,
      capacityKg: 80,
      currentWeightKg: 70.4,
      temperatureC: 31.2,
      gasMethanePpm: 142,
      batteryVoltage: 3.92,
      batteryPct: 94,
      loraRssiDbm: -72,
      status: "CRITICAL",
      lastEmptied: "11:20 AM",
      coords: { x: -35, y: 1.2, z: -25 },
      segregationAccuracy: 94.2,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-01"
    },
    {
      id: "BIN-02",
      name: "Food Court South - Recyclables",
      zone: "Cafeteria Complex",
      category: "Dry Recyclable Packaging",
      colorTag: "#2563EB", // Corporate Blue
      fillLevel: 82,
      capacityKg: 60,
      currentWeightKg: 49.2,
      temperatureC: 28.5,
      gasMethanePpm: 24,
      batteryVoltage: 3.86,
      batteryPct: 91,
      loraRssiDbm: -76,
      status: "WARNING",
      lastEmptied: "11:45 AM",
      coords: { x: -30, y: 1.2, z: -28 },
      segregationAccuracy: 89.0,
      contaminationDetected: true,
      hardwareUid: "DSU-IOT-02"
    },
    {
      id: "BIN-03",
      name: "Engineering Block A - Ground Foyer",
      zone: "Academic Block A",
      category: "Paper & Stationery",
      colorTag: "#4F46E5", // Indigo
      fillLevel: 45,
      capacityKg: 50,
      currentWeightKg: 22.5,
      temperatureC: 26.1,
      gasMethanePpm: 12,
      batteryVoltage: 3.82,
      batteryPct: 88,
      loraRssiDbm: -68,
      status: "NORMAL",
      lastEmptied: "01:15 PM",
      coords: { x: 30, y: 1.2, z: -35 },
      segregationAccuracy: 96.5,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-03"
    },
    {
      id: "BIN-04",
      name: "CS & AI Research Lab - E-Waste Hub",
      zone: "Tech Tower",
      category: "Electronic Waste Special",
      colorTag: "#7C3AED", // Violet
      fillLevel: 64,
      capacityKg: 40,
      currentWeightKg: 25.6,
      temperatureC: 24.8,
      gasMethanePpm: 8,
      batteryVoltage: 4.10,
      batteryPct: 98,
      loraRssiDbm: -62,
      status: "NORMAL",
      lastEmptied: "Yesterday",
      coords: { x: 45, y: 1.2, z: 15 },
      segregationAccuracy: 99.1,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-04"
    },
    {
      id: "BIN-05",
      name: "Central Library Quadrangle",
      zone: "Central Library",
      category: "Paper & Cardboard",
      colorTag: "#D97706", // Amber
      fillLevel: 32,
      capacityKg: 70,
      currentWeightKg: 22.4,
      temperatureC: 25.4,
      gasMethanePpm: 10,
      batteryVoltage: 3.79,
      batteryPct: 85,
      loraRssiDbm: -81,
      status: "NORMAL",
      lastEmptied: "01:30 PM",
      coords: { x: 0, y: 1.2, z: -10 },
      segregationAccuracy: 98.0,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-05"
    },
    {
      id: "BIN-06",
      name: "Sports Complex & Gymnasium",
      zone: "Sports Arena",
      category: "Beverage Bottles & Cans",
      colorTag: "#EA580C", // Orange
      fillLevel: 92,
      capacityKg: 60,
      currentWeightKg: 55.2,
      temperatureC: 29.8,
      gasMethanePpm: 35,
      batteryVoltage: 3.74,
      batteryPct: 79,
      loraRssiDbm: -84,
      status: "CRITICAL",
      lastEmptied: "10:15 AM",
      coords: { x: -40, y: 1.2, z: 35 },
      segregationAccuracy: 91.5,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-06"
    },
    {
      id: "BIN-07",
      name: "Admin Block Plaza",
      zone: "Administration",
      category: "Mixed Dry Waste",
      colorTag: "#2563EB",
      fillLevel: 28,
      capacityKg: 50,
      currentWeightKg: 14.0,
      temperatureC: 26.0,
      gasMethanePpm: 9,
      batteryVoltage: 4.02,
      batteryPct: 96,
      loraRssiDbm: -65,
      status: "NORMAL",
      lastEmptied: "12:50 PM",
      coords: { x: 10, y: 1.2, z: 30 },
      segregationAccuracy: 97.2,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-07"
    },
    {
      id: "BIN-08",
      name: "Biotech & Chemistry Wing",
      zone: "Science Labs",
      category: "Hazardous & Glassware",
      colorTag: "#DC2626", // Red
      fillLevel: 51,
      capacityKg: 40,
      currentWeightKg: 20.4,
      temperatureC: 23.5,
      gasMethanePpm: 15,
      batteryVoltage: 3.95,
      batteryPct: 93,
      loraRssiDbm: -70,
      status: "NORMAL",
      lastEmptied: "11:00 AM",
      coords: { x: -15, y: 1.2, z: 20 },
      segregationAccuracy: 98.8,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-08"
    },
    {
      id: "BIN-09",
      name: "Student Innovation Park",
      zone: "Innovation Hub",
      category: "Mixed Recyclables",
      colorTag: "#059669",
      fillLevel: 76,
      capacityKg: 55,
      currentWeightKg: 41.8,
      temperatureC: 27.2,
      gasMethanePpm: 18,
      batteryVoltage: 3.78,
      batteryPct: 82,
      loraRssiDbm: -78,
      status: "WARNING",
      lastEmptied: "12:10 PM",
      coords: { x: 35, y: 1.2, z: -10 },
      segregationAccuracy: 93.8,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-09"
    },
    {
      id: "BIN-10",
      name: "Campus Transit Bus Bay",
      zone: "Transit Hub",
      category: "Plastics & Packaging",
      colorTag: "#2563EB",
      fillLevel: 85,
      capacityKg: 75,
      currentWeightKg: 63.7,
      temperatureC: 30.5,
      gasMethanePpm: 29,
      batteryVoltage: 3.85,
      batteryPct: 89,
      loraRssiDbm: -88,
      status: "CRITICAL",
      lastEmptied: "10:45 AM",
      coords: { x: -10, y: 1.2, z: -45 },
      segregationAccuracy: 88.4,
      contaminationDetected: false,
      hardwareUid: "DSU-IOT-10"
    }
  ],

  // 3D Campus Buildings - Architectural Clean Slate
  buildings: [
    { name: "Engineering Tech Tower", x: 45, z: 15, width: 22, depth: 18, height: 28, color: 0x1E293B, accentColor: 0x3B82F6, tag: "TECH-01" },
    { name: "Academic Block A", x: 30, z: -35, width: 26, depth: 20, height: 22, color: 0x1E293B, accentColor: 0x2563EB, tag: "ACAD-01" },
    { name: "Student Food Court", x: -35, z: -25, width: 24, depth: 22, height: 14, color: 0x1E293B, accentColor: 0x10B981, tag: "CAFE-01" },
    { name: "Central Library Complex", x: 0, z: -10, width: 28, depth: 24, height: 18, color: 0x1E293B, accentColor: 0xF59E0B, tag: "LIB-01" },
    { name: "Indoor Sports Arena", x: -40, z: 35, width: 30, depth: 25, height: 16, color: 0x1E293B, accentColor: 0xEA580C, tag: "SPORT-01" },
    { name: "Administration & Auditorium", x: 10, z: 30, width: 24, depth: 20, height: 20, color: 0x1E293B, accentColor: 0x6366F1, tag: "ADMIN-01" },
    { name: "Science & Chemistry Labs", x: -15, z: 20, width: 20, depth: 16, height: 16, color: 0x1E293B, accentColor: 0xEF4444, tag: "SCI-01" },
    { name: "Innovation Incubator", x: 35, z: -10, width: 18, depth: 16, height: 18, color: 0x1E293B, accentColor: 0x059669, tag: "INNO-01" }
  ],

  roadNodes: [
    { x: -50, z: -50 }, { x: -10, z: -50 }, { x: 25, z: -50 }, { x: 50, z: -50 },
    { x: 50, z: 0 }, { x: 50, z: 45 }, { x: 0, z: 45 }, { x: -45, z: 45 },
    { x: -45, z: 0 }, { x: 0, z: 0 }, { x: -25, z: -20 }, { x: 25, z: -20 },
    { x: 20, z: 25 }, { x: -20, z: 25 }
  ],

  // EXPANDED MULTI-CLASS WASTE ONTOLOGY (MAPPING 120+ REAL-WORLD LABELS)
  wasteOntology: {
    // 1. Plastics & Polymers
    "bottle": { category: "Recyclable Plastic", subType: "PET #1 Polymer", bin: "Blue Bin (Recyclables)", resinCode: "1", carbonAvoided: 0.28, risk: "Low", compostable: false, guide: "Empty all liquids, compress bottle to reduce volume, replace plastic cap, and deposit in Blue Bin." },
    "water bottle": { category: "Recyclable Plastic", subType: "Clear PET #1", bin: "Blue Bin (Recyclables)", resinCode: "1", carbonAvoided: 0.28, risk: "Low", compostable: false, guide: "Crush bottle to minimize bin volume. 100% recyclable into new packaging." },
    "pop bottle": { category: "Recyclable Plastic", subType: "PET #1 Beverage Bottle", bin: "Blue Bin (Recyclables)", resinCode: "1", carbonAvoided: 0.32, risk: "Low", compostable: false, guide: "Rinse away sugary residue. Deposit in Blue Bin." },
    "plastic cup": { category: "Recyclable Plastic", subType: "Polypropylene (PP #5)", bin: "Blue Bin (Recyclables)", resinCode: "5", carbonAvoided: 0.18, risk: "Medium (Ensure unsoiled)", compostable: false, guide: "Rinse before disposal. Greasy or milky cups contaminate the dry recycling stream." },
    "cup": { category: "Beverage Cup", subType: "Paper/Polymer Composite", bin: "Blue Bin (If Dry)", resinCode: "PAP #81", carbonAvoided: 0.22, risk: "Medium (Check liquid)", compostable: false, guide: "Empty liquids completely. Wipe clean before placing in dry stream." },
    "plastic bag": { category: "Plastic Film", subType: "LDPE #4 Film", bin: "Yellow Bag Drop-off", resinCode: "4", carbonAvoided: 0.12, risk: "Medium (Tangling hazard)", compostable: false, guide: "Bundle clean plastic bags together. Do not mix into single-stream recyclables." },
    "wrapper": { category: "Multi-layer Plastic", subType: "Metalized BoPP / Foil", bin: "Grey Bin (Refuse/Fuel)", resinCode: "7", carbonAvoided: 0.05, risk: "High", compostable: false, guide: "Multi-layer chip/snack packaging cannot be recycled mechanically. Diverted for cement kiln co-processing." },
    "packet": { category: "Flexible Packaging", subType: "Multi-layer Film", bin: "Grey Bin (Non-recyclable)", resinCode: "7", carbonAvoided: 0.06, risk: "Medium", compostable: false, guide: "Snack/biscuit packet. Deposit in General Refuse Bin." },

    // 2. Organic / Wet Waste
    "banana": { category: "Organic / Wet Waste", subType: "Fruit Biomass", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.45, risk: "None", compostable: true, guide: "100% compostable. Diverted to on-campus aerobic compost digestor." },
    "apple": { category: "Organic / Wet Waste", subType: "Fruit Biomass", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.42, risk: "None", compostable: true, guide: "Organic fruit scrap. Safe for rapid composting." },
    "orange": { category: "Organic / Wet Waste", subType: "Citrus Peel", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.38, risk: "None", compostable: true, guide: "Deposit in Green Bin. High-nitrogen organic material." },
    "sandwich": { category: "Organic / Wet Waste", subType: "Cooked Food Scrap", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.52, risk: "None", compostable: true, guide: "Separate plastic wrap or napkins. Deposit food portion in Green Bin." },
    "pizza": { category: "Organic / Wet Waste", subType: "Food Leftovers", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.60, risk: "None", compostable: true, guide: "Food scraps go to Green Bin. Greasy pizza cardboard boxes belong in organic/refuse." },
    "broccoli": { category: "Organic / Wet Waste", subType: "Vegetable Biomass", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.35, risk: "None", compostable: true, guide: "100% biodegradable. Direct to Green Bin." },
    "carrot": { category: "Organic / Wet Waste", subType: "Vegetable Biomass", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.30, risk: "None", compostable: true, guide: "Organic vegetable scrap. Green bin." },
    "cake": { category: "Organic / Wet Waste", subType: "Bakery Scrap", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.40, risk: "None", compostable: true, guide: "Food waste. Ensure candles or plastic bases are removed." },
    "donut": { category: "Organic / Wet Waste", subType: "Bakery Scrap", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.38, risk: "None", compostable: true, guide: "Direct to Green Organic Bin." },
    "hot dog": { category: "Organic / Wet Waste", subType: "Cooked Food", bin: "Green Bin (Compost)", resinCode: "ORGANIC", carbonAvoided: 0.48, risk: "None", compostable: true, guide: "Organic wet waste. Divert to compost." },

    // 3. Metals & Cans
    "can": { category: "Recyclable Metal", subType: "Aluminum 3004 Alloy", bin: "Blue Bin (Metals & Plastics)", resinCode: "ALU #41", carbonAvoided: 0.82, risk: "Low", compostable: false, guide: "Infinitely recyclable aluminum. Saves 95% energy vs. virgin mining. Pour out liquids and deposit in Blue Bin." },
    "tin": { category: "Recyclable Metal", subType: "Tinplate Steel", bin: "Blue Bin (Metals)", resinCode: "FE #40", carbonAvoided: 0.74, risk: "Low", compostable: false, guide: "Rinse away food residue. Deposit in Blue Bin for magnetic scrap recovery." },
    "fork": { category: "Metal / Utensil", subType: "Stainless Steel / PP", bin: "Blue Bin (Recyclables)", resinCode: "MET", carbonAvoided: 0.40, risk: "Low", compostable: false, guide: "Wipe clean before disposing." },
    "spoon": { category: "Metal / Utensil", subType: "Stainless Steel / PP", bin: "Blue Bin (Recyclables)", resinCode: "MET", carbonAvoided: 0.40, risk: "Low", compostable: false, guide: "Wipe clean before disposing." },
    "knife": { category: "Cutlery / Metal", subType: "Stainless Steel", bin: "Blue Bin (Safely wrapped)", resinCode: "MET", carbonAvoided: 0.35, risk: "Medium (Puncture Risk)", compostable: false, guide: "Wrap cutting edge safely before depositing." },

    // 4. Electronic Waste (E-Waste)
    "cell phone": { category: "E-Waste / Toxic", subType: "Lithium-Ion & PCB Appliance", bin: "Purple Bin (E-Waste Special)", resinCode: "E-WASTE", carbonAvoided: 4.80, risk: "CRITICAL (Heavy Metals & Fire Hazard)", compostable: false, guide: "CRITICAL HAZARD: Do not throw into general bins. Contains Lithium, Cobalt, and Gold. Hand to authorized campus recycler." },
    "cellular telephone": { category: "E-Waste / Toxic", subType: "Mobile Smartphone", bin: "Purple Bin (E-Waste Special)", resinCode: "E-WASTE", carbonAvoided: 4.80, risk: "CRITICAL", compostable: false, guide: "Deposit in locked E-Waste vault. High precious metal yield." },
    "laptop": { category: "E-Waste / Toxic", subType: "Computer Electronics", bin: "Purple Bin (E-Waste Special)", resinCode: "E-WASTE", carbonAvoided: 18.50, risk: "CRITICAL", compostable: false, guide: "Authorized electronic dismantling required. Recoverable circuit boards and displays." },
    "mouse": { category: "E-Waste", subType: "Computer Peripheral (ABS Plastic & PCB)", bin: "Purple Bin (E-Waste Special)", resinCode: "E-WASTE", carbonAvoided: 0.90, risk: "High", compostable: false, guide: "Electronic scrap. High yield of recyclable ABS casing." },
    "keyboard": { category: "E-Waste", subType: "Membrane / Mechanical Keyboard", bin: "Purple Bin (E-Waste Special)", resinCode: "E-WASTE", carbonAvoided: 1.40, risk: "High", compostable: false, guide: "Deposit in dedicated electronic waste bin." },
    "remote": { category: "E-Waste", subType: "Infrared Controller", bin: "Purple Bin (E-Waste Special)", resinCode: "E-WASTE", carbonAvoided: 0.65, risk: "High", compostable: false, guide: "Remove alkaline batteries first. Deposit unit in E-Waste." },
    "battery": { category: "Hazardous Chemical Waste", subType: "Lithium/Alkaline Cell", bin: "Red Hazard Tube (Battery Only)", resinCode: "HAZARDOUS", carbonAvoided: 2.10, risk: "SEVERE (Fire & Corrosive Acid)", compostable: false, guide: "FIRE HAZARD: Never dispose in general waste. Tape both terminals and deposit in Battery Tube." },

    // 5. Paper, Cardboard & Stationery
    "book": { category: "Paper & Pulp", subType: "Cellulose Paperboard", bin: "Blue Bin (Clean Dry Paper)", resinCode: "PAP #20", carbonAvoided: 0.65, risk: "Low", compostable: true, guide: "Keep clean and dry. Remove any plastic hardcovers before pulping." },
    "notebook": { category: "Paper & Pulp", subType: "Bound Stationery", bin: "Blue Bin (Clean Dry Paper)", resinCode: "PAP #20", carbonAvoided: 0.60, risk: "Low", compostable: true, guide: "Remove metal wire bindings if possible. 100% recyclable paper." },
    "envelope": { category: "Paper & Pulp", subType: "Office Paper", bin: "Blue Bin (Paper)", resinCode: "PAP #22", carbonAvoided: 0.20, risk: "Low", compostable: true, guide: "Clean dry paper stream." },
    "cardboard": { category: "Paper & Pulp", subType: "Corrugated Boxboard", bin: "Blue Bin (Cardboard)", resinCode: "PAP #21", carbonAvoided: 0.78, risk: "Low", compostable: true, guide: "Flatten box to save bin volume. Strip packaging adhesive tape." },
    "carton": { category: "Composite / TetraPak", subType: "Aseptic Liquid Carton", bin: "Blue Bin (Rinsed)", resinCode: "C/PAP #84", carbonAvoided: 0.35, risk: "Medium (Ensure rinsed)", compostable: false, guide: "Rinse milk/juice carton thoroughly. Special hydropulping separates paper fiber from aluminum barrier." },
    "scissors": { category: "Stationery / Metal", subType: "Steel / Plastic", bin: "Blue Bin (Metals)", resinCode: "MET", carbonAvoided: 0.45, risk: "Medium", compostable: false, guide: "Deposit in dry recyclable metal scrap." },
    "toothbrush": { category: "Composite Plastic", subType: "PP + Nylon Bristles", bin: "Grey Bin (General Refuse)", resinCode: "7", carbonAvoided: 0.08, risk: "Low", compostable: false, guide: "Multi-material polymer cannot be sorted mechanically. General refuse." }
  },

  // Instant Test Presets
  cvSamples: [
    {
      id: "sample_plastic",
      name: "PET Mineral Water Bottle",
      imagePath: "assets/plastic_bottle.jpg",
      detectedClass: "water bottle",
      category: "Recyclable Plastic",
      subType: "Polyethylene Terephthalate (PET #1)",
      confidence: 98.4,
      targetBin: "Blue Bin (Dry Recyclables)",
      resinCode: "SPI #1 (PET)",
      carbonAvoidedKg: 0.28,
      contaminationRisk: "Low (Clean)",
      boundingBox: { x: 12, y: 22, width: 76, height: 56 },
      segregationGuide: "Empty residual fluid, compress container to reduce volume, replace cap, and place into Blue Bin."
    },
    {
      id: "sample_organic",
      name: "Fruit Food Waste (Apple & Banana)",
      imagePath: "assets/organic_waste.jpg",
      detectedClass: "banana",
      category: "Organic / Wet Waste",
      subType: "Compostable Biomass",
      confidence: 97.6,
      targetBin: "Green Bin (Organic Compost)",
      resinCode: "BIOMASS",
      carbonAvoidedKg: 0.45,
      contaminationRisk: "None",
      boundingBox: { x: 15, y: 18, width: 72, height: 64 },
      segregationGuide: "100% biodegradable. Feed directly into the on-campus Bio-Digester or Green Organic Bin."
    },
    {
      id: "sample_ewaste",
      name: "Electronic Circuit Board (PCB)",
      imagePath: "assets/ewaste_board.jpg",
      detectedClass: "cellular telephone",
      category: "E-Waste / Toxic Scrap",
      subType: "Electronic Waste (FR-4 & Solder)",
      confidence: 99.2,
      targetBin: "Purple Bin (E-Waste Special)",
      resinCode: "E-WASTE",
      carbonAvoidedKg: 1.75,
      contaminationRisk: "CRITICAL (Heavy Metals / Lead)",
      boundingBox: { x: 10, y: 14, width: 80, height: 72 },
      segregationGuide: "Hazardous electronic material. Never dispose in landfill. Routed to certified metallurgical recovery."
    },
    {
      id: "sample_metal",
      name: "Crushed Beverage Can",
      imagePath: "assets/metal_can.jpg",
      detectedClass: "can",
      category: "Recyclable Metal",
      subType: "Aluminum 3004 Alloy",
      confidence: 98.8,
      targetBin: "Blue Bin (Metals & Plastics)",
      resinCode: "ALU #41",
      carbonAvoidedKg: 0.82,
      contaminationRisk: "Low",
      boundingBox: { x: 14, y: 20, width: 72, height: 60 },
      segregationGuide: "Infinitely recyclable alloy. Drain liquid completely and deposit in Blue Bin."
    }
  ]
};
