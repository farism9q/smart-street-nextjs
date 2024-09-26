import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    license_plate_number: { type: String, required: true },
    violation_type: { type: String, required: true },
    vehicle_type: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    street_name: { type: String, required: true },
    zip_code: { type: String, required: true },
  },
  // { collection: "Violations-1" }
  { collection: "violations" }
);

export default mongoose.models.violations ||
  mongoose.model("violations", violationSchema);
// export default mongoose.models["Violations-1"] ||
//   mongoose.model("Violations-1", violationSchema);
