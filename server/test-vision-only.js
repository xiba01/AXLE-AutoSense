const { scanHotspots } = require("./src/services/media/visionScanner.js");

// Test with a clear side-view car image
const testImageUrl = "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800";

const testHotspots = [
  { id: "hs_wheel_front", label: "Front Wheel" },
  { id: "hs_wheel_rear", label: "Rear Wheel" },
  { id: "hs_mirror", label: "Side Mirror" },
  { id: "hs_door", label: "Door Handle" },
  { id: "hs_window", label: "Window" },
];

async function run() {
  console.log("🔍 Testing Vision Scanner (Side View)...");
  console.log(`📷 Image: ${testImageUrl}`);
  console.log(`🎯 Looking for: ${testHotspots.map(h => h.label).join(", ")}\n`);

  const results = await scanHotspots(testImageUrl, testHotspots);

  console.log("\n------ RESULTS ------");
  for (const hs of testHotspots) {
    const coords = results[hs.id];
    if (coords) {
      console.log(`✅ ${hs.label}: x=${coords.x}, y=${coords.y}`);
    } else {
      console.log(`❌ ${hs.label}: NOT FOUND`);
    }
  }
  
  // Check for any extra IDs returned
  const expectedIds = testHotspots.map(h => h.id);
  const extraIds = Object.keys(results).filter(id => !expectedIds.includes(id));
  if (extraIds.length > 0) {
    console.log(`\n⚠️ Extra/unexpected IDs returned: ${extraIds.join(", ")}`);
  }
  
  const found = testHotspots.filter(h => results[h.id]).length;
  console.log(`\n📊 Found ${found}/${testHotspots.length} hotspots`);
}

run();
