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
  { collection: "Violations_detected" }
);

export default mongoose.models.Violations_detected ||
  mongoose.model("Violations_detected", violationSchema);
