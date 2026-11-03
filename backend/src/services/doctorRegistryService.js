const DoctorRegistry = require("../models/DoctorRegistry");
const doctorRegistryData = require("../data/doctorRegistryData");

/**
 * Ensures the 100 pre-authorized doctors exist in MongoDB.
 * Uses bulk upsert so it never duplicates records.
 */
const ensureDoctorRegistrySeeded = async () => {
  try {
    const count = await DoctorRegistry.countDocuments();
    if (count < 100) {
      console.log(`[DoctorRegistry] Current count is ${count}/100. Seeding pre-authorized doctors...`);
      const bulkOps = doctorRegistryData.map((doc) => ({
        updateOne: {
          filter: { doctorId: doc.doctorId },
          update: { $setOnInsert: doc },
          upsert: true,
        },
      }));

      await DoctorRegistry.bulkWrite(bulkOps);
      console.log(`[DoctorRegistry] Successfully synced 100 pre-authorized doctors.`);
    }
  } catch (error) {
    console.error("[DoctorRegistry] Error during seeding:", error.message);
  }
};

module.exports = {
  ensureDoctorRegistrySeeded,
};
